# Claude GUI App — 구현 스펙 문서

> Claude Code CLI를 GUI로 감싸 세션 관리, 체크포인트, 자동 루프 등 파워유저 기능을 제공하는 macOS 네이티브 데스크톱 애플리케이션

**문서 버전:** v1.0
**작성일:** 2026-02-08
**상태:** 스펙 구체화 완료, 구현 미착수
**v1 스코프:** 세션 관리 + 체크포인트 + 루프 모드 (워크플로우 시스템은 v2)

---

## 1. 프로젝트 개요

### 1.1 배경 및 목적

Claude Code CLI는 강력한 에이전틱 코딩 도구이지만, 터미널 기반 인터페이스의 한계로 인해 다중 세션 관리, 시각적 체크포인트, 자동화 루프 등의 파워유저 워크플로우를 구현하기 어렵다. 이 프로젝트는 CLI의 모든 기능을 그대로 유지하면서 GUI 레이어를 씌워 이러한 고급 워크플로우를 가능하게 한다.

### 1.2 핵심 원칙

**CLI 기능 보존**: Claude Code CLI를 서브프로세스로 실행하여, MCP, 권한 시스템, 세션 관리 등 기존 기능을 100% 활용한다. CLI의 structured output(JSON stream)을 파싱하여 GUI에 반영하는 구조이므로, CLI 업데이트 시 GUI가 자동으로 새 기능을 흡수할 수 있다.

**확장 기능은 Rust 백엔드에서 처리**: Git 조작, 파일 시스템 관리, 워크트리 생성 등 CLI 외부의 확장 기능은 Rust 백엔드에서 직접 처리한다.

**비파괴적 설계**: 모든 세션은 git worktree로 격리되고, 체크포인트(git commit) 기반 롤백이 가능하므로 bypass 모드(사용자 확인 없이 실행)를 기본으로 사용해도 안전하다.

### 1.3 타겟 사용자 및 배포

정식 배포를 목표로 하며, macOS 사용자 대상이다. 초기에는 DMG 직접 배포로 시작하고, 안정화 후 Mac App Store 배포를 검토한다. App Store 배포 시 Tauri v2의 코드 사이닝, App Sandbox 요구사항, TestFlight 제출 등 추가 작업이 필요하다.

### 1.4 경쟁 제품 분석 및 차별점

현재 Claude Code CLI에 GUI를 제공하는 도구들이 등장하고 있다.

**Opcode** (Tauri 2 + React + TypeScript): 가장 유사한 프로젝트로, 비주얼 프로젝트 브라우저, 세션 체크포인트, 커스텀 에이전트 기능을 제공한다. AGPL 라이선스.

**CodePilot** (Electron + Next.js): 네이티브 데스크톱 GUI, 채팅, 코드, 프로젝트 관리를 제공하나, Electron 기반이라 번들 사이즈(80-120MB)와 메모리(200-300MB)가 크다.

**Claude Canvas** (tmux 기반): 터미널 네이티브 비주얼 출력. 데스크톱 앱 오버헤드 없이 동작하나 기능이 제한적이다.

**본 프로젝트의 차별점:**

- **자동 루프 모드**: 종료 조건(자연어/커맨드/Claude 자율 판단)을 조합하여 반복 실행하는 기능은 대부분의 경쟁 제품에 없다. OpenHands나 SWE-agent 같은 연구 프로젝트에서 "Ralph Loop" 패턴으로 탐구되고 있으나, GUI로 통합된 사례는 드물다.
- **Git worktree 기반 완전 격리**: 세션 생성 시 자동으로 worktree를 만들어 메인 브랜치 오염 없이 작업하고, 세션 완료 후 자동 PR 생성까지 연결하는 풀 사이클 관리.
- **체크포인트 타임라인**: git commit 기반 스냅샷을 시각적 타임라인으로 관리하고, 롤백/diff/분기를 GUI에서 직접 수행.
- **경량 네이티브 앱**: Tauri v2 기반으로 번들 사이즈 2.5-3MB, 유휴 메모리 30-40MB. Electron 기반 대안 대비 성능 우위.

---

## 2. 기술 스택 검증

### 2.1 앱 프레임워크: Tauri v2

| 항목 | 내용 |
|------|------|
| 버전 | Tauri 2.0.0 (2024년 10월 2일 안정 릴리스) |
| 상태 | 프로덕션 레디. Radically Open Security의 독립 보안 감사 완료 |
| macOS WebView | WKWebView (macOS 10.10+ 기본 탑재) |
| 번들 사이즈 | 2.5-3MB (Electron 80-120MB 대비 약 97% 절감) |
| 유휴 메모리 | 30-40MB (Electron 200-300MB 대비 약 85% 절감) |
| 시작 시간 | 500ms 미만 (Electron 1-2초 대비) |
| 채택 성장률 | v2 출시 후 전년 대비 35% 성장 |

**macOS 지원 기능:**

- 시스템 트레이: `tray-icon` 기능으로 완전 지원
- 알림: `@tauri-apps/plugin-notification`으로 네이티브 macOS 알림 지원
- 파일 시스템: 권한 범위 설정(permission scoping)과 네이티브 파일 다이얼로그 지원
- 자동 업데이트: 내장 updater 플러그인으로 인앱 업데이트 지원

**IPC (프로세스 간 통신):**

Tauri v2의 IPC는 커스텀 URI 스킴(`ipc://`, `tauri://`)을 통해 동작하며, 기본적으로 JSON 직렬화/역직렬화를 사용한다. v2에서 추가된 **Raw Requests** 기능은 대용량 데이터 전송 시 JSON 직렬화 오버헤드를 제거한다. 또한 **Channels** 기능은 PTY 출력이나 CLI 스트림 같은 순서 보장 스트리밍 데이터에 최적화되어 있다.

**프로덕션 사례:** Typst Studio Desktop (WASM 코드베이스 공유, Electron 대비 90% 작은 번들), Zlack (Slack 데스크톱 래퍼), NoSQL 데이터베이스 클라이언트 (Electron에서 마이그레이션, 200MB → 10MB)

**참고 자료:**
- [Tauri 2.0 Stable Release](https://v2.tauri.app/blog/tauri-20/)
- [Tauri vs Electron 2025 비교](https://codeology.co.nz/articles/tauri-vs-electron-2025-desktop-development.html)
- [Tauri IPC 아키텍처](https://v2.tauri.app/concept/inter-process-communication/)

### 2.2 프론트엔드: React + TypeScript

표준 프론트엔드 스택. Tauri v2와의 호환성이 검증되어 있으며, xterm.js 및 향후 v2의 노드 에디터 라이브러리들과의 통합이 용이하다. 상태 관리는 Zustand를 사용한다 (경량, TypeScript 친화적, 보일러플레이트 최소).

### 2.3 터미널 임베드: xterm.js v6

| 항목 | 내용 |
|------|------|
| 버전 | 6.0.0 (2024년 12월 22일 릴리스) |
| 렌더러 | WebGL 렌더러 사용 (Canvas 대비 3-5배, 최대 900% 성능 향상) |
| 유니코드 | addon-unicode11로 이모지 포함 완전 지원 |
| 검색 | addon-search로 터미널 내용 검색 지원 |
| 직렬화 | addon-serialize로 터미널 상태 저장/복원 가능 |

**Tauri 환경 주의사항:**

- fitAddon 리사이즈 시 텍스트 소실 문제가 보고됨 → `term.open()` 후 `fitAddon.fit()` 호출 순서 준수 필요
- 200컬럼 이상에서 UI 지연 발생 → 터미널 폭 80-120컬럼 제한 권장
- WebGL 렌더러 우선 사용, Canvas는 폴백으로만 유지

**참고 자료:**
- [xterm.js GitHub Releases](https://github.com/xtermjs/xterm.js/releases)
- [VS Code 터미널 렌더링 성능 개선](https://code.visualstudio.com/blogs/2017/10/03/terminal-renderer)
- [Tauri 환경 xterm.js 리사이즈 이슈 #3887](https://github.com/xtermjs/xterm.js/issues/3887)

### 2.4 PTY 관리: Rust (portable-pty)

| 항목 | 내용 |
|------|------|
| 크레이트 | portable-pty v0.9+ (wezterm 프로젝트의 일부) |
| 다운로드 | 누적 250만+ |
| 아키텍처 | 트레이트 기반 추상화 (`PtySystem`, `MasterPty`, `SlavePty`) |
| 플랫폼 | macOS (Unix PTY), Windows (ConPty/WinPTY), Linux |
| 비동기 | `tokio::spawn_blocking` 래핑 필요 |

portable-pty를 선택한 이유: 대안인 pty-process(누적 314만 다운로드)는 네이티브 tokio 통합이 장점이나, portable-pty가 크로스 플랫폼 지원과 런타임 구현 선택에서 우위이다. Tauri 데스크톱 앱에 더 적합하며, tauri-plugin-pty가 이를 기반으로 구축되어 있다.

**참고 자료:**
- [portable-pty 문서](https://docs.rs/portable-pty)
- [tauri-plugin-pty](https://crates.io/crates/tauri-plugin-pty)

### 2.5 Claude Code 연동: CLI Subprocess + JSON Stream

Claude Code CLI는 `--output-format stream-json` 플래그로 실시간 NDJSON(Newline-Delimited JSON) 스트림을 출력한다. `-p` (print) 플래그로 비대화형 서브프로세스 모드를 지원한다.

**JSON Stream 이벤트 구조:**

```
이벤트 타입              설명                          주요 필드
─────────────────────────────────────────────────────────────────
message_start           메시지 시작                    message ID, role, model
content_block_start     콘텐츠 블록 시작 (텍스트/도구)    block type (text/tool_use)
content_block_delta     증분 콘텐츠 업데이트              text_delta 또는 input_json_delta
content_block_stop      콘텐츠 블록 종료                 -
message_delta           메시지 레벨 업데이트              usage, stop_reason
message_stop            메시지 종료                     -
```

**JSON 최종 출력 구조 (`--output-format json`):**

```json
{
  "result": "작업 결과 텍스트",
  "session_id": "abc-123-def",
  "usage": {
    "input_tokens": 245,
    "output_tokens": 1523,
    "total_tokens": 1768
  },
  "total_cost_usd": 0.0234,
  "duration_ms": 4521
}
```

**핵심 CLI 플래그:**

```
-p, --print              비대화형 모드 (서브프로세스용)
--output-format          json | stream-json
--model                  sonnet | opus | 전체 모델명
--resume <session-id>    특정 세션 재개
--continue               가장 최근 세션 이어서 진행
--allowedTools           허용 도구 목록 (예: "Read,Edit,Bash")
--disallowedTools        금지 도구 목록
--permission-mode        acceptEdits | plan | bypassPermissions
--append-system-prompt   시스템 프롬프트 추가
--json-schema            구조화된 출력 스키마 지정
```

**대안 고려: Claude Agent SDK**

CLI 서브프로세스 방식 외에, Python/TypeScript Agent SDK를 통한 프로그래밍 방식의 연동도 가능하다. SDK는 `query()` 함수, `ClaudeSDKClient` 클래스, 스트리밍 이벤트, 세션 관리, MCP 통합, 훅 시스템(PreToolUse, PostToolUse 등)을 제공한다. 다만 v1에서는 CLI 서브프로세스 방식이 더 단순하고 CLI 업데이트를 자동 반영할 수 있어 이를 기본으로 사용한다.

**참고 자료:**
- [Claude Code CLI 레퍼런스](https://code.claude.com/docs/en/cli-reference)
- [Claude Code 프로그래밍 실행](https://code.claude.com/docs/en/headless)
- [Agent SDK 개요](https://platform.claude.com/docs/en/agent-sdk/overview)

---

## 3. 시스템 아키텍처

### 3.1 전체 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Tauri App (macOS)                               │
│                                                                         │
│  ┌───────────────────────────────────┐  ┌────────────────────────────┐  │
│  │        React/TS Frontend          │  │      Rust Backend          │  │
│  │        (WebView/WKWebView)        │  │      (Tauri Core)          │  │
│  │                                   │  │                            │  │
│  │  ┌─────────────┐ ┌────────────┐  │  │  ┌──────────────────────┐  │  │
│  │  │ xterm.js    │ │ 세션 관리   │  │  │  │  PTY Manager         │  │  │
│  │  │ 터미널 뷰   │ │ UI         │  │  │  │  (portable-pty)      │  │  │
│  │  └──────┬──────┘ └─────┬──────┘  │  │  └──────────┬───────────┘  │  │
│  │         │              │          │  │             │              │  │
│  │  ┌──────┴──────┐ ┌─────┴──────┐  │  │  ┌──────────┴───────────┐  │  │
│  │  │ 체크포인트   │ │ 루프 모드   │  │  │  │  Session Controller  │  │  │
│  │  │ 타임라인     │ │ 컨트롤러   │  │  │  │  (Worktree + CLI)    │  │  │
│  │  └─────────────┘ └────────────┘  │  │  └──────────┬───────────┘  │  │
│  │                                   │  │             │              │  │
│  │  ┌─────────────┐ ┌────────────┐  │  │  ┌──────────┴───────────┐  │  │
│  │  │ 모니터링     │ │ 설정       │  │  │  │  Git Manager         │  │  │
│  │  │ 대시보드     │ │ 패널       │  │  │  │  (git2 크레이트)     │  │  │
│  │  └─────────────┘ └────────────┘  │  │  └──────────┬───────────┘  │  │
│  │                                   │  │             │              │  │
│  └──────────────┬────────────────────┘  │  ┌──────────┴───────────┐  │  │
│                 │ Tauri IPC              │  │  CLI Process Manager │  │  │
│                 │ (invoke/emit/channel)  │  │  (spawn + stream)    │  │  │
│                 │◄──────────────────────►│  └──────────┬───────────┘  │  │
│                                          │             │              │  │
│                                          └─────────────┼──────────────┘  │
│                                                        │                 │
│                                          ┌─────────────▼──────────────┐  │
│                                          │  Claude Code CLI           │  │
│                                          │  (subprocess per session)  │  │
│                                          │                            │  │
│                                          │  claude -p "..." \         │  │
│                                          │    --output-format         │  │
│                                          │      stream-json \         │  │
│                                          │    --allowedTools ...      │  │
│                                          └────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              ┌──────────┐  ┌────────────┐  ┌────────────┐
              │ Git Repo │  │ Worktree 1 │  │ Worktree 2 │
              │ (원본)    │  │ (세션 A)   │  │ (세션 B)   │
              └──────────┘  └────────────┘  └────────────┘
```

### 3.2 레이어 구조

**Layer 1 — React/TS Frontend (WebView)**

UI 렌더링과 사용자 인터랙션을 담당한다. 모든 비즈니스 로직은 Rust 백엔드에 위임하고, 프론트엔드는 순수하게 표현 레이어 역할만 한다.

주요 컴포넌트: xterm.js 터미널 뷰, 세션 관리 UI, 체크포인트 타임라인, 루프 모드 컨트롤러, 모니터링 대시보드, 설정 패널

**Layer 2 — Tauri IPC Bridge**

프론트엔드와 Rust 백엔드 사이의 통신 계층이다. Tauri v2의 세 가지 IPC 메커니즘을 용도에 따라 사용한다.

- `invoke()`: 일반 요청/응답 (세션 생성, 설정 변경, 체크포인트 생성 등)
- `emit()`/`listen()`: 이벤트 기반 알림 (작업 완료, 에러 발생 등)
- `Channel`: 순서 보장 스트리밍 (PTY 출력, CLI JSON stream, 진행 상황 등)

**Layer 3 — Rust Backend (Tauri Core)**

핵심 비즈니스 로직을 처리하는 계층이다. 네 개의 주요 모듈로 구성된다.

- **PTY Manager**: portable-pty를 통한 터미널 세션 생명주기 관리
- **Session Controller**: 세션 생성/삭제, 워크트리 관리, CLI 프로세스 연동 조율
- **Git Manager**: git2 크레이트를 통한 워크트리, 체크포인트, 브랜치 관리
- **CLI Process Manager**: Claude Code CLI 서브프로세스 spawn, JSON stream 파싱, 세션별 프로세스 관리

**Layer 4 — 외부 프로세스**

Claude Code CLI가 세션마다 독립된 서브프로세스로 실행된다. 각 프로세스는 해당 세션의 워크트리 디렉토리에서 동작한다.

### 3.3 데이터 흐름

**사용자 입력 → Claude 응답 흐름:**

```
사용자 키 입력
  → xterm.js onData 이벤트
  → Tauri invoke('pty_write', data)
  → Rust PTY Manager: master_pty.write(data)
  → Claude Code CLI 프로세스 (stdin)
  → CLI 처리 + JSON stream 출력 (stdout)
  → Rust CLI Process Manager: NDJSON 파싱
  → Tauri Channel로 프론트엔드에 스트리밍 전송
  → React 상태 업데이트
  → xterm.js term.write(output) + 모니터링 대시보드 업데이트
```

**체크포인트 생성 흐름:**

```
사용자 단축키 (Cmd+S 등)
  → Tauri invoke('create_checkpoint', { session_id, message })
  → Rust Git Manager:
      1. 워크트리 디렉토리에서 git add -A
      2. git commit -m "checkpoint: {message}"
      3. 커밋 해시, 타임스탬프, diff 통계 반환
  → Tauri emit('checkpoint_created', checkpoint_data)
  → 프론트엔드: 타임라인 뷰에 새 체크포인트 추가
```

**루프 모드 실행 흐름:**

```
사용자가 루프 설정 후 시작
  → Tauri invoke('start_loop', { session_id, prompt, exit_conditions, max_cycles })
  → Rust Session Controller:
      반복:
        1. Claude Code CLI 실행 (프롬프트 + 이전 컨텍스트)
        2. JSON stream 파싱 → 프론트엔드에 실시간 전송
        3. CLI 완료 대기
        4. 자동 체크포인트 생성 (Git Manager)
        5. 종료 조건 평가:
           - 커맨드 기준: 지정된 커맨드 실행 후 결과 확인
           - Claude 자율 판단: CLI 출력에서 완료 신호 감지
           - 사이클 상한: 카운터 확인
        6. 조건 미충족 시 → 다음 사이클 프롬프트 구성 후 1번으로
        7. 조건 충족 시 → 루프 종료, 결과 요약 생성
  → Tauri emit('loop_completed', result_summary)
  → 프론트엔드: 루프 완료 알림 + 결과 표시
```

---

## 4. 핵심 컴포넌트 상세 설계

### 4.1 CLI 연동 레이어

#### 4.1.1 프로세스 관리 전략

각 세션은 독립된 Claude Code CLI 프로세스를 가진다. 프로세스 생명주기는 세션 생명주기와 일치한다.

```
세션 생성 시:
  1. Git worktree 생성 (독립 작업 디렉토리)
  2. Claude Code CLI 프로세스 spawn:
     claude -p "{initial_prompt}" \
       --output-format stream-json \
       --model {selected_model} \
       --allowedTools "{allowed_tools}" \
       --permission-mode bypassPermissions \
       --verbose \
       --include-partial-messages
  3. stdout JSON stream 파싱 루프 시작
  4. PTY 연결 (터미널 I/O용)

세션 재개 시:
  claude -p "{prompt}" --resume "{session_id}" --output-format stream-json

세션 종료 시:
  1. CLI 프로세스에 SIGTERM 전송
  2. 최종 체크포인트 생성 (옵션)
  3. 리소스 정리 (PTY, 파일 핸들)
```

#### 4.1.2 JSON Stream 파싱 엔진

Rust 백엔드에서 CLI stdout을 라인 단위로 읽어 NDJSON을 파싱한다. 각 이벤트 타입에 따라 처리한다.

```
파싱 파이프라인:
  stdout readline
    → serde_json::from_str()
    → 이벤트 타입 매칭:
        text_delta      → 프론트엔드 터미널에 텍스트 전송
        tool_use        → 도구 사용 상태 UI 업데이트
        message_delta   → 토큰 사용량/비용 모니터링 업데이트
        message_stop    → 턴 완료 처리
    → Tauri Channel로 프론트엔드에 스트리밍 전송
```

**에러 처리**: CLI 프로세스 비정상 종료(crash, OOM 등) 시 자동 감지하고 사용자에게 알림. 세션 상태는 마지막 체크포인트에서 복구 가능.

#### 4.1.3 PTY와 CLI의 관계

PTY Manager는 터미널 I/O(사용자 키 입력, 쉘 출력 표시)를 담당하고, CLI Process Manager는 Claude Code의 구조화된 출력(JSON stream)을 처리한다. 두 경로는 독립적이지만 같은 세션에 묶여 동작한다.

```
┌──────────┐     PTY (raw I/O)     ┌──────────────┐
│ xterm.js │◄────────────────────►│ PTY Manager  │
│          │     키 입력/출력       │ (portable-pty)│
└──────────┘                       └──────┬───────┘
                                          │
                                   ┌──────▼───────┐
                                   │ Shell Process│
                                   │ (zsh/bash)   │
                                   └──────┬───────┘
                                          │
                                   ┌──────▼───────────────┐
                                   │ Claude Code CLI      │
                                   │ (shell 내에서 실행)   │
                                   │                      │
                                   │ stdout → JSON stream │
                                   │ → CLI Process Manager│
                                   └──────────────────────┘
```

다만, 이 구조에는 두 가지 접근법이 있다.

**접근법 A: PTY 통합형** — Claude Code CLI를 PTY 안의 셸에서 실행. xterm.js가 CLI의 전체 터미널 출력을 보여주고, 동시에 stdout의 JSON stream도 파싱. 사용자가 직접 CLI와 상호작용할 수 있어 Claude Code의 기존 TUI(텍스트 UI)를 그대로 활용 가능.

**접근법 B: 분리형** — Claude Code CLI를 PTY 없이 순수 서브프로세스로 실행 (`-p` 플래그). JSON stream만 파싱하여 커스텀 UI로 표시. PTY는 별도의 작업 터미널용으로만 사용.

**권장: 접근법 A (PTY 통합형)**를 기본으로 하되, 필요에 따라 B도 지원. A가 Claude Code CLI의 기존 기능(인터랙티브 권한 요청, 파일 편집 미리보기 등)을 그대로 살릴 수 있고, 사용자에게 친숙한 경험을 제공한다. JSON stream 파싱은 PTY stdout에서 병렬로 수행한다.

### 4.2 세션 관리 시스템

#### 4.2.1 세션 생명주기

```
[생성] → [활성] → [일시정지] → [활성] → [완료] → [아카이브]
                                           │
                                           ├→ [PR 생성]
                                           └→ [워크트리 정리]
```

**세션 상태 전이:**

- **생성(Created)**: 워크트리 생성, 설정 적용, CLI 프로세스 대기
- **활성(Active)**: CLI 프로세스 실행 중, 사용자 상호작용 가능
- **일시정지(Paused)**: CLI 프로세스 중지, 워크트리 유지 (루프 모드의 일시정지 등)
- **완료(Completed)**: CLI 작업 완료, 결과 확인 대기
- **아카이브(Archived)**: 세션 히스토리에 저장, 워크트리 정리 여부 선택

#### 4.2.2 Git Worktree 격리

각 세션 생성 시 git worktree를 자동 생성하여 독립된 작업 디렉토리를 제공한다.

```
프로젝트 Git 저장소 (.git)
├── main (메인 워크트리)
└── .worktrees/
    ├── session-a-feature-auth/     ← 세션 A의 워크트리
    ├── session-b-bugfix-login/     ← 세션 B의 워크트리
    └── session-c-refactor-api/     ← 세션 C의 워크트리
```

**워크트리 관리 정책:**

- 네이밍 컨벤션: `session-{short-id}-{branch-name}` (예: `session-a1b2-feature-auth`)
- 동일 브랜치 중복 체크아웃 방지 (Git 기본 제약)
- 세션 완료 후 워크트리 정리 옵션: 즉시 삭제 / 보존 (기본: 보존, 사용자 선택으로 삭제)
- 주기적 정리: `git worktree prune`으로 stale 메타데이터 정리
- 디스크 사용량 모니터링: 세션 관리 UI에서 각 워크트리 크기 표시

**디스크 사용량 참고:** 30,000 파일 규모 저장소 기준, 전체 클론 약 1GB, 추가 워크트리 약 150MB (약 85% 절감). npm install 등 의존성 설치는 별도 필요. pnpm 같은 공유 캐시 패키지 매니저 사용 권장.

**참고 자료:**
- [Git Worktree 문서](https://git-scm.com/docs/git-worktree)
- [Git Worktree + Claude Code 병렬 개발](https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe)
- [incident.io의 Claude Code + Git Worktrees 활용](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees)

#### 4.2.3 세션 생성 시 설정

세션 생성 UI에서 다음 항목을 설정한다. 전역 기본값이 있으며 세션별로 오버라이드 가능.

```
세션 설정 구조:
├── 기본 정보
│   ├── 세션 이름 (자동 생성 + 수정 가능)
│   ├── 프로젝트 (Git 저장소 경로)
│   └── 베이스 브랜치 (워크트리 생성 기준)
├── Claude 설정
│   ├── 모델 선택 (Opus / Sonnet / 전체 모델명)
│   ├── 시스템 프롬프트 추가 (--append-system-prompt)
│   └── 초기 프롬프트
├── 도구 설정
│   ├── MCP 서버 선택 (체크박스)
│   ├── 허용 도구 목록 (allowedTools)
│   └── 금지 도구 목록 (disallowedTools)
├── 보안 설정
│   ├── 권한 모드 (bypassPermissions 기본)
│   └── 금지 bash 커맨드 목록
└── 루프 설정 (루프 모드 시)
    ├── 종료 조건
    ├── 최대 사이클 수
    └── 사이클별 자동 커밋 여부
```

#### 4.2.4 다중 세션 관리

여러 세션을 탭 또는 사이드바로 동시에 표시한다. 사용자 입력이 필요한 이벤트(AskQuestion 등) 발생 시 해당 세션으로 자동 포커스 이동하고 macOS 네이티브 알림을 전송한다.

```
세션 관리 UI:
┌──────────────────────────────────────────┐
│  [세션 A ●] [세션 B ◐] [세션 C ○] [+]   │  ← 탭 (●활성 ◐대기 ○완료)
├──────────────────────────────────────────┤
│                                          │
│  세션 A - feature/auth                   │
│  모델: opus | 토큰: 12.3K | 비용: $0.45 │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ xterm.js 터미널                  │    │
│  │                                  │    │
│  │ > claude이(가) auth.ts를 수정... │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [체크포인트 ✓] [일시정지 ⏸] [종료 ■]   │
└──────────────────────────────────────────┘
```

### 4.3 체크포인트 시스템

#### 4.3.1 체크포인트 = Git Commit

체크포인트는 워크트리 내의 git commit이다. 추가 메타데이터는 커밋 메시지에 구조화된 형태로 포함한다.

```
커밋 메시지 형식:
[claude-gui] checkpoint: {사용자 메시지}

--- metadata ---
session_id: {세션 ID}
cycle: {루프 사이클 번호, 해당 시}
tokens_used: {이 체크포인트까지의 누적 토큰}
cost_usd: {이 체크포인트까지의 누적 비용}
timestamp: {ISO 8601 타임스탬프}
```

#### 4.3.2 핵심 기능

**체크포인트 생성**: 수동(단축키 Cmd+S) 또는 자동(루프 모드에서 매 사이클 후). Git Manager가 `git add -A && git commit` 실행.

**롤백**: 특정 체크포인트로 되돌리기. `git reset --hard {commit_hash}` 실행 후 세션을 해당 시점에서 재개. 롤백 전 현재 상태를 별도 브랜치로 백업.

**체크포인트 간 Diff**: 두 체크포인트 사이의 `git diff`를 시각적으로 표시. 파일별 변경사항, 추가/삭제 라인 수, 요약 통계 제공.

**타임라인 뷰**: 세션 내 모든 체크포인트를 시간순으로 나열. 각 체크포인트에 메시지, 변경 파일 수, 토큰/비용 정보 표시.

```
타임라인 뷰:
──●────────●────────●────────●────────●──→ 시간
  │        │        │        │        │
  CP1      CP2      CP3      CP4      현재
  초기     인증     테스트    리팩토링
  셋업     구현     추가     완료
  +5파일   +3파일   +2파일   ~4파일
```

#### 4.3.3 세션 완료 후 PR 생성

세션 완료 시 워크트리의 브랜치를 원격에 push하고 PR을 자동 생성하는 옵션을 제공한다. PR 제목과 설명은 세션의 체크포인트 히스토리와 Claude의 작업 요약을 기반으로 자동 생성한다. `gh pr create` CLI 또는 GitHub API를 사용한다.

### 4.4 루프 모드

#### 4.4.1 실행 구조

루프 모드는 Claude Code CLI를 반복 실행하면서 매 사이클 후 체크포인트를 생성하고, 종료 조건을 평가하여 자동으로 멈추는 기능이다.

```
┌─────────────────────────────────────────────────────────┐
│                    루프 실행 엔진                         │
│                                                         │
│  ┌─────────┐    ┌──────────┐    ┌───────────────┐      │
│  │ 프롬프트 │───→│ CLI 실행 │───→│ 자동 체크포인트│      │
│  │ 구성     │    │ (세션)   │    │ (git commit)  │      │
│  └─────────┘    └──────────┘    └───────┬───────┘      │
│       ▲                                  │              │
│       │                                  ▼              │
│       │                          ┌──────────────┐      │
│       │                          │ 종료 조건    │      │
│       │              ┌───────────│ 평가         │      │
│       │              │           └──────────────┘      │
│       │         미충족│                  │충족          │
│       │              ▼                  ▼              │
│  ┌────┴───────┐  ┌──────┐       ┌──────────┐         │
│  │ 다음 사이클 │←─│ 계속 │       │ 루프 종료 │         │
│  │ 프롬프트    │  └──────┘       └──────────┘         │
│  └────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

#### 4.4.2 종료 조건 시스템

세 가지 종료 조건 타입을 조합(AND/OR)하여 사용할 수 있다.

**커맨드 기준**: 매 사이클 후 지정된 커맨드를 실행하여 결과로 판단.

```
예시:
  커맨드: tsc --noEmit
  조건: exit code == 0 이면 종료

  커맨드: npm test
  조건: "Tests: X passed, 0 failed" 패턴 매칭 시 종료
```

**자연어 기준**: Claude에게 자연어 완료 기준을 전달하고, 매 사이클의 프롬프트에 포함하여 Claude가 "완료" 신호를 보내면 종료.

```
예시:
  "모든 함수가 20줄 이하가 될 때까지 리팩토링해. 완료되면 [DONE]을 출력해."
  → CLI 출력에서 [DONE] 감지 시 종료
```

**Claude 자율 판단**: Claude가 "더 이상 개선할 것이 없다"고 판단하면 종료. `--json-schema`를 활용하여 매 사이클 종료 시 구조화된 완료 상태를 받을 수 있다.

#### 4.4.3 안전장치

루프 모드의 비용 폭주를 방지하기 위한 다중 안전장치를 둔다. 이는 "Ralph Loop" 패턴에서 알려진 리스크(토큰 소모, 모드 붕괴)에 대한 대응이다.

```
안전장치 계층:
├── 사이클 상한 (기본: 50 사이클)
├── 비용 상한 (기본: $10 USD, 사용자 설정 가능)
├── 시간 상한 (기본: 2시간, 사용자 설정 가능)
├── 무변경 감지 (3 사이클 연속 diff 없으면 자동 중지)
└── 수동 중지 (언제든 가능)
```

**참고 자료:**
- [자기 개선 코딩 에이전트](https://addyosmani.com/blog/self-improving-agents/) - Ralph Loop 패턴의 리스크 분석
- [From ReAct to Ralph Loop](https://www.alibabacloud.com/blog/from-react-to-ralph-loop-a-continuous-iteration-paradigm-for-ai-agents_602799)

#### 4.4.4 사이클 간 컨텍스트 관리

각 사이클은 독립된 Claude Code 세션이다. 이전 사이클의 결과를 다음 사이클에 전달하기 위해 두 가지 전략을 사용한다.

**전략 1: Git 히스토리 기반** — 이전 사이클의 코드 변경이 워크트리에 커밋되어 있으므로, 새 사이클에서 Claude가 파일을 읽으면 이전 작업 결과를 자연스럽게 인식. 가장 단순하고 비용 효율적.

**전략 2: 요약 주입** — `--continue` 플래그로 이전 세션을 이어서 진행하거나, 이전 사이클 결과를 요약하여 다음 사이클의 `--append-system-prompt`에 주입.

기본적으로 전략 1을 사용하고, 복잡한 작업에서 전략 2를 선택적으로 활성화한다.

---

## 5. 모니터링 시스템

### 5.1 토큰/비용 추적

CLI의 JSON stream에서 `message_delta` 이벤트의 `usage` 필드와 최종 `--output-format json` 결과의 `total_cost_usd`를 수집한다.

```
모니터링 데이터 구조:
├── 세션 레벨
│   ├── 총 토큰 (input + output)
│   ├── 총 비용 (USD)
│   ├── 사이클별 비용 (루프 모드)
│   └── 경과 시간
├── 프로젝트 레벨
│   ├── 세션별 비용 합계
│   └── 일/주/월 비용 추이
└── 전역 레벨
    ├── 전체 프로젝트 비용 합계
    └── 예산 대비 사용률
```

### 5.2 컨텍스트 윈도우 시각화

CLI의 JSON stream에서 토큰 사용량 정보를 파싱하여 현재 컨텍스트 점유율을 시각적으로 표시한다. 컨텍스트 overflow 임박 시 사전 경고를 제공한다.

### 5.3 예산 관리

사용자가 세션별/프로젝트별/전역 예산 상한을 설정하면, 실시간 비용이 상한에 근접할 때(80%, 100%) 경고 알림을 보내고, 100% 도달 시 세션 일시정지를 제안한다.

---

## 6. 설정 관리

### 6.1 설정 계층 구조

```
설정 적용 우선순위 (높은 순):
  1. 세션별 설정 (세션 생성 시 지정)
  2. 프로젝트 로컬 설정 (프로젝트 루트/.claude-gui/)
  3. 전역 설정 (~/Library/Application Support/claude-gui/)
  4. 앱 기본값
```

### 6.2 설정 저장 형식

JSON 파일로 저장. Claude Code의 기존 설정 파일(`.claude/settings.json`, `CLAUDE.md`)과 호환성을 유지하되, GUI 전용 설정은 별도 네임스페이스에 저장.

### 6.3 설정 GUI

관리 가능 항목: 모델 기본값, MCP 서버 관리 (추가/제거/활성화), 스킬 관리, 금지 bash 커맨드 목록, 알림 설정 (사운드, 트레이 배지), 테마 설정, 루프 모드 기본 안전장치 값.

---

## 7. 배포 전략

### 7.1 초기: DMG 직접 배포

Tauri v2의 macOS 앱 번들(.app)을 DMG 이미지로 패키징하여 배포. Apple Developer Certificate로 코드 사이닝 및 공증(Notarization) 수행. GitHub Releases 또는 공식 웹사이트를 통해 배포.

### 7.2 자동 업데이트

Tauri v2의 내장 updater 플러그인 사용. 앱 시작 시 업데이트 확인 → 사용자에게 안내 → 인앱 업데이트 실행.

### 7.3 향후: Mac App Store

Tauri v2는 App Store 배포를 공식 지원하나, 다음 과제가 있다.

- App Sandbox 환경에서의 동작 검증 (CLI 서브프로세스 spawn, 파일 시스템 접근, PTY 생성 등)
- Entitlements.plist 구성 (App Sandbox capability 필수)
- 앱 검수 가이드라인 준수 확인

App Sandbox 제약이 CLI 서브프로세스 spawn이나 Git 조작에 영향을 줄 수 있으므로, App Store 배포 전 충분한 검증이 필요하다. DMG 직접 배포를 기본으로 유지하면서 App Store는 선택적으로 추진한다.

**참고 자료:**
- [Tauri App Store 배포 가이드](https://v2.tauri.app/distribute/app-store/)
- [Tauri macOS 코드 사이닝](https://v2.tauri.app/distribute/sign/macos/)

---

## 8. 리스크 및 제약사항

### 8.1 기술 리스크

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|-----------|
| Claude Code CLI 출력 포맷 변경 | 높음 | 중간 | 파싱 레이어 추상화, CLI 버전별 어댑터 패턴, 통합 테스트 |
| xterm.js Tauri 리사이즈 버그 | 중간 | 높음 | fitAddon 호출 순서 준수, 터미널 폭 제한, 폴백 처리 |
| App Sandbox에서 CLI subprocess 제한 | 높음 | 중간 | DMG 직접 배포를 기본으로, App Store는 별도 검증 후 |
| Git worktree 대량 생성 시 디스크 부족 | 중간 | 중간 | 워크트리 크기 모니터링, 자동 정리 정책, 사용자 경고 |
| 루프 모드 비용 폭주 | 높음 | 중간 | 다중 안전장치 (사이클/비용/시간 상한), 무변경 감지 |
| CLI 프로세스 좀비 발생 | 중간 | 낮음 | 프로세스 모니터링, 타임아웃 기반 자동 정리, SIGKILL 폴백 |

### 8.2 알려진 제약

- **macOS 전용**: Tauri v2는 크로스 플랫폼을 지원하나, v1에서는 macOS에 집중. WKWebView 기반 WebGL 지원은 macOS 버전에 따라 다를 수 있음.
- **CLI 의존성**: Claude Code CLI가 설치되어 있어야 동작. CLI 버전 호환성 관리 필요.
- **오프라인 미지원**: Claude API 연결이 필수.
- **Git 기반 프로젝트만 지원**: 체크포인트/워크트리 기능이 git에 의존하므로 non-git 프로젝트는 제한적 지원.

---

## 9. 로드맵

### v1 — 핵심 기능 (목표: 8-12주)

**Phase 1: 프로젝트 부트스트랩 (1-2주)**
- Tauri v2 프로젝트 초기화 (React + TypeScript)
- 기본 앱 레이아웃 & 네비게이션 셸
- xterm.js 터미널 컴포넌트 통합 (WebGL 렌더러)
- Rust PTY Manager 기초 구현 (portable-pty)

**Phase 2: CLI 연동 + 세션 관리 (2-3주)**
- Claude Code CLI 서브프로세스 연동
- JSON stream 파싱 엔진
- 프로젝트 기반 세션 생성/관리 UI
- Git worktree 격리 시스템
- 세션별 설정 (모델, 도구, 권한)
- 다중 세션 & 자동 포커스

**Phase 3: 체크포인트 시스템 (1-2주)**
- Git 기반 체크포인트 생성/롤백
- 체크포인트 간 Diff 뷰
- 타임라인 뷰
- 세션 완료 후 PR 자동 생성

**Phase 4: 루프 모드 (2-3주)**
- 루프 실행 엔진 & 사이클별 자동 커밋
- 종료 조건 시스템 (커맨드/자연어/자율 판단)
- 안전장치 (사이클/비용/시간 상한, 무변경 감지)
- 일시정지/재개
- 사이클별 diff 요약

**Phase 5: 모니터링 + 설정 + 배포 (2주)**
- 토큰/비용 추적 대시보드
- 컨텍스트 윈도우 시각화
- 설정 관리 GUI (전역/로컬)
- 알림 시스템 (macOS 네이티브)
- DMG 패키징 & 코드 사이닝
- 자동 업데이트 설정

### v2 — 워크플로우 시스템 (목표: v1 이후 6-8주)

- n8n 스타일 비주얼 노드 에디터
- 노드 타입 구현 (세션, 조건, 루프, 트리거, Git, 알림)
- 세션 간 컨텍스트 전달 (compact → 주입)
- 워크플로우 JSON 직렬화/역직렬화
- 템플릿 라이브러리 & 내보내기/가져오기
- 변수(플레이스홀더) 시스템

### v3 — 확장 (미정)

- 커뮤니티 워크플로우 템플릿 마켓플레이스
- 멀티 모델 동시 비교 실행
- 팀 단위 설정 공유/동기화
- 플러그인 시스템
- Agent SDK 직접 연동 (CLI 서브프로세스 대체)

---

## 10. 미해결 설계 결정

아래 항목들은 구현 과정에서 프로토타이핑 후 결정이 필요하다.

**PTY 통합 방식**: 접근법 A(PTY 통합형)를 권장했으나, 실제 구현 시 Claude Code CLI의 인터랙티브 모드와 `--output-format stream-json`의 동시 사용 가능 여부를 검증해야 한다. `-p` (print) 플래그 사용 시 비대화형 모드가 되므로, 인터랙티브 권한 요청을 GUI에서 처리하는 별도 메커니즘이 필요할 수 있다.

**워크트리 정리 타이밍**: 세션 완료 즉시 삭제 vs 수동 삭제 vs 일정 기간 후 자동 삭제. 디스크 사용량과 사용자 편의성 사이의 균형.

**루프 모드 컨텍스트 전달**: `--continue` vs `--resume` vs 순수 파일 기반. 토큰 비용과 컨텍스트 품질의 트레이드오프.

**컨텍스트 윈도우 시각화 정확도**: CLI가 제공하는 토큰 사용량 정보의 세분화 수준(파일별/요소별 비중)에 따라 시각화 범위가 달라짐.

**설정 파일 호환성**: Claude Code의 기존 설정 파일(.claude/settings.json 등)과의 양방향 동기화 범위.

---

## 부록 A. 데이터 저장소 설계

### A.1 저장소 구조

```
~/Library/Application Support/claude-gui/
├── config.json                    ← 전역 설정
├── db/
│   └── sessions.sqlite            ← 세션/체크포인트/비용 이력 DB
└── logs/
    └── app.log                    ← 앱 로그

{프로젝트 루트}/.claude-gui/
├── config.json                    ← 프로젝트 로컬 설정
└── session-cache/                 ← 세션 캐시 (임시)
```

### A.2 핵심 데이터 모델

세션 히스토리, 체크포인트, 비용 추적 데이터는 SQLite에 저장한다. SQLite는 단일 파일 기반으로 설치 부담이 없고, Rust에서 `rusqlite` 크레이트로 안정적으로 사용할 수 있다.

```
주요 테이블:
├── projects         (id, path, name, created_at)
├── sessions         (id, project_id, name, branch, worktree_path,
│                     model, status, config_json, created_at, ended_at)
├── checkpoints      (id, session_id, commit_hash, message,
│                     files_changed, lines_added, lines_deleted,
│                     tokens_cumulative, cost_cumulative, created_at)
├── loop_cycles      (id, session_id, cycle_number, prompt,
│                     checkpoint_id, exit_condition_result,
│                     tokens_used, cost_usd, duration_ms, created_at)
└── cost_tracking    (id, session_id, input_tokens, output_tokens,
                      total_tokens, cost_usd, model, created_at)
```

### A.3 데이터 보존 정책

세션 히스토리와 비용 데이터는 영구 보존한다 (사용자가 명시적으로 삭제하기 전까지). 워크트리와 세션 캐시는 사용자 설정에 따라 자동 정리한다.

---

## 부록 B. 에러 처리 전략

### B.1 에러 분류

```
에러 계층:
├── Fatal (앱 종료 필요)
│   ├── Tauri IPC 초기화 실패
│   ├── SQLite DB 접근 불가
│   └── PTY 시스템 초기화 실패
├── Session-Fatal (해당 세션만 종료)
│   ├── CLI 프로세스 비정상 종료 (crash/OOM)
│   ├── 워크트리 생성 실패 (디스크 부족, 권한 문제)
│   └── Git 조작 실패 (corruption, lock 충돌)
├── Recoverable (자동 재시도 또는 사용자 선택)
│   ├── CLI JSON 파싱 에러 (단일 라인 스킵 후 계속)
│   ├── 네트워크 일시 단절 (재연결 대기)
│   ├── Claude API 레이트 리밋 (대기 후 재시도)
│   └── xterm.js 렌더링 에러 (폴백 렌더러 전환)
└── Warning (사용자 알림만)
    ├── 디스크 사용량 임계값 초과
    ├── 비용 예산 근접
    └── CLI 버전 불일치 감지
```

### B.2 복구 흐름

CLI 프로세스 비정상 종료 시: 마지막 체크포인트 확인 → 세션 상태를 "일시정지"로 전환 → 사용자에게 알림 (복구/재시작/종료 선택) → 복구 선택 시 마지막 체크포인트에서 `--resume`으로 재개.

Git 워크트리 lock 충돌 시: `.git/index.lock` 파일 존재 확인 → 해당 프로세스 생존 여부 확인 → 좀비 lock이면 자동 제거 후 재시도 → 실패 시 사용자에게 수동 해결 안내.

루프 모드 모드 붕괴 감지 시: 3회 연속 동일 diff 패턴 감지 → 자동 일시정지 → 사용자에게 "동일한 변경이 반복되고 있습니다" 알림 → 프롬프트 수정 또는 루프 종료 제안.

---

## 부록 C. 테스트 전략

### C.1 테스트 레이어

**Unit Test (Rust)**: Git Manager, JSON 파싱 엔진, 세션 상태 머신, 종료 조건 평가 로직. `cargo test`로 실행.

**Unit Test (TypeScript)**: React 컴포넌트, 상태 관리 로직, 유틸리티 함수. Vitest로 실행.

**Integration Test**: CLI 연동 테스트는 실제 Claude Code CLI 대신 Mock CLI를 사용한다. Mock CLI는 미리 녹화된 JSON stream을 재생하여 파싱 엔진의 정확성을 검증한다. 워크트리 생성/삭제, 체크포인트 생성/롤백은 임시 Git 저장소에서 실제 git 명령으로 테스트한다.

**E2E Test**: Tauri의 테스트 유틸리티(WebDriver 기반)로 실제 앱을 실행하여 주요 워크플로우(세션 생성 → 작업 → 체크포인트 → 롤백) 검증.

### C.2 Mock CLI 전략

실제 CLI를 사용하면 테스트마다 API 비용이 발생하므로, 주요 시나리오별 JSON stream 응답을 녹화(record)하여 재생(replay)하는 방식을 사용한다. 녹화 파일은 `test-fixtures/` 디렉토리에 보관하며, CLI 버전 업데이트 시 재녹화한다.

---

## 부록 D. 보안 고려사항

### D.1 API 키 관리

Claude Code CLI가 자체적으로 API 키를 관리하므로, GUI 앱은 API 키를 직접 저장하지 않는다. CLI의 인증 메커니즘을 그대로 활용한다.

### D.2 실행 보안

bypass 모드(사용자 확인 없이 실행)가 기본이므로, 다음 보안 레이어를 둔다.

- **금지 커맨드 목록**: `rm -rf /`, `sudo`, `chmod 777` 등 위험 bash 커맨드 차단 (CLI의 `--disallowedTools` 활용)
- **워크트리 격리**: 메인 브랜치에 직접 쓰기 불가. 모든 작업은 독립 워크트리에서 수행.
- **체크포인트 롤백**: 문제 발생 시 즉시 이전 상태로 복원 가능.
- **비용 상한**: 루프 모드의 비용 폭주 방지.

### D.3 감사 로깅

CLI가 실행한 모든 도구 사용(파일 편집, bash 명령 등)을 JSON stream에서 추출하여 세션별 로그로 저장한다. 이 로그는 세션 히스토리에서 조회 가능하다.

---

## 부록 E. 성능 목표

| 항목 | 목표값 | 측정 방법 |
|------|--------|-----------|
| 앱 시작 시간 | 1초 이내 | 앱 아이콘 클릭 → 메인 윈도우 표시 |
| 터미널 렌더링 FPS | 60fps (WebGL) | xterm.js 대량 출력 시 |
| 세션 생성 시간 | 3초 이내 | 워크트리 생성 + CLI spawn 포함 |
| 체크포인트 생성 시간 | 1초 이내 | 일반적 크기 프로젝트 기준 |
| 동시 세션 수 | 최대 10개 | 세션당 메모리 30-50MB 추정 |
| 유휴 메모리 사용 | 80MB 이내 | 세션 1개 활성 상태 기준 |
| 앱 번들 사이즈 | 5MB 이내 | DMG 패키지 기준 |

---

## 부록 F. 참고 자료 종합

### 기술 스택 & 프레임워크
- [Tauri 2.0 Stable Release](https://v2.tauri.app/blog/tauri-20/)
- [Tauri IPC 아키텍처](https://v2.tauri.app/concept/inter-process-communication/)
- [Tauri macOS 배포](https://v2.tauri.app/distribute/macos-application-bundle/)
- [xterm.js v6.0.0 릴리스](https://github.com/xtermjs/xterm.js/releases)
- [portable-pty 문서](https://docs.rs/portable-pty)
- [tauri-plugin-pty](https://crates.io/crates/tauri-plugin-pty)

### Claude Code CLI
- [Claude Code CLI 레퍼런스](https://code.claude.com/docs/en/cli-reference)
- [Claude Code 프로그래밍 실행 (Headless)](https://code.claude.com/docs/en/headless)
- [Agent SDK 개요](https://platform.claude.com/docs/en/agent-sdk/overview)
- [스트리밍 출력](https://platform.claude.com/docs/en/agent-sdk/streaming-output)

### Git Worktree
- [Git Worktree 공식 문서](https://git-scm.com/docs/git-worktree)
- [Git Worktree + Claude Code 병렬 개발](https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe)
- [incident.io: Claude Code + Git Worktrees](https://incident.io/blog/shipping-faster-with-claude-code-and-git-worktrees)
- [git2 Rust 크레이트 Worktree API](https://docs.rs/git2/latest/git2/struct.Worktree.html)

### 경쟁 제품 & 에이전트 패턴
- [Opcode (Tauri 2 기반 Claude Code GUI)](https://github.com/winfunc/opcode)
- [자기 개선 코딩 에이전트 - Addy Osmani](https://addyosmani.com/blog/self-improving-agents/)
- [Ralph Loop 패턴](https://www.alibabacloud.com/blog/from-react-to-ralph-loop-a-continuous-iteration-paradigm-for-ai-agents_602799)
- [OpenHands (자율 코딩 에이전트)](https://openhands.dev/)
- [SWE-agent (GitHub 이슈 자동 해결)](https://swe-agent.com/latest/)
- [Aider Git 통합](https://aider.chat/docs/git.html)

---

*이 문서의 모든 기술적 주장은 2025-2026년 기준 웹 리서치를 통해 검증되었습니다.*
