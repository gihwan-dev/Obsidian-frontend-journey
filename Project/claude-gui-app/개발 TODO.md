# Claude GUI App — 개발 TODO

> IMPLEMENTATION-SPEC.md 기반 구현 로드맵
> 작성일: 2026-02-08 | 상태: 구현 미착수
> v1 총 예상 기간: 8~12주 | v2 이후 별도

---

## Phase 1: 프로젝트 부트스트랩 (1~2주)

> 목표: 앱이 뜨고, 터미널에 글자가 찍히는 것까지

- [x] [[Tauri v2 프로젝트 초기화]]
  - React + TypeScript + Vite 설정
  - Tauri v2 IPC 기본 구조 (invoke/emit/channel)
  - macOS 빌드 확인
- [ ] [[기본 앱 레이아웃 & 네비게이션 셸]]
  - 사이드바 + 메인 영역 + 탭 구조
  - Zustand 상태 관리 초기 셋업
- [ ] [[xterm.js 터미널 컴포넌트 통합]]
  - WebGL 렌더러 적용 (Canvas 폴백)
  - fitAddon 리사이즈 처리 (호출 순서 주의: open → fit)
  - 터미널 폭 80-120컬럼 제한
- [ ] [[Rust PTY Manager 기초 구현]]
  - portable-pty 크레이트 통합
  - tokio::spawn_blocking 비동기 래핑
  - Tauri Channel을 통한 PTY ↔ xterm.js 스트리밍 연결
- [ ] SQLite 데이터 저장소 초기화
  - rusqlite 크레이트 통합
  - projects, sessions, checkpoints, cost_tracking 테이블 생성
  - ~/Library/Application Support/claude-gui/ 경로 설정

---

## Phase 2: CLI 연동 + 세션 관리 (2~3주)

> 목표: Claude Code CLI를 GUI에서 실행하고 결과를 받아볼 수 있는 것
> 의존: Phase 1 완료 필수

### CLI 연동
- [ ] [[Claude Code CLI 서브프로세스 연동]]
  - `claude -p` 비대화형 모드 서브프로세스 spawn
  - 세션별 독립 프로세스 관리
  - 프로세스 생명주기 (spawn → monitor → terminate)
  - SIGTERM/SIGKILL 정리 로직
- [ ] [[JSON 스트림 파싱 엔진]]
  - NDJSON 라인 단위 파싱 (serde_json)
  - 이벤트 타입별 처리: text_delta, tool_use, message_delta, message_stop
  - Tauri Channel로 프론트엔드에 실시간 스트리밍
  - 파싱 에러 시 해당 라인 스킵 후 계속 (Recoverable 에러)
- [ ] PTY 통합 방식 프로토타이핑
  - 접근법 A (PTY 통합형) vs B (분리형) 비교 검증
  - `-p` 플래그 + `--output-format stream-json` 동시 사용 테스트
  - 인터랙티브 권한 요청의 GUI 처리 방안 결정

### 세션 관리
- [ ] [[프로젝트 기반 세션 생성 관리 UI]]
  - 프로젝트(Git 저장소) 등록/선택
  - 세션 생성 다이얼로그 (모델, 프롬프트, 도구 설정)
  - 세션 목록 (탭 또는 사이드바)
  - 세션 상태 표시 (●활성 ◐대기 ○완료)
- [ ] [[Git Worktree 격리 시스템]]
  - git2 크레이트를 통한 워크트리 생성/삭제
  - 네이밍: `session-{short-id}-{branch-name}`
  - 동일 브랜치 중복 체크아웃 방지
  - 워크트리 크기 모니터링 (디스크 사용량 표시)
- [ ] [[세션별 설정 구현]]
  - 전역 → 프로젝트 → 세션 3단계 설정 오버라이드
  - 모델 선택, MCP 서버 체크박스, 허용/금지 도구
  - 권한 모드 (bypassPermissions 기본)
  - 설정 JSON 저장/로드
- [ ] [[멀티 세션 & 자동 포커스]]
  - 여러 세션 동시 실행 (탭 UI)
  - AskQuestion 등 사용자 입력 필요 시 자동 포커스 이동
  - 세션별 토큰/비용 실시간 표시

---

## Phase 3: 체크포인트 시스템 (1~2주)

> 목표: 세션 내 상태를 스냅샷하고 되돌릴 수 있는 것
> 의존: Phase 2의 세션 관리 + Git Worktree 완료 필수

- [ ] [[Git 기반 체크포인트 생성 롤백]]
  - 수동 체크포인트 생성 (Cmd+S 단축키)
  - git add -A && git commit (구조화된 커밋 메시지)
  - 롤백: git reset --hard {commit_hash} + 현재 상태 백업 브랜치
  - 커밋 메시지에 세션 메타데이터 포함 (session_id, tokens, cost)
- [ ] [[체크포인트 Diff & 타임라인 뷰]]
  - 두 체크포인트 간 git diff 시각화
  - 파일별 변경사항, 추가/삭제 라인 수
  - 타임라인 뷰: 시간순 체크포인트 나열
  - 각 체크포인트에 메시지, 변경 파일 수, 토큰/비용 표시
- [ ] [[세션 완료 후 자동 PR 생성]]
  - 워크트리 브랜치 → 원격 push
  - `gh pr create` 또는 GitHub API 호출
  - PR 제목/설명 자동 생성 (체크포인트 히스토리 + 작업 요약 기반)

---

## Phase 4: 루프 모드 (2~3주)

> 목표: Claude를 반복 실행하여 자동으로 작업을 개선하는 것
> 의존: Phase 2 (CLI 연동) + Phase 3 (체크포인트) 완료 필수

- [ ] [[루프 실행 엔진 & 자동 커밋]]
  - 사이클 단위 CLI 반복 실행 로직
  - 매 사이클 완료 후 자동 체크포인트 생성
  - 사이클 간 컨텍스트 관리 (기본: Git 히스토리 기반, 선택: 요약 주입)
  - 사이클 카운터 + 실시간 진행 상황 UI
- [ ] [[종료 조건 시스템]]
  - 커맨드 기준: 지정 커맨드 실행 → exit code / 출력 패턴 매칭
  - 자연어 기준: 완료 키워드 감지 (예: [DONE])
  - Claude 자율 판단: --json-schema로 구조화된 완료 상태
  - 조건 조합 (AND/OR) 지원
- [ ] [[사이클 관리 기능]]
  - 일시정지 / 재개
  - 사이클별 diff 요약 UI
  - 사이클별 토큰/비용 표시
- [ ] 루프 모드 안전장치
  - 사이클 상한 (기본: 50)
  - 비용 상한 (기본: $10 USD, 사용자 설정)
  - 시간 상한 (기본: 2시간, 사용자 설정)
  - 무변경 감지 (3회 연속 diff 없으면 자동 중지)
  - 모드 붕괴 감지 (3회 연속 동일 diff 패턴 → 자동 일시정지)

---

## Phase 5: 모니터링 + 설정 + 배포 (2주)

> 목표: 사용량을 추적하고, 설정을 GUI로 관리하고, 배포할 수 있는 것
> 의존: Phase 1~4 기능 안정화 후

### 모니터링
- [ ] [[토큰 비용 추적 & 예산 관리]]
  - JSON stream의 usage 필드 수집
  - 세션별, 프로젝트별, 일/주/월 비용 표시
  - 예산 상한 설정 + 80%/100% 경고 알림
- [ ] [[컨텍스트 윈도우 시각화]]
  - 현재 컨텍스트 점유율 시각 표시
  - overflow 사전 경고
- [ ] [[스킬 사용 모니터링]]
  - 로드된 스킬 목록, 호출 추적, 사용 빈도

### 설정 & UX
- [ ] [[설정 관리 GUI]]
  - 전역/로컬 2단계 설정 UI
  - 정책 관리 (금지 bash 커맨드)
  - MCP 서버 관리 (추가/활성화/비활성화)
  - 스킬 관리
  - 모델 기본값
- [ ] [[알림 시스템 구현]]
  - macOS 네이티브 알림 (@tauri-apps/plugin-notification)
  - AskQuestion 발생 → 자동 포커스 + 시스템 알림
  - 장시간 작업 완료 알림
  - 비용 상한 도달 경고
- [ ] [[키보드 단축키 & 커맨드 팔레트]]
  - 주요 기능 단축키 매핑
  - Cmd+K 커맨드 팔레트
- [ ] [[Claude 브랜드 테마 적용]]

### 배포
- [ ] DMG 패키징 & 코드 사이닝
  - Apple Developer Certificate 설정
  - 공증(Notarization) 워크플로우
- [ ] 자동 업데이트 설정
  - Tauri updater 플러그인 통합
  - GitHub Releases 기반 업데이트 서버

### 품질 보증
- [ ] 에러 처리 시스템 통합
  - Fatal / Session-Fatal / Recoverable / Warning 분류 적용
  - CLI 프로세스 비정상 종료 복구 흐름
  - Git lock 충돌 자동 해결
- [ ] 테스트 스위트 구축
  - Rust unit test (cargo test)
  - TypeScript unit test (Vitest)
  - Mock CLI 기반 통합 테스트
  - E2E 주요 워크플로우 검증

---

## v2: 워크플로우 시스템 (v1 이후 6~8주)

> v1 안정화 후 착수

- [ ] [[n8n 스타일 비주얼 노드 에디터]]
- [ ] [[워크플로우 노드 타입 구현]]
  - 세션, 조건, 루프, 트리거, Git, 알림 노드
- [ ] [[세션 간 컨텍스트 전달]]
  - 자동 compact 실행 → 요약본 추출 → 다음 노드 프롬프트 주입
- [ ] [[워크플로우 저장 공유 & 템플릿]]
  - JSON 직렬화/역직렬화
  - 템플릿 라이브러리
  - 변수(플레이스홀더) 시스템: `{{target_dir}}`, `{{feature_name}}`
  - 내보내기/가져오기

---

## v3: 확장 (미정)

- [ ] 커뮤니티 워크플로우 템플릿 마켓플레이스
- [ ] 멀티 모델 동시 비교 실행
- [ ] 팀 단위 설정 공유/동기화
- [ ] 플러그인 시스템
- [ ] Agent SDK 직접 연동 (CLI 서브프로세스 대체)

---

## ⚠️ 미해결 설계 결정

> 프로토타이핑 과정에서 결정 필요

- **PTY 통합 방식**: 접근법 A(PTY 통합형) vs B(분리형). Phase 2에서 프로토타이핑 후 결정
- **워크트리 정리 타이밍**: 즉시 삭제 vs 수동 vs 일정 기간 후 자동. 디스크 vs 편의성 트레이드오프
- **루프 모드 컨텍스트 전달**: `--continue` vs `--resume` vs 순수 파일 기반. 토큰 비용 vs 품질
- **설정 파일 호환성**: Claude Code 기존 설정(.claude/settings.json)과의 양방향 동기화 범위

### 리서치로 해결된 논점

- ~~**Tauri v2 안정성**~~: 2024.10 안정 릴리스 확인. macOS 알림, 트레이, 파일 시스템 완전 지원
- ~~**xterm.js 성능**~~: WebGL 렌더러로 900% 향상. 80-120컬럼 제한 + fitAddon 호출 순서로 대응
- ~~**무한 루프 안전장치**~~: 5중 안전장치 체계 설계 완료 (사이클/비용/시간/무변경/모드붕괴)
- ~~**워크플로우 복잡도**~~: v2로 분리하여 v1 스코프에서 제외

---

*참조: [구현 스펙 문서](./docs/IMPLEMENTATION-SPEC.md)*
