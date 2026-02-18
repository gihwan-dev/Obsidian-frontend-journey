---
type: blog-post
source: velog
author: "koreanthuglife"
title: "React Fiber란?"
slug: "항해99-플러스-2주차-WIL-feat.-React"
velogId: "78d4aacd-e0d0-4d4f-b159-4caae60f1220"
velogUrl: "https://velog.io/@koreanthuglife/항해99-플러스-2주차-WIL-feat.-React"
published: "2024-03-23T15:07:57.633Z"
updated: "2026-02-02T22:38:14.095Z"
tags:
  - "Fiber"
  - "리액트"
  - "항해99"
  - "항해플러스"
description: "이번 2주차에서는 제법 깊게 공부하는 시간을 가졌다. 첫번째로 ESM과 CJS의 실행 로직 차이로 인해서 발생하는 인스턴스 생성 속도의 차이에 대해서 결국 원인을 밝혀낼 수 있었다.두번째로 간소하게 리액트의 핵심 로직을 구현해 보는 시간을 가졌다. (render와 ho"
importedAt: "2026-02-18T07:28:49.893Z"
---

이번 2주차에서는 제법 깊게 공부하는 시간을 가졌다. 
- 첫번째로 ESM과 CJS의 실행 로직 차이로 인해서 발생하는 인스턴스 생성 속도의 차이에 대해서 결국 원인을 밝혀낼 수 있었다.
- 두번째로 간소하게 리액트의 핵심 로직을 구현해 보는 시간을 가졌다. (render와 hooks)

깊게 고민했고 쉽지 않았지만 테스트코드를 하나하나 구현해가며 해결해 나갈 수 있었다. 이런 과제에 대한 글을 써도 좋지만 이번에는 발표준비를 하며 공부했던 `Fiber`에 대해서 적어보려 한다.

방대했던 개념이였고 발표를 위해서 최대한 축약해서 적었다. 언젠가 시간이 된다면 좀 더 구체적인 내용을 담은 글을 작성하고 싶다. 이 `Fiber`를 공부할 때 직접 소스코드를 읽어가며 다양한 참고자료를 활용해 정리를 했었다. 아래는 그 내용이다. 많은 부분이 생략되었지만 개략적인 개념을 이해하기엔 충분하다고 생각된다.

# React Fiber

어떤걸 주제로 발표할까 고민하다 `React Fiber`에 대해서 다뤄보자는 생각이 들어서 다뤄보려 합니다.

리액트 파이버는 몇가지 속성을 가지는 자바스크립트 오브젝트 입니다.

리액트 파이버는 리액트 16버전 이후로 등장했고 현재의 `React reconciler`는 `Fiber`를 기반으로 하고 있습니다.

> `React reconciler`는 `React`가 가상 DOM을 사용하여 UI를 효율적으로 업데이트하는 방법을 구현한 것입니다. `Reconciler`의 주요 역할은 이전 컴포넌트 상태와 새로운 컴포넌트 상태를 비교(Reconciliation 과정)하여 실제 DOM에 어떤 변경사항을 적용할지 결정하는 것입니다
> 

저희가 구현한 과제는 `reconciler`는 `Fiber` 등장 이전의 `reconciler`를 구현했다고 생각할 수 있습니다.

`Fiber`의 등장으로 고질적인 리액트의 문제들이 해결되었습니다.

`Fiber`가 도입되면서 다음과 같은 일들이 가능해졌습니다.

- 하나의 작업을 여러 단위로 나누고 우선순위를 부여할 수 있게 되었습니다.
- 작업을 중단하고 이후에 다시 실행하는게 가능해졌습니다.
- 이전에 완료된 작업을 재사용 하거나, 더이상 필요하지 않다면 중단하는게 가능해졌습니다.

이전 `React reconciler`와 다르게 `Fiber reconciler`는 비동기적으로 동작할 수 있기 때문입니다.

이전 `reconciler`인 `stack` 은 이러한 일들이 불가능했습니다.

`stack` 이라는 이름이 붙인 이유는 자료구조 `stack` 처럼 동작하기 때문입니다. 동기적으로 동작하며, 작업을 추가하거나 제거할 수 있지만 `stack`이 빌 때 까지 작업을 계속해야 합니다. 중단될 수 없습니다.

`Fiber`는 몇가지 속성을 가지는 자바스크립트 오브젝트입니다. 이 `Fiber`는 하나의 작업 단위를 나타냅니다.

`React`는 먼저 `Fiber`라는 작업 단위를 처리하고 처리 결과로 `finishedWork` 라고 불리는 어떤 것을 얻게 됩니다.

그리고 이 결과는 `commit`되고 DOM에 반영됩니다.

왜 Fiber는 이러한 일들이 가능한지 우선 `Fiber`의 프로퍼티를 보며 어떤 프로퍼티가 어떤 값을 가지는지 알아보겠습니다.

```tsx

export type Fiber = {
  tag: WorkTag,

  key: null | string,

  elementType: any,

  type: any,

  stateNode: any,

  return: Fiber | null,

  child: Fiber | null,
  sibling: Fiber | null,
  index: number,

  ref:
    | null
    | (((handle: mixed) => void) & {_stringRef: ?string, ...})
    | RefObject,

  refCleanup: null | (() => void),

  pendingProps: any, 
  
  memoizedProps: any, 

  updateQueue: mixed,

  memoizedState: any,

  dependencies: Dependencies | null,

  mode: TypeOfMode,

  flags: Flags,
  subtreeFlags: Flags,
  deletions: Array<Fiber> | null,

  lanes: Lanes,
  
  childLanes: Lanes,

  alternate: Fiber | null,

  actualDuration?: number,

  actualStartTime?: number,

  selfBaseDuration?: number,

  treeBaseDuration?: number,
};
```

우선 `tag` 입니다. 작업의 종류를 나타냅니다. 작업의 종류는 0부터 27까지 정수를 값으로 가지고 목록은 아래와 같습니다.

```jsx
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
export const TracingMarkerComponent = 25;
export const HostHoistable = 26;
export const HostSingleton = 27;
```

해당 값에 따라 다른 처리방식을 통해 작업을 처리하게 됩니다.

다음은 `key`와 `type`입니다. 이 프로퍼티들은 `React Element`로부터 전달받게 됩니다. 실제로 `Fiber`는 리액트 엘리먼트와 1대1 대응관계를 가집니다. 실제로 `Fiber`는 아래와 같은 함수 호출을 통해 생성되며 `key`와 `type`값을 `element`로부터 할당받는것을 확인할 수 있습니다.

```jsx
export function createFiberFromElement(
  element: ReactElement,
  mode: TypeOfMode,
  lanes: Lanes,
): Fiber {
  let owner = null;
  if (__DEV__) {
    owner = element._owner;
  }
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    lanes,
  );
  if (__DEV__) {
    fiber._debugOwner = element._owner;
  }
  return fiber;
}

export function createFiberFromFragment(
  elements: ReactFragment,
  mode: TypeOfMode,
  lanes: Lanes,
  key: null | string,
): Fiber {
  const fiber = createFiber(Fragment, elements, key, mode);
  fiber.lanes = lanes;
  return fiber;
}

export function createFiberFromText(
  content: string,
  mode: TypeOfMode,
  lanes: Lanes,
): Fiber {
  const fiber = createFiber(HostText, content, null, mode);
  fiber.lanes = lanes;
  return fiber;
}
```

`lanes` 프로퍼티입니다. `lanes` 프로퍼티는 이 `Fiber` 작업이 어떤 우선순위를 가지는지에 대한 값을 가집니다.

다음으로 `child, sbling, return` 입니다. `Fiber`는 초기에 애플리케이션의 컴포넌트 트리를 순회하며 순차적으로 생성되어 트리구조를 생성합니다. 각 `Fiber`는 `child, sbling, return` 을 통해 인접한 `Fiber`노드와 관계를 유지하게 됩니다.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/ec0da292-7ef2-4e63-ae79-33914672a600/94fee185-11fe-4d0f-83ea-dde298c6f441/Untitled.png)

그럼 이제 `Fiber`가 정확히 어떻게 작업을 진행하고 완료된 작업을 DOM에 반영하는지 주요 내부 함수를 통해 알아보겠습니다.

`Fiber`가 작업을 완료하고 DOM 반영하는 작업들은 2단계에서 진행됩니다.

1. Render 단계: 이 단계에서 작업들이 수행됩니다.
2. Commit 단계: 이 단계에서 완료된 작업으로 commit이 진행됩니다. 즉, 결과가 DOM에 반영됩니다

먼저 Render 단계 입니다.

이 단계는 비동기적으로 진행될 수 있습니다.

비 동기적으로 진행되기 때문에 이 비동기 작업들은 우선순위가 정해질 수 있고, 중단될 수 있으면 아예 버려질 수 있습니다.

이 단계에서 `beginWork()`, `completeWork()` 와 같은 내부 함수들이 호출됩니다.

### **`beginWork`**

- **역할**: **`beginWork`** 함수는 리액트의 렌더링 단계에서 호출됩니다. 이 함수의 주된 목적은 새로운 렌더링을 시작하고, 현재 처리중인 컴포넌트(Fiber)의 업데이트를 준비하는 것입니다.
- **작업 처리**: **`beginWork`**는 주어진 컴포넌트에 대한 작업을 시작하면서, 컴포넌트의 props와 state를 기반으로 필요한 변경사항을 계산합니다.(변경 사항이 있는지, 리렌더링 되어야 하는지 등) 이 과정에서 자식 컴포넌트들을 재귀적으로 탐색하며, 각 자식에 대한 작업을 생성합니다.
- **중단 및 재개 가능**: 이 단계의 작업은 비동기적으로 진행될 수 있으며, 필요에 따라 중단되었다가 나중에 다시 재개될 수 있습니다. 이는 리액트가 우선순위에 따라 작업을 관리할 수 있게 해줍니다.

### **`completeWork`**

- **역할**: **`completeWork`** 함수는 컴포넌트의 처리가 끝난 후 호출되며, **`beginWork`**에서 시작된 작업을 완료합니다. 이 함수는 주로 리액트가 생성한 변경사항들을 정리하고, 최종적으로 DOM 업데이트를 위한 준비를 마무리하는 단계에서 작동합니다.
- **작업 완료 처리**: **`beginWork`**에서 생성된 자식 컴포넌트들의 처리가 완료되면, **`completeWork`**는 이들 자식 컴포넌트의 결과를 바탕으로 최종적인 변경사항을 결정하고, 이를 기반으로 다음 단계인 커밋 단계를 위한 준비를 합니다.
- **결과 집계**: 이 함수는 트리를 거슬러 올라가면서 각 노드의 작업 결과를 집계합니다. 이 과정에서 생성된 결과물은 추후 커밋 단계에서 실제로 적용될 변경사항들을 포함하게 됩니다.
- **사이드 이펙트 리스트 준비**: **`completeWork`** 과정에서 각 컴포넌트가 가진 변경사항이나 필요한 사이드 이펙트들을 리스트업하여, 커밋 단계에서 처리될 수 있도록 준비합니다.

이렇게 Render 단계가 끝아면 두가지 결과물이 나오게 됩니다.

1. 작업이 완료된 `Fiber` 트리
2. `Effect` 리스트

두번째는 commit 단계 입니다.

이 단계에서 `commitWorks()` 가 호출됩니다.

이 단계는 동기적으로 발생하며 중단될 수 없습니다.

### **`commitWork`**

- **역할**: **`commitWork`** 함수는 리액트의 커밋 단계에서 호출됩니다. 이 단계에서는 **`beginWork`**에서 준비된 변경사항을 실제 DOM에 반영합니다. 즉, 이 함수는 리액트가 변경사항을 실제 UI에 적용하는 과정을 담당합니다.
- **작업 확정**: **`commitWork`**는 모든 변경사항(예: DOM 업데이트, 컴포넌트 인스턴스 업데이트)을 최종적으로 확정하고, 필요한 모든 사이드 이펙트(예: 생명주기 메소드 호출, 레퍼런스 업데이트)를 처리합니다.
- **동기적 실행**: 이 단계의 작업은 중단할 수 없으며, 한 번 시작되면 모든 작업이 완료될 때까지 동기적으로 실행됩니다. 이는 UI의 일관성을 보장하기 위해 중요합니다.

이렇게 두 단계를 거치면 `fiber reconciler` 업데이트 작업이 완료되게 됩니다. 내부에서 어떤 함수들이 사용되고 어떻게 동작하는지 추상적으로 확인해보고 `fiber reconcilier`의 동작 방식에 대해서 알아보았습니다. 실제로 리액트 `callstack`을 살펴보면

![](https://velog.velcdn.com/images/koreanthuglife/post/ae40d532-d30a-4303-ae1b-548edcc83431/image.png)


해당 함수들이 호출되는것을 확인할 수 있습니다.

쉽게 잘 풀어쓰려고 공부하면서 `Fiber`에 대해 좀 더 잘 알게 된거같아 유익했습니다.
