- 지금까지는 우리가 어느정도 알고 있는 `React.createElement`를 배웠음
- 이 장에서는 리액트에서 가상 DOM을 실제로 적용하는 방법을 알아보고 `ReactDOM.createRoot(element).render()`의 동작을 배움

## 재조정 이해하기
- 가상 DOM은 우리가 원하는 UI의 청사진
- 리액트는 이 청사진을 가지고 **재조정(reconciliation)** 이라는 프로세스를 통해 주어진 환경에서 현실로 만듬

```jsx
import { useState } from "react";

const App = () => {
	const [count, setCount] = useState(0);
	
	return (
		<main>
			<div>
				<h1>안녕하세요!</h1>
				<span>카운트: {count}</span>
				<button onClick={() => setCount(count + 1)}>증가</button>
			</div>
		</main>
	);
};
```

- 재조정 과정을 이해하기 위해 위 컴포넌트를 만났을 때 내부적으로 어떻게 처리하는지 알아봄
- JSX는 리액트 엘리먼트의 트리가됨
- App 컴포넌트는 함수로 호출되면 자손 4개를 포함한 리액트 엘리먼트를 반환함

```js
const App = () => {
	const [count, setCount] = useState(0);
	
	return React.createElement(
		"main",
		null,
		React.createElement(
			"div",
			null,
			React.createElement("h1", null "안녕하세요!"),
			React.createElement("span", null, "카운트: ", count),
			React.createElement(
				"button",
				{ onClick: () => setCount(count + 1) },
				"증가"
			)
		)
	);
};
```

- App이 호출되어 생성된 리액트 엘리먼트 트리는 다음같이 표시됨

```jsx
{
	type: "main",
	props: {
		children: [
			
		]
	}
}
```