```tsx
function updateContextProvider(current, workInProgress, renderLanes) {
  // 1. Context 객체 가져오기
  const context = workInProgress.type._context;
  
  // 2. 새로운 props와 value 가져오기
  const newProps = workInProgress.pendingProps;
  const newValue = newProps.value;

  // 3. Context Provider 스택에 새로운 value 추가
  pushProvider(workInProgress, context, newValue);

  // 4. 자식 컴포넌트들 조정
  const newChildren = newProps.children;
  reconcileChildren(current, workInProgress, newChildren, renderLanes);
  
  // 5. 첫 번째 자식 Fiber 반환
  return workInProgress.child;
}
```

