문제 상황: 테이블 컴포넌트 내부에 별도의 상태들이 있는데, 이 상태들로 인해 <외부 - Table - Tanstack Table> 이런 계층 구조로 상태 값들이 생성되고 이를 동기화 하기 위해 불필요한 useEffect가 생성됨. 이 문제를 Table 내부의 상태를 제거하고 <외부 - Tanstack Table> 계층으로 변경해서 상태 관련 로직을 단순화 하고 안정화 하려고함.

 목표: @src/shared/ui/table/Table.tsx 컴포넌트의 내부 sorting 상태 제거 및 상태 관련 값들은 외부에서 전달 받아 바로 tanstack table config로 전달해 자동으로 동기화 되게끔 구성하는것. 내부의 sorting 관련 useEffect를 제거하는것을 목표로 한다.

## 작업 필요 내용

1. initialSorting 제거
2. 내부 sorting 상태 제거
3. sorting 관련 상태와 dispatcher를 전달받는 props 추가
4. 정렬 관련 상태 및 디스패치 함수를 tanstack table로 바로 전달해서 tanstack table에서 처리해주는 상태 동기화를 사용
5. 정렬 관련 동기화를 위한 useEffect가 있다면 제거
6. tanstack table의 정렬 로직 사용. 이를 오버라이드 하는 로직 파악해서 제거(sortRows 같은)
7. tanstack table의 정렬 로직으로는 구현할 수 없는 특이 사항이 있다면 Table 컴포넌트 최 상단에 주석으로 남겨둬야함. 일단은 Tanstack Table의 정렬을 사용하게 해서 최대한 정렬 관련 로직 단순화 해야함.

