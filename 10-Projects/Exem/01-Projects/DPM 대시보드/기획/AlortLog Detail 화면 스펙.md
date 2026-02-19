# Alert Log Detail 팝업 - 기능 스펙 (OnePage)

> 최종 검토: 2026-02-10 | 대상: RTM Alert Log History에서 열리는 상세 로그 팝업

---

## 1. 기능 개요

Alert Log Detail 팝업은 RTM Alert Log History 그리드에서 **Log** 또는 **User Script** 컬럼을 클릭할 때 나타나는 모달 창이다.
선택한 Alert의 **인스턴스, 발생 시각, 심각도(Level), 상세 로그 내용**을 한눈에 확인할 수 있도록 제공한다.

---

## 2. 팝업이 열리는 조건

### 2.1 직접 트리거 (Log / User Script 컬럼 클릭)

| 클릭 컬럼           | 팝업 제목         | 표시 내용                  |
| --------------- | ------------- | ---------------------- |
| **Log**         | "Alert Log"   | 해당 Alert의 로그 텍스트       |
| **User Script** | "User Script" | 해당 Alert의 사용자 스크립트 텍스트 |
|                 |               |                        |
|                 |               |                        |

- 해당 컬럼의 값이 **비어있으면 팝업이 열리지 않음**
- 값이 있는 경우에만 커서가 포인터(손가락)로 변경되어 클릭 가능함을 시각적으로 표시

### 2.2 간접 트리거 (Name 컬럼 클릭)

Name 컬럼 클릭 시 Alert 유형에 따라 전용 팝업으로 분기되지만, **해당하는 전용 팝업이 없는 Alert 유형**의 경우 이 팝업이 열린다.

```
Name 컬럼 클릭
  │
  ├─ 전용 팝업이 있는 유형 → 해당 전용 팝업으로 이동
  │   (SQL PLAN CHANGE, TEMP TABLESPACE, PLAN CHANGE,
  │    CPU/MEMORY, SESSIONS, LOCK/ENQ 등)
  │
  └─ 전용 팝업이 없는 유형 → 이 Alert Log Detail 팝업 열기
      (Log 값이 있으면 Log 표시, 없으면 User Script 표시)
```

---

## 3. 팝업 화면 구성

### 3.1 와이어프레임

```
┌─────────────────────────────────────────────────┐
│  Alert Log                          ⊕  ⊟  ✕    │
├─────────────────────────────────────────────────┤
│ Instance : ODIDODB1   DateTime : 2026-01-30     │
│ 15:50:39   Status : [Warning]                   │
├─────────────────────────────────────────────────┤
│ 1  Tablespace Warning!                          │
│ 2      Name   : DOID01_8K4M                     │
│ 3      Status : ONLINE                          │
│ 4      Usage  : 98.0 %                          │
│ 5      Free   : 111086464 KB                    │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 3.2 레이아웃 구조

```
팝업 창 (720 x 520, 최소 439 x 180)
│
├─ 상단 정보 영역 (높이: 30px)
│   ├─ Instance 라벨     "Instance : ODIDODB1"
│   ├─ DateTime 라벨     "DateTime : 2026-01-30 15:50:39"
│   ├─ Status 라벨       "Status : "
│   ├─ Level 배지         [Warning] 또는 [Critical]
│   └─ Object Name 라벨  "Object Name : ..." (DEADLOCK인 경우에만)
│
└─ 로그 본문 영역 (나머지 전체)
    └─ 코드 에디터 (줄 번호 포함, 읽기 전용)
```

---

## 4. 정보 표시 상세

### 4.1 상단 정보 영역

| 항목 | 표시 형식 | 예시 |
|------|-----------|------|
| **Instance** | `Instance : {인스턴스명}` | Instance : ODIDODB1 |
| **DateTime** | `DateTime : {YYYY-MM-DD HH:MM:SS}` | DateTime : 2026-01-30 15:50:39 |
| **Status** | Level에 따른 색상 배지 | [Warning] 또는 [Critical] |

- Business Name 모드가 활성화된 경우 "Instance" 대신 "Business"로 표시

### 4.2 Level 배지 색상

| Level | 배지 색상 | 텍스트 색상 |
|-------|-----------|-------------|
| **Warning** | 주황 (#DB8930) | 흰색 |
| **Critical** | 빨강 (#D92E2E) | 흰색 |

배지는 둥근 모서리(border-radius: 8px)의 라벨 형태로 표시

### 4.3 로그 본문 영역

- **코드 에디터**: ACE Editor 기반의 읽기 전용 텍스트 뷰어
- **줄 번호**: 좌측에 줄 번호(line number) 자동 표시
- **내용**: Log 또는 User Script 텍스트를 그대로 표시

---

## 5. 팝업 제목 규칙

| 클릭한 컬럼 | 팝업 제목 (Full 버전) | 팝업 제목 (Light 버전) |
|------------|----------------------|----------------------|
| Log | "Alert Log" (다국어 변환됨) | "Alert Log" (영문 고정) |
| User Script | "User Script" (다국어 변환됨) | "User Script" (영문 고정) |

> Light 버전에서는 다국어 변환(TR)이 적용되지 않아 팝업 제목이 항상 영문으로 표시됨

---

## 6. DEADLOCK Alert 특수 처리

DEADLOCK 유형의 Alert인 경우, 상단 정보 영역에 **Object Name** 라벨이 추가로 표시된다.

### 6.1 표시 조건

```
Alert Name이 "DEADLOCK"인 경우
  → 상단에 "Object Name : {오브젝트명}" 추가 표시
```

### 6.2 Object Name 추출 방법

- 로그 텍스트에서 `|` 구분자로 분리
- 두 번째 부분을 Object Name으로 표시
- 예: 로그가 `"lock_info|EMPLOYEE_TABLE|detail"` → Object Name : `EMPLOYEE_TABLE`

---

## 7. 팝업 동작 규칙

| 동작 | 설명 |
|------|------|
| **열기** | Log/User Script 클릭 시 팝업 표시 |
| **닫기** | X 버튼 또는 ⊟ 버튼 → 팝업 숨김 (완전 제거가 아닌 숨김) |
| **닫기 시 초기화** | 에디터 텍스트를 비움 |
| **재사용** | 다른 Alert 클릭 시 기존 팝업의 내용만 갱신하여 재표시 |
| **리사이징** | 사용자가 팝업 크기를 자유롭게 조절 가능 |
| **드래그 이동** | 사용자가 팝업 위치를 자유롭게 이동 가능 |

---

## 8. 테마별 스타일

### 8.1 에디터 테마

| 앱 테마 | 에디터 테마 |
|---------|------------|
| Default (White) | 밝은 테마 (eclipse) |
| Black | 다크 테마 (dark_imx) |
| Gray | 다크 테마 (dark_imx) |

> RTM 모드에서만 Black/Gray 테마 적용. PA 모드에서는 항상 밝은 테마

### 8.2 상단 정보 영역 스타일

| 테마 | 배경색 | 텍스트 색상 |
|------|--------|------------|
| Default (White) | 흰색 (#FFFFFF) | 검정 (기본) |
| Black | 어두운 회색 (#30333A) | 흰색 (#FFFFFF) |
| Gray | 어두운 회색 (#30333A) | 밝은 회색 (#ABAEB5) |

### 8.3 로그 본문 영역 테두리

| 테마 | 테두리 색상 |
|------|------------|
| Default (White) | 연한 회색 (#DDDDDD) |
| Black | 진한 회색 (#464A54) |
| Gray | 진한 회색 (#464A54) |

---

## 9. Full vs Light 버전 차이 요약

| 항목 | Full Version | Light Version |
|------|-------------|---------------|
| 팝업 크기 | 720 x 520 | 720 x 520 (동일) |
| 팝업 제목 | 다국어 지원 | 영문 고정 |
| DEADLOCK 처리 | 지원 | 지원 (동일) |
| 에디터 테마 | 테마별 분기 | 테마별 분기 (동일) |
| Label 영역 | 동일 | 동일 |
| 전체 동작 | 동일 | 동일 |

> 유일한 차이는 팝업 제목의 다국어 처리 여부

---

## 10. 관련 화면/기능

| 연관 화면 | 관계 |
|-----------|------|
| **RTM Alert Log History** | 이 팝업의 부모 화면. Grid의 Log/User Script/Name 클릭 시 호출 |
| **PA Alert Log** | PA에서는 별도의 SyntaxEditor Panel로 Alert 텍스트를 표시 (팝업이 아님) |
| **SQL Profile Detail** | Name 클릭 시 SQL PLAN CHANGE 유형일 때 이 팝업 대신 열리는 전용 팝업 |
| **Temp Tablespace Usage** | Name 클릭 시 TEMP TABLESPACE 유형일 때 이 팝업 대신 열리는 전용 팝업 |
| **Plan Diff** | Name 클릭 시 PLAN CHANGE 유형일 때 이 팝업 대신 열리는 전용 팝업 |
| **Session Manager** | Name 클릭 시 SESSION 관련 유형일 때 이 팝업 대신 열리는 전용 팝업 |
| **Lock Tree** | Name 클릭 시 LOCK/ENQ 유형일 때 이 팝업 대신 열리는 전용 팝업 |
| **Top Grid** | Name 클릭 시 CPU/MEMORY/EVENT 유형일 때 이 팝업 대신 열리는 전용 팝업 |
