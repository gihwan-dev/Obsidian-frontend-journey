## 1. 주의사항
**View(화면용)**와 **DB(저장용)** 데이터의 가공 방식이 다르므로 주의가 필요합니다.

 **Swap 지표 명칭 차이:**
	- **Oracle:** `swap used size` → **`used swap
    * **Tibero:** `swap used size` → **`free swap`** (소스 기준)
    * **Altibase:** `swap used size` → **`free swap`** (Tibero와 동일)

---

## 2. Tibero 알람 가공 로직
> **기준 버전:** 5.4.3.241111.01

### 2.1. [공통] OS STAT 명칭 매핑

| 원본 명칭 (Raw Key) | 변환 명칭 (Displayed Name) | 주의사항 |
| :--- | :--- | :--- |
| `free mem size` | `free memory` | |
| `total mem size` | `total memory` | |
| `swap used size` | **`free swap`** | **Oracle(`used swap`)과 다름** |
| `swap total size` | `total swap` | |
| `used mem usage` | `used memory(%)` | |
| `free mem usage` | `free memory(%)` | |

### 2.2. 타입별 상세 스펙
| Alarm Type | View (Dashboard 표출용) | DB (History 저장용) |
| :--- | :--- | :--- |
| **SERVER ALERT** | **Name:** 원본 유지<br>**Value:** 0 미만인 경우 `''` (빈값) | **Name:** `SERVER ALERT` 강제 고정<br>**Value:** `''` |
| **TABLESPACE** | **Name:** description에서 TS명 추출<br>**Value:** `value / 100` | **Name:** `TABLESPACE` 강제 고정<br>**Value:** View 값 저장 |
| **DISK USAGE** | **Name:** 없으면 `DISK USAGE` 보정<br>**Value:** `value / 100` | **Name:** `DISK USAGE` 강제 고정<br>**Value:** View 값 저장 |
| **DB WARNING** | **Name:** 없으면 `DB WARNING` 보정<br>**Value:** 0 미만인 경우 `''` | **Name:** 원본 유지<br>**Value:** View 값 저장 |
| **TIBERO ALERT LOG** | **Name:** 없으면 `TIBERO ALERT LOG` 보정<br>**Value:** 0 미만인 경우 `''` | **Name:** `TIBERO ALERT LOG` 강제 고정<br>**Value:** View 값 저장 |
| **OS STAT** | **Name:** 매핑(2.1) 후 **대문자** 변환<br>**Value:** 원본 유지 | **Name:** 원본 유지<br>**Value:** MB 단위면 `/ 1024` |
| **DB STAT** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |
| **DB WAIT** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |
| **SCRIPT ALERT** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |

---

## 3. Oracle 알람 가공 로직
> **기준 버전:** 25 Release

### 3.1. [공통] OS STAT 명칭 매핑

| 원본 명칭 (Raw Key) | 변환 명칭 (Displayed Name) | 주의사항 |
| :--- | :--- | :--- |
| `free mem size` | `free memory` | |
| `total mem size` | `total memory` | |
| `swap used size` | **`used swap`** | **Tibero(`free swap`)와 다름** |
| `swap total size` | `total swap` | |

### 3.2. 타입별 상세 스펙
※ **기본 규칙:** Name은 기본 대문자 치환, DB 저장 시 MB 단위 Value는 `/ 1024` 적용

| Alarm Type              | View (Dashboard 표출용)                                      | DB (History 저장용)                                           |
| :---------------------- | :-------------------------------------------------------- | :--------------------------------------------------------- |
| **SERVER ALERT**        | **Name:** 원본 유지<br>**Value:** 음수면 `''`                    | **Name:** `SERVER ALERT` 고정<br>**Value:** `''`             |
| **TABLESPACE**          | **Name:** `Tablespace:TS명` 포맷<br>**Value:** `value / 100` | **Name:** `TABLESPACE` 고정<br>**Value:** View 값 저장          |
| **TEMP / UNDO TS**      | **Name:** 유지<br>**Value:** `value / 100`                  | **Name:** 해당 타입명 고정<br>**Value:** View 값 저장                |
| **TS INCREASE**         | **Name:** 유지<br>**Value:** `value / 100`                  | **Name:** `TABLESPACE INCREASE` 고정<br>**Value:** View 값 저장 |
| **DISK USAGE**          | **Name:** 없으면 `DISK USAGE` 보정<br>**Value:** `value / 100` | **Name:** `DISK USAGE` 고정<br>**Value:** View 값 저장          |
| **DB WARNING**          | **Name:** 없으면 `DB WARNING` 보정<br>**Value:** 음수면 `''`      | **Name/Value:** View 값 저장                                  |
| **DB STAT**             | **Name:** 원본 유지<br>**Value:** 원본 유지                       | **Name:** 대문자 처리<br>**Value:** View 값 저장                   |
| **SGA FREE MEMORY**     | **Name/Value:** 변경 없음                                     | **Name:** 대문자 처리<br>**Value:** View 값 저장                   |
| **DB WAIT**             | **Name:** 유지<br>**Value:** `(value / 100).toFixed(2)`     | **Name:** 대문자 처리<br>**Value:** View 값 저장                   |
| **ORACLE / USER ALERT** | **Name:** 없으면 타입명 보정<br>**Value:** 음수면 `''`               | **Name:** 해당 타입명 고정<br>**Value:** View 값 저장                |
| **FILE ALERT LOG**      | **Name:** 유지<br>**Value:** `''` 강제                        | **Name:** `FILE ALERT LOG` 고정<br>**Value:** `''`           |
| **INDEX UNUSABLE**      | **Name:** `INDEX UNUSABLE` (Fix 반영)<br>**Value:** 유지      | **Name:** `INDEX UNUSABLE` 고정<br>**Value:** `''`           |
| **DEADLOCK**            | **Name/Value:** 유지                                        | **Name:** `DEADLOCK` 고정<br>**Value:** `''`                 |
| **PLAN CHANGE**         | **Name/Value:** 유지                                        | **Name:** `PLAN CHANGE` 고정<br>**Value:** `''`              |
| **SQL PLAN CHANGE**     | **Name/Value:** 유지                                        | **Name:** `SQL PLAN CHANGE` 고정<br>**Value:** View 값 저장     |
| **CUSTOM ALERT**        | **Name:** 유지<br>**Log:** 내부 수치 치환                         | **Name:** 대문자 처리<br>**Value:** `''`                        |
| **OS STAT**             | **Name/Value:** 유지                                        | **Name:** 대문자 처리<br>**Value:** MB면 `/ 1024`                |
| **CELL OS STAT**        | **Name/Value:** 유지                                        | **Name:** `Alias/IP + statName`<br>**Value:** 대문자 처리       |
| **INFINIBAND**          | **Name/Value:** 유지                                        | **Name:** `Alias/IP + statName`<br>**Value:** 대문자 처리       |
| **ROCE**                | **Name:** 유지<br>**Value:** `0` 또는 `(v/1000).toFixed(3)`   | **Name:** `Alias/IP + statName`<br>**Value:** 대문자 처리       |
| **CELL SERVER ALERT**   | **Name/Value:** 유지                                        | **Name:** `Alias/IP + statName`<br>**Value:** `''`         |
| **CELL SERVER STATUS**  | **Name/Value:** 유지                                        | **Name:** `RUNNING` ↔ `NOT RUNNING`<br>**Value:** 유지       |
| **ASM DISK GROUP**      | **Name/Value:** 유지                                        | **Name/Value:** View 값 그대로 (대문자)                           |
| **PDB STATUS**          | **Name/Value:** 유지                                        | **Name:** 대문자 처리<br>**Value:** `''`                        |


---

## 4. Altibase 알람 가공 로직
> **기준 버전:** 5.3.1.250826.01

### 4.1. [공통] OS STAT 명칭 매핑

| 원본 명칭 (Raw Key) | 변환 명칭 (Displayed Name) | 주의사항 |
| :--- | :--- | :--- |
| `free mem size` | `free memory` | |
| `total mem size` | `total memory` | |
| `swap used size` | **`free swap`** | **Oracle(`used swap`)과 다름** |
| `swap total size` | `total swap` | |

### 4.2. 타입별 상세 스펙
| Alarm Type | View (Dashboard 표출용) | DB (History 저장용) |
| :--- | :--- | :--- |
| **SERVER ALERT** | **Name:** 원본 유지 / **Value:** 0 미만인 경우 `''` (빈값) | **Name:** `SERVER ALERT` 강제 고정 / **Value:** `''` |
| **TABLESPACE** | **Name:** description에서 TS명 추출 → `Tablespace:{TS명}` / **Value:** `value / 100` | **Name:** `TABLESPACE` 강제 고정 / **Value:** View 값 저장 |
| **MEMORY TABLESPACE** | **Name:** description에서 TS명 추출 → `Tablespace:{TS명}` / **Value:** `value / 100` | **Name:** `MEMORY TABLESPACE` 강제 고정 / **Value:** View 값 저장 |
| **DISK USAGE** | **Name:** 없으면 `DISK USAGE` 보정 / **Value:** `value / 100` | **Name:** `DISK USAGE` 강제 고정 / **Value:** View 값 저장 |
| **DB WARNING** | **Name:** 없으면 `DB WARNING` 보정 / **Value:** 0 미만인 경우 `''` | **Name:** 원본 유지 / **Value:** View 값 저장 |
| **ALTIBASE ALERT LOG** | **Name:** 없으면 `ALTIBASE ALERT LOG` 보정 / **Value:** 0 미만인 경우 `''` | **Name:** `ALTIBASE ALERT LOG` 강제 고정 / **Value:** View 값 저장 |
| **USER ALERT LOG** | **Name:** 없으면 `USER ALERT LOG` 보정 / **Value:** 0 미만인 경우 `''` | **Name:** `USER ALERT LOG` 강제 고정 / **Value:** View 값 저장 |
| **SGA FREE MEMORY** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |
| **OS STAT** | **Name:** 매핑(2.1) 후 **대문자** 변환 / **Value:** 원본 유지 | **Name:** 원본 유지 / **Value:** MB 단위면 `/ 1024` |
| **DB STAT** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |
| **DB WAIT** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |
| **SCRIPT ALERT** | **Name/Value:** 변경 없음 | **Name/Value:** View 값 저장 |
