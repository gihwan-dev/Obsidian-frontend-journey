---
type: blog-post
source: velog
author: "koreanthuglife"
title: "프로토타입 A to Z"
slug: "프로토타입-기반-프로그래밍with.-JS"
velogId: "9944e12c-aabc-45b4-9b46-56a5c9fa944b"
velogUrl: "https://velog.io/@koreanthuglife/프로토타입-기반-프로그래밍with.-JS"
published: "2025-03-08T09:31:46.869Z"
updated: "2026-02-07T16:23:27.387Z"
tags:
  - "JavaScript"
  - "OOP"
  - "Prototype"
description: "프로토타입의 역사부터 자바스크립트에서의 사용 예제까지 모든걸 조사해봤다."
importedAt: "2026-02-18T07:28:49.893Z"
---

오늘날 대부분의 개발자에게 객체 지향 프로그래밍(OOP)이라고 하면 Java나 C++과 같은 클래스 기반 언어를 떠올리는 것이 자연스럽다. 그러나 자바스크립트를 다루다 보면 `prototype`이라는 낯선 개념을 마주하게 된다. 이 글에서는 객체 지향 프로그래밍의 두 가지 주요 패러다임인 클래스 기반 접근법과 프로토타입 기반 접근법의 역사적 배경과 철학적 기반을 탐구해보고자 한다.

## 객체 지향 프로그래밍의 본질은 무엇인가?

![](https://velog.velcdn.com/images/koreanthuglife/post/e097c324-9338-4ef2-8b77-572b7eb2f7f2/image.png)
Ivan Sutherland가 만든 획기적인 Sketchpad 애플리케이션은 **OOP의 초기 영감**이었다. 1961년과 1962년 사이에 개발되었으며 1963년 그의 Sketchpad 논문에서 발표되었다. 객체들은 오실로스코프 화면에 표시된 그래픽 이미지를 나타내는 데이터 구조였다. Ivan Sutherland가 그의 논문에서 **"masters"**라고 부른 객체는 동적 위임(dynamic delegates)을 통한 상속 기능을 갖추고 있었다. 어떤 객체든 **"master"**가 될 수 있었고, 객체의 추가 인스턴스는 "occurrences"라고 불렸다. Sketchpad의 masters는 **JavaScript의 프로토타입 상속(prototypal inheritance)과 많은 공통점을 공유**한다.

일반적으로 "객체 지향적"이라고 널리 인정받은 최초의 프로그래밍 언어는 1965년에 명세된 **Simula**였다. Sketchpad와 마찬가지로 Simula는 객체를 특징으로 했으며, 클래스(classes), 클래스 상속(class inheritance), 서브클래스(subclasses) 및 가상 메서드(virtual methods)를 도입했다.

![](https://velog.velcdn.com/images/koreanthuglife/post/4d0c32b9-792a-4843-9d83-66f11d049d29/image.png)

> "제가 '객체 지향적'이라는 용어를 만들었는데, C++를 염두에 둔 것은 아니었습니다." - 앨런 케이, OOPSLA '97

Alan Kay는 1966년 또는 1967년 대학원에서 **"객체 지향 프로그래밍"**이라는 용어를 만들었다. 이에 대한 큰 아이디어는 직접적인 데이터 공유가 아닌 **메시지 전달(message passing)**을 통해 통신하는 캡슐화된 미니 컴퓨터를 소프트웨어에서 사용하는 것이었다 - 프로그램을 별도의 **"데이터 구조(data structures)"**와 **"프로시저(procedures)"**로 분리하는 것을 중단하기 위함이었다.

이는 흔히 우리가 생각하는 객체지향과는 다르다. 나도 객체지향을 떠올리면 당연하게도 **상속**이 가장 먼저 생각나는 단어였다.

이에 관해 Alan Kay는 다음과 같이 말했다.

> _"저는 오래 전에 이 주제에 대해 '객체(objects)'라는 용어를 만든 것에 대해 유감입니다. 이는 많은 사람들이 더 작은 아이디어에 집중하게 만들기 때문입니다. 큰 아이디어는 메시징(messaging, 객체 간 메시지 전달)입니다." ~ Alan Kay_

또한 2003년 Smaltalk(프로그래밍 언어)와 관련된 이메일 교환에서 Alan Kay는 다음과 같이 설명했다:

> _"OOP는 제게 오직 메시징(messaging), 상태-프로세스의 지역적 유지 및 보호와 숨김, 그리고 모든 것의 극단적인 지연 바인딩(extreme late-binding, 런타임에 결정되는 동적 바인딩)만을 의미합니다." ~ Alan Kay_

다시 말해, Alan Kay에 따르면 OOP의 필수 요소는 다음과 같다:

1. **메시지 전달(Message passing)**: 객체들이 서로 직접 데이터를 공유하는 대신 메시지를 통해 통신하는 것
2. **캡슐화(Encapsulation)**: 객체 내부 상태를 보호하고 숨기는 것
3. **동적 바인딩(Dynamic binding)**: 프로그램이 런타임에 진화하고 적응할 수 있는 능력

주목할 점은, 많은 사람들이 OOP의 핵심이라고 생각하는 **상속(inheritance)**이나 **서브클래스 다형성(subclass polymorphism)**을 필수 요소로 생각하지 않았다는 것이다.

메시지 전달과 캡슐화의 조합은 몇 가지 중요한 목적을 제공한다:

- **공유 가능한 상태(shared mutable state) 방지** - 상태를 캡슐화하고 다른 객체들을 지역 상태 변경으로부터 격리시킨다. 다른 객체의 상태에 영향을 미치는 유일한 방법은 메시지를 보내서 그 객체에게 변경하도록 요청(명령이 아닌)하는 것이다. 상태 변경은 공유 접근에 노출되기보다는 지역적, 셀룰러 수준에서 제어된다.
- **디커플링(Decoupling)** - 객체들을 서로 분리한다. 메시지 발신자는 메시징 API를 통해 메시지 수신자와 느슨하게 결합되어 있다.    
- **런타임에서의 적응성과 변화에 대한 탄력성** - 지연 바인딩(late binding)을 통해 제공된다. 런타임 적응성은 Alan Kay가 OOP에 필수적이라고 생각한 많은 중요한 이점을 제공한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/2bc74a2f-3898-4142-8d4d-0ca4bc881e69/image.png)

이러한 아이디어들은 Alan Kay의 생물학 배경과 Arpanet(인터넷의 초기 버전) 디자인의 영향을 통해 **생물학적 세포 및/또는 네트워크상의 개별 컴퓨터**에서 영감을 받았다. 그 초기에도 Alan Kay는 거대한 분산 컴퓨터(인터넷)에서 실행되는 소프트웨어를 상상했다. 여기서 개별 컴퓨터는 생물학적 세포처럼 작동하여 **자체적인 격리된 상태에서 독립적으로 작동하고 메시지 전달을 통해 통신**한다.

## 클래스 vs 프로토타입: 철학적 기반

객체지향 프로그래밍의 구현 방식은 크게 클래스 기반과 프로토타입 기반의 접근법이 있다. 이 두 가지 방식은 **서로 다른 철학적 배경**에서 출발했다.

### 추상적 집합 vs 구체적 예시

프로토타입 기반 프로그래밍은 루드비히 비트겐슈타인의 **가족 유사성 이론**에 근간을 두고 있다.

![](https://velog.velcdn.com/images/koreanthuglife/post/3e0d3fe8-d203-4d0a-b515-f5597ea6a102/image.png)

> *나는 이러한 유사점을 **" 가족적 유사점 "** 이라는 표현보다 더 잘 설명할 수 있는 표현을 생각해 낼 수 없다 . 왜냐하면 가족 구성원들 간의 다양한 유사점, 즉 체구, 특징, 눈 색깔, 걸음걸이, 기질 등등이 같은 방식으로 겹치고 교차하기 때문이다.* - 루드비히 비트겐슈타인

20세기 추상화 표현에 관한 철학적 논쟁으로 거슬러 올라가면, 루드비히 비트겐슈타인은 어떤 범주를 정의하는 데 필요한 정확한 특성을 미리 명시하기 어렵다는 점을 지적했다. 이에 그는 **'가족 유사성(family resemblance)'**이라는 개념을 제안했는데, 이는 특정 범주의 객체들이 여러 유사성으로 연결될 수 있지만, 반드시 그 범주의 모든 객체에 공통된 하나의 특징이 있어야 하는 것은 아니라고 주장한다.

이를 헨리 리버만이 1986년 그의 논문에서 **프로토타입과 위임**의 개념을 객체 지향 패러다임의 대안으로 제시하며 대중화했다. 리버만은 코끼리를 분류하려는 예시를 통해 프로토타입을 소개했다. 

이 예시는 코끼리를 한 번도 보거나 들어본 적이 없는 존이라는 개인을 고려한다. 만약 존이 밥이라는 이름의 코끼리를 만난다면, 존이 코끼리에 대해 생각할 때 밥을 떠올릴 것이다. 왜냐하면 그것이 존이 가진 유일한 구체적인 코끼리의 예시이기 때문이다. 만약 존이 그 후에 밥보다 작은 사라라는 다른 코끼리를 만난다면, 존은 사라를 밥과 비슷하지만 크기가 더 작은 것으로 분류할 것이다.

리버만의 예시는 프로토타입 기반 프로그래밍의 주요 아이디어가 **구체적인 예시를 사용해 객체를 표현**하고, 그 다음 **복제나 새로운 속성 추가를 통해 모델의 새로운 지식을 표현**하는 것임을 보여준다.

이러한 철학적 배경은 프로그래밍 패러다임에서도 두 가지 접근법으로 나타난다:

1. **집합 접근법(클래스 기반)**: 모든 코끼리의 공통 특성을 추상화한 '코끼리 클래스'를 먼저 정의하고, 개별 코끼리를 그 클래스의 인스턴스로 생성
2. **프로토타입 접근법**: Clyde라는 특정 코끼리를 전형적인 코끼리의 예시(프로토타입)로 삼고, 다른 코끼리들은 Clyde와의 차이점만을 명시

헨리 리버만은 **위임(delegation)**을 프로토타입 기반 시스템의 핵심 메커니즘으로 소개했다. 위임이란 객체가 자신이 처리할 수 없는 메시지나 요청을 프로토타입 객체에 전달하는 과정을 말한다.

리버만은 논문에서 다음과 같이 설명한다:

> *"위임은 메시지 처리를 한 객체에서 다른 객체로 전달할 수 있게 한다. 확장 객체가 메시지를 받으면, 먼저 개인적 부분에 저장된 동작을 사용하여 메시지에 응답하려고 시도한다. 만약 객체의 개인적 특성이 메시지에 답하는 데 관련이 없다면, 객체는 메시지를 프로토타입에 전달하여 하나가 메시지에 응답할 수 있는지 확인한다."*

이러한 위임 메커니즘은 상속보다 더 유연하다고 리버만은 주장했다. 클래스 기반 상속에서는 객체를 생성할 때 클래스 계층 구조가 고정되지만, 위임을 사용하면 객체 간의 관계가 런타임에 변경될 수 있기 때문이다.

**실제 논문에서 사용된 예시 그림**

|클래스 기반|프로토타입 기반|
|-|-|
|![](https://velog.velcdn.com/images/koreanthuglife/post/61bd7474-b63a-4fc0-b071-71f46b8a2740/image.png)|![](https://velog.velcdn.com/images/koreanthuglife/post/70c7f1a7-ff09-4104-8d9b-4e7ce33053db/image.png)

클래스 접근법에서는 코끼리 클래스에 필수 속성(다리 4개, 긴 코 등)을 정의하고, 모든 코끼리 인스턴스가 이 속성을 상속받는다. 반면 프로토타입 접근법에서는 Fred라는 다른 코끼리를 설명할 때 "Fred는 Clyde와 같지만 다리가 3개다"라고 할 수 있다.

### 학습과 적응 측면에서의 차이

프로토타입 접근법은 인간이 실제 세계에서 학습하는 방식과 더 유사하다. 우리는 일반적으로 추상적인 범주부터 배우는 것이 아니라, 구체적인 예시를 경험하고 그로부터 일반화한다. 프로토타입 시스템은 먼저 개별 객체를 만든 다음, 어떤 측면이 변할 수 있는지 명시함으로써 일반화 할 수 있게 한다.

또 다른 장점은 "기본값(defaults)"을 표현하는 데 더 적합하다는 것이다. 회색이 코끼리의 필수 특성이라고 정의했다면, 흰 코끼리를 설명하기 위해 예외를 만들어야 한다. 그러나 프로토타입 접근법에서는 단순히 "Fred는 Clyde와 같지만 색깔이 흰색이다"라고 말할 수 있다.

## 프로그래밍 언어에서의 구현: 상속 vs 위임

이러한 철학적 차이는 프로그래밍 언어에서 다음과 같이 구현된다:

### 클래스 기반(상속)

클래스 기반 접근법에서는 객체 세계를 **클래스**와 **인스턴스**로 나눈다:
- 클래스는 그룹 내 인스턴스 간에 공유되는 동작을 정의
- 인스턴스는 이 집합의 개별 멤버를 나타냄

```javascript
// 클래스 기반 접근 예시(ES6)
class Guitar {
    constructor(color, strings) {
        this.color = color;
        this.strings = strings;
    }
    
    play(chord) {
        return `Playing chord: ${chord}`;
    }
}

const myGuitar = new Guitar('Black', ['D', 'A', 'D', 'F', 'A', 'E']);
```

### 프로토타입 기반(위임)

프로토타입 기반 접근법에서는 클래스/인스턴스 구분이 필요 없다:
- **프로토타입은 개념에 대한 기본 동작**을 나타냄
- 새 객체는 프로토타입과의 차이점을 명시하여 **프로토타입에 저장된 지식을 재사용**

```javascript
// 프로토타입 기반 접근 예시
function Guitar(color, strings) {
    this.color = color;
    this.strings = strings;
}

Guitar.prototype.play = function(chord) {
    return `Playing chord: ${chord}`;
};

const myGuitar = new Guitar('Black', ['D', 'A', 'D', 'F', 'A', 'E']);
```

언뜻 보기에는 두 코드가 비슷해 보이지만, 내부 동작은 매우 다르다. 클래스 기반 접근법에서는 모든 메서드와 속성이 인스턴스 생성 시점에 복사되어 정적으로 결정된다. 반면 프로토타입 기반 접근법에서는 `play` 메서드를 호출할 때 해당 객체에서 먼저 찾고, 없으면 프로토타입 체인을 따라 올라가며 메서드를 찾는다.

![](https://velog.velcdn.com/images/koreanthuglife/post/aa8ebda7-54df-416e-93c0-a13cb1c14d90/image.png)

## 왜 자바스크립트는 프로토타입을 선택했나?

자바스크립트가 프로토타입 기반 언어로 설계된 이유에는 여러 가지가 있다:

1. **역사적 영향**: 자바스크립트는 `Self` 언어의 영향을 받았으며, `Self`는 1986년에 설계된 프로토타입 기반 언어였다.

2. **실행 환경의 특성**: 자바스크립트는 웹 브라우저에서 실행되는 인터프리터 언어다. 동적인 환경에서 실행 중에도 객체를 수정하고 확장할 수 있는 유연성이 중요했다.

3. **간결함과 표현력**: 프로토타입 접근법은 더 적은 수의 개념으로 강력한 표현력을 제공한다.


## 위임의 강점: 동적 확장과 적응성

위임(delegation)은 프로토타입 기반 언어의 핵심 메커니즘으로, 다음과 같은 장점을 제공한다:

### 1. 런타임 변경의 유연성

```javascript
// 모든 기존 Guitar 인스턴스에 영향을 미침
Guitar.prototype.tune = function() {
    return "Guitar is now tuned!";
};

// 이미 생성된 인스턴스도 새 메서드를 사용할 수 있음
console.log(myGuitar.tune()); // "Guitar is now tuned!"
```

이러한 방식으로 이미 존재하는 객체의 동작을 런타임에 변경할 수 있다. 이것은 클래스 기반 시스템에서는 훨씬 더 어렵거나 불가능하다.

### 2. 메모리 효율성

프로토타입 패턴은 메모리 사용에 있어 더 효율적일 수 있다. 클래스 기반 접근법에서는 각 인스턴스가 모든 메서드의 복사본을 가지게 되지만, 프로토타입 접근법에서는 모든 인스턴스가 동일한 메서드를 공유한다.

```javascript
// 비효율적인 방식
function Guitar(color, strings) {
    this.color = color;
    this.strings = strings;
    // 모든 인스턴스마다 play 함수의 복사본이 생성됨
    this.play = function(chord) {
        return `Playing chord: ${chord}`;
    };
}

// 효율적인 방식
function Guitar(color, strings) {
    this.color = color;
    this.strings = strings;
}
// 모든 Guitar 인스턴스가 동일한 함수를 공유
Guitar.prototype.play = function(chord) {
    return `Playing chord: ${chord}`;
};
```

### 3. 동적 위임의 유연성

프로토타입 기반 시스템의 가장 강력한 특징 중 하나는 객체가 메시지를 받는 시점에 통신 패턴을 결정할 수 있다는 것이다. 이는 런타임에 객체의 동작을 변경하고 적응시키는 데 더 큰 유연성을 제공한다.

## 프로토타입 접근법의 도전과 현대적 발전

물론 프로토타입 기반 프���그래밍에도 도전과제가 있다:

### 1. 학습 곡선

대부분의 프로그래머는 클래스 기반 언어에 더 익숙하기 때문에, 프로토타입 개념을 처음 접할 때 혼란을 겪는다. 자바스크립트에서는 이 문제를 완화하기 위해 ES6에서 `class` 구문을 도입했다. 이것은 근본적으로 프로토타입 메커니즘을 바꾸지는 않지만, 클래스 기반 언어에서 온 개발자들에게 더 친숙한 구문을 제공한다.

```javascript
// ES6 클래스 구문(내부적으로는 여전히 프로토타입 사용)
class Guitar {
    constructor(color, strings) {
        this.color = color;
        this.strings = strings;
    }
    
    play(chord) {
        return `Playing chord: ${chord}`;
    }
}
```

### 2. 성능 고려사항

프로토타입 체인을 따라 속성을 조회하는 것은 직접 액세스보다 더 많은 연산을 필요로 할 수 있다. 그러나 현대 자바스크립트 엔진은 이러한 조회를 최적화하기 위한 다양한 기법을 사용한다.

> 자바스크립트 엔진 최적화 관련 자료
[히든 클래스](https://v8.dev/docs/hidden-classes)

## 자바스크립트에서의 프로토타입

JavaScript에서는 모든것이 객체이며 모든 객체는 `prototype`이라 불리는 다른 객체에 대한 내부 링크를 가지고 있다. 그리고 이 프로토타입 객체도 자신만의 프로토타입을 가지며, 이는 `null`을 포로토타입으로 가진 객체에 도달할 때까지 계속된다. `null`은 프로토타입을 가지지 않으며 **프로토타입 체인의 종점** 역할을 한다.

### 프로퍼티 상속

JavaScript 객체는 속성들의 동적인 "가방"이다. 그리고 이 가방에 들어가는 다양한 속성들을 자체 속성(own properties)라고 한다. 객체의 속성에 접근하려고 할 때, 해당 속성은 객체 자체 뿐만 아니라 객체의 프로토타입, 프로토타입의 프로토타입 등에서도 찾게 된다. 이는 속성을 찾거나 체인의 끝에 도달할 때 까지 계속된다.

> **참고**
 ECMAScript 표준에 따르면, `someObject.[[Prototype]]` 표기법은 `someObject`의 프로토타입을 지정하는 데 사용된다. `[[Prototype]]` 내부 슬롯은 각각 `Object.getPrototypeOf()`와 `Object.setPrototypeOf()` 함수를 통해 접근하고 수정할 수 있다. 이는 JavaScript 접근자 `__proto__`와 동등한데, 이는 비표준이지만 많은 JavaScript 엔진에서 실질적으로 구현되어 있다. 혼란을 방지하면서도 간결하게 유지하기 위해, 우리의 표기법에서는 `obj.__proto__`를 사용하지 않고 대신 `obj.[[Prototype]]`을 사용할 것이다. 이는 `Object.getPrototypeOf(obj)`에 해당한다.
> 
> 이는 함수의 `func.prototype` 속성과 혼동되어서는 안된다. `func.prototype`은 생성자로 사용될 때 해당 함수로 생성된 모든 _인스턴스_ 객체에 할당될 `[[Prototype]]`을 지정한다.

다음은 객체의 속성에 접근하려할 때 일어나는 일이다:
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

여기서 `[[Ptototype]]`은 자바스크립트의 프로토타입 내부 슬롯을 의미한다. 내부 슬롯과 내부 메서드는 ECMAScript에서 정의한 의사 프로퍼티, 의사 메서드이다.

비슷하게, 더 긴 프로토타입 체인을 다음과 같이 생성할 수 있다:
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

메서드의 상속도 유사하게 진행될 수 있다:
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

### 생성자

프로토타입의 강력한 점은 모든 인스턴스에 존재해야 하는 속성 집합(특히 메서드)을 재사용할 수 있다는 것이다. 각 상자가 `getValue` 함수를 통해 접근할 수 있는 값을 포함하는 일련의 상자들을 생성한다고 가정해 보자. 단순한 구현 방식은 다음과 같을 것이다:

```js
const boxes = [
  { value: 1, getValue() { return this.value; } },
  { value: 2, getValue() { return this.value; } },
  { value: 3, getValue() { return this.value; } },
];
```

이는 최적이 아니다. 각 인스턴스가 동일한 기능을 수행하는 자체 함수 속성을 가지고 있어 중복되고 불필요하기 때문이다. 대신, 모든 상자들의 `[[Prototype]]`으로 `getValue`를 이동시킬 수 있다:

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

이런 방식으로, 모든 상자의 `getValue` 메서드는 동일한 함수를 참조하게 되어 메모리 사용량이 줄어든다. 하지만 객체를 생성할 때마다 수동으로 `__proto__`를 바인딩하는 것은 여전히 매우 불편하다. 이때 _생성자_(constructor) 함수를 사용하게 되는데, 이는 제조되는 모든 객체에 대해 자동으로 `[[Prototype]]`을 설정한다. 생성자는 `new`와 함께 호출되는 함수이다:

```js
// 생성자 함수
function Box(value) {
  this.value = value;
}

// Box() 생성자로부터 생성된 모든 상자들이 가질 속성들
Box.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
```

`new Box(1)`는 `Box` 생성자 함수로부터 생성된 _인스턴스_(instance)라고 부른다. `Box.prototype`은 이전에 생성한 `boxPrototype` 객체와 크게 다르지 않다 - 그저 평범한 객체일 뿐이다. 생성자 함수로부터 생성된 모든 인스턴스는 자동으로 생성자의 `prototype` 속성을 자신의 `[[Prototype]]`으로 가진다 - 즉, `Object.getPrototypeOf(new Box()) === Box.prototype`이다.

`Constructor.prototype`은 기본적으로 하나의 자체 속성인 `constructor`를 가지며, 이는 생성자 함수 자체를 참조한다 - 즉, `Box.prototype.constructor === Box`이다. 이를 통해 어떤 인스턴스에서든 원래의 생성자에 접근할 수 있다.

위의 생성자 함수는 클래스를 사용하여 다음과 같이 다시 작성할 수 있다:

```js
class Box {
  constructor(value) {
    this.value = value;
  }

  // 메서드는 Box.prototype에 생성됨
  getValue() {
    return this.value;
  }
}
```

클래스는 생성자 함수에 대한 문법적 설탕(syntax sugar)으로, 여전히 `Box.prototype`을 조작하여 모든 인스턴스의 동작을 변경할 수 있다.

`Box.prototype`은 모든 인스턴스의 `[[Prototype]]`과 동일한 객체를 참조하기 때문에, `Box.prototype`을 변경하여 모든 인스턴스의 동작을 변경할 수 있다:

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

### 리터럴의 암시적 생성자

JavaScript의 일부 리터럴 구문은 암시적으로 `[[Prototype]]`을 설정하는 인스턴스를 생성한다. 예를 들어:

```js
// 객체 리터럴(`__proto__` 키가 없는)은 자동으로
// `Object.prototype`을 자신의 `[[Prototype]]`으로 가짐
const object = { a: 1 };
Object.getPrototypeOf(object) === Object.prototype; // true

// 배열 리터럴은 자동으로 `Array.prototype`을 자신의 `[[Prototype]]`으로 가짐
const array = [1, 2, 3];
Object.getPrototypeOf(array) === Array.prototype; // true

// 정규식 리터럴은 자동으로 `RegExp.prototype`을 자신의 `[[Prototype]]`으로 가짐
const regexp = /abc/;
Object.getPrototypeOf(regexp) === RegExp.prototype; // true
```

이들을 생성자 형태로 "디슈가(de-sugar)"할 수 있다:

```js
const array = new Array(1, 2, 3);
const regexp = new RegExp("abc");
```

예를 들어, `map()`과 같은 "배열 메서드"는 단순히 `Array.prototype`에 정의된 메서드이며, 이것이 모든 배열 인스턴스에서 자동으로 사용할 수 있는 이유이다.

### 프로토타입 체인의 확장

더 긴 프로토타입 체인을 구축하기 위해, `Object.setPrototypeOf()` 함수를 통해 `Constructor.prototype`의 `[[Prototype]]`을 설정할 수 있다:

```js
function Base() {}
function Derived() {}
// `Derived.prototype`의 `[[Prototype]]`을
// `Base.prototype`으로 설정
Object.setPrototypeOf(Derived.prototype, Base.prototype);

const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

클래스 용어로는, 이는 `extends` 구문을 사용하는 것과 동등하다:

```js
class Base {}
class Derived extends Base {}

const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

### 성능 고려사항

프로토타입 체인 상위에 있는 속성의 조회 시간은 성능에 부정적인 영향을 미칠 수 있으며, 성능이 중요한 코드에서는 이것이 중요할 수 있다. 또한, 존재하지 않는 속성에 접근하려고 할 때는 항상 전체 프로토타입 체인을 탐색한다.

또한, 객체의 속성을 반복할 때, 프로토타입 체인에 있는 **모든** 열거 가능한 속성이 열거된다. 객체가 자신의 프로토타입 체인이 아닌 _자체_에 정의된 속성을 가지고 있는지 확인하려면, `hasOwnProperty` 또는 `Object.hasOwn` 메서드를 사용해야 한다:

```js
function Graph() {
  this.vertices = [];
  this.edges = [];
}

Graph.prototype.addVertex = function (v) {
  this.vertices.push(v);
};

const g = new Graph();
// g ---> Graph.prototype ---> Object.prototype ---> null

g.hasOwnProperty("vertices"); // true
Object.hasOwn(g, "vertices"); // true

g.hasOwnProperty("nope"); // false
Object.hasOwn(g, "nope"); // false

g.hasOwnProperty("addVertex"); // false
Object.hasOwn(g, "addVertex"); // false

Object.getPrototypeOf(g).hasOwnProperty("addVertex"); // true
```

### 프로토타입의 실제 활용: 네이티브 객체 확장

JavaScript에서는 내장 객체의 프로토타입을 확장하여 모든 인스턴스에 새로운 기능을 추가할 수 있다. 예를 들어, 모든 문자열에 `reverse` 메서드를 추가하려면 다음과 같이 할 수 있다:

```js
String.prototype.reverse = function() {
  return this.split('').reverse().join('');
};

console.log("hello".reverse()); // "olleh"
```

하지만 네이티브 프로토타입을 확장하는 것은 일반적으로 권장되지 않는다. 새로운 JavaScript 버전이나 다른 라이브러리가 동일한 이름으로 메서드를 도입할 경우 충돌이 발생할 수 있기 때문이다. 이러한 관행을 몽키 패칭(monkey patching)이라고 하며, 미래 호환성 문제를 일으킬 수 있다.

### 더 복잡한 프로토타입 체인 예제

다음은 동물 계층 구조를 구현하는 더 복잡한 예제이다:

```js
// 기본 동물 객체
function Animal(name) {
  this.name = name;
}

Animal.prototype.breathe = function() {
  return `${this.name}이(가) 숨을 쉽니다`;
};

// 포유류 객체
function Mammal(name) {
  // Animal 생성자 호출
  Animal.call(this, name);
}

// Mammal의 프로토타입을 Animal의 프로토타입에 연결
Mammal.prototype = Object.create(Animal.prototype);
// constructor 속성 복원
Mammal.prototype.constructor = Mammal;

// Mammal 프로토타입에 메서드 추가
Mammal.prototype.giveBirth = function() {
  return `${this.name}이(가) 새끼를 낳습니다`;
};

// 개 객체
function Dog(name, breed) {
  // Mammal 생성자 호출
  Mammal.call(this, name);
  this.breed = breed;
}

// Dog의 프로토타입을 Mammal의 프로토타입에 연결
Dog.prototype = Object.create(Mammal.prototype);
// constructor 속성 복원
Dog.prototype.constructor = Dog;

// Dog 프로토타입에 메서드 추가
Dog.prototype.bark = function() {
  return `${this.name}이(가) 짖습니다: 왈왈!`;
};

// 개 인스턴스 생성
const myDog = new Dog('멍멍이', '진돗개');

console.log(myDog.name);      // "멍멍이"
console.log(myDog.breed);     // "진돗개"
console.log(myDog.bark());    // "멍멍이이(가) 짖습니다: 왈왈!"
console.log(myDog.giveBirth()); // "멍멍이이(가) 새끼를 낳습니다"
console.log(myDog.breathe()); // "멍멍이이(가) 숨을 쉽니다"

// 프로토타입 체인 확인
console.log(myDog instanceof Dog);    // true
console.log(myDog instanceof Mammal); // true
console.log(myDog instanceof Animal); // true
```

이 예제에서 볼 수 있듯이, `myDog` 객체는 자신의 프로토타입 체인을 통해 `Dog`, `Mammal`, `Animal`의 모든 메서드에 접근할 수 있다. 이는 JavaScript에서 다중 ��속과 비슷한 기능을 구현하는 방법을 보여준다.

### ES6 클래스를 사용한 동일한 예제

위의 예제를 ES6 클래스 구문을 사용하여 다시 작성하면 다음과 같다:

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  breathe() {
    return `${this.name}이(가) 숨을 쉽니다`;
  }
}

class Mammal extends Animal {
  constructor(name) {
    super(name);
  }
  
  giveBirth() {
    return `${this.name}이(가) 새끼를 낳습니다`;
  }
}

class Dog extends Mammal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    return `${this.name}이(가) 짖습니다: 왈왈!`;
  }
}

const myDog = new Dog('멍멍이', '진돗개');

console.log(myDog.bark());    // "멍멍이이(가) 짖습니다: 왈왈!"
console.log(myDog.giveBirth()); // "멍멍이이(가) 새끼를 낳습니다"
console.log(myDog.breathe()); // "멍멍이이(가) 숨을 쉽니다"
```

이 코드는 이전 예제와 동일한 프로토타입 체인을 생성하지만, 더 간결하고 읽기 쉬운 구문을 제공한다. 내부적으로는 여전히 프로토타입 기반 상속을 사용하고 있다.


## 결론

OOP의 두 가지 주요 접근법인 클래스 기반과 프로토타입 기반은 각각 고유한 강점과 약점을 가지고 있다. 클래스 기반 접근법은 강력한 구조와 엄격한 타입 시스템을 제공하는 반면, 프로토타입 기반 접근법은 더 큰 유연성과 동적 적응성을 제공한다.

흥미롭게도 두 접근법은 점점 더 서로에게서 배우고 있다. 자바스크립트는 ES6에서 클래스 구문을 도입했고, 한편으로 Java와 C#과 같은 클래스 기반 언어들은 더 많은 동적 기능을 포함하도록 진화했다.

최종적으로, 특정 접근법이 "더 나은" 것이 아니라 각각 다른 상황과 요구사항에 더 적합하다고 볼 수 있다. 소프트웨어 설계에서 중요한 것은 문제 영역을 이해하고 그에 가장 적합한 도구와 패러다임을 선택하는 것이다.

프로토타입에 대해 조사하며, 자바스크립트에서의 OOP에 대해 바라보는 관점이 많이 달라졌다. 객체간의 상속보단 위임의 시선으로 바라보게 되었고, 연결된 객체를 사용한다는 관점으로 접근하게 되었다. Class 문법에 대해서도 많은 고민이 생겼다. 문법적 설탕이라 생각했지만, 자바스크립트 OOP에서의 새로운 패러다임이 아닐까 하는 생각을 하고있다. Prototype을 기반으로 동작한다는 특성은 변하지 않겠지만 상속과 위임 즉, 본질에서의 개념적인 차이가 있다는 생각을 하게 된것같다.

## 참고

- [Using Prototypical Objects to Impltement Shared Behavior in Object Oriented Systems](https://web.media.mit.edu/~lieber/Lieberary/OOP/Delegation/Delegation.html)
- [The Forgotten History of OOP](https://medium.com/javascript-scene/the-forgotten-history-of-oop-88d71b9b2d9f)
- [Prototype-based programming(Wikipedia)](https://en.wikipedia.org/wiki/Prototype-based_programming)
- [prototype-programming - mikeesto](https://github.com/mikeesto/prototype-programming/blob/master/README.md)
- [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
