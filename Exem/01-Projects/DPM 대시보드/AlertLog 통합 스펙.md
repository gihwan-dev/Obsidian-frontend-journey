
## 1. Tibero 알람 스펙
> **기준 버전:** 5.4.3.241111.01

### 1.1. OS STAT 명칭 전처리 (Mapping)
수신된 원본 지표명(Key)은 아래 규칙에 따라 화면 표시용 명칭으로 변환됩니다.

| 원본 명칭 (Raw) | 변환 명칭 (Displayed) | 비고 |
| :--- | :--- | :--- |
| `free mem size` | `free memory` | |
| `total mem size` | `total memory` | |
| `swap used size` | **`free swap`** | Oracle과 매핑 다름 주의 |
| `swap total size` | `total swap` | |
| `used mem usage` | `used memory(%)` | |
| `free mem usage` | `free memory(%)` | |

### 1.2. 알람 타입별 처리 로직
* **WS:** 실시간 대시보드/뷰 표출용 데이터
* **Log/History:** 알람 이력 저장용 데이터

| Alarm Type | WS (Name / Value / Log) | Alert Log & History (Name / Value / Log) |
| :--- | :--- | :--- |
| **SERVER ALERT** | **Name:** 원본 statName 유지<br>**Value:** 0 미만이면 `''` (빈값)<br>**Log:** `''`로 강제 | **Name:** `SERVER ALERT`로 강제<br>**Value:** `''`<br>**Log:** `''` |
| **TABLESPACE** | **Name:** description에서 TS명 추출 시 치환<br>**Value:** `/ 100` 적용<br>**Log:** 유지 | **Name:** `TABLESPACE`로 강제<br>**Value:** WS 값 유지<br>**Log:** WS 값 유지 |
| **DISK USAGE** | **Name:** 비면 `DISK USAGE` 보정<br>**Value:** `/ 100` 적용<br>**Log:** 유지 | **Name:** `DISK USAGE`로 강제<br>**Value:** WS 값 유지<br>**Log:** WS 값 유지 |
| **DB WARNING** | **Name:** 비면 `DB WARNING` 보정<br>**Value:** 0 미만이면 `''`<br>**Log:** 유지 | **Name:** 원본 유지<br>**Value:** WS 값 유지<br>**Log:** WS 값 유지 |
| **TIBERO ALERT LOG** | **Name:** 비면 `TIBERO ALERT LOG` 보정<br>**Value:** 0 미만이면 `''`<br>**Log:** 유지 | **Name:** `TIBERO ALERT LOG`로 강제<br>**Value:** WS 값 유지<br>**Log:** WS 값 유지 |
| **OS STAT** | **Name:** 전처리(1.1참고) 후 대문자 변환<br>**Value:** 원본 유지<br>**Log:** 유지 | **Name:** 원본 유지<br>**Value:** MB 단위면 `/ 1024` 적용<br>**Log:** 유지 |
| **DB STAT** | **Name/Value/Log:** 변경 없음 | **Name/Value/Log:** WS 값 그대로 유지 |
| **DB WAIT** | **Name/Value/Log:** 변경 없음 | **Name/Value/Log:** WS 값 그대로 유지 |
| **SCRIPT ALERT** | **Name/Value/Log:** 변경 없음 | **Name/Value/Log:** WS 값 그대로 유지 |

---

## 2. Oracle 알람 스펙
> **기준 버전:** 25 Release

### 2.1. 기본 정책
1.  **데이터 흐름:** 알람 수신 → 워커 가공(단위변환 등) → 프레임 알림
2.  **저장 방식:**
    * **일반 알림:** 동일 알람명 수신 시 덮어쓰기 (최신 1건 유지)
    * **EXA & Index Unusable:** `알람명 + Description` 기준 저장 (동일 알람명 다건 적재 가능)
3.  **FIX 사항 (v25):** `INDEX UNUSABLE` 타입의 Name은 인덱스명이 아닌 `INDEX UNUSABLE`로 고정 표출

### 2.2. OS STAT 명칭 전처리 (Mapping)
| 원본 명칭 (Raw) | 변환 명칭 (Displayed) | 비고 |
| :--- | :--- | :--- |
| `free mem size` | `free memory` | |
| `total mem size` | `total memory` | |
| `swap used size` | **`used swap`** | Free Swap에서 Used Swap으로 지표 변경됨 |
| `swap total size` | `total swap` | |

### 2.3. 알람 타입별 처리 로직
* **공통 사항:** Name은 기본적으로 대문자 치환, Value의 MB 단위는 `/ 1024` 처리

| Alarm Type | WS (Name / Value / Log) | Alert Log & History (Name / Value / Log) |
| :--- | :--- | :--- |
| **SERVER ALERT** | **Name:** 원본 유지<br>**Value:** 음수면 `''`<br>**Log:** `''` | **Name:** `SERVER ALERT` 강제<br>**Value:** `''`<br>**Log:** `''` |
| **TABLESPACE** | **Name:** `Tablespace:TS명` 재구성<br>**Value:** `/ 100`<br>**Log:** 유지 | **Name:** `TABLESPACE` 강제<br>**Value:** WS 값 유지<br>**Log:** WS 값 유지 |
| **TEMP / UNDO TS** | **Name:** 유지<br>**Value:** `/ 100`<br>**Log:** 유지 | **Name:** 타입명(`TEMP...`) 강제<br>**Value:** WS 값 유지<br>**Log:** WS 값 유지 |
| **TS INCREASE** | **Name:** 유지<br>**Value:** `/ 100`<br>**Log:** 유지 | **Name:** `TABLESPACE INCREASE` 강제<br>**Value:** WS 값 유지 |
| **DISK USAGE** | **Name:** 비면 `DISK USAGE` 보정<br>**Value:** `/ 100`<br>**Log:** 유지 | **Name:** `DISK USAGE` 강제<br>**Value:** WS 값 유지 |
| **DB WARNING** | **Name:** 비면 `DB WARNING` 보정<br>**Value:** 음수면 `''` | **Name/Value/Log:** WS 값 그대로 |
| **DB STAT** | **Name:** 원본 유지<br>**Value:** 원본 유지 | **Name:** 대문자 처리<br>**Value/Log:** WS 값 그대로 |
| **SGA FREE MEMORY** | **Name/Value/Log:** 변경 없음 | **Name:** 대문자 처리<br>**Value/Log:** WS 값 그대로 |
| **DB WAIT** | **Name:** 유지<br>**Value:** `/ 100` (소수점 2자리) | **Name:** 대문자 처리<br>**Value/Log:** WS 값 그대로 |
| **ORACLE / USER ALERT** | **Name:** 비면 타입명으로 보정<br>**Value:** 음수면 `''` | **Name:** 해당 타입명으로 강제<br>**Value:** WS 값 유지 |
| **FILE ALERT LOG** | **Name:** 유지<br>**Value:** `''` 강제 | **Name:** `FILE ALERT LOG` 강제<br>**Value:** `''`<br>**Log:** WS 값 유지 |
| **INDEX UNUSABLE** | **Name/Value/Log:** 유지 | **Name:** `INDEX UNUSABLE` 강제 (Fix)<br>**Value:** `''`<br>**Log:** WS 값 유지 |
| **DEADLOCK** | **Name/Value/Log:** 유지 | **Name:** `DEADLOCK` 강제<br>**Value:** `''` |
| **PLAN CHANGE** | **Name/Value/Log:** 유지 | **Name:** `PLAN CHANGE` 강제<br>**Value:** `''`<br>**Log:** 파싱된 로그 |
| **SQL PLAN CHANGE** | **Name/Value/Log:** 유지 | **Name:** `SQL PLAN CHANGE` 강제<br>**Value:** WS 값 유지 |
| **CUSTOM ALERT** | **Name:** 유지<br>**Log:** 내부 수치 치환 | **Name:** 대문자 처리<br>**Value:** `''` |
| **OS STAT** | **Name/Value/Log:** 유지 | **Name:** 대문자 처리<br>**Value:** MB면 `/ 1024`<br>**Log:** WS 값 그대로 |
| **CELL OS STAT** | **Name/Value/Log:** 유지 | **Name:** `Alias/IP + statName`<br>**Value:** 대문자<br>**Log:** `''` |
| **INFINIBAND** | **Name/Value/Log:** 유지 | **Name:** `Alias/IP + statName`<br>**Value:** 대문자<br>**Log:** `''` |
| **ROCE** | **Name:** 유지<br>**Value:** 0 또는 `/ 1000` (소수점 3자리) | **Name:** `Alias/IP + statName`<br>**Value:** 대문자<br>**Log:** `''` |
| **CELL SERVER ALERT** | **Name/Value/Log:** 유지 | **Name:** `Alias/IP + statName`<br>**Value:** `''`<br>**Log:** WS 값 그대로 |
| **CELL SERVER STATUS** | **Name/Value/Log:** 유지 | **Name:** `RUNNING` ↔ `NOT RUNNING` 치환<br>**Value:** 유지<br>**Log:** `''` |
| **ASM DISK GROUP** | **Name/Value/Log:** 유지 | **Name/Value/Log:** WS 값 그대로 (대문자) |
| **PDB STATUS** | **Name/Value/Log:** 유지 | **Name:** 대문자 처리<br>**Value:** `''` |