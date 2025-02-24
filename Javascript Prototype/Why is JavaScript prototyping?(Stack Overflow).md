문법적으로 부정확하고 어쩌면 이상한 질문처럼 들릴 수 있지만, 제가 의미하는 다음과 같습니다: JavaScript에서 `prototype` 개념을 이해하려고 할 때, 다음과 같은 예제의 조금 더 복잡하거나 덜 복잡한 버전들을 발견했습니다:
```javascript
//Guitar function constructor
function Guitar(color, strings) {
    this.color = color;
    this.strings = strings;
}

//Create a new instance of a Guitar
var myGuitar = new Guitar('Black', ['D', 'A', 'D', 'F', 'A', 'E']);

//Adding a new method to Guitar via prototype
Guitar.prototype.play = function (chord) {
    alert('Playing chord: ' + chord);
};

//Now make use of this new method in a pre-declared instance
myGuitar.play('D5');
```

그래서 문제는: 도대체 왜 이렇게 해야하나요? 왜 처음부터 그냥 `play` 함수를 `Guitar`에 넣지 않는 건가요? 왜 인스턴스를 선언하고 나서 나중에 메서드를 추가하기 시작하나요? 제가 볼 수 있는 유일한 이유는 `myGuitar`가 처음 생성될 때 `play`에 접근하지 못하게 하고 싶은 경우인데, 왜 이런것을 원하는지에 대한 이유를 설명하는 예시를 전혀 떠올릴 수 없습니다.

다음과 같이 하는게 훨씬 더 말이 된다고 생각합니다:
```javascript
function Guitar(color, string) {
    this.color = color;
    this.strings = strings;
    this.play = function (chord) {
        alert('Playing chord: ' + chord);
    };
}
var myGuitar = new Guitar('White', ['E', 'A', 'D', 'G', 'B', 'E']);
myGuitar.play('E7#9');
```

실제로는 첫 번째 예제가 어떤 이유로 더 나은 방법일 텐데, 제게는 오히려 두 번째 에제가 이해가 되고 첫 번째 예제는 이해가 되지 않는다는 것이 진짜 문제입니다. 안타깝게도, 제가 지금까지 찾은 모든 튜토리얼들은 단지 `prototyp`을 사용하는 방법만 설명할 뿐, 애초에 왜 `prototype` 패러다임이 존재하는지는 설명하지 않습니다.

`prototype`은 다른 방법으로는 할 수 없는 일들을 할 수 있게 해주는 것 같은데, 왜 그런 일들을 하고 싶어할지에 대한 좋은 이유를 떠올릴 수가 없습니다.

JavaScript는 '고전적인' 상속 언어가 아닙니다. 프로토타입 상속을 사용합니다. 그냥 그렇게 설계되어 있습니다. 이러한 경우, '클래스'에 메서드를 생성하는 올바른 방법은 프로토타입에 메서드를 넣는 것입니다. 엄밀히 말해서 JS에는 '클래스'라는 개념이 없기 때문에 '클래스'를 따옴표로 표시했습니다. JS에서는 함수로 정의되는 객체들을 다룹니다. 

Guitar를 정의하는 함수 안에 메서드를 선언할 수 있지만, 그렇게 하면 새로운 guitar마다 play 메서드의 *자체* 복사본을 갖게 됩니다. Guitar를 생성하기 시작할 때 프로토타입에 메서드를 넣는 것이 런타임 환경에서 더 효율적입니다. 모든 인스턴스가 동일한 play 메서드를 공유하지만, 호출될 때 컨텍스트/스코프가 설정되므로 고전적인 상속 언어에서 익숙한 적절한 인스턴스 메서드처럼 작동합니다.

차이점을 주목하세요. 귀하가 게시한 '이렇게 하면 안 될까요' 예제에서는 새로운 Guitar를 생성할 때마다 다른 모든 play 메서드와 동일한 새로운 play 메서드를 생성해야 합니다. 하지만 play가 프로토타입에 있다면, 모든 Guitar들이 같은 프로토타입을 빌려 쓰므로 모두 동일한 play 코드를 공유합니다. 이는 각각 동일한 play 코드를 가진 *x*개의 기타들(따라서 play의 *x*개 복사본을 가짐)과 동일한 play 코드를 공유하는 *x*개의 기타들(기타가 몇 개이든 play의 복사본은 1개) 사이의 차이입니다. 물론 트레이드오프는 런타임에 play가 스코핑을 위해 호출되는 객체와 연결되어야 한다는 것이지만, 자바스크립트는 이를 매우 효율적이고 쉽게 수행할 수 있는 메서드들을 가지고 있습니다(즉, `call`과 `apply` 메서드).

많은 자바스크립트 프레임워크들이 '클래스'를 생성하기 위한 자체 유틸리티들을 정의합니다. 일반적으로 그들은 귀하가 보고 싶다고 말씀하신 예제와 같은 코드를 작성할 수 있게 해줍니다. 내부적으로는 그들이 당신을 위해 함수들을 프로토타입에 넣고 있습니다.