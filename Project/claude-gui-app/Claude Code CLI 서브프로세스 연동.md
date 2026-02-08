# Claude Code CLI 서브프로세스 연동

#claude-gui-app #단기 #CLI연동

## 요약
Rust 백엔드에서 Claude Code CLI를 subprocess로 실행하고, `--output-format stream-json` 옵션으로 구조화된 출력을 받아오는 연동 레이어를 구현한다.

## 왜?
- 이 앱의 핵심 가치는 Claude Code CLI를 재구현하는 것이 아니라 "감싸서 확장"하는 것
- CLI의 모든 기본 기능(MCP, 권한 시스템, 세션 관리 등)을 그대로 활용해야 함
- 구조화된 JSON 출력을 받아야 GUI에서 파싱·표시·분기 처리가 가능

## 어떻게?
1. Rust에서 `tokio::process::Command`로 `claude` CLI 실행
2. `--output-format stream-json` 플래그 전달
3. stdout을 비동기로 읽으며 JSON 라인 단위로 파싱
4. 이벤트 타입별 분류: `assistant`, `tool_use`, `result`, `system` 등
5. 에러 핸들링: CLI 미설치, 인증 실패, 타임아웃 등
6. 프로세스 생명주기 관리: 시작, 중단, 강제 종료

## 예상 효과
- Claude Code의 모든 기능을 GUI에서 사용 가능
- CLI 업데이트 시 GUI도 자동으로 새 기능 사용 가능 (CLI 의존이므로)
- JSON 파싱 기반으로 UI 연동, 조건 분기, 로깅 등 확장 가능

## 참고
- 선행 이슈 [[Rust PTY Manager 기초 구현]] 완료됨 (2026-02-08). PTY 생명주기 관리(spawn/write/resize/kill) + Tauri Channel 스트리밍 + `usePty` 훅 구현 완료 — 이제 CLI 서브프로세스 연동에 PTY 인프라 활용 가능

## 작업 로그

