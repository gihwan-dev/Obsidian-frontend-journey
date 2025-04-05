## HooksDiapatcherOnMount

```ts
const HooksDispatcherOnMount: Dispatcher = {
  readContext,

  use,
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useInsertionEffect: mountInsertionEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  useDebugValue: mountDebugValue,
  useDeferredValue: mountDeferredValue,
  useTransition: mountTransition,
  useSyncExternalStore: mountSyncExternalStore,
  useId: mountId,
  useHostTransitionStatus: useHostTransitionStatus,
  useFormState: mountActionState,
  useActionState: mountActionState,
  useOptimistic: mountOptimistic,
  useMemoCache,
  useCacheRefresh: mountRefresh,
};
```

`HooksDispatcherOnMount`는 React의 훅 시스템에서 컴포넌트가 처음 마운트될 때 사용되는 dispatcher다. 주요 특징과 역할을 설명하겠다.


**주요 특징**:
- 모든 훅의 `mount` 버전 구현을 포함
- 컴포넌트가 처음 렌더링될 때만 사용됨
- 초기 상태 설정과 메모이제이션을 담당

3. **주요 훅들의 마운트 동작**
- `useState`: 초기 상태값 설정
- `useEffect`: 이펙트 등록
- `useMemo`: 초기 메모이제이션 값 계산
- `useCallback`: 초기 콜백 메모이제이션
- `useRef`: 초기 ref 객체 생성

**컨텍스트 처리**:
 - `readContext` 함수를 통해 컨텍스트 값 읽기
 - `useContext` 훅의 기반이 됨

**최적화 관련**:
 - `useDeferredValue`: 지연된 값 처리
 - `useTransition`: 전환 상태 관리
 - `useSyncExternalStore`: 외부 스토어 동기화

**폼 상태 관리**:
 - `useFormState`/`useActionState`: 폼 상태 관리
 - `useOptimistic`: 낙관적 업데이트 처리

**캐시 관련**:
 - `useMemoCache`: 메모이제이션 캐시 관리
 - `useCacheRefresh`: 캐시 새로고침

이 dispatcher는 React의 훅 시스템에서 매우 중요한 역할을 합니다:
1. 컴포넌트의 초기 상태 설정
2. 훅의 첫 번째 호출 시 필요한 초기화 작업 수행
3. 메모이제이션과 이펙트의 초기 등록
4. 컨텍스트와 외부 스토어의 초기 연결

이 dispatcher는 컴포넌트가 처음 마운트될 때만 사용되며, 이후 업데이트에서는 `HooksDispatcherOnUpdate`가 사용됩니다. 이는 React가 훅의 상태를 효율적으로 관리하고, 렌더링 성능을 최적화하는 데 중요한 역할을 합니다.

## HooksDispatcherOnUpdate

```ts
const HooksDispatcherOnUpdate: Dispatcher = {
  readContext,

  use,
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useInsertionEffect: updateInsertionEffect,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  useDebugValue: updateDebugValue,
  useDeferredValue: updateDeferredValue,
  useTransition: updateTransition,
  useSyncExternalStore: updateSyncExternalStore,
  useId: updateId,
  useHostTransitionStatus: useHostTransitionStatus,
  useFormState: updateActionState,
  useActionState: updateActionState,
  useOptimistic: updateOptimistic,
  useMemoCache,
  useCacheRefresh: updateRefresh,
};
```

`HooksDispatcherOnUpdate`는 React의 훅 시스템에서 컴포넌트가 업데이트될 때 사용되는 dispatcher다. 주요 특징과 역할을 설명하겠다:

**주요 특징**:
 - 모든 훅의 `update` 버전 구현을 포함
 - 컴포넌트가 리렌더링될 때 사용됨
 - 이전 상태와의 비교 및 업데이트 로직을 담당

**주요 훅들의 업데이트 동작**:
 - `useState`: 상태 업데이트 처리
 - `useEffect`: 의존성 변경 감지 및 이펙트 재실행
 - `useMemo`: 의존성 변경 시 메모이제이션 재계산
 - `useCallback`: 의존성 변경 시 콜백 재생성
 - `useRef`: ref 객체 업데이트

**업데이트 최적화**:
 - `updateMemo`: 메모이제이션 값 재계산
 - `updateCallback`: 콜백 함수 재생성
 - `updateEffect`: 이펙트 의존성 비교

**상태 관리**:
 - `updateState`: 상태 업데이트 처리
 - `updateReducer`: 리듀서 기반 상태 업데이트
 - `updateActionState`: 액션 기반 상태 업데이트

**동시성 기능**:
 - `updateTransition`: 전환 상태 업데이트
 - `updateDeferredValue`: 지연된 값 업데이트
 - `updateSyncExternalStore`: 외부 스토어 동기화

**폼 및 낙관적 업데이트**:
 - `updateActionState`: 폼 상태 업데이트
 - `updateOptimistic`: 낙관적 업데이트 처리

이 dispatcher의 주요 역할은:
1. 이전 상태와 새로운 상태의 비교
2. 의존성 변경 감지
3. 필요한 경우에만 상태 업데이트 및 이펙트 재실행
4. 메모이제이션 값의 재계산
5. 동시성 기능 지원

`HooksDispatcherOnUpdate`는 `HooksDispatcherOnMount`와 함께 React의 훅 시스템의 핵심을 이루며, 컴포넌트의 업데이트 과정에서 효율적인 상태 관리와 렌더링 최적화를 담당한. 특히 의존성 비교와 메모이제이션을 통해 불필요한 리렌더링을 방지하는 중요한 역할을 한다.

## HooksDispatcher가 라이프 사이클에 따라 분리된 이유

Dispatcher를 Mount와 Update로 분리한 이유는 크게 세 가지 측면에서 설명할 수 있다:

1. **초기화와 업데이트의 본질적 차이**:
   - **Mount 시점**:
     ```javascript
     // 초기 상태 설정
     function mountState(initialState) {
       const hook = mountWorkInProgressHook();
       if (typeof initialState === 'function') {
         initialState = initialState();
       }
       hook.memoizedState = hook.baseState = initialState;
       // ... 초기화 로직
     }
     ```
     - 초기 상태를 설정
     - 메모이제이션 값의 초기 계산
     - 이펙트의 첫 등록
     - ref 객체의 초기 생성

   - **Update 시점**:
     ```javascript
     // 상태 업데이트 처리
     function updateState(initialState) {
       const hook = updateWorkInProgressHook();
       // 이전 상태와 비교
       if (areHookInputsEqual(nextDeps, prevDeps)) {
         return prevState;
       }
       // ... 업데이트 로직
     }
     ```
     - 이전 상태와의 비교
     - 의존성 변경 감지
     - 조건부 업데이트 처리

2. **성능 최적화**:
   - Mount 시점은 한 번만 실행되므로 초기화에 집중
   - Update 시점은 자주 실행되므로 비교와 최적화에 집중
   - 각 시점별로 필요한 최적화 로직만 포함하여 불필요한 코드 실행 방지

3. **코드 구조와 유지보수**:
   - 각 생명주기별로 명확한 책임 분리
   - 디버깅과 문제 해결이 용이
   - 코드의 가독성과 유지보수성 향상

예를 들어, `useEffect`의 경우:
```javascript
// Mount 시점
function mountEffect(create, deps) {
  return mountEffectImpl(
    PassiveEffect | PassiveStaticEffect,
    HookPassive,
    create,
    deps
  );
}

// Update 시점
function updateEffect(create, deps) {
  return updateEffectImpl(
    PassiveEffect,
    HookPassive,
    create,
    deps
  );
}
```

Mount에서는:
- 이펙트의 초기 등록
- 클린업 함수 설정
- 의존성 배열 초기화

Update에서는:
- 이전 의존성과 새로운 의존성 비교
- 변경된 경우에만 이펙트 재실행
- 이전 클린업 함수 실행

이렇게 분리함으로써:
1. 각 생명주기별로 필요한 로직만 실행
2. 불필요한 비교나 계산 방지
3. 코드의 의도가 명확해짐
4. 성능 최적화가 용이해짐

이러한 분리는 React의 핵심 원칙인 "선언적 UI"와 "효율적인 업데이트"를 구현하는 데 중요한 역할을 합니다.
