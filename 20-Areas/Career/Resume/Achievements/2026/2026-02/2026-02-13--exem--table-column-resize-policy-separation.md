---
id: ACH-20260213-001
createdAt: 2026-02-15
updatedAt: 2026-02-20
company: Exem
project: Table 컴포넌트
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 4
tags: [architecture, reliability, table-component]
sources:
  - 10-Projects/Exem/01-Projects/Table 컴포넌트/설계/아키텍쳐 변경 - 20260213.md
  - 00-Inbox/Daily/2026-02-12.md
  - 00-Inbox/Daily/2026-02-19.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/Table 컴포넌트/설계/아키텍쳐 변경 - 20260213.md
    quote: "`ColumnResizePolicy` Feature가 TanStack Table 확장 지점에 추가되면서 리사이즈 계산의 중심이 정책 모듈로 이동했다."
  - source: 00-Inbox/Daily/2026-02-12.md
    quote: "컬럼 리사이즈 정책을 `우측 캐스케이드 + Flex Basis` 단방향 모델로 고정하고, 왼쪽 컬럼 불변 원칙을 유지하기로 결정했다."
  - source: 00-Inbox/Daily/2026-02-12.md
    quote: "Table 리사이즈 정책이 코드/테스트/문서에서 같은 모델로 정렬되어 회귀 원인 추적이 쉬워졌다."
  - source: 00-Inbox/Daily/2026-02-19.md
    quote: "main 충돌 해결과 변경 경로 정리를 진행하고, Table 행 클릭/하이라이팅/리사이징 관련 버그를 수정했다."
  - source: 00-Inbox/Daily/2026-02-19.md
    quote: "릴리즈/changeset 자동화 및 파이프라인 안정화 커밋을 정리했다."
openQuestions:
  - 적용 전/후 리사이즈 실패율 또는 사용자 오류 재현률은 어떻게 변했는가?
  - 다단 그룹 헤더 환경에서 히트박스 개선의 체감 지표(재시도 횟수, 조작 시간)는 있는가?
  - 릴리즈 자동화 안정화로 재시도율/실패율이 얼마나 감소했는가?
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
- 코드/테스트/문서 기준을 단일 모델로 정렬해 회귀 원인 추적이 쉬워졌다.
- Table 행 클릭/하이라이팅/리사이징 버그를 수정하고 릴리즈/changeset 자동화 커밋을 정리해 배포 안정화 기반을 보강했다.

## Evidence
- 10-Projects/Exem/01-Projects/Table 컴포넌트/설계/아키텍쳐 변경 - 20260213.md

## Resume Bullets (draft, Korean, non-bloat)
- Table 리사이즈 로직을 UI 핸들러와 정책 모듈로 분리해 테스트 가능한 구조로 재설계했다.
- 다단 그룹 헤더 대응을 위해 메타 컨텍스트 계층을 도입해 리사이즈 동작 일관성을 높였다.
