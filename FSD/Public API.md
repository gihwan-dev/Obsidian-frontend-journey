> [원문](https://feature-sliced.design/docs/reference/public-api#public-api-for-cross-imports)

public API는 슬라이스와 같은 모듈 그룹과 그것을 사용하는 코드 사이의 *계약*이다. 또한 이것은 게이트 역할을 하여, 특정 객체들에 대한 접근을 오직 해당 public API를 통해서만 허용합니다.

실제로는, 보통 재 내보내기(re-exports)를 포함한 인덱스 파일로 구현된다:

```js
// pages/auth/index.js

export { LoginPage } from "./ui/LoginPage";
export { RegisterPage } from "./ui/RegisterPage";
```

## 좋은 public API란 무엇인가?
좋은 publicAPI는 슬라이스를 다른 코드에서 사용하고 통합하는 것을 편리하고 안정적으로 만든다. 이는 다음 세 가지 목표를 설정함으로써 달성할 수 있다:
1. 리팩토링과 같은 이유로 인한 슬라이스의 구조적 변경으로부터 애플리케이션의 나머지 부분이 보호되어야 한다.
2. 이전 코드의 동작을 크게 변경하는 변경은 public API의 변경을 유발해야 한다.
3. 슬라이스의 필요한 부분만 노출되어야 한다.

마지막 목표는 몇 가지 중요한 실질적인 의미를 가진다. 특히 슬라이스의 초기 개발 단계에서, 파일에서 내보내는 모든 새로운 객체들이 슬라이스에서도 자동으로 내보니지기 때문에 모든 것을 와일드카드로 재내보내기 하고 싶은 유혹이 있을 수 있다:
```js
// ❌ 안좋은 코드 예시
// features/comments/index.js

export * from "./ui/Comment";
export * from "./model/comments";
```

이는 슬라이스의 인터페이스가 무엇인지 쉽게 알 수 없기 때문에 슬라이스의 발견 가능성을 해친다. 인터페이스를 모른다는 것은 슬라이스를 어떻게 통합해야 하는지 이해하기 위해 코드를 깊이 파고들아 한다는 것을 의미한다. 또 다른 문제는 모듈의 내부를 실수로 노출할 수 있다는 것이다. 이는 누군가가 그것들에 의존하기 시작하면 리팩토링을 어렵게 만들것이라는걸 의미한다.

## Public API 순환 임포트
