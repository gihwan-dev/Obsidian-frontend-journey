## Part 1. On paper

이 예제에서는 실제 앱에 어떻게 FSD를 적용할 수 있는지에 대해 서술한다. 아래는 Medium 클론이며, 글을 쓰고 댓글을 달 수 있는 기능을 제공한다.
![[Pasted image 20250203083401.png]]

작은 앱이기에, 과도한 분리는 지양한다. 전체 앱의 구성이 3 계층으로 나뉠거라 예상된다: **App**, **Pages**, **Shared** 이다.

### 페이지 목록

위 스크린샷을 보고 우리는 다음과 같은 페이지들이 존재할거라 예상할 수 있다:
- Home (article feed)
- Sign in and sign up
- Article reader
- Article editor
- User profile viewer
- User profile editor (user settings)

페이지 계층의 모든 페이지들은 *slice*를 가진다:
```text
📂 pages/
  📁 feed/
  📁 sign-in/
  📁 article-read/
  📁 article-edit/
  📁 profile/
  📁 settings/
```

FSD에서는 페이지가 다른 페이지를 참조할 수 없다. 즉, 페이지에서 다른 페이지의 코드를 불러올 수 없다. 이는 **계층간 임포트 규칙** 때문이다:

> slice 내부의 모듈은 상위 계층에서만 임포트할 수 있다.

같은 계층에서는 임포트할 수 없다.

### 피드 자세히 보기

![[Pasted image 20250203083900.png]]
익명 유저가 볼 수 있는 화면

![[Pasted image 20250203083939.png]]
로그인된 유저가 볼 수 있는 화면

피드 페이지에는 세 가지 동적인 영역이 있다:
1. 로그인 상태에 따른 Sign-in 링크의 가시성
2. 피드에서 필터링을 하기 위한 태그의 리스트
3. 좋아요 버튼을 가진 기사들

sign-in 링크는 헤더의 한 부분이며 모든 페이지에서 공통된다.

### 태그 리스트

태그의 리스트를 만들기 위해서 우리는 사용 가능한 태그들을 fetch 하고, 태그를 칩의 형태로 렌더링 하고, 선택된 태그를 클라이언트 사이드 저장소에 저장해야 한다. 이 각각의 연산은 "API 상호작용", "유저 인터페이스", "스토리지" 로 구분될 수 있다. FSD에서 코드는 목적에 따라 *segments*로 구분된다. *Segments*는 *slice* 내부에 존재하는 폴더로 목적을 서술하는 이름을 가진다. 그리고 이 목적은 보편적이기에 다음과 같은 관습적인 이름이 있다:
- 📂 `api/` 백엔드 인터랙션을 처리하는 코드
- 📂 `ui/` 렌더링과 외관을 처리하는 코드
- 📂 `model/` 스토리지와 비즈니스 로직
- 📂 `config/` 피처 플래그, 환경 변수 그리고 다른 형태의 설정들

우리는 여기서 태그를 fetch하는 코드를 `api`에, 태그 컴포넌트를 `ui`에, 스토리지 상호작용을 `model`에 둘것이다.

### 기사(Article)

같은 그룹핑 원칭을 사용해서, 피드를 분해할 수 있다:

- 📂 `api/`: 페이지별 아티클을 요청하는 함수; 아티클에 좋아요를 누르는 함수
- 📂 `ui/`:
	- 탭리스트 - 태그가 선택되면 추가적인 탭이 나와야 함
	- 각각의 아티클
	- 페이지네이션 기능
- 📂 `model/`: 현재 페이지와 아티클들의 클라이언트 사이드 저장소

### 일반적인 코드 재사용

대부분의 페이지들은 의도가 매우 다르다. 그러나 전체 앱에서 재사용 되는 것들이 있다. - 예를들어, UI 디자인 언어에 따라 구성된 UI 킷 또는 같은 인증 방식을 사용하는 REST API 기반의 백엔드 컨벤션 등이 있다. *Slice*는 독립적으로 구성되도록 의도되었기 때문에, 코드의 재사용은 더 낮은 계층인 **Shared**에서 이루어진다.

*Shared*는 *slice*가 아니라 *segment*를 가진다는 점에서 다른 계층과 다르다.

보통 *Shared*에 존재하는 코드들은 미리 계획되지 않는다, 개발 중 추출된다. 개발 중에만 어떤 코드가 *shared*에 존재해야 하는지 명확하게 알 수 있기 때문이다. 그래도 어떤 코드가 *Shared*에 존재할 수 있는지 이해해두는 것은 도움이 된다:
- 📂 `ui/` — UI 킷, 순수한 외관 관련, 비즈니스 로직을 포함하지 않는 코드 - 예를들어, 버튼, 다이얼로그, 인풋 등이 있다.
- 📂 `api/` — 요청을 간편화 하기 위한 `fetch()` 래퍼, 백엔드 스펙에 따른 특정한 요청을 하는 함수 등
- 📂 `config/` — 환경 변수를 파싱하는 코드
- 📂 `i18n/` — 언어 지원과 관련된 설정
- 📂 `router/` — 라우팅 기본 요소와 라우트 상수

이는 *Shared*에 있는 *segment*의 몇가지 이름의 예제일 뿐이다. 추가적으로 생성하거나, 이 이름을 사용하지 않아도 된다. 중요한 한가지는 새로운 *segment*를 생성할 때 그 이름이 **목적(why)** 을 서술해야지 **본질(what)** 을 서술해서는 안된다. "components", "hooks", "moddals"와 같은 이름은 파일이 무엇(what)인지를 말하기 때문에 내가 원하는 코드를 찾는데 도움이 되지 않는다. 이런 이름은 연관없는 코드의 응집도를 높이고 리팩토링시 영향받는 코드의 영역을 넓히게 된다. 이는 코드 리뷰와 테스트를 어렵게 만들 뿐 아니라, 팀원이 코드를 찾기 위해 전체 폴더를 뒤져보게 만든다.

### 엄격한 퍼블릭 API 정의하기

FSD의 문맥에서 *public API*란 프로젝트 내부의 *slice*와 *segment*에 다른 모듈에서 어떤 부분을 임포트 할 수 있는지 선언하는 것을 의미한다. 예를들어 *slice*에 있는 어떤 부분을 `index.js`로 부터 re-exporting 해서 *public API*를 명시할 수 있다. 이는 외부와의 관계가 유지되는한, 슬라이스 내부의 코드를 자유롭게 리팩토링 할 수 있게 해준다.

우리의 *slice*/*segment*는 다음과 같을 수 있다:
```text
📂 pages/
  📂 feed/
    📄 index
  📂 sign-in/
    📄 index
  📂 article-read/
    📄 index
  📁 …
📂 shared/
  📂 ui/
    📄 index
  📂 api/
    📄 index
  📁 …
```

`pages/feed`나 `shared/ui`와 같은 폴더의 내부 구조는 해당 폴더들만 알고 있어야 하며, 다른 파일들은 이러한 폴더들의 내부 구조에 의존해서는 안된다. 즉,`index`를 통해서 원하는 모듈을 임포트 해야 한다.

### UI에서 재사용되는 큰 블록들

이전에 우리는 헤더가 모든 페이지에서 재사용됨을 상기했다. 모든 페이지에서 새로 만드는 것은 실용적이지 않다. 우리는 이미 코드 재사용을 위한 *Shared* 계층을 가지고 있지만, 큰 UI 블록을 *Shared*에 넣는 것에는 한 가지 주의사항이 있다 -- *Shared* 계층은 그 위의 계층들에 대해 알아서는 안된다는 점이다.

*Shared*와 *Pages*사이에는 세 가지 다른 계층이 있다: *Entities*, *Features*, *Widgets*이다. 몇몇 프로젝트들은 이러한 계층에 이미 어떤 코드를 작성해 뒀을 수 있고, 이는 우리가 *Shared*에 재사용 가능한 블록을 둘 수 없음을 의미한다. *Shared*에 헤더를 두게 되면 *Shared*에서 *Entities*나 *Features*의 기능을 가져와 써야하는 상황이 올 수 있기 때문이다(유저 프로필 정보 등). 이를 위해 *Widgets* 계층이 필요하다.

우리의 경우 헤더는 아주 간단하다 -- 정적 로고와 네비게이션만 가지고 있다. 네비게이션은 유저가 로그인 되어 있는지, 아닌지에 대한 API 요청을 만들어야 한다. 하지만 이는 `api` 세그먼트에서 임포트해서 다룰 수 있으니 아직은 헤더를 *Shared*에 두자.

### 페이지의 폼을 자세히 들여다보기

게시글 수정 페이지를 자세히 들여다보자:
![[Pasted image 20250204075608.png]]

별거 없지만, 아직 살펴보지 않은 몇몇 개발 단계에서 살펴봐야할 특징들이 있다 -- 양식 유효성 검증, 에러 상태, 데이터 지속성 등이다.

만약 이러한 페이지를 만든다고 가정하자. 우리는 *Shared*의 `ui` 세그먼트에서 인풋, 버튼을 가져와 이 페이지의 `ui`세그먼트에서 양식을 만들고, `api`세그먼트에 새로운 article을 생성하는 요청을 발생시키는 함수를 만들것이다.

요청을 보내기 전에 검증하기 위해 우리는 유요성 검증 스키마가 필요하다. 이 스키마를 두기 좋은 위치는 `model` 세그먼트인데 이는 스키마가 데이터 모델이기 때문이다. 여기서 우리는 에러 메세지를 생성하고 이를 `ui` 세그먼트의 다른 컴포넌트에서 보여줄것이다.

유저 경험을 향상시키기 위해, 우리는 입력값에 지속성을 더해줄것이다. 이러한 작업 또한 `model` 세그먼트에서 이루어진다.

### 요약

우리는 지금가지 몇몇 페이지를 검토했고 앱의 구조를 미리 그려봤다:
1. *Shared layer*
	1. `ui`에 재사용 가능한 컴포넌트를 포함시킨다.
	2. `api`에 원시적인 백엔드 요청 함수(래퍼같은)를 포함시킨다.
	3. 요구사항, 필요에 따라 추가한다.
2. *Pages layer* -- 각 페이지 마다 별도의 *slice*를 가진다
	1. `ui`에 페이지 컴포넌트와 페이지에서 사용되는 부분들의 컴포넌트가 포함된다.
	2. `api`에 특정한 목적의 요청 함수가 포함된다.
	3. `model`에는 클라이언트 사이트 스토리지가 포함된다.

## Part 2. In code

이제 계획을 세웠으니 실전으로 들어가보자. `React`와 `Remix`를 사용한다.

이 프로젝트를 위함 템플릿이 준비되어 있다: [https://github.com/feature-sliced/tutorial-conduit/tree/clean](https://github.com/feature-sliced/tutorial-conduit/tree/clean)

`npm install`을 통해 의존성을 설치하고 `npm run dev`를 입력해 개발 서버를 실행하자. http://localhost:3000 을 열면 빈 앱을 볼 수 있다.

### 페이지 구성하기
모든 빈 페이지 컴포넌트를 만드는 것부터 시작하자. 아래 코드를 실행시켜보자.

```text
npx fsd pages feed sign-in article-read article-edit profile settings --segments ui
```

이는 모든 페이지에 `pages/<name>/ui`와 index 파일을 생성한다.

### 피드 페이지 연결하기

피드 페이지에 루트 라우트를 연결하자. `pages/feed/ui`에 `FeedPage.tsx` 파일을 성생하고 다음과 같은 코드를 넣자:

```tsx
// pages/feed/ui/FeedPage.tsx
export function FeedPage() {
  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>
    </div>
  );
}
```

그리고 이 컴포넌트를 re-export 해서 페이지의 public API를 생성하자:
```tsx
// pages/feed/index.ts
export { FeedPage } from "./ui/FeedPage";
```

이제 이를 루트 라우트에 연결하자. `remix`에서 라우팅은 파일 기반이다. 그리고 라우트 파일은 `app/routes` 폴더에 위치해야 한다.

```tsx
// app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/node";
import { FeedPage } from "pages/feed";

export const meta: MetaFunction = () => {
	return [{ title: "Conduit" }];
};

export default FeedPage;
```

이제 개발 서버를 다시 보면 다음과 같은 배너를 볼 수 있다!

![[Pasted image 20250204082023.png]]

### API 클라이언트

백엔드와의 요청을 간편화 하기 위해 API 클라이언트를 *Shared*에 만들자. `api`와 `config`라는 두 세그먼트를 생성한다:
```text
npx fsd shared --segments api config
```

그리고 `shared/config/backend.ts`를 생성한다:
```ts
// shared/config/backend.ts
export const backendBaseUrl = "https://api.realworld.io/api";
```

```ts
// shared/config/index.ts
export { backendBaseUrl } from "./backend";
```

대부분의 현실 프로젝트에서는 OpenAPI 명세를 제공하기 때문에, 자동 타입 생성이라는 편리함을 누릴 수 있다. 우리는 `openapi-fetch` 패키지를 사용할것이다.

다음과 같은 커맨드를 통해 최신 API 타입을 생성하자:

```text
npm run generate-api-types
```

이는 `shared/api/v1.d.ts` 라는 파일을 생성할 것이다. 우리는 이 파일을 사용해 타입 API 클라이언트를 `shared/api/client.ts`에 생성할 것이다:
```ts
// shared/api/client.ts
import createClient from "openapi-fetch";

import { backendBaseUrl } from "shared-config";
import type { paths } from "./v1";

export const { GET, POST, PUT, DELETE } = createClient<paths>({ baseUrl: backendBaseUrl });
```

```ts
// shared/api/index.ts
export { GET, POST, PUT, DELETE } from "./client";
```

### 피드의 실제 데이터

이제 백엔드에 요청을 보내 그 응답으로 피드에 기사를 추가할 수 있다. 먼저 기사 미리보기 컴포넌트를 구현해보자.

`pages/feed/ui/ArticlePreview.tsx`를 생성하고 다음 코드를 추가하자:
```tsx
// pages/feed/ui/ArticlePreview.tsx
export function ActiclePreview({ article }) { /* TODO */ }
```

우리는 타입스크립트를 사용하고 있기 때문에 타입 정의된 객체를 정의하는게 좋다. `v1.d.ts` 파일을 보면 `components["schemas"]["Article"]` 스키마를 볼 수 있다. *Shared*에 다음과 같은 데이터 모델을 만들어서 익스포트 해보자:

```ts
// shared/api/models.ts
import type { components } from "./v1";

export type Article = components["schemas"]["Article"];
```

```ts
// shared/api/index.ts
exoprt { GET, POST, PUT, DELETE } from "./client";

export type { Article } from "./models";
```

이제 ArticlePreview 컴포넌트로 돌아가서 데이터를 표현해보자. 아래 같이 수정한다:
```tsx
// pages/feed/ui/ArticlePreview.tsx
import { Link } from "@remix-run/react";
import type { Article } from "shared/api";

interface ArticlePreviewProps {
  article: Article;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`} prefetch="intent">
          <img src={article.author.image} alt="" />
        </Link>
        <div className="info">
          <Link
            to={`/profile/${article.author.username}`}
            className="author"
            prefetch="intent"
          >
            {article.author.username}
          </Link>
          <span className="date" suppressHydrationWarning>
            {new Date(article.createdAt).toLocaleDateString(undefined, {
              dateStyle: "long",
            })}
          </span>
        </div>
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <Link
        to={`/article/${article.slug}`}
        className="preview-link"
        prefetch="intent"
      >
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}
```

좋아요 버튼은 아직 아무것도 하지 않는다. 이후에 좋아요 기능을 구현할 때 수정할 예정이다.

이제 우리는 기사들을 불러와서 카드에 렌더링 해줄 수 있게 되었다. `Remix`에서 fetching은 *loader*(서버사이드)를 통해 이루어진다. *loader*는 페이지를 대신해서 API와 상호작용하므로, 이를 페이지의 *segment*에 둘것이다.

```tsx
// pages/feed/api/loader.ts
import { json } from "@remix-run/node";

import { GET } from "shared/api";

export const loader = async () => {
  const { data: articles, error, response } = await GET("/articles");

  if (error !== undefined) {
    throw json(error, { status: response.status });
  }

  return json({ articles });
};
```

이를 페이지에 연결하기 위해, `loader`라는 이름으로 라우트 파일에서 export 해주어야 한다:

```ts
// pages/feed/index.ts
export { FeedPage } from "./ui/FeedPage";
export { loader } from "./api/loader";
```

```ts
// app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/node";
import { FeedPage } from "pages/feed";

export { loader } from "pages/feed";

export const meta: MetaFunction = () => {
  return [{ title: "Conduit" }];
};

export default FeedPage;
```

그리고 마지막 단계는 이 카드를 피드에서 렌더링 하는 것이다. `FeedPage`를 아래와 같이 수정하자:

```tsx
// pages/feed/ui/FeedPage.tsx
import { useLoaderData } from "@remix-run/react";

import type { loader } from "../api/loader";
import { ArticlePreview } from "./ArticlePreview";

export function FeedPage() {
  const { articles } = useLoaderData<typeof loader>();

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            {articles.articles.map((article) => (
              <ArticlePreview key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 태그를 사용한 필터링

우리는 태그들을 백엔드에서 받아오고 선택된 태그를 클라이언트 스토어에 저장해야 한다. loader에서 또 다른 요청을 보내보자. 이번에는 편의성 함수인 `promiseHash`를 사용해보자.

`pages/feed/api/loader.rs`파일을 다음과 같이 업데이트 한다:
```tsx
// pages/feed/api/loader.ts

import { json } from "@remix-run/node";
import type { FetchResponse } from "openapi-fetch";
import { promiseHash } from "remix-utils/promise";

import { GET } from "shared/api";

async function throwAnyErrors<T, O, Media extends `${string}/${string}`>(
  responsePromise: Promise<FetchResponse<T, O, Media>>,
) {
  const { data, error, response } = await responsePromise;

  if (error !== undefined) {
    throw json(error, { status: response.status });
  }

  return data as NonNullable<typeof data>;
}

export const loader = async () => {
  return json(
    await promiseHash({
      articles: throwAnyErrors(GET("/articles")),
      tags: throwAnyErrors(GET("/tags")),
    }),
  );
};
```

`throwAnyErrors`라는 함수를 통해 에러를 핸들링 하고 있다. 이 함수는 상당히 유용하고, 나중에 재사용될 수 있지만 지금은 여기에 두자.

이제 태그의 리스트를 렌더링하고, 상호작용 가능하게 만들어보자. 태그를 클릭하면 선택되어야 한다. 선택된 태그를 관리하기 위해 URL search parameter를 사용한다.

`pages/feed/ui/FeedPage.tsx`파일을 다음과 같이 업데이트 하자:
```tsx
// pages/feed/ui/FeedPage.tsx

import { Form, useLoaderData } from "@remix-run/react";
import { ExistingSearchParams } from "remix-utils/existing-search-params";

import type { loader } from "../api/loader";
import { ArticlePreview } from "./ArticlePreview";

export function FeedPage() {
  const { articles, tags } = useLoaderData<typeof loader>();

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            {articles.articles.map((article) => (
              <ArticlePreview key={article.slug} article={article} />
            ))}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <Form>
                <ExistingSearchParams exclude={["tag"]} />
                <div className="tag-list">
                  {tags.tags.map((tag) => (
                    <button
                      key={tag}
                      name="tag"
                      value={tag}
                      className="tag-pill tag-default"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
```

이제 `loader`에서 `tag` 서치 파라미터를 사용해야 한다. `pages/feed/api/loader.ts` 파일을 아래와 같이 수정하자:
```tsx
// pages/feed/api/loader.ts

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { FetchResponse } from "openapi-fetch";
import { promiseHash } from "remix-utils/promise";

import { GET } from "shared/api";

async function throwAnyErrors<T, O, Media extends `${string}/${string}`>(
  responsePromise: Promise<FetchResponse<T, O, Media>>,
) {
  const { data, error, response } = await responsePromise;

  if (error !== undefined) {
    throw json(error, { status: response.status });
  }

  return data as NonNullable<typeof data>;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const selectedTag = url.searchParams.get("tag") ?? undefined;

  return json(
    await promiseHash({
      articles: throwAnyErrors(
        GET("/articles", { params: { query: { tag: selectedTag } } }),
      ),
      tags: throwAnyErrors(GET("/tags")),
    }),
  );
};
```

### 페이지네이션


유사항 방식으로 페이지네이션도 구현할 수 있다. 다음과 같이 작성하자:
```tsx
// pages/feed/api/loader.ts

import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { FetchResponse } from "openapi-fetch";
import { promiseHash } from "remix-utils/promise";

import { GET } from "shared/api";

async function throwAnyErrors<T, O, Media extends `${string}/${string}`>(
  responsePromise: Promise<FetchResponse<T, O, Media>>,
) {
  const { data, error, response } = await responsePromise;

  if (error !== undefined) {
    throw json(error, { status: response.status });
  }

  return data as NonNullable<typeof data>;
}

/** Amount of articles on one page. */
export const LIMIT = 20;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const selectedTag = url.searchParams.get("tag") ?? undefined;
  const page = parseInt(url.searchParams.get("page") ?? "", 10);

  return json(
    await promiseHash({
      articles: throwAnyErrors(
        GET("/articles", {
          params: {
            query: {
              tag: selectedTag,
              limit: LIMIT,
              offset: !Number.isNaN(page) ? page * LIMIT : undefined,
            },
          },
        }),
      ),
      tags: throwAnyErrors(GET("/tags")),
    }),
  );
};
```

```tsx
// pages/feed/ui/FeedPage.tsx

import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { ExistingSearchParams } from "remix-utils/existing-search-params";

import { LIMIT, type loader } from "../api/loader";
import { ArticlePreview } from "./ArticlePreview";

export function FeedPage() {
  const [searchParams] = useSearchParams();
  const { articles, tags } = useLoaderData<typeof loader>();
  const pageAmount = Math.ceil(articles.articlesCount / LIMIT);
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            {articles.articles.map((article) => (
              <ArticlePreview key={article.slug} article={article} />
            ))}

            <Form>
              <ExistingSearchParams exclude={["page"]} />
              <ul className="pagination">
                {Array(pageAmount)
                  .fill(null)
                  .map((_, index) =>
                    index + 1 === currentPage ? (
                      <li key={index} className="page-item active">
                        <span className="page-link">{index + 1}</span>
                      </li>
                    ) : (
                      <li key={index} className="page-item">
                        <button
                          className="page-link"
                          name="page"
                          value={index + 1}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ),
                  )}
              </ul>
            </Form>
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <Form>
                <ExistingSearchParams exclude={["tag", "page"]} />
                <div className="tag-list">
                  {tags.tags.map((tag) => (
                    <button
                      key={tag}
                      name="tag"
                      value={tag}
                      className="tag-pill tag-default"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

이제 인증을 구현해보자.

### 인증

인증은 두 가지 페이지를 가진다. 하나는 로그인 다른 하나는 등록이다. 이 둘은 거의 동일하기 때문에 같은 *slice*에 함께 있어도 괜찮다. `sign-in` 이라는 동일한 *slice*에 두고 코드를 재사용 할 수 있도록 하자.

`RegisterPage.tsx` 파일을 `ui` 세그먼트 안에 만들고 다음의 코드를 작성한다:
```tsx
// pages/sign-in/ui/RegisterPage.tsx

import { Form, Link, useActionData } from "@remix-run/react";

import type { register } from "../api/register";

export function RegisterPage() {
  const registerData = useActionData<typeof register>();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>

            {registerData?.error && (
              <ul className="error-messages">
                {registerData.error.errors.body.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}

            <Form method="post">
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="username"
                  placeholder="Username"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
```

고쳐야할 깨진 임포트가 있다. 이는 세그먼트와 관려이 있기 때문에 다음과 같이 생성한다:
```text
npx fsd pages sign-in -s api
```

회원가입 백엔드 부분을 구현하기 전에, `Remix`가 세션을 처리하기 위한 인프라 코드가 필요하다. *Shared*에 위치시켜 다른 페이지들도 재사용 가능하게 하자.

아래 코드를 `shared/api/auth.server.ts`에 생성하자. `Remix`에 한정적인 코드니 잘 몰라도 괜찮다:
```tsx
// shared/api/auth.server.ts

import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "./models";

invariant(
  process.env.SESSION_SECRET,
  "SESSION_SECRET must be set for authentication to work",
);

const sessionStorage = createCookieSessionStorage<{
  user: User;
}>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createUserSession({
  request,
  user,
  redirectTo,
}: {
  request: Request;
  user: User;
  redirectTo: string;
}) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);

  session.set("user", user);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function getUserFromSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);

  return session.get("user") ?? null;
}

export async function requireUser(request: Request) {
  const user = await getUserFromSession(request);

  if (user === null) {
    throw redirect("/login");
  }

  return user;
}
```

`User` 모델을 다음과 같이 `models.ts`파일에서 익스포트 해준다:
```tsx
// shared/api/models.ts

import type { components } from "./v1";

export type Article = components["schemas"]["Article"];
export type User = components["schemas"]["User"];
```

이 코드가 동작하기 전에, `SESSION_SECRET` 환경 변수를 설정해줘야 한다. `.env`파일을 생성하고 아래와 같이 랜덤 문자열을 `SESSION_SECRET`에 할당해주자:
```env
// .env
SESSION_SECRET=asldfjeiavmcnslkdjfleqweadsf
```

그리고 이제 이 함수를 위한 퍼블릭 API를 만들어주자:
```ts
export { GET, POST, PUT, DELETE } from "./client";

export type { Article } from "./models";

export { createUserSession, getUserFromSession, requireUser } from "./auth.server";
```

이제 백엔드에 회원가입 요청을 보내는 코드를 작성해보자. `pages/sign-in/api`에 `register.ts`파일을 생성하고 다음 코드를 작성한다:
```ts
// pages/sign-in/api/register.ts

import { json, type ActionFunctionArgs } from "@remix-run/node";

import { POST, createUserSession } from "shared/api";

export const register = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const { data, error } = await POST("/users", {
    body: { user: { email, password, username } },
  });

  if (error) {
    return json({ error }, { status: 400 });
  } else {
    return createUserSession({
      request: request,
      user: data.user,
      redirectTo: "/",
    });
  }
};
```

```ts
// pages/sign-in/index.ts

export { RegisterPage } from './ui/RegisterPage';
export { register } from './api/register';
```

거의 다됐다. 이제 회원가입 페이지를 `/register` 라우트에 연결하기만 하면 된다. `register.tsx`파일을 `app/routes`에 생성하자.

```ts
// app/routes/register.tsx

import { RegisterPage, register } from "pages/sign-in";

export { register as action };

export default RegisterPage;
```

이제 http://localhost:3000/register 에서 유저를 생성할 수 있어야 한다.

유사한 방식으로 로그인 페이지도 구현할 수 있다:
```tsx
// pages/sign-in/api/sign-in.ts

import { json, type ActionFunctionArgs } from "@remix-run/node";

import { POST, createUserSession } from "shared/api";

export const signIn = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const { data, error } = await POST("/users/login", {
    body: { user: { email, password } },
  });

  if (error) {
    return json({ error }, { status: 400 });
  } else {
    return createUserSession({
      request: request,
      user: data.user,
      redirectTo: "/",
    });
  }
};
```

```tsx
// pages/sign-in/ui/SignInPage.tsx

import { Form, Link, useActionData } from "@remix-run/react";

import type { signIn } from "../api/sign-in";

export function SignInPage() {
  const signInData = useActionData<typeof signIn>();

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>

            {signInData?.error && (
              <ul className="error-messages">
                {signInData.error.errors.body.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}

            <Form method="post">
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  name="email"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign in
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// pages/sign-in/index.ts

export { RegisterPage } from './ui/RegisterPage';
export { register } from './api/register';
export { SignInPage } from './ui/SignInPage';
export { signIn } from './api/sign-in';
```

```tsx
// app/routes/login.tsx

import { SignInPage, signIn } from "pages/sign-in";

export { signIn as action };

export default SignInPage;
```

### 헤더

Part1에서 얘기한것처럼, 헤더는 보통 위젯이나 *Shared*에 위치한다. 우리는 *Shared*에 놓으려 한다. 간단한 기능만을 하기 때문이다. 헤더를 생성할 폴더를 만들자:
```text
npx fsd shared ui
```

이제 `shared/ui/Header.tsx` 파일을 생성하고 다음 내용을 채워넣자:
```tsx
// shared/ui/Header.tsx

import { useContext } from "react";
import { Link, useLocation } from "@remix-run/react";

import { CurrentUser } from "../api/currentUser";

export function Header() {
  const currentUser = useContext(CurrentUser);
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/" prefetch="intent">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link
              prefetch="intent"
              className={`nav-link ${pathname == "/" ? "active" : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>
          {currentUser == null ? (
            <>
              <li className="nav-item">
                <Link
                  prefetch="intent"
                  className={`nav-link ${pathname == "/login" ? "active" : ""}`}
                  to="/login"
                >
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  prefetch="intent"
                  className={`nav-link ${pathname == "/register" ? "active" : ""}`}
                  to="/register"
                >
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  prefetch="intent"
                  className={`nav-link ${pathname == "/editor" ? "active" : ""}`}
                  to="/editor"
                >
                  <i className="ion-compose"></i>&nbsp;New Article{" "}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  prefetch="intent"
                  className={`nav-link ${pathname == "/settings" ? "active" : ""}`}
                  to="/settings"
                >
                  {" "}
                  <i className="ion-gear-a"></i>&nbsp;Settings{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  prefetch="intent"
                  className={`nav-link ${pathname.includes("/profile") ? "active" : ""}`}
                  to={`/profile/${currentUser.username}`}
                >
                  {currentUser.image && (
                    <img
                      width={25}
                      height={25}
                      src={currentUser.image}
                      className="user-pic"
                      alt=""
                    />
                  )}
                  {currentUser.username}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
```

이 컴포넌트를 `shared/ui`에서 재 익스포트 한다:
```ts
// shared/ui/index.ts

export { Header } from "./Header";
```

헤더는 `shared/api`에서 생성된 컨텍스트에 의존하고 있다. 이 또한 만들어 보자:
```tsx
// shared/api/currentUser.ts

import { createContext } from "react";

import type { User } from "./models";

export const CurrentUser = createContext<User | null>(null);
```

