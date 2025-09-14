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
- 문서 조각은 다수의 DOM 노드를 포함하는 가벼운 컨테이너로, 일종의 임시 스테이징 영역처럼 동작해서 문서의 실제 DOM에 영향을 주지 않고 여러 변경 사항을 반영한다. 최종적으로 문서 조각을 DOM에 추가하면 단 한 번의 리플로와 리페인팅이 발생한다.
- 비슷한 맥락에서 리액트는 여러 가상 DOM 업데이트를 모아 한 번의 DOM 업데이트로 결합한 후 실제 DOM에 대한 업데이트를 일괄 처리함
- 현대 리액트 내부 동작을 보기 전에, 16 미만 버전에서 사용되는 '스택(stack)' 재조정자의 동작 방식을 소개할 예정. 이를 통해 현대의 '파이버(fiber)' 재조정자의 필요성을 이해할 수 있음

> [!Note] 노트
>지금부터 논의할 모든 주제는 시간이 지나면 변경될 수도 있는 리액트 내부 구현의 세부 사항임


## 기존 기술
- 이전 리액트는 렌더링에 스택 데이터 구조를 사용

### 스택 재조정자
- 이전 리액트 재조정자는 스택 기반 알고리즘을 사용해 새 가상 트리를 이전 가상 트리와 비교하고 그에 따라 DOM을 업데이트
- 간단한 경우 잘 동작하지만 규모가 커지고 복잡해지면 여러 문제가 발생함
- 예를들어, 특정 컴포넌트의 렌더링 비용이 비싼 경우 비싼 컴포넌트가 렌더링을 막아버림. 계산 비용이 비싼 컴포넌트의 렌더링이 만약 그리 중요하지 않다면, 상대적으로 더 중요할 수 있는 사용자 입력을 막기도함
- 만약 이 렌더링과, 사용자 상호작용 사이에 우선순위를 적용해 사용자 입력을 우선 반영하고, 비싼 컴포넌트의 렌더링을 후순위로 처리할 수 있다면 사용자 경험이 올라갈것임
- 스택 재조정자는 업데이트의 우선순위를 설정하지 않음. 그래서 덜 중요한 업데이트가 더 중요한 업데이트를 방해할 수 있었음
- 리액트 앱에서 가상 트리에 대한 업데이트는 중요도가 각기 다를 수 있음
- 