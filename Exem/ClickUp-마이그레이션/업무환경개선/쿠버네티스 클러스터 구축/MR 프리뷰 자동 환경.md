# MR 프리뷰 자동 환경

> contributors: 김종희 상무님, 최기환 사원

## 0. 요약
- 코드 리뷰의 편의성을 올리고 시간 단축을 위해 여러가지 시도를 하였습니다.
- 로컬에 개발 환경을 실행 하지 않아도 결과물을 확인 할 수 있도록, 팀원 공용 클러스터 구축하고 미리보기(Preview) 환경 생성을 자동화 하였습니다.

## 1. 개요

### 1.1 배경
- 코드 리뷰 개선이 필요했던 맥락: 리뷰 대기 지연, 컨텍스트 스위칭, 실행 환경 차이로 인한 재현성 이슈 등

### 1.2 목표
- 리뷰 대기 시간 ↓
- 리뷰에 들어가는 노력 ↓
- MR→배포까지의 사이클 타임(시간·일) ↓
→ 총 소요 시간을 개선

### 1.3 범위
- FE 중심 서비스(백엔드는 API 연동만 하고 CI/CD x)

### 1.4 결과
- 1~3단계 점진적 개선 후, 4단계 'MR 프리뷰 자동 환경'으로 리뷰 체감 편의성 및 속도 개선

---

## 2. 앞선 개선 활동 개요(1~3)

### 2.1 활동 #1 — 코드 리뷰 룰 개선
- **문제/가설**: 불명확한 커밋/MR 설명 → 리뷰 난이도↑
- **조치**: Conventional Commits, MR Template, Reviewer/Assignee 규칙, 커밋 훅(husky)
- **결과**: 리뷰 맥락 파악 시간 단축, 변경 범위 명료화
- **한계**: 실행 결과를 직접 테스트 하며 체감할 수 있는 '동작 화면' 부재

### 2.2 활동 #2 — GitLab→사내 메시지 도구(MM) 알림 미들웨어
- **목적**: 리뷰 알림·멘션 자동화로 피드백 왕복시간 단축
- **구성**: GitLab Webhook → 미들웨어 → MM 채널/스레드
- **효과**: 이벤트 가시성↑, 응답 지연↓
- **한계**: 코드 변경의 '체험'은 여전히 로컬 구성 의존

### 2.3 활동 #3 — 공용 개발환경 원클릭 서버 파이프라인
- **흐름**: 브랜치 선택 → 공용 서버 기동 → 리뷰어 공유 링크 제공
- **효과**: 로컬 체크아웃·빌드 없이 빠른 공유
- **한계**: 수동/반자동, 분기·동시성·정리(가비지) 이슈

---

## 3. 활동 #4 — MR 프리뷰 자동 환경 설계(핵심)

### 3.1 설계 목표/요구사항
- **기능**: MR 생성/수정 시 자동 생성·갱신, 종료(merge/close) 시 자동 회수
- **비기능**: 격리성, 10분 내 가동, 비용 상한, 보안 표준 준수, 관측성/추적성

### 3.2 사용자 시나리오
- **생성**: MR 오픈 → 이미지 빌드·배포 → 프리뷰 URL 확인
- **갱신**: MR 커밋 추가 → 롤링업데이트/재배포
- **종료**: MR 머지/클로즈 → 리소스·이미지 정리

### 3.3 아키텍처(개요)
- **VCS/CI**: GitLab + Jenkins
- **CD**: Argo CD (+ ApplicationSet/Generators)
- **클러스터**: Kubernetes on XCP-ng VM
- **Ingress & DNS**: NGINX Ingress, Cloudflare Wildcard DNS `mr-*.[도메인]`
- **Registry**: Nexus
- **HTTPS**: Cert-manager, LetsEncrypt
- **관측성**: Prometheus/Grafana, Portainer, ArgoCD

### 3.4 파이프라인(레퍼런스 흐름)

![](https://t25540965.p.clickup-attachments.com/t25540965/afedd298-ba55-4f37-9375-2e855ba02c87/image.png)

1. CI/CD
   - **트리거**: gitlab webhook `merge_request_events` / `push to MR`
   - **빌드**: 이미지 빌드, 태깅 `:mr-{number}-{head_short_sha}`
   - **푸시**: Nexus Registry
   - **배포**: Argo CD (gitops ApplicationSet)

- **게시**: MR 코멘트에 프리뷰 URL
- **알림**: MM 채널/스레드 업데이트

### 3.5 수명주기/정리(자동 회수)
- **종료 조건**: MR merge/close
- **정리 범위**: Deployments/Services/Ingress, ConfigMap, Image GC

### 3.6 리스크/한계
- 서버 사용량 증가
- FE 모듈 단독. 외부 의존성 테스트 한계
- 인프라 복잡도 및 구현 난이도

### 3.7 향후 계획
- 이미지 관리 도구 전환 (Nexus → Harbor, Kaniko → Buildkit)
- 모니터링 로깅 수단 강화 (Loki, Alloy, Falco, Sentry)
- SSO, Auth 도구로 인증 로직 추가하여 접근 제어 (keycloak, OAuth2-proxy)

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3120218*
