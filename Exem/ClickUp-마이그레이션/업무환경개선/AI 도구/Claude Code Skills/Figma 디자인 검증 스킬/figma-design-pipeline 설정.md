# figma-design-pipeline 설정

> SKILL.md 생성 (스크립트 없음)

Figma 디자인을 코드로 구현한 뒤 디자인 검증까지 자동으로 수행하는 파이프라인 스킬입니다.

> **의존성**: 이 스킬은 **figma-to-code**와 **design-check** 스킬을 순차 실행합니다. 두 스킬을 먼저 설정하세요.

## 생성할 파일 목록

```
.claude/skills/figma-design-pipeline/
└── SKILL.md                              ← 스킬 정의 파일
```

## 사전 요구사항

다음 스킬들이 먼저 설정되어 있어야 합니다:

1. **component-screenshot** - Storybook 스크린샷 캡처
2. **figma-to-code** - Figma → React 코드 변환
3. **design-check** - 디자인 검증 (component-screenshot 사용)

## 워크플로우 (3단계)

### Step 1. 입력 파싱 + 사전 검증
- URL에서 node-id 추출
- FIGMA_TOKEN 환경변수 확인

### Step 2. figma-to-code 실행
- 코드 생성 완료 게이트 확인

### Step 3. design-check 실행
- 디자인 검증 수행

### 최종 출력 + 반복 개선 제안

```
Figma Design Pipeline 완료: {ComponentName}

[Step 2] figma-to-code 결과:
- 생성된 파일: {컴포넌트 경로}
- 사용된 토큰: {색상, 타이포 등 요약}
- 사용된 컴포넌트: {목록}

[Step 3] design-check 결과:
- 정량: {diffRatio}% ({pass/fail})
- 정성: {Critical} Critical, {Major} Major, {Minor} Minor
- 보고서: {보고서 경로}
```

## 스킬 의존성 다이어그램

```
figma-design-pipeline
├── figma-to-code (Step 2)
│   └── Figma MCP 도구
└── design-check (Step 3)
    ├── Figma REST API (capture-figma-screenshot.ts)
    ├── Figma MCP 도구
    ├── component-screenshot (스크린샷 캡처)
    │   └── capture-screenshot.ts
    └── compare-screenshots.ts (픽셀 비교)
```

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3450258*
