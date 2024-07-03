## 왜 Tailwind 일까?

### 좋은 프레임워크란?

1. 빠르게 개발할 수 있다.
2. 간편하게 변경할 수 있다.
3. 개발 생산성을 높여준다.

### Tailwind 가 해결하는 문제

1. CSS 속성을 일일이 작성하지 않아도 된다.
2. CSS 속성에 어떤 값을 사용할지 크게 고민하지 않아도 된다.
3. 네이밍에 대한 걱정이 없다.
4. 사용하지 않는 CSS 클래스를 정리하는데 리소스를 할당할 필요가 없다.

[# CSS Utility Classes and "Separation of Concerns"](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)

### Utility First 적근법

- 유틸리티 클래스들을 정의하고 이를 조합해 스타일을 구성하는 방식.
- 모든 CSS 속성들에 대해 유틸리티 클래스들이 촘촘하게 정의돼 있다.

> [!info] ARIA란 무엇인가?
> Accessible Rich Internet Applications: 접근성을 향상시키기 위한 기술 사양. HTML 보조 규칙


> [!info] data 속성이란?
> 어떤 임의의 속성 키 - 값을 생성해 할당할 수 있도록 해준다.

### Layer, Apply

기본 스타일을 적용할 수 있다.

```css
@layer base {
	h1 {
		@apply text-2xl;
	}
	h2 {
		@apply text-xl;
	}
}
```

같은 형식으로 사용한다. `h1` 은 `text-2xl` 을 페이지 전체에 적용하고, `h2` 는 `text-xl` 은 적용한다는 의미다.

유틸리티 클래스를 지정할 수 있다.

```css
@layer utilites {
	.content-auto {
		content-visibility: auto;
	}
}
```

### 지시어와 함수

```css
.content-area {
	height: cals(100vh - theme(spacing.12));
}
```

```css
@media screen(sm) {}
```

### 레이아웃

- container
	- 화면을 좌우로 꽉 채우지 않고, 분기점을 넘길 때마다 최대 너비를 고정하는 방식
	- `mx-auto` 를 통해 가운데 정렬
- display

> [!info] disblay: none vs visibility: hidden 차이점
> display: none; 을 하면 페이지에서 사라진다. visibility: hidden; 은 사라지지만 자리는 유지하게 된다.

- overflow
- position

### whitespace

- Normal: 줄바꿈 및 스페이스 유지 않함. 스페이스 여러개 나오면 하나로 합쳐지고, 줄바꿈은 하지않음.
- Pre: 스페이스, 줄바꿈이 적용됨. wrap 되지 않음. 너비를 넘어가면 overflow 됨.
- Pre wrap: 스페이스, 줄바꿈이 적용됨, wrap 되어 보여짐. 너비를 넘어가면 줄바꿈이 적용됨.
- Pre line: 줄바꿈만 유지함. 스페이스 여러개 오면 하나로 합쳐짐.

