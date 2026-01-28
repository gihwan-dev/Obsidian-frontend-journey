## 목표

Figma 스크린샷 vs 실제 렌더링된 컴포넌트 스크린샷을 시각적으로 비교하여 디자인 검증 정확도를 높인다.

---

## 변경 파일

| 파일 | 작업 | 설명 |
|------|------|------|
| `scripts/capture-component-screenshot.ts` | 생성 | Playwright 기반 스크린샷 캡처 스크립트 |
| `.claude/skills/design-check/SKILL.md` | 수정 | 시각적 비교 워크플로우 추가 |

---

## 1. scripts/capture-component-screenshot.ts 생성

Storybook/페이지 URL을 받아 Playwright로 스크린샷을 캡처하는 독립 스크립트.

### 인자

| 인자 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `--url` | 필수 | - | Storybook URL 또는 페이지 URL |
| `--selector` | 선택 | - | 특정 요소만 캡처할 CSS 셀렉터 |
| `--output` | 선택 | `artifacts/design-check/component-screenshot.png` | 출력 경로 |
| `--width` | 선택 | 1280 | 뷰포트 너비 |
| `--height` | 선택 | 900 | 뷰포트 높이 |

### 동작

1. Chromium headless 실행
2. Storybook URL인 경우 → iframe URL로 자동 변환 (Storybook chrome 제거)
   - `?path=/story/...` → `/iframe.html?id=...&viewMode=story`
3. 페이지 이동 후 networkidle 대기 + 500ms 안정화
4. `--selector` 있으면 해당 요소만, 없으면 fullPage 스크린샷
5. output 디렉토리 자동 생성 후 PNG 저장
6. stdout에 저장 경로 출력

### 에러 처리

- 셀렉터 요소 미발견 시 10초 타임아웃 후 명확한 에러 메시지
- 연결 실패 시 "Storybook이 실행 중이지 않습니다" 안내

### 실행 예시

```bash
npx tsx scripts/capture-component-screenshot.ts \
  --url "http://localhost:6006/?path=/story/components-button--primary" \
  --output "artifacts/design-check/component-screenshot.png"
```

### 비고

기존 VRT 헬퍼(`test/vrt/helpers/screenshot.ts`)는 TestInfo에 의존하여 재사용 불가. 독립 스크립트로 작성.

---

## 2. SKILL.md 수정

### 2a. 메타데이터 변경

```
argument-hint: <피그마 URL> <컴포넌트 경로> [스토리북/페이지 URL] [--selector CSS셀렉터]
```

### 2b. 섹션 1 (입력 파싱) 수정

3번째 인자로 스토리북/페이지 URL, `--selector` 플래그 파싱 추가. URL 미제공 시 소스 코드 분석만 수행 (하위 호환).

### 2c. 새 섹션 추가: "2.5 구현 스크린샷 캡처"

섹션 2(피그마 수집)과 3(코드 분석) 사이에 삽입:

- Bash로 `npx tsx scripts/capture-component-screenshot.ts` 실행
- 캡처된 PNG를 Read 도구로 읽어 시각적 참조로 사용
- 캡처 실패 시 에러 보고 후 코드 분석은 계속 진행

### 2d. 섹션 4 (비교 점검) 수정

기존 코드 기반 체크리스트 비교에 시각적 비교 서브섹션 추가:

- Figma 스크린샷 vs 구현 스크린샷 이미지 비교
- 점검 항목:
  - 전체 레이아웃 구조
  - 색상 톤
  - 요소 정렬
  - 누락 요소
  - 비율/간격

### 2e. 섹션 5 (보고서) 수정

보고서 상단에 시각적 비교 결과 테이블 추가:

```markdown
## 시각적 비교 결과

| # | 항목 | 상태 | 설명 |
|---|------|------|------|
| 1 | 전체 레이아웃 | ✅/❌ | ... |
| 2 | 색상 톤 | ✅/❌ | ... |
| 3 | 요소 정렬 | ✅/❌ | ... |
| 4 | 누락 요소 | ✅/❌ | ... |
| 5 | 비율/간격 | ✅/❌ | ... |
```

---

## 고려 사항

- **Storybook 실행 필요**: 스킬 실행 전 `pnpm run storybook`이 실행 중이어야 함
- **iframe 변환**: Storybook UI chrome 없이 깔끔한 컴포넌트만 캡처
- **하위 호환**: URL 미제공 시 기존과 동일하게 동작
- **Playwright 브라우저**: 프로젝트에 이미 `@playwright/test` 설치됨, 브라우저 없으면 `npx playwright install chromium` 안내

---

## 검증 방법

1. `pnpm run storybook`으로 Storybook 실행
2. 스크린샷 스크립트 테스트:
   ```bash
   npx tsx scripts/capture-component-screenshot.ts \
     --url "http://localhost:6006/?path=/story/..." \
     --output "/tmp/test.png"
   ```
3. 시각적 비교 테스트:
   ```bash
   /design-check <피그마URL> <컴포넌트경로> <스토리북URL>
   ```
4. 하위 호환 테스트 (URL 없이):
   ```bash
   /design-check <피그마URL> <컴포넌트경로>
   ```
