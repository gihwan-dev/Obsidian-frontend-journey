# Table 컴포넌트 아키텍처 평가: Absolute Positioning + div 렌더링

## 한 줄 결론

**현재 아키텍처는 올바른 선택이다.** 9-Grid 분할 + 가상 스크롤 + 행/열 고정이라는 요구사항 조합에서 네이티브 `<table>`은 구조적으로 불가능하며, absolute positioning + div + flex는 유일한 현실적 접근이다. 다만, 구현 내부에 몇 가지 개선이 필요한 취약점이 존재한다.

---

## 1. 왜 올바른가

### `<table>` 요소를 사용할 수 없는 구조적 이유

네이티브 `<table>`의 레이아웃 알고리즘은 세 가지를 전제한다:
- 모든 행이 DOM에 존재해야 열 너비 계산 가능
- 모든 셀이 동일한 포맷팅 컨텍스트에 있어야 함
- 단일 스크롤 컨텍스트로 동작

EXEM UI Table의 요구사항은 이 세 전제를 **모두 위반**한다:
- **가상 스크롤**: DOM에 ~20개 행만 존재 → 전제 1 위반
- **열 고정(pinning)**: 좌/중앙/우 3분할 → 전제 2 위반
- **행 고정(pinning)**: 상/중앙/하 3분할 → 전제 3 위반

CSS 명세상 `display: table` + `position: absolute`는 충돌하고, `display: contents` 우회는 접근성 트리를 파괴한다. **이것은 "best practice를 무시한 것"이 아니라, best practice의 전제조건이 성립하지 않는 영역이다.** ag-grid, MUI DataGrid, Ant Design Table 모두 동일한 결론에 도달했다.

### Absolute Positioning + Flex의 합리적 관심사 분리

- **수직 축** (행 간): `position: absolute` — 가상화로 DOM이 동적이므로 프로그래밍적 제어 필수. O(1) reflow 보장.
- **수평 축** (셀 간): `display: flex` — 모든 열이 항상 DOM에 존재하므로 브라우저 레이아웃 엔진에 위임 가능.

---

## 2. 잘 설계된 부분

- **메모이제이션**: `areTableRowPropsEqual`의 12-prop 개별 비교, `areVirtualItemsEqual`로 VirtualItem 구조적 비교, `shallowEqualRecord`로 columnSizing 참조 안정화
- **이벤트 위임**: `data-row-id` 기반 `closest()` + `isInteractiveTarget` 가드
- **ARIA 매핑**: `role="table/rowgroup/row/cell/columnheader"`, `aria-selected`, `aria-sort` 적절 배치
- **Provider 구조**: 11개 Provider 각각 단일 책임, 디버깅 추적 용이

---

## 3. 개선이 필요한 취약점 (우선순위순)

| 우선순위 | 문제 | 영향 | 권고 |
|---------|------|------|------|
| **높음** | `areTableRowPropsEqual`에 새 prop 추가 시 비교 누락 → silent bug | 렌더링 버그, 디버깅 극난이도 | `keyof TableRowProps` 기반 자동 검증 유틸리티 또는 lint 규칙 |
| **높음** | 컬럼 리사이즈 시 ~1,200 cell 동시 리렌더링 (~120ms, 체감 8fps) | UX 심각 저하 | rAF throttle + 완료 후에만 실제 sizing 업데이트 |
| **중간** | 스크롤 동기화 source of truth 부재 → 고속 스크롤 시 jitter | 1-2px 불일치, 시각적 불편 | `isScrollingFrom` 플래그로 소스 고정 |
| **중간** | 3-section `measureElement` 3회 호출 → 측정 오염 | column 내용 높이 다를 때 비결정적 높이 | center에서만 measure, left/right는 참조 |
| **중간** | `useDeepMemo`의 `isEqual`이 대량 데이터에서 ~30ms blocking | 모니터링 대시보드 jank | immutable pattern 권장 + version counter 도입 |
| **낮음** | `aria-rowcount`/`aria-rowindex` 미구현 | 스크린 리더 전체 크기 인식 불가 | 저비용 추가 (2줄 코드) |
| **낮음** | Pinned row 높이 고정값 가정 | dynamic content 시 겹침/잘림 | 측정 기반 계산 또는 제약 문서화 |

---

## 4. Confidence Assessment

| 항목 | 수준 |
|------|------|
| **Convergence** | 3/3 경로 동의 — "아키텍처 자체는 올바름" |
| **Evidence Quality** | HIGH — 코드 기반 분석 + 업계 패턴 비교 |
| **Risk Level** | MEDIUM — 구현 내부 취약점 존재, 아키텍처 레벨은 안전 |
| **2년 유효성** | 유효 — TanStack 생태계 안정성 + CSS 기본 스펙만 의존 |

## 참고

- [[Absolute + Flex 렌더링 전략]]
- [[파악한 성능 개선 필요 포인트]]
