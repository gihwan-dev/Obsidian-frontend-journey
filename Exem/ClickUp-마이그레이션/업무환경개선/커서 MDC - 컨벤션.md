# 커서 MDC - 컨벤션

Cursor IDE + Rules를 활용한 코드 품질 및 생산성 자동화

## 배경
- 대규모 React 프로젝트에서 코드 일관성 유지와 반복 작업 자동화 필요
- 팀 컨벤션을 암묵적 지식에서 명시적 규칙으로 전환

## 도입 솔루션
- Cursor IDE의 Rules 기능 활용
- 5개의 .mdc 파일로 팀 컨벤션 코드화

## Cursor Rules 구성

```
.cursor/rules/
├── common.mdc                    # 공통 코딩 컨벤션
├── msw-generate-template.mdc     # MSW Mock 생성 가이드
├── storybook-generate-template.mdc  # Storybook 작성 가이드
├── test-generate-template.mdc    # 테스트 코드 작성 가이드
└── mr-review-bot.mdc             # MR 코드 리뷰 자동화
```

## 각 Rules 상세 내용

### common.mdc
공통 코딩 컨벤션

### msw-generate-template.mdc
MSW Mock 생성 가이드

### storybook-generate-template.mdc
Storybook 작성 가이드

### test-generate-template.mdc
테스트 코드 작성 가이드

### mr-review-bot.mdc
MR 코드 리뷰 자동화

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3312298*
