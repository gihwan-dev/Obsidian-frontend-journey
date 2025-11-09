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

### 제약 조건
- PK: UNIQUE + NOT NULL, 테이블 당 하나만 생성 가능
- NOT NULL: NULL 입력 방지
- UNIQUE: 중복되는 값 입력 불가
- FK: 외래키로 테이블 당 여러개 생성 가능

### 테이블 생성의 주의사항
- 테이블명은 객체를 의미할 수 있는 적절한 이름을 사용한다. 가능한 단수형을 권고
- 테이블 명은 다른 테이블의 이름과 중복되지 않아야 한다.
- 한 테이블 내에서는 칼럼명이 중복되게 지정될 수 없다.
- 테이블 이름을 지정하고 각 칼럼들은 괄호 "( )"로 묶어 지정한다.
- 각 칼럼들은 콤마 ","로 구분되고, 테이블 생성문의 끝은 항상 세미콜론 ";" 으로 끝난다.
- 칼럼에 대해서는 다른 테이블까지 고려해 데이터베이스 내에서는 일괁성 있게 사용하는 것이 좋다.
- 칼럼 뒤에 데이터 유형은 꼭 지정되어야 한다.
- 테이블명과 칼럼명은 반드시 문자로 시작해야 하고, 벤더별로 길이에 대한 한계가 있다.
- 사전 정의한 예약어는 쓸 수 없다.
- A-Z, a-z, 0-9, _, $, # 문자만 허용된다.

### 외래키
- 테이블 생성시 설정 가능
- 널 값을 가질 수 있음
- 한 테이블에 하나만 존재해야 함
- 외래키 값은 참조 무결성 제약을 받을 수 있음

### 테이블 불필요한 칼럼 삭제
- ALTER TABLE 테이블명 DROP COLUMN 삭제할 칼럼 

### 테이블 이름 변경
- **RENAME** _OLD_OBJECT_NAME_ **TO** _NEW_OBJECT_NAME_


### 테이블 FK 액션
#### Delete(/Modify) Action
1. Cascade: Master 삭제 시 Child 같이 삭제
2. Set Null: Master 삭제 시 Child 해당 필드 Null
3. Set Default: Master 삭제 시 Child 해당 필드 Default 값으로 설정
4. Restrict: Child 테이블에 PK 값이 없는 경우만 Master 삭제 허용
5. No Action: 참조무결성을 위반하는 삭제/수정 액션을 취하지 않음

#### Insert Action
1. Automatic: Master 테이블에 PK가 없는 경우 Master PK를 생성 후 Child 입력
2. Set Null: Master 테이블에 PK가 없는 경우 Child 외부키를 Null 값으로 처리
3. Set Default: Master 테이블에 PK가 없는 경우 Child 외부키를 지정된 기본값으로 입력
4. Dependent: Master 테이블에 PK가 존재할 때만 Child 입력 허용
5. No Action: 참조 무결성을 위반하는 입력 액션을 취하지 않음

### 테이블에 데이터를 입력하는 두 가지 유형
 1. INSERT INTO 테이블명 (COLUMN_LIST) VALUES (COLUMN_LIST에 넣을 VALUE_LIST);
 2. INSERT INTO 테이블명 VALUES (전체 COLUMN에 넣을 VALUE_LIST);

### 테이블에 입력된 데이터의 수정
- UPDATE 테이블명 SET 수정되어야 할 칼럼명 = 수정되기를 원하는 새로운 값;

### 테이블 삭제
- TRUNCATE TABLE 테이블명
- DROP TABLE 테이블명
- DELETE FROM 테이블명

TRUNCATE, DROP은 로그를 남기지 않음

**차이점**
![[Pasted image 20251110080154.png]]

### 테이블에 입력된 데이터 조회
- `SELECT [All /Distinct] 칼럼명1, 칼럼명2 FROM 테이블명;`
	- ALL: 옵션이므로 별도로 표기하지 않아도 됨. 중복된 데이터가 있어도 모두 표기.
	- DISTINCT: 중복된 데이터가 있는 경우 1건을 처리해서 출력

### 트랜잭션의 특성
- **원자성:** 트랜잭션에서 정의된 연산들은 모두 성공적으로 실행되던지 아니면 전혀 실행되지 않은 상태로 남아 있어야 한다. (all or nothing)
- **일관성:** 트랜잭션이 실행되기 전의 데이터베이스 내용이 잘못 되어 있지 않다면 트랜잭션이 실행된 이후에도 데이터베이스의 내용에 잘못이 있으면 안 된다.
- **고립성:** 트랜잭션이 실행되는 도중에 다른 트랜잭션의 영향을 받아 잘못된 결과를 만들어서는 안 된다.
- **지속성:** 트랜잭션이 성공적으로 수행되면 그 트랜잭션이 갱신한 데이터베이스의 내용은 영구적으로 저장된다.

### 트랜잭션에 대한 격리성이 낮은 경우 발생할 수 있는 문제점
1. **Dirty Read:** 다른 트랜잭션에 의해 수정되었지만 아직 커밋되지 않은 데이터를 읽는 것
2. **Non - Repeatable Read:** 한 트랜잭션 내에서 같은 쿼리를 두 번 수행했는데, 그 사이에 다른 트랜잭션이 값을 수정 또는 삭제하는 바람에 두 쿼리 결과가 다르게 나타나는 현상을 말함
3. **Phantom Read:** 한 트랜잭션 내에서 같은 쿼리를 두 번 수행했는데, 첫번째 쿼리에서 없던 유령 레코드가 두번째 쿼리에서 나타나는 현상을 말함

### Oracle vs SQL Server DDL 수행 차이점
- Oracle 에서는 DDL 문장 수행 후 자동으로 COMMIT을 수행
- SQL Server에서는 DDL 문장 수행 후 자동으로 COMMIT하지 않음
- Oracle 에서는 DDL 문장의 수행은 내부적으로 트랜잭션을 종료 시킴
- SQL Server 에서는 CREATE TABLE 문장도 TRANSACTION의 범주에 포함됨. 그러므로 ROLLBACK 문장에 의해 최종적으로 B 테이블은 생성되지 않음