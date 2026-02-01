# component-screenshot 설정

> SKILL.md + capture-screenshot.ts 생성

Storybook Story 파일을 기반으로 컴포넌트 스크린샷을 캡처하는 스킬입니다.

## 생성할 파일 목록

```
.claude/skills/component-screenshot/
├── SKILL.md                              ← 1. 스킬 정의 파일
└── scripts/
    └── capture-screenshot.ts             ← 2. 스크린샷 캡처 스크립트
```

## 워크플로우

### 1. Story 파일 읽기
- `title` 필드 추출
- export된 Story 이름들 추출

### 2. Story ID 변환

**변환 규칙:**
1. `title` 값을 소문자로 변환
2. `/`를 `-`로 치환
3. `--`로 구분하여 export 이름을 kebab-case로 추가

**예시:**
| title | export | Story ID |
|-------|--------|----------|
| `Screenshots/Shared/Card` | `Default` | `screenshots-shared-card--default` |
| `Screenshots/Shared/Button` | `WithIcon` | `screenshots-shared-button--with-icon` |

### 3. 뷰포트 크기 결정
1. 사용자 지정
2. Story wrapper div 힌트
3. 기본값: width=1280, height=800

### 4. 캡처 실행

```bash
pnpm exec tsx .claude/skills/component-screenshot/scripts/capture-screenshot.ts \
  --story-id "{story-id}" \
  --output "artifacts/screenshots/{ComponentName}.png" \
  --width {width} --height {height}
```

**CLI 옵션:**
| 옵션 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `--story-id` | ✅ | - | Storybook story ID |
| `--output` | ✅ | - | 출력 PNG 파일 경로 |
| `--width` | ❌ | 1280 | 뷰포트 너비 |
| `--height` | ❌ | 800 | 뷰포트 높이 |
| `--port` | ❌ | 6008 | 정적 서버 포트 |
| `--timeout` | ❌ | 30000 | 타임아웃 (ms) |
| `--rebuild` | ❌ | false | 기존 빌드 무시하고 강제 리빌드 |

### 5. 결과 검증
- PNG 파일 생성 확인
- 파일 크기 0보다 큰지 확인

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3450158*
