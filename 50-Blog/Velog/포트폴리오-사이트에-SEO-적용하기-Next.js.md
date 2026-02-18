---
type: blog-post
source: velog
author: "koreanthuglife"
title: "포트폴리오 사이트에 SEO 적용하기 (Next.js)"
slug: "포트폴리오-사이트에-SEO-적용하기-Next.js"
velogId: "8e7782e7-18c2-4fca-a618-41041b837c0b"
velogUrl: "https://velog.io/@koreanthuglife/포트폴리오-사이트에-SEO-적용하기-Next.js"
published: "2024-04-22T12:02:39.537Z"
updated: "2026-02-11T02:25:47.764Z"
tags:
  - "next.js"
  - "seo"
  - "프론트엔드"
  - "항해99"
  - "항해플러스"
description: "포트폴리오 사이트에 SEO를 적용해 보았습니다! SEO를 잘 아시는 분들은 꼭 댓글로 추가 사항 알려주세요!"
importedAt: "2026-02-18T07:28:49.893Z"
---

# SEO
최근 포트폴리오 사이트를 개발중입니다. 다음 사이트에서 제 포트폴리오를 확인할 수 있습니다...! 아직 컨텐츠를 추가하지 않아서 비어있긴 하지만... 곧 추가 예정입니다!
https://portfolio.gihwan-dev.com

개발과 배포가 이제 막 끝나고 SEO를 제대로 한 번 적용해보자! 하는 마음이 들어 정리하며 글을 남기려 합니다...

## favicon
첫 번째로 favicon을 생성하고 추가하는 작업을 진행했습니다. favicon 생성에 사용할 로고를 준비해 줍니다.
https://www.favicon-generator.org/
위 사이트에 접속해서
![](https://velog.velcdn.com/images/koreanthuglife/post/b2604957-ae88-45d4-899f-1c9737ad0414/image.png)
이미지를 넣어 주고 Create Favicon 버튼을 눌러 생성해 줍니다.
![](https://velog.velcdn.com/images/koreanthuglife/post/2be5046b-d029-4c1a-b4d0-cc5ae8be982b/image.png)
생성된 파비콘을 다운로드 하고 아래 코드를 복사해 줍니다.

![](https://velog.velcdn.com/images/koreanthuglife/post/39d8580e-c55b-4dde-aa4b-189d80d79daf/image.png)
다운로드된 zip 폴더를 풀고 안에 있는 모든 파일을 복사해서 Next.js의 `public` 폴더에 붙여 넣습니다.

![](https://velog.velcdn.com/images/koreanthuglife/post/969abf25-4288-474a-95d5-d6416a59d049/image.png)

그리고 Next.js의 `Head` 태그를 사용해 복사한 `link` 메타 태그들을 layout.tsx 파일에 붙여넣습니다.
```tsx
import Head from 'next/head';

const MetaTag = () => {
  return (
    <Head>
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};

export default MetaTag;
```
저는 따로 컴포넌트를 분리해서 만들었습니다!

이렇게 하면 favicon 생성은 완료 되었습니다.
## robot.txt
검색엔진에게 이 페이지에 대한 수집 정보를 제공하기 위해 robot.txt 파일을 `public` 폴더에 생성해 줍니다. 그리고 저는 아래의 내용을 추가했습니다.
```txt
User-Agent: *
Allow: /
Disallow: /private/
Sitemap: https://portfolio.gihwan-dev.com/sitemap.xml
```
Disallow에는 검색 엔진에 의해 수집되면 안되는 경로를 적어주면 됩니다.
robot.txt 역시 이제 완료되었습니다.
## sitemap.xml
제 사이트는 동적으로 생성되는 페이지들이 있기 때문에 `public` 폴더가 아닌 `app` 디렉토리의 루트 위치에 `sitemap.ts` 파일을 생성해 줍니다. Next.js 13에서는 Sitemap을 동적으로 생성할 수 있는 방법을 제공해 줍니다. 다음 링크에서 확인할 수 있습니다.
https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

```tsx
import { type MetadataRoute } from 'next';
import { db } from '~/server/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const documents = await db.documents.findMany();
  return [
    {
      url: 'https://portfolio.gihwan-dev.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://portfolio.gihwan-dev.com/main',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://portfolio.gihwan-dev.com/main/projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // 동적으로 생성하는 부분!
    ...documents.map(doc => ({
      url: `https://portfolio.gihwan-dev.com/main/projects/${doc.document_id}`,
      lastModified: doc.reg_date,
    })),
    // 동적으로 생성하는 부분 끝!
  ];
}
```

## Metadata
각 페이지별로 title 과 description 등의 메타 데이터를 적용해 줍니다. `page.tsx` 파일에서 다음과 같이 metadata를 export 해주면 됩니다.
```tsx
export const metadata: Metadata = {
  title: '프론트엔드 개발자 최기환의 포트폴리오 입니다.',
  description:
    '프론트엔드 개발자 최기환이라고 합니다. Next.js로 개발된 포트폴리오 사이트 입니다.',
  openGraph: {
    title: '프론트엔드 개발자 최기환의 포트폴리오 입니다.',
    description:
      '프론트엔드 개발자 최기환이라고 합니다. Next.js로 개발된 포트폴리오 사이트 입니다.',
  },
  twitter: {
    title: '프론트엔드 개발자 최기환의 포트폴리오 입니다.',
    description:
      '프론트엔드 개발자 최기환이라고 합니다. Next.js로 개발된 포트폴리오 사이트 입니다.',
  },
};
```
이 작업은 쉬워서 별다른 설명이 필요하지 않을거라 생각합니다. 다만 metadata역시도 동적으로 생성 가능합니다. 이에 대해 설명 드리겠습니다. 다음 링크에서 자세한 내용을 확인할 수 있습니다.
https://nextjs.org/docs/app/building-your-application/optimizing/metadata

```tsx
type Props = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const document = await db.documents.findUnique({
    where: { document_id: +id },
    select: {
      document_id: true,
      title: true,
      description: true,
      thumbnail: true,
    },
  });

  if (!document) {
    return {
      title: '존재하는 문서가 아닙니다. 죄송합니다.',
    };
  }

  return {
    title: document.title,
    description: document.description,
    openGraph: {
      title: document.title,
      description: document.description,
      images: [document.thumbnail],
    },
    twitter: {
      title: document.title,
      description: document.description,
      images: [document.thumbnail],
    },
  };
}

export default function Page() {
  ....
  return <SomePage />
}
```
위와 같은 형식으로 동적으로 metadata를 생성할 수 있습니다.
## jsonLD
JSON-LD(JSON for Linked Data)는 웹 페이지에 구조화된 데이터를 포함시키기 위해 사용되는 JSON 기반의 데이터 형식입니다. 이를 통해 검색 엔진이 웹사이트의 내용을 더 잘 이해하고, 검색 결과에서 더 풍부한 정보를 제공할 수 있도록 돕습니다.

jsonLD 데이터 역시 동적으로 생성해 추가할 수 있습니다. 다음 링크에서 확인할 수 있습니다.
https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
```tsx
export default async function ProjectDetailPage({ params }: ParamsProps) {
  const { id } = params;

  const document = await db.documents.findUnique({
    where: { document_id: +id },
  });

  if (!document) {
    throw new Error('페이지를 찾을 수 없습니다.');
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://portfolio.gihwan-dev.com/main/projects/' + id,
    },
    headline: document.title,
    image: [document.thumbnail],
    datePublished: document.reg_date,
    dateModified: Date.now(),
    author: {
      '@type': 'Person',
      name: '최기환',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gihwan-dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https:///portfolio.gihwan-dev.com/favicon.icon',
      },
    },
    description: document.description,
  };

  return (
    <SomePage />
  );
}
```
# 결론
여기까지가 제가 현재까지 작업한 SEO 작업 입니다! 후에 좀 더 추가할 사항이 생긴다면 계속해서 추가하겠습니다. 혹시나 더 아시는 SEO 팁이 있다면 알려주세요!

---
