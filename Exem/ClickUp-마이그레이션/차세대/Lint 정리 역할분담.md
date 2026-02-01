# Lint 정리 역할분담

## 메타데이터
- **상태**: 🟡 Open
- **담당자**: 김재선, 한원영, 최기환
- **작성자**: 김재선
- **생성일**: 2025-09-03
- **Product**: Maxgauge VI
- **DB**: Oracle
- **ClickUp**: [링크](https://app.clickup.com/t/86euqm9dx)

---

## 요약

apps/ 및 packages/ 폴더를 src/services/ 및 src/shared/로 통합하는 아키텍처 변경 전 필수 사전 작업으로 린트 에러 정리.

---

## 작업 개요

- **우선순위**: 🔥🔥 최우선 (모든 작업 전 완료 필요)
- **예상 소요시간**: 1-2일

---

## 현재 린트 에러 현황

| 항목 | 수량 |
|------|------|
| any 타입 사용 | 약 835개 (196개 파일) |
| useEffect dependency 경고 | 다수 발견 |
| 기타 린트 규칙 위반 | 추가 확인 필요 |

---

## 역할 분담

### 👨‍💻 김재선: packages/ 및 src/shared/ 린트 정리

**작업 범위:**
- packages/ 폴더 내 모든 린트 에러 수정
- src/shared/ 폴더 내 모든 린트 에러 수정
- 공통 유틸리티 함수들의 타입 정의 개선

**주요 작업:**
- packages/util/ any 타입 제거 및 적절한 타입 정의
- packages/webEnv/ 타입 안정성 개선
- src/shared/ui/ 컴포넌트 타입 정의 개선
- useEffect dependency 경고 수정

### 👨‍💻 최기환: apps/oracle/ 린트 정리

**작업 범위:**
- apps/oracle/ 폴더 내 모든 린트 에러 수정
- Oracle 관련 차트, 테이블 컴포넌트 타입 정의

**주요 작업:**
- Oracle 페이지들의 any 타입 제거
- 차트 관련 컴포넌트 타입 정의 개선
- API 응답 타입 정의 추가
- useEffect, useCallback dependency 경고 수정 - **exhaustive deps 워닝은 전부 주석처리**

### 👨‍💻 한원영: apps/backOffice/ 및 src/ 린트 정리

**작업 범위:**
- apps/backOffice/ 폴더 내 모든 린트 에러 수정
- src/pages/, src/features/ 폴더 린트 정리

**주요 작업:**
- BackOffice 페이지들의 any 타입 제거
- Dashboard, Configuration 관련 타입 정의
- Navigation, Layout 컴포넌트 타입 개선
- useEffect dependency 경고 수정

---

## 린트 정리 가이드라인

1. **any 타입 금지**: 모든 any를 적절한 타입으로 교체
2. **useEffect dependency**: 모든 의존성 배열 정확히 명시
3. **타입 안전성**: 런타임 에러 방지를 위한 엄격한 타입 체크
4. **일관성**: 기존 코드 스타일과 일치하도록 수정

---

## 최종 체크리스트

- [ ] 모든 any 타입 제거 완료
- [ ] useEffect dependency 경고 모두 수정
- [ ] 린트 에러 0개 달성
- [ ] 타입 에러 0개 달성

---

## 관련 태스크
- [[결정된 구조 정리]] - 아키텍처 결정 문서
