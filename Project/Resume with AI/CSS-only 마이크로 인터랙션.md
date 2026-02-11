# CSS-only 마이크로 인터랙션

#resume-with-ai #중기 #UX #성능

## 요약
성능 예산 내에서 정교한 미세 인터랙션을 추가한다.

## 왜?
- 프론트엔드 개발자의 이력서 사이트는 그 자체가 포트폴리오
- 정교한 마이크로 인터랙션은 "디테일에 신경 쓴다"는 메시지를 전달

## 어떻게?
- 섹션 진입 시 CSS-only 페이드인 애니메이션 (`@keyframes` + IntersectionObserver)
- 기술 스택 뱃지 hover 시 관련 프로젝트 링크 표시 (기존 shadcn Tooltip)
- `prefers-reduced-motion` 존중
- **추가 JS 0KB 목표**, 성능 예산: 새로운 JS 15KB 이하, LCP 영향 0

## 예상 효과
- 시각적 품질 향상
- "기억에 남는 사이트" 효과
- 프론트엔드 역량의 직접적 증명
