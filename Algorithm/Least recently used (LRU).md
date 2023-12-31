**최근에 가장 적게 사용된 항목을 먼저 제거한다.** 이 알고리즘은 언제 무엇이 사용되었는지를 추적해야 하며, 항상 가장 최근에 사용되지 않은 항목을 제거하려면 비용이 많이 든다. 이 기술의 일반적인 구현은 캐시 라인에 대한 `"age-bit"`를 유지하고 `age-bit`를 기반으로 "가장 치근에 사용되지 않은" 캐시 라인을 추적해야 한다. 이러한 구현에서 캐시 라인이 사용될 때 마다 다른 모든 캐시 라인의 age 가 변경된다.

## 설명
LRU 알고리즘은 캐시에서 가장 최근에 사용되지 않은 항목을 먼저 제거하는 방식이다. 이 알고리즘의 핵심은 각 항목이 언제 사용되었는지의 정보를 유지하는 것이다. 그러나 이러한 방식은 항상 가장 최근에 사용되지 않은 항목을 정확하게 파악하려면 구현 비용이 높다.

일반적인 LRU 구현 방식 중 하나는 "age-bit"를 사용하는 것이다. 이 age-bit 는 캐시 내의 각 항목(또는 캐시 라인)이 얼마나 오래되었는지를 나타낸다. 캐시에서 특정 항목을 사용할 때 마다, 해당 항목을 제외한 다른 모든 항목의 연령 정보가 갱신된다.

![[Pasted image 20231008154323.png]]
> 링크 [[LRU Drawing]]

위 예제에서 A B C D 는 사용된 후 연속된 숫자로 블록에 삽입되었다. 하지만 E 가 사용 되고 블록에 삽입되어야 할 때 블록에 삽입될 자리가 없다. `LRU`알고리즘에 따르면 A(0)가 가장 작은 랭크를 가지기 때문에 `E`가 `A`를 대신하게 된다. 그 다음 과정에서 `D`가 사용 되고 랭크가 업데이트 된다.