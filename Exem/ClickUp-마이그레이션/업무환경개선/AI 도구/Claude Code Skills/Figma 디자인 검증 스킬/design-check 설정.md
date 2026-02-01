# design-check 설정

> SKILL.md + 2개 스크립트 생성

Figma 디자인과 구현된 컴포넌트를 자동 비교하여 Markdown 보고서를 생성하는 스킬입니다.

> **의존성**: 이 스킬은 **component-screenshot** 스킬을 사용합니다. 먼저 component-screenshot을 설정하세요.

## 생성할 파일 목록

```
.claude/skills/design-check/
├── SKILL.md                              ← 1. 스킬 정의 파일
└── scripts/
    ├── capture-figma-screenshot.ts       ← 2. Figma REST API 스크린샷
    └── compare-screenshots.ts            ← 3. 픽셀 비교 스크립트
```

## 사전 요구사항

- **FIGMA_TOKEN** 환경변수 (Figma REST API용)
- **Figma Desktop 앱** + MCP 연결
- **component-screenshot 스킬** 설정 완료

## 워크플로우 (7단계)

### Phase 1. 입력 파싱
Figma URL과 컴포넌트 경로를 추출

### Phase 2. Figma 데이터 수집
- 스크린샷 캡처 (Figma REST API)
- 디자인 컨텍스트 수집
- 디자인 토큰 수집

### Phase 3. Story 파일 생성
Storybook Story 파일 자동 생성

### Phase 4. 구현 스크린샷 캡처
component-screenshot 스킬 사용

### Phase 5. 정량 비교 (Pixel Diff)
pixelmatch를 사용한 픽셀 비교

### Phase 6. 정성 비교 (시각 분석)
Claude의 시각 분석으로 디자인 차이 평가

### Phase 7. 보고서 생성
Markdown 보고서 생성: `artifacts/design-check/{Name}-report.md`

## 스크립트 파일

자세한 스크립트 내용은 ClickUp 원본 문서를 참조하세요.

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3450138*
