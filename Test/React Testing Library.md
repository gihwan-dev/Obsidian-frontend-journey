- 그냥 단순한 라이브러리가 아니다. 철학에 가깝다.
	- 소프트웨어를 사용자가 실제로 사용하는 방식으로 테스트해라.
	- 테스트 ID가 아닌 접근성 마커를 통해 요소를 찾아라.

단순 하게는 이정도로 말할 수 있다.

## 테스트 라이브러리 종류
- Vitest: 코드를 테스트 한다.
- React Testing Library: DOM 시뮬레이터를 제공한다.

## TDD
- 통합 테스트: 여러 유닛이 보여 통합적인 일을 했을 때의 테스트. 사소한 단위의 테스트가 아니다 어떤 통합적인 기능에 대한 테스트다.
- 유닛 테스트: 하나하나의 개별 유닛에 대한 테스트다.

우선 테스트 코드를 작성한다. 예를들어 빈 로그인 폼 컴포넌트를 만들고 로그인 폼에 대한 테스트를 작성한다.
1. ~ 경우 로그인 되면 안된다.
2. 로그인에 성공하면 페이지 이동이 일어나야 한다.

개발을 하며 각 유닛을 만들 때도 테스트 코드를 작성하고 유닛을 만든다. 예를 들어 이메일 인풋 컴포넌트를 만든다 생각해보자.
1. 이메일이 유효하면 에러 텍스트가 보이지 않는다.
2. 이메일이 유효하지 않으면 에러 텍스트가 보인다.

이런식이다.

## 테스트 종류
- 유닛 테스트: 딱 하나의 독립된 코드에 대한 테스트다. 이 테스트는 다른 테스트와 소통하지 않는다.
- 통합 테스트: 여러 유닛 테스트가 소통하는 테스트다.
- 기능 테스트: 소프트웨어의 특정 기능에 대한 테스트다. 예를 들어 이메일 인풋에 잘못된 값이 들어오면 에러 텍스트가 보여야 한다 == 유닛 테스트 이기도 하지만 기능 테스트에 가깝다.

## 마인드 셋
코드 베이스를 테스트 하는게 아니라, 소프트웨어를 테스트 한다고 생각해라.

# 테스트 코드를 작성하는 일은 개발 이후 남은 귀찮은 일을 하는게 아닌 소프트웨어를 작성하는 프로세스의 일부다.

## RTL 에서 중요한 점
어떤 요소를 찾는데 사용하는 쿼리에 대한 우선순위가 있다. 유저의 행동을 중요하게 생각하기 때문이다. 다음 링크를 참고하자.
https://testing-library.com/docs/queries/about/#priority

요약하자면 접근성을 통해서 각 요소에 접근하는것을 권장한다.

`getByRole`의 role 에 대한 자료는 다음 링크에서 확인할 수 있다.
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles

## 테스트 코드 작성
1. 어떤 동작의 흐름에 따른 테스트를 한다. 예를 들어 다음과 같다:
	- button click flow
	- checkbox flow
2. 인터페이스를 기준으로 테스트 코드를 작성한다.

### 어떤 경우에 유닛 테스트가 적절한가?
케밥 케이스를 타이틀 케이스로 변경해주는 유닛 테스트를 작성 해 보았다. 그러나 이런 함수의 경우에는 버튼 클릭에 대한 기능 테스트에서 확인될 수 있다.

좀 더 복잡한 경우의 기능 테스트에서 유닛 테스트는 다음의 경우에 도움이 된다:
- 가능한 모든 엣지 케이스를 테스트 하고 싶은 경우.
- 어떤 이유로 기능 테스트가 실패하는지 알고싶을 때도 유용하다.

어떤 소프트웨어의 기능의 수준이 너무 높아서 진단하기 어려운 경우에 유닛 테스트를 작성하면 진단에 유용하다.

## Eslint, Prettier
`vitest`, `RTL` 에 대한 플러그인이 있다. Best Practice에 따라 테스트를 할 수 있게 도와준다.