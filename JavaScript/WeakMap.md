`WeakMap`은 키-값 형식으로 데이터를 저장한다. 하지만 일반적인 [[Map]] 과는 다른 특징을 몇 가지 가지고 있다.

## 주요 특징
1. **약한 참조**
	- `WeakMap`의 키는 객체여야 한다. 그리고 이 객체들에 대한 참조는 '약하게' 유지된다. 즉, 객체에 대한 다른 참조가 없어지면, 가비지 컬렉션의 대상이 될 수 있다. 이는 `WeekMap`이 키로 사용되는 객체에 대한 메모리 누수를 방지하는 데 도움이 된다.
2. 열거 불가능
	- `WeakMap`의 키-값 쌍은 열거할 수 없다. 즉 `WeakMap` 의 모든 키나 값에 접근하는 방법은 제공되지 않는다. 이는 보안 상의 이유로 유용할 수 있다.
3. API 제한:
	- `WeakMap`은 `set`, `get`, `has`, `delete` 메서드만 제공한다. `size` 속성이나 `clear` 메서드 등이 없다.
## 사용사례
`WeakMap`은 주로 개체와 관련된 추가 데이터를 저장할 때 사용된다. 예를 들어, 객체의 프라이빗 데이터를 저장하거나, 객체가 가비지 컬렉션에 의해 수집될 때 그와 연관된 데이터도 자동으로 정리되도록 할 때 유용하다.
## 예제
```js
let weakMap = new WeakMap();
let obj = {};

// 객체를 키로 사용하여 값 설정
weakMap.set(obj, "some value");

// 값 얻기
console.log(weakMap.get(obj)); // "some value"

// 객체에 대한 참조가 없어지면, 자동으로 가비지 컬렉션의 대상이 됨
obj = null;

// 이제 obj와 관련된 데이터는 WeakMap에서 제거될 수 있음
```