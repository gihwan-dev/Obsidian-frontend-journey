---
id: ACH-20260304-001
createdAt: 2026-03-04
updatedAt: 2026-03-05
company: Exem
project: DPM 대시보드
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 4
tags: [production-delivery, reliability, feature-flag, tenant-isolation]
sources:
  - 10-Projects/Exem/01-Projects/DPM 대시보드/개발/컴팩트 UI 수정.md
  - 10-Projects/Exem/01-Projects/DPM 대시보드/개발/피쳐 플래그 추가.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/DPM 대시보드/개발/컴팩트 UI 수정.md
    quote: "Feature Flag 기반으로 전환해서 신한은행 플래그 추가"
  - source: 10-Projects/Exem/01-Projects/DPM 대시보드/개발/컴팩트 UI 수정.md
    quote: "원치 않는 변경이 다른 고객사로 퍼질 수 있음"
  - source: 10-Projects/Exem/01-Projects/DPM 대시보드/개발/피쳐 플래그 추가.md
    quote: "동적 칼럼/정적 칼럼 분기 처리해서 신한 은행은 고정으로 처리"
openQuestions:
  - Feature Flag 적용 전/후 고객사별 이슈 전파 건수를 어떤 운영 지표로 비교할 수 있는가?
  - 고객사별 플래그 운영 후 배포 검증 리드타임 단축 효과를 어떤 방식으로 계측할 수 있는가?
---

# Outcome (1 line, result-first)
Feature Flag 전환으로 고객사별 변경 영향 범위를 격리하는 배포 경로를 확정했다 (needs-metrics).

## Context
- DPM 대시보드의 컴팩트 UI 변경을 적용할 때, 이미 배포된 고객사별 영향 분리가 필요했다.
- 고객사 간 공통 코드 경로에서 변경이 전파되면 원치 않는 동작 변화가 발생할 수 있었다.
- 전면 제거 대신 고객사 플래그 기반 전환으로 납품/확장 가능성을 함께 고려했다.

## Actions
- 컴팩트 UI 처리 전략을 고객사별 Feature Flag 적용 방식으로 전환했다.
- 신한은행 대상 플래그를 별도로 추가해 적용 대상을 명시했다.
- 공통 변경의 전파 리스크를 기준으로 적용 경로를 점검했다.
- 동적/정적 칼럼 분기를 적용해 신한은행 경로를 고정 처리로 분리했다.

## Results
- 고객사별로 변경 적용 범위를 분리할 수 있는 운영 기준을 마련했다.
- 대시보드 변경 시 타 고객사 영향 리스크를 관리 가능한 형태로 낮췄다.
- 고객사별 칼럼 처리 경로를 분리해 특정 고객사 동작을 고정 운영할 수 있게 했다.

## Evidence
- 10-Projects/Exem/01-Projects/DPM 대시보드/개발/컴팩트 UI 수정.md
- 10-Projects/Exem/01-Projects/DPM 대시보드/개발/피쳐 플래그 추가.md

## Resume Bullets (draft, Korean, non-bloat)
- DPM 대시보드 컴팩트 UI 변경을 고객사별 Feature Flag 전환으로 설계해 변경 영향 범위를 격리했습니다.
- 신한은행 대상 플래그를 분리 적용해 타 고객사로의 원치 않는 변경 전파 리스크를 줄이는 운영 경로를 구축했습니다.
