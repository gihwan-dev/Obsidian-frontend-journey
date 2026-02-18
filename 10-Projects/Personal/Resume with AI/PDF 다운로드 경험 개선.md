# PDF 다운로드 경험 개선

#resume-with-ai #중기 #UX

## 요약
PDF 생성의 체감 속도와 안정성을 개선한다.

## 왜?
- 폰트 파일(Pretendard OTF 3개, 약 6-15MB)이 클릭 시점에 다운로드 → 첫 PDF 생성에 3-8초 소요
- 생성 실패 시 `console.error`만 출력, 사용자에게 아무 피드백 없음

## 어떻게?
1. hover 이벤트에서 `<link rel="prefetch" href="...otf">` 동적 삽입
2. PDF 생성 catch 블록에 토스트 컴포넌트 연동
3. 폰트 로딩 실패 시 `window.print()` + 인쇄용 CSS 폴백

## 예상 효과
- PDF 생성 체감 시간 2-5초 단축
- 실패 시 사용자가 대안을 사용할 수 있음
