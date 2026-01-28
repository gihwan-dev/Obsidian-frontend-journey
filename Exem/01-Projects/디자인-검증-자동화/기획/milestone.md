# 프로젝트 마일스톤: 디자인 검증 자동화 (Design Check System)

> Figma 디자인 vs 실제 구현 컴포넌트를 자동으로 비교하는 3-SKILL 시스템

---

## Phase 1. 기반 인프라 구축 (Foundation)

스크립트와 환경 설정 — 이후 모든 SKILL이 의존하는 핵심 기반

- [ ] **Storybook 컴포넌트 스크린샷 캡처 스크립트 구현**
    - 목표: Story ID를 입력받아 Storybook iframe에서 컴포넌트를 Playwright로 캡처하여 PNG 저장
    - 포함: Storybook 포트 체크 및 자동 실행, Playwright headless 캡처, `#storybook-root > *` 요소 캡처, 뷰포트 크기 지정(Figma 프레임 크기 맞춤)
    - 파일: `scripts/capture-screenshot.ts`
    - 검증: 기존 Story 하나를 대상으로 캡처 실행 → PNG 파일 정상 생성 확인

- [ ] **픽셀 비교 스크립트 구현**
    - 목표: 두 PNG 파일을 pixelmatch로 비교하여 diff 이미지 및 수치 결과(diffRatio) 생성
    - 포함: 크기 불일치 시 확장 후 비교, diff PNG 생성, Pass/Fail 판정 (5% 임계값)
    - 파일: `scripts/compare-screenshots.ts`
    - 검증: 동일 이미지 비교 → diffRatio 0%, 서로 다른 이미지 비교 → diff PNG 생성 및 수치 출력

- [ ] **Storybook 설정 및 프로젝트 환경 수정**
    - 목표: `__screenshots__/` 디렉토리의 Story 파일을 Storybook이 인식하도록 설정
    - 포함: `.storybook/main.ts`에 stories 경로 추가, `.gitignore`에 `artifacts/` 추가
    - 검증: `__screenshots__/` 에 테스트 Story 생성 후 Storybook에서 정상 렌더링 확인

---

## Phase 2. SKILL 개발 — 개별 자동화 (Core Features)

각 SKILL이 독립적으로 동작하는 단위 기능 완성

- [ ] **story-generator SKILL 작성**
    - 목표: `/story-gen <컴포넌트 경로>` 명령으로 스크린샷용 Story 파일 자동 생성
    - 포함: 컴포넌트 props 타입 분석, 기존 Story args 참조, Figma 상태와 1:1 매칭 args 구성, MSW/Provider 자동 래핑 지시
    - 파일: `.claude/skills/story-generator/SKILL.md`
    - 검증: 실제 프로젝트 컴포넌트에 `/story-gen` 실행 → Story 파일 생성 → Storybook 렌더링 성공

- [ ] **component-screenshot SKILL 작성**
    - 목표: `/screenshot <Story 파일 경로>` 명령으로 컴포넌트 스크린샷 자동 캡처
    - 포함: Story title → story ID 변환, Figma 프레임 크기 뷰포트 설정, `capture-screenshot.ts` 호출, Storybook 자동 실행 처리
    - 파일: `.claude/skills/component-screenshot/SKILL.md`
    - 검증: Phase 1에서 생성한 테스트 Story에 `/screenshot` 실행 → PNG 파일 정상 저장

---

## Phase 3. SKILL 통합 — 디자인 검증 오케스트레이션 (Integration)

개별 SKILL과 Figma MCP를 조합하여 전체 워크플로우 완성

- [ ] **design-check SKILL 작성 (오케스트레이션)**
    - 목표: `/design-check <Figma URL> <컴포넌트 경로>` 한 번의 명령으로 전체 디자인 검증 수행
    - 포함:
      - Figma URL에서 node ID 추출 → MCP로 스크린샷/디자인 컨텍스트/토큰 수집
      - story-generator 로직으로 Story 생성
      - component-screenshot 로직으로 구현 캡처
      - pixelmatch 정량 비교 + Claude 시각 정성 비교
      - Markdown 보고서 생성 (`artifacts/design-check/{ComponentName}-report.md`)
    - 파일: `.claude/skills/design-check/SKILL.md`
    - 검증: 실제 Figma 프레임 URL + 대응 컴포넌트로 `/design-check` 실행 → 보고서 파일 생성, 정량/정성 비교 결과 모두 포함 확인
