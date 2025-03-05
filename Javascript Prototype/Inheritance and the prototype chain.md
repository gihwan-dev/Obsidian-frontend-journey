> [원문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

프로그래밍에서 _inheritance_(상속)는 부모로부터 자식에게 특성을 전달하여 새로운 코드가 기존 코드의 기능을 재사용하고 확장할 수 있게 하는 것을 의미합니다. JavaScript는 객체를 사용하여 상속을 구현합니다. 각 객체는 _prototype_(프로토타입)이라 불리는 다른 객체에 대한 내부 링크를 가지고 있습니다. 이 프로토타입 객체도 자신만의 프로토타입을 가지며, 이는 `null`을 프로토타입으로 가진 객체에 도달할 때까지 계속됩니다. 정의에 따르면, `null`은 프로토타입을 가지지 않으며 이 **prototype chain**(프로토타입 체인)의 최종 링크 역할을 합니다. 프로토타입 체인의 어떤 멤버든 변경하거나 심지어 런타임에 프로토타입을 교체하는 것도 가능하므로, 정적 디스패칭(static dispatching)과 같은 개념은 JavaScript에 존재하지 않습니다.

JavaScript는 동적이며 정적 타입이 없기 때문에 Java나 C++과 같은 클래스 기반 언어에 익숙한 개발자들에게는 다소 혼란스러울 수 있습니다. 이러한 혼란은 종종 JavaScript의 약점으로 여겨지지만, 프로토타입 기반 상속 모델 자체는 사실 고전적인 모델보다 더 강력합니다. 예를 들어, 프로토타입 모델 위에 고전적인 모델을 구축하는 것은 상당히 간단한데, 이것이 바로 클래스가 구현되는 방식입니다.

비록 클래스가 이제 널리 채택되고 JavaScript에서 새로운 패러다임이 되었지만, 클래스는 새로운 상속 패턴을 가져오지 않습니다. 클래스는 대부분의 프로토타입 메커니즘을 추상화하지만, 프로토타입이 내부적으로 어떻게 작동하는지 이해하는 것은 여전히 유용합니다.

## 프로토타입 체인을 통한 상속


### 프로퍼티 상속하기
JavaScript 객체는 속성들의 동적인 "가방"입니다(이를 **own properties**(자체 속성)라고 합니다). JavaScript 객체는 프로토타입 객체에 대한 링크를 가지고 있습니다. 객체의 속성에 접근하려고 할 때, 해당 속성은 객체 자체뿐만 아니라 객체의 프로토타입, 프로토타입의 프로토타입 등에서도 찾게 됩니다. 이는 일치하는 이름의 속성을 찾거나 프로토타입 체인의 끝에 도달할 때까지 계속됩니다.

> [!Note] 참고
> ECMAScript 표준에 따르면, `someObject.[[Prototype]]` 표기법은 `someObject`의 프로토타입을 지정하는 데 사용됩니다. `[[Prototype]]` 내부 슬롯은 각각 `Object.getPrototypeOf()`와 `Object.setPrototypeOf()` 함수를 통해 접근하고 수정할 수 있습니다. 이는 JavaScript 접근자 `__proto__`와 동등한데, 이는 비표준이지만 많은 JavaScript 엔진에서 실질적으로 구현되어 있습니다. 혼란을 방지하면서도 간결하게 유지하기 위해, 우리의 표기법에서는 `obj.__proto__`를 사용하지 않고 대신 `obj.[[Prototype]]`을 사용할 것입니다. 이는 `Object.getPrototypeOf(obj)`에 해당합니다.
> 
> 이는 함수의 `func.prototype` 속성과 혼동되어서는 안 됩니다. `func.prototype`은 생성자로 사용될 때 해당 함수로 생성된 모든 _인스턴스_ 객체에 할당될 `[[Prototype]]`을 지정합니다. 생성자 함수의 `prototype` 속성에 대해서는 나중 섹션에서 논의할 것입니다.

객체의 `[[Prototype]]`을 지정하는 방법은 여러 가지가 있으며, 이는 나중 섹션에서 설명됩니다. 지금은 설명을 위해 `__proto__` 구문을 사용하겠습니다. `{ __proto__: ... }` 구문이 `obj.__proto__` 접근자와 다르다는 점을 기억해둘 필요가 있습니다. 전자는 표준이며 폐지되지 않았습니다.

객체 리터럴에서 `{ a: 1, b: 2, __proto__: c }`와 같은 경우, 값 `c`(이는 `null`이거나 다른 객체여야 함)는 해당 리터럴로 표현된 객체의 `[[Prototype]]`이 되고, `a`와 `b`와 같은 다른 키들은 객체의 _own properties_(자체 속성)가 됩니다. 이 구문은 `[[Prototype]]`이 단지 객체의 "내부 속성"이기 때문에 매우 자연스럽게 읽힙니다.

다음은 속성에 접근하려고 할 때 발생하는 일입니다:
```js
const o = {
  a: 1,
  b: 2,
  // __proto__는 [[Prototype]]을 설정합니다. 여기서는
  // 다른 객체 리터럴로 지정됩니다.
  __proto__: {
    b: 3,
    c: 4,
  },
};

// o.[[Prototype]]은 속성 b와 c를 가지고 있습니다.
// o.[[Prototype]].[[Prototype]]은 Object.prototype입니다(이것이
// 무엇을 의미하는지는 나중에 설명하겠습니다).
// 마지막으로, o.[[Prototype]].[[Prototype]].[[Prototype]]은 null입니다.
// 이것이 프로토타입 체인의 끝입니다. null은 
// 정의에 따라 [[Prototype]]을 가지지 않기 때문입니다.
// 따라서, 전체 프로토타입 체인은 다음과 같습니다:
// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> Object.prototype ---> null

console.log(o.a); // 1
// o에 'a'라는 자체 속성이 있나요? 네, 그 값은 1입니다.

console.log(o.b); // 2
// o에 'b'라는 자체 속성이 있나요? 네, 그 값은 2입니다.
// 프로토타입도 'b' 속성을 가지고 있지만, 방문되지 않습니다.
// 이를 속성 섀도잉(Property Shadowing)이라고 합니다.

console.log(o.c); // 4
// o에 'c'라는 자체 속성이 있나요? 아니오, 프로토타입을 확인합니다.
// o.[[Prototype]]에 'c'라는 자체 속성이 있나요? 네, 그 값은 4입니다.

console.log(o.d); // undefined
// o에 'd'라는 자체 속성이 있나요? 아니오, 프로토타입을 확인합니다.
// o.[[Prototype]]에 'd'라는 자체 속성이 있나요? 아니오, 프로토타입을 확인합니다.
// o.[[Prototype]].[[Prototype]]은 Object.prototype이고
// 기본적으로 'd' 속성이 없으므로, 프로토타입을 확인합니다.
// o.[[Prototype]].[[Prototype]].[[Prototype]]은 null이므로, 검색을 중단하고,
// 속성을 찾지 못했으므로 undefined를 반환합니다.
```

객체에 속성을 설정하면 자체 속성이 생성됩니다. 게터(getter)나 세터(setter)에 의해 가로채지는 경우를 제외하면, 속성 가져오기와 설정하기 동작 규칙에는 예외가 없습니다.

비슷하게, 더 긴 프로토타입 체인을 생성할 수 있으며, 속성은 이 모든 체인에서 찾게 됩니다.

```js
const o = {
  a: 1,
  b: 2,
  // __proto__는 [[Prototype]]을 설정합니다. 여기서는
  // 다른 객체 리터럴로 지정됩니다.
  __proto__: {
    b: 3,
    c: 4,
    __proto__: {
      d: 5,
    },
  },
};

// { a: 1, b: 2 } ---> { b: 3, c: 4 } ---> { d: 5 } ---> Object.prototype ---> null

console.log(o.d); // 5
```

### "메서드" 상속하기

JavaScript는 클래스 기반 언어가 정의하는 형태의 "메서드"를 가지고 있지 않습니다. JavaScript에서는 어떤 함수든 속성 형태로 객체에 추가될 수 있습니다. 상속된 함수는 다른 속성과 마찬가지로 작동하며, 위에서 보여준 속성 섀도잉(이 경우는 _메서드 오버라이딩_의 한 형태)도 포함됩니다.

상속된 함수가 실행될 때, `this`의 값은 함수가 자체 속성으로 있는 프로토타입 객체가 아니라 상속받는 객체를 가리킵니다.

```js
const parent = {
  value: 2,
  method() {
    return this.value + 1;
  },
};

console.log(parent.method()); // 3
// 이 경우 parent.method를 호출할 때, 'this'는 parent를 가리킵니다.

// child는 parent를 상속받는 객체입니다.
const child = {
  __proto__: parent,
};
console.log(child.method()); // 3
// child.method가 호출될 때, 'this'는 child를 가리킵니다.
// 따라서 child가 parent의 메서드를 상속받을 때,
// 'value' 속성은 child에서 찾게 됩니다. 그러나 child는
// 'value'라는 자체 속성이 없으므로, 이 속성은
// [[Prototype]]에서 찾게 되며, 이는 parent.value입니다.

child.value = 4; // child의 'value' 속성에 값 4를 할당합니다.
// 이는 parent의 'value' 속성을 섀도잉합니다.
// child 객체는 이제 다음과 같이 보입니다:
// { value: 4, __proto__: { value: 2, method: [Function] } }
console.log(child.method()); // 5
// child가 이제 'value' 속성을 가지고 있으므로, 'this.value'는
// parent.value 대신 child.value를 의미합니다.
```

## 생성자
프로토타입의 강력한 점은 모든 인스턴스에 존재해야 하는 속성 집합(특히 메서드)을 재사용할 수 있다는 것입니다. 각 상자가 `getValue` 함수를 통해 접근할 수 있는 값을 포함하는 일련의 상자들을 생성한다고 가정해 봅시다. 단순한 구현 방식은 다음과 같을 것입니다:

```js
const boxes = [
  { value: 1, getValue() { return this.value; } },
  { value: 2, getValue() { return this.value; } },
  { value: 3, getValue() { return this.value; } },
];
```

이는 최적이 아닙니다. 각 인스턴스가 동일한 기능을 수행하는 자체 함수 속성을 가지고 있어 중복되고 불필요하기 때문입니다. 대신, 모든 상자들의 `[[Prototype]]`으로 `getValue`를 이동시킬 수 있습니다:

```js
const boxPrototype = {
  getValue() {
    return this.value;
  },
};

const boxes = [
  { value: 1, __proto__: boxPrototype },
  { value: 2, __proto__: boxPrototype },
  { value: 3, __proto__: boxPrototype },
];
```

이런 방식으로, 모든 상자의 `getValue` 메서드는 동일한 함수를 참조하게 되어 메모리 사용량이 줄어듭니다. 하지만 객체를 생성할 때마다 수동으로 `__proto__`를 바인딩하는 것은 여전히 매우 불편합니다. 이때 _constructor_(생성자) 함수를 사용하게 되는데, 이는 제조되는 모든 객체에 대해 자동으로 `[[Prototype]]`을 설정합니다. 생성자는 `new`와 함께 호출되는 함수입니다.

```js
// 생성자 함수
function Box(value) {
  this.value = value;
}

// Box() 생성자로부터 생성된 모든 상자들이 가질
// 속성들
Box.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
```

`new Box(1)`는 `Box` 생성자 함수로부터 생성된 _instance_(인스턴스)라고 말합니다. `Box.prototype`은 이전에 생성한 `boxPrototype` 객체와 크게 다르지 않습니다 — 그저 평범한 객체일 뿐입니다. 생성자 함수로부터 생성된 모든 인스턴스는 자동으로 생성자의 `prototype` 속성을 자신의 `[[Prototype]]`으로 가집니다 — 즉, `Object.getPrototypeOf(new Box()) === Box.prototype`입니다. `Constructor.prototype`은 기본적으로 하나의 자체 속성인 `constructor`를 가지며, 이는 생성자 함수 자체를 참조합니다 — 즉, `Box.prototype.constructor === Box`입니다. 이를 통해 어떤 인스턴스에서든 원래의 생성자에 접근할 수 있습니다.

> [!Note] 참고
> 생성자 함수에서 비원시 값(non-primitive)이 반환되면, 그 값이 `new` 표현식의 결과가 됩니다. 이 경우 `[[Prototype]]`이 올바르게 바인딩되지 않을 수 있습니다 — 하지만 실제로는 이런 일이 많이 발생하지 않습니다.

위의 생성자 함수는 클래스를 사용하여 다음과 같이 다시 작성할 수 있습니다:

```js
class Box {
  constructor(value) {
    this.value = value;
  }

  // 메서드는 Box.prototype에 생성됩니다
  getValue() {
    return this.value;
  }
}
```

클래스는 생성자 함수에 대한 문법적 설탕(syntax sugar)으로, 여전히 `Box.prototype`을 조작하여 모든 인스턴스의 동작을 변경할 수 있습니다. 그러나 클래스는 기본 프로토타입 메커니즘에 대한 추상화로 설계되었기 때문에, 이 튜토리얼에서는 프로토타입이 어떻게 작동하는지 완전히 보여주기 위해 더 가벼운 생성자 함수 구문을 사용할 것입니다.

`Box.prototype`은 모든 인스턴스의 `[[Prototype]]`과 동일한 객체를 참조하기 때문에, `Box.prototype`을 변경하여 모든 인스턴스의 동작을 변경할 수 있습니다.

```js
function Box(value) {
  this.value = value;
}
Box.prototype.getValue = function () {
  return this.value;
};
const box = new Box(1);

// 인스턴스가 이미 생성된 후에 Box.prototype 변경하기
Box.prototype.getValue = function () {
  return this.value + 1;
};
box.getValue(); // 2
```

따라서, `Constructor.prototype`을 재할당(`Constructor.prototype = ...`)하는 것은 두 가지 이유로 좋지 않은 아이디어입니다:

- 재할당 전에 생성된 인스턴스의 `[[Prototype]]`은 이제 재할당 후에 생성된 인스턴스의 `[[Prototype]]`과 다른 객체를 참조하게 됩니다 — 하나의 `[[Prototype]]`을 변경해도 다른 것은 변경되지 않습니다.
- `constructor` 속성을 수동으로 다시 설정하지 않는 한, 생성자 함수는 더 이상 `instance.constructor`로부터 추적될 수 없으며, 이는 사용자의 기대를 깨뜨릴 수 있습니다. 일부 내장 연산은 `constructor` 속성을 읽기도 하는데, 이 속성이 설정되지 않으면 예상대로 작동하지 않을 수 있습니다.

`Constructor.prototype`은 인스턴스를 생성할 때만 유용합니다. 이는 생성자 함수의 _자체_ 프로토타입인 `Constructor.[[Prototype]]`과는 관련이 없으며, 이는 `Function.prototype`입니다 — 즉, `Object.getPrototypeOf(Constructor) === Function.prototype`입니다.