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