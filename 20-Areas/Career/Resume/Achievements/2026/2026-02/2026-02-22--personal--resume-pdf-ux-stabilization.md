---
id: ACH-20260222-002
createdAt: 2026-02-22
updatedAt: 2026-02-22
company: Personal
project: resume-with-ai
role: Unknown
status: needs-metrics
impactScore: 3
evidenceScore: 3
tags: [reliability, ux, pdf, bugfix]
sources:
  - 00-Inbox/Daily/2026-02-21.md
evidenceSnippets:
  - source: 00-Inbox/Daily/2026-02-21.md
    quote: "PDF 본문에 HTML 태그가 노출되는 문제를 수정하고 다운로드/인쇄 최적화 변경을 반영했다."
openQuestions:
  - 전환 UX 관련 이슈 재현 빈도가 얼마나 줄었나?
  - PDF 출력 품질 개선으로 지원 문의/버그 리포트가 줄었나?
---

이력서 전환 UX와 PDF 출력 품질 이슈를 해결해 회귀 리스크를 낮췄다.

## Context
- 이력서-포트폴리오 전환 UX와 PDF 출력 품질 문제가 동시에 존재했다.
- 커밋 단위를 묶어 변경 범위를 관리하며 문제를 순차 수정했다.

## Actions
- 전환 스크롤 복원과 목차 동기화 이슈를 해결했다.
- PDF 본문에 HTML 태그가 노출되는 문제를 수정했다.
- 다운로드/인쇄 최적화 변경을 반영했다.

## Results
- 이력서/PDF 출력 품질과 전환 UX가 안정화되면서 회귀 리스크가 낮아졌다.

## Evidence
- 00-Inbox/Daily/2026-02-21.md

## Resume Bullets (draft, Korean, non-bloat)
- 이력서-포트폴리오 전환 UX와 PDF 출력 품질 이슈를 해결해 회귀 리스크를 낮췄다.
- PDF 출력 시 HTML 태그 노출 문제를 제거하고 다운로드/인쇄 경로를 안정화했다.
