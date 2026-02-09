## 1. 개요
본 문서는 기존 FE에서 수행하던 알람 데이터 가공 로직을 BE로 이관하기 위한 스펙입니다.
BE는 수신된 알람 데이터를 아래 두 가지 형태(View/DB)로 각각 가공하여 처리해야 합니다.

* **View (Dashboard):** 실시간 대시보드 표출을 위해 가공된 데이터 (구 WS 로직)
* **DB (History):** 알람 이력 테이블에 저장하기 위해 정제된 데이터 (구 Alert Log 로직)

---

## 2. Tibero 알람 가공 로직
> **기준 버전:** 5.4.3.241111.01

### 2.1. [공통] OS STAT 명칭 전처리 (Pre-processing)
모든 로직 수행 전, 아래 매핑 테이블에 따라 지표명(Key)을 먼저 치환합니다.

| 원본 명칭 (Raw Key) | 변환 명칭 (Displayed Name) |
| :--- | :--- |
| `free mem size` | `free memory` |
| `total mem size` | `total memory` |
| `swap used size` | **`free swap`** (Oracle과 다름 주의) |
| `swap total size` | `total swap` |
| `used mem usage` | `used memory(%)` |
| `free mem usage` | `free memory(%)` |

### 2.2. 타입별 가공 정책
| Alarm Type | View (Dashboard 표출용) | DB (History 저장용) |
| :--- | :--- | :--- |
| **SERVER ALERT** | **Name:** 원본 유지<br>**Value:** 0 미만인 경우 `''` (빈값) | **Name:** `SERVER ALERT`로 강제 변환<br>**Value:** `''` (빈값) |
| **TABLESPACE** | **Name:** description에서 TS명 추출<br>**Value:** `/ 100` (백분율 환산) | **Name:** `TABLESPACE`로 강제 변환<br>**Value:** View 가공 값 저장 |
| **DISK USAGE** | **Name:** 없으면 `DISK USAGE`로 보정<br>**Value:** `/ 100` (백분율 환산) | **Name:** `DISK USAGE`로 강제 변환<br>**Value:** View 가공 값 저장 |
| **DB WARNING** | **Name:** 없으면 `DB WARNING`로 보정<br>**Value:** 0 미만인 경우 `''` | **Name:** 원본 유지<br>**Value:** View 가공 값 저장 |
| **TIBERO ALERT LOG** | **Name:** 없으면 `TIBERO ALERT LOG`로 보정<br>**Value:** 0 미만인 경우 `''` | **Name:** `TIBERO ALERT LOG`로 강제 변환<br>**Value:** View 가공 값 저장 |
| **OS STAT** | **Name:** 전처리(2.1) 후 대문자 변환<br>**Value:** 원본 유지 | **Name:** 원본 유지<br>**Value:** MB 단위면 `/ 1024` (GB 환산) |
| **DB STAT** | **Name/Value:** 변경 없음 | **Name/Value:** View 가공 값 저장 |
| **DB WAIT** | **Name/Value:** 변경 없음 | **Name/Value:** View 가공 값 저장 |
| **SCRIPT ALERT** | **Name/Value:** 변경 없음 | **Name/Value:** View 가공 값 저장 |

---

## 3. Oracle 알람 가공 로직
> **기준 버전:** 25 Release

### 3.1. [공통] OS STAT 명칭 전처리 (Pre-processing)
모든 로직 수행 전, 아래 매핑 테이블에 따라 지표명(Key)을 먼저 치환합니다.

| 원본 명칭 (Raw Key) | 변환 명칭 (Displayed Name) |
| :--- | :--- |
| `free mem size` | `free memory` |
| `total mem size` | `total memory` |
| `swap used size` | **`used swap`** (Tibero와 다름 주의) |
| `swap total size` | `total swap` |

### 3.2. 타입별 가공 정책
※ **공통 규칙:** Name은 기본적으로 대문자 치환, Value의 MB 단위는 `/ 1024` 처리가 기본 적용됨.

| Alarm Type | View (Dashboard 표출용) | DB (History 저장용) |
| :--- | :--- | :--- |
| **SERVER ALERT** | **Name:** 원본 유지<br>**Value:** 음수면 `''` (빈값) | **Name:** `SERVER ALERT` 강제 고정<br>**Value:** `''` |
| **TABLESPACE** | **Name:** `Tablespace:TS명` 포맷팅<br>**Value:** `/ 100` | **Name:** `TABLESPACE` 강제 고정<br>**Value:** View 가공 값 저장 |
| **TEMP / UNDO TS** | **Name:** 유지<br>**Value:** `/ 100` | **Name:** 해당 타입명 강제 고정<br>**Value:** View 가공 값 저장 |
| **TS INCREASE** | **Name:** 유지<br>**Value:** `/ 100` | **Name:** `TABLESPACE INCREASE` 강제 고정<br>**Value:** View 가공 값 저장 |
| **DISK USAGE** | **Name:** 없으면 `DISK USAGE` 보정<br>**Value:** `/ 100` | **Name:** `DISK USAGE` 강제 고정<br>**Value:** View 가공 값 저장 |
| **DB WARNING** | **Name:** 없으면 `DB WARNING` 보정<br>**Value:** 음수면 `''` | **Name/Value:** View 가공 값 저장 |
| **DB STAT** | **Name:** 원본 유지<br>**Value:** 원본 유지 | **Name:** 대문자 처리<br>**Value:** View 가공 값 저장 |
| **SGA FREE MEMORY** | **Name/Value:** 변경 없음 | **Name:** 대문자 처리<br>**Value:** View 가공 값 저장 |
| **DB WAIT** | **Name:** 유지<br>**Value:** `/ 100` (소수점 2자리) | **Name:** 대문자 처리<br>**Value:** View 가공 값 저장 |
| **ORACLE / USER ALERT** | **Name:** 없으면 타입명 보정<br>**Value:** 음수면 `''` | **Name:** 해당 타입명 강제 고정<br>**Value:** View 가공 값 저장 |
| **FILE ALERT LOG** | **Name:** 유지<br>**Value:** `''` 강제 | **Name:** `FILE ALERT LOG` 강제 고정<br>**Value:** `''` |
| **INDEX UNUSABLE** | **Name/Value:** 유지 | **Name:** `INDEX UNUSABLE` 강제 고정<br>**Value:** `''` |
| **DEADLOCK** | **Name/Value:** 유지 | **Name:** `DEADLOCK` 강제 고정<br>**Value:** `''` |
| **PLAN CHANGE** | **Name/Value:** 유지 | **Name:** `PLAN CHANGE` 강제 고정<br>**Value:** `''` |
| **SQL PLAN CHANGE** | **Name/Value:** 유지 | **Name:** `SQL PLAN CHANGE` 강제 고정<br>**Value:** View 가공 값 저장 |
| **CUSTOM ALERT** | **Name:** 유지<br>**Log:** 내부 수치 치환 | **Name:** 대문자 처리<br>**Value:** `''` |
| **OS STAT** | **Name/Value:** 유지 | **Name:** 대문자 처리<br>**Value:** MB면 `/ 1024` |
| **CELL OS STAT** | **Name/Value:** 유지 | **Name:** `Alias/IP + statName`<br>**Value:** 대문자 처리 |
| **INFINIBAND** | **Name/Value:** 유지 | **Name:** `Alias/IP + statName`<br>**Value:** 대문자 처리 |
| **ROCE** | **Name:** 유지<br>**Value:** 0 또는 `/ 1000` (소수점 3자리) | **Name:** `Alias/IP + statName`<br>**Value:** 대문자 처리 |
| **CELL SERVER ALERT** | **Name/Value:** 유지 | **Name:** `Alias/IP + statName`<br>**Value:** `''` |
| **CELL SERVER STATUS** | **Name/Value:** 유지 | **Name:** `RUNNING` ↔ `NOT RUNNING` 치환<br>**Value:** 유지 |
| **ASM DISK GROUP** | **Name/Value:** 유지 | **Name/Value:** View 가공 값 그대로 (대문자) |
| **PDB STATUS** | **Name/Value:** 유지 | **Name:** 대문자 처리<br>**Value:** `''` |