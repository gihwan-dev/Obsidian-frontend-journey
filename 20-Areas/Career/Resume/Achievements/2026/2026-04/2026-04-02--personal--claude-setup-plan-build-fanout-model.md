---
id: ACH-20260402-001
createdAt: 2026-04-02
updatedAt: 2026-04-05
company: Personal
project: claude-setup
role: Unknown
status: needs-metrics
impactScore: 3
evidenceScore: 4
tags: [dx-automation, workflow-design, multi-agent, parallel-execution, session-isolation]
sources:
  - 00-Inbox/Daily/2026-04-01.md
  - 00-Inbox/Daily/2026-04-02.md
  - 00-Inbox/Daily/2026-04-03.md
  - 00-Inbox/Daily/2026-04-04.md
evidenceSnippets:
  - source: 00-Inbox/Daily/2026-04-01.md
    quote: "`design-task/bootstrap/implement-task` 체계를 `plan/build` 2단계로 전면 개편"
  - source: 00-Inbox/Daily/2026-04-01.md
    quote: "`$fanout` 스킬을 추가하고 읽기·쓰기·리뷰를 분리한 3단계 CSV 파이프라인으로 정리"
  - source: 00-Inbox/Daily/2026-04-02.md
    quote: "fallback 없는 실행 원칙과 병렬 작업 독립성을 정리했고"
  - source: 00-Inbox/Daily/2026-04-02.md
    quote: "lint·format 확인을 기본화하고 반복 가능한 리뷰 루프를 정리했고"
  - source: 00-Inbox/Daily/2026-04-03.md
    quote: "그룹 단위는 순차로, 그룹 내부는 병렬로 처리하는 `parallel codex` 확장 방향을 설계해"
  - source: 00-Inbox/Daily/2026-04-03.md
    quote: "결과물이 리뷰하기 쉬운 작은 MR로 남도록 병합 순서와 안내 방식까지 함께 다듬었고"
  - source: 00-Inbox/Daily/2026-04-04.md
    quote: "`snarktank/ralph` 흐름을 그대로 쓰기보다 매번 새 세션에서 시작하는 방식이 더 안정적인지 따져 보고"
  - source: 00-Inbox/Daily/2026-04-04.md
    quote: "Claude에 자연스럽게 녹아드는 명시적 스킬 구조로 바꾸는 방향을 정리했다."
  - source: 00-Inbox/Daily/2026-04-04.md
    quote: "불필요한 검증 게이트를 덜어내고 `dangerous` 실행과 PID 기록까지 포함하는 운영 조건을 맞춰"
openQuestions:
  - 이 재편 이후 장기 작업에서 프롬프트 길이, 작업 단계 수, 또는 재시도 횟수가 얼마나 줄었는가?
  - `fanout` 적용 전후로 병렬 작업 처리 시간이나 리뷰 대기 시간이 얼마나 달라졌는가?
  - lint·format 기본화 이후 리뷰 단계에서 발견되는 반복 수정이나 재작업 비율이 얼마나 줄었는가?
  - 그룹 순차·내부 병렬 모델 적용 후 메인 에이전트 컨텍스트 길이나 리뷰 가능한 MR 수가 어떻게 달라졌는가?
  - 매 반복 fresh-session 시작과 PID 기록 도입 후 중단된 실행을 다시 붙잡는 시간이 얼마나 줄었는가?
---

# Outcome (1 line, result-first)
장기 AI 작업 스킬 흐름을 `plan/build`와 독립 `fanout` 파이프라인으로 재편한 뒤, fresh-session 기반 스킬 구조와 PID 기록 운영 조건까지 묶어 더 통제 가능한 실행 모델로 정리했다.

## Context
- 장기 작업용 스킬 흐름이 `design-task/bootstrap/implement-task` 중심으로 비대해지며, 실제 작업을 이어 가는 기준이 과한 문서와 계약에 묶일 위험이 있었다.
- 병렬 작업도 다른 스킬에 종속되면 재사용성이 떨어졌고, 실행 원칙과 검증 루프가 느슨하면 작업 품질이 흔들릴 수 있었다.

## Actions
- 기존 장기 작업 스킬 체계를 `plan/build` 2단계로 전면 개편하고 `$fanout` 기반 병렬 실행 규칙을 별도 구조로 분리했다.
- 읽기·쓰기·리뷰를 나눈 3단계 CSV 파이프라인과 그룹 순차·내부 병렬 `parallel codex` 확장 방향을 함께 정리했다.
- fallback 없는 실행 원칙과 lint·format 기본 확인, 반복 가능한 리뷰 루프를 운영 계약에 포함시켰다.
- 결과물이 리뷰하기 쉬운 작은 MR로 남도록 병합 순서와 안내 방식을 다듬었다.
- `snarktank/ralph` 흐름을 그대로 가져오기보다 fresh-session 시작, 명시적 스킬 구조, `dangerous` 실행과 PID 기록 조건을 묶어 운영 기준을 다시 정리했다.

## Results
- 장기 작업에서 사용할 운영 모델을 더 짧은 단계, 분리된 병렬 규칙, 기본 품질 게이트 중심으로 재정의했다.
- 메인 에이전트 컨텍스트를 가볍게 유지하면서도 사람 검토가 가능한 작은 MR 단위로 남기는 운영 기준을 보강했다.
- fresh-session 시작과 PID 기록까지 포함한 실행 조건을 더해 반복 자동화를 운영자가 통제하기 쉬운 형태로 다듬었지만, 정량 효과는 아직 근거가 없어 계측이 필요하다.

## Evidence
- 00-Inbox/Daily/2026-04-01.md
- 00-Inbox/Daily/2026-04-02.md
- 00-Inbox/Daily/2026-04-03.md
- 00-Inbox/Daily/2026-04-04.md

## Resume Bullets (draft, Korean, non-bloat)
- 장기 실행형 AI 작업 흐름을 `plan/build` 2단계와 독립 `fanout` 파이프라인으로 재편하고 fresh-session 기반 실행 구조를 더해 더 통제 가능한 운영 모델로 고도화했습니다.
- 그룹 순차·내부 병렬 `parallel codex` 운영 모델과 PID 기록 기반 운영 조건을 정리해 병렬 자동화의 실행 추적성과 사람 검토 가능성을 함께 보강했습니다.
