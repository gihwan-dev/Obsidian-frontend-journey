---
id: ACH-20260128-001
createdAt: 2026-02-15
updatedAt: 2026-02-15
company: Exem
project: 디자인-검증-자동화
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 5
tags: [dx-automation, production-delivery, design-qa]
sources:
  - Exem/01-Projects/디자인-검증-자동화/기획/milestone.md
evidenceSnippets:
  - source: Exem/01-Projects/디자인-검증-자동화/기획/milestone.md
    quote: "검증: 실제 Figma 프레임 URL + 대응 컴포넌트로 `/design-check` 실행 → 보고서 파일 생성, 정량/정성 비교 결과 모두 포함 확인"
openQuestions:
  - 디자인 QA 소요 시간(수동 대비) 절감량은 얼마인가?
  - 자동 검증 결과가 실제 수정으로 이어진 비율은 얼마인가?
---

`/design-check` 단일 명령으로 Figma↔구현 비교와 보고서 생성을 연결한 디자인 QA 오케스트레이션을 완료했다. (needs-metrics)

## Context
- 디자인 검증 자동화 마일스톤 Phase 3 완료 기록 기준.
- story 생성, 구현 캡처, 정량/정성 비교를 한 명령으로 통합했다.
- 산출물은 Markdown 리포트로 고정해 재검토 흐름을 표준화했다.

## Actions
- Figma URL에서 node ID를 추출하고 디자인 컨텍스트/토큰 수집 경로를 연결했다.
- story-generator 로직으로 비교용 Story를 생성했다.
- component-screenshot 로직으로 구현체 캡처를 자동화했다.
- pixelmatch 정량 비교와 시각 정성 비교를 조합해 보고서를 생성했다.

## Results
- 실제 Figma URL + 컴포넌트 조합에서 `/design-check` 실행과 보고서 생성을 검증했다.
- 정량(diff)과 정성(분석) 결과가 한 문서에 함께 기록되는 흐름을 확보했다.

## Evidence
- Exem/01-Projects/디자인-검증-자동화/기획/milestone.md

## Resume Bullets (draft, Korean, non-bloat)
- Figma-구현 비교를 `/design-check` 단일 명령으로 통합해 디자인 QA 워크플로를 자동화했다.
- 정량(pixel diff)과 정성(시각 분석) 결과를 동일 리포트로 표준화해 검토 효율을 높였다.
