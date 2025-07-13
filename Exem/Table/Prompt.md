**문제 상황**: 테이블 컴포넌트 내부에 별도의 상태들이 있는데, 이 상태들로 인해 <외부 - Table - Tanstack Table> 이런 계층 구조로 상태 값들이 생성되고 이를 동기화 하기 위해 불필요한 useEffect가 생성됨. 이 문제를 Table 내부의 상태를 제거하고 <외부 - Tanstack Table> 계층으로 변경해서 상태 관련 로직을 단순화 하고 안정화 하려고함.

**이번 작업 목표**: @src/shared/ui/table/Table.tsx 컴포넌트의 내부 searchWord 상태 제거 및 상태 관련 값들은 외부에서 전달 받아 바로 tanstack table config로 전달해 자동으로 동기화 되게끔 구성하는것. 내부의 searchWord 관련 useEffect 및 상태를 제거하는것을 목표로 한다. 제어 상태일 경우에는 외부 상태로 동작하며 비 제어 상태일 경우에는 tanstack table 내부의 자체 로직을 사용해야 한다.

**중요**: 가장 먼저 tanstack table의 global filter 문서를 읽고 계획을 세운다. 기존의 호환성은 고려하지 않는다. table 폴더 내부의 테스트, 스토리북은 수정한다.

## 작업 필요 내용

1. 내부 searchWord 상태 제거
2. 내부 searchWord 관련 useEffect 제거
3. rowPining과 동일하게 비제어/제어 상태를 분리해 사용
4. TableProps에 1-depth로 존재하는 searchKeyWord 프로퍼티 제거 및 TableOptions에 searchable 프로퍼티 추가 및 searchKeyWord, onSearchKeyWorkChange, initialSearchKeyword 추가(rowPinning 참고)
5. useTableSearch의 로직이 불필요하게 복잡함. useTableSearch 제거 및 검색시 table.setGlobalFilter 를 직접 사용하도록 수정 
6. useTableSearch 제거
7. TableToolbar가 table를 전달받게 수정
8. TableToolbar 내부의 searchTerm 제거해 TextField가 비제어 컴포넌트로 동작하게 수정
9. TableToolbar의 TextField의 handleKeyDown에서 table.setGlobalFilter 호출
10. tanstack table의 기본 필터링 로직으로 기존의 동작 요구사항을 만족할 수 없는 경우 table/utils/getFilteredRowModel 내부 로직 수정

## 작업 이후 체크 리스트
타입체크 및 lint는 실행할 필요 없어. 구조 수정 작업 모두 완료하고 한 번에 처리할거야.

- [ ] 스토리북 수정
- [ ] 테스트 수정