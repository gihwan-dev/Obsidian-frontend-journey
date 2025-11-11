### 순수 관계 연산자와 SQL 문장 비교
**순수 관계 연산자란?**

**SELECT(선택), PROJECT(투영), JOIN(조인), DIVISION(나눗셈)** - 관계형 DB에만 있는 고유 연산자로, 일반 집합 연산자(합/교/차집합)와 구분됨

- SELECT 연산은 WHERE 절로 구현
- PROJECT 연산은 SELECT 절로 구현
- (NATURAL) JOIN 연산은 다양한 JOIN 기능으로 구현
- DIVIDE 연산은 현재 사용되지 않음

### JOIN 의 종류
- `INNER JOIN`: 교집합
- `LEFT JOIN`: 왼쪽 테이블 전부 + 오른쪽 매칭 되는 것
- `RIGHT JOIN`: 오른쪽 테이블 전부 + 왼쪽 매칭되는 것
- `FULL OUTER JOIN`: 양쪽 전부 다

> 참고로 `RIGHT JOIN` === `RIGHT OUTER JOIN`

### 카티시안 곱(Cartesian Product)
두 테이블을 Join 조건 없이 결합하면, 한 쪽 테이블의 모든 행과 다른쪽 테이블의 모든 행이 조합되는 현상

### USING
JOINT시 양 쪽 테이블에 동일한 이름의 칼럼이 있을 때 사용할 수 있는 문법

- `USING T.STADIUM_ID = S>STADIUM_ID` 같은 문법 사용할 수 없음
- `USING(STADIUM_ID)` = 같은 경우 테이블 명 접두사를 붙일 수 없음
	- `T.STADIUM_ID` 같은거는 안됨. `STADIUM_ID`로 써야함.

### CROSS JOIN
테이블 간 JOIN 조건이 없는 경우 생길 수 있는 모든 데이터의 조합을 말함. 결과는 양쪽 `M * N` 건의 데이터 조합이 발생함.


### ON 에서 IN 사용시
모든 행에 대해서 출력을 하되 JOIN 대상을 제한해 해당하지 않는 값에 NULL이 할당됨

