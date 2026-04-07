---
id: ACH-20260403-001
createdAt: 2026-04-03
updatedAt: 2026-04-07
company: Personal
project: gitlab-slash-command
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 4
tags: [architecture, durable-execution, kubernetes, postgresql, reliability]
sources:
  - 00-Inbox/Daily/2026-04-02.md
  - 00-Inbox/Daily/2026-04-03.md
  - 00-Inbox/Daily/2026-04-06.md
evidenceSnippets:
  - source: 00-Inbox/Daily/2026-04-02.md
    quote: "LangGraph HIL durable execution 아키텍처로 전환했고"
  - source: 00-Inbox/Daily/2026-04-02.md
    quote: "클러스터 내부 PostgreSQL 배포와 차트 구성을 추가했고"
  - source: 00-Inbox/Daily/2026-04-02.md
    quote: "체크포인터와 의존성 대기 설정까지 묶어 배포 순서를 안정화했고"
  - source: 00-Inbox/Daily/2026-04-03.md
    quote: "automation 라벨을 다시 붙였을 때 작업을 초기화하고 triage를 다시 시작하는 흐름을 점검하며"
  - source: 00-Inbox/Daily/2026-04-03.md
    quote: "MR 파이프라인 실패까지 확인하며 어떤 변경부터 검토하고 병합할지 판단 기준을 구체화했다"
  - source: 00-Inbox/Daily/2026-04-06.md
    quote: "실제 커밋 누락과 후속 응답 오류를 줄이는 방향으로 워크플로우를 다듬어 두었다."
  - source: 00-Inbox/Daily/2026-04-06.md
    quote: "봇 계정명과 세션 식별 규칙이 바뀌어도 흔들리지 않도록 트리거 방식과 런타임 설정 구조를 손보는 작업을 이어 갔고"
openQuestions:
  - durable execution 전환 후 slash command 세션 재개 성공률이나 중단 후 복구 사례를 어떤 로그로 확인할 수 있는가?
  - DB 준비 대기 설정 이후 시작 실패나 재배포 실패가 얼마나 줄었는가?
  - automation 라벨 재적용 이후 triage 재시작 시간이 얼마나 짧아졌고 수동 개입이 얼마나 줄었는가?
  - 커밋 누락과 후속 응답 오류를 줄이기 위해 조정한 워크플로우가 실제 실패 건수를 얼마나 낮췄는가?
---

# Outcome (1 line, result-first)
`gitlab-slash-command`의 durable execution 토대 위에 트리거·런타임 설정을 더 단단히 정리해 멘션 자동화의 커밋 누락·후속 응답 오류를 줄이는 운영 기준까지 확장했다.

## Context
- 장기 실행형 slash command는 중간 상태를 보존하지 못하면 작업이 끊기고 인수인계 비용이 커질 수 있었다.
- 애플리케이션 구조 전환만으로는 부족했고, 체크포인터와 저장소를 포함한 배포 순서를 함께 안정화해야 했다.

## Actions
- 이슈 #33 대응 구조를 LangGraph HIL durable execution 아키텍처로 전환했다.
- 클러스터 내부 PostgreSQL 배포와 Helm 차트 구성을 추가해 상태 저장소 기반을 마련했다.
- 체크포인터와 의존성 대기 설정을 묶어 서비스가 DB 준비 이전에 올라오지 않도록 배포 순서를 조정했다.
- automation 라벨 재적용 시 작업을 초기화하고 triage를 다시 시작하는 제어 흐름을 점검해 운영 제어 기준을 다듬었다.
- MR 파이프라인 실패까지 함께 확인해 병렬 작업 우선순위와 병합 판단 기준을 정리했다.
- 실제 커밋 누락과 후속 응답 오류를 줄이기 위해 멘션 기반 워크플로우를 다시 점검하고 조정했다.
- 봇 계정명과 세션 식별 규칙 변화에도 흔들리지 않도록 트리거 방식과 런타임 설정 구조를 손봤다.

## Results
- slash command 작업이 상태를 보존한 채 이어질 수 있는 실행 기반을 마련했다.
- durable execution 전환에 필요한 애플리케이션 구조와 인프라 저장소를 함께 정리했다.
- 재시작·우선순위·병합 판단까지 포함한 운영 제어 기준을 보강해 장기 실행 자동화 흐름을 더 예측 가능하게 다듬었다.
- 계정명·세션 규칙 변경에도 버틸 수 있는 트리거와 런타임 설정 방향을 정리해 멘션 자동화 운영 안정성을 보강했다.
- 정량 효과는 아직 근거가 없어 후속 운영 계측이 필요하다.

## Evidence
- 00-Inbox/Daily/2026-04-02.md
- 00-Inbox/Daily/2026-04-03.md
- 00-Inbox/Daily/2026-04-06.md

## Resume Bullets (draft, Korean, non-bloat)
- `gitlab-slash-command`를 LangGraph HIL durable execution 구조로 전환하고 클러스터 내부 PostgreSQL 배포를 함께 구성해 상태 보존형 실행 기반을 마련했습니다.
- automation 라벨 재적용 흐름, 멘션 트리거 방식, 런타임 설정 구조를 함께 손봐 계정명·세션 규칙 변화에도 자동화가 덜 흔들리도록 운영 기준을 정리했습니다.
