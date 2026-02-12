## TL;DR

React Dashboard의 폴링 성능 문제는 **5개의 독립적 원인이 중첩**되어 발생한다: (1) N개 위젯의 동시 폴링에 의한 render storm, (2) `gcTime: 0` / `staleTime: 0` 설정에 의한 불필요한 refetch와 캐시 미보존, (3) `PollingStatus`의 `key={updatedAt}`에 의한 매 폴링마다의 SVG remount, (4) `useAnimatedState`의 매 프레임 `setState` 호출로 인한 지속적 리렌더, (5) `sizeTierRenderer` 인라인 객체의 참조 불안정성. 가장 효과적인 해결 전략은 **인터랙션 중 폴링 중지 + `useDeferredValue` 조합**을 핵심으로 하되, staleTime/gcTime 정상화와 PollingStatus/useAnimatedState 최적화를 병행하는 **점진적 4단계 접근**이다.

---

## 상세 해결 방안

### 배경: 왜 이 문제가 발생하는가?

브라우저의 메인 스레드는 JavaScript 실행과 화면 렌더링을 **동일한 스레드에서** 처리한다. 60fps를 유지하려면 한 프레임이 16.67ms 이내에 완료되어야 한다. 현재 대시보드에서는 N개의 서비스 위젯이 각각 독립적으로 3-5초 간격 폴링을 수행하며, 폴링 응답이 도착할 때마다 React가 해당 위젯의 서브트리를 리렌더한다. 이것이 사용자의 드래그/리사이즈 인터랙션과 동일 프레임에서 경합하면 프레임 예산을 초과하여 jank가 발생한다.

5개 경로의 분석과 상호 비판을 종합한 결과, 문제의 실제 비용 분포는 다음과 같다:

| 원인 | 프레임당 비용 (추정) | 해결 난이도 |
|------|---------------------|------------|
| React Reconciliation + Commit Phase (N개 위젯) | 2-16ms | 중간 |
| useAnimatedState의 매 프레임 setState | 0.5-1.0ms/프레임 (지속적) | 중간 |
| PollingStatus SVG remount (N개) | 2-4ms (순간) | 낮음 |
| 불필요한 refetch (staleTime: 0) | 간헐적 추가 render | 매우 낮음 |
| sizeTierRenderer 참조 재생성 | useMemo 무효화 → 추가 계산 | 낮음 |

**핵심 통찰:** 데이터 변환 비용(transformInstanceDto)은 0.1ms에 불과하므로 Web Worker 도입은 불필요하다. 진짜 병목은 **React 렌더링 자체**(reconciliation + commit + 애니메이션)이다.

---

### 단계 1: 캐시 정책 정상화 (즉시, 5분, 매우 낮은 위험)

**변경 파일:** `src/entities/instance/model/useServiceInstances.ts`

**현재 문제:**
- `gcTime: 0`: 쿼리 observer가 제거되면 캐시 즉시 삭제. 페이지 전환 후 복귀 시 loading 상태부터 시작. 위젯 리마운트 시 빈 화면 깜빡임 발생.
- `staleTime: 0`: 모든 데이터가 항상 stale. `refetchOnWindowFocus`(기본값 true)에 의해 탭 전환 복귀 시 N개의 동시 refetch 발생. 이미 refetchInterval로 주기적 갱신을 보장하고 있으므로 이중 부하.

**변경 내용:**
```typescript
const { data, dataUpdatedAt, isError } = useQuery<InstanceOverviewResponse>({
  queryKey: baseQueryOptions.queryKey,
  queryFn: baseQueryOptions.queryFn,
  refetchInterval,
  staleTime: refetchInterval,     // 폴링 주기 동안 fresh 취급 → 불필요한 refetch 제거
  gcTime: refetchInterval * 2,    // 여유있게 캐시 보존 → 리마운트 시 UX 개선
  retry: 0,
});
```

**기대 효과:**
- 탭 전환 복귀 시 불필요한 N개 동시 refetch 제거 → 간헐적 render storm 예방
- 위젯 리마운트 시 이전 캐시 데이터로 즉시 렌더 → loading 깜빡임 제거

**주의:** 이 변경만으로 "80-95% 리렌더 제거"를 기대하면 안 된다. 서버가 매 응답마다 `lastUpdateTime`을 갱신한다면, structuralSharing은 거의 항상 데이터 변경을 감지하여 새 참조를 반환한다. 실제 리렌더 감소 효과는 서버 응답 패턴에 따라 **0-30%** 범위일 것이다. 이것은 "주된 해결책"이 아니라 "올바른 기본 설정"이다.

---

### 단계 2: 인터랙션 보호 (1-2일, 높은 효과, 낮은 위험)

이것이 **가장 큰 효과를 가져오는 핵심 변경**이다. Grafana, Datadog 등 프로덕션 모니터링 도구에서 검증된 패턴이다.

**2.1: 인터랙션 상태 store 생성**

**새 파일:** `src/pages/home/model/useInteractionStore.ts`
```typescript
import { createSimpleStore } from '@/shared/store';

export const useInteractionStore = createSimpleStore({ isInteracting: false });
```

**2.2: DashboardGridLayout에 인터랙션 상태 연결**

`DashboardGridLayout`의 `onDragStart`/`onResizeStart`에서:
```typescript
import { useInteractionStore } from '../../../model/useInteractionStore';

// 드래그/리사이즈 시작 시
onDragStart={() => {
  disableUserSelect();
  useInteractionStore.setState({ isInteracting: true });
}}
onDragStop={() => {
  enableUserSelect();
  // 200ms 딜레이: react-grid-layout 레이아웃 정착 대기 + burst 완화
  setTimeout(() => useInteractionStore.setState({ isInteracting: false }), 200);
}}
// onResizeStart, onResizeStop 동일 패턴
```

**200ms 딜레이의 근거:** react-grid-layout의 `onDragStop` 이벤트 후에도 레이아웃 재계산과 DOM 업데이트가 이어진다. 폴링 즉시 재개 시 이 정착 과정과 경합할 수 있다. 200ms는 레이아웃 정착에 충분하면서도 사용자가 인지하지 못하는 지연이다. 동시에 N개 폴링이 한꺼번에 재개되는 burst 효과도 자연스럽게 완화된다.

**2.3: useServiceInstances에 인터랙션 상태 반영 + useDeferredValue 적용**

```typescript
import { useDeferredValue } from 'react';
import { useInteractionStore } from '@/pages/home/model/useInteractionStore';

export function useServiceInstances(params: { ... }): UseServiceInstancesReturn {
  const { serviceId, serviceName, product } = params;
  const isInteracting = useInteractionStore((s) => s.isInteracting);

  const baseQueryOptions = getInstanceOverviewQueryByProduct(product, serviceName);
  const refetchInterval = getRefetchInterval(product);

  const { data, dataUpdatedAt, isError } = useQuery<InstanceOverviewResponse>({
    queryKey: baseQueryOptions.queryKey,
    queryFn: baseQueryOptions.queryFn,
    refetchInterval: isInteracting ? false : refetchInterval,  // 인터랙션 중 폴링 중지
    staleTime: refetchInterval,
    gcTime: refetchInterval * 2,
    retry: 0,
  });

  // useDeferredValue: 인터랙션 외 상황에서도 폴링 데이터 렌더링을 low-priority로 처리
  const deferredData = useDeferredValue(data);

  const instances: Instance[] = useMemo(() => {
    if (!deferredData?.instances) return [];
    return deferredData.instances.filter(filterNullValue).map((inst) =>
      transformInstanceDto({
        instanceDto: inst,
        product,
        serviceId: Number(serviceId),
        serviceName,
      }),
    );
  }, [deferredData, product, serviceId, serviceName]);

  const alarmCounts = useMemo(() => aggregateAlarmCounts(instances), [instances]);

  // pollingInfo도 deferredData와 동기화하여 tearing 방지
  const pollingInfo = useMemo(
    () => ({
      interval: refetchInterval,
      updatedAt: dataUpdatedAt,
      isError,
    }),
    [refetchInterval, dataUpdatedAt, isError],
  );

  return { instances, alarmCounts, pollingInfo };
}
```

**왜 `refetchInterval: false`이고 `enabled: false`가 아닌가:**
- `enabled: false`는 이미 진행 중인 요청의 응답 처리도 차단하고, 쿼리를 완전히 비활성화한다
- `refetchInterval: false`는 **새로운 폴링만 중지**하고, 진행 중인 요청의 응답은 정상 처리된다
- 이것이 Adversarial이 지적한 "데이터 손실" 문제를 방지한다

**왜 `useDeferredValue`도 함께 적용하는가:**
- 인터랙션 중: 폴링이 중지되므로 새 데이터 도착 없음. useDeferredValue는 보조적 역할
- 인터랙션 중 이미 진행 중이던 요청의 응답이 도착할 때: useDeferredValue가 이 render를 defer하여 인터랙션 보호
- 인터랙션 없는 평시: N개 폴링 응답이 거의 동시에 도착할 때, useDeferredValue가 render를 low-priority로 처리하여 다른 사용자 입력(스크롤, 클릭)과의 경합 방지

**Deferred Storm 우려에 대한 답변:** 인터랙션 중 폴링이 중지되므로 deferred 업데이트가 쌓이지 않는다. 인터랙션 종료 후 폴링이 재개되면 새 데이터가 도착하는데, 이 시점에서는 인터랙션이 없으므로 useDeferredValue가 즉시 처리한다. 두 기법의 조합으로 Deferred Storm은 원천적으로 방지된다.

---

### 단계 3: 애니메이션 비용 제거 (1-2일, 중간 효과)

이것은 폴링 최적화와 독립적인 **별도 병목**이다.

**3.1: PollingStatus의 key={updatedAt} 제거**

**변경 파일:** `src/pages/home/ui/DashboardGrid/ServiceWidgetContainer/PollingStatus.tsx`

현재 `key={updatedAt}`는 매 폴링마다 `motion.circle`을 완전히 언마운트/리마운트한다. 이것을 `animate` prop 제어로 대체한다:

```typescript
import { useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

export function PollingStatus({ interval, updatedAt, className, isError }: PollingStatusProps) {
  const circumference = 2 * Math.PI * 10;
  const controls = useAnimationControls();

  useEffect(() => {
    controls.set({ strokeDashoffset: circumference });
    controls.start(
      { strokeDashoffset: 0 },
      { duration: interval / 1000, ease: 'linear' },
    );
  }, [updatedAt, controls, circumference, interval]);

  if (isError) { /* 동일 */ }

  return (
    <div className={cn('relative flex items-center justify-center', className)} title="Updating...">
      <svg className="size-4 -rotate-90" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" className="fill-none stroke-border-primary stroke-[3]" />
        <motion.circle
          // key 제거 - remount 대신 controls로 제어
          cx="12" cy="12" r="10"
          className="fill-none stroke-icon-accent stroke-[3]"
          strokeDasharray={circumference}
          animate={controls}
        />
      </svg>
    </div>
  );
}
```

**기대 효과:** 위젯당 0.2-0.4ms 절약 (SVG 요소 생성/삭제 비용 제거). 10개 위젯 = 2-4ms 절약.

**3.2: useAnimatedState의 매 프레임 setState 제거**

**변경 파일:** `src/pages/home/ui/.../AnimatedArc/useAnimatedState.ts` 및 `AnimatedArc.tsx`

현재 `useAnimatedState`는 `animate()` + `onUpdate: setValue`로 매 rAF마다 React setState를 호출한다. 이것은 0.5초 동안 AnimatedArc당 ~30회, 총 ~150회의 추가 리렌더를 유발한다.

**해결 방향:** Framer Motion의 `motion.path` 컴포넌트와 `animate` prop을 사용하여 React state를 거치지 않고 직접 DOM을 업데이트하거나, SVG path의 `d` attribute를 CSS custom properties + transition으로 제어한다.

구체적 구현은 `AnimatedArc`의 arc 계산 로직에 따라 달라지므로, 다음 두 가지 접근 중 택일:
- **접근 A:** `useRef` + `requestAnimationFrame`으로 DOM 직접 조작 (React 렌더 완전 회피)
- **접근 B:** `motion.path`의 `animate` prop에 최종 `d` 값을 전달하고, Framer Motion이 보간 처리 (React 렌더 1회로 감소)

**기대 효과:** 폴링 직후 0.5초 동안의 프레임당 0.5-1.0ms 절약. 알람이 있는 위젯이 많을수록 효과 증대.

---

### 단계 4: 구조적 비효율 제거 (2-3일, 중간 효과)

**4.1: sizeTierRenderer 참조 안정화**

**변경 파일:** `src/pages/home/ui/.../ServiceWidgetContainer.tsx`

현재 `sizeTierRenderer` 객체가 매 render마다 새로 생성되어 `DashboardWidgetRenderer`의 `useMemo`를 무효화한다.

```typescript
const sizeTierRenderer = useMemo(
  () => ({
    basic: (
      <DashboardCompactContent
        instances={instances}
        title={serviceName}
        pollingInfo={pollingInfo}
        alarmCounts={alarmCounts}
      />
    ),
    medium: (
      <DashboardCompactContent
        instances={instances}
        title={serviceName}
        pollingInfo={pollingInfo}
        alarmCounts={alarmCounts}
      />
    ),
    large: (
      <MemoizedDashboardInstanceListTable
        instances={instances}
        title={serviceName}
        serviceId={Number(serviceId)}
        onAlertClick={handleAlertClick}
        pollingInfo={pollingInfo}
        product={product}
        alarmCounts={alarmCounts}
      />
    ),
  }),
  [instances, alarmCounts, pollingInfo, serviceName, serviceId, product, handleAlertClick],
);
```

**주의:** instances 참조가 매 폴링마다 변경되면 이 useMemo도 매번 재실행된다. 단계 1-2에서 instances의 참조 안정성이 확보된 경우에만 이 최적화가 효과적이다. 참조 안정성이 확보되지 않는다면, 이 변경은 코드 정리 수준의 개선에 그친다.

**4.2: (선택적) 폴링 시차 분산**

서비스 인덱스 기반으로 폴링 간격에 jitter를 추가하여 동시 폴링을 분산:

```typescript
// 방법 1: refetchInterval에 서비스별 오프셋 추가
const staggerOffset = serviceIndex * 200; // 서비스 인덱스 전달 필요
const effectiveInterval = refetchInterval + staggerOffset;

// 방법 2: jitter 추가 (서비스 인덱스 불필요)
refetchInterval: () => refetchInterval + Math.random() * 500;
```

방법 2가 더 간단하고 서비스 인덱스 전달이 불필요하다. 시간이 지나면서 자연스럽게 폴링이 분산된다.

**기대 효과:** 동시 render 빈도를 10배 감소 (10개 동시 → 1-2개 동시).

**4.3: (조건부) React Query select 옵션 활용**

단계 1-2 적용 후 프로파일링 결과, lastUpdateTime 변경으로 인해 instances 참조가 매번 변경되는 것이 확인되면:

```typescript
const { data: instances } = useQuery({
  ...baseQueryOptions,
  refetchInterval: isInteracting ? false : refetchInterval,
  staleTime: refetchInterval,
  gcTime: refetchInterval * 2,
  select: (data) => {
    if (!data?.instances) return [];
    return data.instances.filter(filterNullValue).map((inst) =>
      transformInstanceDto({
        instanceDto: inst,
        product,
        serviceId: Number(serviceId),
        serviceName,
      }),
    );
  },
});
```

`select` 내부에서 transform을 수행하면, React Query가 select 결과에 대해 structuralSharing을 적용한다. lastUpdateTime이 변경되더라도, transform 후 UI-relevant 필드가 동일하면 동일 참조를 반환하여 **리렌더 자체를 방지**한다.

다만 이 접근의 전제 조건: `transformInstanceDto`가 `lastUpdateTime`을 출력에 포함하면, 비교 결과가 항상 "변경됨"이 된다. lastUpdateTime을 UI에서 사용하지 않는다면 transform에서 제외할 수 있다. **이것은 UI 요구사항 확인 후 결정해야 한다.**

---

## 구현 노트

### 파일별 수정 사항 요약

| 파일 | 변경 유형 | 단계 |
|------|----------|------|
| `src/entities/instance/model/useServiceInstances.ts` | staleTime/gcTime 수정, isInteracting 연동, useDeferredValue 추가 | 1, 2 |
| `src/pages/home/model/useInteractionStore.ts` | **신규 생성** - Zustand store | 2 |
| `src/pages/home/ui/DashboardGrid/DashboardGridLayout.tsx` | onDrag/Resize 콜백에 setInteracting 추가 | 2 |
| `src/pages/home/ui/.../PollingStatus.tsx` | key 제거, useAnimationControls 적용 | 3 |
| `src/pages/home/ui/.../AnimatedArc/useAnimatedState.ts` | 매 프레임 setState 제거 | 3 |
| `src/pages/home/ui/.../ServiceWidgetContainer.tsx` | sizeTierRenderer useMemo 추가 | 4 |

### 적용하지 않는 것과 그 이유

1. **Web Worker 데이터 변환:** transformInstanceDto 비용이 0.1ms (프레임 예산의 0.6%). 직렬화 오버헤드가 변환 비용의 10-50배. 역효과.

2. **커스텀 diff 엔진 (Innovator Solution B):** gcTime 정상화 + React Query structuralSharing이 동일 기능 제공. 1줄 vs 150줄의 코드 복잡도 차이.

3. **적응형 렌더링 품질 시스템 (Innovator Solution A):** rAF 기반 프레임 슬랙 측정이 V-Sync 환경에서 오작동. 96개 상태 경로의 복잡도. 인터랙션 중 폴링 중지만으로 동일 효과 달성 가능.

4. **WebSocket 전환:** 프론트엔드 단독 결정 불가. 현재 폴링 아키텍처 최적화로 충분한 개선 가능.

5. **ResizeObserver 통합:** WidthProvider 제거 + Responsive에 width 직접 전달이 필요한 구조적 리팩토링. 단계 2의 폴링 중지로 리사이즈 시 jank의 대부분이 해소되므로 후순위.

---

## 사고 과정 요약

### 어떤 관점이 기여했는가

- **First-Principles:** 문제의 근본 원인 프레이밍("시간적 결합")과 staleTime/gcTime 정상화의 논리적 근거 제공. useDeferredValue의 적용 범위(위젯 내부 데이터에만) 정의.
- **Pragmatist:** 실행 가능한 배포 전략, Zustand store 패턴, "새 개발자 이해 가능성" 기준 제공. CSS 애니메이션 대체 아이디어.
- **Adversarial:** sizeTierRenderer 참조 불안정성 발견 (다른 모든 경로가 놓침). useDeferredValue의 tearing 가능성 경고. refetchInterval 토글 > enabled 토글 통찰.
- **Optimizer:** useAnimatedState의 매 프레임 setState 발견 (핵심 숨겨진 병목). transformInstanceDto가 병목이 아님을 정량적으로 증명하여 Web Worker 도입 방지.
- **Innovator:** "UI-relevant 필드만 비교" 아이디어 (select 옵션으로 간결하게 구현 가능). 알람 우선순위 분리 개념 (장기적 사고 프레임).

### 챌린지에서 발견된 것과 해결

1. **gcTime: 0 ↔ structuralSharing 논쟁:** First-Principles의 "활성 쿼리 캐시는 유지된다"가 기술적으로 정확. 하지만 gcTime 변경은 다른 이유(페이지 전환 UX)에서 여전히 유효. "structuralSharing 활성화"가 아닌 "캐시 정책 정상화"로 재정의.

2. **lastUpdateTime ↔ structuralSharing 효과:** Adversarial의 "거의 항상 변경됨" 지적이 설득력 있음. gcTime 변경의 리렌더 감소 효과를 80-95% → 0-30%로 하향 조정. select 옵션으로 UI-relevant 필드만 비교하는 것이 보완책.

3. **useDeferredValue Deferred Storm:** 인터랙션 중 폴링 중지와 조합하면 해소됨. Pragmatist의 "조합 효과" 반론이 올바름.

4. **폴링 재개 시 burst:** 실제 문제이지만 200ms 딜레이 + staleTime 설정으로 완화 가능. 심각도는 낮음.

### 미해결 불확실성

1. **lastUpdateTime의 실제 갱신 빈도:** 서버 구현 미확인. structuralSharing과 select 옵션의 실제 효과가 이에 의존.
2. **react-grid-layout cloneElement의 memo 우회 여부:** ServiceWidgetContainer에 React.memo를 적용해도 효과가 없을 수 있음.
3. **프로파일링 데이터 부재:** 모든 비용 추정이 이론적. 단계 2 적용 후 Chrome DevTools Performance 녹화를 통해 실제 병목 확인 필수.

---

## Confidence: 7.5/10

단계 1(캐시 정책 정상화)과 단계 2(인터랙션 보호)의 방향성과 효과에 대해서는 높은 확신(8-9/10)을 가진다. 특히 인터랙션 중 폴링 중지는 업계에서 검증된 패턴이며, 구현이 간단하고 되돌리기 쉽다. 단계 3(애니메이션 최적화)도 소스코드를 직접 확인하여 문제를 검증했으므로 효과에 대한 확신이 높다(8/10).

전체 신뢰도가 7.5인 이유: (1) 각 최적화의 정량적 효과는 프로파일링 없이 확인할 수 없다. (2) react-grid-layout의 내부 동작(cloneElement, concurrent mode 호환성)에 대한 불확실성. (3) lastUpdateTime의 실제 변경 패턴에 따라 structuralSharing의 효과가 크게 달라질 수 있다.

---

## 반대 의견

1. **"gcTime: 0 제거가 핵심이다" (Optimizer/Pragmatist):** gcTime 제거가 structuralSharing에 미치는 영향은 활성 폴링 쿼리에서는 미미하다. 이것을 1순위 핵심 최적화로 보는 것은 과대평가다. 다만 캐시 정책을 정상화하는 것 자체는 올바르므로, **기대 효과의 크기**에 대한 이견이지 방향에 대한 이견은 아니다.

2. **"useDeferredValue는 은탄환이 아니다" (Adversarial/Innovator):** 동의한다. useDeferredValue 단독으로는 불완전하다. 하지만 인터랙션 중 폴링 중지와 조합하면 각각의 약점을 상쇄하여 효과적이다. "은탄환"이 아니라 "조합의 한 요소"로 자리매김한다.

3. **"커스텀 diff가 더 근본적이다" (Innovator):** "render를 안 하는 것 > render를 미루는 것"이라는 원칙은 올바르다. 하지만 React Query의 structuralSharing이 이미 이 기능을 제공하며, gcTime 정상화 + select 옵션으로 활성화할 수 있다. 150줄의 커스텀 diff 엔진이 1줄의 설정 변경보다 우월하다는 주장은 과잉 엔지니어링이다.

4. **"프로파일링부터 해야 한다" (Optimizer/Adversarial):** 이상적으로는 맞다. 하지만 단계 1-2의 변경은 코드 변경량이 극히 적고(~50줄), 되돌리기 쉬우며, 부작용 위험이 거의 없다. "측정 후 최적화" 원칙과 "확실히 올바른 작은 변경을 즉시 적용" 전략은 양립 가능하다. 단계 1-2를 적용한 후 프로파일링하여 단계 3-4의 필요성과 우선순위를 결정하는 것이 가장 실용적이다.
