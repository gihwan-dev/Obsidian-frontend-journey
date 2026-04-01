---
id: ACH-20260401-001
createdAt: 2026-04-01
updatedAt: 2026-04-01
company: Personal
project: Obsidian TODO Management Automation
role: Unknown
status: needs-metrics
impactScore: 3
evidenceScore: 4
tags: [architecture-decision, dx-automation, todo-governance, obsidian]
sources:
  - 00-Inbox/Daily/2026-03-31.md
  - docs/design/todo-management-automation.md
evidenceSnippets:
  - source: 00-Inbox/Daily/2026-03-31.md
    quote: "루트 보드는 읽기 전용 허브로 두는 방향이 문서로 남았다."
  - source: docs/design/todo-management-automation.md
    quote: "Project kanban notes should own their own task lists."
  - source: docs/design/todo-management-automation.md
    quote: "The root board in v1 should remain read-only and navigation-oriented."
openQuestions:
  - 시간 단위 TODO 브리핑이 단일 프로젝트 기준인지, 전체 활성 프로젝트 기준인지 최종 범위가 무엇인가?
  - 이 구조 정리로 TODO 중복 관리나 수동 정리 시간이 얼마나 줄었는가?
---

# Outcome (1 line, result-first)
Obsidian vault의 TODO 운영 구조를 프로젝트 소유 보드와 읽기 전용 루트 허브로 고정해, 중복 authoritative board 없이 자동화 가능한 관리 경계를 정의했다.

## Context
- 볼트 안의 TODO가 프로젝트 노트, 칸반 노트, 일일 노트 참조로 분산돼 있어 자동화가 잘못된 노트를 수정할 위험이 있었다.
- 루트 보드와 프로젝트 보드가 동시에 상태를 가지면 이중 진실원이 생겨 유지 비용이 커질 수 있었다.

## Actions
- 루트 보드를 v1에서 읽기 전용 내비게이션 허브로 두고, 프로젝트 칸반이 작업 상태를 소유하도록 설계 방향을 문서화했다.
- 활성 프로젝트의 canonical pattern을 `project folder + direct-child TODO.md`로 좁혀 자동화의 읽기/쓰기 경계를 명확히 했다.
- v1 기본 보드 스키마를 `Backlog -> Todo -> Doing -> Done`과 체크리스트 카드 형식으로 고정했다.
- 동일 프로젝트 내부 이동만 `move`로 지원하고, 프로젝트 간 이동은 `remove + add`로 분리해 책임 경계를 정리했다.

## Results
- TODO 자동화가 어떤 보드를 읽고 수정해야 하는지에 대한 기준이 문서 수준에서 명확해졌다.
- 루트 허브와 프로젝트 보드 사이의 중복 소유를 피하는 운영 모델이 정리됐다.
- 정량 효과는 아직 근거가 없어 후속 계측이 필요하다.

## Evidence
- 00-Inbox/Daily/2026-03-31.md
- docs/design/todo-management-automation.md

## Resume Bullets (draft, Korean, non-bloat)
- Obsidian vault의 분산 TODO 체계를 프로젝트 소유 보드와 읽기 전용 루트 허브 구조로 재정의해, 자동화가 수정할 canonical board 경계를 명확히 했습니다.
- `project folder + direct-child TODO.md` 패턴과 고정 칸반 스키마를 정의해 TODO 자동화와 브리핑이 같은 운영 기준을 따르도록 설계했습니다.
