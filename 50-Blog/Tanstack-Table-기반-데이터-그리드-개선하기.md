---
type: blog-post
source: velog
author: "koreanthuglife"
title: "Tanstack Table 기반의 테이블 컴포넌트 개선기"
slug: "Tanstack-Table-기반-데이터-그리드-개선하기"
velogId: "a0017671-1633-4ec6-b6a4-a949b259cb55"
velogUrl: "https://velog.io/@koreanthuglife/Tanstack-Table-기반-데이터-그리드-개선하기"
published: "2025-10-11T10:29:56.544Z"
updated: "2026-02-18T05:00:29.353Z"
tags:
  - "React"
  - "TanStack Table"
description: "Tanstack Table 기반의 테이블 컴포넌트를 개선해 보았습니다."
importedAt: "2026-02-18T07:28:49.893Z"
---

회사에서는 `Tanstack Table`을 사용해 테이블 컴포넌트를 구현해 사용하고 있다. 다만 최근에 이 컴포넌트를 개선하는 작업을 진행했다. 2달 정도의 시간을 투자해 진행했고, 과정에서 600개 가량의 테스트를 작성했다. 앞으로도 다양한 테스트를 추가하며 안전성을 높일 생각이다.

기존 테이블의 문제점은 아래와 같았다:

** 1. `<table>` 태그 사용으로 인한 구조적 한계**
`<table>` 태그는 사용 되어야 하는 명확한 태그 중첩 구조가 존재한다. 그로 인해 칼럼 리사이즈 기능, 가상화, 칼럼 드래그 앤 드롭을 통한 재정렬 기능 등등의 구현에 불필요한 복잡도가 추가되고 있었다.

**2. `Tanstack Table`의 철학과 맞지 않는 테이블 컴포넌트 API 설계**
`Tanstack Table`에서는 제어/비제어 상태가 명확하게 구분되어 있다. 하지만 구현 되어있는 테이블 컴포넌트는 제어/비제어의 관점에서 설계되지 않았고, API도 일관성이 없어 내부 구현을 살펴봐야 올바르게 잘 사용할 수 있었다.

**3. 불필요한 테이블 컴포넌트 내부 상태와 그로 인한 수많은 `useEffect`**
`Tanstack Table`에서 제공하는 테이블 인스턴스가 자체적으로 상태를 관리하고 있음에도 불구하고, `Table` 컴포넌트 내부적으로 또 상태를 관리하고 있었다. 그로 인해 `외부 - Table - Tanstack Table` 3계층의 상태가 존재하게 되었고, 이 3가지 상태값들을 동기화하기 위해 `Table` 컴포넌트 내부에 수많은 `effect`가 존재했다.

이 문제점들을 조금 더 자세히 들여다보고, 어떻게 해결했는지에 대해서 이제부터 자세히 설명해보겠다.

## `<table>` 태그 사용으로 인한 구조적 한계

MDN에서는 `<table>` 태그에 대해 아래와 같이 [설명](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table)하고 있다:

> The `<table>` HTML element represents tabular data—that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.

위 설명처럼 `<table>` 태그는 표 형태의 2차원 데이터를 표현하기 위한 네이티브 DOM 요소다. 그런데 왜 `<table>` 태그로는 구현의 한계가 있을까?

#### 1. 가상화(Virtualization) 구현의 어려움

대용량 데이터를 다루는 DataGrid에서 가상화는 필수적인 기능이다. 수천, 수만 개의 행을 모두 DOM에 렌더링하면 성능이 급격히 저하되기 때문에, 화면에 보이는 영역의 행만 렌더링하는 가상화 기법이 필요하다.

문제는 `<table>` 태그가 브라우저에 의해 특수한 방식으로 렌더링된다는 점이다. 브라우저는 `<table>` 요소에 자동으로 테이블 레이아웃 알고리즘을 적용하여, 각 셀의 크기를 계산하고 행과 열을 정렬한다. 이 과정에서 `<table>` 태그의 display 속성은 `table`로, `<tr>`은 `table-row`로, `<td>`는 `table-cell`로 자동 설정된다.

![](https://velog.velcdn.com/images/koreanthuglife/post/586e904c-e1be-4ffc-8f2f-e91d9268ccb2/image.png)

가상화를 위해서는 절대 위치 지정(absolute positioning)을 사용해 DOM 요소를 원하는 위치에 배치해야 한다. 하지만 테이블 레이아웃에서는 이것이 제대로 동작하지 않는다. 따라서 많은 라이브러리들은 `display` 속성을 강제로 `block`이나 `flex`로 변경하여 테이블의 기본 렌더링 방식을 우회하는 전략을 사용한다:

```css
table {
  display: block;
}

thead, tbody {
  display: block;
}

tr {
  display: flex;
}
```

이는 본질적으로 `<table>` 태그를 사용하면서도 그 본래의 특성을 무력화시키는 것이다. 사실 여기서 부터 그럼 굳이 `<table>`  태그를 사용할 필요가 있을까? 이렇게 렌더링 방식을 우회하는 듯한 전략이 아무런 사이드 이펙트 없이 잘 동작할까? 그런 고민을 하게 되었다.

#### 2. 강제된 DOM 구조로 인한 복잡도 증가
`<table>` 태그의 가장 큰 문제는 강제된 중첩 구조다. 테이블은 반드시 다음과 같은 계층 구조를 따라야 한다:

```html
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

이 구조적 제약은 다음과 같은 테이블 컴포넌트를 구현할 때 심각한 문제를 야기한다:

**칼럼 리사이즈 핸들러**
칼럼 사이에 드래그 가능한 리사이즈 핸들러를 배치하려면, 각 헤더 셀 사이에 핸들러 요소를 삽입해야 한다. `<div>` 기반 구조라면 다음과 같이 간단하게 구현할 수 있다:

```jsx
<div className="header-row">
  <div className="header-cell">Header 1</div>
  <div className="resize-handle" />
  <div className="header-cell">Header 2</div>
  <div className="resize-handle" />
  <div className="header-cell">Header 3</div>
</div>
```

<iframe src="https://claude.site/public/artifacts/5180885c-f5eb-48fc-aa8a-0d76c7a2a09b/embed" title="Claude Artifact" width="100%" height="600" frameborder="0" allow="clipboard-write" allowfullscreen></iframe>

이렇게 하면 헤더와 핸들러가 같은 계층에 있어 CSS로 쉽게 레이아웃을 제어할 수 있다. 하지만 `<table>` 구조에서는 이것이 불가능하다. `<tr>` 안에는 `<th>`나 `<td>`만 들어갈 수 있기 때문이다:

```html
<!-- 이런 구조는 불가능 -->
<tr>
  <th>Header 1</th>
  <div class="resize-handle"></div> <!-- ❌ 허용되지 않음 -->
  <th>Header 2</th>
</tr>
```

리사이즈 핸들러를 각 `<th>` 내부에 absolute position으로 배치하면 안되나? 싶지만 그렇게 했을 때 `<th>` 태그 내부에 리사이즈 핸들러가 존재하게 되면서 스택 컨텍스트 문제를 만나게 된다. 이를 해결하기 위해서는 별도의 오버레이 레이어를 만들어야 한다. 이는 z-index 관리, 이벤트 처리, 포지셔닝 계산 등에서 엄청난 복잡도를 추가한다.

**드래그 앤 드롭 Placeholder**

칼럼 드래그 앤 드롭 시 삽입 위치를 표시하는 placeholder도 마찬가지 문제를 겪는다. `<div>` 기반이라면 원하는 위치에 placeholder를 삽입하기만 하면 된다:

```jsx
<div className="header-row">
  <div className="header-cell">Header 1</div>
  {showPlaceholder && <div className="drop-placeholder" />}
  <div className="header-cell">Header 2</div>
</div>
```

<iframe src="https://claude.site/public/artifacts/5fc4f2a0-48e5-4266-9335-0ac07f5b33ee/embed" title="Claude Artifact" width="100%" height="600" frameborder="0" allow="clipboard-write" allowfullscreen></iframe>

하지만 `<table>` 구조에서는 placeholder를 위한 별도의 `<th>` 셀을 동적으로 삽입하거나, 역시 absolute position을 사용한 오버레이를 만들어야 한다. 이로 인해 아래와 같은 문제가 발생한다:

- Stacking context 관리의 복잡도 증가
- 포지션 계산 로직의 복잡도 증가
- 브라우저 리플로우로 인한 성능 저하
- 예상치 못한 레이아웃 버그 발생 가능성 증가

## Tanstack Table의 철학과 맞지 않는 API 설계
### Tanstack Table의 제어/비제어 철학

Tanstack Table은 **제어(Controlled)와 비제어(Uncontrolled) 패턴을 명확히 구분**하여 설계되었다.

**비제어 모드 (Uncontrolled)**
- 테이블이 자체적으로 상태를 관리
- 초기값만 전달하고 이후는 테이블 내부에서 처리
- 간단한 사용 사례에 적합

**제어 모드 (Controlled)**  
- 상태를 외부에서 완전히 제어
- 상태와 상태 변경 핸들러를 모두 전달
- 복잡한 비즈니스 로직이나 외부 상태 관리가 필요한 경우에 적합

Tanstack Table은 이 두 가지 모드를 일관된 API로 제공한다. 예를 들어 정렬 기능의 경우:

```typescript
// 비제어 모드
useReactTable({
  initialState: {
    sorting: [{ id: 'name', desc: false }]
  }
})

// 제어 모드
const [sorting, setSorting] = useState([])
useReactTable({
  state: {
    sorting
  },
  onSortingChange: setSorting
})
```

이런 일관성 있는 패턴은 개발자가 필요에 따라 상태 관리 방식을 선택할 수 있게 하며, 예측 가능한 동작을 보장한다.

### 기존 API의 문제점

하지만 우리가 구현한 기존 테이블 컴포넌트는 이런 철학을 따르지 않았다. 각 기능마다 제각각의 API를 가지고 있었고, 제어/비제어 개념도 명확하지 않았다:

```typescript
interface TableOptions {
  // 정렬: 초기 상태만 컬럼 정의에서 설정 가능
  sortable?: {
    use?: boolean;
  };
  
  // 선택: 콜백만 있고 상태 제어 불가
  selectable?: {
    use?: boolean;
    mode?: SelectMode;
    display?: SelectDisplay;
    position?: DisplayPosition;
  };
  onRowSelect?: (rows: TableRowData<T>[]) => void;
  
  // 확장: 옵션으로 전체 확장만 가능
  expandable?: {
    use?: boolean;
    expandAll?: boolean;
  };
  
  // 페이지네이션: 이상한 혼합 방식
  pagination?: {
    use?: boolean;
    type?: PaginationType;
    currentPage?: number;  // 이게 제어용인지 초기값인지 불명확
    perPage?: number;
    totalRows?: number;
  };
  onPageChange?: (page: number) => void;
}
```

이 API의 문제점들:

**1. 일관성 없는 상태 관리**
- `sortable`은 컬럼 정의의 `sortOrder`로만 초기값 설정 가능
- `selectable`은 아예 외부 제어 불가능
- `pagination`은 `currentPage`가 제어용인지 초기값인지 모호

**2. 낮은 응집도**
- 관련된 설정이 여러 곳에 흩어짐 (`options`, `onRowSelect`, `onPageChange` 등)
- 기능별 API가 제각각의 구조를 가짐

**3. 외부 제어의 어려움**
실제로 정렬 상태를 외부에서 제어하려면 다음과 같은 고통스러운 과정을 거쳐야 했다:

```typescript
// 기존 방식: 내부 구현을 뜯어봐야 함
function MyComponent() {
  const [columns, setColumns] = useState([
    { id: 'name', sortOrder: 'asc' },  // 초기값은 여기
    { id: 'age' }
  ]);
  
  // 외부에서 정렬을 변경하려면?
  const changeSorting = () => {
    // 컬럼 정의를 직접 수정해야 함 (!)
    setColumns(prev => prev.map(col => 
      col.id === 'name' 
        ? { ...col, sortOrder: 'desc' }
        : col
    ));
  };
  
  // 이것도 실제로는 동작 안 함
  // 내부 구현을 보면 Table 컴포넌트가 마운트 시점의 sortOrder만 읽고
  // 이후 변경사항은 무시함
}
```

또는 Table 컴포넌트 내부에 직접 useEffect를 추가하는 해킹(?)을 해야 했다:

```typescript
// Table 컴포넌트 내부
useEffect(() => {
  // props의 columns 변경을 감지해서
  // 내부 Tanstack Table 인스턴스의 상태를 강제로 업데이트
  const newSorting = extractSortingFromColumns(columns);
  table.setSorting(newSorting);
}, [columns]);
```

### 개선된 API

새로운 API는 Tanstack Table의 철학을 따라 **제어/비제어를 명확히 구분**하고, **일관된 패턴**으로 재설계했다:

```typescript
// 개선된 API (Document 3 참고)
interface TableOptions<T extends object = object> {
  // 정렬
  sortable?: {
    use?: boolean;
    // 비제어: 초기 상태
    initialSorting?: SortingState;
    // 제어: 상태 + 핸들러
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
  };
  
  // 선택
  selectable?: {
    use?: boolean;
    mode?: SelectMode;
    display?: SelectDisplay;
    position?: DisplayPosition;
    // 비제어: 초기 상태
    initialRowSelection?: RowSelectionState;
    // 제어: 상태 + 핸들러
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  };
  
  // 확장
  expandable?: {
    use?: boolean;
    position?: DisplayPosition;
    expandAll?: boolean;
    // 비제어: 초기 상태
    initialExpanded?: ExpandedState;
    // 제어: 상태 + 핸들러
    expanded?: ExpandedState;
    onExpandedChange?: OnChangeFn<ExpandedState>;
  };
  
  // 페이지네이션
  pagination?: {
    use?: boolean;
    type?: PaginationType;
    totalRows?: number;
    // 비제어: 초기 상태
    initialPagination?: PaginationState;
    // 제어: 상태 + 핸들러
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
  };
}
```

개선된 API의 장점:

**1. 명확한 제어/비제어 구분**

```typescript
// 비제어 모드: 간단한 사용
<Table
  options={{
    sortable: {
      use: true,
      initialSorting: [{ id: 'name', desc: false }]
    }
  }}
/>

// 제어 모드: 완전한 외부 제어
function MyComponent() {
  const [sorting, setSorting] = useState([]);
  
  return (
    <Table
      options={{
        sortable: {
          use: true,
          sorting,
          onSortingChange: setSorting
        }
      }}
    />
  );
}
```

**2. 일관된 패턴**
모든 기능이 동일한 구조를 따른다:
- `use`: 기능 활성화 여부
- `initial{Feature}`: 비제어 모드 초기값
- `{feature}`: 제어 모드 상태
- `on{Feature}Change`: 제어 모드 상태 변경 핸들러

**3. 높은 응집도**
관련된 모든 설정이 하나의 옵션 객체 안에 모여있어 이해하기 쉽다.

## 불필요한 테이블 컴포넌트 내부 상태와 그로 인한 수많은 `useEffect`

API 설계가 잘못되다 보니 상태가 3계층으로 나뉘어져 있었다:
- **외부 상태**: 컴포넌트를 사용하는 쪽에서 관리
- **Table 컴포넌트 내부 상태**: 중간 계층
- **Tanstack Table 인스턴스 상태**: 실제 테이블 로직

이 3가지 상태를 동기화하기 위해 불필요한 `useEffect`가 곳곳에 존재했다:

```typescript
// 예시 1: 검색어 동기화
useEffect(() => {
  if (!isBuiltInSearchable(toolbar)) {
    setSearchWord(searchKeyword);  // 외부 → 내부 상태 동기화
  }
}, [toolbar, searchKeyword, setSearchWord]);

// 예시 2: 정렬 상태 동기화
useEffect(() => {
  const newSorting = extractSortingFromColumns(columns);
  table.setSorting(newSorting);  // 내부 → Tanstack Table 동기화
}, [columns]);

// 예시 3: 선택 상태 동기화
useEffect(() => {
  if (externalSelection) {
    setInternalSelection(externalSelection);  // 외부 → 내부
  }
}, [externalSelection]);

useEffect(() => {
  table.setRowSelection(internalSelection);  // 내부 → Tanstack Table
}, [internalSelection]);
```

이런 동기화 로직은:
- **성능 저하**: 불필요한 리렌더링 발생
- **버그 위험**: 동기화 타이밍 이슈로 인해 수많은 무한 리렌더링 이슈가 발생
- **복잡도 증가**: 상태 흐름 추적 어려움

`Tanstack Table`은 내부적으로 외부/내부 상태 동기화를 자동으로 처리한다. 따라서 Table 컴포넌트의 중간 상태를 완전히 제거하고, 외부 상태를 Tanstack Table에 직접 전달하는 방식으로 개선했다:

```typescript
// 개선 후: useEffect 없이 직접 전달
function MyTable() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sorting, setSorting] = useState([]);
  
  return (
    <Table
      options={{
        searchable: {
          use: true,
          searchKeyword,
    	  onSearchKeywordChange: setSearchKeyword
        },
        sortable: {
          use: true,
          sorting,
          onSortingChange: setSorting
        }
      }}
    />
  );
}
```

이렇게 API를 대거 수정하고 테이블 내부 상태를 **모두 제거**하면서, 불필요한 `useEffect`를 모두 제거할 수 있었다. 남아있는 소수의 `useEffect`는 DOM 조작이나 외부 라이브러리 연동 같이 실제로 필요한 사이드 이펙트만 처리한다.

## 느낀점
개인적으로 느낀점이 정말 많았다.

1. 기능 구현 이전에 다양한 레퍼런스를 찾아보며 다른 유명 라이브러리에서는 어떻게 구현했는지 조사하는 과정이 반드시 필요하다는걸 느꼈다.
2. 공통 컴포넌트를 설계할 때 "제어/비제어"만 잘 고려해 설계하면 반은 가겠구나 였다.
3. 테스트도 추상화 수준을 고려해 작성되어야 한다는 것. 세부 구현에 의존하는 테스트는 아주 작은 변경으로도 실패하곤 했다.

요즘은 테스트를 정말 작성하기 쉬워진거 같다. 굳이 내가 테스트를 작성하지 않아도, 이를 검토하며 다사다난하게 테스트와 부딪히다 보니 어떤 테스트가 좋은 테스트인지 명확하게 보여지는 느낌을 받고있는 요즘이다.

자연스럽게 테스트하기 좋은 코드를 작성하려 하는것 또한 긍정적인 신호라고 생각한다.
