# CSS 와일드카드 트랜지션 제거

#resume-with-ai #quick-win #성능

## 요약
`global.css`의 `* { transition-property: color, background-color... }` 선택자를 제거하고, 필요한 요소에만 적용한다.

## 왜?
- DOM의 모든 요소(200개 이상)에 트랜지션이 적용됨
- 테마 토글 시 200개 이상의 동시 애니메이션 발생
- 스크롤 시 불필요한 repaint 발생

## 어떻게?
1. 와일드카드 `*` 규칙 삭제
2. `body`, `nav`, `header`, 카드 컴포넌트 등 테마 전환 시 색상이 변하는 요소에만 트랜지션 추가

## 예상 효과
- 테마 토글 시 paint 시간 20-50ms 개선
- 스크롤 시 jank 감소