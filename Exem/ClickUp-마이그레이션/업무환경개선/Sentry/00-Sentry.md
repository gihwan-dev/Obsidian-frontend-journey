# Sentry

## 도입 배경
- 클라이언트 로깅 솔루션을 찾던중 sentry 라는 도구를 알게됨
  - 웹 서비스에 플러그인을 설치해서 사용자 오류가 발생하면 sentry 에 에러 시점의 브라우저 상태와 사용자 동작 등을 저장해두는 도구
- 팀내 프로젝트에 도입하면 QA 와 협업하기 편하고, 상용 서비스에도 많이 쓰이는 솔루션이기 때문에 개발자 경험에도 많은 도움이 될 것으로 예상함

## 설치

### 1. sentry download
- https://develop.sentry.dev/self-hosted/

```bash
mkdir sentry
cd sentry
wget https://github.com/getsentry/self-hosted/archive/refs/tags/25.11.0.tar.gz
tar -xzvf 25.11.0.tar.gz
```

### 2. sentry configuration
- https://develop.sentry.dev/self-hosted/configuration/
- config.yml, sentry.conf.py 파일 설정

## 활용

### gitlab error tracking
- gitlab error tracking 기능으로 sentry 에 리스트업 된 에러 목록을 gitlab 에서 바로 확인 가능

### gitlab integration
- sentry 의 에러 목록에서 gitlab 이슈로 연결 가능
- integration을 이용해서 sentry > gitlab issue 생성 플로우

## 하위 문서
- [[MFO 2512 릴리즈 테스트 환경에 도입]]

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3296958*
