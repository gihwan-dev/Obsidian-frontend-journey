---
id: ACH-20260416-001
createdAt: 2026-04-16
updatedAt: 2026-04-16
company: Personal
project: claude-setup
role: Unknown
status: needs-metrics
impactScore: 3
evidenceScore: 2
tags: [dx-automation, gitlab, issue-triage, merge-request, workflow-quality]
sources:
  - 00-Inbox/Daily/2026-04-15.md
evidenceSnippets:
  - source: 00-Inbox/Daily/2026-04-15.md
    quote: "GitLab 이슈 추천 스킬을 새로 추가하고 기존 worker 스킬을 정리해"
  - source: 00-Inbox/Daily/2026-04-15.md
    quote: "`create-mr` 스킬에 이슈 검색과 `Closes` 어노테이션 규칙을 보강해"
openQuestions:
  - GitLab 이슈 추천 스킬이 실제로 추천한 이슈 수나 선택 정확도 근거는 무엇인가?
  - `create-mr`의 이슈 검색과 `Closes` 어노테이션이 적용된 MR 사례는 무엇인가?
  - MR 작성 시 누락되던 이슈 연결이 얼마나 줄었는가?
---

# Outcome (1 line, result-first)
GitLab 이슈 추천과 MR 이슈 연결 규칙을 스킬로 정리해, 작업 후보 선택과 MR 맥락 기록 흐름을 자동화했다.

## Context
- 개인 개발 워크플로우에서 작업 후보를 고르고 MR에 관련 이슈를 남기는 과정은 반복되기 쉽다.
- MR 설명에 연결 이슈가 빠지면 리뷰와 추적 맥락이 약해질 수 있다.

## Actions
- GitLab 이슈 추천 스킬을 새로 추가했다.
- 기존 worker 스킬을 정리해 작업 후보 선택 흐름을 더 직접적인 도구로 유지했다.
- `create-mr` 스킬에 이슈 검색과 `Closes` 어노테이션 규칙을 보강했다.

## Results
- 작업 후보를 고르는 흐름을 별도 GitLab 이슈 추천 도구로 분리했다.
- MR 작성 시 연결된 이슈를 남기는 규칙을 보강했다.

## Evidence
- 00-Inbox/Daily/2026-04-15.md

## Resume Bullets (draft, Korean, non-bloat)
- GitLab 이슈 추천 스킬과 `create-mr`의 이슈 검색·`Closes` 규칙을 보강해, 작업 후보 선택과 MR 이슈 연결 흐름을 자동화했습니다.
