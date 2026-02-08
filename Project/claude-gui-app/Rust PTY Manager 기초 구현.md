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

## 참고
- 선행 이슈 [[xterm.js 터미널 컴포넌트 통합]] 완료됨 (2026-02-08). 터미널 UI + PTY 이벤트 인터페이스(`src/lib/terminal-events.ts`) 정의 완료 — 이제 착수 가능
- 프론트엔드에서 `PTY_EVENTS.OUTPUT`, `PTY_EVENTS.INPUT`, `PTY_EVENTS.RESIZE`, `PTY_EVENTS.STATUS` 이벤트 타입이 준비되어 있음

## 작업 로그

### 2026-02-08 구현

**구현 내용:**

- Rust `portable-pty` 크레이트 기반 PTY 생명주기 관리 (`PtyManager` 구조체)
- Tauri Channel API를 통한 PTY → 프론트엔드 실시간 스트리밍
- 4개 Tauri 커맨드: `pty_spawn`, `pty_write`, `pty_resize`, `pty_kill`
- `usePty` React 훅으로 PTY 생명주기를 프론트엔드에서 관리
- `TerminalPanel`에서 `useLineBuffer`(로컬 에코) → `usePty`(실제 셸)로 교체
- `terminal-store`에 `sessionId`, `connectionStatus` 상태 추가
- 연결 상태(connecting/connected/disconnected/error) i18n 지원

**생성 파일:**

- `src-tauri/src/pty_manager.rs` — PtySession/PtyManager 구조체, spawn/write/resize/kill/list 메서드 + 6개 단위 테스트
- `src-tauri/src/commands/pty.rs` — 4개 Tauri 커맨드 (`pty_spawn`, `pty_write`, `pty_resize`, `pty_kill`)
- `src/hooks/use-pty.ts` — PTY 생명주기 관리 React 훅 (Channel 생성, onmessage 처리, cleanup)

**수정 파일:**

- `src-tauri/Cargo.toml` — `portable-pty = "0.9"`, `uuid = { version = "1", features = ["v4"] }` 의존성 추가
- `src-tauri/src/types.rs` — `PtyError`, `PtyEvent`, `SpawnOptions`, `SessionInfo` 타입 추가
- `src-tauri/src/commands/mod.rs` — `pub mod pty` 추가
- `src-tauri/src/bindings.rs` — PTY 커맨드 4개 등록
- `src-tauri/src/lib.rs` — `mod pty_manager` + `Mutex<PtyManager>` State 등록
- `src/lib/bindings.ts` — 자동 재생성 (`pnpm rust:bindings`)
- `src/lib/tauri-bindings.ts` — `PtyError`, `PtyEvent`, `SpawnOptions` re-export 추가
- `src/store/terminal-store.ts` — `sessionId`, `connectionStatus` 상태/액션 추가
- `src/components/terminal/TerminalPanel.tsx` — `useLineBuffer` → `usePty` 교체, 자동 spawn, resize 동기화, 연결 상태 표시
- `locales/en.json`, `locales/ko.json` — `terminal.connecting/connected/disconnected/error` i18n 키 추가
- `src/components/terminal/TerminalPanel.test.tsx` — `usePty` mock 적용, 테스트 업데이트
- `src/components/layout/MainWindowContent.test.tsx` — `usePty` mock 추가
- `src/store/terminal-store.test.ts` — 새 필드 포함하도록 업데이트

**기술 결정:**

- **Tauri Channel API 선택** (emit 대신): 타입 안전한 스트리밍, 커맨드별 독립 채널, backpressure 없음
- **`std::sync::Mutex` + `std::thread::spawn`** (tokio 대신): PTY I/O는 blocking이므로 tokio 불필요, 단순 구조 유지
- **UUID v4 세션 ID**: 충돌 방지, 프론트엔드에서 문자열로 직접 사용 가능
- **slave 즉시 drop**: `spawn_command()` 후 slave를 즉시 drop해야 reader가 EOF를 받을 수 있음
- **EIO (errno 5) 정상 종료 처리**: macOS에서 child 종료 시 reader가 EIO를 받으므로 Exit 이벤트로 변환
- **`usePty` 훅에서 `useTerminalStore.getState()` 사용**: 콜백 내부에서 최신 상태를 읽기 위해 (구독 아닌 직접 접근)
- **계획에서 변경**: `anyhow` 크레이트 제외 (타입화된 `PtyError` enum으로 충분), `tokio::spawn_blocking` 대신 `std::thread::spawn` 사용

**검증:**

- `pnpm check:all` 전체 통과 (typecheck, lint, ast-grep, format, prettier, rust:fmt, clippy, 64/64 JS tests, 10/10 Rust tests)

### 2026-02-08 버그 수정 및 테스트 강화

**구현 내용:**

- `usePty` 훅의 race condition 수정: `await ptySpawn()` 중 Exit 이벤트 도착 시 connected 상태로 덮어쓰는 버그
- `TerminalPanel` 출력 버퍼링: writeRef 설정 전 도착한 PTY 출력이 유실되는 문제 해결
- 인터랙티브 셸 spawn 시 login shell `-l` 플래그 추가 (셸 시작 파일 로드)
- Rust 인터랙티브 셸 테스트 8개 + 프론트엔드 PTY 훅 테스트 10개 추가

**수정 파일:**

- `src/hooks/use-pty.ts` — `exitedRef` 가드로 race condition 방지, `channelRef`로 Channel GC 방지
- `src/components/terminal/TerminalPanel.tsx` — `pendingOutputRef`로 출력 버퍼링 + flush 로직
- `src-tauri/src/pty_manager.rs` — login shell `-l` 플래그, 테스트 헬퍼 2개 + 테스트 8개 추가

**생성 파일:**

- `src/hooks/use-pty.test.ts` — 프론트엔드 PTY 훅 테스트 10개 (spawn 상태 전환, 이벤트 처리, race condition 검증)

**기술 결정:**

- **`exitedRef` 가드 패턴**: spawn의 async/await 중 Channel 이벤트가 먼저 도착하는 race condition을 ref로 해결
- **출력 버퍼링**: xterm.js Terminal 인스턴스 준비 전 PTY 출력을 배열에 버퍼링 후 일괄 전달
- **login shell `-l` 플래그**: `CommandBuilder::new()`는 `is_default_prog=false`이므로 argv[0]에 `-` 접두사 미부여 → `-l` 플래그로 명시적 login shell 실행

**미해결 사항:**

- 실제 `pnpm tauri:dev` 런타임 동작 검증 필요 (테스트는 모두 통과하나 실제 앱 동작 미확인)

**검증:**

- `pnpm check:all` 전체 통과 (typecheck, lint, ast-grep, format, rust:fmt, clippy, 74/74 JS tests, 22/22 Rust tests)

### 2026-02-08 StatusBar 동적 연결 상태 반영 및 진단 로깅

**구현 내용:**

- StatusBar가 항상 "연결 끊김"으로 하드코딩되던 문제 수정 — `useTerminalStore`의 `connectionStatus`/`sessionId`와 연동
- Rust `channel.send()` 실패 시 에러 로깅 추가
- 프론트엔드 Channel onmessage 및 TerminalPanel 데이터 파이프라인에 `console.debug` 진단 로깅 추가
- PtyEvent JSON 직렬화 형태, Channel roundtrip, SpawnOptions 역직렬화, Rust JSON shape 매칭 테스트 추가

**수정 파일:**

- `src/components/layout/StatusBar.tsx` — `useTerminalStore`에서 연결 상태 읽어 동적 렌더링
- `src/components/layout/StatusBar.test.tsx` — 상태별(connected/connecting/disconnected/error) 렌더링 테스트 보강
- `locales/en.json`, `locales/ko.json` — `terminal.connecting`, `terminal.error` i18n 키 추가
- `src-tauri/src/pty_manager.rs` — `channel.send()` 에러 로깅 + JSON 직렬화 검증 테스트 추가
- `src/hooks/use-pty.ts` — Channel onmessage 진단 로깅(`debug()`) 추가
- `src/hooks/use-pty.test.ts` — Rust serde JSON shape 매칭 테스트 3개 추가
- `src/components/terminal/TerminalPanel.tsx` — 데이터 파이프라인 진단 로깅 추가

**미해결 사항:**

- ~~`logger.ts`의 destructured export에서 `this` 컨텍스트 유실~~ → 코드 리뷰에서 `.bind(logger)` 방식으로 수정 완료
- 실제 `pnpm tauri:dev` 런타임 동작 검증 필요

**검증:**

- `pnpm check:all` — typecheck, lint, ast-grep, format, rust:fmt, clippy 통과 / JS 79/79, Rust 25/25 전부 통과

### 2026-02-08 코드 리뷰 반영

**구현 내용:**

- Rust 테스트 2개 실패 수정 (PTY fd 소진으로 인한 `openpty` 에러)
- `console.debug`/`console.error` → 프로젝트 `logger` 유틸리티로 교체
- `TextEncoder`를 모듈 스코프 상수로 이동 (매 write 호출 시 재생성 방지)
- `logger.ts`의 destructured export에 `.bind(logger)` 추가 (this 바인딩 보장)
- `test_list_sessions`에서 누락된 세션 cleanup 추가

**생성 파일:**

- `src-tauri/.cargo/config.toml` — `RUST_TEST_THREADS=1` 설정 (PTY 테스트 직렬 실행)

**수정 파일:**

- `src/hooks/use-pty.ts` — `TextEncoder` 모듈 스코프 이동, `console.*` → `logger` 교체
- `src/components/terminal/TerminalPanel.tsx` — `console.debug` → `debug()` logger 교체
- `src/lib/logger.ts` — destructured export에 `.bind(logger)` 추가
- `src-tauri/src/pty_manager.rs` — `test_list_sessions` 세션 cleanup 추가

**기술 결정:**

- **테스트 직렬 실행**: `test_session_limit`이 10개 PTY를 동시에 열어 병렬 테스트 시 시스템 PTY fd 소진 → `.cargo/config.toml`로 `RUST_TEST_THREADS=1` 설정
- **모듈 스코프 TextEncoder**: `TextEncoder`는 stateless이므로 모듈 수준에서 한 번만 생성하여 재사용

**검증:**

- `pnpm check:all` 전체 통과 (typecheck, lint, ast-grep, format, rust:fmt, clippy, JS 79/79, Rust 25/25)

### 2026-02-08 코드 리뷰 반영 (2차)

**구현 내용:**

- Rust reader thread EIO 조건에서 과도한 `ErrorKind::Other` 제거 — `raw_os_error() == Some(5)`만 체크
- TerminalPanel spawn effect에서 `cols`/`rows` 의존성 제거 (resize 시 재spawn 방지), `getState()`로 최신 값 읽기
- spawn 실패 시 최대 3회 재시도 제한 추가
- `usePty` unmount cleanup에서 `sessionIdRef` null 처리로 double-kill 방지

**수정 파일:**

- `src-tauri/src/pty_manager.rs` — reader thread EIO 조건 축소 (`ErrorKind::Other` 제거)
- `src/components/terminal/TerminalPanel.tsx` — spawn effect 의존성 정리, `MAX_SPAWN_RETRIES` 도입
- `src/hooks/use-pty.ts` — unmount cleanup double-kill 방지

**기술 결정:**

- **EIO 조건 축소**: `ErrorKind::Other`는 EIO 외의 에러도 포함하므로 `raw_os_error() == Some(5)`만 체크하여 예상치 못한 에러가 정상 종료로 처리되는 것 방지
- **spawn 의존성 정리**: `cols`/`rows` 변경 시 불필요한 재spawn 대신 resize 이벤트로 처리 (기존 resize effect가 담당)
- **재시도 제한**: spawn 실패 무한 루프 방지를 위해 3회 상한 설정

**미해결 사항:**

- 테스트 갭: Error 이벤트, kill(), unmount cleanup, SessionNotFound 처리 테스트 미작성
- 실제 `pnpm tauri:dev` 런타임 동작 검증 필요

**검증:**

- `pnpm check:all` 전체 통과 (typecheck, lint, ast-grep, format, rust:fmt, clippy, JS 79/79, Rust 25/25)
