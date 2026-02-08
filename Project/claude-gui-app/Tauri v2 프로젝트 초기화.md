# Tauri v2 프로젝트 초기화

#claude-gui-app #즉시 #인프라

## 요약
Tauri v2 + React + TypeScript + Vite 기반 프로젝트 스캐폴딩을 완료한다.

## 왜?
- 모든 기능 구현의 출발점 — 프로젝트 뼈대가 없으면 아무것도 시작할 수 없음
- Tauri v2는 Rust 백엔드 + WebView 프론트엔드 조합으로 macOS 네이티브 앱에 최적
- 초기 세팅을 제대로 해야 이후 모든 기능 개발이 순조로움

## 어떻게?
1. `npm create tauri-app@latest` 또는 `cargo create-tauri-app`으로 프로젝트 생성
2. 프론트엔드: React + TypeScript + Vite 템플릿 선택
3. `src-tauri/Cargo.toml`에 필요한 Rust 크레이트 추가 (portable-pty, serde, tokio 등)
4. `package.json`에 React 의존성 정리 (react, react-dom, xterm, zustand 등)
5. `tsconfig.json`, `vite.config.ts` 기본 설정
6. `tauri.conf.json`에서 앱 이름, 번들 ID, 윈도우 크기 등 기본 설정
7. `npm run tauri dev`로 빌드/실행 확인

## 예상 효과
- 개발 환경 즉시 가동 가능
- Hot reload가 작동하는 개발 루프 확보
- Rust ↔ React 간 Tauri command 통신 기반 확보

## 작업 로그
