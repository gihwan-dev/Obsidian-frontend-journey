beginWork 함수는 Fiber 아키텍쳐에서 각 컴포넌트의 렌더링을 시작하는 핵심 함수다. 주요 동작 원리는 다음과 같다:

```tsx
function beginWork(current, workInProgress, renderLanes) {
  // 1. 현재 fiber의 lanes를 업데이트
  workInProgress.lanes = renderLanes;

  // 2. 컴포넌트 타입에 따른 처리
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
    case ClassComponent:
      return updateClassComponent(current, workInProgress, Component, nextProps, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    // ... 기타 컴포넌트 타입들
  }
}
```

여기서 아래와 같은 부분이 있다:

```tsx
case ContextProvider:
	return updateContextProvider(current, workInProgress, renderLanes);
case ContextConsumer:
	return updateContextConsumer(current, workInProgress, renderLanes);
```

우선 파라미터 변수에 대한 정리를 해보자.

1. `current`: `Fiber` | `null`
	- 현재 화면에 렌더링된 `Fiber` 노드를 가리킵니다
	- 첫 렌더링의 경우 `null`입니다
	- 업데이트 시에는 이전 렌더링의 `Fiber` 노드를 참조합니다
	- "current tree" 또는 "old tree"라고도 불립니다
2. `workInProgress`: `Fiber`
	- 현재 작업 중인 새로운 `Fiber` 노드를 가리킵니다
	-  업데이트를 위해 새로 생성되거나 재사용되는 `Fiber`입니다
	- "work-in-progress tree" 또는 "new tree"라고도 불립니다
	- 이 노드는 아직 화면에 반영되지 않은 상태입니다
3. `renderLanes`: `Lanes`
	- 렌더링 우선순위를 나타내는 비트마스크 값입니다
	- `React`의 동시성(Concurrent) 모드에서 사용됩니다
	- 여러 업데이트의 우선순위를 관리합니다
	- 예를 들어:
		- 사용자 입력: 높은 우선순위
		- 데이터 페칭: 낮은 우선순위
		- 애니메이션: 중간 우선순위

