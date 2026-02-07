# Astro Hydration 전략 변경

#resume-with-ai #quick-win #성능

## 요약
`Layout.astro`에서 `Navigation client:load`와 `ChatWidget client:load`를 `client:idle`로 변경한다.

## 왜?
- `client:load`는 페이지 로드 즉시 JS를 실행하여 메인 스레드를 300-800ms 차단
- 방문자는 이 시간에 Hero 섹션을 읽고 있으므로, 즉시 hydration 불필요

## 어떻게?
- `Layout.astro`에서 코드 2줄 변경: `client:load` → `client:idle`

## 예상 효과
- TTI(Time to Interactive) 300-600ms 개선
- 모바일에서 특히 효과적

## 작업 로그

### 2026-02-07
**상태**: 완료

**작업 내용**:
- `Layout.astro`에서 `Navigation`과 `ChatWidget`의 hydration 전략을 `client:load` → `client:idle`로 변경
- PR #42 (`perf/astro-hydration` 브랜치)로 머지 완료

**변경 파일**:
- `web/src/layouts/Layout.astro` - Navigation, ChatWidget hydration 디렉티브를 `client:idle`로 변경

**발견 사항**:
- `client:idle`은 `requestIdleCallback` 기반으로 메인 스레드가 여유로울 때 hydration 실행
- 방문자가 Hero 섹션을 읽는 동안 메인 스레드 차단 없이 자연스럽게 hydration 완료