# Rust PTY Manager 기초 구현

#claude-gui-app #즉시 #백엔드 #Rust

## 요약
Rust에서 portable-pty 크레이트를 사용하여 가상 터미널(PTY) 생성/관리/삭제의 기본 생명주기를 구현한다.

## 왜?
- Claude Code CLI를 subprocess로 실행하려면 PTY가 필수 (ANSI 이스케이프, 입력 처리 등)
- 다중 세션을 위해 여러 PTY를 동시에 관리할 수 있어야 함
- Rust의 portable-pty는 macOS에서 안정적인 PTY 관리를 제공

## 어떻게?
1. `portable-pty` 크레이트를 `Cargo.toml`에 추가
2. `PtyManager` 구조체 설계:
   - `spawn(command, args, env, cwd)` → PTY 세션 생성
   - `read(session_id)` → PTY 출력 읽기 (비동기)
   - `write(session_id, data)` → PTY 입력 쓰기
   - `resize(session_id, cols, rows)` → 터미널 크기 변경
   - `kill(session_id)` → PTY 세션 종료
3. `HashMap<SessionId, PtyPair>`로 다중 PTY 관리
4. Tauri command로 프론트엔드에 노출: `#[tauri::command]` 매크로 사용
5. 비동기 읽기 → Tauri event로 프론트엔드에 push

## 예상 효과
- xterm.js와 연결하면 완전한 터미널 경험 즉시 구현 가능
- 다중 세션의 기술적 기반 확보
- Claude Code CLI 실행을 위한 핵심 인프라 완성

## 작업 로그
