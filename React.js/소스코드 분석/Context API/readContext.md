초기 마운트 시에는 `useContext`에 `readContext`가 할당된다. 

```ts
export function readContext<T>(context: ReactContext<T>): T {
  return readContextForConsumer(currentlyRenderingFiber, context);
}
```

`readContext` 함수는 `context`를 입력받아 현재 렌더링 중인 `Fiber`와 컨텍스트를 가지고 `readContextForConsumer`를 호출한다.

## readContextForConsumer
```ts
function readContextForConsumer<T>(
  consumer: Fiber | null,
  context: ReactContext<T>,
): T {
  // 현재 렌더러에 따라 적절한 컨텍스트 값을 가져옵니다
  const value = isPrimaryRenderer
    ? context._currentValue
    : context._currentValue2;

  // 컨텍스트 의존성 정보를 생성합니다
  const contextItem = {
    context: ((context: any): ReactContext<mixed>),
    memoizedValue: value,
    next: null,
  };

  if (lastContextDependency === null) {
    // 렌더링 중이 아닌 경우 에러를 발생시킵니다
    if (consumer === null) {
      throw new Error(
        'Context는 React가 렌더링 중일 때만 읽을 수 있습니다. ' +
          '클래스 컴포넌트에서는 render 메서드나 getDerivedStateFromProps에서 읽을 수 있습니다. ' +
          '함수 컴포넌트에서는 함수 본문에서 직접 읽을 수 있지만, ' +
          'useReducer()나 useMemo()와 같은 Hooks 내부에서는 읽을 수 없습니다.',
      );
    }

    // 첫 번째 의존성인 경우 새로운 리스트를 생성합니다
    lastContextDependency = contextItem;
    consumer.dependencies = {
      lanes: NoLanes,
      firstContext: contextItem,
    };
    consumer.flags |= NeedsPropagation;
  } else {
    // 기존 의존성 리스트에 새로운 컨텍스트 항목을 추가합니다
    lastContextDependency = lastContextDependency.next = contextItem;
  }
  return value;
}
```

1. 현재 렌더러에 따라 적절한 컨텍스트 값을 가져다.
2. 컨텍스트 의존성 정보를 생성한다.
3. 첫 번째 의존성인 경우 새로운 리스트를 생성하고, 그렇지 않은 경우 기존 리스트에 추가한다.
4. 컨텍스트 값이 변경되었을 때 필요한 업데이트를 위해 NeedsPropagation 플래그를 설정한다.

이 함수는 `React`의 `Context API`가 내부적으로 어떻게 동작하는지 보여주는 중요한 부분다. 컴포넌트가 컨텍스트를 구독할 때 이 함수를 통해 의존성 정보를 관리하고, 컨텍스트 값이 변경될 때 적절한 업데이트를 트리거하는 역할을 한다.

### contextItem 변수의 next 필드
이 부분은 React의 Context 시스템에서 의존성 관리를 위한 링크드 리스트(Linked List) 구조를 구현하는 부분입니다. 각 필드에 대해 자세히 설명하겠다:

`next`는 링크드 리스트의 다음 노드를 가리키는 포인터이다. 이 필드를 통해 여러 Context 의존성을 연결할 수 있다.

이 구조가 사용되는 방식은 다음과 같다:

```javascript
// 첫 번째 Context 의존성 추가
lastContextDependency = contextItem;
consumer.dependencies = {
  lanes: NoLanes,
  firstContext: contextItem,  // 첫 번째 의존성
};

// 두 번째 Context 의존성 추가
lastContextDependency = lastContextDependency.next = contextItem2;
// 이제 firstContext -> contextItem -> contextItem2 순서로 연결됨
```

이렇게 링크드 리스트 구조를 사용하는 이유는:
1. 컴포넌트가 여러 Context를 구독할 수 있기 때문이다
2. 동적으로 의존성을 추가/제거할 수 있어야 하기 때문이다
3. 메모리 효율적으로 의존성을 관리할 수 있기 때문이다

예를 들어, 다음과 같은 컴포넌트가 있다고 가정해보겠다:
```jsx
function MyComponent() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const locale = useContext(LocaleContext);
  // ...
}
```

이 경우 `MyComponent`의 Fiber 노드에는 세 개의 Context 의존성이 링크드 리스트로 연결되어 저장된다. 이렇게 하면 Context 값이 변경되었을 때 어떤 컴포넌트를 업데이트해야 하는지 효율적으로 추적할 수 있습니다.
이 부분은 React의 Context 시스템에서 의존성 관리를 위한 링크드 리스트(Linked List) 구조를 구현하는 부분입니다. 각 필드에 대해 자세히 설명하겠습니다:

1. `context`: 현재 구독하고 있는 Context 객체를 참조합니다. TypeScript 타입 캐스팅을 통해 `ReactContext<mixed>` 타입으로 변환합니다.

2. `memoizedValue`: 현재 Context의 값을 저장합니다. 이 값은 나중에 Context가 변경되었는지 비교하는 데 사용됩니다.

3. `next`: 링크드 리스트의 다음 노드를 가리키는 포인터입니다. 이 필드를 통해 여러 Context 의존성을 연결할 수 있습니다.

이 구조가 사용되는 방식은 다음과 같습니다:

```javascript
// 첫 번째 Context 의존성 추가
lastContextDependency = contextItem;
consumer.dependencies = {
  lanes: NoLanes,
  firstContext: contextItem,  // 첫 번째 의존성
};

// 두 번째 Context 의존성 추가
lastContextDependency = lastContextDependency.next = contextItem2;
// 이제 firstContext -> contextItem -> contextItem2 순서로 연결됨
```

이렇게 링크드 리스트 구조를 사용하는 이유는:
1. 컴포넌트가 여러 Context를 구독할 수 있기 때문입니다
2. 동적으로 의존성을 추가/제거할 수 있어야 하기 때문입니다
3. 메모리 효율적으로 의존성을 관리할 수 있기 때문입니다

예를 들어, 다음과 같은 컴포넌트가 있다고 가정해보겠습니다:
```jsx
function MyComponent() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const locale = useContext(LocaleContext);
  // ...
}
```

이 경우 `MyComponent`의 Fiber 노드에는 세 개의 Context 의존성이 링크드 리스트로 연결되어 저장됩니다. 이렇게 하면 Context 값이 변경되었을 때 어떤 컴포넌트를 업데이트해야 하는지 효율적으로 추적할 수 있습니다.
