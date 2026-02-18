# Web Frontend Engineer | 경험 품질과 제품 성과를 함께 만드는 개발자

문제를 분해하고 사용자 경험과 개발 생산성을 함께 개선하는 프론트엔드 개발자 최기환입니다.  
학습 기록을 남기는 데서 끝나지 않고, 성능·테스트·운영 지표로 개선 결과를 증명하는 방식으로 일합니다.

## 연락 및 채널
- 이메일: [rlghks3004@gmail.com](mailto:rlghks3004@gmail.com)
- 링크드인: [최기환](https://www.linkedin.com/in/%EA%B8%B0%ED%99%98-%EC%B5%9C-312530303/)
- 깃허브: [gihwan-dev](https://github.com/gihwan-dev)
- 이력서: https://resume-with-ai.gihwan-dev.com/

## 대표 사례
### 1) TanStack Table 개선
- 문제: `<table>` 기반 구조의 제약으로 가상화/리사이즈/재정렬 기능 구현 복잡도가 커졌습니다.
- 행동: 제어/비제어 관점으로 API를 재설계하고, 내부 상태를 정리하며 테스트 전략을 재구성했습니다.
- 결과: 약 600개 테스트 기반으로 회귀를 줄이고 기능 확장 안정성을 높였습니다.
- 근거: [`50-Blog/Tanstack-Table-기반-데이터-그리드-개선하기.md`](./50-Blog/Tanstack-Table-%EA%B8%B0%EB%B0%98-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B7%B8%EB%A6%AC%EB%93%9C-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0.md)

### 2) 검색 성능 개선
- 문제: `String.includes` 기반 검색으로 정확도와 확장성 한계가 있었습니다.
- 행동: MiniSearch(BM25) 도입, 인덱스 빌드 자동화, 벤치마크/단위 테스트를 추가했습니다.
- 결과: `Hit@10 75% -> 85%`, Fuzzy 매칭 `40% -> 80%`로 검색 품질을 개선했습니다.
- 근거: [`10-Projects/Personal/Resume with AI/검색 성능 개선.md`](./10-Projects/Personal/Resume%20with%20AI/%EA%B2%80%EC%83%89%20%EC%84%B1%EB%8A%A5%20%EA%B0%9C%EC%84%A0.md)

### 3) 프론트엔드 성능 지표 개선
- 문제: Lighthouse 초기 성능 점수 68점과 렌더링 블로킹 요소가 있었습니다.
- 행동: 스크립트 로딩 전략 조정, 이미지/SVG 최적화, 전송 압축 등 병목 원인을 단계적으로 제거했습니다.
- 결과: 성능 지표를 체계적으로 개선하고, 원인-해결 기반 최적화 프로세스를 문서화했습니다.
- 근거: [`50-Blog/웹 프론트엔드 성능 지표 개선하기.md`](./50-Blog/%EC%9B%B9%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%84%B1%EB%8A%A5%20%EC%A7%80%ED%91%9C%20%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0.md)

## 바로 읽기
- [`50-Blog/리액트에서-언제-어떤-추상화-전략을-사용해야-할까.md`](./50-Blog/%EB%A6%AC%EC%95%A1%ED%8A%B8%EC%97%90%EC%84%9C-%EC%96%B8%EC%A0%9C-%EC%96%B4%EB%96%A4-%EC%B6%94%EC%83%81%ED%99%94-%EC%A0%84%EB%9E%B5%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C.md)
- [`50-Blog/Tanstack-Table-기반-데이터-그리드-개선하기.md`](./50-Blog/Tanstack-Table-%EA%B8%B0%EB%B0%98-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B7%B8%EB%A6%AC%EB%93%9C-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0.md)
- [`50-Blog/디자인-시스템-이상과-현실-사이의-다리-놓기.md`](./50-Blog/%EB%94%94%EC%9E%90%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EC%9D%B4%EC%83%81%EA%B3%BC-%ED%98%84%EC%8B%A4-%EC%82%AC%EC%9D%B4%EC%9D%98-%EB%8B%A4%EB%A6%AC-%EB%86%93%EA%B8%B0.md)
- [`50-Blog/웹 프론트엔드 성능 지표 개선하기.md`](./50-Blog/%EC%9B%B9%20%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%20%EC%84%B1%EB%8A%A5%20%EC%A7%80%ED%91%9C%20%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0.md)
- [`10-Projects/Personal/Resume with AI/검색 성능 개선.md`](./10-Projects/Personal/Resume%20with%20AI/%EA%B2%80%EC%83%89%20%EC%84%B1%EB%8A%A5%20%EA%B0%9C%EC%84%A0.md)

## Vault 구조
- `00-Inbox`: 빠르게 캡처한 아이디어와 임시 메모를 정리하는 수집함
- `10-Projects`: 진행 중인 프로젝트의 요구사항, 작업 로그, 개선 기록
- `20-Areas`: 커리어/업무 영역별로 지속 관리하는 책임 범위
- `30-Resources`: 프론트엔드 중심 개념, 레퍼런스, 번역/학습 노트
- `50-Blog`: 외부 공유 가능한 글을 통합 관리하는 발행 허브
