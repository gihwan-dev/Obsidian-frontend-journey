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

### 테이블 칼럼에 대한 정의 변경
- **Oracle**: `ALTER TABLE 테이블명 MODIFY (칼럼명1 데이터 유형 [DEFAULT 식] [NOT NULL], 칼럼명2 데이터 유형 ...);`
- **SQL Server**: `ALTER TABLE 테이블명 ALTER 칼럼명1 데이터 유형 [DEFAULT 식] [NOT NULL]`
	- 괄호 X
	- 여러개 칼럼 수정 불가

### Null의 의미
- 공백이나 숫자 0과는 전혀 다른 값이며, 조건에 맞는 데이터가 없을 때의 공집합과도 다름
- NULL은 아직 정의되지 않은 미지의 값 이거나 현재 데이터를 입력하지 못하는 경우를 의미함

