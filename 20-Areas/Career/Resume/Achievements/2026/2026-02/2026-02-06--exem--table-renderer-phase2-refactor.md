---
id: ACH-20260206-001
createdAt: 2026-02-15
updatedAt: 2026-02-15
company: Exem
project: Table 컴포넌트
role: Unknown
status: ready
impactScore: 4
evidenceScore: 5
tags: [architecture, reliability, dx-automation, table-component]
sources:
  - 10-Projects/Exem/01-Projects/Table 컴포넌트/개발/2차 리팩토링/마일스톤.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/Table 컴포넌트/개발/2차 리팩토링/마일스톤.md
    quote: "1. **구현 결과**: 4 commits로 Phase 2 완료"
openQuestions:
  - 없음
---

`pnpm test` 91 suites/743 tests 통과를 유지하며 Table 렌더러 분리 리팩토링 Phase 2를 4 commits로 완료했다.

## Context
- Table 2차 리팩토링 문서의 Phase 2 세션 노트 기준.
- `splitRows` 중앙화와 렌더러 분리가 같은 변경 묶음으로 진행됨.
- 검증 기록(typecheck/lint/test)이 같은 문서에 명시됨.

## Actions
- `rowRendererUtils.ts`, `PinnedRowRenderer.tsx`, `VirtualRowRenderer.tsx`를 신규 생성했다.
- `splitRows`를 `TableBodyArea` 기준으로 중앙화하고 props 전달 구조로 전환했다.
- `TableCenterRowSection` 구조를 수정하고 rowHeight 계산 버그를 보정했다.
- `TableBodySegment.tsx`를 제거(176줄)하고 lint 정리를 완료했다.

## Results
- `pnpm typecheck`, `pnpm lint`, `pnpm test`(91 suites/743 tests) 전체 통과를 유지했다.
- 행 렌더링 책임이 Pinned/Virtual Renderer로 분리되어 변경 경계가 명확해졌다.

## Evidence
- 10-Projects/Exem/01-Projects/Table 컴포넌트/개발/2차 리팩토링/마일스톤.md

## Resume Bullets (draft, Korean, non-bloat)
- Table 렌더링 구조를 Renderer 분리 + splitRows 중앙화로 재구성하고 91 suites/743 tests 통과를 유지했다.
- 4개 커밋 단위로 리팩토링을 분할해 회귀 리스크를 낮추고 리뷰 경계를 명확히 했다.
