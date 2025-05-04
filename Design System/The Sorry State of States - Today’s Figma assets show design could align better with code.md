> [원문](https://medium.com/@nathanacurtis/the-sorry-state-of-states-89dd4668737e)

몇 년 전, 저는 "Crafting component API together"라는 글을 작성했습니다. Figma는 당시 지배적인 디자인 도구가 되었고 지금도 그 위치를 유지하고 있으며, 유용하고 사용하기 쉬운 API로 컴포넌트를 구성하는 기능은 계속 강화되고 있습니다. 라이브러리들도 더 깊게 자리를 잡았습니다.

그러나 최고의 시스템 디자이너들조차도 코드가 실제로 작동하는 방식을 모방할 기회를 놓치고 있습니다. 이는 텍스트 입력(text input), 텍스트 영역(text area), 드롭다운(dropdown), 체크박스(checkbox), 라디오 버튼(radio button)과 같은 상호작용 요소들의 `state` 속성의 좋지 않은 상태에서 더욱 명확하게 드러납니다.

이 글에서는 디자인 시스템이 Figma 에셋에서 코드 작동 방식과 일치하지 않게 `states`를 구성하는 방식을 살펴봅니다. 텍스트 입력은 **부분적인 옵션 조합 세트(partial sets)**, **상호 의존적인 속성(interdependent props)**, **불리언 대 열거형 옵션(booleans versus enumerated)**, 그리고 Figma 에셋을 순수하게 모델링하기 위해 어디까지 나아가야 하는지(또는 나아가지 말아야 하는지)에 대한 교훈을 제공합니다.

## 오늘날 상태(States)의 현황
'States'는 디자이너와 개발자들이 다양한 상황에 적용하는 일반적인 용어입니다. Eric Bailey가 작성한 사용자 대면 상태(user facing states)의 긴 목록은 이를 잘 보여줍니다. 총 38개의 상태가 있으며, `rest`(기본), `hover`(호버), `active`(활성) 부터 `disabled`(비활성화), `readonly`(읽기 전용), `selected`(선택됨), `deselected`(선택 해제)까지, 그리고 `loading`(로딩 중), `ghost origin`(고스트 원본), `dirty`(변경됨)와 같은 덜 일반적인 상태들까지 포함됩니다.

![[Pasted image 20250504122428.png]]

호기심 많은 Chrome 사용자들은 텍스트 입력을 선택하고, 마우스 오른쪽 버튼을 클릭해 '검사(Inspect)'를 선택하면 다양한 요소 상태(`:active`, `:hover`, `:focus`, ...)를 발견할 수 있습니다. 여기에는 프론트엔드 개발자가 CSS 조합을 통해 활용할 수 있는 HTML 폼 유효성 검사 후크(`:disabled`, `:valid`, `:invalid`, ...)의 강력한 세트도 포함되어 있습니다.

![[Pasted image 20250504122457.png]]

문제는 '상태(states)'라는 용어가 지나치게 일반적이라는 점입니다. 모든 가능한 상태들이 단순히 대안적인 관계가 아닙니다. 대신, 사용 가능한 상태들은 종종 논리적 관계를 갖고 조합해서 사용되는 상호 의존적인 개념들이 뒤섞인 형태입니다.

그러나 디자인 검토 토론, 디자인 명세서 섹션 헤더, 특히 Figma 에셋 속성에서 사용될 때: `state`는 충분히 모델링되지 않은 아이디어들을 모두 담는 포괄적인 용어가 되어버립니다.

![[Pasted image 20250504122525.png]]

텍스트 입력의 경우, 당연히 `hover`(호버)와 `active`(활성) 상태를 보여줄 것입니다. 이를 고려할 때, 첫 번째 상태를 `base`(기본)(이렇게 하지 마세요), `default`(기본값)(괜찮음), `enabled`(활성화됨)나 `initial`(초기)(더 나음) 또는 `rest`(정지)(가장 좋을까요?)라고 부를지 고민하게 됩니다. 아니, 그냥 `resting`(휴지)으로 정하죠. 우리의 본능은 이 문제를 빨리 넘어가는 것입니다.

![[Pasted image 20250504123437.png]]

그러다 복잡한 상황이 발생합니다. `disabled`(비활성화됨)는 어떨까요? 물론, 필요합니다. 그리고 `readonly`(읽기 전용)는요? 아, 이건 생각하지 못했네요. 분명히 `error`(오류) 상태는 필수입니다. `states` 세트는 점차 늘어나다가 충분히 다뤘다고 만족할 때 안정화됩니다. 디자이너들이 "Eric Bailey의 모든 상태"를 다 해결하지 못한다고 해서 비난받을 일은 아닙니다. 저도 그런 적 없습니다. 그 목록은 정말 길거든요!

## Figma 에셋에서의 현재 상태(States)

저는 Figma 커뮤니티에 게시된 다음 디자인 시스템들의 `Text input` / `Input` / 기타 Figma 컴포넌트들을 조사했습니다:
- Material 3 Design Kit
- Material UI for Figma (및 MUI X)
- Salesforce Components for Web | Lightning Design System v1
- Github Primer Web
- IBM Carbon Design System
- Atlassian ADS Components
- Oracle Redwood
- Newskit Component Library
- Shopify Polaris Components

![[Pasted image 20250504123949.png]]

`state` 속성 패턴은 제가 컨설팅하는 팀들에서 관찰한 것과 일치했습니다:

- **Hover**: 10개 중 6개는 `state`:`hover`(또는 `state`:`hovered`) 옵션을 지원합니다.
- **Active**: 2개는 `state`:`active` 옵션을 지원합니다.
- **Focus**: 10개 중 8개는 `state`:`focus`를 지원하며, 별도의 불리언 속성으로 `focus`를 제공하는 경우는 없었습니다.
- **Disabled**: 10개 중 9개는 `state`:`disabled`를 지원하며, 오직 하나(Atlassian)만이 `isDisabled`를 별도의 불리언 속성으로 구분했습니다.
- **Read only**: 10개 중 6개는 `state`:`readonly`를 지원하며, 불리언 속성으로 `readonly`를 제공하는 경우는 없었습니다.
- **Error**와 **Success**: 10개 중 8개는 `state`:`error`(또는 유사하게 명명된 유효성 검사) 옵션을 지원하며, 하나(Atlassian)만이 `error`를 별도의 불리언 속성으로 제공했습니다.

컴포넌트들은 때때로 `warning`, `skeleton`, `typing`과 같은 다른 `state` 옵션들을 포함했습니다. 한 컴포넌트는 심지어 `filled`를 포함했는데, 이는 여기서 다루지 않는 `value`와 `placeholder` 속성의 인접 상태 문제로 흘러갑니다.

어떤 Figma 에셋도 `readonly` + `focus` 또는 `hover` + `error`와 같은 타당한 상태 조합을 지원하지 않았습니다.

## 코드 라이브러리에서의 현재 상태(States)

해당 라이브러리들의 `Text input` 컴포넌트 코드를 비슷하게 검토한 결과, 다른 주요 모델이 발견되었습니다:

- **Hover**와 **Active**: 대부분의 코드 라이브러리는 이러한 상태들을 사용자 상호작용에 반응하는 암시적 상태로 구현합니다.
- **Disabled**와 **Read only**: 거의 모든 코드 라이브러리가 이러한 props를 구현하며, 두 props 모두 관례적으로 여겨질 만큼 충분히 일반적입니다.
- **Error**와 **Success**: 많은 코드 라이브러리는 오류 표시를 위해 `error`(또는 `inInvalid`, `hasError` 등) 불리언 prop을 구현합니다. GitHub Primer는 이진(binary)에서 열거형(enumerated)으로 확장된 `validationStatus` prop을 통해 `error`와 `success`를 구분합니다. 일부 코드 라이브러리는 오류 텍스트를 위한 `error` prop을 구현합니다.

Shopify Polaris의 React 컴포넌트는 컴포넌트 전반에 걸친 의도적인 관례임을 시사하는 `disabled`와 `readonly`에 대한 Typescript 인터페이스를 구현합니다. 이 라이브러리는 또한 강제 적용 가능한 `focused`를 구현합니다.