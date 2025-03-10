## 캔버스

CSS2 사양에 따르면 캔버스는 "서식 구조가 표현되는 공간" 이라고 한다. 브라우저가 내용을 그리는 공간이다.

캔버스는 기본적으로 투명하다.  다른 캔버스와 겹치는 경우 비쳐 보이고, 투명하지 않을 경우에는 브라우저에서 정의한 색이 지정된다.

## 박스 모델

CSS 박스 모델은 문서 트리에 있는 요소를 위해 생성되고 시각적 서식 모델에 따라 배치된 사각형 박스를 설명한다.

각 박스는 콘텐츠 영역(문자, 이미지)과 선택적인 패딩과 테두리, 여백이 있다.

![[Pasted image 20241128092050.png]]

![[Pasted image 20241128092032.png]]

 모든 요소는 박스의 유형을 결정하는 `display` 속성을 갖는다.
 - **block**: 블록 상자를 만든다.
 - **inline**: 하나 또는 그 이상의 인라인 상자를 만든다.
 - **none**: 박스를 만들지 않는다.

모든 HTML 요소는 기본값을 가지고 있다.

- 블록 레벨 요소: div, h1 - h6, p, form, header, footer, section
- 인라인 요소: a, span, img

## 위치 결정 방법

1. **Normal** - 문서 안의 자리에 따라 위치가 결정된다. 객체의 자리가 DOM 트리의 자리와 같고 박스 유형과 면적에 따라 배치된다.
2. **Float** - 일반적인 흐름에 따라 배치된 다음 왼쪽이나 오른쪽으로 흘러 이동한다.
3. **Absolute** - DOM 트리 자리와 다른 렌더 트리에 놓인다.

위치는 `position` 속성과 `float` 속성에 의해 결정된다.

- `static`과 `relative`로 설정하면 일반적인 흐름에 따라 위치가 결정된다.
- `absolute`와 `fixed`로 설정하면 절대적인 위치가 된다.

## 박스 유형

### 블록 박스

브라우저 창에서 사각형 블록을 형성한다.

![[Pasted image 20241128094758.png]]


### 블록 박스

블록이 되지 않고 블록 내부에 포함된다.

![[Pasted image 20241128095019.png]]

### 블록과 인라인 배치

블록은 다른 블록 아래 수직으로 배치되고 인라인은 수평으로 배치된다.

![[Pasted image 20241128101430.png]]

### 라인 박스

인라인 박스는 라인 또는 "라인 박스" 안쪽에 놓인다. 너비가 충분하지 않으면 몇 줄의 라인 으로 인라인이 배치될 수 있다.

![[Pasted image 20241128101629.png]]

## 위치 잡기

### relative

상대적 위치는 일반적인 흐름에 따라 배치된 후 필요한 만큼 이동한다.

![[Pasted image 20241128101725.png]]

### float

플로트 박스는 라인의 왼쪽 또는 오른쪽으로 이동한다. 다른 박스가 이 주변을 흐른다.

![[Pasted image 20241128101917.png]]

### absolute와 fixed

일반적인 흐름과 무관하게 결정된다. 면적은 부모에 따라 상대적이다. fixed의 경우 뷰포트를 기준으로 위치를 결정한다.

## layer

`z-index` 속성을 통해 명시된다. 층은 박스의 3차원 표현이며 "z 축"을 따라 위치를 정한다.

박스는 stacking context로 구분된다. 스택에서 바닥에 가까운 요소가 먼저 그려지고 위쪽에 있을수록 나중에 그려진다. 앞쪽에 있는 요소가 뒤쪽에 있는 요소를 가린다.
