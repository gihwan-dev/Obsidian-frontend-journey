## TL;DR

"Row-absolute + Cell-flex" 리팩토링 계획은 **방향성은 올바르지만 핵심 전제에 결함이 있고, 8개의 반드시 수정해야 할 이슈가 존재**한다. 가장 심각한 문제는: (1) flex 전환만으로는 리렌더링 횟수가 줄지 않는다는 사실(CSS 레이아웃과 React 렌더 사이클의 혼동), (2) `useMemo` 의존성 배열 버그로 containerSizes가 초기값에 고정되는 치명적 버그, (3) 그룹 헤더에서 `flex: colSpan 0 0%`가 하위 컬럼 너비 합과 불일치하는 정렬 문제, (4) TableHeaderArea.tsx가 별도로 containerSizes를 계산하여 헤더-바디 정렬이 어긋나는 문제다. 이 결함들을 수정하면 코드 간소화와 컨테이너 리사이즈 성능(44배 개선)에서 확실한 가치가 있으나, 드래그 리사이즈 성능은 ~1.7배 개선에 그치므로 CSS Variables를 필수 후속 작업으로 계획해야 한다.

---

## 계획의 주요 결함 (Severity 순)

### 1. [CRITICAL] flex 전환이 리렌더링 횟수를 줄이지 않음

계획의 핵심 주장 "auto 컬럼이 columnSizing을 구독하지 않으므로 리렌더링이 줄어든다"는 **CSS 레이아웃과 React 렌더 사이클을 혼동**한 것이다.

- `table.setColumnSizing()` 호출 -> Table.tsx 리렌더링 -> 모든 하위 컴포넌트 리렌더링 (React 기본 동작)
- `TableCell`에 `React.memo`가 없으므로 부모(TableRow)가 리렌더링되면 모든 셀이 리렌더링
- flex로 전환해도 300셀 -> 300셀 리렌더링 (횟수 불변), 셀 당 비용만 ~43% 감소
- 드래그 리사이즈: ~22ms -> ~12ms (1.7배 개선, 60fps에 겨우 도달)
- **진정한 리렌더링 감소를 위해서는 `React.memo` + props 안정화 또는 CSS Variables가 필수**

### 2. [CRITICAL] containerSizes `useMemo` 의존성 버그

계획이 제안하는 `useMemo(() => ..., [table, isColumnPinningEnabled])`:

- TanStack Table의 `table` 객체는 `useRef`로 관리되어 **참조가 절대 변하지 않음**
- `isColumnPinningEnabled`도 런타임에 거의 변하지 않음
- 결과: containerSizes가 **최초 렌더링 시 계산된 후 영원히 갱신되지 않음**
- 컬럼 리사이즈, 피닝 토글, 컬럼 추가/제거 시 section 너비가 고정 -> **모든 레이아웃 붕괴**
- 해결: IIFE 패턴 유지(현행) 또는 `columnSizing`/`columnPinning` 상태를 의존성에 포함

### 3. [CRITICAL] 그룹 헤더 `flex: colSpan 0 0%` 정렬 불일치

그룹 헤더에 `flex-grow: colSpan`을 적용하면:

- Group A(col1: 100px 고정 + col2: auto + col3: auto, colSpan=3)와 Group B(col4: 200px 고정 + col5: auto, colSpan=2) 공존 시
- flex-grow 3:2 비율로 공간 분배 -> Group A = 600px, Group B = 400px (1000px 컨테이너)
- 하지만 하위 리프 컬럼의 실제 배치: col1=100px, col2~col3=flex, col4=200px, col5=flex
- 리프 행과 그룹 헤더 행의 **수직 정렬이 보장되지 않음**
- 해결: 그룹 헤더는 `flex: 0 0 ${header.getSize()}px` 사용 (하위 컬럼 합산값)

### 4. [CRITICAL] TableHeaderArea.tsx 독립적 containerSizes 계산

- Table.tsx가 `calcMinTotal()` 기반으로 변경되어도, TableHeaderArea.tsx는 여전히 `getCenterTotalSize()` 사용
- 예: auto 컬럼 5개 -> Table.tsx center = 250px(min), TableHeaderArea.tsx center = 750px(기본값)
- **헤더와 바디의 컬럼 위치가 어긋나는 치명적 시각 버그**
- 해결: TableHeaderArea.tsx를 `useTableContainerSize()` 컨텍스트 소비자로 변경 (단일 소스)

### 5. [MAJOR] 리사이즈 시작 시 auto -> 고정 전환 레이아웃 점프

- auto 컬럼 하나를 리사이즈 시작하면 DOM 너비를 측정하여 고정 전환
- 나머지 auto 컬럼들의 flex 공간이 즉시 재분배 -> **수십 px 단위의 시각적 점프**
- 현재 3-pass 알고리즘은 모든 auto 컬럼에 미리 px 값을 할당하므로 점프 없음
- 해결: `handleResizeStart`에서 **모든 auto 컬럼의 DOM 너비를 동시 측정 -> 전체 고정 전환**, 리사이즈 종료 시 비대상 컬럼을 auto로 복원

### 6. [MAJOR] handleResizeStart Race Condition

- React 18 automatic batching: `setColumnSizing()`과 `resizeHandler()` 호출이 같은 이벤트 핸들러 내에서 batch됨
- TanStack의 `resizeHandler`가 batch 전 상태(150px 기본값)를 읽으면 ~100px 이상 점프 가능
- 해결: `flushSync(() => table.setColumnSizing(...))` 사용하여 동기 반영 후 resizeHandler 호출

### 7. [MAJOR] 셀 병합 코드 모순

- 계획: "셀 병합 제거 예정"이라고 전제
- 코드: `mergeInfo.colSpan > 1` 분기, rowSpan 높이 계산, CellMerging Feature 전체 유지
- 제거 예정이면 **먼저 제거한 후** flex 전환해야 복잡도가 크게 줄어듦
- 주의: 그룹 헤더의 `header.colSpan`은 셀 병합과 **완전히 다른 개념**이므로 유지 필요

### 8. [MAJOR] VirtualRowRenderer/PinnedRowRenderer `width` 미변경

- 현재 `width: totalSize` -> flex에서는 `min-width`로 변경 필요
- 변경하지 않으면 auto 컬럼의 flex 확장이 `totalSize`(기본값 150px * N) 내로 제한됨
- VirtualRowRenderer, PinnedRowRenderer, StickyTreeRenderer 모두 확인 필요

### 9. [MAJOR] ResizeHandler overflow-hidden 충돌

- `BaseTableHeaderCell`의 최외곽에 `overflow-hidden` 클래스 존재
- ResizeHandler를 cell 내부 child로 이동하면 `right: -2px` 돌출 부분이 clip됨
- 해결: 내부 콘텐츠 div에서 overflow-hidden 처리, 외곽에서 제거

---

## 계획의 올바른 부분

1. **Row의 absolute 유지 (가상화)**: 행 단위 가상화를 위해 Row의 absolute positioning을 유지하는 결정은 정확하다. react-virtual의 가상화 모델과 호환성을 보장한다.

2. **Row에 이미 `display: flex` 존재**: 현재 Row가 `display: flex`를 가지고 있으므로, Cell의 `position: absolute`만 제거하면 flex가 즉시 활성화된다. Row 자체의 수정이 최소화된다는 점은 좋은 발견이다.

3. **min-width 전략의 기본 동작**: 컨테이너에 `min-width: calcMinTotal(columns)`를 설정하는 전략은 대부분의 시나리오에서 올바르다. 고정 컬럼만 있는 경우, auto만 있는 경우, 혼합 경우 모두 수학적으로 검증됨.

4. **ResizeObserver 제거의 가치**: CSS flex가 컨테이너 리사이즈 시 auto 컬럼 재분배를 처리하므로, ResizeObserver + debounce + 3-pass 알고리즘을 제거하면 **컨테이너 리사이즈 시 44배 성능 개선** (22ms -> 0.5ms)이 달성된다. 사이드바 토글, 브라우저 리사이즈 등에서 체감이 크다.

5. **getPinnedColumnOffsetStyle 제거의 안전성**: 3-section 구조에서 이 함수는 이미 무의미하며, 피닝 비활성화 시에도 빈 객체를 반환하므로 제거해도 안전하다.

6. **`column.getStart()` 제거 효과**: O(index) 연산을 제거하면 셀 당 ~0.02ms 절감, 300셀 기준 ~6ms 절감. 리사이즈 중 매 프레임에 해당하므로 의미 있는 개선이다.

7. **번들 사이즈 절감**: 3-pass 알고리즘 ~300줄, ResizeObserver 관련 ~40줄 제거 -> 약 4KB (minified, gzip 후 ~1.5KB) 절감.

---

## 수정된 실행 계획

### Phase 0: 셀 병합 코드 완전 제거 (별도 PR)
**리스크: 1/5 | 예상 기간: 1일**

- CellMerging.ts -> 제거 또는 no-op Feature로 변환
- cellMergingUtils.ts -> 제거
- useCellLayout.ts -> mergeInfo 참조 제거, colSpan/rowSpan 분기 제거
- TableCell.tsx -> mergeInfo.isHidden 참조 제거
- layoutUtils.ts -> getCellPosition에서 colSpan/rowSpan 파라미터 제거
- useCellAppearance.ts -> mergeInfo 의존성 제거
- CellMerging.browser.test.tsx, CellMerging.stories.tsx -> 제거
- **주의**: 그룹 헤더의 `header.colSpan`은 절대 건드리지 않음

이 Phase는 기존 기능에 영향을 주지 않으면서(병합 미사용 시 DEFAULT_MERGE_INFO 반환) 코드를 정리하므로, **독립적으로 먼저 머지 가능**.

### Phase 1: Cell/Header flex 전환 + 컨테이너 min-width (원자적)
**리스크: 4/5 | 예상 기간: 3-5일**

Phase 1과 3을 통합한다. flex 전환과 컨테이너 width 전략은 분리 불가.

**1a. containerSizes 단일화**
- TableHeaderArea.tsx -> `useTableContainerSize()` 컨텍스트 소비자로 변경
- Table.tsx -> containerSizes 계산을 `calcMinTotal()` 기반으로 변경 (**useMemo 사용하지 않음**, IIFE 유지)
- VirtualRowRenderer.tsx, PinnedRowRenderer.tsx -> `width: totalSize` -> `min-width: containerSizes.center` (Provider에서 가져옴)

**1b. Cell flex 전환**
- useCellLayout.ts ->
  - 고정 컬럼: `flex: '0 0 ${column.getSize()}px'`
  - auto 컬럼: `flex: '1 0 0%'`, `minWidth: column.columnDef.minSize ?? 50`
  - `position: absolute`, `left`, `width` 제거
  - `column.getStart()` 호출 제거
  - `getCellPosition()` 호출 제거
- layoutUtils.ts -> getCellPosition 함수 제거 또는 deprecated

**1c. Header Cell flex 전환**
- BaseTableHeaderCell.tsx -> 동일한 flex 속성 적용
- layoutUtils.ts -> getHeaderCellPosition 수정
  - 리프 헤더: Cell과 동일한 flex 속성
  - **그룹 헤더: `flex: '0 0 ${header.getSize()}px'`** (colSpan 비율이 아닌 실제 크기)
- TableHeader.tsx -> header row에 `display: flex` 확인/추가

**1d. Row width 수정**
- TableRow.tsx -> `width: '100%'` -> `min-width: '100%'` 또는 제거

**검증 체크리스트:**
- [ ] typecheck 통과
- [ ] 모든 browser test 통과
- [ ] 그룹 헤더 + 리사이즈 조합 수동 테스트
- [ ] 피닝(Left+Right) + 리사이즈 수동 테스트
- [ ] 수평 스크롤 동작 확인 (고정 컬럼만, auto만, 혼합)
- [ ] Storybook 전 스토리 시각 비교

### Phase 2: ResizeHandler 재배치
**리스크: 3/5 | 예상 기간: 1-2일**

- BaseTableHeaderCell.tsx -> overflow-hidden을 내부 콘텐츠 div로 이동
- TableHeader.tsx -> ResizeHandler를 sibling에서 BaseTableHeaderCell child로 이동
- ResizeHandler.tsx -> `left: cellPosition.left + cellPosition.width - 2` -> `right: -2px`
- PortalResizeGuide.tsx -> 좌표 계산 검증 (getBoundingClientRect 기반이므로 영향 없을 것)

### Phase 3: handleResizeStart 안전화
**리스크: 3/5 | 예상 기간: 1-2일**

이 Phase는 기존 계획에 없지만 **반드시 추가해야 함**.

- handleResizeStart에서:
  1. 모든 auto 컬럼의 DOM 너비를 동시 측정 (`getBoundingClientRect`)
  2. `flushSync(() => table.setColumnSizing(allMeasuredSizes))`
  3. `header.getResizeHandler()(event)` 호출
- handleResizeEnd에서:
  1. 리사이즈 대상이 아닌 컬럼들을 columnSizing에서 제거 (auto 복원)
- **이렇게 하면 레이아웃 점프와 race condition이 모두 해결됨**

### Phase 4: useColumnSizing 간소화 (별도 PR 권장)
**리스크: 4/5 | 예상 기간: 2-3일**

Phase 1-3이 안정적으로 동작한 후, 1-2주 경과 후 진행.

- ResizeObserver Effect 제거
- 3-pass 알고리즘(calculateColumnSizing) 제거
- AutoColumnSizing Feature 간소화
- 초기화 로직: `calculateColumnSizing()` -> 명시적 size가 있는 컬럼만 등록

**Phase 4는 성능 최적화 성격이 강하므로, Phase 1-3만으로도 "충분히 좋은" 결과를 달성할 수 있다.** Phase 4 없이도 getStart() 제거, 코드 간소화, 컨테이너 리사이즈 성능 개선이 달성되며, Phase 4는 추가적인 번들 사이즈 절감과 코드 복잡도 감소를 제공한다.

### Phase 5 (후속): CSS Variables 도입
**리스크: 2/5 | 예상 기간: 2-3일**

flex 기반 레이아웃이 안정화되면:
- 고정 너비 컬럼에 CSS variable 적용: `flex: 0 0 var(--col-X-width)`
- 리사이즈 중 `style.setProperty('--col-X-width', newWidth)` 로 React bypass
- 리사이즈 종료 시 React state로 동기화
- **드래그 리사이즈 성능: ~12ms -> ~0.5ms (60fps 안정 달성)**

---

## 추가 권장사항

1. **기대치 조정**: 이 리팩토링을 "성능 최적화"가 아닌 "아키텍처 개선 + 성능 기반 마련"으로 포지셔닝. 진정한 성능 도약은 Phase 5(CSS Variables)에서 달성.

2. **그룹 헤더 PoC**: Phase 1 착수 전에, 그룹 헤더가 있는 테이블에서 flex 레이아웃을 **브라우저에서 직접 테스트**하는 Proof of Concept을 30분 투자하여 수행. 코드 리뷰만으로는 확인 불가능한 CSS 동작이 있음.

3. **React.memo 검토**: Phase 1 이후 `TableCell`에 `React.memo` 적용 가능성을 검토. cell 객체의 참조 안정성을 TanStack Table 소스에서 확인하고, custom areEqual 함수로 비교 가능하면 리렌더링 횟수 자체를 줄일 수 있음.

4. **브라우저 테스트 강화**: Phase 1 전에 다음 조합 테스트 추가 권장:
   - Column Pinning + Column Resize (피닝된 컬럼 리사이즈)
   - Group Header + Column Resize (그룹 내 컬럼 리사이즈)
   - Column Ordering(DnD) + Resize (순서 변경 후 리사이즈)
   - 컨테이너 리사이즈 후 컬럼 리사이즈 (사이드바 토글 시나리오)

5. **StickyTreeRenderer 경로 확인**: `TableCenterRowSection.tsx`에서 `stickyTreeData`가 있을 때 사용되는 `StickyTreeRenderer`도 flex 전환 대상인지 확인 필요.

6. **단일 PR + Phase별 커밋**: Phase 1-3을 하나의 PR로, 커밋은 Phase별로 분리. `git revert`로 전체 PR을 한 번에 되돌릴 수 있도록 single merge commit 사용.

---

## 신뢰도: 8/10

### 근거

**높은 신뢰도 영역 (9+)**:
- containerSizes useMemo 버그 (95%): TanStack Table의 table ref 안정성은 공식 문서에서 확인 가능하며, useMemo 의존성 분석은 React의 기본 동작
- TableHeaderArea.tsx 이중 계산 문제 (95%): 코드에서 직접 확인, 리팩토링 시 불일치 발생이 확실
- flex가 리렌더링 횟수를 줄이지 않는다는 분석 (90%): React.memo 미적용 상태에서 부모 리렌더링 전파는 React의 기본 동작

**중간 신뢰도 영역 (70-85)**:
- 그룹 헤더 정렬 문제 (80%): 수학적으로 발생이 예상되지만 실제 브라우저 테스트 미수행
- 리사이즈 점프 (80%): auto -> 고정 전환 시 레이아웃 변화는 거의 확실하지만, 심각도는 auto 컬럼 수에 의존
- handleResizeStart race condition (65%): TanStack Table 내부 구현에 의존, 검증 필요

**불확실 영역**:
- flex vs absolute 레이아웃 성능 차이의 정확한 수치 (프로파일링 미수행)
- TanStack Table v8의 정확한 메모이제이션 전략 (소스 코드 미확인)
- externalColumnSizing 사용 패턴의 호환성 (소비자 파악 미완)

4개 경로의 분석이 핵심 이슈들에 대해 높은 수렴도를 보이고, 각 경로의 자체 약점 인식이 투명하므로 전체 신뢰도를 8/10으로 평가한다.

---

## 반대 의견 (미해결 분기점)

### 1. Phase 4(useColumnSizing 간소화)의 필요성

- **Pragmatist**: Phase 1-3만으로 충분, Phase 4는 별도 PR로 나중에 (55% 성공 확률)
- **Optimizer**: Phase 4의 ResizeObserver 제거가 컨테이너 리사이즈 44배 개선의 핵심. 생략하면 핵심 성능 가치를 놓침
- **미해결**: Phase 4 없이 flex만으로도 컨테이너 리사이즈 시 CSS가 자동 처리하므로 ResizeObserver의 React re-render만 피하면 됨. 하지만 TanStack 내부 상태와 CSS 렌더링의 불일치가 남아있으면 후속 리사이즈에서 문제 발생. **Phase 4의 "급한 정도"는 externalColumnSizing 사용 패턴에 달려 있음.**

### 2. CSS Variables를 Phase 1에 즉시 도입할 것인가

- **Optimizer**: "Phase 1.5"로 고정 컬럼에 즉시 CSS Variables 적용 권장 (116배 개선)
- **Pragmatist**: 변경 범위를 최소화하여 리스크 관리. CSS Variables는 flex 안정화 후에
- **미해결**: CSS Variables의 리스크는 낮지만 복잡도를 추가함. flex 전환만으로도 40+ 파일 수정인데 CSS Variables까지 추가하면 리뷰/디버깅 부담 증가. **실용적으로는 분리가 맞지만, 성능 목표가 명확하다면 통합도 합리적.**

### 3. `display: contents` 또는 CSS Grid subgrid 대안

- 어떤 경로도 깊이 분석하지 않았지만, Adversarial의 "cross-container synchronization" 문제를 근본적으로 해결하는 방법은 CSS Grid + subgrid 또는 `display: contents`일 수 있음
- 하지만 브라우저 호환성(subgrid: Safari 16+, Chrome 117+)과 가상화와의 호환성이 미검증
- **이 대안은 현재 계획의 범위 밖이지만, 향후 고려 가치가 있음**
