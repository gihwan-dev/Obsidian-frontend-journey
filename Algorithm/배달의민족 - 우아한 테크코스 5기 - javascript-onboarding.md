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

### 테스트 통과 코드 ver 1.0
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


### 해설

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

**문제점**: 곱을 구하는 `reduece`함수의 초기값이 0이 되면 결과값이 무조건 0이 나온다 그로 인해 몇 몇 케이스를 통과하지 못했다. 주의해야 한다.

### 테스트 통과 코드 ver 2.0
테스트 케이스를 추가했다. 입력이 올바른 입력인지를 확인하는 테스트 케이스를 추가했다.
```js
function problem1(pobi, crong) {
	var answer;
	// 입력이 올바르지 않은 경우
	if (!validateTotalInput(pobi)) {
		return -1;
	}
	if (!validateTotalInput(crong)) {
		return -1;
	}

	// 입력이 올바른 경우
	// 왼쪽 오른쪽 비교해 큰 값 할당
	//pobi
	const pobiSumMax = Math.max(sum(pobi[0]), sum(pobi[1]));
	const pobiPowerMax = Math.max(power(pobi[0]), power(pobi[1]));
	const pobiMax = Math.max(pobiSumMax, pobiPowerMax);
	
	//crong
	const crongSumMax = Math.max(sum(crong[0]), sum(crong[1]));
	const crongPowerMax = Math.max(power(crong[0]), power(crong[1]));
	const crongMax = Math.max(crongSumMax, crongPowerMax);
	
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

function validateTotalInput(value) {
	try {
	// 입력의 길이는 2여야 한다.
		if (!value.length === 2) {
			return false;
		}
	// Number(value)의 값이 숫자 값이여야 한다.
		value[0] = Number(value[0]);
		value[1] = Number(value[1]);
		if (typeof value[0] !== "number" && typeof value[1] !== "number") {
			return false;
		}
	// 왼쪽은 홀수 오른쪽은 짝수 번호여야 한다.
		if (value[0] % 2 !== 1 && value[1] % 2 !== 0) {
			return false;
		}
	// 오른쪽 값에서 왼쪽을 뺀 값이 1이여야 한다.
		if (value[1] - value[0] !== 1) {
			return false;
		}
	// 시작 면이나 마지막 면이 나오도록 책을 펼치지 않는다.
	// 즉 페이지는 3~398 사이에 존재한다.
		if (!value[0] > 1 && value[1] < 400) {
			return false;
		}
		return true;
	} catch (error) {
		return false;
	}
}

function sum(value) {
	const target = (value + "").split("");
	const result = target.reduce((prev, cur) => {
		return Number(prev) + Number(cur);
	}, 0);
	return result;
}

  

function power(value) {
	const target = (value + "").split("");
	const result = target.reduce((prev, cur) => {
		return Number(prev) * Number(cur);
	}, 1);
	return result;
}
```
### 입력한 테스트 코드 ver 2.0
```js
describe("problem1", () => {
  test("case1", () => {
    expect(problem1([97, 98], [197, 198])).toEqual(0);
  });

  test("case2", () => {
    expect(problem1([131, 132], [211, 212])).toEqual(1);
  });

  test("case3", () => {
    expect(problem1([99, 102], [211, 212])).toEqual(-1);
  });
  test("case4", () => {
    expect(problem1([undefined, 101], [102, 103])).toEqual(-1);
  });
  test("case5", () => {
    expect(problem1([101, 102], [101, 102])).toEqual(0);
  });
  test("case6", () => {
    expect(problem1([102, 103], [105, 106])).toEqual(-1);
  });
});
```
### 해설
입력의 유효성을 검증하는 부분을 좀 더 다듬었다.   `else`의 `if`화를 통해 입력이 반드시 있어야 하는 범위 안에 존재할 수 있도록 하는데 집중했다. 주석을 달면서 생각을 정리하며 코드를 작성하니 좀 더 매끄럽게 전개할 수 있었다.

---
## PROBLEM2
## [🚀 기능 요구 사항](https://github.com/gihwan-dev/javascript-onboarding/blob/main/docs/PROBLEM2.md#-%EA%B8%B0%EB%8A%A5-%EC%9A%94%EA%B5%AC-%EC%82%AC%ED%95%AD)

암호문을 좋아하는 괴짜 개발자 브라운이 이번에는 중복 문자를 이용한 새로운 암호를 만들었다. 예를 들어 "browoanoommnaon"이라는 암호문은 다음과 같은 순서로 해독할 수 있다.

1. "browoanoommnaon"
2. "browoannaon"
3. "browoaaon"
4. "browoon"
5. "brown"

임의의 문자열 cryptogram이 매개변수로 주어질 때, 연속하는 중복 문자들을 삭제한 결과를 return 하도록 solution 메서드를 완성하라.

### [제한사항](https://github.com/gihwan-dev/javascript-onboarding/blob/main/docs/PROBLEM2.md#%EC%A0%9C%ED%95%9C%EC%82%AC%ED%95%AD)

- cryptogram은 길이가 1 이상 1000 이하인 문자열이다.
- cryptogram은 알파벳 소문자로만 이루어져 있다.

### [실행 결과 예시](https://github.com/gihwan-dev/javascript-onboarding/blob/main/docs/PROBLEM2.md#%EC%8B%A4%ED%96%89-%EA%B2%B0%EA%B3%BC-%EC%98%88%EC%8B%9C)

| cryptogram        | result  |
| ----------------- | ------- |
| "browoanoommnaon" | "brown" |
| "zyelleyz"        | ""      |

### 테스트 통과 코드 ver 1.0
```js
function problem2(cryptogram) {
  // 입력값 길이가 1 이상 1000 이하인 문자열이다.
  // 입력값은 알파멧 소문자로만 이루어져 있다.
  if (cryptogram === "") {
    return "";
  }

  const transformedCrypto = cryptogram.split("");
  return decodingCrypto(transformedCrypto);
}

module.exports = problem2;

function decodingCrypto(cryptogram) {
  let target = cryptogram;
  let isChanged = true;
  let result = [];
  while (isChanged) {
    isChanged = false;
    let end = target.length - 1;
    for (let i = 0; i <= end; i++) {
      if (i === 0) {
        result.push(target[0]);
      } else if (result[result.length - 1] === target[i]) {
        isChanged = true;
        result.pop();
        continue;
      } else {
        result.push(target[i]);
      }
    }
    target = result;
    result = [];
  }
  return target.join("");
}

console.log(problem2("browoanoommnaon"));
console.log(problem2("zyelleyz"));

```
### 해설
이 문제를 풀때는 주어진 입력값 자체는 잘 제한되어 있다고 생각했다. 그래서 입력되는 값에 대한 유효성 검증은 필요 없다는 생각이 들었고 로직을 완성하는데 집중했다. 우선 입력으로 들어온 문자열을 `split`함수를 통해 배열로 만들어 줬다.

이후 이 배열을 돌면서 `result`라는 변수에 처음부터 담는다. -> 만약 `result`에 삽입된 마지막 변수가 지금 현제 순회하는 변수와 같은 값을 가진다면 `result`의 마지막 변수를 `pop`하고 `isChanged` 변수를 `true`로 설정한다. 이렇게 해서 중복되어 사라지는 요소가 없을 때 까지 순회한다.

조금 더 가독성 좋은 해결법이 없을까 생각해봐야겠다.