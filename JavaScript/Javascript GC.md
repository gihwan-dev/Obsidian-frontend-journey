

어떤 GC든 우선적으로 반드시 처리해야하는 작업들이 있다:
1. 객체의 live 또는 dead 상태를 판별한다.
2. dead 객체가 점유하던 메모리를 재사용한다.
3. 메모리를 Compact(압축)/Defragment(조각모음) 한다.

이 작업들은 연속적으로 또는 나뉘어서 수행될 수 있다. 가장 직곽적인 접근 방법은 자바스크립트의 실행을 멈추고 메인 쓰레드에서 실행하는 방법이다. 이는 버벅임과 지연 문제를 발생시킬 수 있다.

## Major GC (Full Mark-Compact)

메이저 GC는 전체 힙에서 가비지를 수집한다.

![[Excalidraw/JavaScrpit GC.md#^group=r94DdhLycKElIogtsayYb]]

### Marking

가비지 컬렉션에서 어떤 객체가 수집될 수 있는지를 파악하는것은 필수적인 작업이다. 가비지 컬렉터는 이를 `reachability(도달 가능성)`을 `'liveness'` 상태를 파악하는 프록시로 사용하여 수행한다. 런타임에 도달할 가능성이 있는 객체는 유지되고, 그렇지 않다면 수집된다는 의미이다.

### Seeping

Marking 작업이 끝나고 나면 GC는 `unreachable`한 객체를 정리하고 남은 연속된 빈 공간을 찾아서 free-list라 불리는 데이터 구조에 추가한다. free-list들은 빠른 조회를 위해 메모리 청크의 크기별로 분리되어 있다. 이후 메모리 할당이 필요하면, free-list를 보고 적절한 크기의 메모리 청크를 찾기만 하면 된다.

### Compaction
