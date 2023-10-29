`Jest`는 다양한 방법으로 테스트 할 수 있도록 하기 위해 `"matchers"`를 사용한다. 

## 주로 사용되는 `Matchers`
값이 일치하는지 확인하는 방법:
```js
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```
이 코드에서, `expect(2 + 2)` 는 `"expectation"` 객체를 반환한다. 이 `expectation` 객체를 다뤄서 뭔가 할 일은 거의 없고 이 객체와 `matchers`를 함께 사용하게 된다. 이 코드에서 `.toBe(4)` 가 `matcher`다. `Jest`를 실행시키면 실패한 `matcher`들을 추적하여 에러 메세지를 출력하여 보여준다.

`toBe`는 `Object.is` 를 사용한다. 만약 객체의 값을 확인하고 싶다면 `toEqual`을 사용해라.

```js
test('object assignment',  () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
})
```

`toEqual`을 재귀적으로 배열 또는 객체의 모든 필드를 확인한다.

> [!info] 
> `toEqual` 은 `undefined`를 키값으로 가지는 프로퍼티, 배열의 `undefined` 요소,  객체의 타입 불일치 등을 무시한다. 이러한 경우까지 확인하고 싶다면 `toStrictEqual`을 사용해라.

`not`을 이용해 반대의 경우도 확인할 수 있다:

```js
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```
## Truthiness
테스트에서, 종종 `undefined`, `null`, `false` 값을 구분해야할 필요가 있을 때가 있다. 하지만 때때로 이들을 다르게 다루고 싶지 않을 수도 있다. `Jest`는 원하는바를 명확히 할 수 있도록 도와준다.
- `toBeNull` 은 `null` 과 매치된다.
- `toBeUndefined`는 `undefined`와 매치된다.
- `toBeDefined`는 `toBeUndefined`의 반대다.
- `toBeTruthy`는 `if`문에서 `true`로 사용될 수 있는 어떤 문(statement)과도 매칭된다.
- `toBeFalsy` 는 `if` 문에서 `false` 로 사용될 수 있는 어떤 문(statement)과도 매칭된다.

예를들어:

```js
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toNeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```
가장 원하는 바를 명확하게 표현하는 `matcher`를 사용해야 한다.