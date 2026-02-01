# figma-to-code 설정

> SKILL.md 생성 (스크립트 없음)

Figma 디자인 데이터를 기반으로 React 컴포넌트 코드를 생성하는 스킬입니다.

> **참고**: 이 스킬은 Figma MCP 도구만 사용하므로 별도 스크립트가 필요 없습니다.

## 생성할 파일 목록

```
.claude/skills/figma-to-code/
└── SKILL.md                              ← 스킬 정의 파일
```

## 사전 요구사항

- **Figma Desktop 앱** 설치 및 실행
- **Figma MCP 서버** 연결 (figma-desktop)

## 워크플로우 (6단계)

### Phase 1. 입력 파싱
- URL에서 `node-id` 패턴 추출
- 파일명에서 컴포넌트 이름 추출

### Phase 2. Figma 디자인 데이터 수집
3개 MCP 도구를 **병렬** 호출:
1. `mcp__figma-desktop__get_screenshot(nodeId)` — 시각적 참조 이미지
2. `mcp__figma-desktop__get_design_context(nodeId)` — 레이아웃, 색상, 타이포, 크기
3. `mcp__figma-desktop__get_variable_defs(nodeId)` — 바인딩된 디자인 토큰

### Phase 3. 참조 패턴 탐색
프로젝트의 기존 패턴을 파악

### Phase 4. Figma → 디자인 토큰 매핑 분석
- 색상 매핑 전략
- 타이포그래피 매핑
- 레이아웃 매핑

### Phase 5. 코드 생성
- `cn()` 유틸리티 사용
- Tailwind 클래스만 사용
- `@exem-fe/react` 컴포넌트 우선 사용

### Phase 6. 검증 및 출력

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3450058*
