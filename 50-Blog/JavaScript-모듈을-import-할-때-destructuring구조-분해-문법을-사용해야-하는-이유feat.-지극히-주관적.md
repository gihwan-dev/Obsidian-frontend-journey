---
type: blog-post
source: velog
author: "koreanthuglife"
title: "JavaScript 모듈을 import 할 때 destructuring(구조 분해 문법)을 사용해야 하는 이유!(feat. 지극히 주관적)"
slug: "JavaScript-모듈을-import-할-때-destructuring구조-분해-문법을-사용해야-하는-이유feat.-지극히-주관적"
velogId: "2b27bb8e-44b9-4994-8d34-59f5a803a7ae"
velogUrl: "https://velog.io/@koreanthuglife/JavaScript-모듈을-import-할-때-destructuring구조-분해-문법을-사용해야-하는-이유feat.-지극히-주관적"
published: "2024-01-24T02:54:04.143Z"
updated: "2026-02-11T06:02:12.148Z"
tags:
  - "JavaScript"
description: "Node.js 디자인 패턴 바이블 이라는 책을 보다가 이전에 항상 고민해왔던 궁금증에 대한 답을 스스로 내리게 되어 글을 작성하게 되었다.이전에 친구와 함께 프로젝트를 하나 진행했는데 친구의 코드에서 다음과 같은 import를 목격했다.이날 이후로 나는 항상 고민해왔다"
importedAt: "2026-02-18T07:28:49.893Z"
---

`Node.js 디자인 패턴 바이블` 이라는 책을 보다가 이전에 항상 고민해왔던 궁금증에 대한 답을 스스로 내리게 되어 글을 작성하게 되었다.

## React에서의 import
이전에 친구와 함께 프로젝트를 하나 진행했는데 친구의 코드에서 다음과 같은 `import`를 목격했다.
```jsx
import React from 'react'
const TempComponent = () => {
  const [test, setTest] = React.useState(0);
  return <div>...</div>
}
```

이날 이후로 나는 항상 고민해왔다. `React`에서 `import` 할 때 어떻게 `import` 하는것이 좋을까?

이전의 `React` 에서는 `import React from 'react'` 를 붙여주어 `JSX` 문법 형태의 `React` 파일임을 알게 해주어야 했다고 한다.

그럼 고민은 여기서 시작된다. 지금은 왜 쓰는걸까? 왜 쓰는지 알아보기 위해 열심히 구글링 했다. 내가 찾은 답변은 다음과 같은 답변이 대다수 였다고 생각한다.

> 코딩 컨벤션에 맞게 알아서 사용해라. 어떤걸 사용해도 성능적인 부분에서든 어떤 부분에서든 문제는 없다

그래서 두 방법을 다 써보고 편한대로 팀원과 맞춰주는 형태로 써왔다. 그런데 오늘 `Node.js 디자인 패턴 바이블` 이라는 책을 읽으면서 내 스스로 답을 내렸다.

## Destructuring을 사용하지 않을 때(default import)시의 문제점
물론 확인해보니 `React` 에서는 이 문제점이 에러를 발생시키는 것을 보았다. 제대로 테스트를 하지 않아서 그랬을 수 있다. 차우 좀 더 제대로 테스트할 예정이다. 아래 코드를 보자
```js
import fs from "fs";

console.log(fs.readFile);

const consoleHelloWorld = () => {
  console.log("Hello World");
}

fs.readFile = consoleHelloWorld;

fs.readFile();

console.log(fs.readFile);
```
이 코드의 콘솔 결과는 뭘까? 다음과 같다.
```text
[Function: readFile]
Hello World
[Function: consoleHelloWorld]
```
그렇다... 메서드의 재 할당이 가능하다. 예상 했겠지만 구조 분해 문법을 사용하면 이러한 문제가 없다. 다음 코드와 출력을 보자.
```js
import { readFile } from "fs";

console.log(readFile);

const consoleHelloWorld = () => {
  console.log("Hello World");
};

readFile = consoleHelloWorld;

readFile();

console.log(readFile);
```
**결과**
```text
readFile = consoleHelloWorld;
         ^

TypeError: Assignment to constant variable.
    at file:///Users/choegihwan/Desktop/Projects/portfolio/code/test/index.js:23:10
    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:329:24)
    at async loadESM (node:internal/process/esm_loader:28:7)
    at async handleMainPromise (node:internal/modules/run_main:120:12)

Node.js v21.5.0
```
왜 이런 차이가 발생하는 걸까?

## ESM의 동작 방식
나도 잘 모르겠다. 공부하는 중이다. 일단 내가 공부한 바에 따르면 `import fs from 'fs'`를 하게 되면 모듈 전체를 객체로 가져온다. 그리고 `import { readFile } from 'fs'` 는 구조 분해 문법이다. 구조 분해된 각 모듈이 상수 형태로 할당된다.

그렇기 때문에 구조 분해 문법으로 가져온 모듈의 참조값은 직접 바꿀 수 없지만 전체를 불러오는 경우 객체의 프로퍼티나 메서드의 값을 바꾸는 것 처럼 할 수 있게 되는거다.

## 내가 내린 결론
그래서 나는 구조 분해 문법만을 사용하기로 오늘 마음 먹었다. 물론 제대로된 테스트를 거치지 않았기에 자세한건 모른다. 리액트에서 딱히 문제가 되지 않을 수 있다. 그런데 어쨌든 내제된 위험성을 가지고 있다는 것이다. 결국 프로젝트를 진행하면 코딩 컨벤션을 맞춰 진행하게 될텐데 `React` 모듈 전체를 가져오는것과 같은 이러한 관습을 사용하지 않는게 좋겠다는 결론을 내렸다.

아직도 잘 모른다. 여전히 계속해서 고민해봐야 할 주제라고 생각된다. 어쨌든 확실한건 두 임포트 구문 각자의 장단점을 가지고 있고, 하나의 방법으로 임포트를 일관되게 유지하는 것이 좋아 보인다는 것이다.
