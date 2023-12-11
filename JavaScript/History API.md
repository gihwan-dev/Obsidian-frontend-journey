`Hisgory API`는 `history global object`를 통해  브라우저의 세션 history에 접근을 제공한다. 다양한 프로퍼티와 `method`를 제공하며 유저의 `history`를 통해 `back, forth navigation`과 `history stack`의 콘텐츠를 조작할 수 있도록 해준다.

> [!info] **Note**: 이 API는 메인 스레드에서만 사용 가능하다(`Window`). `Worker` 또는 `Worklet` 컨텍스트에서 접근할 수 없다.

## 개념과 사용
### 앞으로가기, 뒤로가기
```js
history.back();

history.forward();
```
### 히스토리에서 특정 포인트로 이동
```javascript
history.go(-1);

history.go(1);
```

 아래처럼 활용하면 현재 페이지를 새로고침 한다.
 ```js
history.go();

history.go(0);
```

또한 `history stack`에 몇 개의 페이지가 있는지 `length` 프로퍼티를 통해 확인할 수 있다.
```js
const numberOfEntries = history.length;
```

## 예제
```js

window.addEventListener("popstate", (event) => {
  alert(
    `location: ${document.location}, state: ${JSON.stringify(event.state)}`,
  );
});

history.pushState({ page: 1 }, "title 1", "?page=1");
history.pushState({ page: 2 }, "title 2", "?page=2");
history.replaceState({ page: 3 }, "title 3", "?page=3");
history.back(); // alerts "location: http://example.com/example.html?page=1, state: {"page":1}"
history.back(); // alerts "location: http://example.com/example.html, state: null"
history.go(2); // alerts "location: http://example.com/example.html?page=3, state: {"page":3}"

```

