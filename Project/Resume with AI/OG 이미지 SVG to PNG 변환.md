# OG 이미지 SVG → PNG 변환

#resume-with-ai #quick-win #SEO

## 요약
`/public/og-image.svg`를 1200x630px PNG/JPG로 변환한다.

## 왜?
- LinkedIn, KakaoTalk, Slack 등 대부분의 소셜 플랫폼은 SVG OG 이미지를 렌더링하지 못함
- 이력서 링크를 공유할 때 미리보기가 깨져 보임

## 어떻게?
1. SVG를 1200x630 PNG로 export
2. Astro SEO 컴포넌트의 `og:image` 경로 업데이트

## 예상 효과
- 소셜 미디어 공유 시 전문적인 미리보기 카드 표시
- 채용담당자에게 링크를 보낼 때 첫인상 개선