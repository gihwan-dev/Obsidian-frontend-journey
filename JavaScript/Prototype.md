객체지향 프로그래밍에서 `상속(inheritance)`는 핵심 개념으로, 어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는 것을 말한다.
자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거한다.

다음 예제를 보자
```js
function Circle(radius) {
	this.radius = radius;
	this.getArea = function () {
		return Math.PI * this.radius ** 2;
	};
}

const circle1 = new Circle(1);
const circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea); // false

console.log(circle1.getArea()); // 3.14....
console.log(circle2.getArea()); // 12.25...
```

위 예제의 생성자 함수는 문제가 있다.

Circle 생성자 함수가 생성하는 모든 인스턴스는 `radius`프로퍼티와 `getArea` 메서드를 갖는다. `getArea`메서드는 모든 인스턴스가 동일한 내용의 메서드를 사용하므로 단 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.
![[Pasted image 20231008180820.png]]
동일한 생성자 함수에 의해 생성된 모든 인스턴스가 동일한 메서드를 중복 소유하는 것은 메모리를 불필요하게 낭비한다. 또한 인스턴스를 생성할 때마다 메서드를 생성하므로 퍼포먼스에도 악영향을 준다.

```js
function Circle(radius) {
	this.radius = radius;
}

Circle.prototype.getArea = function () {
	return Math.PI * this.radius ** 2;
};

const circle1 = new Circle(1);
const circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea);

console.log(circle1.getArea());
console.log(circle2.getArea());
```
![[Pasted image 20231008181738.png]]
`Circle` 생성자 함수가 생성한 모든 인스턴스는 자신의 `Prototype`의 모든 프로퍼티와 메서드를 상속받는다.

## 프로토타입 객체
`Prototype`은 자바스크립트에서 상속을 구현하기위해 사용된다.

모든 객체는 `[[Prototype]]`이라는 내부 슬롯을 가지며, 이 내부 슬롯의 값은 `prototype`의 참조(`null`인 경우도 있다.)다. `[[Prototype]]`에 저장되는 `prototype`은 객체 생성 방식에 의해 결정된다. 즉, 객체가 생성될 때 객체 생성 방식에 따라 `prototype`이 결정되고 `[[Prototype]]`에 저장된다.

모든 객체는 하나의 `prototype`을 갖는다. 그리고 모든 `prototype`은 생성자 함수와 연결되어 있다. 즉, 객체와 `prototype`과 생성자 함수는 다음 그림과 같이 서로 연결되어 있다.

| 그림                                 | 설명                                                                  |
| ------------------------------------ | --------------------------------------------------------------------- |
| ![[Pasted image 20231008183048.png]] | 다음과 같이 `객체`, `프로토타입`, `생성자 함수`는 서로 연결되어 있다. |
`[[Prototype]]` 내부 슬롯에 직접 접근할 수 없지만, `__proto__` 접근자 프로퍼티를 통해 자신의 프로토타입, 즉 `[[Prototype]]` 내부 슬롯이 가리키는 `프로토타입`에 간접적으로 접근할 수 있다.
### `__proto__` 접근자 프로퍼티
## 참조
[[Prototype drawing]]

