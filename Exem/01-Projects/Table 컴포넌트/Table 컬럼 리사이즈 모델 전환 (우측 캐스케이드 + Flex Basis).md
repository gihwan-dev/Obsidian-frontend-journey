## 요약
- 목표는 `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/Table.tsx` 기반 테이블의 컬럼 리사이즈를 “빈 영역 없이 확장”, “우측 순차 재분배”, “한계 도달 시 가로 스크롤” 규칙으로 통일하는 것입니다.
- 사용자 결정사항을 확정 반영합니다.
- 확장 시 영향은 우측 컬럼만 받습니다.
- 우측 컬럼이 모두 `minSize`면 남는 변화량은 테이블 총폭 증가로 처리해 수평 스크롤을 발생시킵니다.
- `enableResizing: false` 컬럼은 재분배 대상에서 제외하고 skip합니다.
- 그룹 경계는 관통하고, 그룹 헤더 폭은 리프 합산으로 즉시 갱신합니다.
- 저장된 `columnSizing` 초기값은 `min/max`만 clamp합니다.

## 공개 API/타입 영향
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/types/table.types.ts`의 `resizable` API shape는 변경하지 않습니다.
- `columnSizing: Record<string, number>` 타입도 유지합니다.
- 문서 의미만 갱신합니다.
- 기존: 사실상 “명시적 px 고정폭”으로 동작.
- 변경 후: “리사이즈 기준 폭(basis) 수치”로 해석되고, 렌더링 시 flex 레이아웃 정규화로 빈 영역 없이 유지.

## 구현 설계 (결정 완료)
1. 리사이즈 세션 스냅샷 도입
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableHeaderCell/ResizeHandler.tsx`
- `pointerdown` 시점에 세션 스냅샷을 저장합니다.
- 대상 컬럼 ID, 섹션(left/center/right), 섹션 내 visible leaf 순서, 시작 폭, 시작 `columnSizing`.
- 급격한 드래그 대응을 위해 중간 이벤트 누적이 아니라 “시작값 대비 종료값(최종 delta)”만 사용합니다.

2. 우측 캐스케이드 재분배 알고리즘 구현
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/utils/resizeUtils.ts`
- `finalizeResizeCascade(session, currentSizing)` 유틸을 추가합니다.
- 확장(delta > 0):
- 대상 오른쪽 후보를 순서대로 줄이고 각 컬럼 `minSize`에서 정지.
- 남는 delta는 대상 컬럼에 그대로 더해 총폭 증가를 허용(수평 스크롤 유도).
- 축소(delta < 0):
- 오른쪽 후보를 순서대로 늘리고 각 컬럼 `maxSize`에서 정지.
- 우측 흡수 한계 도달 시 대상 축소량을 clamp.
- 오른쪽 후보 선정:
- 같은 섹션의 오른쪽 visible leaf만 대상.
- `enableResizing: false`는 skip.
- 그룹 여부와 무관하게 리프 순서 기준.

3. 리사이즈 종료 훅 처리
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableHeaderCell/ResizeHandler.tsx`
- `isResizing` true→false 전환 시 1회 finalize 실행.
- TanStack 기본 결과(`columnSizing`) 위에 캐스케이드 결과를 후처리로 적용해 최종 상태 확정.
- 제어/비제어 모드 모두 동일하게 작동.

4. 리프/그룹 스타일 계산 전환
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/utils/layoutUtils.ts`
- `isFixedWidthColumn` 판정 규칙을 수정합니다.
- 고정폭 컬럼: `enableResizing:false` 또는 유틸리티 고정 컬럼.
- 가변 컬럼: 리사이즈 가능 컬럼.
- 가변 컬럼 스타일은 `columnSizing` 기반 basis를 사용하는 flex 스타일로 통일합니다.
- 그룹 헤더 폭(`computeGroupFlex`, `getGroupMinWidth`)은 리프 컬럼 합 기준으로 재계산하여 그룹 경계 관통 시 즉시 정합 유지.

5. 빈 영역 제거용 정규화 단계 추가
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/hooks/useContainerSizes.ts`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/Table.tsx`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/providers/TableContainerSizeProvider.tsx`
- 렌더 기준 폭 합이 컨테이너보다 작을 때 가변 컬럼 basis를 정규화해 항상 꽉 차게 유지합니다.
- 모든 컬럼 리사이즈 후에도 오른쪽 빈 영역이 생기지 않게 합니다.
- `hasAutoColumns` 의미를 새 모델에 맞춰 재정의(사실상 flexible 존재 여부).

6. Pinned 극단 케이스 방어
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableHeaderArea.tsx`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/components/TableCenterRowSection.tsx`
- Left/Right pinned 확대로 center 영역이 음수가 되지 않도록 폭 계산 clamp를 둡니다.
- center 0px까지는 허용하되 음수/깨짐은 금지합니다.

7. 초기 저장값 정합성 처리
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/features/optionsBridge.ts`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/utils/resizeUtils.ts`
- `initialColumnSizing`/외부 `columnSizing` 입력값을 정규화합니다.
- `min/max` 범위만 clamp.
- `maxSize` 미지정 시 상한 강제 없음.
- 음수/NaN/0 이하 값은 무시하고 기본 폭 계산 경로 사용.

8. 소수점/1px gap 안정화
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/providers/TableRemainingSpaceProvider.tsx`
- `hasRemainingSpaceX/Y` 판정에 epsilon(1px)을 적용해 zoom/배율에서 1px 틈 판단 흔들림을 줄입니다.

9. 호환성/문서 업데이트
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/helpers/compatibilityData.ts`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnResize/ColumnResize.mdx`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnSizing/ColumnSizing.mdx`
- 파일: `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/docs/API/Options.mdx`
- `열 리사이즈` 제약 상세에 우측 캐스케이드/skip/overflow 정책을 명시합니다.
- “다른 컬럼 영향 없음” 문구는 새 정책에 맞춰 수정합니다.

## 테스트 계획 (수용 기준 포함)
1. 기존 회귀 유지
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnResize/ColumnResize.browser.test.tsx`
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnSizing/ColumnSizing.browser.test.tsx`
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnGrouping/ColumnGrouping.browser.test.tsx`
- `/Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnPinning/ColumnPinning.browser.test.tsx`

2. 신규 케이스 추가
- 오른쪽 전멸 상태에서 확장 시 즉시 수평 스크롤 발생.
- 마지막 컬럼 확장 시 수평 스크롤 발생.
- 급격 드래그 후 최종 delta가 정확 반영.
- `enableResizing:false` 즉시 이웃 skip 동작 확인.
- 그룹 A 마지막 리프 확장 시 그룹 B 리프 감소 + 그룹 헤더 폭 정합.
- left pinned 과대 확장 시 center 음수 방지.
- 작은 뷰포트 축소 시 overflow로 처리되고 레이아웃 깨짐 없음.
- 과대 초기 `columnSizing` 입력 시 min/max clamp만 적용됨.
- zoom 환경에서 1px gap 오판정 감소.

3. 실행 명령
- `pnpm vitest run --project browser /Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnResize/ColumnResize.browser.test.tsx`
- `pnpm vitest run --project browser /Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnGrouping/ColumnGrouping.browser.test.tsx`
- `pnpm vitest run --project browser /Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnPinning/ColumnPinning.browser.test.tsx`
- `pnpm vitest run --project browser /Users/choegihwan/.codex/worktrees/a8bc/exem-ui/packages/react/src/table/spec/ColumnSizing/ColumnSizing.browser.test.tsx`

## 가정 및 기본값 (확정)
- 재분배는 우측 순차 캐스케이드만 사용합니다.
- 리사이즈 불가 컬럼은 skip합니다.
- 그룹 경계는 관통합니다.
- 우측 흡수 불가 확장분은 총폭 증가로 처리합니다.
- 축소 시 우측 `maxSize` 한계면 대상 축소를 clamp합니다.
- 초기값 정규화는 `min/max` clamp만 수행합니다.
- center 폭은 0까지 허용, 음수는 허용하지 않습니다.
