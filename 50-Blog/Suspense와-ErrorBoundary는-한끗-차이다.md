---
type: blog-post
source: velog
author: "koreanthuglife"
title: "Suspense와 ErrorBoundary는 한끗 차이다"
slug: "Suspense와-ErrorBoundary는-한끗-차이다"
velogId: "26032800-bf0b-4cd0-9be3-83821ffa19e9"
velogUrl: "https://velog.io/@koreanthuglife/Suspense와-ErrorBoundary는-한끗-차이다"
published: "2025-03-15T08:37:33.839Z"
updated: "2026-02-16T20:25:52.730Z"
tags:
  - "React"
description: "Suspense, ErrorBoundary와 useQuery, useSusepense 쿼리의 동작 특성을 파악해보자"
importedAt: "2026-02-18T07:28:49.893Z"
---

최근 회사에서 차세대 프로젝트를 진행하고 있다. 그러던 중 회사 동료가 이런 질문을 했다.

![](https://velog.velcdn.com/images/koreanthuglife/post/39ab35dc-024b-427f-9425-c902edf7f0ad/image.png)

이전에도 `Tanstack Query`를 사용하며 이러한 문제를 겪었고, 당시에 내가 생각했던 문제의 원인과 해결책을 공유했다.

![](https://velog.velcdn.com/images/koreanthuglife/post/e36a57a3-24bd-4aad-a4ea-4f7176234e67/image.png)

나는 `use` 훅을 보고 `useSuspenseQuery` 내부적으로 `use`를 쓴다고 **혼자 멋대로 생각**했다. 회사에 재직해 비즈니스를 다루는 개발자가 된 지금은 이런식으로 근거를 내리고 판단해서는 안된다는 생각이 들었다. 그래서 `useSuspenseQuery`의 내부 동작을 알아보았고, 그 과정에서 리액트에서 `ErrorBoudary`와 `Suspense`가 어떻게 동작하는지, 그리고 `use`훅은 어떻게 구현되어 있는지 등을 알게되었다. 오늘은 이 내용에 대해 공유해보려 한다.

## ErrorBoundary와 Suspense의 처리

우선 `ErrorBoundary`에 대해서 먼저 알아보자. 그 과정에서 `Suspense`가 처리되는 방식에 대해 자연스럽게 알게 될것이다. 리액트에서 `ErrorBoundary`는 라이브러리를 설치해 사용할 수 있지만, 다음과 같이 직접 `Class` 컴포넌트를 사용해 구현할수도 있다:
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

이를 봤을때 유추해볼 수 있는것은 렌더링 과정 중에 에러가 발생하면 이를 `try ... catch ...` 의 `catch` 블록에서 컴포넌트의 `componentDidCatch`와 `getDerivedStateFromError` 메서드가 호출될거라고 예상 해볼 수 있다. 

그래서 렌더링을 시작하는 함수를 찾아봤다. 아래는 렌더링을 시작하는 함수인 `renderRootConcurrent` 함수의 `try ... catch ...` 블록이다:

```tsx
  	try {
      // 렌더링 관련 로직들
	} catch (thrownValue) {
      handleThrow(root, thrownValue);
    }
```

어떤 값이 `throw`되면 그 값(`thrownValue`)과 함께 `handleThrow` 함수를 호출한다. 그런데 왜 `thrownValue` 일까? `error` 같은 네이밍도 가능한데 왜 `thrownValue`이며, `handleThrow`라는 시그니쳐를 가진 함수를 호출할까? 이에 대해 살펴보자. `handleThrow` 함수는 다음과 같은 주석으로 시작한다:

```tsx
function handleThrow(root: FiberRoot, thrownValue: any): void {
  // 컴포넌트에서 예외가 발생했습니다. 주로 비동기 작업으로 인한 일시 중단이거나
  // 일반적인 코드 오류일 수 있습니다.
  //
  // 이제 두 가지 선택이 있습니다: 
  // 1) Suspense나 에러 경계를 보여주기 위해 작업을 중단하거나 
  // 2) 프로미스가 해결된 후처럼 컴포넌트를 다시 실행하는 것입니다.
  //
  // 어떤 방식으로 처리할지 결정하기 전까지는 현재 작업 상태를
  // 그대로 유지하고 아무것도 초기화하지 않아야 합니다.
  //
  // 만약 작업을 중단하기로 결정하면, 관련된 전역 변수들은
  // 별도의 정리 과정에서 초기화될 것입니다.

  // 아래 변수들은 즉시 초기화해야 합니다. 이 변수들은 리액트가
  // 사용자 코드를 실행할 때만 설정되어야 하기 때문입니다.
  ...
}
```

이 주석을 보면 알겠지만 `handleThrow` 라는 함수는 **에러 경계 처리** 뿐만 아니라 **`Suspense` 처리**도 함께 한다는 것을 알 수 있다. 그럼 리액트는 어떻게 **에러 경계 처리**를 해야할지 **`Suspense` 처리**를 해야할지를 판별할까? 아래는 `handleThrow`의 코드 일부분이다. 주석과 함께 **큰 흐름만** 이해해보자:

```tsx
if (
  thrownValue === SuspenseException ||
  thrownValue === SuspenseActionException
) {
  // 이것은 Suspense를 위한 특별한 예외 유형입니다. 역사적인 이유로,
  // Suspense 구현은 던져진 값이 thenable이기를 기대합니다.
  // 과거에는 프로미스를 직접 던지는 방식이었으나, 현재는 `use` 훅을 통한
  // 더 안정적인 API로 대체되고 있습니다.
  thrownValue = getSuspendedThenable();
  workInProgressSuspendedReason =
    !enableSiblingPrerendering &&
    shouldRemainOnPreviousScreen() &&
    !includesNonIdleWork(workInProgressRootSkippedLanes) &&
    !includesNonIdleWork(workInProgressRootInterleavedUpdatedLanes)
      ? // 데이터가 해결될 때까지 작업 루프 일시 중단
        thrownValue === SuspenseActionException
        ? SuspendedOnAction
        : SuspendedOnData
      : // 작업 루프를 일시 중단하지 않고, 데이터가 즉시 해결되었는지만 확인
        // 그렇지 않으면 가장 가까운 Suspense 폴백을 활성화
        SuspendedOnImmediate;
} else if (thrownValue === SuspenseyCommitException) {
  thrownValue = getSuspendedThenable();
  workInProgressSuspendedReason = SuspendedOnInstance;
} else if (thrownValue === SelectiveHydrationException) {
  // 탈수(dehydrated) 경계로 업데이트가 흘러들어왔습니다. 업데이트를
  // 적용하기 전에 수화(hydration)를 완료해야 합니다. 
  // 현재 진행 중인 렌더링을 중단하고 수화 레인에서 다시 시작합니다.
  //
  // 이상적으로는 현재 스택을 풀지 않고도 컨텍스트를 전환할 수 있어야 하지만,
  // 현재로서는 이 방식이 필요한 유일한 경우입니다.
  workInProgressSuspendedReason = SuspendedOnHydration;
} else {
  // 이것은 일반적인 오류입니다.
  const isWakeable =
    thrownValue !== null &&
    typeof thrownValue === 'object' &&
    typeof thrownValue.then === 'function';

  workInProgressSuspendedReason = isWakeable
    ? // wakeable 객체는 레거시 Suspense 구현에서 던져진 것으로,
      // `use` 훅을 통한 일시 중단과는 살짝 다른 동작을 합니다.
      SuspendedOnDeprecatedThrowPromise
    : // 일반 오류입니다. 컴포넌트에서 이미 다른 작업이 일시 중단된 경우,
      // 작업 루프의 차단을 해제하기 위해 thenable 상태를 정리해야 합니다.
      SuspendedOnError;
}
```

이처럼 리액트는 던져진 값(`thrownValue`)의 타입을 확인하여 **각각 다른 처리 방식**을 적용한다:

1. **Suspense 관련 예외 처리**
   리액트는 `SuspenseException`이나 `SuspenseActionException`이 던져지면 이를 `Suspense` 관련 처리로 인식한다. 이전에는 프로미스(thenable)를 직접 던지는 불안정한 API를 사용했지만, 지금은 `use` 훅을 통해 더 안정적인 API를 제공한다. 여러 조건을 확인한 후 적절한 `Suspense` 상태(`SuspendedOnAction, SuspendedOnData, SuspendedOnImmediate` 등)로 설정한다.

2. **커밋 단계의 Suspense 처리**
   `SuspenseyCommitException`이 던져지면, 인스턴스 관련 일시 중단으로 처리한다. 이는 `SuspendedOnInstance` 상태로 설정된다.

3. **하이드레이션 관련 예외 처리**
   `SelectiveHydrationException`이 발생하면, 탈수(dehydrated) 경계로 업데이트가 흘러들어온 상황을 의미한다. 이 경우 업데이트를 적용하기 전에 수화(hydration)를 완료해야 하므로, 진행 중인 렌더링을 중단하고 수화 레인에서 다시 시작하도록 한다. 이는 `SuspendedOnHydration` 상태로 설정된다.

4. **일반 오류 처리**
   위의 특수 예외가 아닌 경우, 일반 오류로 간주한다. 다만, 던져진 값이 'wakeable' 객체인지 확인한다(**null이 아니고, 객체이며, then 메서드가 있음**). `wakeable` 객체는 레거시 `Suspense` 구현에서 던져진 것으로, `use` 훅을 통한 일시 중단과는 살짝 다른 동작을 한다. 이 경우 `SuspendedOnDeprecatedThrowPromise` 상태로 설정한다. 그 외에는 일반 오류로 `SuspendedOnError` 상태가 되며, 이미 일시 중단된 컴포넌트가 있다면 작업 루프의 차단을 해제하기 위해 thenable 상태를 정리한다.

이렇게 리액트는 던져진 예외의 타입을 검사하여 `Suspense` 관련 처리인지, 일반 에러 처리인지를 구분한다. 그리고 각 상황에 맞는 처리 상태(`SuspendedOnData, SuspendedOnError` 등)를 설정하여 이후 렌더링 과정에서 적절히 대응할 수 있도록 한다.

이걸 보다보니 그런 생각이 들었다. 

> "그럼 `use`훅이나 `useSuspenseQuery`를 사용하지 않아도 `Promise`를 던지거나 `then` 메서드를 포함하는 객체를 던지면 `Suspense`의 Fallback 기능을 활용할 수 있지 않을까?

## 다양한 방식으로 Suspense 활용하기

내가 파악한 `Suspense`의 Fallback을 활성화 할 수 있는 방식은 3가지였다.

1. `Promise`를 `throw` 한다.
2. `use` 훅을 사용한다.
3. `then` 메서드를 가진 객체를 `throw` 한다.

그래서 직접 실험해봤다. `React` 프로젝트를 생성하고 다음과 같은 코드를 작성했다. 따로따로 설명할 예정이니 자세히 보지 않아도 좋다:
```tsx
"use client";

import React, {Suspense, use, useState} from 'react';

// 데이터를 저장할 전역 스토어
const store = {
    "throwPromise": {
        data: null,
    },
    "useHooks": {
        data: null,
    },
    "customThenable": {
        data: null,
    },
}

// 데이터를 가져오는 함수 - 실제로는 API 호출이 될 수 있습니다
const fetchData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('데이터가 로드되었습니다!');
        }, 2000); // 2초 지연
    });
};

// 1. "레거시" 방식: promise를 직접 throw하는 컴포넌트
function DataLoaderLegacy() {
    let fetchedData = store.throwPromise.data;

    if (fetchedData === null) {
        throw fetchData().then((data) => {
            store.throwPromise.data = data;
        });
    }
    
    return <div>{fetchedData}</div>
}

// 2. "현대" 방식: use 훅 사용
function DataLoaderModern({ getDataPromise }) {
    const data = use(getDataPromise);
    return <div>{data}</div>;
}

// 3. 사용자 정의 thenable 객체를 throw하는 컴포넌트
function DataLoaderCustomThenable() {
    const fetchedData = store.customThenable.data;

    if (fetchedData === null) {
        throw {
            then(resolve) {
                fetchData().then(data => {
                    resolve(data);
                    store.customThenable.data = data;
                });
            }
        }
    }
    
  	return <div>{fetchedData}</div>
}

// 테스트를 위한 래퍼 컴포넌트
function SuspenseDemo() {
    const [method, setMethod] = useState('legacy');
    

    // 데이터를 리셋하는 함수
    const resetData = () => {
        removeCache();
        setMethod(method); // 강제 리렌더링
    };

    const removeCache = () => {
        store.throwPromise.data = null;
        store.useHooks.data = null;
        store.customThenable.data = null;
    }

    return (
       // UI들...
    );
}

export default SuspenseDemo;
```

이 코드에서 핵심 컴포넌트는 3가지 컴포넌트다.

### 1. `Promise`를 `throw` 하는 컴포넌트
```tsx
// 1. "레거시" 방식: promise를 직접 throw하는 컴포넌트
function DataLoaderLegacy() {
    let fetchedData = store.throwPromise.data;

    if (fetchedData === null) {
        throw fetchData().then((data) => {
            store.throwPromise.data = data;
        });
    } else {
        return <div>{fetchedData}</div>
    }

}
```

이 컴포넌트는 데이터가 없으면 `Promise`를 `throw` 하고 데이터가 있으면 `UI`를 보여준다.

### 2. `use`를 사용한 컴포넌트
```tsx
// 2. "현대" 방식: use 훅 사용
function DataLoaderModern({ getDataPromise }) {
    const data = use(getDataPromise);
    return <div>{data}</div>;
}
```

`use`훅을 사용해 구현했다. `use`는 `Promise`를 전달받아 `resolve` 해주는 훅이며 `Suspense`, `ErrorBoundary`와 통합해 사용할 수 있다.

참고: https://react.dev/reference/react/use#use

### 3. `{ then(resolve) {...} }` 객체를 `throw` 하는 컴포넌트
```tsx
// 3. 사용자 정의 thenable 객체를 throw하는 컴포넌트
function DataLoaderCustomThenable() {

    const fetchedData = store.customThenable.data;

    if (fetchedData === null) {
        throw {
            then(resolve) {
                fetchData().then(data => {
                    resolve(data);
                    store.customThenable.data = data;
                });
            }
        }
    } else {
        return <div>{fetchedData}</div>
    }
}
```

이 컴포넌트에서는 `Thenable` 객체를 `throw` 한다.

이런 형태로 구현했고 아래와 같이 `Suspense`로 감싸 사용했다.
```jsx
		<Suspense fallback={<div>로딩 중... (Suspense fallback)</div>}>
            {method === 'legacy' && <DataLoaderLegacy />}
            {method === 'modern' && <DataLoaderModern getDataPromise={fetchData()} />}
            {method === 'thenable' && <DataLoaderCustomThenable />}
        </Suspense>
```

### 실제 동작 확인하기

개발 서버를 실행해 실제 화면을 확인해보자:
![](https://velog.velcdn.com/images/koreanthuglife/post/e5554c43-083c-4b62-925b-08c8daf06bce/image.gif)

## useSuspensQuery

이제 `Suspense`와 `ErrorBoundary`의 동작원리에 대해 알고있다. 그렇다면 `useSuspenseQuery`는 어떻게 동작할까? 다음은 `useSuspenseQuery` 코드의 일부다:

```tsx
React.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setOptions(defaultedOptions, { listeners: false })
  }, [defaultedOptions, observer])

  // Handle suspense
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
  }
```

예상했다싶이 `useSuspenseQuery`는 `Promise`를 `throw` 하는 방식으로 동작한다.

## 원리를 토대로 `useQuery` 중복 요청을 다시 생각해보기

`useQuery`는 상태값을 통해 에러, 로딩 상태를 관리하고, `useSuepenseQuery`는 `Promise`를 `throw`에 로딩 상태를 `Suspense`에서 관리할 수 있게 한다. 이 두 훅의 차이점은 다음과 같다:

1. **useQuery의 경우:**
    - 상태 변수(isLoading, isFetching 등)로 로딩 상태를 관리
    - 컴포넌트가 마운트되거나 dependencies가 변경될 때마다 리렌더링이 발생
    - 그 과정에서 여러 번의 리렌더링이 발생하면서 아직 캐시 상태가 업데이트되지 않은 상태에서 다시 fetching이 시작될 수 있다
    - 특히 빠르게 변경되는 queryKey나 다수의 리렌더링이 발생하는 환경에서 중복 fetching이 발생할 수 있다
2. **useSuspenseQuery의 경우:**
    - Promise를 throw하면 즉시 컴포넌트 렌더링이 중단
    - Suspense boundary가 fallback을 보여주고, 컴포넌트는 아예 렌더링이 멈춘 상태가 된다
    - Promise가 resolve될 때까지 컴포넌트는 "일시 정지" 상태이므로 추가 fetching을 트리거할 수 없다
    - 데이터가 준비되면 딱 한 번만 렌더링이 재개된다

그렇기에 `useQuery`의 경우 `queryKey`의 변경, 캐시 상태 등등에 따라 요청이 중복으로 발생할 가능성이 있게 된다.

## 결론
일상적으로 봐왔던 버그고 별 생각없이 이래서 그랬지 않을까? 정도에서 그쳤던 버그였다. 취준생을 벗어난 이제는 그렇게 그쳐서는 안된다는 생각이 들었고, 내가 발견하고 해결한 버그에 대해서 그 원인과 해결 방식을 기술적으로 명료하게 설명할 수 있어야 한다는 생각을 했다.

그렇게 `useSuspenseQuery`를 조사하다 `ErrorBoundary`, `Suspense` 등을 살펴보게 되었고, 이제는 확실히 그 이유에 대해서 말할 수 있다고 생각한다. 하지만 여전히 그 상황을 재현해보지 않았고 실제로 검증하지 않았다는 오류가 존재하긴 한다. 다음에 출근해서 확인해보려 한다.

## 참고
- https://github.com/TanStack
- https://github.com/facebook/react
