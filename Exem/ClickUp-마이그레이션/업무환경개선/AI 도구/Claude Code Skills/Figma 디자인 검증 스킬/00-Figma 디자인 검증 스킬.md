# 🔎 Figma 디자인 검증 스킬

> 프로젝트 설정 가이드

Figma 디자인을 React 코드로 변환하고, 구현 결과를 자동 검증하는 Claude Code 스킬들을 프로젝트에 설정하는 방법입니다.

## 📦 스킬 구성

| 스킬 | 역할 | 의존 스킬 |
|------|------|----------|
| component-screenshot | Storybook 컴포넌트 스크린샷 캡처 | - |
| figma-to-code | Figma → React 코드 변환 | - |
| design-check | Figma vs 구현 비교 검증 | component-screenshot |
| figma-design-pipeline | 코드 생성 + 검증 통합 | figma-to-code, design-check |

> ⚠️ **의존 관계**: design-check는 component-screenshot을 사용하므로 먼저 설정해야 합니다.

## 🛠️ 설정 단계 요약

1. 패키지 설치 (공통)
2. 폴더 구조 생성
3. 각 스킬별 SKILL.md 파일 생성
4. 스크립트 파일 생성
5. 환경변수 설정
6. Storybook 빌드 스크립트 확인

## Step 1. 패키지 설치 (공통)

### npm 패키지 설치
```bash
pnpm add -D @playwright/test express dotenv pixelmatch pngjs @types/express @types/pngjs
```

### Playwright 브라우저 설치
```bash
pnpm exec playwright install chromium
```

## Step 2. 폴더 구조 생성

```bash
mkdir -p .claude/skills/component-screenshot/scripts
mkdir -p .claude/skills/figma-to-code
mkdir -p .claude/skills/design-check/scripts
mkdir -p .claude/skills/figma-design-pipeline
mkdir -p artifacts/screenshots/{figma,impl,diff}
mkdir -p artifacts/design-check
mkdir -p __screenshots__
```

## Step 7. 환경변수 설정

### Figma Personal Access Token 발급
1. https://www.figma.com/developers/api#access-tokens 접속
2. "Generate new token" 클릭
3. 토큰 이름 입력, scope: `files:read` 선택
4. 생성된 토큰 복사

```bash
echo "FIGMA_TOKEN=your_figma_personal_access_token" >> .env.local
echo ".env.local" >> .gitignore
echo "artifacts/" >> .gitignore
```

## 🎯 사용법

```bash
# 새 컴포넌트 구현 + 검증 (권장)
/figma-pipeline https://figma.com/design/abc123/MyProject?node-id=1-2 src/features/MyComponent.tsx

# 코드만 생성
/figma-to-code https://figma.com/design/abc123/MyProject?node-id=1-2 src/features/MyComponent.tsx

# 기존 컴포넌트 검증만
/design-check https://figma.com/design/abc123/MyProject?node-id=1-2 src/features/MyComponent.tsx

# 스크린샷만 캡처
/screenshot __screenshots__/MyComponent.stories.tsx
```

## 결과

### Visual Testing 결과 이미지 생성
- 구현 결과 이미지
- 피그마 이미지
- 둘 사이 diff
- 레포트 생성

## 하위 문서
- [[figma-to-code 설정]]
- [[design-check 설정]]
- [[component-screenshot 설정]]
- [[figma-design-pipeline 설정]]

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3449958*
