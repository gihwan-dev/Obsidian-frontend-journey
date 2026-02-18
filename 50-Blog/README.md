# Blog

블로그 포스트성 문서를 `50-Blog` 한곳에서 통합 관리합니다.

## 구조
- `50-Blog/*.md`: 블로그 포스트 (Velog + Legacy 통합)
- `50-Blog/README.md`: 섹션 안내 문서

## 정리 내역 (2026-02-18)
- 기존 구분 폴더(`Legacy`, `Velog`) 제거
- Legacy 글 37개 파일명을 프론트매터 `title` 기준으로 한국어/가독성 중심으로 변경
- Velog 글 25개를 동일 위치로 통합
- 총 포스트 62개 (README 제외)

## 참고
- Velog에서 가져온 글은 각 문서 프론트매터의 `source: velog`, `velogUrl`로 구분 가능
- Legacy 글은 기존 프론트매터(`author`, `pubDatetime`, `slug`)를 유지
