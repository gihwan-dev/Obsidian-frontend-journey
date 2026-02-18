---
type: blog-post
source: velog
author: "koreanthuglife"
title: "자바스크립트에서 가장 빠른 반복문 (feat. for...of, for...in, forEach, for)"
slug: "자바스크립트에서-가장-빠른-반복문-feat.-for...of-for...in-forEach-for"
velogId: "c83fdf77-7d9e-44cc-9f47-34a2d010f9f2"
velogUrl: "https://velog.io/@koreanthuglife/자바스크립트에서-가장-빠른-반복문-feat.-for...of-for...in-forEach-for"
published: "2024-01-17T06:48:52.393Z"
updated: "2026-02-07T16:24:23.613Z"
tags:
  - "JavaScript"
description: "자바스크립트에서 문제를 풀다가 갑자기 이런 생각이 들었다. 가장 빠른 반복문은 뭘까?직접 테스트 해봤다.딱 순회하는 속도만 체크했다. 결과는 다음과 같았다.문자열을 반복해보자join메서드로 문자열로 변환한 뒤 실행해봤다. 결과는 다음과 같다:거의 순서는 동일하다. 그러"
importedAt: "2026-02-18T07:28:49.893Z"
---

자바스크립트에서 문제를 풀다가 갑자기 이런 생각이 들었다. `가장 빠른 반복문은 뭘까?`

직접 테스트 해봤다.
```javascript
const values = [];

for (let i = 0; i < 10000000; i++) {
  values.push(i);
}

// for 루프 사용
console.time("for loop");
for (let i = 0; i < values.length; i++) {}
console.timeEnd("for loop");

// for...of 루프 사용
console.time("for...of loop");
for (const char of values) {}
console.timeEnd("for...of loop");

// for...in 루프 사용
console.time("for...in loop");
for (const char in values) {}
console.timeEnd("for...in loop");

// forEach 사용 (문자열을 배열로 변환)
console.time("forEach loop");
values.forEach((char) => {});
console.timeEnd("forEach loop");
```
딱 순회하는 속도만 체크했다. 결과는 다음과 같았다.
```
for loop: 5.406ms => 1등
forEach loop: 62.792ms => 2등
for...of loop: 81.087ms => 3등
for...in loop: 931.712ms => 심각한 꼴등
```

문자열을 반복해보자
```js
const values = [];

for (let i = 0; i < 10000000; i++) {
  values.push(i);
}

values.join("");

// for 루프 사용
console.time("for loop");
for (let i = 0; i < values.length; i++) {}
console.timeEnd("for loop");

// for...of 루프 사용
console.time("for...of loop");
for (const char of values) {
}
console.timeEnd("for...of loop");

// for...in 루프 사용
console.time("for...in loop");
for (const char in values) {
}
console.timeEnd("for...in loop");

// forEach 사용 (문자열을 배열로 변환)
console.time("forEach loop");
values.forEach((char) => {});
console.timeEnd("forEach loop");
```
`join`메서드로 문자열로 변환한 뒤 실행해봤다. 결과는 다음과 같다:
```
for loop: 17.69ms
forEach loop: 60.775ms
for...of loop: 77.72ms
for...in loop: 919.833ms
```
거의 순서는 동일하다. 그러나 문자열로 변경했을 때 for loop의 순회 속도가 약간 느려지긴 했다. 계속 돌려봤지만 이 순서에는 변화가 없었다.

## 왜?

**for 루프:**
- 가장 기본적이고 저수준의 순회 방법이다.
- 실행 속도가 빠르고, 메모리 할당이나 추가 함수 호출이 없기 때문에 오버헤드가 거의 없다.
- 인덱스를 통한 직접적인 접근 방식이므로, CPU 캐시 활용이 효율적이다. 즉, 각 반복에서 메모리에 직접 접근하여 해당 문자를 빠르게 가져온다.

**for...of 루프:**
- ES6에서 도입된 현대적인 순회 방식으로, 이터러블 객체에 대해 사용된다.
내부적으로 이터레이터 객체를 생성하고, 이터레이터 프로토콜을 통해 문자열의 각 문자에 접근한다.
- 이 과정에서 발생하는 추가적인 객체 생성과 함수 호출로 인해 for 루프보다 약간 느릴 수 있다. 하지만 이 방법은 가독성이 뛰어나고 현대적인 자바스크립트의 표준에 부합한다.

**forEach 메소드:**
- 배열 메소드로, 배열의 각 요소에 대해 주어진 콜백 함수를 실행한다.
- 콜백 함수 호출과 관련된 오버헤드가 존재하며, 함수의 스코프와 관련된 추가적인 처리가 필요할 수 있다.
forEach는 함수형 프로그래밍 스타일에 잘 맞으며, 다른 배열 메소드와의 체이닝에
유용하다.

**for...in 루프:**
- 객체의 모든 열거 가능한 속성을 순회하기 위해 사용된다.
- 문자열에서 사용할 경우, 모든 프로퍼티(인덱스 및 다른 내장/사용자 정의 프로퍼티)를 순회한다.
- 문자열을 배열이나 기타 컬렉션처럼 다루는 것이 아니기 때문에 비효율적이다. 또한, 문자열의 - 실제 문자나 배열을 순회하는 것이 목적일 때 이 방법은 많은 불필요한 속성을 확인하게 되어 성능이 매우 느려진다.

이러한 각 순회 방법의 특징과 내부 작동 방식으로 인해 성능 차이가 발생한다. 일반적으로 for 루프는 가장 빠르고 효율적인 방법이지만, 코드의 가독성이나 특정 상황에 적합한 방법을 선택할 때는 성능 외의 다른 요소들도 고려해야 한다. 예를 들어, for...of 루프는 가독성이 뛰어나고 현대적인 자바스크립트 스타일에 부합하며, forEach는 함수형 프로그래밍에 적합하고 다른 배열 메소드와의 체이닝에 유용하다. for...in 루프는 문자열이나 배열 순회에는 권장되지 않는다.

## 언제 어떤걸 사용하지?
**forEach:**
- 배열을 순회할 때 주로 사용된다.
- 배열의 각 요소에 대해 주어진 콜백 함수를 실행한다.
- 콜백 함수는 배열의 각 요소, 인덱스, 배열 자체를 인자로 받을 수 있다.
- 배열을 순회하면서 각 요소에 대해 특정 작업을 수행하고자 할 때 유용하다.
- 단점: break나 continue를 사용할 수 없으며, return을 사용해도 외부 함수에서 탈출하지 않습니다.

**for...in:**
- 객체의 모든 열거 가능한 속성을 순회할 때 사용된다.
- 객체의 키(속성명)를 순회하며, 주로 객체의 속성에 접근하거나 수정할 때 사용된다.
- 배열에 사용할 수도 있지만, 배열의 인덱스 외에도 프로토타입 체인 상의 모든 열거 가능한 속성을 순회하므로 권장되지 않는다.
- 객체의 속성을 순회하고 조작해야 할 때 적합하다.

**for...of:**
- ES6에서 도입된 반복문으로, 이터러블 객체(예: 배열, 문자열, 맵, 세트 등)를 순회할 때 사용된다.
- 객체의 값에 직접 접근하여 순회한다.
- for...in과 달리 배열에 안전하게 사용할 수 있으며, 배열의 실제 요소값에만 접근한다.
`break
, continue, return` 등을 사용할 수 있어 루프를 더 유연하게 제어할 수 있다.
- 배열, 문자열, 그리고 다른 이터러블 객체를 순회하며 각 요소에 대한 작업을 수행할 때 매우 유용하다.

`언제 어떤 것을 사용해야 할까?`

배열에 대한 작업: 일반적으로 배열을 순회할 때는 forEach 또는 for...of를 사용한다. 배열의 각 요소에 대해 특정 작업을 수행해야 하고 루프를 중간에 중단할 필요가 없다면 `forEach`가 적합하다. 루프를 중간에 탈출하거나 더 전통적인 루프 제어가 필요하다면 for...of를 사용하는 것이 좋다.

객체 속성에 대한 작업: 객체의 모든 열거 가능한 속성을 순회해야 할 때는 for...in을 사용한다. 객체의 속성을 순회하고, 각 속성에 접근하거나 조작해야 하는 경우에 적합하다.

이터러블 객체에 대한 작업: 문자열, 맵, 세트 등 이터러블 객체를 순회할 때는 for...of가 가장 적합하다. 이터러블 프로토콜을 따르는 모든 객체를 효과적으로 순회할 수 있다.

결국, 사용 상황과 필요에 따라 가장 적합한 순회 방법을 선택해야 한다. 가독성, 성능, 그리고 코드의 명확성을 고려하여 결정하면 된다
