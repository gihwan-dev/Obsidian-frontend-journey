# ClickUp 작성 자료 정리

**작성자:** 최기환 (rlghks3004@ex-em.com)
**정리일:** 2026-02-01

---

## 1. 문서 (업무 환경 개선)

### 📂 문서 위치
- **문서명:** 업무 환경 개선
- **ID:** rbeb5-443818
- **Space:** FE1팀 > 문서

### 📄 주요 페이지

#### 1.1 Verdaccio
- **설명:** 사내 npm 저장소 도입 배경 (디자인 시스템 배포용)
- **URL:** https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-456626

#### 1.2 Vaultwarden
- **설명:** 비밀번호 공유 도구
- **계정:** fe1@ex-em.com
- **URL:** https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-471380

#### 1.3 Mattermost Notification
- **설명:** 알림 설정 방법
- **URL:** https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-472118

#### 1.4 Claude Code Skills
- **설명:** AI 도구 스킬 설정
- **URL:** https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3449578
- **하위 페이지:**
  - Figma 디자인 검증 스킬 (rbeb5-3449958)
  - figma-to-code 설정 (rbeb5-3450058)
  - component-screenshot 설정 (rbeb5-3450158)
  - design-check 설정 (rbeb5-3450138)
  - figma-design-pipeline 설정 (rbeb5-3450258)

#### 1.5 design-check 설정
- **설명:** Figma 디자인 검증 자동화 스킬
- **포함 파일:** SKILL.md, capture-figma-screenshot.ts, compare-screenshots.ts
- **URL:** https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-497058

---

## 2. 태스크 (차세대 프로젝트)

### 🔄 진행 중 (In Progress)

#### 2.1 Table
- **ID:** 86ewdhv7u
- **위치:** 차세대 > 26년 1Phase > Task
- **담당자:** 최기환
- **URL:** https://app.clickup.com/t/86ewdhv7u
- **내용:**
  - 테이블 관련 회의 내용이나, 자료 조사 내용
  - table 태그 vs div 태그 장단점 조사 필요
  - 유닛 테스트는 리팩토링 계획이 있을 경우 통합 테스트가 더 가치있음
  - 통합 테스트는 세부 구현에 의존하면 안됨
  - Vitest 브라우저 모드 테스트 추천
  - 테이블 기능 20개 관리 → 대칭표 기반 관리 권장

#### 2.2 LLM플랫폼팀 지원
- **ID:** 86ewcz159
- **위치:** 차세대 > Task
- **URL:** https://app.clickup.com/t/86ewcz159
- **하위 태스크:**
  - LLM플랫폼팀의 요구 사항 (86ewe84h9)
  - 1차 목표 (86ewde2un)
  - 아키텍처 (FSD, 어댑터 패턴, 폴더 구조 등) (86ewdhq7w) - 담당: 김재선
  - API (86ewdhqpq) - 담당: 김재선
  - 디자인 시스템 (86ewdhunv) - 담당: 한원영
  - 상태관리 (86ewdhupg) - 담당: 문성우
  - UI 컴포넌트 (86ewdhv78) - 담당: 한원영
  - **Table (86ewdhv7u)** - 담당: 최기환
  - Chart (86ewdhv88) - 담당: 김재선
  - 테스트 커버리지 (86ewdhv9v) - 담당: 최기환, 박영호
  - Storybook (86ewdhvbn)
  - 빌드 최적화 (86ewdhvd1) - 담당: 배지훈, 박영호
  - 데브옵스 (86ewdhvdb) - 담당: 배지훈
  - AI (86ewdhvgx)

#### 2.3 [신한은행] 통합연결 대시보드 기능 개선 요청
- **ID:** 86euk20vc
- **위치:** [DEQ]협업시스템 > Dashboard > New work
- **담당자:** 정일중, 김형웅, 최기환
- **URL:** https://app.clickup.com/t/86euk20vc
- **주요 내용:**
  - 2026.01.30: 대시보드 Recent Alert History 스펙을 맥스게이지와 동일하게 개발 필요
  - PostgreSQL 9.6.3 버전 FETCH NEXT 구문 미지원 → 수정 패치 제공
  - 패치 방법: dashboard.jar 교체, LoginInfo.js 교체, 재기동
- **하위 태스크:**
  - [FE] 신한은행 통합연결 대시보드 기능 개선 요청 (86evxg4by) - resolved

#### 2.4 대시보드
- **ID:** 86ew50v0c
- **위치:** 차세대 > Task
- **담당자:** 문성우, 한원영, 박영호, 김서린, 최기환
- **우선순위:** urgent
- **마감일:** 2026-02-25
- **URL:** https://app.clickup.com/t/86ew50v0c
- **주요 내용:**
  - 다킹 프레임: react-grid-layout 범위 외 기능들이 많아 자체 grid-layout 구현 고려
  - 위젯 그룹 편집(탭), 위젯 다중 선택
  - MSW 검토, 디자인시스템 수정
- **하위 태스크:**
  - react-grid-layout 2 버전 마이그레이션 (resolved)
  - 모킹, MSW 검토 (resolved)
  - 디자인 시스템 및 인터페이스 검토 (resolved)
  - 다킹 프레임 slide 기능 추가 (in progress)
  - 차트 교체 (in progress)
  - Color Palette + Instance List (resolved)
  - Widget Toolbar (in progress)
  - Widget Pack (resolved)
  - **Widget Builder (resolved)** - 담당: 최기환
  - Instance Detail (in progress)
  - MSW 아키텍처 고려 + WebEnv (Open)
  - 위젯 및 렌더링 성능 개선 (Open)
  - 차트 성능 및 기능 확인 (Open)
  - docking frame 테스트 코드 (Open)
  - 소켓 고려 (Open)
  - 기획팀과 논의해야 할 부분 (Open)

### ✅ 완료됨 (Resolved)

#### 2.5 Widget Builder
- **ID:** 86ew6bv7e
- **위치:** 차세대 > 대시보드 > Task
- **담당자:** 최기환
- **URL:** https://app.clickup.com/t/86ew6bv7e
- **내용:**
  - **버그 픽스:** 폼 입력중 시각화 변경시 모달이 닫히고 다른 인터랙션이 동작하지 않음
  - **미구현 기능:** Bar, Area 차트 Stack 기능, Table, Scatter
  - **리팩토링 목표:** '기능 계층(Functional Layer)' → '시각화 도메인(Visualization Domain)' 아키텍처로 전환
  - Zod 스키마 설계

#### 2.6 250619 - 테이블 렌더링 방식 리팩토링에 대한 논의
- **ID:** 86etvt64e
- **위치:** 차세대 > 문서
- **URL:** https://app.clickup.com/t/86etvt64e
- **내용:**
  - 가상화 적용 방식 검토 (기본 내장 vs 옵션화)
  - 3분기에 가상화 적용 예정
  - **필요 기능:** 필터링, 리사이징, 드래그 앤 드롭 칼럼 정렬, 무한 스크롤, 가상화, 칼럼 그룹화, 칼럼/열 고정, 트리 구조 렌더링, 행 확장, 검색, 열 선택, 유연한 디자인 대응, cell 드래그 복사(엑셀 처럼), 테이블 중첩 구조

#### 2.7 시각화 회귀 테스트
- **ID:** 86eu212d2
- **위치:** 차세대 > Task
- **담당자:** 박영호
- **URL:** https://app.clickup.com/t/86eu212d2
- **내용:**
  - MSW standalone 동작으로 빌드된 화면 테스트 수행
  - 로스트 픽셀 제거, 캡처도구 → playwright 대체
  - pngjs로 픽셀 비교
  - 리포트 생성 (추가/제거/변경, 픽셀 변경점, console warning/error 포함)
  - playwright 이미지를 harbor에 업로드

### 📝 대기 중 (Open)

#### 2.8 기획팀과 논의해야 할 부분
- **ID:** 86ew70fhy
- **위치:** 차세대 > 대시보드 > Task
- **담당자:** 한원영, 문성우, 박영호, 김서린, 최기환
- **URL:** https://app.clickup.com/t/86ew70fhy
- **논의 사항:**
  - 26.01.27: 상태 저장 리스트 논의 (widget pack, 새로고침 등), env 저장 세션 관리
  - 26.01.21: Instance List Modal, 컬러팔레트 처리 방식 (팔레트 내 색상 수 < 인스턴스 수), 중복 색상 허용 여부
  - 26.01.16: 그룹과 그룹끼리 그룹핑 가능 여부

---

## 3. 요약

### 📊 통계
| 구분 | 개수 |
|------|------|
| 문서 페이지 | 5개 (+ 하위 페이지) |
| 진행 중 태스크 | 4개 |
| 완료 태스크 | 3개 |
| 대기 중 태스크 | 1개 |

### 🎯 주요 담당 영역
1. **테이블 컴포넌트 개발** - Table, 테이블 렌더링 리팩토링
2. **Widget Builder** - 시각화 도메인 아키텍처 리팩토링
3. **LLM플랫폼팀 지원** - Table, 테스트 커버리지 담당
4. **신한은행 대시보드** - FE 기능 개선
5. **업무 환경 개선** - Verdaccio, Vaultwarden, Claude Code Skills 문서화
