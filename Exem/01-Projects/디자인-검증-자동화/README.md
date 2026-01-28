# 디자인 검증 자동화 (Design Check System)

Figma 디자인과 실제 구현 컴포넌트를 자동으로 비교하는 3-SKILL 시스템

---

## 개요

| 항목 | 내용 |
|------|------|
| **목표** | Figma ↔ 구현체 시각적 차이를 정량/정성 비교하여 디자인 QA 자동화 |
| **사용 방식** | 로컬 CLI 도구 (`/design-check` 명령) |
| **비교 방식** | pixelmatch (정량) + Claude 시각 분석 (정성) |
| **대상** | 모든 UI 컴포넌트 |

---

## 핵심 워크플로우

```
/design-check <Figma URL> <컴포넌트 경로>
          │
          ├── Figma MCP → 스크린샷 + 토큰 수집
          ├── Story 자동 생성 → __screenshots__/
          ├── Playwright 캡처 → 구현 스크린샷
          ├── pixelmatch 비교 → diff 이미지 + 수치
          ├── Claude 시각 분석 → 정성 평가
          └── Markdown 보고서 생성
```

---

## 3-SKILL 구조

| SKILL | 명령어 | 역할 |
|-------|--------|------|
| `story-generator` | `/story-gen <경로>` | Figma 상태에 맞는 Story 자동 생성 |
| `component-screenshot` | `/screenshot <Story>` | Storybook 컴포넌트 스크린샷 캡처 |
| `design-check` | `/design-check <URL> <경로>` | 전체 워크플로우 오케스트레이션 |

---

## 마일스톤

### Phase 1: 기반 인프라 (Foundation)
- [ ] `scripts/capture-screenshot.ts` — Playwright 기반 캡처
- [ ] `scripts/compare-screenshots.ts` — pixelmatch 비교
- [ ] `.storybook/main.ts` 수정 — `__screenshots__/` 경로 추가

### Phase 2: 개별 SKILL (Core Features)
- [ ] `story-generator` SKILL
- [ ] `component-screenshot` SKILL

### Phase 3: 통합 (Integration)
- [ ] `design-check` SKILL (오케스트레이션)

---

## 주요 결정 사항

- **Story 위치**: `__screenshots__/` 별도 디렉토리 (기존 Story와 분리)
- **캡처 영역**: `#storybook-root > *` (컴포넌트 루트)
- **임계값**: 5% 이하 차이 → Pass
- **Storybook**: 미실행 시 자동 실행
- **토큰 비교**: Figma variable defs 활용한 정밀 비교

---

## 문서 구조

```
디자인-검증-자동화/
├── README.md          # 프로젝트 개요 (현재 문서)
├── 기획/
│   ├── milestone.md   # 마일스톤 및 체크리스트
│   └── survey.md      # 설계 결정 사항
└── 설계/
    └── plan.md        # 상세 구현 계획
```

---

## 다음 단계

1. Phase 1 스크립트 구현 시작
2. 테스트용 컴포넌트로 캡처 검증
3. SKILL 문서 작성 및 테스트
