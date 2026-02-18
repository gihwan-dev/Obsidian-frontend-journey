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

## 작업 로그

### 2026-02-07
**상태**: 완료

**작업 내용**:
- `global.css`의 `*` 선택자에서 transition 3줄 삭제
- 테마 전환 시 색상이 변하는 핵심 요소에만 `transition-colors duration-100` 적용: `<body>`, 데스크톱/모바일 네비게이션, Separator 컴포넌트
- 이미 `transition-colors`/`transition-all`이 있는 컴포넌트(button, badge, switch 등)는 변경 없음
- `pnpm build` 성공 확인

**변경 파일**:
- `web/src/styles/global.css` - `*` 선택자에서 transition 속성 3줄 삭제
- `web/src/layouts/Layout.astro` - `<body>`에 `transition-colors duration-100` 추가
- `web/src/components/navigation/desktop-nav.tsx` - 컨테이너/구분선에 `transition-colors duration-100` 추가
- `web/src/components/navigation/mobile-nav.tsx` - SheetContent/구분선에 `transition-colors duration-100` 추가
- `web/src/components/ui/separator.tsx` - `transition-colors duration-100` 추가

**PR**: https://github.com/gihwan-dev/resume-with-chatbot/pull/44
