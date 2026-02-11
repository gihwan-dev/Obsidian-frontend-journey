## 요약
- 현재 빈 영역 문제의 루트 원인은 `columnSizing`이 생긴 컬럼을 고정폭으로 전환하고, 모든 컬럼이 고정되면 중앙 영역이 `고정 합계 너비`로만 렌더링되는 구조입니다.
- 동작을 전면 전환해서, 리사이즈 가능한 컬럼은 `flex-basis 가중치` 기반으로 렌더링하고 드래그 결과는 **오른쪽 컬럼들만 순차 재분배**합니다.
- 오른쪽 컬럼들의 `minSize`를 모두 소진하면 남는 변화량은 테이블 총폭 증가로 처리해서 **수평 스크롤**이 생기게 합니다.
- 그룹 헤더는 계속 리사이즈 핸들 없이 유지하고, 리프 컬럼 기준 오른쪽 순서대로(그룹 경계 관통) 재분배합니다.
- `enableResizing: false`/고정 컬럼은 재분배 대상에서 제외합니다.

## 구현 범위 (파일 단위)
1. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableHeaderCell/ResizeHandler.tsx`
- 리사이즈 세션(start/end) 관리 추가.
- `pointerdown` 시 대상 섹션(Left/Center/Right)의 리프 컬럼 실제 너비를 일괄 측정하여 `columnSizing`에 동기화.
- 리사이즈 종료 시(컬럼 `isResizing` true→false) 우측 캐스케이드 재분배 적용 후 `table.setColumnSizing()` 반영.

2. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/utils/resizeUtils.ts`
- 섹션 리프 컬럼 일괄 측정 유틸 추가.
- 우측 캐스케이드 재분배 유틸 추가.
- 규칙:
  - `delta > 0`(타깃 확장): 오른쪽 재분배 대상 컬럼을 순서대로 줄이며 `minSize`에서 멈춤. 남는 delta는 총폭 증가(수평 스크롤).
  - `delta < 0`(타깃 축소): 오른쪽 재분배 대상 컬럼을 순서대로 늘이되 `maxSize` 초과 금지. 흡수량까지만 타깃 축소(clamp).

3. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/utils/layoutUtils.ts`
- 리프 셀 스타일 모델 변경:
  - 리사이즈 대상 컬럼: `flex-grow=<basisWeight>, flex-shrink:1, flex-basis:0` + `minWidth/maxWidth`.
  - 고정 컬럼(`enableResizing:false` 등): 기존처럼 `flex:0 0 auto` + `width`.
- 그룹 flex 계산을 `header.subHeaders`가 아니라 **leaf 기준 합산**으로 변경해 그룹/중첩 그룹 정합성 강화.

4. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/hooks/useContainerSizes.ts`
- `hasAutoColumns` 의미를 실질적으로 `hasFlexibleCenterColumns`로 전환.
- center 최소 폭 계산을 `고정폭 합 + (가변 컬럼 minSize 합)` 기준으로 계산.
- 결과적으로 center는 기본적으로 꽉 채우고, min 합 초과 시에만 가로 스크롤이 생기도록 유지.

5. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/providers/TableContainerSizeProvider.tsx`
6. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableHeaderArea.tsx`
7. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableCenterRowSection.tsx`
8. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TablePinnedRowSection.tsx`
9. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/Table.tsx`
- `hasAutoColumns` 참조 전부를 `hasFlexibleCenterColumns` 의미로 맞추고, center width/minWidth 계산 일관화.
- `TableRemainingSpaceProvider`에 넘기는 `contentWidth` 계산도 새 모델에 맞춰 조정(가변 컬럼 존재 시 빈 영역 판정 방지).

10. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/helpers/compatibilityData.ts`
- `열 리사이즈` 상세 제약 문구 추가:
  - 우측 순차 재분배
  - 고정 컬럼 재분배 제외
  - 섹션 단위 동작(Left/Center/Right) + 그룹 경계 관통

11. 문서 반영
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnResize/ColumnResize.mdx`
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/docs/API/Options.mdx`
- 기존 “다른 컬럼 영향 없음” 설명을 새 동작(우측 재분배, min/max, 스크롤 조건)으로 업데이트.

## 공개 API/인터페이스 변경
- 새 옵션은 추가하지 않습니다. (`resizable` API shape 유지)
- `columnSizing: Record<string, number>` 타입은 그대로 유지하되, 문서 의미를 “고정 px 폭”에서 “레이아웃 basis(가중치)로 해석되는 수치”로 전환합니다.
- 기존에 저장된 수치 상태는 그대로 사용 가능하며, 새 모델에서 상대 가중치로 동작합니다.

## 테스트 계획
1. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnResize/ColumnResize.browser.test.tsx`
- 리사이즈 가능한 컬럼을 모두 조정한 뒤에도 우측 빈 영역이 생기지 않는지 검증.
- 컬럼 확장 시 오른쪽 컬럼들만 줄어드는지 검증.
- 오른쪽 흡수 여력(min) 소진 시 수평 스크롤 발생 검증.
- 타깃 축소 시 오른쪽 max 소진하면 타깃 축소가 clamp되는지 검증.
- `enableResizing:false` 컬럼이 재분배에 참여하지 않는지 검증.

2. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnGrouping/ColumnGrouping.browser.test.tsx`
- 그룹 내 마지막 리프 확장 시 다음 그룹 리프가 줄어드는(그룹 경계 관통) 시나리오 검증.
- 그룹 헤더 자체는 리사이즈 핸들이 없음을 유지 검증.

3. `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnPinning/ColumnPinning.browser.test.tsx` 또는 resize 통합 테스트 추가
- 좌측 고정 섹션 마지막 컬럼 확장 시 center 영역이 영향 받는 시나리오 검증.
- 섹션 경계 정합성(레이아웃 깨짐/겹침 없음) 검증.

4. 실행
- `pnpm vitest run --project browser packages/react/src/table/spec/ColumnResize/ColumnResize.browser.test.tsx`
- `pnpm vitest run --project browser packages/react/src/table/spec/ColumnGrouping/ColumnGrouping.browser.test.tsx`
- `pnpm vitest run --project browser packages/react/src/table/spec/ColumnPinning/ColumnPinning.browser.test.tsx`

## 가정 및 기본값
- 리사이즈 영향 범위는 “타깃 기준 오른쪽 컬럼”으로 고정합니다.
- 오른쪽 흡수 불가 시 수평 스크롤을 허용합니다.
- 그룹 헤더는 리사이즈 대상이 아니며, 리프 기준 순서로만 재분배합니다.
- 고정 컬럼(`enableResizing:false`)은 재분배에서 제외합니다.
- 섹션(Left/Center/Right) 경계를 넘는 직접 재분배는 하지 않지만, 섹션 너비 변화로 인한 center 영역 영향은 허용합니다.
