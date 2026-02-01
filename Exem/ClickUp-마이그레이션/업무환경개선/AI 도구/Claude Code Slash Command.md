# 📝 Claude Code Slash Command

계속해서 반복되는 프롬프트를 작성하는데 피로함을 느껴서 몇가지 커스텀 커맨드를 만들어 사용중입니다.

## 커맨드 목록

### bug-fix.md
버그 재현 및 수정 가이드 - TDD 방식을 통해 버그를 수정하는 프로세스

**버그 수정 프로세스:**
1. 버그 재현 (Reproduce)
2. 최소 재현 케이스 작성 (Minimal Reproduction)
3. 실패 테스트 작성 (Failing Test)
4. 버그 수정 (Fix)
5. 회귀 테스트 (Regression Test)

### commit.md
컨벤셔널 커밋 메시지와 이모지를 사용하여 체계적인 커밋을 생성

**주요 기능:**
- `--no-verify`로 지정하지 않는 한, 자동으로 커밋 전 검증 (`pnpm lint`, `pnpm typecheck`)
- diff를 분석하여 여러 개의 논리적으로 구분된 변경사항이 있는지 판단
- 커밋 분할 제안
- 이모지 컨벤셔널 커밋 형식 사용

### tdd.md
TDD(Test-Driven Development) 방식 개발 가이드

**TDD 핵심 사이클 (Red-Green-Refactor):**
1. Red: 실패하는 테스트 먼저 작성
2. Green: 테스트를 통과하는 최소 코드 작성
3. Refactor: 테스트 통과 상태에서 코드 개선

### test.md
React Testing Library + Vitest 테스트 작성 가이드

## 사용 방식

`.claude/commands/bug-fix.md` 파일을 만들고 내용을 붙여 넣습니다.

```bash
# ARGUMENTS가 있는 경우
/bug-fix "~~~버그가 있는데 수정해줘"

# 커밋의 경우
/commit
```

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-2770158*
