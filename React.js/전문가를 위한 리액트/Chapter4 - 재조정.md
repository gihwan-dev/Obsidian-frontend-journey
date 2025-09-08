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
		children: { // main은 div라는 단 하나의 자식을 가지므로, children은 배열이 아닌 객체
			type: "div",
			props: {
				children: [
					{
						type: "h1",
						props: {
							children: "안녕하세요!"
						}
					},
					{
						type: "span",
						props: {
							children: ["카운트: ", count]
						}
					},
					{
						type: "button",
						props: {
							onClick: () => setCount(count + 1),
							children: "증가"
						}
					}
				]
			}
		}
	}
}
```

> [!Note] 정리
> 1. **트랜스파일 (Transpilation):** 개발자가 작성한 첫 번째 코드 블록의 JSX 문법(`<main>...</main>`)은 브라우저가 직접 이해할 수 없습니다. 따라서 빌드 과정에서 바벨(Babel)과 같은 트랜스파일러를 통해 이 JSX는 두 번째 코드 블록처럼 `React.createElement(...)` 함수를 호출하는 형태의 자바스크립트 코드로 변환됩니다.
>     
> 2. **컴포넌트 호출 (Execution):** 리액트가 애플리케이션을 렌더링하기 위해 `App` 컴포넌트(함수)를 호출합니다.
>     
> 3. **가상 DOM 생성 (Virtual DOM Creation):** `App` 함수가 실행되면, 그 내부에 있는 트랜스파일된 `React.createElement` 호출들이 실행됩니다. 이 실행 결과로 마지막 코드 블록에 나타난 JSON 형태의 자바스크립트 객체 트리(리액트 엘리먼트 트리, 즉 가상 DOM)가 생성되어 반환됩니다.
>     
> 
> 결론적으로, 말씀하신 대로 JSX는 `React.createElement`를 호출하는 함수로 변경되고, `App`이 호출되면 그 아래의 JSON 형태의 구조를 그리게(생성하게) 됩니다. 이 객체 트리가 바로 UI의 "청사진"입니다.

- 위 JSON은 `Counter` 컴포넌트에서 반환하는 가상 DOM을 나타냄
- 첫 번재 렌더링이기에 이 트리는 최소한의 DOM API 호출을 통해 브라우저에 반영됨
- 필요한 DOM API 호출 최소화 하는 방법은 어떻게 될까? => 일괄 처리(배치 처리)에 있음

## 일괄 처리
