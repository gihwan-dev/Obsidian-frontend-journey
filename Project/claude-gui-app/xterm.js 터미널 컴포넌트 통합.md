# xterm.js 터미널 컴포넌트 통합

#claude-gui-app #즉시 #터미널 #UI

## 요약
WebView 내에서 xterm.js를 사용한 터미널 컴포넌트를 구현하고 Rust 백엔드 PTY와 연결 가능한 상태로 만든다.

## 왜?
- Claude Code CLI는 터미널 기반 도구 — 터미널 렌더링은 이 앱의 가장 기본적인 기능
- xterm.js는 WebView에서 고성능 터미널 에뮬레이션을 제공하는 사실상 표준
- PTY 연결 전에 터미널 UI 자체를 먼저 안정화해야 함

## 어떻게?
1. `@xterm/xterm`, `@xterm/addon-fit`, `@xterm/addon-webgl` 등 패키지 설치
2. React 래퍼 컴포넌트 생성 (`TerminalPanel.tsx`)
3. xterm 인스턴스 생성 → DOM 마운트 → fit addon으로 자동 크기 조절
4. Tauri event 시스템으로 Rust PTY ↔ xterm 양방향 데이터 바인딩 인터페이스 정의
5. 기본 테마(Claude 브랜드 컬러 기반) 적용
6. 복사/붙여넣기, 스크롤백 등 기본 터미널 기능 확인

## 예상 효과
- Claude Code CLI 출력을 GUI 내에서 네이티브하게 렌더링
- WebGL 가속으로 대량 출력에도 부드러운 렌더링
- PTY 연결 시 즉시 완전한 터미널 경험 제공

## 작업 로그

### 2026-02-08 구현

**구현 내용:**
- `@xterm/xterm`, `@xterm/addon-fit`, `@xterm/addon-webgl` 패키지 설치
- xterm 라이프사이클 관리 훅 (`useTerminal`) — open → fit → WebGL 순서 엄수
- 앱 테마 ↔ xterm ITheme 매핑 훅 (`useTerminalTheme`) — `useSyncExternalStore` 활용
- 터미널 전용 Zustand 스토어 (`terminal-store`) — cols, rows, isReady, connectionStatus 관리
- PTY 이벤트 인터페이스 타입 정의 (구현 없음, 다음 이슈에서 사용)
- `TerminalPanel` 컴포넌트 — 헤더바(크기 표시) + xterm 컨테이너 + 로컬 에코 데모
- 로컬 에코: Enter → 줄바꿈+에코, Backspace → 삭제, 일반 문자 → 화면 출력
- `SessionsView`를 플레이스홀더에서 `TerminalPanel`로 교체
- 80~120 컬럼 클램핑 로직 구현
- Claude 브랜드 기반 Light/Dark 터미널 테마

**생성 파일:**
- `src/lib/terminal-events.ts` — PTY 이벤트 인터페이스 타입 정의
- `src/components/terminal/terminal-theme.ts` — Light/Dark 터미널 테마 (ITheme)
- `src/store/terminal-store.ts` — 터미널 전용 Zustand 스토어
- `src/store/terminal-store.test.ts` — 스토어 테스트 (5개)
- `src/hooks/use-terminal-theme.ts` — 앱 테마 → xterm ITheme 매핑
- `src/hooks/use-terminal.ts` — xterm 라이프사이클 관리 핵심 훅
- `src/hooks/use-terminal.test.ts` — 훅 테스트 (3개)
- `src/components/terminal/TerminalPanel.tsx` — 터미널 UI 컴포넌트
- `src/components/terminal/TerminalPanel.test.tsx` — 컴포넌트 테스트 (3개)

**수정 파일:**
- `package.json` — @xterm/xterm, @xterm/addon-fit, @xterm/addon-webgl 의존성 추가
- `src/components/views/SessionsView.tsx` — 플레이스홀더 → TerminalPanel 교체
- `src/App.css` — xterm용 user-select, cursor 오버라이드 추가
- `src/test/setup.ts` — Canvas getContext mock 추가 (xterm jsdom 호환)
- `.ast-grep/rules/zustand/no-destructure.yml` — useTerminalStore 패턴 추가
- `locales/en.json`, `locales/ar.json`, `locales/fr.json` — 터미널 관련 i18n 키 추가
- `src/components/layout/MainWindowContent.test.tsx` — SessionsView 변경 반영

**기술 결정:**
- `useSyncExternalStore`로 system 테마 감지 (useEffect + setState 대신) — React Compiler의 set-state-in-effect 규칙 준수
- WebGL addon을 `await import()`로 동적 로드 후 try/catch 폴백 — 번들 사이즈 최적화 + Canvas 폴백 보장
- `useRef` + `noop` 패턴으로 write/fit 함수 안정화 — React 19의 렌더 중 ref 접근 금지 규칙 준수
- onData 콜백을 ref로 관리하여 터미널 인스턴스 재생성 방지 — 테마 변경 시 `terminal.options.theme` 업데이트만 수행
- 터미널 초기화와 테마 sync를 별도 effect로 분리 — 테마 변경 시 터미널 재생성 없이 테마만 교체

**검증:**
- `pnpm typecheck` 통과
- `pnpm lint` 통과 (기존 .claude/skills 파싱 에러 3개 제외)
- `pnpm ast:lint` 통과
- `pnpm format:check` 통과 (수정 파일 기준)
- `pnpm test:run` 전체 통과 (12파일 56테스트)
