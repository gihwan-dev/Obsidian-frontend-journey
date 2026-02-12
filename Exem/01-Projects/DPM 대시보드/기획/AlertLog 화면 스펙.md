# Alert Log - 기능 스펙 (OnePage)

> 최종 검토: 2026-02-10 | 대상: PA Alert Log (1-Day History) + RTM Alert Log History

---

## 1. 기능 개요

Alert Log는 데이터베이스에서 발생하는 경고(Warning) 및 위험(Critical) 알람을 **시간순으로 조회하고 분석**하는 기능이다.
두 가지 컨텍스트에서 제공되며, RTM에서 PA로의 화면 연계를 통해 실시간 모니터링과 과거 이력 분석을 하나의 흐름으로 연결한다.

| 컨텍스트 | 화면명 | 핵심 목적 |
|----------|--------|-----------|
| **PA** (Performance Analyzer) | Alert Log (1-Day History) | 과거 Alert 이력을 날짜 범위로 조회 및 분석 |
| **RTM** (Real Time Monitoring) | Alert Log History | 실시간으로 발생하는 Alert을 모니터링 |

---

## 2. 사용자 시나리오

### 2.1 PA Alert Log 사용 시나리오

```
1. 사용자가 PA 메뉴에서 "Alert Log" 진입
2. 조건 영역에서 날짜, Alarm 이름, Level 설정
3. [Retrieve] 클릭 → 차트 + 그리드 동시 로드
4. 차트의 특정 시간 바 클릭 → 해당 시간 Alert 상세 목록 확인
5. 그리드에서 개별 Alert 클릭 → 상세 로그 확인
6. (선택) 메모 등록 또는 Alarm Pause 설정
```

### 2.2 RTM Alert Log History 사용 시나리오

```
1. RTM 대시보드에서 "Alert Log History" 프레임 확인
2. Chart 뷰 → 인스턴스별 Alert 발생 현황을 원(Circle)으로 시각화
3. Grid 뷰로 전환 → 발생한 Alert 목록을 테이블 형태로 확인
4. Grid의 Log/User Script 컬럼 클릭 → Alert 상세 팝업(Alert Log Detail) 표시
5. Grid의 Name 컬럼 클릭 → Alert 유형에 따라 전용 팝업으로 분기
6. 우클릭 → Resolve Alert / Alarm Pause / Memo / 1-Day History 등 액션
7. "1-Day History" 버튼 → PA Alert Log 화면으로 Jump
```

---

## 3. PA Alert Log 화면 구성

### 3.1 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│ 조건 영역 (높이: 90px)                                       │
│  [From Date] ~ [To Date]  [Alarm ▾]  [Level ▾]  □ Exclude  │
├─────────────────────────────────────────────────────────────┤
│ Alert Panel (SyntaxEditor)                                   │
│  - Oracle Alert Log 원본 텍스트 표시                          │
├─────────────────────────────────────────────────────────────┤
│ Alarm Panel                                                  │
│  ┌──────────────────────────┐ ┌──────────────────────────┐  │
│  │ Chart (Stacked Bar)      │ │ Warning/Critical Grid    │  │
│  │  ■ Warning  ■ Critical   │ │ Date | Critical | Warning│  │
│  └──────────────────────────┘ └──────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ [Total] [Selected Time] [Alarm Pause*] [Memo*]              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Alert Time | Event Name | Value | Level | Description│   │
│  │ ...                                                   │   │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
  * Alarm Pause / Memo 탭은 Vendor Option에 의해 선택적 활성화
```

### 3.2 조건(필터) 영역

| 조건 | 설명 | 기본값 |
|------|------|--------|
| **Date Range** | 조회 시작/종료 날짜 (HH:MM 단위) | 어제 00:00 ~ 23:59 |
| **Alarm** | 특정 Alarm 이름 필터 | (All) |
| **Level** | Warning / Critical / All | (All) |
| **Exclude RTS Daemon** | RTS Daemon Down/Disconnect 로그 제외 | 미체크 |

### 3.3 차트 영역

- **유형**: Stacked Bar Chart (Warning + Critical 누적)
- **색상**: Warning = 주황(#ffa500), Critical = 빨강(#d7000f)
- **X축**: 날짜 범위에 따라 자동 결정
  - 1일 범위 → 시간 단위 (HH:MM)
  - 2일 이상 → 일 단위 (MM-DD)
- **상호작용**: 차트 바 클릭 시 → "Selected Time" 탭에 해당 시간 Alert 필터링

### 3.4 하단 탭 그리드

| 탭 | 설명 | 데이터 소스 |
|----|------|-------------|
| **Total** | 전체 기간 Alert 목록 | SQL 직접 조회 (시간당 최대 20,000건) |
| **Selected Time** | 차트 클릭 시 해당 시간 Alert | Total에서 시간 범위 필터링 |
| **Alarm Pause** | Alarm 일시중지 이력 | REST API 조회 (`useAlarmPause` 옵션 필요) |
| **Memo** | Alert 메모 이력 | REST API 조회 (`useMemo` 옵션 필요) |

### 3.5 우클릭 메뉴

- **Event Description**: DB WAIT 타입 Alert에서만 활성화
- 한국어 환경(`ko`)에서만 활성화

---

## 4. RTM Alert Log History 화면 구성

### 4.1 레이아웃

```
┌───────────────────────────────────────────────────────────┐
│ [Frame Title]  [Chart⇄Grid]  [⏸ Pause]  [📝 Memo]  [1-Day History] │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Chart 뷰: 인스턴스별 Alert 현황 (원 표시 + Timeline)      │
│  ─── 또는 ───                                             │
│  Grid 뷰: Alert 목록 테이블                                │
│                                                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │Instance│ Time │ Name │Value│Level│ Log │User Script │ │
│  │────────│──────│──────│─────│─────│─────│────────────│ │
│  │ODIDO..│15:50 │Table.│98.0 │Warn │ [▶] │            │ │
│  └──────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────┤
│ Detail Floating Panel (Alert 상세 정보)                    │
└───────────────────────────────────────────────────────────┘
```

### 4.2 Chart/Grid 토글

| 뷰 | 설명 | 기본값 |
|----|------|--------|
| **Chart** | 인스턴스별 Alert 발생 현황을 시각화 | 기본 선택 |
| **Grid** | Alert 목록을 표 형태로 표시 | 토글 가능 |

- 토글 상태는 사용자별로 저장되어 다음 접속 시 복원됨

### 4.3 Grid 컬럼 구성

| 컬럼명 | 클릭 동작 | 비고 |
|--------|-----------|------|
| **Instance** (또는 Business) | - | 인스턴스명 표시 |
| **Time** | - | 발생 시각 |
| **Name** | Alert 유형별 전용 팝업 분기 | 클릭 시 커서 변경 |
| **Value** | - | Alert 수치값 |
| **Level** | - | Warning / Critical |
| **Log** | **Alert Log Detail 팝업 열기** | 클릭 시 커서 변경, 값이 있을 때만 |
| **User Script** | **Alert Log Detail 팝업 열기** | 클릭 시 커서 변경, 값이 있을 때만 |

### 4.4 Name 컬럼 클릭 시 분기

| Alert 유형 | 연결 화면 |
|-----------|-----------|
| SQL PLAN CHANGE | SQL Profile Detail 팝업 |
| TEMP TABLESPACE | Temp Tablespace Usage 팝업 |
| PLAN CHANGE | Plan Diff 팝업 |
| CPU / FREE MEMORY / TOTAL MEMORY | Top Grid (OS 타입) 팝업 |
| ACTIVE/WAITING/DEDICATED/LOCK WAITING SESSIONS | Session Manager 팝업 |
| LOCK / ENQ | Lock Tree 팝업 |
| Alert log | 동작 없음 |
| **그 외 모든 유형** | **Alert Log Detail 팝업** |

### 4.5 우클릭 메뉴 (Context Menu)

| 메뉴 | 설명 | 조건 |
|------|------|------|
| **Resolve Alert** | Alert을 해결 완료로 표시 | 특정 Alert 유형에서만 활성 |
| **Alarm Pause** | 해당 Alarm 일시중지 등록 | `useAlarmPause` 옵션 필요 |
| **Memo** | Alert에 메모 등록 | `useMemo` 옵션 필요 |
| **Clear Alert Log** | Alert Log 삭제 | - |
| **Event Description** | 이벤트 상세 설명 조회 | DB WAIT 타입, 한국어 환경만 |
| **1-Day History** | PA Alert Log로 Jump | 해당 인스턴스+날짜 자동 설정 |

### 4.6 알람 카테고리 (Chart 뷰)

| 카테고리 | 포함 항목 |
|----------|-----------|
| **ORACLE ALERT** | Oracle Alert Log Alarm |
| **TABLE SPACE** | Tablespace Usage, Increase, Temp, Undo* |
| **SERVER STATUS** | DB Down, Listener Down, MaxGauge Agent/Server Down |
| **STAT** | OS STAT, DB STAT, DB Wait, Custom Alarm |
| **OTHERS** | Disk Usage, DB Warning, SGA Free Memory, Index Unusable, File Alert Log, PDB Status* |

> \* Undo Tablespace, PDB Status는 Vendor Option에 의해 선택적 표시

---

## 5. 화면 연계

### 5.1 RTM → PA Jump

```
RTM Alert Log History
  │
  ├─ [1-Day History] 버튼 클릭
  │   ├─ 단일 인스턴스 → 바로 PA Alert Log로 이동
  │   └─ 복수 인스턴스 → 인스턴스 선택 팝업 → PA Alert Log로 이동
  │
  └─ 우클릭 → "1-Day History" 메뉴
      └─ 해당 인스턴스 + 해당 날짜로 PA Alert Log 자동 조회
```

- Jump 시 전달 정보: 대상 DB, 날짜 범위(해당 일자 00:00~23:59), Alarm 이름
- PA 화면에서 자동으로 조회(Retrieve) 실행

---

## 6. Vendor Option에 의한 선택적 기능

| 옵션 | 영향 범위 |
|------|-----------|
| `useDeadlockAlert` | Deadlock Alert 지원. 전용 SQL 사용, Grid에 Object Name 표시 |
| `useAlarmPause` | Alarm Pause 탭 표시, Pause 등록/해제/조회 기능 활성화 |
| `useMemo` | Memo 탭 표시, 메모 등록/조회/삭제 기능 활성화 |
| `usePDBStatus` | PDB Status 알람을 OTHERS 카테고리에 추가 |
| `useUndoTablespace` | Undo Tablespace 알람을 TABLE SPACE 카테고리에 추가 |

---

## 7. Alert Value 표시 규칙

| Alert 유형 | 값 표시 방법 |
|-----------|-------------|
| TABLESPACE / TEMP / UNDO / DISK USAGE / DB WAIT | 백분율(%) 형태 (원본값 / 100) |
| ROCE | 초(sec) 형태 (원본값 / 1000) |
| PLAN CHANGE / FILE ALERT LOG / ORACLE ALERT LOG / SQL PLAN CHANGE | 값 없음 (빈칸) |
| OS Memory (FREE MEMORY, TOTAL MEMORY 등) | MB 단위 변환 (원본값 / 1024) |
| 음수 값 | 표시하지 않음 |
| 그 외 | 원본값 그대로 표시 |

---

## 8. Level(심각도) 체계

| Level | 표시명 | 배지 색상 | 수치 코드 |
|-------|--------|-----------|-----------|
| 경고 | Warning | 주황 (#DB8930) | 1 |
| 위험 | Critical | 빨강 (#D92E2E / #d7000f) | 2 |

---

## 9. API 목록

### Alarm Pause

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/alarms/pause` | Alarm Pause 등록 |
| GET | `/api/v1/alarms/pause-by-time` | 시간 범위별 Pause 이력 조회 |
| GET | `/api/v1/alarms/pause-by-alarm-name` | Alarm 이름별 Pause 조회 |
| POST | `/api/v1/alarms/pause-release` | Alarm Pause 해제 |
| GET | `/api/v1/alarms/pause-on-off` | Pause 상태 On/Off 조회 |

### Memo

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/alarms/memos-by-alarm-info` | Alarm 정보별 메모 조회 |
| POST | `/api/v1/alarms/memos` | 메모 등록 |
| DELETE | `/api/v1/alarms/memos` | 메모 삭제 (본인 메모만 가능) |
| GET | `/api/v1/alarms/memos-by-time` | 시간 범위별 메모 조회 |

---

## 10. Full / Light 버전 차이 (RTM)

| 항목 | Full Version | Light Version |
|------|-------------|---------------|
| 화면명 | Alert Log History | Alert Log |
| Chart 영역 | 5개 카테고리 + 조건 표시 + 상세 Timeline | 간소화된 Chart |
| Grid 이름 | JSON_ALERT_LOG_GRID | JSON_ALERT_LOG_GRID_NEW |
| Alert Log Detail 팝업 제목 | 다국어 지원 (TR 적용) | 영문 고정 (TR 미적용) |
| 나머지 기능 | 동일 | 동일 |

---

## 11. 관련 화면 목록

| 화면 | 파일 | 역할 |
|------|------|------|
| PA Alert Log View | `PA/view/AlertLogView.js` | 조건 영역 + 날짜 선택 |
| PA Alert Log Src | `PA/view/src/AlertLogSrc.js` | Chart + Grid + 데이터 처리 |
| RTM Alert Log History (Full) | `RTM/Frame/AlertLogHistoryFrame.js` | RTM Full 버전 |
| RTM Alert Log History (Light) | `RTM/Frame/AlertLogHistoryFrameLight.js` | RTM Light 버전 |
| Alert Log Memo Window | `Exem/AlertLogMemoWindow.js` | 메모 등록/조회/삭제 팝업 |
