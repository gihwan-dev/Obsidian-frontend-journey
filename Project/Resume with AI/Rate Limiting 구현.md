# Rate Limiting 구현

#resume-with-ai #단기 #보안

## 요약
`/api/chat`과 `/api/followup` 엔드포인트에 IP 기반 Rate Limiting을 추가한다.

## 왜?
- 현재 어떤 보호도 없음
- 악의적 호출로 Vertex AI, Notion, ClickUp API 비용이 무제한 발생 가능

## 어떻게?
- Chat: 분당 10회, Followup: 분당 20회
- Vercel Edge Middleware + `@upstash/ratelimit`(Redis 기반) 또는 API 핸들러 내부 `Map<string, {count, timestamp}>` 방식
- 초과 시 429 응답

## 예상 효과
- 악의적 API 남용 방지
- 정상 사용자(채용담당자)에게는 영향 없음