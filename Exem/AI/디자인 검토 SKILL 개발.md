## 목표

Figma 스크린샷 vs 실제 렌더링된 컴포넌트 스크린샷을 시각적으로 비교하여 디자인 검증 정확도를 높인다.

---

## 아키텍처 개요

3개의 SKILL을 분리하여 단일 책임 원칙 준수 및 재사용성 확보.

```
┌─────────────────────────────────────────────────────────┐
│           design-check (오케스트레이션)                  │
│  입력: Figma URL + 컴포넌트 경로                         │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │ Figma 수집   │ │ story-gen   │ │ screenshot  │
   │ (기존 로직)  │ │ SKILL       │ │ SKILL       │
   └─────────────┘ └─────────────┘ └─────────────┘
          │               │               │
          ▼               ▼               ▼
   Figma 스크린샷    Story 파일      컴포넌트 스크린샷
                          │               ▲
                          └───────────────┘
                           (Story → 스크린샷)
```

### SKILL 구성

| SKILL | 입력 | 출력 | 역할 |
|-------|------|------|------|
| **story-generator** | 컴포넌트 경로 | Story 파일 경로 | 스크린샷용 스토리 자동 생성 |
| **component-screenshot** | Story 경로 | PNG 경로 | Storybook 기반 스크린샷 캡처 |
| **design-check** | Figma URL + 컴포넌트 경로 | 비교 보고서 | 위 스킬들 조합 + 비교 분석 |

---

## SKILL 1: story-generator

스크린샷 캡처용 Storybook Story를 자동 생성하는 SKILL.

### 위치

`.claude/skills/story-generator/SKILL.md`

### 입력

```
/story-gen <컴포넌트 경로>
```

예시: `/story-gen src/components/Button/Button.tsx`

### 동작

1. **컴포넌트 파일 분석**
   - props 타입 추출 (TypeScript interface/type)
   - 기본값 확인

2. **기존 Story 탐색**
   - 같은 디렉토리에 `.stories.tsx` 파일 있는지 확인
   - 있으면 참조하여 args 추출

3. **스크린샷용 Story 생성**
   - 위치: `__screenshots__/{ComponentName}.screenshot.stories.tsx`
   - 고정된 설정:
     - viewport: 1280x900
     - 배경: 흰색
     - 패딩: 적절한 여백
   - 템플릿 기반 생성

### 출력

```
생성된 Story 파일 경로: __screenshots__/Button.screenshot.stories.tsx
```

### Story 템플릿

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/Button/Button';

const meta: Meta<typeof Button> = {
  title: '__screenshots__/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    viewport: { defaultViewport: 'desktop' },
    backgrounds: { default: 'light' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Screenshot: Story = {
  args: {
    // 기존 Story에서 추출하거나 기본값 사용
    variant: 'primary',
    children: 'Button',
  },
};
```

---

## SKILL 2: component-screenshot

Storybook Story를 기반으로 컴포넌트 스크린샷을 캡처하는 SKILL.

### 위치

`.claude/skills/component-screenshot/SKILL.md`

### 입력

```
/screenshot <Story 파일 경로>
```

예시: `/screenshot __screenshots__/Button.screenshot.stories.tsx`

### 동작

1. **Story 파일 파싱**
   - title에서 story ID 추출
   - `__screenshots__/Button` → `__screenshots__-button--screenshot`

2. **Storybook 실행 확인**
   - `localhost:6006` 포트 체크
   - 안 떠있으면 자동 실행: `pnpm run storybook &`
   - 준비될 때까지 대기 (최대 30초)

3. **URL 자동 생성**
   - iframe URL로 변환 (Storybook chrome 제거)
   - `http://localhost:6006/iframe.html?id=__screenshots__-button--screenshot&viewMode=story`

4. **Playwright 스크린샷**
   - Chromium headless 실행
   - networkidle 대기 + 500ms 안정화
   - `#storybook-root > *` selector로 컴포넌트만 캡처

5. **저장**
   - 경로: `artifacts/screenshots/{ComponentName}.png`

### 출력

```
스크린샷 저장됨: artifacts/screenshots/Button.png
```

### 스크립트

`scripts/capture-component-screenshot.ts`

```typescript
// 인자
interface Args {
  storyPath: string;      // Story 파일 경로 (필수)
  output?: string;        // 출력 경로 (기본: artifacts/screenshots/)
  width?: number;         // 뷰포트 너비 (기본: 1280)
  height?: number;        // 뷰포트 높이 (기본: 900)
  storybookUrl?: string;  // Storybook URL (기본: http://localhost:6006)
}
```

### 에러 처리

- Storybook 연결 실패: "Storybook이 실행 중이지 않습니다. `pnpm run storybook` 실행 후 다시 시도하세요."
- Story 파일 없음: "Story 파일을 찾을 수 없습니다: {경로}"
- 렌더링 타임아웃: "컴포넌트 렌더링 시간 초과 (10초)"

---

## SKILL 3: design-check (오케스트레이션)

Figma 디자인과 실제 구현을 비교하는 메인 SKILL. 위 두 SKILL을 조합하여 사용.

### 위치

`.claude/skills/design-check/SKILL.md` (기존 수정)

### 입력

```
/design-check <Figma URL> <컴포넌트 경로>
```

예시: `/design-check https://figma.com/file/xxx src/components/Button/Button.tsx`

### 워크플로우

```
1. 입력 파싱
   └─ Figma URL, 컴포넌트 경로 추출

2. Figma 스크린샷 수집
   └─ 기존 로직 (Figma API 또는 스크린샷)

3. 구현 스크린샷 캡처
   ├─ story-generator 호출 → Story 파일 생성
   └─ component-screenshot 호출 → PNG 캡처

4. 시각적 비교
   ├─ Figma 스크린샷 vs 구현 스크린샷
   └─ 점검 항목: 레이아웃, 색상, 정렬, 누락 요소, 비율/간격

5. 코드 분석
   └─ 기존 로직 (스타일 값 추출 및 비교)

6. 보고서 생성
   └─ 시각적 비교 + 코드 분석 통합 보고서
```

### 보고서 형식

```markdown
# 디자인 검토 보고서

## 시각적 비교 결과

| # | 항목 | 상태 | 설명 |
|---|------|------|------|
| 1 | 전체 레이아웃 | ✅ | 구조 일치 |
| 2 | 색상 톤 | ❌ | primary 색상 차이 (#3B82F6 → #2563EB) |
| 3 | 요소 정렬 | ✅ | 중앙 정렬 일치 |
| 4 | 누락 요소 | ✅ | 모든 요소 존재 |
| 5 | 비율/간격 | ⚠️ | padding 미세 차이 (16px → 14px) |

## 상세 비교

### Figma 스크린샷
[이미지]

### 구현 스크린샷
[이미지]

## 코드 분석 결과
(기존 형식 유지)
```

---

## 변경 파일 목록

| 파일 | 작업 | 설명 |
|------|------|------|
| `.claude/skills/story-generator/SKILL.md` | 생성 | Story 자동 생성 SKILL |
| `.claude/skills/component-screenshot/SKILL.md` | 생성 | 스크린샷 캡처 SKILL |
| `.claude/skills/design-check/SKILL.md` | 수정 | 오케스트레이션 로직 추가 |
| `scripts/capture-component-screenshot.ts` | 생성 | Playwright 스크린샷 스크립트 |

---

## 구현 우선순위

1. **Phase 1**: `scripts/capture-component-screenshot.ts` 생성
   - Playwright 기반 스크린샷 캡처 기능 구현
   - Story 파일 파싱 → URL 변환 로직

2. **Phase 2**: `component-screenshot` SKILL 생성
   - 스크립트를 래핑하는 SKILL 정의
   - Storybook 자동 실행 로직

3. **Phase 3**: `story-generator` SKILL 생성
   - 컴포넌트 분석 로직
   - Story 템플릿 생성

4. **Phase 4**: `design-check` SKILL 수정
   - 오케스트레이션 로직 추가
   - 시각적 비교 섹션 추가

---

## 고려 사항

- **Storybook 자동 실행**: 포트 체크 후 필요시 백그라운드 실행
- **하위 호환**: 기존 `/design-check` 사용 방식도 지원 (스크린샷 없이 코드 분석만)
- **Story 충돌 방지**: `__screenshots__/` 별도 디렉토리로 기존 Story와 분리
- **Playwright 브라우저**: 없으면 `npx playwright install chromium` 안내

---

## 검증 방법

### Phase 1 검증
```bash
# Story 파일 경로로 직접 스크린샷 테스트
npx tsx scripts/capture-component-screenshot.ts \
  --storyPath "__screenshots__/Button.screenshot.stories.tsx" \
  --output "artifacts/screenshots/Button.png"
```

### Phase 2 검증
```bash
# SKILL로 스크린샷 캡처
/screenshot __screenshots__/Button.screenshot.stories.tsx
```

### Phase 3 검증
```bash
# 컴포넌트 경로로 Story 자동 생성
/story-gen src/components/Button/Button.tsx
```

### Phase 4 검증 (통합)
```bash
# Figma URL + 컴포넌트 경로만으로 전체 워크플로우 실행
/design-check https://figma.com/file/xxx src/components/Button/Button.tsx
```


### Before / After 기록

#### Before
![[Pasted image 20260128091059.png]]

