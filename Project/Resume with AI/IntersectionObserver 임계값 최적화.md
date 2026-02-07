# IntersectionObserver 임계값 최적화

#resume-with-ai #quick-win #성능

## 요약
`useActiveSection` 훅의 `threshold`를 11개에서 5개로 줄인다.

## 왜?
- 5개 섹션 x 11개 임계값 = 스크롤 프레임당 최대 55회 콜백 호출
- 5개로 줄이면 콜백이 55% 감소

## 어떻게?
- threshold 배열 1줄 수정
- `[0, 0.1, 0.2, ..., 1.0]` → `[0, 0.25, 0.5, 0.75, 1.0]`

## 예상 효과
- 스크롤 성능 개선
- 모바일에서 jank 감소
