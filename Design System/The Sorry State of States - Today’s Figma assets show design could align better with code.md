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

