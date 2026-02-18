---
id: ACH-20260213-001
createdAt: 2026-02-15
updatedAt: 2026-02-15
company: Exem
project: Table 컴포넌트
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 4
tags: [architecture, reliability, table-component]
sources:
  - 10-Projects/Exem/01-Projects/Table 컴포넌트/설계/아키텍쳐 변경 - 20260213.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/Table 컴포넌트/설계/아키텍쳐 변경 - 20260213.md
    quote: "`ColumnResizePolicy` Feature가 TanStack Table 확장 지점에 추가되면서 리사이즈 계산의 중심이 정책 모듈로 이동했다."
openQuestions:
  - 적용 전/후 리사이즈 실패율 또는 사용자 오류 재현률은 어떻게 변했는가?
  - 다단 그룹 헤더 환경에서 히트박스 개선의 체감 지표(재시도 횟수, 조작 시간)는 있는가?
---

ColumnResizePolicy 도입으로 리사이즈 계산을 정책 모듈로 분리하고 헤더 메타 계층을 추가해 동작 일관성 기반을 확보했다. (needs-metrics)

## Context
- 아키텍처 변경 요약 문서(2026-02-13) 기준.
- 기존 UI 핸들러 결합 로직을 정책/세션/레이아웃 경계로 분리하는 설계 변경이다.
- 주요 목적은 다단 그룹 헤더의 히트박스 단절 문제와 테스트 가능성 개선이다.

## Actions
- 리사이즈 흐름을 "UI 이벤트 처리"와 "폭 계산 정책"으로 분리했다.
- `TableHeaderResizeMeta` 컨텍스트 계층을 도입해 컬럼별 메타를 제공했다.
- `ResizeHandler`를 세션/정책 호출 중심의 얇은 어댑터로 축소했다.

## Results
- 리사이즈 세션 수명주기와 one-way 폭 분배 규칙이 별도 경계로 정리됐다.
- 다단 그룹 헤더에서 핸들 높이/히트박스 처리 일관성을 확보할 수 있는 구조로 전환됐다.

## Evidence
- 10-Projects/Exem/01-Projects/Table 컴포넌트/설계/아키텍쳐 변경 - 20260213.md

## Resume Bullets (draft, Korean, non-bloat)
- Table 리사이즈 로직을 UI 핸들러와 정책 모듈로 분리해 테스트 가능한 구조로 재설계했다.
- 다단 그룹 헤더 대응을 위해 메타 컨텍스트 계층을 도입해 리사이즈 동작 일관성을 높였다.
