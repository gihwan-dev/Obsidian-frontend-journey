# GCP 예산 한도 설정

#resume-with-ai #quick-win #보안

## 요약
GCP Console에서 Vertex AI 프로젝트에 일일/월간 예산 알림과 상한선을 설정한다.

## 왜?
- `/api/chat` 엔드포인트에 인증도 Rate Limiting도 없음
- 누구든 `curl` 반복 호출로 Vertex AI 비용을 발생시킬 수 있음
- 예산 한도는 5분 만에 설정 가능하고, 비용 폭주의 80%를 방지

## 어떻게?
1. GCP Console > Billing > Budgets & alerts
2. 월간 예산 설정
3. 50%, 80%, 100% 도달 시 이메일 알림 설정

## 예상 효과
- 예상치 못한 API 비용 폭주로부터 보호
