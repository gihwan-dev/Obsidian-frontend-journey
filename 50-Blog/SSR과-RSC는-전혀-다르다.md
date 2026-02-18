---
type: blog-post
source: velog
author: "koreanthuglife"
title: "SSR과 RSC는 다르다"
slug: "SSR과-RSC는-전혀-다르다"
velogId: "54add71e-aa05-4925-9512-3737d3964072"
velogUrl: "https://velog.io/@koreanthuglife/SSR과-RSC는-전혀-다르다"
published: "2024-04-05T07:52:16.197Z"
updated: "2026-02-17T13:46:54.070Z"
tags:
  - "next.js"
  - "react.js"
  - "웹개발"
description: "SSR이랑 RSC랑 뭔가 관계가 있을거 같고.... 비슷하지 않나... 싶고...... 그래요.....?"
importedAt: "2026-02-18T07:28:49.893Z"
---

# RSC란?

**React Server Component**의 줄임말이다. 서버에서 실행되는 리액트 컴포넌트이다. 지금은 이정도로만 알아두자.

## 등장 배경
`Iron Triangle` 이라는 말이 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/996db096-a00e-457a-a3f7-4d1e18ad47fe/image.png)
출처: https://medium.com/@harpreet.dhillon/iron-triangle-triple-constraints-of-project-management-e818e631826c

간단하게 말해서 소프트웨어를 개발할 때 각 꼭짓점에서 이점을 가져가게 되면 나머지 반대의 꼭짓점들의 가치를 희생해야 한다는 거다.

클라이언트 컴포넌트에서 다음과 같은 가정을 해보자. 

1. **자식 요소에서 필요한 데이터들을 부모 요소에서 모두 받아와 props의 형태로 내려주는 방식.**
2. **각각의 자식 요소에서 필요한만큼의 데이터만 요청해서 받는 방식**

1번의 경우 network 요청은 한 번 밖에 발생하지 않는다. **성능을** 챙겼다고 볼 수 있겠다. 그러나 props를 통해 부모 자식간에 **의존성이 생겨 유지보수가 힘들다**. 비용 또는 시간을 희생하게 되는거다.

2번의 경우 부모 자식간의 **유지보수의 문제를 해결**했다 볼 수 있다. 그러나 **네트워크 요청이 두 번 발생**하게 된다. **네트워크 비용이 늘어나게 된다.**

페이스북 팀에서는 위와 같은 문제를 해결하기 위한 해결책으로 다음의 두 가지 방법을 사용했다.

1. `Relay` 와 `GraphQL`의 조합. ⇒ 이는 추후에 다뤄보도록 하겠다.
2. `RSC`

1번 방안의 적용은 대부분의 경우 적용이 힘들거다. 그래서 2번의 방안인 **React Server Component**를 고안해 냈고 React 18에서 등장하게 된다.

`RSC`는 **서버에서 렌더링** 되는 컴포넌트다. 서버에서 실행되기 때문에 요청이 반복해서 발생하는 **네트워크 워터폴이 당연하게도 없으며**, **번들 사이즈도 줄어들게** 된다.

아래 페이지는 **서버 컴포넌트**를 실험해볼 수 있는 리포지토리다 해당 저장소를 클론해서 `RSC`를 사용해볼 수 있다.

```bash
git clone https://github.com/reactjs/server-components-demo.git
```

위 저장소를 클론 후 실행해서 실제 어떤 일들이 일어나는지 한 번 살펴 보자.
## 데모 실행
### 폴더 구조
![](https://velog.velcdn.com/images/koreanthuglife/post/5dda5c0e-0582-4bbf-9f9b-58c53069e35a/image.png)
이런 식으로 **파일 구조**를 가지고 있다. 각 파일을 들어가보면 `"use client"` 디렉티브를 볼 수 있다.

해당 디렉티브를 사용하면 **클라이언트 렌더링**을 하고, 그 이외의 컴포넌트들은 전부 `RSC`로 동작하게 된다. 아직 실험적인 기능이기 때문에 사용할 때 위험성을 내포하고 있다. **각자 판단해서 도입**하라고 한다.(~~README.md에서…~~)

`docker-compose` 를 사용해서 `postgreSQL` 데이터베이스 서버를 실행시키고 `docker file` 을 통해 리액트 서버를 실행시키자. (오래걸린다...)

`http://localhost:4000` 으로 접속하면 아래와 같은 화면을 볼 수 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/08c3ab5b-d576-4f58-9064-2c366b9278d3/image.png)
**글을 작성해보자.**
![](https://velog.velcdn.com/images/koreanthuglife/post/e2b888ba-6551-4840-9805-74a68702cd11/image.png)
현재 `"use client"` 지시어가 사용된 컴포넌트들은 다음과 같다.
- **EditButton**
- **NoteEditor**
- **SearchField**
- **SidebarNoteContent**

`React dev tool` 를 이용해서 컴포넌트 트리를 확인해보자.

**EditButton**
![](https://velog.velcdn.com/images/koreanthuglife/post/984fcf88-4659-436c-a540-f05f0e5e3e6b/image.png)
**NoteEditor**
![](https://velog.velcdn.com/images/koreanthuglife/post/95731321-f126-495a-bc37-fde289262fbf/image.png)
**SearchField**
![](https://velog.velcdn.com/images/koreanthuglife/post/e347cdca-af14-49f5-aa20-36d261280581/image.png)
**SidebarNoteContent**
![](https://velog.velcdn.com/images/koreanthuglife/post/fa5ed8b4-764d-4fe2-887a-268fdb2d04ac/image.png)
눈치 챘겠지만 `RSC` 는 컴포넌트 트리에 포함되어 있지 않다. **클라이언트 컴포넌트만** 현재 소스 트리에 포함되어 있다.

그럼 `RSC` 는 어떻게 `DOM` 에 UI로서 표현될까?

새로고침을 눌러 네트워크 탭에서 네트워크 요청을 확인해보자.
![](https://velog.velcdn.com/images/koreanthuglife/post/78fe3fc5-ae68-408d-850d-522ace91423c/image.png)
위와 유사하게 생긴 응답을 볼 수 있을거다. 내용을 확인해보자.

```js
1:I{"id":"./src/SearchField.js","chunks":["client2"],"name":""}
2:I{"id":"./src/EditButton.js","chunks":["client0"],"name":""}
3:"$Sreact.suspense"
0:["$","div",null,{"className":"main","children":[["$","section",null,{"className":"col sidebar","children":[["$","section",null,{"className":"sidebar-header","children":[["$","img",null,{"className":"logo","src":"logo.svg","width":"22px","height":"20px","alt":"","role":"presentation"}],["$","strong",null,{"children":"React Notes"}]]}],["$","section",null,{"className":"sidebar-menu","role":"menubar","children":[["$","$L1",null,{}],["$","$L2",null,{"noteId":null,"children":"New"}]]}],["$","nav",null,{"children":["$","$3",null,{"fallback":["$","div",null,{"children":["$","ul",null,{"className":"notes-list skeleton-container","children":[["$","li",null,{"className":"v-stack","children":["$","div",null,{"className":"sidebar-note-list-item skeleton","style":{"height":"5em"}}]}],["$","li",null,{"className":"v-stack","children":["$","div",null,{"className":"sidebar-note-list-item skeleton","style":{"height":"5em"}}]}],["$","li",null,{"className":"v-stack","children":["$","div",null,{"className":"sidebar-note-list-item skeleton","style":{"height":"5em"}}]}]]}]}],"children":"$L4"}]}]]}],["$","section","null",{"className":"col note-viewer","children":["$","$3",null,{"fallback":["$","div",null,{"className":"note skeleton-container","role":"progressbar","aria-busy":"true","children":[["$","div",null,{"className":"note-header","children":[["$","div",null,{"className":"note-title skeleton","style":{"height":"3rem","width":"65%","marginInline":"12px 1em"}}],["$","div",null,{"className": 
......
```

이런 형식의 데이터가 포함되어 있다. 어디서 많이 본 데이터 아닌가? **리액트 컴포넌트의 실행 결과로 생성되는 자바스크립트 객체**( _VDOM 노드_ )와 유사하게 생겼다.

즉, 이를 보고 유추할 수 있는 것은 다음과 같다.

- `RSC`는 당연하게도 서버에서 실행된다.
- 그리고 해당 실행 결과를 클라이언트에 보낸다.
- 클라이언트에서는 `RSC`의 렌더링 결과를 위와 같은 형식으로 받아 이를 사용해 실제 DOM에 적용시킨다.

그럼 **`RSC`**에서 어떤 데이터가 변경되면 어떤식으로 업데이트를 할까?

노트를 추가해 보면서 그때의 네트워크 요청을 확인해봤다.

방금의 요청과 비슷하지만 다른? 요청이 발생했고, 응답의 형식도 유사하다.
![](https://velog.velcdn.com/images/koreanthuglife/post/26cef586-da2f-4d83-8edc-38dc021486c6/image.png)
```jsx
1:I{"id":"./src/SearchField.js","chunks":["client2"],"name":""}
2:I{"id":"./src/EditButton.js","chunks":["client0"],"name":""}
3:"$Sreact.suspense"
0:["$","div",null,{"className":"main","children":[["$","section",null,{"className":"col sidebar","children":[["$","section",null,{"className":"sidebar-header","children":[["$","img",null,{"className":"logo","src":"logo.svg","width":"22px","height":"20px","alt":"","role":"presentation"}],["$","strong",null,{"children":"React Notes"}]]}],["$","section",null,{"className":"sidebar-menu","role":"menubar","children":[["$","$L1",null,{}],["$","$L2",null,{"noteId":null,"children":"New"}]]}],["$","nav",null,{"children":["$","$3",null,{"fallback":["$","div",null,{"children":["$","ul",null,{"className":"notes-list skeleton-container","children":[["$","li",null,{"className":"v-stack","children":["$","div",null,{"className":"sidebar-note-list-item skeleton","style":{"height":"5em"}}]}],["$","li",null,{"className":"v-stack","children":["$","div",null,{"className":"sidebar-note-list-item skeleton","style":{"height":"5em"}}]}],["$","li",null,{"classNam
...
```

이를 통해 `RSC` 는 어떤 변경 사항이 발생하면, 변경된 `RSC` 의 렌더링 결과만을 받을 수 있고 이를 통해 UI를 업데이트 할 수 있다는 거다.

## RSC 사용의 장점

`RSC` 에 관한 **RFC(Request for Comment)**를 보면 다음과 같은 이점이 있다고 설명한다.

### **Zero-Bundle-Size Components**

번들이 없다. 서버에서 실행되어 전송되기 때문에, 써드 파티 라이브러리를 사용함으로 인해 발생하는 번들이 없다.

예를들어 다음과 같은 클라이언트 컴포넌트가 있다고 생각해보자.

```jsx
// NOTE: *before* Server Components

import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function NoteWithMarkdown({text}) {
  const html = sanitizeHtml(marked(text));
  return (/* render */);
}
```

클라이언트 컴포넌트이기 때문에 컴포넌트가 의존하는 라이브러리의 번들을 모두 다운로드 해야한다. 하지만 서버 컴포넌트에서는 렌더링된 결과가 보내지기 때문에 이러한 번들을 함께 다운받아야 하는 일이 없다.

### **Full Access to the Backend**

서버에서 할 수 있는 일들을 할 수 있다.

### **Automatic Code Splitting**

번들 사이즈를 줄이기 위해 lazy loading을 사용한 경험이 있을거다. 하나의 큰 앱을 여러개의 번들로 나눈 것을 코드 스플리팅 이라고 한다. 다음의 코드를 보자:

```jsx
// PhotoRenderer.js
// NOTE: *before* Server Components

import { lazy } from 'react';

// one of these will start loading *when rendered on the client*:
const OldPhotoRenderer = lazy(() => import('./OldPhotoRenderer.js'));
const NewPhotoRenderer = lazy(() => import('./NewPhotoRenderer.js'));

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />; 
  } else {
    return <OldPhotoRenderer {...props} />;
  }
}
```

이런 식으로 번들 사이즈로 인해 로딩에 영향을 미치는 컴포넌트를 lazy loading을 통해 스플리팅 하는거다. `RSC` 를 사용하면 자동적으로 코드 스플리팅이 적용 되기에 이를 해결할 수 있다:

```jsx
// PhotoRenderer.js - Server Component

// one of these will start loading *once rendered and streamed to the client*:
import OldPhotoRenderer from './OldPhotoRenderer.js';
import NewPhotoRenderer from './NewPhotoRenderer.js';

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />;
  } else {
    return <OldPhotoRenderer {...props} />;
  }
}
```

### **No Client-Server Waterfalls**

데이터 페칭은 주로 `useEffect` 훅 내부에서 일어난다. 우선 리액트 앱의 렌더링을 위한 `HTML, CSS, JavaScript` 정적 파일을 받은 후 렌더링을 한다. 이후 렌더링이 끝나고 나면 `useEffect` 를 통해 각 컴포넌트에서 필요한 데이터를 요청한다.

비효율 적이지 않은가? 네트워크 요청을 2번 하는게 기본인거다. 이를 `Network Waterfalls` 라 한다. `RSC` 에서는 이를 해결할 수 있다. `RSC` 는 서버에서 실행되기 때문에 데이터를 **클라이언트에서 요청하지 않고 서버에서 요청을 실행**시켜 데이터를 받아 해당 **데이터가 적용되어 렌더링된 결과를 클라이언트로 보낸다**. 여러번의 네트워크 요청이 발생할 일이 없는 거다.

## RSC 사용시 주의할 점

물론 단점도 있다. 단점이라기 보단 **Trade-Off** 라고 볼 수 있을것 같다.

1. 클라이언트의 상태와 동기화되기 힘들다.
2. 브라우저 API를 사용할 수 없다.
3. 동적 인터랙션이 안된다.

# 그럼 SSR은 뭘까?

나도 처음엔 몰랐다. `SSR` 이 `RSC` 를 기반으로 동작하는거라 혼자 생각했다.

그리고 어느정도 공부해본 지금은 말할 수 있을것 같다. 이 둘은 **다른 개념**이다.

- `RSC`: 서버에서 컴포넌트를 실행시켜 결과를 포매팅해서 클라이언트로 보낸다. ⇒ 포매팅된 데이터를 보낸다. 그렇게 보낸다기 보단.... 그냥 서버에서 실행되는 리액트 컴포넌트다. 이렇게 하면 차이점이 명확할까....해서...
- `SSR:` 서버에서 HTML을 만들어서 보내준다. ⇒ HTML을 보낸다.

**Next.js** 에서 일어나는 `SSR` 은 생각보다 훨씬 복잡하다. Next.js의 컴파일러가 빌드시에 하는 일들을 보자.

### **Minifiying**

불필요한 코드(공백 등)을 제거해 코드의 크기를 최소화 한다.
![](https://velog.velcdn.com/images/koreanthuglife/post/7d31c440-5fb2-401c-9b1f-d724cc313f8e/image.png)

### **Bundling**
모듈 시스템을 통해 나누어져있는 코드를 하나로 합친다.

![](https://velog.velcdn.com/images/koreanthuglife/post/fe43a101-02b9-4b4f-af43-61963b1b02ad/image.png)

### **Code Spliting**
엔트리 포인트 별로 코드를 분리한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/baeea972-45f4-478b-8800-8a8896f625fe/image.png)

코드는 최적화되고 Next.js는 실행되어 요청을 기다리게 된다.

> 빌드시에 Next.js는 코드를 보고 각 페이지를 **동적으로** 생성할지, **정적으로** 생성할지를 결정한다. 정적 = SSG, 동적 = SSR 이며 빌드 결과의 콘솔을 통해 각 페이지가 어떻게 생성되었는지 확인할 수 있다. Next.js에서 API작성시 **GET요청만 있는 슬러그가 아닌 라우트 핸들러**는 **응답의 결과값 자체가 정적**으로 생성되어 버리기도 한다…(app dir에서)
> 

특정 URL에 대한 요청이 도착하게 되면? 각 페이지를 렌더링해서 결과물을 HTML로 보내준다. 일단 기본적으로 `SSR`, `SSG`든 뭐든 하나다. `RSC`고 뭐고가 중요한게 아니라 그냥 `SSR` 또는 `SSG`로 각 페이지를 미리 렌더링해 저장해서 보내거나 런타임에 **서버에서** 렌더링해서 보내거나 둘 중 하나인거다.

`RSC`는 그저 서버에서 실행되는 `SSR`에서 좀 더 많은 일을 효율적으로 할 수 있게 해주는 리액트의 컴포넌트다. `SSR`과 `RSC`는 전혀 관계가 없다. React 공식문서에 `Server APIs` 섹션을 보면 다양한 `Server API`가 있는데 거기 `renderToString` 메서드가 있다. 오히려 이게 리액트를 `SSR`로 렌더링 하는데 더 큰 관련이 있다.

# 결론

이처럼 **RSC**와 **SSR**은 전혀 다른 개념이다. Next.js 13에서는 `app` 디렉토리의 등장과 함께 모든 컴포넌���가 기본적으로 `RSC`로 동작하게 되었다. 이는 `Next.js` 가 `SSR, SSG` 에서 더 많은 일들을 할 수 있게 해 주었다. `pages` 에서는 어떤지 잘 모르겠다.

어쨌든 `Next.js` 를 사용한다면 이정도의 차이점은 알고 있어야 하지 않을까? 하는 마음에 공부해서 글을 작성했다. `app` 디렉토리에서는 `RSC` 가 기본이고 `pages` 폴더에서는 그게 아닌듯 하다. `app` 디렉토리와 `pages` 디렉토리는 그러한 동작 특성의 차이점도 있으니 어떤 방식을 사용할지에 내 글이 참고가 될 수 있을거라고도 생각 된다. 아마도.

**내가 사용하는 기술을 잘 알고 사용하자!**

---

# 참고 자료
[rfcs/text/0188-server-components.md at main · reactjs/rfcs](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
[Understanding React Server Components – Vercel](https://vercel.com/blog/understanding-react-server-components)
[Introducing Zero-Bundle-Size React Server Components – React](https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components)

---
열심히 공부해서 정리했지만 부족한 부분이 많을거 같습니다! 피드백 남겨주시면 확인하면서 수정해 보겠습니다...!
