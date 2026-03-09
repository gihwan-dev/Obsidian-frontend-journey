---
id: ACH-20260309-001
createdAt: 2026-03-09
updatedAt: 2026-03-09
company: Exem
project: Swagger MCP
role: Unknown
status: needs-metrics
impactScore: 3
evidenceScore: 4
tags: [architecture, api-diff, dx-automation, mcp]
sources:
  - 10-Projects/Exem/01-Projects/Swagger MCP/기획/웹-서비스-MVP.md
  - 10-Projects/Exem/01-Projects/Swagger MCP/설계/스냅샷-diff-아키텍처.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/Swagger MCP/기획/웹-서비스-MVP.md
    quote: "MVP는 \"변경 검토 도구\"로 제한한다."
  - source: 10-Projects/Exem/01-Projects/Swagger MCP/설계/스냅샷-diff-아키텍처.md
    quote: "기본 응답은 changed-only로 제한한다."
  - source: 10-Projects/Exem/01-Projects/Swagger MCP/설계/스냅샷-diff-아키텍처.md
    quote: "내부 비교 키를 `{url, method}`로 고정"
openQuestions:
  - diff-first 응답 적용 후 API 변경 검토 시간이 배포 1회당 얼마나 단축됐는가?
  - full spec 전달 대비 AI 입력 토큰 감소율은 얼마인가?
  - breaking 누락 탐지율 개선을 확인할 실제 운영 케이스 수는 몇 건인가?
---

# Outcome (1 line, result-first)
Swagger MCP를 full-spec 재조회 방식에서 snapshot/diff-first 아키텍처로 전환하는 기준 설계와 인터페이스 계약(MCP/HTTP/Web)을 확정했다(TBD: 운영 지표).

## Context
- 기존 방식은 변경 이력 누적이 약해 FE/AI가 전체 endpoint를 반복 검토해야 했다.
- 변경 영향만 빠르게 확인할 수 있는 비교 중심 구조가 필요했다.

## Actions
- MVP 범위를 "변경 검토 도구"로 제한하고 비목표(자동 스케줄, 외부 포털 등)를 명시했다.
- 계층형 아키텍처(Transport/Application/Domain/Infrastructure)와 데이터 모델(snapshot, operations, diffs)을 정의했다.
- canonical normalize + structural fingerprint 규칙을 수립해 노이즈 diff를 줄이는 기준을 문서화했다.
- diff 분류(`breaking/non-breaking/info`)와 `{url, method}` 비교 키를 명확히 고정했다.
- MCP/HTTP/Web의 공통 응답 shape(`summary`, `counts`, `changes`) 정합 기준을 정의했다.

## Results
- Swagger 변경 검토 흐름이 "전체 조회"에서 "changed-only 우선"으로 설계 전환됐다.
- 배포 간 API 차이를 재현 조회할 수 있는 snapshot/diff 저장 구조가 문서화됐다.
- 운영 성과 수치는 아직 확정되지 않아 후속 측정이 필요하다.

## Evidence
- 10-Projects/Exem/01-Projects/Swagger MCP/기획/웹-서비스-MVP.md
- 10-Projects/Exem/01-Projects/Swagger MCP/설계/스냅샷-diff-아키텍처.md

## Resume Bullets (draft, Korean, non-bloat)
- Swagger MCP의 변경 검토 도구 MVP를 기획하며 snapshot 저장·diff 조회·endpoint 상세 비교를 핵심 범위로 고정해 API 변경 추적 기준을 표준화함.
- full spec 재조회 대신 changed-only 응답을 기본으로 하는 diff-first 아키텍처와 `{url, method}` 비교 규칙을 설계해 FE/AI 수정 입력 범위를 축소할 기반을 마련함.
