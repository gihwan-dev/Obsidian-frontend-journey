> [원문](https://medium.com/@nathanacurtis/the-sorry-state-of-states-89dd4668737e)

몇 년 전, 저는 "Crafting component API together"라는 글을 작성했습니다. Figma는 당시 지배적인 디자인 도구가 되었고 지금도 그 위치를 유지하고 있으며, 유용하고 사용하기 쉬운 API로 컴포넌트를 구성하는 기능은 계속 강화되고 있습니다. 라이브러리들도 더 깊게 자리를 잡았습니다.

그러나 최고의 시스템 디자이너들조차도 코드가 실제로 작동하는 방식을 모방할 기회를 놓치고 있습니다. 이는 텍스트 입력(text input), 텍스트 영역(text area), 드롭다운(dropdown), 체크박스(checkbox), 라디오 버튼(radio button)과 같은 상호작용 요소들의 `state` 속성의 좋지 않은 상태에서 더욱 명확하게 드러납니다.

이 글에서는 디자인 시스템이 Figma 에셋에서 코드 작동 방식과 일치하지 않게 `states`를 구성하는 방식을 살펴봅니다. 텍스트 입력은 **부분적인 옵션 조합 세트(partial sets)**, **상호 의존적인 속성(interdependent props)**, **불리언 대 열거형 옵션(booleans versus enumerated)**, 그리고 Figma 에셋을 순수하게 모델링하기 위해 어디까지 나아가야 하는지(또는 나아가지 말아야 하는지)에 대한 교훈을 제공합니다.