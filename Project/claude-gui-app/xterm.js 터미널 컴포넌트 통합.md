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
