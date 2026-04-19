---
id: ACH-20260411-002
createdAt: 2026-04-11
updatedAt: 2026-04-11
company: Exem
project: 차세대 대시보드
role: Unknown
status: needs-metrics
impactScore: 4
evidenceScore: 4
tags: [dx-automation, ci-cd, cost-reduction, pnpm, gitlab-runner]
sources:
  - 10-Projects/Exem/01-Projects/차세대-대시보드/개발/캐시 처리 개선.md
  - 10-Projects/Exem/01-Projects/차세대-대시보드/개발/캐시 처리 개선 - 다이어그램.md
evidenceSnippets:
  - source: 10-Projects/Exem/01-Projects/차세대-대시보드/개발/캐시 처리 개선.md
    quote: "100GB+ 캐시의 정체는 전부 `node_modules/`였다."
  - source: 10-Projects/Exem/01-Projects/차세대-대시보드/개발/캐시 처리 개선.md
    quote: "캐시 방식 | GitLab cache (zip/unzip) | Docker 볼륨 마운트"
openQuestions:
  - 변경 후 실제 디스크 사용량이 얼마나 감소했는가?
  - zip/unzip 제거로 전체 pipeline 시간이 얼마나 줄었는가?
---

# Outcome (1 line, result-first)

브랜치별 `node_modules` GitLab cache가 100GB+로 누적되던 원인을 제거하고, pnpm store를 Docker 볼륨 기반 공유 캐시로 전환해 zip/unzip 오버헤드를 없앴다.

## Context

- CI 파이프라인이 디스크 공간 부족으로 실패했다.
- 기존 캐시는 `.pnpm-store`가 아니라 브랜치별 `node_modules` zip을 저장해 pnpm의 공간 절약 효과를 잃고 있었다.

## Actions

- GitLab cache key와 pnpm store 경로가 어긋난 구조를 분석했다.
- `.pnpm-store`가 비어 있고 `node_modules` 전체가 cache.zip으로 저장되는 원인을 정리했다.
- 브랜치별 GitLab cache 대신 `/pnpm-store` Docker 볼륨 마운트 전략으로 개선했다.
- 프로젝트와 브랜치 간 공유 가능한 호스트 pnpm store 구조를 문서화했다.

## Results

- 100GB+ cache.zip 누적의 원인을 `node_modules` 브랜치별 복제 구조로 특정했다.
- 캐시 방식을 GitLab zip/unzip에서 Docker 볼륨 마운트로 바꿔 zip 오버헤드를 0초로 줄이는 설계를 적용했다.
- 실제 디스크 절감량과 pipeline 총 소요 시간 변화는 추가 확인이 필요하다.

## Evidence

- 10-Projects/Exem/01-Projects/차세대-대시보드/개발/캐시 처리 개선.md
- 10-Projects/Exem/01-Projects/차세대-대시보드/개발/캐시 처리 개선 - 다이어그램.md

## Resume Bullets (draft, Korean, non-bloat)

- GitLab CI의 pnpm 캐시 구조를 분석해 100GB+ `node_modules` cache.zip 누적 원인을 제거하고, Docker 볼륨 기반 `/pnpm-store` 공유 캐시로 전환해 캐시 저장/복원 오버헤드를 줄였습니다.
