---
id: ACH-20260414-002
createdAt: 2026-04-14
updatedAt: 2026-04-15
company: Personal
project: gitlab-slash-command
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 3
tags: [architecture, multi-agent, intent-routing, maintainability, reliability]
sources:
  - 00-Inbox/Daily/2026-04-13.md
  - 00-Inbox/Daily/2026-04-14.md
evidenceSnippets:
  - source: 00-Inbox/Daily/2026-04-13.md
    quote: "GitLab mention 워크플로우를 고정된 specialist/팀 라우팅에서 오케스트레이터가 필요한 에이전트를 자율적으로 고르는 구조로 바꿔"
  - source: 00-Inbox/Daily/2026-04-13.md
    quote: "mention 프롬프트를 base와 overlay 구조로 재구성하고 레거시 orchestrator를 제거해"
  - source: 00-Inbox/Daily/2026-04-13.md
    quote: "자동 커밋과 저장소 도구 경로를 fail-closed 방향으로 보강하고 미사용 코드 탐지 설정을 추가해"
  - source: 00-Inbox/Daily/2026-04-14.md
    quote: "ClickUp 링크 탐지와 검색 에이전트 흐름을 보강했고"
  - source: 00-Inbox/Daily/2026-04-14.md
    quote: "E2E 테스트로 드러난 스키마와 응답 파싱 문제를 수정해 실제 멘션 처리의 안정성을 높였다."
openQuestions:
  - 오케스트레이터 중심 라우팅 전환 후 잘못된 specialist 선택이나 중복 지시가 얼마나 줄었는가?
  - fail-closed 보강 이후 자동 커밋/저장소 도구 경로에서 차단된 위험 사례가 있는가?
  - ClickUp 링크 탐지와 검색 에이전트 보강이 포함된 E2E 테스트나 MR 링크는 무엇인가?
---

# Outcome (1 line, result-first)
GitLab mention 자동화를 오케스트레이터 중심 라우팅과 base/overlay 프롬프트 구조로 재설계해 멀티에이전트 흐름의 유지보수성을 높였다.

## Context
- 고정된 specialist/팀 라우팅은 작업마다 필요한 에이전트를 프롬프트가 과하게 강제할 수 있었다.
- mention 프롬프트와 레거시 orchestrator가 중복되면 작업 맥락과 도구 설명이 불필요하게 비대해질 수 있었다.

## Actions
- GitLab mention 워크플로우를 오케스트레이터가 필요한 에이전트를 자율적으로 고르는 구조로 바꿨다.
- mention 프롬프트를 base와 overlay 구조로 재구성하고 레거시 orchestrator를 제거했다.
- 자동 커밋과 저장소 도구 경로를 fail-closed 방향으로 보강했다.
- 미사용 코드 탐지 설정을 추가해 유지보수 리스크를 점검했다.
- ClickUp 링크 탐지와 검색 에이전트 흐름을 보강하고, E2E 테스트에서 드러난 스키마와 응답 파싱 문제를 수정했다.

## Results
- 프롬프트가 작업 절차를 과하게 강제하지 않도록 멀티에이전트 라우팅 구조를 정리했다.
- 페르소나와 작업 맥락은 유지하면서 중복 지시와 불필요한 도구 설명을 줄였다.
- 실제 멘션 처리 흐름에서 스키마·응답 파싱 오류를 줄이는 보강을 더했다.

## Evidence
- 00-Inbox/Daily/2026-04-13.md
- 00-Inbox/Daily/2026-04-14.md

## Resume Bullets (draft, Korean, non-bloat)
- GitLab MR mention 자동화를 고정 specialist/팀 라우팅에서 오케스트레이터 중심 자율 에이전트 구성으로 재설계하고, base/overlay 프롬프트 구조로 중복 지시를 줄였습니다.
- 자동 커밋과 저장소 도구 경로를 fail-closed 방향으로 보강하고 미사용 코드 탐지 설정을 추가해 멀티에이전트 워크플로의 유지보수성을 점검했습니다.
