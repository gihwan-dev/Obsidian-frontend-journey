디자인 시스템은 디자이너와 개발자 간의 공유된 어휘를 달성하기 위해 노력합니다. 시각적 스타일과 UI 컴포넌트를 구축하면서, 우리는 기능이 어떻게 구성되고 설정되는지에 대해 많은 결정을 내립니다.

- 이름은 무엇인가?
- 각 요소는 계층 구조에서 어떻게 구성되고 이름이 지정되는가?
- 어떤 옵션이 구성될 수 있으며, 각각은 어느 수준에서 노출되는가?
- 작은 부분들은 어떻게 모듈화하여 다른 곳에서 재사용할 수 있는가?
- 이것은 그것을 호출하거나 포함하는 다른 것들과 어떻게 상호작용하는가?

답변들은 기능이 어떻게 작동하는지 제어하는 방법을 설정하기 위한 공식적인 애플리케이션 프로그래밍 인터페이스(API)로 이어집니다. 이러한 대화 중에 실무자들은 종종 "이름 짓기가 어렵다"고 한탄합니다. 비공개 메시지에는 😩, 🙄, 😤와 같은 이모티콘이 표현됩니다. 그럼에도 불구하고, 이러한 결정, 모델 및 규칙은 디자인 시스템이 작동하게 하는 중요한 부분입니다.

API는 오랫동안 개발자의 영역이었습니다. 그러나 디자인 시스템이 개발자와 디자이너를 위해 구축되고 문서화된 라이브러리 전반에 걸쳐 공유된 어휘를 제공한다면, API는 코드와 디자인 도구에서 가능한 한 유사해야 하지 않을까요? 팀원들이 서로 다른 정신적 모델과 그들을 다르게 구축하도록 (점점 덜?) 제약하는 각기 다른 매체를 가지고 있을 때 이는 어렵습니다.

디자인 도구는 오랫동안 코드와 다른 방식으로 컴포넌트의 구성과 설정을 가능하게 했습니다. 디자이너들은 API라고 부르지는 않았지만 수년간 디자인 도구에서 API를 조작해 왔습니다. 그들의 실무는 투박하고 단절되어 있었습니다. Sketch의 심볼 오버라이드가 떠오르는데, 코드가 작동하는 방식과 매우 다른 이상한 속성과 괴상한 레이어를 강제했습니다. 결과는 좋지 않았고, 멀리 가지 못했으며, 공유 언어를 개선하려는 시도를 회피하는 편리하고 게으른 변명을 가능하게 했습니다. "절반의 조치가 한 도구에서 다른 도구로 선택을 효율적으로 번역하는 데 도움이 되지 않는다면 왜 신경 써야 하나요?"라고 그들은 주장했습니다. 게으른 부분을 제외하고는 이해가 됩니다.

분위기가 바뀌고 있습니다. 디자인 시스템은 부분적으로 디자인 도구의 빠른 발전 덕분에 디자인과 개발 전반에 걸쳐 API를 공유하는 데 훨씬 나아지고 있습니다. 예를 들어, Figma의 Variants는 코드가 디자이너 도구에서 어떻게 작동하는지 구체적으로 반영하는 것에 대한 생각을 열었습니다. 공유 API를 실현하기 위해, 다학제적 팀은 **무엇을 포함할지**, **언제 API를 워크플로우에 맞출지**, **어디서 함께 작성할지**, 그리고 그 결과로 **행동이 어떻게 변화하는지**를 식별해야 합니다.

![[Pasted image 20250504143338.png]]
## 1. 구조(Anatomy)
구조는 웹 마크업, 객체 구성 및 Figma 레이어에 매핑되는 요소와 그룹의 계층 구조를 설정합니다. 구조는 또한 자체 속성이 필요한 하위 컴포넌트와 다른 더 원자적인 요소에 대한 의존성을 드러내야 합니다.

```
코드 마크업
-----------

<Card metadata="" title="">
  <CardMedia> (extends <Image>)
  <CardDescription>    
    (slot)
  </CardDescription>
  <CardActionsArea>
     (slot to add Button, IconButton, or TextLink)       
  </CardActionsArea>
</Card>
```

예를 들어, 모듈식 Card 컴포넌트를 스케치하는 개발자는 일부 요소(`title`과 같은)가 속성으로 처리되고 다른 요소(`CardActionsArea`와 같은)가 구성 가능한 구조를 대략적으로 작성할 수 있습니다.

```
FIGMA 레이어
------------

Card
  ]-[ .Card (as Base Figma component)
    CardImage (extends Image as subcomponent)
    [-] CardContent
      ]-[ TitleArea
        Subtitle
        Title
      Body
      ]-[ Actions
        Button
        Button
```

반면, Figma 레이어에 구조를 매핑하는 디자이너는 비슷하지만 다른 구조를 개략적으로 잡을 수 있습니다. 일부 의도는 Figma 특화된 것입니다. 예를 들어 "타이 파이터"(`]-[`) 또는 "인셋"(`[-]`)은 자동 레이아웃 간격을 예상하거나 기본 컴포넌트 또는 하위 컴포넌트에 `.`을 앞에 붙이는 것과 같습니다.

그러나 이러한 빠른 초안은 현실적이면서도 피할 수 있는 차이점을 노출합니다. 차이점에는 요소 이름(`metadata`와 `subtitle`, `body`와 `description`), 계층 구조(`actions`가 `content`에 포함되는지 또는 형제인지), 그리고 하위 컴포넌트(`CardMedia`와 `CardImage`)가 포함됩니다.

![[Pasted image 20250504145558.png]]

## 2. 속성(Properties)
개발자와 디자인 도구 모두 일관된 속성 이름, 옵션 이름 및 기본값을 불러일으켜야 합니다.

```
Figma only:
- State  
  - default  
  - hover? (recommend: include)  
  - focus? (recommend: include)  
  - error  
  - errorHover? (recommend: omit)  
  - disabled  
  - readOnly

Both Figma & code:- required (false - default, true)  
- inlineLabel (false - default, true)  
- helperTextPlacement (right, bottom - default)

Code only:
- ariaLabel  
- disabled (in Figma, use States)  
- error (in Figma, use States)  
- errorEvent  
- errorText (in Figma, update text shown when in State=Error)  
- helperText (in Figma, show/hide and update text)  
- id  
- label (use .Label element)  
- readOnly (false - default, true) (in Figma, use States)  
- width
```

예를 들어, 두 도구 모두 `inlineLabel`(불리언 토글)과 `helperTextPlacement`(`right` 또는 `bottom`이라는 두 가지 이름이 지정된 옵션)에 대한 동일한 Dropdown 속성을 불러일으킬 수 있습니다. 반면에, 코딩된 컴포넌트는 일부 상태는 속성을 통해 활성화하고 다른 상태는 상호작용을 통해서만 트리거될 수 있습니다. 이 경우, Figma에서 디자이너를 위해 속성 및 상호작용 트리거 상태를 단일 메뉴로 통합하면서 일관된 옵션 레이블을 유지하는 것이 바람직할 수 있습니다. 마지막으로, 코드가 `aria-label`과 `id`와 같은 (많은?) 추가 속성을 포함하는 것은 매우 일반적입니다.