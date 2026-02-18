## TL;DR (1 paragraph)

EXEM UI Table 컴포넌트의 성능 문제는 세 가지 근본 원인에서 비롯된다: (1) React.memo 부재와 Context value 불안정으로 인한 전체 테이블 리렌더 전파, (2) 셀당 3-4개 DOM 노드 + 핀 고정 행 비가상화로 인한 과도한 DOM, (3) 매 렌더마다 수천 개의 이벤트 핸들러 클로저 생성/폐기. 5개의 독립적 분석 경로와 5개의 상호 비판을 종합한 결과, **가장 효과적인 첫 단계는 `useSectionLastCell`의 O(n*m^2) 알고리즘 병목 해소 + Context Provider useMemo 안정화 + TableRow에 React.memo 적용**이다. 이 세 가지만으로 상호작용 지연을 60-70% 줄일 수 있으며, 이후 이벤트 위임과 DOM 축소로 추가 개선이 가능하다. React Compiler는 시기상조이고, 열 가상화는 셀 병합과의 호환성 때문에 조건부로만 검토해야 한다.

---

## 핵심 진단: 왜 느린가?

### 근본 원인 1: 방어벽 없는 리렌더 전파 (최대 병목)

`useReactTable`의 내부 `setState`가 호출되면(정렬, 선택, 리사이즈 등), `Table.tsx` 전체가 리렌더된다. 이 리렌더는 9개 Provider 체인을 통해 모든 하위 컴포넌트로 전파된다. `TableRow`와 `TableCell`에 `React.memo`가 없으므로, 1,650개 셀(55행 x 30열)이 전부 리렌더 대상이 된다.

추정 비용: 정렬 1회 클릭 시 약 **100-110ms** 소요 (6프레임 지연, 사용자 체감 가능).

여기에 숨겨진 알고리즘 병목이 있다. `useSectionLastCell` 훅이 **모든 셀에서** `table.getVisibleLeafColumns().filter()`를 호출하여 O(cells x columns) = O(n*m^2) 복잡도를 만든다. 55행 x 30열 = 1,650셀 x 30열 필터 = 49,500번의 배열 순회. 이것이 초기 렌더와 상호작용 지연의 최대 단일 병목일 가능성이 높다.

### 근본 원인 2: 과도한 DOM 노드 (스크롤/메모리 병목)

현재 관측치 약 25,000개 DOM 노드. 구성 요소:
- 가상화된 바디: ~55행 x 30열 x 4노드/셀 = ~6,600 (핀 고정 열 3-section이면 x2-3)
- 핀 고정 행 (비가상화): top 10행 + bottom 5행 x 30열 x 4노드 x 3-section = ~5,400
- 헤더, 구조 컨테이너, 커스텀 셀 렌더러: ~5,000-8,000

핵심 문제: 핀 고정 행이 가상화되지 않아 행 수에 비례하여 DOM이 증가한다. 또한 셀당 3-4개의 wrapper div(외부 div > 콘텐츠 래퍼 > 텍스트 래퍼 > 텍스트)가 승수 효과를 만든다.

### 근본 원인 3: 이벤트 핸들러 클로저 폭증 (GC 압박)

행마다 `buttonize()`로 onClick + onKeyDown, 셀마다 조건부 onClick + onKeyDown, 행마다 onPointerDown(드래그). 합계 약 3,500-4,000개의 JavaScript 클로저가 매 렌더마다 생성된다. 이전 렌더의 클로저는 전부 가비지가 되어 V8 Minor GC를 유발한다. React가 내부적으로 이벤트 위임을 수행하므로 네이티브 리스너 수 자체는 문제가 아니지만, **클로저 생성/폐기의 메모리 비용과 GC 일시정지**가 스크롤 성능에 영향을 준다.

---

## 종합 해결 전략

### Phase 1: 즉시 적용 (1주, 변경 최소)

**1-1. `useSectionLastCell` 알고리즘 최적화** (1일, 최우선)

현재 모든 셀(1,650개)에서 `getVisibleLeafColumns().filter()`를 개별 호출하여 O(n*m^2) 복잡도가 발생한다. section별 마지막 열 ID를 **VirtualRowRenderer 또는 TableRow 레벨에서 한 번만 계산**하고, 결과를 props로 셀에 전달한다.

```tsx
// VirtualRowRenderer 레벨에서 한 번만 계산
const sectionLastColumnId = useMemo(() => {
  const columns = table.getVisibleLeafColumns()
    .filter(col => col.getIsPinned() === columnPinnedState);
  return columns[columns.length - 1]?.id;
}, [table, columnPinnedState]);

// TableCell에 props로 전달
<TableCell cell={cell} isSectionLastCell={cell.column.id === sectionLastColumnId} />
```

이 변경으로 1,650번의 `filter()` 호출이 section당 1번(최대 3번)으로 줄어든다. O(n*m^2) -> O(m).

**예상 효과**: 초기 렌더 20-30% 개선, 상호작용 지연 15-25% 개선.

**1-2. Context Provider의 useMemo 안정화** (2-3시간)

코드에서 확인된 useMemo 누락 Provider:

```tsx
// TableDragProvider.tsx: 매 렌더마다 새 객체 생성
// Before:
const contextValue: TableDragContextValue = { startDrag };
// After:
const contextValue = useMemo(() => ({ startDrag }), [startDrag]);

// TableCustomStylesProvider.tsx: falsy일 때 매번 새 빈 객체
// Before:
<TableCustomStylesContext.Provider value={customStyles || {}}>
// After:
const EMPTY_STYLES = {}; // 모듈 레벨 상수
const value = useMemo(() => customStyles || EMPTY_STYLES, [customStyles]);

// Table.tsx의 containerSizes: IIFE로 매 렌더마다 새 객체
// Before:
const containerSizes = (() => { ... })();
// After:
const leftSize = isColumnPinningEnabled ? table.getLeftTotalSize() : 0;
const rightSize = isColumnPinningEnabled ? table.getRightTotalSize() : 0;
const centerSize = isColumnPinningEnabled ? table.getCenterTotalSize() : table.getTotalSize();
const containerSizes = useMemo(
  () => ({ left: leftSize, right: rightSize, center: centerSize }),
  [leftSize, rightSize, centerSize]
);
```

**예상 효과**: Context 변경으로 인한 불필요 리렌더 차단. React.memo 적용의 전제 조건 확보.

**1-3. TableRow에 React.memo 적용** (2-3일)

현재 `TableRow`는 `children` prop을 받아 셀을 렌더링한다. children은 `filteredCells.map()`으로 매번 새로 생성되므로, **먼저 TableRow가 자체적으로 셀을 렌더하는 구조로 변경**해야 한다.

```tsx
// Before: VirtualRowRenderer에서 children으로 전달
<TableRow row={row} virtualItem={virtualItem} isPinned={isPinned}>
  {filteredCells.map(cell => <TableCell key={cell.id} cell={cell} />)}
</TableRow>

// After: TableRow 내부에서 셀 렌더링
<TableRow
  row={row}
  virtualItem={virtualItem}
  isPinned={isPinned}
  columnType={columnType}
  sectionLastColumnId={sectionLastColumnId}
/>

// TableRow 내부
const TableRowInner = <T extends object>({
  row, virtualItem, isPinned, columnType, sectionLastColumnId
}: TableRowProps<T>) => {
  const sectionCells = useMemo(
    () => getSectionCells(row, columnType),
    [row, columnType]
  );
  // ... 기존 행 렌더링 로직 + 셀 렌더링
};

export const TableRow = React.memo(TableRowInner, (prev, next) => {
  if (prev.row.id !== next.row.id) return false;
  if (prev.isPinned !== next.isPinned) return false;
  if (prev.virtualItem?.index !== next.virtualItem?.index) return false;
  if (prev.virtualItem?.start !== next.virtualItem?.start) return false;
  if (prev.virtualItem?.size !== next.virtualItem?.size) return false;
  if (prev.columnType !== next.columnType) return false;
  if (prev.sectionLastColumnId !== next.sectionLastColumnId) return false;
  return true;
}) as typeof TableRowInner;
```

**핵심 주의사항**: TanStack Table의 `row` 객체는 상태 변경 시 새 참조가 생성될 수 있으므로, `row.id` 기준으로 비교한다. 행 내부의 상태 변경(선택, 확장, 클릭)은 Context를 통해 전파되어 memo를 bypass하므로, 상태 반영이 누락되지 않는다. Context가 Phase 1-2에서 useMemo로 안정화되었으므로, Context 변경은 **실제로 상태가 변했을 때만** 발생한다.

**예상 효과**: 행 선택 시 리렌더 범위를 전체 테이블 -> 변경된 행으로 축소. 상호작용 지연 40-60% 추가 개선.

**1-4. 셀 내부 DOM 1단계 축소** (2-3일)

`TableCell.tsx`의 3중 div 구조에서 가장 안쪽 텍스트 래퍼를 콘텐츠 래퍼에 병합한다.

```tsx
// Before (4 nodes)
<div className={cn('flex size-full min-w-0 flex-1 items-center', contentClassName)}>
  <div className={cn('max-w-full', textClassName)}>
    <CellContent ... />
  </div>
</div>

// After (3 nodes)
<div className={cn(
  'flex size-full min-w-0 flex-1 items-center',
  contentClassName,
  'max-w-full',
  textClassName
)}>
  <CellContent ... />
</div>
```

**필수 검증**: `truncate` 클래스가 flex 컨테이너 직접 자식에서 동작하는지 확인. `min-w-0`이 이미 적용되어 있으므로 대부분 호환되지만, `RatioCell`, 커스텀 렌더러, 다양한 정렬 조합에서 시각적 회귀 테스트 필수. Storybook의 모든 테이블 변형 스토리에서 검증.

**예상 효과**: 1,650셀 x 1노드 = ~1,650개 DOM 노드 감소 (전체 DOM ~8-10% 감소).

**Phase 1 측정 시점**: 모든 변경 적용 후 React DevTools Profiler + Chrome Performance 탭으로 before/after 비교. `performance.mark()`/`performance.measure()`로 자동화 벤치마크 작성. 측정 결과를 기반으로 Phase 2의 우선순위를 결정한다.

---

### Phase 2: 구조적 개선 (2-3주)

**2-1. 이벤트 위임 -- 행 클릭 먼저** (1주)

`TableRenderer.tsx`의 `role="table"` div에 위임 핸들러를 설치하고, `TableRow.tsx`에서 `buttonize()` 호출을 제거한다.

```tsx
// TableRenderer에 위임 핸들러 추가
const handleDelegatedClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement;

  // 유틸리티 셀(체크박스/확장기)에서의 클릭은 무시
  const utilityCell = target.closest('[data-utility-cell]');
  if (utilityCell) return;

  // 셀 클릭 모드인 경우
  if (options.clickable?.type === 'cell') {
    const cellElement = target.closest('[role="cell"]');
    if (cellElement) {
      const columnId = cellElement.getAttribute('data-column-id');
      const rowElement = cellElement.closest('[role="row"]');
      const rowId = rowElement?.getAttribute('data-row-id');
      if (columnId && rowId) {
        options.clickable.onCellClick?.({ rowId, columnId });
      }
      return; // 행 클릭 방지 (stopPropagation 대체)
    }
  }

  // 행 클릭 모드
  const rowElement = target.closest('[role="row"]');
  if (rowElement) {
    const rowId = rowElement.getAttribute('data-row-id');
    if (rowId) table.handleRowClick(rowId);
  }
}, [table, options]);

// 키보드 접근성도 동일 패턴
const handleDelegatedKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  // ... 위와 동일한 target 식별 로직
}, [table, options]);
```

**드래그(onPointerDown)는 유지**: Pragmatic DnD가 각 행의 DOM 요소에 직접 바인딩되므로, 드래그 관련 핸들러는 개별 행에 유지한다. 행당 1개의 `onPointerDown`은 성능에 미미한 영향.

**data-row-id, data-column-id 속성 추가**: 이벤트 위임을 위해 행과 셀에 식별 속성을 추가해야 한다. 현재 `role="row"`는 있으나 `data-row-id`는 없으므로 추가한다.

**기존 stopPropagation 대체**: `RadioCell.tsx`, `CheckboxCell.tsx`, `ExpanderCell.tsx`, `useCellBehavior.ts`의 `stopPropagation()`을 위임 핸들러 내부의 조건 분기(target 검사)로 대체한다.

**예상 효과**: 이벤트 핸들러 클로저 약 3,000개 -> 약 60개 (행당 드래그 핸들러만 유지). 스크롤 시 GC 압박 감소.

**2-2. TableCell에 React.memo 적용** (3-5일)

Phase 1에서 TableRow memo의 효과를 측정한 후, 추가 개선이 필요하면 셀 수준 memo를 적용한다.

```tsx
export const TableCell = React.memo(TableCellInner, (prev, next) => {
  if (prev.cell.id !== next.cell.id) return false;
  if (prev.isSectionLastCell !== next.isSectionLastCell) return false;
  // cell.getValue()는 primitive이면 안전, 객체이면 참조 불안정
  // 따라서 cell.id가 같으면 동일 셀이라고 판단하고,
  // 실제 값 변경은 부모 리렌더(row model 변경)를 통해 감지
  return true;
}) as typeof TableCellInner;
```

**주의**: `cell` 객체의 참조가 불안정하므로 `cell.id` 기준으로만 비교한다. 데이터 변경 시 TanStack Table이 row model을 재계산하면 새 cell 객체가 생성되어 memo가 miss되고 리렌더가 발생한다. 이것이 의도한 동작이다.

**예상 효과**: 열 리사이즈 등 "셀 데이터는 동일하나 레이아웃만 변경"되는 시나리오에서 추가 리렌더 감소.

**2-3. 핀 고정 행 수 제한 또는 가상화** (1주)

`PinnedRowRenderer`가 비가상화 상태이므로, 핀 고정 행이 많으면 DOM이 폭발한다.

옵션 A (간단): 핀 고정 행 수 상한을 API로 제한 (예: 최대 20행). 초과 시 경고 로그.
옵션 B (중기): 핀 고정 행에도 가상화 적용. 핀 고정 영역의 높이가 뷰포트의 일정 비율을 초과하면 스크롤 가능하게 변경.

**권장**: 옵션 A를 먼저 적용하고, 실제 사용 패턴에서 20행 초과가 빈번하면 옵션 B를 검토.

**예상 효과**: 핀 고정 행 관련 DOM 노드 상한 설정. 최악의 시나리오(100행 핀 고정) 방지.

---

### Phase 3: 고급 최적화 (1-2달, 선택적)

**3-1. 열 가상화** (2-3주, 조건부)

Center section의 열에 수평 `useVirtualizer`를 적용한다. 30열 중 가시 10열 + overscan 2열 = 12열만 렌더.

**전제 조건**: CellMerging(colSpan)이 비활성화된 테이블에서만 적용. colSpan이 활성화되면 자동으로 열 가상화를 끄는 API 제공.

```tsx
// 열 가상화 활성 조건
const enableColumnVirtualization =
  options.columnVirtualization !== false &&
  !options.cellMerging; // colSpan이 있으면 비활성
```

**검증 필수**: 헤더-바디 열 동기화, 수평 스크롤 동기화, 열 리사이즈 + 가상화 상호작용.

**예상 효과**: Center section DOM 노드 40-60% 추가 감소.

**3-2. React Compiler 파일럿** (2-4주, 실험적)

Table 컴포넌트가 아닌 **단순 컴포넌트(Button, Badge, Input 등)**에 먼저 적용하여 빌드 파이프라인 호환성과 실제 효과를 검증한다.

검증 항목:
- tsup + Compiler 플러그인 통합
- Biome 린트 규칙과의 호환
- 번들 사이즈 영향
- useDeepMemo 패턴과의 충돌 여부

Table에 확대 적용은 파일럿 결과에 따라 결정한다.

**3-3. Context 구조 고도화** (장기)

Phase 1-2의 useMemo 안정화로 충분하지 않은 경우, `useSyncExternalStore` 기반 선택적 구독 패턴을 검토한다. 각 행/셀이 자신에게 필요한 상태 슬라이스만 구독하여, 다른 행의 상태 변경에 영향받지 않는 구조.

이것은 TanStack Table의 상태를 외부 스토어로 래핑하는 대규모 변경이므로, Phase 1-2의 결과가 "충분히 좋은" 수준에 미달할 때만 진행한다.

---

### 보류/비추천

| 접근법 | 판정 | 이유 |
|--------|------|------|
| Canvas/WebGL 렌더링 | **비추천** | 접근성(WCAG) 완전 파괴, 커스텀 셀 렌더러 불가, 사실상 전체 재작성 |
| Signal 기반 반응성 | **비추천** | React 생태계 이탈, TanStack Table 비호환, 팀 학습 비용 과다 |
| Web Worker 오프로딩 | **비추천** | 현재 병목이 연산이 아닌 렌더링이므로 문제 유형 불일치 |
| content-visibility (핀 고정 행) | **비추천** | 핀 고정 행은 항상 뷰포트 안에 있어 효과 0 |
| CSS Subgrid (전면 도입) | **보류** | 9-grid 3-section 구조와 호환성 미검증, 부분 도입은 장기 탐색 |
| Frozen Frame / Double Buffering | **비추천** | DOM 2배 유지의 메모리 비용, startTransition이 더 나은 대안 |

---

## 기대 효과 (정량적)

### Phase 1 완료 후 (1주)

| 지표              | Before  | After (추정)     | 개선율               |
| --------------- | ------- | -------------- | ----------------- |
| 상호작용 지연 (정렬 클릭) | ~110ms  | ~35-45ms       | 60-70%            |
| 초기 렌더 시간        | ~110ms  | ~50-70ms       | 35-50%            |
| DOM 노드 수        | ~25,000 | ~21,000-23,000 | 8-16%             |
| 이벤트 핸들러 클로저     | ~3,500개 | ~3,500개        | 0% (Phase 2에서 해결) |

### Phase 1 + 2 완료 후 (3-4주)

| 지표 | Before | After (추정) | 개선율 |
|------|--------|-------------|--------|
| 상호작용 지연 | ~110ms | ~20-30ms | 73-82% |
| 초기 렌더 시간 | ~110ms | ~35-50ms | 55-68% |
| DOM 노드 수 | ~25,000 | ~18,000-20,000 | 20-28% |
| 이벤트 핸들러 클로저 | ~3,500개 | ~60개 | 98% |
| 스크롤 GC 일시정지 | ~1-3ms/cycle | ~0.5ms/cycle | 50-80% |

### Phase 1 + 2 + 3 완료 후 (2-3개월, 열 가상화 포함)

| 지표 | Before | After (추정) | 개선율 |
|------|--------|-------------|--------|
| DOM 노드 수 | ~25,000 | ~8,000-12,000 | 52-68% |
| 메모리 사용량 | ~20-40MB | ~8-15MB | 50-60% |

**주의**: 모든 수치는 코드 구조 기반 추정이며, 실측 검증이 필수이다. 커스텀 셀 렌더러의 복잡도, 핀 고정 행의 실제 사용 패턴, TanStack Table의 row/cell 참조 안정성에 따라 결과가 크게 달라질 수 있다.

---

## 사용자 제안 평가

### 이벤트 위임: 유효하되 점진적 적용 권장

**판정: ADOPT (Phase 2)**

이벤트 위임의 가치는 "네이티브 리스너를 줄이는 것"이 아니라 **"클로저 생성/폐기를 제거하는 것"**이다. React 17+는 이미 네이티브 이벤트를 위임하므로 리스너 수 자체는 문제가 아니지만, 각 셀/행의 onClick/onKeyDown 핸들러가 매 렌더마다 새 클로저를 생성하여 메모리와 GC에 부담을 준다.

**점진적 적용이 핵심**: 행 클릭의 onClick + onKeyDown을 먼저 위임하고, 드래그(onPointerDown)는 Pragmatic DnD와의 호환성을 위해 개별 유지한다. 셀 클릭 위임은 행 클릭 위임이 안정화된 후 확대한다.

**위험 관리**: `stopPropagation()` 사용처 5-6곳을 위임 핸들러 내부의 조건 분기(target.closest 검사)로 대체해야 한다. 커스텀 셀 렌더러 내부의 `stopPropagation()`은 제어할 수 없으므로, API 문서에 가이드라인을 추가한다.

**확신도: 70-75%** (행 클릭 위임 한정).

### React Compiler: 시기상조, 파일럿부터

**판정: DEFER (Phase 3, 실험적)**

React Compiler는 자동 메모이제이션으로 수동 `useMemo`/`useCallback`/`React.memo` 부재를 보완할 수 있지만, 이 Table 컴포넌트에서는 세 가지 구조적 제약이 있다:

1. **`useDeepMemo`와의 충돌**: 렌더링 중 `useRef`를 읽고 쓰는 패턴은 Compiler가 명시적으로 경고하는 안티패턴. Compiler가 이 코드 경로의 최적화를 포기하거나, 이중 메모이제이션으로 인한 stale closure 버그 가능.

2. **TanStack Table getter의 순수성 불보장**: `cell.getValue()`, `row.getIsSelected()` 등은 내부 상태에 의존하는 클로저. Compiler가 이를 순수 함수로 잘못 분류하면 stale value, 보수적으로 처리하면 최적화 효과 없음.

3. **Context all-or-nothing 문제는 해결 불가**: Compiler는 Context의 부분 구독을 만들지 않는다.

**권장**: Button, Badge, Input 등 단순 컴포넌트에서 먼저 빌드 파이프라인 호환성과 실제 효과를 검증한 후, Table에 확대 적용 여부를 결정한다.

**확신도: 40-50%** (Table 컴포넌트에서의 실질적 효과).

---

## Thought Process Summary

5개의 독립적 분석 경로를 병렬 실행한 후, 5개의 상호 비판(Challenge)을 통해 각 경로의 강점과 약점을 검증했다.

**First Principles** (7.5/10): 이론적 하한 유도와 클로저 비용 분석이 탁월. 하지만 CSS 제약과 TanStack API 현실을 과소평가.

**Pragmatist** (7.75/10): 가장 실행 가능한 전략. Provider별 useMemo 체크리스트, 마이그레이션 일정, 실전 사례 비교가 강점. 하지만 스스로 "충분히 좋은 목표에 미달"이라고 인정하는 천장 문제.

**Adversarial** (6.75/10): 핀 고정 행 비가상화 지적, 연쇄 실패 시나리오 경고가 독자적 가치. 하지만 모든 제안에 Critical Flaw를 부여하여 변별력 상실. React onClick을 native addEventListener와 혼동하는 오류.

**Innovator** (6.0/10): "왜 모든 셀이 컴포넌트여야 하는가?"라는 질문이 사고를 확장. 하지만 content-visibility 핀 고정 행 오류, 평균 신뢰도 26%, 기본기 진단과 패러다임 전환 처방의 괴리.

**Optimizer** (7.75/10): `useSectionLastCell` O(n*m^2) 병목 발견이 5개 경로 중 가장 중요한 독창적 기여. 정량적 비용 모델이 의사결정의 기반. 하지만 내부 수치 모순(셀당 10us vs 300us)과 Layout 선형 모델 오류.

**합성 결과**: Optimizer의 useSectionLastCell 발견 + Pragmatist의 실행 계획 + First Principles의 구조적 비전 + Adversarial의 위험 경고를 가중 조합. Innovator의 아이디어는 장기 탐색 영역으로 분류.

---

## Confidence: 7/10

높은 확신 영역:
- Context useMemo 안정화가 효과적 (모든 경로 동의)
- useSectionLastCell 알고리즘 개선 필요 (코드 구조에서 명확)
- React.memo + 커스텀 비교 함수가 상호작용 개선 (React 기본 원리)

중간 확신 영역:
- 이벤트 위임(행 클릭)의 안전성 (stopPropagation 대체 필요)
- Phase 1+2 총 효과가 60-70% 상호작용 개선 (비선형 효과 미반영 가능)

낮은 확신 영역:
- React Compiler의 Table 컴포넌트 호환성 (실증 데이터 부족)
- 열 가상화의 9-grid/셀 병합 호환성 (구조적 충돌 가능)
- 정량적 수치의 정확도 (모두 실측이 아닌 추정)

**모든 수치는 React DevTools Profiler와 Chrome Performance 탭으로 before/after 실측 검증이 필수이다. 측정 없는 최적화는 최적화가 아니라 추측이다.**

---

## Dissenting Views

**"React.memo는 유지보수 지옥이다"** (Adversarial 관점): 커스텀 비교 함수가 14개 Feature의 상태를 모두 추적해야 하며, 새 Feature 추가 시 비교 함수 업데이트를 빠뜨리면 stale UI 버그가 발생한다. 이 버그는 재현이 어렵고 발견이 늦다. **대응**: 비교 함수를 최소 식별자(row.id, virtualItem)로 제한하고, Feature 상태 변경은 Context bypass에 의존. 이것이 완벽하지는 않지만, memo 없이 모든 셀을 매번 리렌더하는 현재보다는 확실히 낫다.

**"지루한 최적화로는 근본적 해결이 안 된다"** (First Principles/Innovator 관점): Context의 all-or-nothing 구독 모델은 테이블처럼 수천 개의 구독자가 있는 시나리오와 근본적으로 부적합하다. useMemo와 React.memo는 증상 완화이지 원인 치료가 아니다. 6개월 후 사용자가 여전히 불만을 제기하면 결국 구조적 전환(useSyncExternalStore 또는 외부 상태 라이브러리)이 불가피하다. **대응**: 맞는 말이지만, 구조적 전환의 리스크(TanStack Table 통합, 14개 Feature 재작성, 회귀 버그)가 현재 시점에서는 너무 크다. Phase 1-2를 먼저 실행하고 측정한 후, 부족하면 Phase 3에서 구조적 전환을 검토하는 것이 안전하다.

**"정량적 수치를 믿지 마라"** (Adversarial 관점): Optimizer의 비용 모델에는 내부 모순(useSectionLastCell 10us vs 300us)과 잘못된 가정(Layout 선형 모델)이 있다. 합성의 "Phase 1+2로 60-70% 개선"이라는 추정도 같은 기반 위에 있으므로 신뢰할 수 없다. **대응**: 정량적 수치는 방향성 참고로만 사용하고, 실측으로 검증해야 한다. 하지만 "수치가 부정확하므로 아무것도 하지 말자"는 결론은 아니다. useMemo 누락, O(n*m^2) 알고리즘, React.memo 부재는 수치와 무관하게 코드 품질 문제이며, 수정하면 성능이 개선되는 것은 자명하다. 정확한 개선 폭만 불확실할 뿐이다.
