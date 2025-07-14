**문제 상황**: 테이블 컴포넌트 내부에 별도의 상태들이 있는데, 이 상태들로 인해 <외부 - Table - Tanstack Table> 이런 계층 구조로 상태 값들이 생성되고 이를 동기화 하기 위해 불필요한 useEffect가 생성됨. 이 문제를 Table 내부의 상태를 제거하고 <외부 - Tanstack Table> 계층으로 변경해서 상태 관련 로직을 단순화 하고 안정화 하려고함.

**이번 작업 목표**: @src/shared/ui/table/Table.tsx 컴포넌트의 내부 selectedRow 상태 제거 및 상태 관련 값들은 외부에서 전달 받아 바로 tanstack table config로 전달해 자동으로 동기화 되게끔 구성하는것. 내부의 selectedRow 관련 useEffect 및 상태를 제거하는것을 목표로 한다. 제어 상태일 경우에는 외부 상태로 동작하며 비 제어 상태일 경우에는 tanstack table 내부의 자체 로직을 사용해야 한다.

**중요**: 기존의 호환성은 고려하지 않는다. table 폴더 내부의 테스트, 스토리북은 수정한다.

## 작업 필요 내용

1. 내부 selectdRow 상태 제거
2. 내부 selectedRow 관련 useEffect 제거(useTableSelection)
3. rowPining과 동일하게 비제어/제어 상태를 분리해 사용
4. table config에 options.fixable.use 가 true이고 type이 row인 경우 enableSubRowSelection이 true이도록 하는 설정 추가
5. TableProps에 1-depth로 존재하는 onRowSelect 프로퍼티 제거 및 TableOptions의 selctable로 위치를 옮겨 응집도 개선
6. useTableSelection 최종적으로 제거 되어야함
7. 

## 작업 이후 체크 리스트
타입체크 및 lint는 실행할 필요 없어. 구조 수정 작업 모두 완료하고 한 번에 처리할거야.

- [ ] 스토리북 수정
- [ ] 테스트 수정