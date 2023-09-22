## PROBLEM1
### [🚀 기능 요구 사항](https://github.com/gihwan-dev/javascript-onboarding/blob/main/docs/PROBLEM1.md#-%EA%B8%B0%EB%8A%A5-%EC%9A%94%EA%B5%AC-%EC%82%AC%ED%95%AD)

포비와 크롱이 페이지 번호가 1부터 시작되는 400 페이지의 책을 주웠다. 책을 살펴보니 왼쪽 페이지는 홀수, 오른쪽 페이지는 짝수 번호이고 모든 페이지에는 번호가 적혀있었다. 책이 마음에 든 포비와 크롱은 페이지 번호 게임을 통해 게임에서 이긴 사람이 책을 갖기로 한다. 페이지 번호 게임의 규칙은 아래와 같다.

1. 책을 임의로 펼친다.
2. 왼쪽 페이지 번호의 각 자리 숫자를 모두 더하거나, 모두 곱해 가장 큰 수를 구한다.
3. 오른쪽 페이지 번호의 각 자리 숫자를 모두 더하거나, 모두 곱해 가장 큰 수를 구한다.
4. 2~3 과정에서 가장 큰 수를 본인의 점수로 한다.
5. 점수를 비교해 가장 높은 사람이 게임의 승자가 된다.
6. 시작 면이나 마지막 면이 나오도록 책을 펼치지 않는다.

포비와 크롱이 펼친 페이지가 들어있는 배열 pobi와 crong이 주어질 때, 포비가 이긴다면 1, 크롱이 이긴다면 2, 무승부는 0, 예외사항은 -1로 return 하도록 solution 메서드를 완성하라.

### [제한사항](https://github.com/gihwan-dev/javascript-onboarding/blob/main/docs/PROBLEM1.md#%EC%A0%9C%ED%95%9C%EC%82%AC%ED%95%AD)

- pobi와 crong의 길이는 2이다.
- pobi와 crong에는 [왼쪽 페이지 번호, 오른쪽 페이지 번호]가 순서대로 들어있다.

### [실행 결과 예시](https://github.com/gihwan-dev/javascript-onboarding/blob/main/docs/PROBLEM1.md#%EC%8B%A4%ED%96%89-%EA%B2%B0%EA%B3%BC-%EC%98%88%EC%8B%9C)

| pobi       | crong      | result |
| ---------- | ---------- | ------ |
| [97, 98]   | [197, 198] | 0      |
| [131, 132] | [211, 212] | 1      |
| [99, 102]  | [211, 212] | -1     |

### 테스트 통과 코드(보완 필요)
```js
function problem1(pobi, crong) {
	var answer;

	if (!pobi || !crong) {
		return -1;\
	}

// 입력이 잘못된 경우
	if (Number(pobi[1]) === 400 || Number(pobi[0]) === 1) {
		return -1;
	}

	if (Number(crong[1]) === 400 || Number(crong[0]) === 1) {
		return -1;
	}
  
	if (pobi.length !== 2 || crong.length !== 2) {
		return -1;
	}

	if (
	Number(pobi[1]) - Number(pobi[0]) !== 1 ||
	Number(crong[1]) - Number(crong[0]) !== 1
	) {
		return -1;
	}

	// 입력이 올바른 경우
	// 왼쪽 오른쪽 비교해 큰 값 할당
	//pobi
	const pobiLeftMax = Math.max(sum(pobi[0]), sum(pobi[1]));

	const pobiRightMax = Math.max(power(pobi[0]), power(pobi[1]));

	if (pobiLeftMax === Infinity || pobiRightMax === Infinity) {
		return -1;
	}

	const pobiMax = Math.max(pobiLeftMax, pobiRightMax);

	//crong

	const crongLeftMax = Math.max(sum(crong[0]), sum(crong[1]));

	const crongRightMax = Math.max(power(crong[0]), power(crong[1]));

	if (crongLeftMax === Infinity || crongRightMax === Infinity) {
		return -1;
	}

	const crongMax = Math.max(crongLeftMax, crongRightMax);

	// 비교 후 결과값 전달

	if (pobiMax > crongMax) {
		return 1;
	}

	if (pobiMax < crongMax) {
		return 2;
	}

	if (pobiMax === crongMax) {
		return 0;
	}

	return -1;
}

module.exports = problem1;

function sum(value) {
	let result = 0;
	if (typeof value === "string") {
		const valueArr = value.split("");
		result = valueArr.reduce((prev, item) => {
			return Number(prev) + Number(item);
		}, 0);
	} else if (typeof value === "number") {
	const valueArr = (value + "").split("");
	result = valueArr.reduce((prev, item) => {
		return Number(prev) + Number(item);
	}, 0);
	} else {
	return Infinity;
	}
	return result;
}

  

function power(value) {
	let result = 0;
	if (typeof value === "string") {
		const valueArr = value.split("");
		result = valueArr.reduce((prev, item) => {
			return Number(prev) * Number(item);
		});
	} else if (typeof value === "number") {
		const valueArr = (value + "").split("");
		result = valueArr.reduce((prev, item) => {
			return Number(prev) * Number(item);
		});
	} else {
		return Infinity;
	}
	return result;
}
```


### 해결법

이 문제를 해결할 때 중요한건 예외 케이스라는 생각을 했다. 주어진 `input`이 특정되지 않았고 테스트 케이스 또한 3개로 빈약했다. 주어진 입력값이 올바른지에 대한 로직을 작성하는데 힘을 들였고 작성했으나 모든 예외 케이스를 해결할 수 있는지는 확실하지 않다고 생각된다. 일단 생각해낸 예외 케이스는 다음과 같았다.
- 입력값에 첫페이지 또는 마지막 페이지가 존재하는지
- 각 입력값 배열의 길이가 2가 맞는지
- 입력된 페이지가 연속된 페이지가 맞는지(왼, 오)
생각 해봐야할 예외 케이스
- 입력값이 모두 올바른 숫자 형식인지
- 문자열로 입력되었을 경우 이걸 숫자로 변경했을 때 올바른 숫자로 변경되었는지
- 입력된 페이지가 1 ~ 400 안의 바운더리에 존재하는지

이 문제를 접근할 때 이런식으로 예외 케이스를 떠올리는 것보단 입력되는 형식이 반드시 어떤 값이여야 하는지 제한해보는 쪽이 더 좋은 방식이라고 생각된다.

예를 들자면 다음과 같다

**입력되는 `pobi`와 `crong`은 반드시 길이 2의 배열이며, 각 배열에 들어간 값은 숫자로 전환했을 때 3~398 사이의 숫자여야 한다.**

이렇게 하면 더 접근하기 쉬울거라 생각된다.
`