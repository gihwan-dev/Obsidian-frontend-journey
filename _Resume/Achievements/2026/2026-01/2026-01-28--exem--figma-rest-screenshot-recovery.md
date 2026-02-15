---
id: ACH-20260128-002
createdAt: 2026-02-15
updatedAt: 2026-02-15
company: Exem
project: 디자인-검증-자동화
role: Unknown
status: ready
impactScore: 4
evidenceScore: 5
tags: [dx-automation, reliability, design-qa]
sources:
  - Exem/01-Projects/디자인-검증-자동화/기획/milestone.md
evidenceSnippets:
  - source: Exem/01-Projects/디자인-검증-자동화/기획/milestone.md
    quote: "검증: 실제 Figma URL로 스크립트 실행 → PNG 정상 생성 (1264x96, 7.1KB) 확인"
openQuestions:
  - 없음
---

Figma MCP 인라인 이미지 저장 한계를 REST API 캡처 스크립트로 우회해 PNG 생성 파이프라인을 복구했다(1264x96, 7.1KB 검증).

## Context
- 마일스톤의 "Figma MCP 인라인 이미지 문제 해결 세션" 기록 기준.
- 기존 MCP 응답 방식으로 파일 저장이 불가해 Phase 5가 막히던 문제를 해소했다.
- `capture-figma-screenshot.ts`를 중심으로 캡처 경로를 재구성했다.

## Actions
- `mcp__figma-desktop__get_screenshot` 인라인 반환 이슈를 원인으로 확정했다.
- Figma REST API(`/v1/images/:fileKey`) 기반 `capture-figma-screenshot.ts`를 신규 작성했다.
- `FIGMA_TOKEN`을 `.env.local`에 저장하고 `dotenv` 다중 경로 로딩 패턴을 적용했다.

## Results
- 실제 Figma URL로 PNG 파일 정상 생성(1264x96, 7.1KB)을 확인했다.
- design-check 흐름의 캡처 단계를 MCP 의존 단일 경로에서 REST API 경로로 대체했다.

## Evidence
- Exem/01-Projects/디자인-검증-자동화/기획/milestone.md

## Resume Bullets (draft, Korean, non-bloat)
- Figma 캡처 실패 병목을 REST API 스크립트로 전환해 디자인 검증 파이프라인을 복구했다.
- 실제 URL 검증(1264x96, 7.1KB)까지 완료해 자동 비교 단계의 실행 가능성을 확보했다.
