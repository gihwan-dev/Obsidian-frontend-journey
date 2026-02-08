# Git Worktree 격리 시스템

#claude-gui-app #단기 #세션관리 #Git

## 요약
세션 생성 시 git worktree를 자동으로 생성하여 메인 브랜치를 오염시키지 않는 격리된 작업 환경을 제공한다.

## 왜?
- bypass 모드에서 Claude가 자유롭게 코드를 수정하므로, 메인 브랜치 직접 수정은 위험
- 각 세션이 독립된 worktree에서 작업하면 세션 간 충돌 없이 병렬 작업 가능
- 롤백, 체크포인트, PR 생성 등의 기반이 되는 핵심 인프라

## 어떻게?
1. Rust에서 `git2` 크레이트 또는 `Command::new("git")` 로 worktree 관리
2. 세션 생성 시:
   - `git worktree add /path/to/worktree session-{id}` 실행
   - 새 브랜치 자동 생성: `session/{timestamp}-{name}`
3. CLI 실행 시 cwd를 worktree 경로로 설정
4. 세션 종료/삭제 시:
   - `git worktree remove` 실행
   - 정리 옵션: 자동 삭제 / 수동 유지 선택
5. worktree 상태 모니터링: 디스크 사용량, 브랜치 상태 표시

## 예상 효과
- 메인 브랜치 안전 보장 — bypass 모드에서도 안심
- 여러 세션이 같은 프로젝트에서 독립적으로 작업 가능
- 체크포인트/PR 생성의 기술적 기반 확보

## 작업 로그

