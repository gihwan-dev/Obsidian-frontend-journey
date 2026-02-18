---
type: blog-post
source: velog
author: "koreanthuglife"
title: "Next.js - 작동 방식"
slug: "Next.js-작동-방식"
velogId: "1ebff950-44ea-40cd-be2c-16f6b334544a"
velogUrl: "https://velog.io/@koreanthuglife/Next.js-작동-방식"
published: "2023-04-28T05:13:18.079Z"
updated: "2026-02-17T14:50:34.584Z"
tags:
  - "nextjs"
description: "Next.js를 잘 사용하기 위해서는 javascript, react와 관련된 개발 개념들에 대해 잘 알고 있을 필요가 있다.React에 대해 알고 있으니 From React to Next.js에서 시작하도록 한다.React는 앱을 만들고 구조화 하는 방식에 대한 해결"
importedAt: "2026-02-18T07:28:49.893Z"
---

# 소개
## Next.js에 대해
Next.js를 잘 사용하기 위해서는 `javascript`, `react`와 관련된 개발 개념들에 대해 잘 알고 있을 필요가 있다.

`React`에 대해 알고 있으니 `From React to Next.js`에서 시작하도록 한다.

## Next.js가 작동하는 방식
`React`는 앱을 만들고 구조화 하는 방식에 대한 해결책이 없다. 그러한 일에 대해서 신경쓰지 않는다. `Next.js`는 `React`앱을 구조화하고 최적화할 수 있도록 도와준다.

## 개발 환경과 프로덕션 환경
개발하는동안은 우리는 우리의 로컬 머신에서 앱을 만들고 동작시킨다. 프로덕션으로 만든다는 것은 유저로부터 소비되고 배포한다는것을 의미한다.

### Next.js에서 어떻게 적용하는가
`Next.js`는 앱의 개발과 프로덕션 스테이지 모두의 특징을 제공한다.
- 개발 단계: 개발자를 위해 최적화를 해준다. 개발 경험을 향상시켜주기위한 여러 특징을 제공한다.(타입스크립트, ESLint, Fast Refresh 등)
- 프로덕션 단계: 소비자를 위한 최적화를 제공한다. 코드를 퍼포먼스와 접근성에 용이하게 변경시켜준다.

각 단계는 달성하고자 하는 목표를 위해 다른 특징을 요구하고, 개발 단계에서 프로덕션 단계로 완성하기 위해서는 코드가 컴파일되고 번들되고, 최소화되어야 하며, 분할되어야 한다.

### Next.js 컴파일러
`Next.js`는 이러한 코드 변환을 다루어주고 프로덕션을 만들기 위한 인프라를 제공해 앱을 쉽게 만들 수 있도록 해준다.

`Next.js`는 `Rust`언어로 제작된 컴파일러를 가지고 있고 `SWC`를 통해 자바스크립트, 타입스크립트, JSX등의 코드를 컴파일 하기 때문에 위와 같은 일들이 가능하다.

### 컴파일링이란?
개발자는 `TypeScript`, `JavaScript`, `JSX`와 같은 개발자 친화적인 언어로 코드를 작성한다. 그러나 이러한 코드는 브라우저가 알 수 있는 언어로 변경될 필요가 있다.

컴파일링(Compiling)은 어떤 코드를 입력받아 다른 버전의 코드는 다른 언어로 변경시켜주는 과정을 의미한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/a949c86f-0bb7-4a87-825a-1675fd669b39/image.png)
출처: https://nextjs.org/learn/foundations/how-nextjs-works/compiling

`Next.js`에서 컴파일은 개발 단계에서 코드를 작성할 때 와, 프로덕션을 위해 빌드를 진행할 때 일어난다.

### 최소화(Minifiying)
개발자는 가독성을 우선시하며 코드를 작성한다. 이러한 코드는 공백, 주석 과 같은 필요 없는 정보들을 포함하고 있다.

![](https://velog.velcdn.com/images/koreanthuglife/post/8812830b-fbf0-4564-8b5e-992ed9e57e38/image.png)
출처: https://nextjs.org/learn/foundations/how-nextjs-works/compiling

최소화는 이러한 필요없는 정보들을 제거하는 과정이다. 앱의 파일 사이즈를 최소화하여 퍼포먼스를 최적화 하는게 목적이다. `Next.js`에서는 프로덕션을 위해 이러한 과정을 자동으로 제공한다.

### 번들링(Bundling)
개발자는 앱을 함수, 컴포넌트, 모듈 단위로 분리해서 코드를 작성한다. 하지만 이렇게 분리하게되면 웹의 파일 의존성을 복잡하게 만든다.
![](https://velog.velcdn.com/images/koreanthuglife/post/91627e35-7049-43d9-a4e2-9a9aba451c26/image.png)
번들링은 이러한 의존성의 복잡함을 해소하고, 파일을 합쳐 유저가 웹 페이지를 방문할 때 발생하는 요청의 수를 줄여 브라우저를 위해 최적화 하는게 목적이다.

### 코드 분할
개발자는 종종 여러 URL로 접근할 수 있는 여러개의 페이지를 만든다. 이러한 페이지들은 앱을 위한 특별한 엔트리 포인트가 된다.

코드 분할 번들은 각각의 엔트리 포인트가 필요로하는 것들을 모아 더 작은 덩어리로 분할하는것을 의미한다. 페이지가 필요로하는 자원만 불러와 초기 로딩 시간을 향상시키는것을 목적으로 한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/3dfd1168-500b-4c85-a6b5-2f760b419e42/image.png)

`Next.js`는 이러한 코드 분할 기능이 내장되어 있고, `pages/`디렉터리에 작성된 파일들은 빌드 과정에 자동으로 분할된다.
- 페이지 간에 공유되는 페이지도 다른 하나의 덩어리로 번들링 되어 재다운로드 되는것을 방지한다.
- 다음으로 이동할 수 있는 페이지들을 자동으로 미리 불러온다.
- 동적 imports는 처음 어떤 코드를 불러와야하는지를 수동으로 나눌 수 있는 또 다른 방법이다.

### 빌드타임과 런타임
**빌드타임**은 앱 코드를 프로덕션용으로 만들기 위해 거치는 일련의 과정들을 의미한다.

`Next.js`는 앱을 빌드할 때 코드를 최적화하여 서버에 배포되고 유저에게 소비될 수 있도록 만들어 준다.
- 전략적으로 HTML 페이지를 만들어 준다.
- 서버에서 랜더링하기위한 자바스크립트 코드를 만들어 준다.
- 클라이언트와 상호작용을 위한 자밥스크립트 코드를 만들어 준다.
- CSS파일

**런타임**이란 빌드와 배포가 이루어진 후 유저의 요청에 응답을 보내는 기간을 의미한다.

### 클라이언트와 서버
웹에서 **클라이언트**란 서버로 요청을 보내는 유저의 디바이스를 의미한다. 서버로 요청을 보내고 응답을 받으며 서버와 클라이언트가 상호작용 할 수 있게 되는것이다.
![](https://velog.velcdn.com/images/koreanthuglife/post/456ecc87-46a3-4b03-8672-a7359538e66d/image.png)

**서버**는 요청을 받아 응답을 보내는 중앙 데이터 보관소를 의미한다.

### 렌더링이란?
`React`로 코드를 작성하게 내 코드의 UI를 나타내는 HTML로 변환해주어야 한다. 이러한 과정을 랜더링이라 한다.

렌더링은 클라이언트측 또는 서버측에서 일어날 수 있다. 렌더링은 빌드타임보다 먼저 일어날 수 있고, 런타임의 매 요청마다 일어날 수 있다.

`Next.js`에서는 다양한 방법의 렌더링이 가능하다. **서버사이트 렌더링**, **정적 사이트 생성**, **클라이언트 사이드 렌더링**.

#### Pre-Rendering
서버사이드 렌더링과 정정 사이트 생성은 사전 렌더링이라고도 불린다. 클라이언트에게 결과를 보내기 전에 React코드를 HTML로 변환하기 때문이다.

#### Client-Side Rendering vs. Pre-Rendering
표준적인 React 앱에서는 빈 HTML 쉘과 자바스크립트로 작성된 UI 지침서를 받는다. 이러한 렌더링을 **클라이언트 사이드 렌더링**이라고 한다. 초기의 렌더링이 유저의 기기에서 일어나기 때문이다.
![](https://velog.velcdn.com/images/koreanthuglife/post/79f19e1a-335c-4ead-8a38-2895debaa632/image.png)

반면에 `Next.js`는 모든 페이지를 기본적으로 사전 렌더링 한다. 즉, 유저의 디바이스에서 `Javascript`에 따라 페이지를 렌더링하는것이 아닌 서버에서 HTML파일을 미리 생성한다는 것이다.

실제로 이것은 클라이언트 사이드 앱에서 렌더링이 완료되기 전까지 유저가 빈 페이지를 본다는것을 의미한다. 반면에 사전 렌더링된 앱에서는 유저는 완성된 HTML페이지를 보게 된다.
![](https://velog.velcdn.com/images/koreanthuglife/post/4579d4ec-2015-464a-a8a7-e1fa1c023b20/image.png)

그렇다면 두 타입의 사전 렌더링에 대해 알아보자.
#### 서버 사이드 렌더링
각각의 요청마다 HTML페이지가 생성된다. HTML, JSON data, Javascript 지침서가 생성되면 유저에게 보내진다.

클라이언트에서 HTML은 상호작용할 수 없지만 빠르게 뭔가를 보여주기 위해서 사용된다. 그 동안 `React`는 JSON데이터와 Javascript 지침서를 사용하여 컴포넌트를 상호작용 가능하게 만든다. 이러한 과정을 **hydration(��화)**이라 부른다.

`Next.js`에서 `getServerSideProps`를 사용하여 서버사이드 렌더링을 할 수 있다.

#### 정적 사이트 생성
정적 사이트 생성에서는 HTML에 서버에서 생성되지만 서버사이드 렌더링과는 다르게 런타임에 서버가 없다. 대신에 컨텐츠가 빌드타임에 딱 한 번 생성되고 앱이 배포되고나면 HTML이 `CDN`에 저장되어 각 요청마다 재사용된다.

`Next.js`에서 `getStaticProps`를 통해 정적으로 페이지를 생성할 수 있다.

이러한 다양한 방법들을 통해 페이지마다 알맞는 방법으로 페이지를 렌더링할 수 있다.

### 네트워크란?
앱의 코드가 네트워크에 배포된 이후 어디서 저장되고 실행되는지를 아는것은 도움이 된다. 간단하게 자원을 공유할 수 있는 연결된 컴퓨터(또는 서버)라고 생각하면 된다. `Next.js`에서 코드가 `origin servers`, `Content Delivery Networks (CDNs)`, `the Edge`로 분산될 수 있다.

#### Origin Servers
앞서 말했듯이 서버는 원천의 앱 코드를 실행하고 저장하는 메인 컴퓨터이다.

우리는 `origin(원천)` 이라는 단어를 다른 분산될 수 있는 `CDN severs`나 `Edge severs`로부터 구별하기위해 사용한다.

원천 서버가 어떤 요청을 받으면, 응답을 보내기전에 어떠한 연산을 수행한다. 이때 연산의 결과는 CDN으로 옮겨질 수 있다.

#### Content Delivery Network
CDNs는 클라이언트와 원천 서버 사이에서 동작하며 전 세계의 수많은 위치에서 정적 컨텐츠를 저장한다. 새로운 요청이 오면 가장 가까운 CDN이 캐시된 결과와 함께 응답을 제출한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/5e1327ca-791f-4d43-bfdb-415721180e0f/image.png)

이러한 동작은 원천서버에 대한 부하를 줄여준다. 매 요청마다 연산을 시행할 필요가 없어지기 때문이다. 또한 지리적으로 유저에게 가까운 곳에서 응답이 오기 때문에 더 빠르게 동작한다.

`Next.js`에서 사전 렌더링이 가능하기 때문에 정적 사이트를 저장하기위해 CDN을 사용하는것은 좋은 방법이다.

#### The Edge

Edge는 네트워크 edge의 일반화된 개념이다. 즉, 유저에게 가장 가까운 네트워크를 말한다. CDNs 또한 `the Edge`의 한 부류로 고려될 수 있다. CDNs가 네트워크의 edge에 정적 컨텐츠를 저장하기 때문이다.

`CDNs`와 비슷하게 `Edge`는 전체계에 다양하게 분산되어 있다. 정적 컨텐츠를 저장하는 CDNs와 다르게 Edge서버는 작은 코드 조각을 실행할 수 있다.

이것은 **캐싱**과 **코드실행**이 모두 Edge에서 일어날 수 있다는것을 의미한다.

서버사이드와 클라이언트 사이드에서 전통적으로 진행되었던 작업을 Edge로 옮기면, 클라이언트로 보내는 코드의 양을 줄일 수 있기 때문에 앱의 성능을 개선할 수 있다. 또한 유저의 요청이 매번 원천 서버로 갈 필요가 없기 때문에 지연또한 줄일 수 있다.

`Next.js`에서 `Middlware`를 통해 코드를 `Edge`에서 실행할 수 있다. 또한 곧 `React Server Components`를 통해서도 가능할 전망이다.

## Next.js 앱 만들기
`React`로 완성된 웹 애플리케이션을 만들기 위해서는 다음과 같은 세부사항들을 고려할 필요가 있다:
- `webpack`과 같은 번들러로 번들 되어야 하고, `Babel`과 같은 컴파일러로 코드를 변형시켜줘야 한다.
- 코드 분활과 같이 프로덕션용으로 최적화 해줘야 한다.
- 퍼포먼스와 SEO를 위해 정적으로 사전 렌더링 하고싶을 수 있고 서버사이드 렌더링 또는 클라이언트 사이드 렌더링을 원할 수 있다.
- 리액트 앱을 데이터 저장소에 연결하기 위해 서버사이드 코드를 작성해야 할 수 있다.

### Next.js: 리액트 프레임워크
`Next.js`는 위에 나열된 모든 문제를 해결할 수 있다. `Next.js`는 다음과 같은 특징을 가진다:
- 직관적인 페이지 베이스 라우팅 시스템
- 서버사이드 렌더링, 정정 사이트 생성 모두를 포함하는 사전 렌더링을 페이지 단위로 지원한다.
- 자동 코드 분활을 지원한다.
- 최적화된 prefetching을 이용한 클라이언트 사이드 라우팅
- CSS와 Sass를 지원하고, 어떠한 CSS-in-JS 라이브러리도 사용할 수 있다.
- Fast Refresh를 지원
- API 엔드 포인트를 만들기 위한 API 라우트를 지원
- 확장성이 좋다.

### 설치
일단 Node.js 10.13버전 이상이 설치되어 있어야 한다.
#### Next.js app 생성
`npx create-next-app@latest my-app`을 통해 `Next.js` 앱을 만들 수 있다.

#### 개발 서버 실행
프로젝트 루트 폴더에서 다음을 실행한다.
`npm run dev`

### 페이지간 이동
`Next.js`에서 한 페이지는 `pages`폴더의 한 파일에서 export되는 리액트 컴포넌트다.
파일 이름을 통해 라우트를 할 수 있다. 예를들어:
- `pages/index.js`는 `/` 라우트 경로를 가진다.
- `pages/posts/first-post.js`는 `/posts/first-post`라는 경로를 가진다.

#### Link 컴포넌트
`<a>` 태그처럼 동작하는 컴포넌트다. `next/link`로 부터 `import`할 수 있고, `props`를 가지며 클라이언트 사이드 네비게이션이 가능하게 한다.

#### 클라이언트 사이드 네비게이션
클라이언트 사이드 네비게이션은 자바스크립트를 사용해 일어나는 페이지 이동을 말하며, 브라우저의 기본 네비게이션보다 빠르다.

#### 코드 분활과 prefetching
`Next.js`는 자동적으로 코드 분활을 수행하므로, 해당 페이지를 불러오는데 필요한 것들만 불러온다.

이러한 동작은 수백가지의 페이지를 가지고 있더라도 빠르게 불러올 수 있도록 해준다.

또한 모든 페이지들이 독립적으로 존재하므로, 하나의 페이지가 오류를 내더라도 다른 페이지들은 여전히 동작한다.

게다가 `Next.js`가 연결된 페이지들을 사전에 백그라운드에서 `prefetch`하기 때문에 링크를 클릭하기 전에 이미 페이지는 준비된 상태다.

## Assets, Metadata, 그리고 CSS
`public` 폴더에 이미지와 같은 정정 assets를 넣어 사용할 수 있다.
`puclic`폴더는 자동으로 인식되므로 경로에 추가할 필요가 없다. 다음과 같이 이미지를 추가할 수 있다.
`<img src='/image1.jpg' alt='image1' />` 이렇게 하면 `public/image1.jpg` 파일을 불러올 수 있다. 하지만 이런식으로 불러오면 이미지에 대한 추가적인 여러 설정들이 필요하다. `Next.js`에서는 `Image`컴포넌트를 제공한다.

### Image 컴포넌트와 이미지 최적화
이미지 최적화를 기본으로 지원하고 이를 통해 리사이징, 최적화, `WebP`와 같은 모던 FORMAT의 이미지를 제공할 수 있도록 한다.

### 이미지 컴포넌트 사용하기
이미지 컴포넌트를 사용하면 이미지를 불러올 때 마다 최적화해줄 필요가 없어진다.

이미지는 `lazy loaded`가 기본 설정이다. 즉, 뷰 포트에 보여야 할 때 `load`된다는 뜻이다.

이미지가 랜더링은 `CLS`나 `CWV`에 악영향을 끼치지 않아야 한다.

다음처럼 사용할 수 있다.

```jsx
import Link from 'next/link';
import Image from 'next/image';

const FirstPost = () => {
  return (
    <>
      <h1>First Post</h1>
      <Link href="/">Back to Home</Link>
      <Image src="/image1.jpg" alt="image1" width={500} height={500} />
    </>
  );
};

export default FirstPost;
```

### Metadata
`Head`컴포넌트를 통해 `<head>`태그를 수정할 수 있다.

다음과 같이 사용할 수 있다.
```jsx
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>
      <h1>Home Page</h1>
      <Link href="/posts/first-post">To First-Post Page.</Link>
    </>
  );
};

export default HomePage;
```

개발 툴을 통해 확인해보면 `head`태그 안에 `title`이 제대로 추가된걸 볼 수 있다.


### Third-Party JavaScript
#### Third-Party JavaScript 추가하기
`Script`컴포넌트를 사용하여 추가할 수 있다.
```jsx
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <Script
          src="https://connect.facebook.net/en_US/sdk.js"
          strategy="lazyOnload"
          onLoad={() => console.log(`script loaded correctly, window.FB has been populated`)}
        />
      </Head>
      <h1>Home Page</h1>
      <Link href="/posts/first-post">To First-Post Page.</Link>
    </>
  );
};

export default HomePage;
```
`Script`태그 안에 정의된 프로퍼티에 대해서 알아보자:
- `strategy`: 스크립트 태그를 어떻게 로드 할것인지에 대해 정의한다.
- `onLoad`: 스크립트가 로그된 이 후 동작할 자바스크립트 코드를 적어주면 된다.

### CSS 스타일링
리액트와 비슷하게 CSS를 사용할 수 있으며 `.css`, `.scss`, `Tailwind CSS`와 CSS-in-JS라이브러리들을 사용할 수 있다.

### 레이아웃 컴포넌트
모든 페이지에서 공유하기 위한 레이아웃 컴포넌트를 만들어 보자.
- `components`폴더를 top-level 디렉터리에 만든다.
- 컴포넌트 폴더 안에 `laout.js`파일을 만든다.

만약 `Next.js`앱을 만들 때 `src`폴더를 함께 만들었다면, `src`폴더에 만들어주면 된다.

필자는 타입스크립트를 통해 만들었다.
```jsx
const Layout: React.FC<{
  children: React.ReactNode;
}> = (props: PropsWithChildren ) => {
  return <div>{props.children}</div>;
};
```

이후 페이지 컴포넌트를 감싸주면 된다.

```jsx
import Layout from '@/components/layout';
import Head from 'next/head';
import Link from 'next/link';

const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>Home Page</title>
      </Head>
      <h1>Home Page</h1>
      <Link href="/posts/first-post">To First-Post Page.</Link>
    </Layout>
  );
};

export default HomePage;
```

#### CSS 추가하기
`components`폴더에 css module 파일을 추가하고 스타일을 추가한 뒤 컴포넌트에 클래스를 추가해주면 된다.
```jsx
import { PropsWithChildren } from 'react';
import styles from './layout.module.css';

const Layout: React.FC<{
  children: React.ReactNode;
}> = (props: PropsWithChildren) => {
  return <div className={styles.container}>{props.children}</div>;
};

export default Layout;
```

### 전역 스타일
CSS 파일을 모든 페이지에 적용하고 싶다면 다음과 같이 하면 된다. 우선 `pages/_app.js`파일을 만든후 다음과 같이 작성한다.
```jsx
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```
물론 Next.js 앱 생성시에 기본으로 생성되어 있다. 타입스크립트에서는 다음과 같다.
```jsx
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```
`_app.js` 모든 페이지를 감싸고 있다. 페이지 사이에서 이동하며 상태를 유지하고 싶거나, 전역 스타일을 추가하고 싶을 때 이용할 수 있다.

전역 CSS는 `_app.js`이외의 파일에서 호출하지 않는것이 좋다. 모든 페이지에 영향을 줄 수 있기 때문이다.

어느 파일에 위치할 수 있고, 어떻게 이름지어도 상관없지만 다음과 같이 해보자.
- 최 상단 폴더 안에 `styles`폴더를 만들고 `global.css`파일을 만든다.
- 그 안에 스타일을 추가한다.

이후 `_app.js`파일에서 css파일을 import 해주면 된다.

```jsx
import '../styles/globals.css';

import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

## 사전 렌더링과 Data Fetching

### Pre-rendering
기본적으로 `Next.js`에서는 모든 페이지를 사전 렌더링 한다. 즉 클라이언트 사이드의 자바스크립트를 통해 페이지를 생성하는 것이 아니라 각 페이지의`HTML`을 미리 생성한다는 뜻이다. 사전 렌더링은 퍼포먼스와 SEO를 향상시킬 수 있다.

각 `HTML`코드는 각 페이지가 필요로하는 최소한의 `Javascript`와 연관되어 있다. 브라우저가 페이지를 불러오면 자바스크립트 코드가 실행되고 페이지를 interactive하게 만든다.(이러한 과정을 **hydration**이라 부른다.)

### 사전 렌더링이 일어나는 것을 확인하기
다음과 같은 과정을 통해 확인할 수 있다.
- 브라우저의 자바스크립트를 비활성화 한다.
- 튜토리얼 결과물 페이지에 접근하려 해본다.

그렇게 하면 자바스크립트 없이 렌더링 되는 페이지를 볼 수 있을것이다. `Next.js`가 정적 `HTML`파일을 사전 렌더링 했기 때문에 가능한 일이다.

만약 순수 `React`만 사용한다면 자바스크립트를 비활성화 하면 페이지를 볼 수 없다.

### 사전 렌더링과 비 사전 렌더링
그림으로 이해하자면 다음과 같다.
![](https://velog.velcdn.com/images/koreanthuglife/post/2723d9a8-1b92-4641-bd87-0c7deac5098b/image.png)
![](https://velog.velcdn.com/images/koreanthuglife/post/ac385f05-7305-43dc-831b-027f58371457/image.png)

### 두 가지 형태의 사전 렌더링
`Next.js`는 두 형태의 사전 렌더링을 제공한다: **정적 생성**과, **서버 사이드 렌더링**이다. 두 형태의 차이점은 언제 `HTML`파일을 생성하는가에 있다.
- 정적 생성(Static Generation): 빌드타입에 `HTML`을 생성한다. 사전 렌더링된 HTML은 각각의 요청마다 재사용 된다.
- 서버 사이드 렌더링: 각 요청마다 `HTML`파일을 생성한다.
![](https://velog.velcdn.com/images/koreanthuglife/post/36504ccd-f1cf-4b1e-8870-e03cab4d856e/image.png)
![](https://velog.velcdn.com/images/koreanthuglife/post/3f68bc66-87ed-42b7-9ed8-3cf97927bb79/image.png)
>
개발 모드에서는(`npm run dev` 또는 `yarn dev`) 요청마다 페이지가 사전 렌더링 된다.

### Per-Page Basis
`Next.js`는 각 페이지별로 어떤 사전 렌더링을 사용할지 정할 수 있도록 해준다. `Next.js`를 통해 하이브리드 앱을 만들 수 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/47cca8e2-92cb-4b2c-ad28-a9a1ef1b6a88/image.png)

### 정적 생성과 서버 사이드 렌더링중 언제 어떤걸 사용해야 하는지
가능한 정적 생성을 사용하는것을 추천한다. 정적 생성을 사용하면 빌드 타임에 `HTML`을 생성하고 `CDN`을 통해 제공될 수 있기에, 매 요청마다 페이지를 render하는것보다 빠르다.

다음을 포함한 많은 타입의 페이지에서 정정 생성을 사용할 수 있다.
- 마케팅 페이지
- 블로그 포스트
- E-commerce 상품 리스트
- Help 페이지와 문서

항상 스스로에게 "내가 이 페이지를 유저의 요청보다 먼저 사전렌더링 할 수 있는가?" 라고 물어봐야 한다. 만약 그렇다면 정적 생성을 선택해야 한다.

만약 그렇지 않다면 정적 생성은 좋은 선택이 아니다. 페이지의 데이터가 빈번하게 업데이트 되어야 하거나, 매 요청마다 내용물이 바뀌어야 하는 경우가 그렇다.

그러한 경우 서버 사이드 렌더링을 선택할 수 있다. 더 느리지만 페이지를 항상 최신의 상태로 유지할 수 있다. 또는 프리 렌더링을 하지않고 클라이언트 사이드의 자바스크립트를 사용해 데이터를 업데이트 할 수 있다.

### 데이터 없는 정적 생성

정적 생성은 데이터를 포함할수도 포함하지 않을수도 있다.

지금가지 생성한 페이지는 외부의 데이터를 가져다 쓸 필요가 없었다. 이러한 페이지들은 프로덕션을 위해 빌드할 때 정적으로 생성된다.

![](https://velog.velcdn.com/images/koreanthuglife/post/6c754f59-ba8f-416c-9057-c8af6d35d3dc/image.png)

하지만 어떠한 페이지들은 외부 데이터를 가져오지 않고는 렌더링이 불가능할 수 있다. 빌드 타임에 파일 시스템에 접근하거, 외부 API를 가져오거나, 데이터베이스에서 데이터를 가져와야 할 수 있다. `Next.js`는 이러한 경우 또한 지원한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/6fbaaf84-1a3c-4823-92b4-0d64ddd3db4f/image.png)

### getStaticProps를 통한 데이터 포함 정적 생성
어떻게 동작하는가? `Next.js`에서 페이지 컴포넌트를 export할 수 있고, 또한 `getStaticProps`라고 불리는 `async`함수를 `export`할 수 있다.

- `getStaticProps`는 프로덕션으로의 빌드 타임에 실행되고....
- 함수 안에서 데이터를 `fetch`하고 `props`으로서 페이지로 전달할 수 있다.

```javascript
export default function Home(props) {...}

export async function getStaticProps() {
  // 외부 데이터 요청
  const data = ...
  
  // 'Home' 컴포넌트로 전달될 'props' 값
  return {
    props: ...
  }
}
```

`getStaticProps`는 `Next.js`	에게 다음과 같이 말하는것과 같다: "여기 이 페이지의 데이터가 외부에 의존하고 있으니 빌드타임에 이 페이지를 사전렌더링 할 때 이거부터 해결해줘!"

>
개발 모드에서는 매 요청마다 실행된다.

### 실습

### 마크다운 페이지 만들기
아래 페이지에서 확인 가능하다.
https://nextjs.org/learn/basics/data-fetching/blog-data
`pre-rendering.md` 와 `ssg-ssr.md`라는 파일을 최 상위에 `posts`라는 폴더를 만들어 그 안에 넣어준다.

### 파일 시스템을 읽기 위한 유틸리티 함수 만들기
- 마크다운 파일로부터 `title`, `date`와 파일 이름을 얻는다.
- index 페이지에 날짜를 기준으로 정렬하여 나열한다.

최 상단 레벨에 `lib`폴더를 만든 후 `posts.js`라는 파일을 그 안에 만들어 준다.

### 블로그 데이터 가져오기
블로그 데이터가 준비되었고 이제 `index.js`페이지에 추가해주면 된다. `getStaticProps()`를 통해 이를 할 수 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/d7cc4dff-2d1d-4b09-8a3e-cef21b2d4d2d/image.png)

### Next.js 사전 렌더링
`Next.js`에는 앞서 말했듯이 다음 두 가지 형태의 사전 렌더링이 존재한다.
- 정적 생성: 빌드타임에 `HTML`을 생성한다.
- 서버 사이드 렌더링: 각 요청마다 `HTML`을 생성한다.

### 정적 생성 이용 (getStaticProps())
우선 `getSortedPostsData`를 불러와 `getStaticProps`함수 안에서 호출한다.

이후 `index.js`파일에 다음과 같이 작성한다.
```javascript
import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostData = getSortedPostsData();
  return {
    props: {
      allPostData,
    }
  }
}
```
`props`객체 안에 블로그 포스트 데이터를 위치시켜 반환시킴으로써, 블로그 포스트는 `Home` 컴포넌트의 프로퍼티로써 전달된다. 이제 다음과 같은 방식으로 블로그 포스트 데이터에 접근할 수 있다.

### 외부 API 또는 데이터 베이스로부터 데이터 가져오기
외부 API에 데이터를 요청하는 것은 물론이고 데이터베이스에 직접적으로 query를 작성해 데이터를 받아올 수 있는데 이것은 `getStaticProps`가 서버 사이드에서만 실행되기 때문에 가능한 일이다. 절대 클라이언트 사이드에서는 실행되지 않는다. 브라우저를 위한 JS 번들에도 포함되지 않는다.

### 오로지 페이지 안에서만 허용된다.
`getStaticProps`는 한 페이지 안에서만 exported 될 수 있다. 페이지가 아닌 파일에서는 export 할 수 없다.

### 만약 요청시에 데이터를 fetch할 필요가 있다면?
정적 생성은 빌드타임에 딱 한 번 일어나기 때문에, 빈번하게 데이터가 업데이트되고 바뀌는 요청의 페이지에는 적합하지 않다.

이러한 케이스에 서버사이드 렌더링을 이용할 수 있다.

### 요청 시간에 데이터 가져오기
![](https://velog.velcdn.com/images/koreanthuglife/post/5a554cbf-c083-4cc0-9071-9e21f663586b/image.png)

서버사이드 렌더링을 이용하기 위해서는 `getServerSideProps`를 사용해야 한다.

```javascript
export async function getServerSideProps(context) {
  return {
    props: {
      // props for your component
    },
  };
}
```
`getServerSideProps`는 요청할 때 호출되기 때문에, `context` 매개변수는 특정한 요청 매개변수를 가지고 있다.

요청 시간에 데이터를 요청해야하는 페이지같은 경우에는 `getServerSideProps`를 사용해야 한다. 다만 `TTFB(Time to first byte)`는 `getStaticProps`보다 느리다. 왜냐하면 매번 요청마다 연산결과를 제공해야하기 때문이다. 또한 결과가 특정한 설정 없이는 `CDN`에 캐쉬될 수 없다.

### 클라이언트 사이드 렌더링
만약 데이터를 사전 렌더링할 필요가 없다면 클라이언트 사이드 렌더링이라 불리는 다음과 같은 전략을 사용할 수 있다:
- 페이지의 외부 데이터를 요구하지 않는 부분들을 정적으로 생성한다.
- 페이지가 load 되면 클라이언트에서 외부의 요청을 가져오고 남은 부분을 생성한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/d0f75971-2ba4-45f5-bb3d-b3b0aff51c71/image.png)

유저 대시보드같은 페이지에 용이한 접근방법이다. 대쉬보드는 private하며 특정 유저에 관련된 페이지이며, SEO가 중요하지 않기 때문이다. 또한 사전 렌더링될 필요가 없다. 데이터는 빈번하게 업데이트되고 request-time data fetching을 필요로 한다.

### SWR
클라이언트 사이드에서 데이터를 fetching할 때 유용한 리액트 훅이다. caching, revalidation, focus tracking, refetching on interval 등을 다룰 수 있다. 

```javascript
import useSWR from 'swr';

function Profile() {
  const { data, error } = useSWR('/api/user', fetch);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}
```

## 동적 라우트
### 외부 데이터에 따른 페이지 경로
이전에 외부 데이터에 따라 **페이지 컨텐츠**를 다루는 방법에 대해서 알아 봤다. `getStaticProps`를 이용해 데이터를 요청하고 페이지에 렌더링했다.

이번에는 외부 데이터에 따른 **페이지 경로**를 다루어 본다.
`Next.js`에서는 외부 데이터에 따라 **페이지 경로**를 설정해 정적으로 페이지를 생성할 수 있다. 이것은 **동적 URL**을 통해서 가능하다.

![](https://velog.velcdn.com/images/koreanthuglife/post/4001d2c3-4746-4b39-beae-ca377a50b4fa/image.png)

### 어떻게 정적으로 페이지를 생성하고 동적으로 라우트할 수 있을까
우선 `[id].js`라는 폴더를 만들어 보자. `[`로 시작하고 `]`로 끝나는 이름을 가진 파일이나 폴더는 동적 라우트를 하겠다는것을 의미한다.

이 폴더 안에 렌더링할 페이지의 코드를 적어주면 된다.
```jsx
import Layout from 'path';

export default function Post() {
  return <Layout>...</Layout>
}
```
여기서 새로운 것이 있다면 `getStaticPaths`라 불리는 비동기 함수를 호출해 가능한 `id`의 리스트를 반환해주어야 한다는 것이다.
```jsx
import Layout from 'pah'
export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  // 가능한 id의 리스트를 반환
}
```
마지막으로 `getStaticProps`를 호출해준다. `getStaticProps`에게 `params`라는 매개변수가 주어지는데 여기에 `id`값이 포함되어 있다.
```jsx
import Layout from 'pah'
export default function Post() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  // 가능한 id를 담은 params 객체 리스트를 반환
  return [/*{params: {id: paths}} 의 리스트*/];
}

export async function getStaticProps({ params }) {
  // params.id를 통해 id값 추출
}
```
![](https://velog.velcdn.com/images/koreanthuglife/post/ac201734-29a6-4c74-aa1b-000437e62d9f/image.png)

### Catch-all 라우트
동적 라우트 파일명 `[id]`안에 ...을 추가해서 모든 연장되는 경로들을 잡아낼 수 있다. 예르들어:
- `pages/posts/[...id].js`는 `/posts/a`, `/posts/a/b`, `posts/a/b/c` 모두를 파리미터로 잡아낼 수 있다.

이렇게 한다면 `getStaticPaths`의 반환되는 `params`의 `id`키에 다음과 같이 배열을 할당해주어야 한다.
```jsx
return [
  {
    params: {
      // /posts/a/b/c를 정적으로 생성
      id: ['a', 'b', 'c'],
    },
  },
];
```
`getStaticProps`의 `params.id`는 배열이 된다.
```jsx
export async function getStaticProps({ params }) {
  // params.id => ['a', 'b', 'c']
}
```

### Router
`Next.js`의 라우터에 접근하고 싶다면 `useRouter`훅을 사용하면 된다.

### 404 Pages
커스텀 404 Page를 만들고 싶다면 `pages/404.js`를 만들면 된다.
