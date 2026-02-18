---
type: blog-post
source: velog
author: "koreanthuglife"
title: "React의 Context API 뜯어보기"
slug: "React의-Context-API-뜯어보기"
velogId: "6e291ff2-8f85-4ee3-b6d8-7713137f7518"
velogUrl: "https://velog.io/@koreanthuglife/React의-Context-API-뜯어보기"
published: "2025-04-06T05:51:34.814Z"
updated: "2026-02-14T17:05:46.611Z"
tags:
  - "React"
description: "Context API는 어떻게 동작할까? 렌더링 시나리오를 통해 내부 동작을 알아보자."
importedAt: "2026-02-18T07:28:49.893Z"
---

React 개발자라면 누구나 한 번쯤은 `Cotext API`를 사용해 봤을 것이다. 하지만 많은 개발자들이 `Context API`를 단순히 상태 관리 도구로 생각하고 있는 경우가 많다. 오늘은 이에 대해 얘기하고, **Context API의 진짜 목적과 내부 구현**을 파헤쳐 보려 한다.

## Context API란 무엇일까?

나는 **Context API가 상태 관리 도구보다는 의존성 주입(Dependency Injection) 도구라 생각했다**. 적어도 상태 관리 도구라 생각하는 것보다는 좋은 답변이라 생각한다. 다만 이 글의 결론에도 적어뒀지만, 이 글을 적으며 그 관점에 변화가 생겼다. 내부 동작을 분석하며 **의존성 주입의 도구에 그치지 않고 컴포넌트 렌더링 사이클과 동기화시켜 안정적으로 사용할 수 있게 관리해주는 API** 정도의 개념으로 이해하게 되었다. 이 이유에 대해서는 **결론** 부분에 자세히 적어뒀다.

React의 기본 데이터 흐름은 부모에서 자식으로 `props`를 통해 전달되는 **단방향**이다. 그러나 여러 중첩 레벨에 걸쳐 동일한 데이터를 전달해야 하는 경우(예: 테마, 언어 설정, 인증 정보 등) 이 방식은 번거로워진다. `Context API`는 이런 **"prop drilling"** 문제를 해결하기 위한 도구다.

React 공식 문서에서도 `Context`는 "컴포넌트 트리를 통해 데이터를 명시적으로 전달하지 않고도 공유할 수 있는 방법"이라고 설명한다. 여기서 핵심은 **"데이터 공유"**이지 **"상태 관리"**가 아니다.

![](https://velog.velcdn.com/images/koreanthuglife/post/44ed1820-e031-4e10-b591-8627dc44d8ee/image.png)

위 그림에서 `currentValue`는 뭔지 `valueStack`은 무엇인지 복잡해보이는 `Context` 구조에 의문이 들 수 있다. 왜 내가 이런 형태의 그림을 그렸는지는 함께 `Context API`의 세부 구현을 뜯어보다보면 알게 될거라 생각한다.

## 시나리오로 살펴보는 Context API의 동작 원리

Context API의 내부 동작을 이해하기 위해 실제 시나리오를 통해 단계별로 살펴보자. 아래와 같은 간단한 카운터 예제를 기준으로 설명하겠다:

```tsx
import {createContext, useContext, useState} from 'react'

// 1. Context 생성
const CounterContext = createContext<{
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

// 2. 중첩된 카운터 컴포넌트
const NestedCounter = () => {
  const context = useContext(CounterContext);
  
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  
  const { count, setCount } = context;
  
  return (
    <div>
      <h2>Nested Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
};

// 3. 메인 카운터 컴포넌트
const Counter = () => {
  const context = useContext(CounterContext);
  const [localCount, setLocalCount] = useState(20);
  
  if (!context) {
    throw new Error("Context must be used within a Provider");
  }
  
  const { count, setCount } = context;
  
  return (
    <div>
      <h1>Main Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      
      {/* 중첩된 Provider */}
      <CounterContext.Provider value={{
        count: localCount,
        setCount: setLocalCount
      }}>
        <NestedCounter />
      </CounterContext.Provider>
    </div>
  );
};

// 4. 앱 컴포넌트
function App() {
  const [count, setCount] = useState(0);
  
  return (
    <CounterContext.Provider value={{count, setCount}}>
      <Counter />
    </CounterContext.Provider>
  );
}
```

이제 이 코드가 실행될 때 내부적으로 어떤 일이 일어나는지 순서대로 살펴보자.

### 1단계: createContext 호출 시점

```tsx
const CounterContext = createContext<{
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);
```

`createContext`의 내부 구현은 다음과 같다.

```tsx
export function createContext<T>(defaultValue: T): ReactContext<T> {
  // TODO: 두 번째 인자로 사용되던 선택적 'calculateChangedBits' 함수에 대한 경고를 
  // 미래 사용을 위해 예약해두어야 할까?

  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    // 여러 동시 렌더러를 지원하기 위한 해결책으로,
    // 일부 렌더러를 primary(주)로, 나머지를 secondary(부)로 분류합니다.
    // 최대 두 개의 동시 렌더러만 예상됩니다:
    // - React Native(주)와 Fabric(부)
    // - React DOM(주)와 React ART(부)
    // 부 렌더러들은 context 값을 별도의 필드에 저장합니다.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // 단일 렌더러 내에서 현재 context가 지원하는 동시 렌더러 수를 추적합니다.
    // 예: 병렬 서버 렌더링
    _threadCount: 0,
    // 순환 참조를 위한 필드들
    Provider: (null: any),
    Consumer: (null: any),
  };

  if (enableRenderableContext) {
    context.Provider = context;
    context.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: context,
    };
  } else {
    (context: any).Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context,
    };
    (context: any).Consumer = context;
  }
  
  return context;
}
```

`createContext`는 단순하게 `Contexct` 타입의 리액트 엘리먼트를 생성해 반환한다. 이 과정에서 리액트의 버전에 따라 `Provider`가 `Context` 그 자체가 되거나, `Consumer`가 `Context` 그 자체가 된다(레거시).

중요한 포인트는 `Context` 타입의 리액트 요소를 생성해 반환하고, `defaultValue`를 `_currentValue` 필드에 저장한다는 것이다. 즉, 요약하면 다음과 같다:

1. `CounterContext` 객체가 생성된다.
2. `_currentValue`와 `_currentValue2`에 기본값 `null`이 설정된다.
3. `Provider`와 `Consumer` 속성이 설정된다. (최신 React에서는 일반적으로 `enableRenderableContext = true`)
4. 이 시점에서 **아직 값이 주입되지 않았다**. 단지 Context 객체가 생성되었을 뿐이다.

![](https://velog.velcdn.com/images/koreanthuglife/post/9109bcd7-3c1c-4497-970f-ec6ed7411129/image.png)

### 2단계: 첫 번째 Provider 마운트 시점 (App 컴포넌트)

```tsx
<CounterContext.Provider value={{count, setCount}}>
  <Counter />
</CounterContext.Provider>
```

`App` 컴포넌트가 렌더링되면서 첫 번째 `Provider`가 마운트될 때 React는 `beginWork` 함수에서 `updateContextProvider` 함수를 호출한다:

```tsx
function updateContextProvider(current, workInProgress, renderLanes) {
  let context = workInProgress.type;  // CounterContext
  const newProps = workInProgress.pendingProps;
  const newValue = newProps.value;    // {count: 0, setCount: function}
  
  // Provider 값 설정
  pushProvider(workInProgress, context, newValue);
  
  // 자식 노드 처리
  const newChildren = newProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  return workInProgress.child;
}
```

우선 각 변수 및 파라미터에 대해 알아보자:

- `current`: 현재 렌더링 되어있는 `Fiber`노드(즉, 구버전의 `Fiber` 노드)
- `workInProgress`: 현재 렌더링을 진행하고 있는 `Fiber`노드(즉, 새버전의 `Fiber` 노드)
- `newValue`: `Provider`의 `value`로 전달한 값(`count`, `setCount`)

핵심은 `pushProvider` 함수다:

```tsx
export function pushProvider<T>(
  providerFiber: Fiber,
  context: ReactContext<T>,
  nextValue: T,
): void {
  if (isPrimaryRenderer) {
    // 1. 현재 값을 스택에 저장
    push(valueCursor, context._currentValue, providerFiber);
    // 2. 새 값으로 업데이트
    context._currentValue = nextValue;  // {count: 0, setCount: function}
  } else {
    // 보조 렌더러 처리 (React Native 등)
    push(valueCursor, context._currentValue2, providerFiber);
    context._currentValue2 = nextValue;
  }
}

function push<T>(cursor: StackCursor<T>, value: T, fiber: Fiber): void {
  index++;  // 스택 포인터 증가
  valueStack[index] = cursor.current;  // 이전 값(null)을 스택에 저장
  cursor.current = value;  // 커서 값 업데이트
}
```

보다싶이 `valueStack`이라는 **스택** 자료구조에, `Provider`에서 전달받은 값을 저장하고, `Context`의 `currentValue` 값을 새로운 값으로 갱신한다.

이 과정을 통해:
1. `valueStack`에 이전 값(`null`)이 저장된다.
2. `CounterContext._currentValue`가 `{count: 0, setCount: function}`으로 설정된다.

이렇게 `Provider`는 해당 `Context`의 현재 값을 설정하고, 이전 값을 스택에 저장하는 역할을 한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/5564d3fe-8934-46dd-a6d7-a98425513020/image.png)

### 3단계: 첫 번째 useContext 호출 시점 (Counter 컴포넌트)

```tsx
const context = useContext(CounterContext);
```

Counter 컴포넌트가 렌더링될 때 `useContext` 훅이 호출되면, React는 내부적으로 `readContext` 함수를 호출한다:

```tsx
export function readContext<T>(context: ReactContext<T>): T {
  return readContextForConsumer(currentlyRenderingFiber, context);
}

function readContextForConsumer<T>(
  consumer: Fiber | null,
  context: ReactContext<T>,
): T {
  // 1. 현재 렌더러에 맞는 값 가져오기
  const value = isPrimaryRenderer
    ? context._currentValue  // {count: 0, setCount: function}
    : context._currentValue2;

  // 2. 컴포넌트와 Context 간의 의존성 등록
  const contextItem = {
    context: ((context: any): ReactContext<mixed>),
    memoizedValue: value,
    next: null,
  };

  if (lastContextDependency === null) {
    // 첫 번째 의존성인 경우
    lastContextDependency = contextItem;
    consumer.dependencies = {
      lanes: NoLanes,
      firstContext: contextItem,
    };
    consumer.flags |= NeedsPropagation;
  } else {
    // 추가 의존성인 경우
    lastContextDependency = lastContextDependency.next = contextItem;
  }
  
  return value;  // {count: 0, setCount: function} 반환
}
```

이 과정에서 일어나는 일:
1. `CounterContext._currentValue`에서 현재 값(`{count: 0, setCount: function}`)을 읽어온다.
2. `Counter` 컴포넌트와 `CounterContext` 간의 의존성이 등록된다.
3. 이 의존성 정보는 나중에 `Context` 값이 변경될 때 어떤 컴포넌트를 리렌더링할지 결정하는 데 사용된다.

여기서 중요한 점은 **의존성 추적**이다. React는 어떤 컴포넌트가 어떤 `Context`를 사용하는지 추적하여, `Context` 값이 변경될 때 해당 컴포넌트만 효율적으로 리렌더링할 수 있다. 컨텍스트의 값을 읽는것 자체는 단순히 `Context`의 `_currentValue` 값을 반환할 뿐이다.

![](https://velog.velcdn.com/images/koreanthuglife/post/e2873f80-4114-4672-89d3-477a12a8fe73/image.png)

### 4단계: 두 번째 Provider 마운트 시점 (Counter 컴포넌트 내부)

```tsx
<CounterContext.Provider value={{
  count: localCount,
  setCount: setLocalCount
}}>
  <NestedCounter />
</CounterContext.Provider>
```

`Counter` 컴포넌트 내부에 중첩된 `Provider`가 렌더링될 때, 다시 `updateContextProvider`와 `pushProvider` 함수가 호출된다:

```tsx
// pushProvider의 동작
// 1. 현재 값({count: 0, setCount: function})을 스택에 저장
push(valueCursor, context._currentValue, providerFiber);
// 2. 새 값으로 업데이트
context._currentValue = {count: 20, setCount: setLocalCount};
```

이제 `valueStack`과 `_currentValue`의 상태는 다음과 같다:
- `valueStack`: [`null`, `{count: 0, setCount: function}`]
- `CounterContext._currentValue`: `{count: 20, setCount: setLocalCount}`

이처럼 중첩된 `Provider`는 `Context` 값을 오버라이드하며, 이전 값은 스택에 보존된다.

![](https://velog.velcdn.com/images/koreanthuglife/post/0b2c3a71-9ea6-45d4-894d-40710177fc00/image.png)

### 5단계: 두 번째 useContext 호출 시점 (NestedCounter 컴포넌트)

```tsx
const context = useContext(CounterContext);
```

`NestedCounter` 컴포넌트에서 `useContext`가 호출되면, 다시 `readContext` 함수가 실행된다:

```tsx
// readContextForConsumer의 동작
const value = isPrimaryRenderer
  ? context._currentValue  // {count: 20, setCount: setLocalCount}
  : context._currentValue2;
```

이 시점에서 `CounterContext._currentValue`는 가장 가까운 `Provider`에서 설정한 값인 `{count: 20, setCount: setLocalCount}`이므로, `NestedCounter`는 이 값을 사용한다.

동시에 `NestedCounter` 컴포넌트와 `CounterContext` 간의 의존성도 등록된다.

![](https://velog.velcdn.com/images/koreanthuglife/post/56980002-dbb7-4916-bd7a-b11734c3116b/image.png)

### 6단계: 두 번째 Provider 언마운트 시점

`Counter` 컴포넌트가 언마운트되거나 리렌더링될 때, 중첩된 `Provider`도 언마운트된다. 이때 `popProvider` 함수가 호출된다:

```tsx
export function popProvider(context: ReactContext<any>): void {
  if (isPrimaryRenderer) {
    pop(valueCursor); // valueStack에서 이전 값 복원
    context._currentValue = valueCursor.current;
  } else {
    pop(valueCursor);
    context._currentValue2 = valueCursor.current;
  }
}

function pop<T>(cursor: StackCursor<T>): void {
  cursor.current = valueStack[index];  // {count: 0, setCount: function}
  valueStack[index] = null;
  index--;
}
```

이 과정을 통해:
1. `valueStack`에서 이전 값(`{count: 0, setCount: function}`)을 꺼낸다.
2. `CounterContext._currentValue`를 이전 값으로 복원한다.
3. `valueStack`의 상태: [`null`]

이렇게 `Provider`가 언마운트되면 스택에서 이전 값을 복원하여 `Context` 값의 계층 구조를 유지한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/783c9c20-81c8-40ba-886f-8e00780f10b3/image.png)

## Context의 데이터 구조와 핵심 메커니즘

지금까지 살펴본 시나리오를 바탕으로 `Context API`의 핵심 메커니즘을 정리해보자.

### valueStack: 중첩된 Provider 관리

React는 `valueStack`이라는 배열을 사용하여 중첩된 `Provider`의 값들을 관리한다:

```tsx
const valueStack: Array<any> = [];
let index = -1;
```

이 스택은 LIFO(Last-In-First-Out) 방식으로 작동한다:
- `Provider`가 마운트될 때: 이전 값이 스택에 저장되고, 새 값이 설정된다.
- `Provider`가 언마운트될 때: 스택에서 이전 값을 꺼내어 복원한다.

이러한 스택 기반 구조 덕분에 중첩된 `Provider`가 올바르게 동작할 수 있다.

![](https://velog.velcdn.com/images/koreanthuglife/post/13d04c97-202b-4bd9-9b79-c3e1f8cda86b/image.png)

### 의존성 추적: 링크드 리스트 구조

컴포넌트가 `Context`를 소비할 때, React는 의존성을 링크드 리스트 형태로 추적한다:

```tsx
const contextItem = {
  context: context,
  memoizedValue: value,
  next: null
};
```

여러 `Context`를 사용하는 경우, 이 의존성들은 **링크드 리스트**로 연결된다:

```tsx
// 첫 번째 의존성
lastContextDependency = contextItem1;
consumer.dependencies = {
  firstContext: contextItem1
};

// 두 번째 의존성
lastContextDependency = lastContextDependency.next = contextItem2;
// 결과: contextItem1 -> contextItem2
```

이러한 의존성 추적 덕분에:
1. `Context` 값이 변경될 때 해당 `Context`를 사용하는 컴포넌트만 리렌더링된다.
2. 컴포넌트가 여러 `Context`를 사용해도 모든 의존성을 효율적으로 관리할 수 있다.

## 결론

나는 `Context API`를 **의존성 주입**도구라 생각했다. 다만 이번에 내부 구현을 동작하며 조금은 달리 생각하게 되었다. 어쩌면 전역 변수나, 외부 의존성을 주입해주고, 내가 원하는 범위 만큼의 리액트 라이프 사이클과 동기화 시키며, **사이드 이펙트를 대신 관리해주는 역할**로 생각하게 되었다. 그도 그럴게 `Provider`는 단순히 `_currentValue`라는 값을 업데이트 하고, 업데이트 히스토리를 관리하는 역할을 하며, `useContext`는 컴포넌트와 `Context`간의 의존 관계를 관리하고, 단순히 `Context`의 `_currentValue`값을 반환하는 함수이기 때문이다.

다만 `valueStack`을 통해 `Provider`의 상태에 따른 적절한 값을 읽을 수 있게 관리하며, `linked-list` 기반의 의존성 추적을 통해 의존하는 컴포넌트가 적절히 리렌더링 될 수 있도록 해준다. 그렇기에 **의존성 주입**도구에서 **의존성 주입 그 이상의 무언가** 라는 관점의 변화가 생긴거 같다.

이게 옳바른 방향인지 아닌지는 아직 잘 모르겠다. 여전히 고민하고 있고, 고민해 봐야 알것만 같다.
