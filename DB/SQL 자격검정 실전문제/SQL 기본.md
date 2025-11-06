## SQL 문장들의 종류

### 데이터 조작어(DML)
- SELECT: 조회하거나 검색하기 위한 명령어로 RETRIEVE 라고도 함
- INSERT
- UPDATE
- DELETE

### 데이터 정의어(DDL)
- CREATE
- ALTER
- DROP
- RENAME

### 데이터 제어어(DCL)
- GRANT
- REVOKE

### 트랜잭션 제어어(TCL)
- COMMIT
- ROLLABACK

### 비절차적 데이터 조작어 vs 절차적 데이터 조작어
#### 절차적 DML
- 어떻게 데이터를 가져올지 명시
- 데이터 접근 방법과 순서를 프로그래머가 직접 지정
- 예: C, COBOL 등에 내장된 저수준 데이터베이스 접근 코드
#### 비절차적 DML
- 무엇을 원하는지만 명시
- 데이터 접근 방법은 DMBS가 자동으로 최적화해서 결정
- 예: SQL(SELECT, INSERT, UPDATE, DELETE)

