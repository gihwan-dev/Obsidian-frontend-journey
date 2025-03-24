createPortal은 어떻게 동작할까? `createPortal`의 주요 특징은 다음과 같다:

1. `Portal`을 통핸 렌더링된 컴포넌트는 DOM 상에서는 다른 위치에 있더라도, React 트리에서는 원래 위치의 컨텍스트와 이벤트 버블링을 유지한다.
2. 부모 컴포넌트의 스타일링이나 오버레이의 영향을 받지 않고 독립적으로 렌더링할 수 있다.

createPortal의 세부 구현을 보자:
```tsx
export function createPortal(
  children: ReactNodeList,
  containerInfo: any,
  // TODO: figure out the API for cross-renderer implementation.
  implementation: any,
  key: ?string = null,
): ReactPortal {
  if (__DEV__) {
    checkKeyStringCoercion(key);
  }
  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children,
    containerInfo,
    implementation,
  };
}
```

`type`이 `REACT_PORTAL_TYPE`인 리액트 노드를 생성해 반환하는 단순한 형태의 함수라는걸 알 수 있다. 그렇다면 `REACT_PORTAL_TYPE`을 어떻게 처리하는 이 객체를 처리하는 함수를 찾아봤다.

`type`에 대한 처리는 `beginWork` 함수에서 일어난다. `beginWork`는 `React Fiber` 아키텍처의 핵심 함수 중 하나다. 주요 역할은 다음과 같다:

1. Fiber 노드의 작업을 시작하고 해당 노드의 자식들을 처리하는 첫 단계다.
2. 컴포넌트 타입에 따라 적절한 처리를 수행한다(함수형 컴포넌트, 클래스 컴포넌트, Portal 등).
3. 변경사항이 있는지 확인하고 필요한 경우에만 작업을 수행한다.

주요한 특징은 다음과 같다:

1. 재귀적으로 동작해 전체 `Fiber` 트리를 순회한다.
2. 각 노드에서 필요한 업데이트를 식별하고 처리한다.
3. 성능 최적화를 위해 불필요한 작업을 건너뛰는 로직이 포함되어 있다.
4. 렌더 단계의 일부로, 이 단계에서 실제 `DOM` 업데이트는 일어나지 않는다.

이 함수는 `React`의 재조정(Reconciliation) 프로세스의 중요한 부분이며, 효율적인 UI 업데이트를 가능하게 한다. 그렇다면 세부 구현을 간략하게 알아보자:

```tsx
// 단순화된 beginWork 구현
function beginWork(current, workInProgress, renderLanes) {
  // 1. 변경사항 체크 (최적화)
  if (current !== null) {
    // 이전 props와 현재 props 비교
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;
    
    if (oldProps === newProps && !hasContextChanged()) {
      // 변경사항이 없으면 작업을 건너뛸 수 있음
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
    }
  }

  // 2. 컴포넌트 타입에 따른 처리
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, renderLanes);
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    case PortalComponent:
      return updatePortalComponent(current, workInProgress, renderLanes);
    // ... 다른 타입들
  }
}
```

이처럼 `type`에 따라 적절한 `update` 함수를 호출하는 모습을 볼 수 있다. `createPortal`을 통해 생성된 `REACT_PORTAL_TYPE` 타입의 컴포넌트는 `updatePortalComponent`를 통해 처리된다. `updatePortalComponent`는 `Portal` 타입의 `Fiber` 노드를 처리하는 함수다. 주요 역할은 다음과 같다:

1. `Portal`의 `children`을 재조정(reconcile) 한다.
2. `Portal`의 `container` 정보를 관리한다.
3. `Portal`의 자식들이 올바르게 렌더링되도록 준비한다.

세부 구현을 보자:

```ts
function updatePortalComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
) {
  // Portal 컴포넌트의 containerInfo를 현재 작업 중인 Fiber의 context로 설정
  // 이를 통해 Portal 내부의 컴포넌트들이 올바른 container context에서 렌더링됨
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);

  // Portal의 children을 가져옴 (createPortal에서 전달된 children)
  const nextChildren = workInProgress.pendingProps;

  if (current === null) {
    // 최초 마운트 시
    // 일반적인 React 컴포넌트들은 마운트 단계에서 DOM에 추가되지만,
    // Portal은 특별한 케이스로 commit 단계에서 DOM에 추가됨
    // 이는 root가 null child로 시작하는 것과는 다른 방식
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      null,           // 이전 자식이 없으므로 null
      nextChildren,   // 새로운 자식들
      renderLanes,
    );
  } else {
    // 업데이트 시
    // 이전 Fiber(current)와 새로운 props(nextChildren)를 비교하여
    // 필요한 변경사항을 계산하고 자식 Fiber들을 재조정
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  }

  // 처리된 자식 Fiber를 반환
  // 이 자식들은 나중에 commit 단계에서 실제 container에 마운트됨
  return workInProgress.child;
}
```

여기서 중요한 포인트는 다음과 같다:

1. `Portal`은 `React` 트리 구조에서는 원래 위치에 존재하지만, `DOM`에서는 다른 위치에 렌더링된다.
2. `pushHostContainer`를 통해 `Portal`의 `container context`를 설정해 자식 컴포넌트들이 올바른 `context`에서 렌더링 되도록 한다.
3. 마운트와 업데이트 시의 처리가 다른데, 이는 `Portal`의 특별한 마운팅 방식 때문이다.
4. 실제 `DOM` 조작은 이후의 `commit` 단계에서 이루어진다.

> Fiber와 Lanes에 대한 간략한 설명