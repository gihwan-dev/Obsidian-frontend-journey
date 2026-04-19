---
id: ACH-20260411-001
createdAt: 2026-04-11
updatedAt: 2026-04-11
company: Exem
project: 차세대 대시보드
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 4
tags: [reliability, ci-cd, test-ops, gitlab-runner, playwright]
sources:
  - 10-Projects/Exem/01-Projects/차세대-대시보드/개발/브라우저 테스트 실패 수정.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/차세대-대시보드/개발/브라우저 테스트 실패 수정.md
    quote: "CI 파이프라인의 **브라우저 테스트**에서 28개 중 12개가 매번 동일하게 실패"
  - source: 10-Projects/Exem/01-Projects/차세대-대시보드/개발/브라우저 테스트 실패 수정.md
    quote: "8개 runner 전부 동일하게 변경 후 `docker restart gitlab-runner-exp`로 재시작."
openQuestions:
  - 변경 후 CI 브라우저 테스트 전체 통과 파이프라인 링크가 있는가?
  - 이 수정으로 재시도/대기 시간 또는 실패율이 얼마나 줄었는가?
---

# Outcome (1 line, result-first)

GitLab Runner `/dev/shm`을 64MB에서 2GB로 확장해, CI 브라우저 테스트 28개 중 12개가 반복 실패하던 Chromium 크래시 원인을 제거할 기반을 만들었다.

## Context

- 차세대 대시보드 CI에서 브라우저 테스트가 동일 패턴으로 실패했다.
- 로컬에서는 776개 테스트가 통과해 애플리케이션 코드보다 CI 실행 환경 문제가 의심되는 상황이었다.

## Actions

- 실패 메시지 `Failed to fetch dynamically imported module`을 Chromium/Vite import 구조와 연결해 분석했다.
- CI 컨테이너의 `/dev/shm`이 Docker 기본값 64MB로 제한된 사실을 확인했다.
- `gitlab-runner-exp` 및 기존 `gitlab-runner` 설정의 `shm_size`를 2GB로 변경했다.
- 8개 runner 설정을 동일하게 바꾸고 runner를 재시작했다.

## Results

- CI 브라우저 테스트 실패 원인을 애플리케이션 코드가 아닌 runner 공유 메모리 제한으로 좁혔다.
- 실행 컨테이너의 `/dev/shm`이 2GB로 늘어난 것을 검증했다.
- 변경 후 테스트 통과 로그와 실패율 변화는 추가 확인이 필요하다.

## Evidence

- 10-Projects/Exem/01-Projects/차세대-대시보드/개발/브라우저 테스트 실패 수정.md

## Resume Bullets (draft, Korean, non-bloat)

- GitLab Runner의 Docker `/dev/shm` 제한으로 발생한 Chromium 기반 브라우저 테스트 반복 실패를 분석하고, runner 8대의 `shm_size`를 2GB로 조정해 CI 안정화 기반을 마련했습니다.
