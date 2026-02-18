---
type: blog-post
source: velog
author: "koreanthuglife"
title: "Node.js 공식 문서 번역하며 배우기"
slug: "Node.js-배우기"
velogId: "4c30b80b-9760-4ca5-a225-a09b2b8564cd"
velogUrl: "https://velog.io/@koreanthuglife/Node.js-배우기"
published: "2023-04-04T12:58:05.020Z"
updated: "2026-02-09T04:19:32.320Z"
tags:
  - "node.js"
description: "공식 문서 번역 및 정리https&#x3A;//nodejs.dev/en/learn/differences-between-nodejs-and-the-browser/위 코드를 실행하기 위해서 이 파일을 server.js로 저장하고 커맨드에서 node sever.js를 실행하"
importedAt: "2026-02-18T07:28:49.893Z"
---

# Node.js
공식 문서 번역 및 정리
https://nodejs.dev/en/learn/differences-between-nodejs-and-the-browser/

## Node.js 애플리케이션 예제
```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
위 코드를 실행하기 위해서 이 파일을 server.js로 저장하고 커맨드에서 node sever.js를 실행하면 된다.
이 코드는 우선 **http module**을 불러온다.
>http module 이란?
사용하기 어려운 프로토콜의 특성을 돕기 위해 작성된 Node.js의 HTTP interfaces.

http모듈의 **CreateServer()** 메소드는 HTTP 서버를 만들어 반환한다.
서버는 특정한 포트와 호스트 네임을 listen한다. 서버가 준비되면 callback함수가 호출된다.
언제든지 새로운 요청이 들어오면 request event가 호출되고 두 객체를 전달한다.(request, response)
이 2가지 객체는 HTTP call을 처리하는데 필수적인 요소다.

request는 요청 세부사항을 제공하고, reponse는 호출자에게 data를 return하기 위해 사용된다.
위 코드에서
```javascript
res.statusCode = 200; // status 200 = 성공적인 응답을 의미
res.setHeader('Content-Type', 'text/plain'); // 헤더에 콘텐츠 타입을 설정해줌
res.end('Hello World\n'); // response를 닫고, 인수로 content를 추가
```

## Node.js 설치 방법
 https://nodejs.dev/download/
 위 공식 사이트에서 다운로드 할 수 있다.
 
 ## Node.js를 실행하기 위해 자바스크립트를 얼마나 알아야 하는가?
 ### Node.js를 깊게 공부하기 위해 알아야 할 선수 지식
 - 렉시컬 환경
 - 표현문
 - 데이터 타입
 - 클래스
 - 변수
 - 함수
 - this 연산자
 - 화살표 함수
 - 루프
 - 스코프
 - 배열
 - 템플릿 리터럴
 - Strict 모드
 - ES6
 - 비동기 프로그래밍과 콜백
 - 타이머
 - Promises
 - Async and Await
 - Closures
 - 이벤트 루프

## Node.js와 브라우저의 차이
간략하게 Node.js는 여러 내장 라이브러리와 모듈들을 사용할 수 있다.

## V8 Javascript Engine
구글 크롬 자바스크립트 엔진이다.
2009년에 node.js가 이걸 사용하기로 채택했다.

## NPM 패키지 매니저
Node.js 성공의 주요한 역할을 한 파워풀한 패키지 매니저다. 가장 큰 코드 리포를 가지고 있다.
그저 짧은 소개다 더 자세한 내용은 https://docs.npmjs.com/about-npm 여기서 참고해라.

npm은 표준 패키지 매니저다.
npm은 내 프로젝트의 dependencies를 관리해준다.

### Installing all dependencies
만약 프로젝트가 package.json 파일을 가지고 있다면
```bash
npm install
```
를 통해서 프로젝트에 필요한 모든것을 다운로드할 수 있다.
> package.json은?
npm init를 통해서 간편하게 설정하고 만들 수 있다.

### Installing a single package
```bash
npm install <package-name>
```
을 통해 간편하게 설치할 수 있다.

종종 다음과 같은 flag들을 볼 수 있을거다.
 - --save-dev: package.json 파일의 devDependencies에 엔트리를 추가하고 설치
 - --no-save: 설치하지만 dependencies에 엔트리를 추가하지 않음
 - --save-optional: optionalDependencies에 엔트리 추가 및 설치
 - --no-optional: 설치로부터 optional dependencies로 접근을 막음
 
Dependencies 와 devDependencies의 차이점은 후자는 개발 툴을 포함한다(에: 테스팅 라이브러리) 전자는 배포될 앱 번들이다.

optionalDependencies의 차이점은 빌드의 실패가 설치의 실패를 일으키지 않는다는 것이다.

### Updating package
```bash
npm update
npm update <package-name>
```

### Versioning
```bash
npm install <package-name>@<version>
```

### Running Tasks
```bash
npm run <task-name>
```
package.json에 scripts 명령어를 실행
```javascript
{
	"scripts": {
		"start-dev": "node lib/server-development",
        "start": "node lib/server-production"
    }
}
```
다음은 아주 흔한 웹팩 실행 설정이다.
```javascript
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```
긴 명령어를 입력하는 대신
```bash
npm run watch
npm run dev
npm run prod
```
를 사용해라.

## ECMAScript 2015(ES6) and beyond
모든 ECMAScript 2015(ES6) features는 3그룹으로 나뉜다.
**shipping, staged, progress**
- V8엔진이 안정적이라고 생각하는 모든 **shipping** features은 Node.js에서 기본적으로 켜져있으면 다른 런타임 flag를 요구하지 않는다.
- V8팀이 안정적이라고 생각하지 않는 거의 완료된 **Staged** features 런타임 flag (**--harmony**) 를 요구한다.
- In **Progress** features는 각각의 flag를 통해 활성화 될 수 있다. 하지만 테스트를 위한것이 아니라면 권장하지 않는다.
> #### 용어정리
 **shipping**:
 완료된 product, features를 배포하거나, 업데이터 하는 과정을 의미. 즉, 완성되었고 문제가 없이 배포된 상태를 의미하는듯 하다.
 **staged**:
 개발 환경과 비슷한 환경에서 변경 또는 업데이트가 테스트된 상태. 주로 배포 전 마지막 단계이다. 즉, 완성후 테스트까지 진행되었지만 배포되진 않은 상태.
 **progress**
개발을 계속해서 진행중인 상태. 즉, 아직 개발이 진행중인 상태를 의미.
**features**:
기능, 플랫폼이 개발자에게 제공하는 tools, 능력 등을 의미한다. 

## 어떤 features가 Node.js에서 default로 사용가능한가?
https://node.green/ 이 사이트에서 확인할 수 있다.

## 어떤 features가 in progress 상태인가?
```bash
node --v8-options | grep "in progress"
```
이 커맨드를 통해 확인할 수 있다. 이 features들은 완성되지 않았다. 그러므로 각자 위험요소를 감수하고 사용해야한다.

## development 와 production의 차이
production 과 development 환경을 다르게 설정할 수 있다.
Node.js는 항상 개발 환경에서 실행한다고 추정한다. Node.js에게 **NODE_ENV=productions** 이라는 환경변수를 통해 production 환경에서 실행하고 있다고 알려줄 수 있다.
```bash
export NODE_ENV=production
```
하지만 shell comfiguration 파일에 쓰는것이 더 좋다. 재부팅하면 다시 세팅해야하기 때문.

**production**환경으로 설정하는것은 다음과 같은 일들을 한다.
- 로깅을 필수적인 수준으로 최소화한다.
- 성능을 최적화하기 위해 더 많은 캐싱을 받아들인다.

예를들어 Pug(Express templating liabrary)에서는 development 환경으로 세팅될 경우 매번 모든 요청에 다시 컴파일된다.
```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```
이처럼 조건문을 통해 다른 환경에서 실행하도록 할 수 있다.

## Node.js with TypeScript
TypeScript가 왜 좋은지 살펴보자.

### What is TypeScript
타입스크립트는 마이크로소포트에서 관리하는 오픈소스 언어이다. 수많은 사람들이 사용중이다.

더 많은 능력을 추가해주는 자바스크립트의 슈퍼셋이다. 가장 주목할만한 추가는 정적 타입 정의다. 이 덕분에 함수에서 어떤 타입의 인수가 필요하고 어떤 타입이 반환되어야 하는지 알 수 있으며 우리가 생성한 객체가 정확이 어떤 모양인지도 알 수 있게 해준다. 자바스크립트 코드가 더 안전한 상태일 수 있도�� 만들어 준다.
#### 예제
```typescript
type User = {
  name: string;
  age: number;
};

function isAdult(user: User): boolean {
  return user.age >= 18;
}

const justine: User = {
  name: 'Justine',
  age: 23,
};

const isJustineAnAdult: boolean = isAdult(justine);

```
대충 이런 형태다. 타입스크립트는 따로 공부하는게 좋다. 일단 넘어가자.
그렇다면 이 타입스크립트 코드를 어떻게 실행하는가?

첫번째로 프로젝트에 타입스크립트를 설치한다.
```bash
npm i -D typescript
```
이제 tsc 커맨드를 통해서 자바스크립트로 컴파일 할 수 있다.
```bash
npx tsc example.ts
```
>
npx(Node Package Execute)는 전역으로 타입스크립트를 설치하지 않고 타입스크립트 컴파일러를 실행할 수 있도록 해준다.

### TypeScript in the Node.js world
여러 프레임워크들이 타입스크립트를 지원한다. 다음은 그 예시다.
- NestJs
- TypeORM
- Prisma
- RxJS
- AdonisJS
- FoalTs
등등...

# Asynchronous Work

## Asynchronous flow control
자바스크립튼 control flow는 callback handling의 모든것이다. 개발을 도와줄 전략을 알려준다.

자바스크립트는 메인 스레드에서 논블로킹 형식으로 동작하도록 개발되었다. 메인 스레드에서 블로킹이 발생한다면 freezing이나 유저들이 떠나가는 결과를 낳을것이다

이러한 방식은 함수형 프로그래밍많이 다룰 수 있는 특이한 제약을 만들어냈다. 사진에 보이는 콜백이 그렇다.

하지만 콜백은 복잡한 과정을 다루기에 어려울 수 있다. 이러한 과정은 함수에 수많은 콜백을 nesting하면서 callback hell을 만들 수 있다. 이것은 읽고, 디버깅하는등의 여러 업무를 어렵게 만든다.
```javascript
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // do something with output
        });
      });
    });
  });
});
```
실생활에서는 더 다양한 코드들이 있겠지만 실 생활에서는 위의 예제보다 더 보기 복잡한 코드들을 만드는 결과를 낳는다.

아래 목록은 이러한 함수가 잘 사용되는 방법이다. 더 복잡한 연산이 다양한 함수로 만들어진다.
 1. initiator style/ input
 2. middleware
 3. terminator

**initiator style / input**은 가장 첫번째 함수이다. 이 함수는 original input을 입력받아 연산을 수행한다. 이 연산은 실행가능한 함수이고, original input은 주로 다음과 같을것이다.
 1. global environment의 변수
 2. 인수와 또는 인수 없는 함수 실행
 3. file system으로 부터 얻은 값이나 네트워크 요청
 
미들웨어 함수는 또다른 함수를 반환할것이고, terminator 함수는 콜백을 발생할것이다. 아래는 네트워크나 파일시스템 요청을 묘사했다.
```javascript
function final(someInput, callback) {
  callback(`${someInput} and terminated by executing callback `);
}

function middleware(someInput, callback) {
  return final(`${someInput} touched by middleware `, callback);
}

function initiate() {
  const someInput = 'hello this is a function ';
  middleware(someInput, function (result) {
    console.log(result);
    // requires callback to `return` result
  });
}

initiate();
```

### State management
함수는 의존적일 수 있고 그렇지 않을 수 있다. State 의존성은 입력 또는 함수의 변수가 다른 외부 함수에 의존할 때 발생한다.

**이러한 경우에 주요한 2가지 전략을 사용할 수 있다.**
 1. 함수에 변수를 직접적으로 passing하는것.
 2. 캐쉬, 세션, 파일 데이터베이스, 네트워크 등 외부 자원으로부터 변수를 취득하는것.
 > 용어 정리
 세션: 한 유저와 웹 애플리케이션의 일종의 상호작용. 유저의 특정한 정보를 추적하기 위해 사용된다.
 캐쉬: 주기적으로 접근되는 데이터를 저장하는 일종의 저장 장소다. 성능을 향상시키기 위해 사용된다.
 
전역 변수를 사용하는 것을 언급하지 않았는데, 전역 변수의 사용은 많은 개발자들이 기피하는 패턴이다. 자바스크립트 Deep-dive 책에서도 전역 변수의 사용의 최소화 하라고 얘기한다.
 
### Control flow
만약 메모리에서 객체를 사용할 수 있다면, 반복이 가능하고, control flow에 영향을 주지 않을것이다.
```javascript
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} beers on the wall, you take one down and pass it around, ${
      i - 1
    } bottles of beer on the wall\n`;
    if (i === 1) {
      _song += "Hey let's get some more beer";
    }
  }

  return _song;
}

function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}

const song = getSong();
// this will work
singSong(song);
```
하지만 데이터가 메모리 외부에 존재한다면 동작하지 않는다.
```javascript
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} beers on the wall, you take one down and pass it around, ${
        i - 1
      } bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }

  return _song;
}

function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}

const song = getSong('beer');
// this will not work
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```
왜 이러한 일이 일어났는가?
CPU에게 버스가 아닌곳에 있는 명령을 수집하도록 했고, 그 데이터는 나중에 실행하기로 설정되어 있다. CPU사이클은 타이머 시간이 다 지나기 전에 완료된다. setTimeout된 명령어가 실행되기 전에 변수를 반환한다.
> 버스란?
한 컴퓨터 내에서 또는 한 네트워크 내에서 다른 컴포넌트 또는 기기와 데이터를 주고받기 위한 시스템을 의미한다.

같은 상황은 파일 시스템과 네트워크 요청을 다룰때도 발생한다. 메인스레드는 애매한 기간에 블록될 수 없다. 그러므로 우리는 정해진 순서로 코드를 실행하기 위해 콜백을 사용한다.

다음 3패턴을 사용하면 거의 모든 연산에 적용가능하다.

1.**In series**: 함수는 엄격한 순수로 실행될 것이다.

```javascript
// operations defined elsewhere and ready to execute
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];

function executeFunctionWithArgs(operation, callback) {
  // executes function
  const { args, func } = operation;
  func(args, callback);
}

function serialProcedure(operation) {
  if (!operation) process.exit(0); // finished
  executeFunctionWithArgs(operation, function (result) {
    // continue AFTER callback
    serialProcedure(operations.shift());
  });
}

serialProcedure(operations.shift());
```

2.**Full parallel**: 순서가 문제가 아닐경우 사용할 수 있다.
 ```javascript
// operations defined elsewhere and ready to execute
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];

function executeFunctionWithArgs(operation, callback) {
  // executes function
  const { args, func } = operation;
  func(args, callback);
}

function serialProcedure(operation) {
  if (!operation) process.exit(0); // finished
  executeFunctionWithArgs(operation, function (result) {
    // continue AFTER callback
    serialProcedure(operations.shift());
  });
}

serialProcedure(operations.shift());
```

 3.**Limited parallel**: 제한적으로 평행하다.
 ```javascript
let successCount = 0;

function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}

function dispatch(recipient, callback) {
  // `sendEmail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}

function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;

    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }

    serial(bigList.pop());
  });
}

sendOneMillionEmailsOnly();
```
각각이 자신만의 이점이 있고 사용성이 있다. 가장 중요한것은 콜백과 오퍼레이션을 모듈화 하는 것이다.

# JavaScript 비동기 프로그래밍과 콜백

## 프로그래밍 언어에서 비동기성
컴퓨터는 비동기적으로 디자인되었다.

비동기는 어떠한 일들이 독립적으로 일어날 수 있다는 것이다.

현 소비자들의 컴퓨터들은, 모든 프로그램들이 특정한 시간대에 실행되고 중단된 후 다른 프로그램을 실행하도록 한다. 이러한 과정들이 아주 빠르게 일어나서 우리가 보기엔 비동기적이라 착각하게 만든다.

프로그램들은 내부적으로 인터럽트라는 시그널을 사용하여 CPU의 attention을 얻는다.

내부적으로 깊게 다루진 않을거지만, 프로그램이 비동기적인 것은 일반적이고, 그것들은 attention이 필요하기 전까지는 중단된다는 것을 명심해라.

### JavaScript
JavaScript는 기본적으로 싱글 스레드의 동기적 방식이다. 이것은 코드가 새로운 스레드를 만들 수 없으며 평행하게 실행된다는것을 의미한다.

코드들은 순서대로 실해애된다. 다음과 같이
```javascript
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```
자바스크립트는 브라우저에서 태어났다. 주 업무는 유저의 반응에 응답하는 것이다. 하지만 이러한 행동이 동기적으로 어떻게 가능하겠는가?

답은 환경에 있다. 브라우저는 API들을 제공함으로써 이러한 기능들이 가능하도록 한다.

최근 Node.js는 이러한 개념을 파일 접근, 네트워크 call 등에 적용하여 논블로킹 I/O 환경을 소개했다.

### Callbacks
우리는 언제 유저가 버튼을 클릭할것인지 알 수 없다. 그래서 우리는 click event를 위해 이벤트 핸들러를 정의해야 한다. 이 이벤트 핸들러는 이벤트가 발생했을때 실행시킬 함수를 인수로 받는다.

```javascript
document.getElementById('button').addEventListener('click', () => {
  // item clicked
});
```
이것을 콜백이라 부른다.

콜백은 간단하게 다른 함수의 인수로 사용되는 함수를 말한다. 그리고 event가 발생하면 실행된다. 자바스크립트의 함수는 변수에 할당될 수 있으며 다른 함수로 전달될 수 있는 first-class 함수(고차함수라 부른다(highter-order-functions))이기에 이러한 일들이 가능하다.

페이지가 다 준비되고 나면 함수를 실행하기 위해 **window**객체의 **load** 이벤트 리스너 안에 모든 client 코드를 넣는것은 흔하다.
```javascript
window.addEventListener('load', () => {
  // window loaded
  // do what you want
});
```
콜백은 DOM 이벤트 뿐만 아니라 모든곳에 사용된다.

타이머에서 사용되는 예제이다.
```javascript
setTimeout(() => {
  // runs after 2 seconds
}, 2000);
```

XHR 요청은 콜백을 허용한다.
```javascript
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

### Handling errors in callbacks
Node.js에서 사용하는 가장 흔한 에러 관리 전략은 콜백 함수의 첫 매개변수로 에러 객체를 받는 것이다. 이를 **error-first callbacks**라고 한다.

만약 에러가 없다면 그 객체는 null값을 가진다. 에러가 있다면 에러를 설명하는 다른 정보를 값으로 가진다.
```javascript
const fs = require('fs');

fs.readFile('/file.json', (err, data) => {
  if (err) {
    // handle error
    console.log(err);
    return;
  }

  // no errors, process data
  console.log(data);
});
```
### The problem with call back
콜백은 간단한 경우 유용하다.
하지만 콜백은 nesting level을 증가시켜 많이 쓸경우 코드가 빠르게 난잡해진다.
```javascript
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // your code here
      });
    }, 2000);
  });
});
```
위 코드는 겨우 4-level의 코드다. 하지만 보기에 난잡하다. ES6의 시작과 함께 자바스크립트는 콜백을 사용하지 않는 비동기 features를 소개했다. Promise와 Async/Await 이다.

# Understanding process.nextTick()
Node.js event loop 이해하기 위해 노력한것처럼, process.nextTick()또한 알아야할 중요한 부분이다. event loop는 항상 순환하는데, 우리는 이것을 a tick이라고 부른다.
> gpt에 물어본 결과....
A tick은 모든 페이즈를 도는것을 의미하는것이 아닌, 특정한 페이즈의 큐에서 하나 또는 그 이상의 작업을 진행하는것을 의미한다.

우리가 process.nextTick()에 함수를 전하는것은 엔진에게 현 작업이 끝나면 다음 event loop tick이 시작하기전에 이 함수를 실행하라고 명령하는 것이다.
```javascript
process.nextTick(() => {
  // do something
});
```
이것은 우리가 자바스크립트에게 최대한 빨리 이 코드를 실행하되 비동기적으로 수행해라 라고 말하는것과 같다.

**setTimeout(() => {}, 0)**은 다음 tick가 끝날 때 실행되지만 **nextTick()** 다음 tick이 시작되기 전 현 진행중인 작업이 끝나는 후 실행된다.

다음 event loop interation이 시작되기 전에 코드가 실행되어 있기를 원할 때 **nextTick()**를 사용해라.
```javascript
console.log("Hello => number 1");

setImmediate(() => {
  console.log("Running before the timeout => number 3");
});

setTimeout(() => {
  console.log("The timeout running last => number 4");
}, 0);

process.nextTick(() => {
  console.log("Running at next tick => number 2");
});

```
output:
```
Hello => number 1
Running at next Tick => number2
Running before the timeout => number 3
The timeout running last => number4
```

# Discover JavaScript Timers
자바스크립트 코드를 쓸때 함수의 실행을 미루고 싶을 때가 있을 것이다. setTimeout과 setInterval을 어떻게 사용하는지 알아보자.

## setTimeout()
자바스크립트 코드를 쓸 때 함수의 실행을 지연시키고 싶을지도 모른다.

이것이 바로 setTimeout()이 하는 일이다. 나중에 실행할 함수를 콜백함수로서 넘겨주고 ms단위로 몇초 뒤에 실행할지를 말해주면 된다.
```javascript
setTimeout(() => {
  // runs after 2 seconds
}, 2000);

setTimeout(() => {
  // runs after 50 milliseconds
}, 50);
```
어떤 함수든 호출하기 원하는 함수를 콜백함수로 넣어주면 된다.
```javascript
const myFunction = (firstParam, secondParam) => {
  // do something
};

// runs after 2 seconds
setTimeout(myFunction, 2000, firstParam, secondParam);
```
**setTimeout()**함수는 타이머 id를 반환한다. 보통 잘 사용하지 않���만 이 id를 저장하고 타이머를 삭제하길 원한다면 다음과 같이 할 수 있다.
```javascript
const id = setTimeout(() => {
  // should run after 2 seconds
}, 2000);

// I changed my mind
clearTimeout(id);
```

### Zero delay
시간초를 0으로 둔다면, 현재 실행중인 함수가 끝나는 즉시 실행되도록 할 수 있다.
```javascript
setTimeout(() => {
  console.log('after ');
}, 0);

console.log(' before ');
```
output:
```
before
after
```
이 방법은 주로 복잡한 연산을 하는 함수가 CPU를 블로킹하는 것을 막기위해 사용한다.
**setImmediate()**함수가 정확이 이와 같은 동작을 한다.

## setInterval()
**setInterval** 함수는 **setTimeout**과 비슷한 함수다. 차이점은 이 함수는 지정한 시간이 지난 후 콜백 함수를 영원히 실행한다.
```javascript
setInterval(() => {
  // runs every 2 seconds
}, 2000);
```
마찬가지로 id를 이용해 타이머를 없앨 수 있다.
```javascript
const id = setInterval(() => {
  // runs every 2 seconds
}, 2000);

clearInterval(id);
```
setInterval 함수안에 clearInterval()함수를 넣는것은 꾀 흔한 일이다.
```javascript
const interval = setInterval(() => {
  if (App.somethingIWait === 'arrived') {
    clearInterval(interval);
  }
  // otherwise do things
}, 100);
```
### Recursive setTimeout
만약 콜백함수가 항상 똑 같은 실행시간을 가진다면 괜찮다.
하지만 
![](https://velog.velcdn.com/images/koreanthuglife/post/ce1650a3-6b5c-43b5-b162-64b15417db22/image.png)
이와 같이 다른 시간을 가지거나
![](https://velog.velcdn.com/images/koreanthuglife/post/ad805441-620e-465c-b323-f083589320f3/image.png)
이와 같이 다른 실행 시간에 영향을 미친다면 문제가 된다.

이를 피하기 위해서, 재귀적 setTimeout()를 구현할 수 있다.
```javascript
const myFunction = () => {
  // do something

  setTimeout(myFunction, 1000);
};

setTimeout(myFunction, 1000);
```
![](https://velog.velcdn.com/images/koreanthuglife/post/26b385d2-0d79-476d-aafd-deabe3b7ae65/image.png)
이처럼 실행될 것이다.

# Understanding setImmediate()
Node.js의 setImmediate 함수는 event loop와 특별한 방식으로 소통한다.

우리가 어떤 코드를 비동기적으로 실행하고 싶을때, 하지만 최대한 빠르게 실행시키고 싶을때 사용할수 있는 하나의 옵션이 바로 setImmediate() 함수이다.
```javascript
setImmediate(() => {
  // run something
});
```
setImmediate함수에 인수로 전달되는 콜백 함수는 event loop의 다음 반복에 실행된다.

setTimeout(() => {}, 0)과는 어떻게 다를까?
그리고 process.nextTick(), Promise.then()이랑은?

process.nextTick()에 전달된 콜백함수는 현재 루프의 반복에서 실행된다. 바로 현 작업이 끝난 후에. 이것은 항상 setTimout 과 setImmediate 전에 실행된다는 것이다.

process.nextTick의 콜백은 process.nextTick queue에 추가된다.
Promise.then()의 콜백은 promises microtask queue에 추가된다.
setTimeout, setImmediate 콜백은 macrotask queue에 추가된다.

이벤트루프는 **process.nextTick queue**부터 실행하고 이후에 **promises microtask queue**를 실행한 뒤에 **macrotask queue**를 실행한다.

![](https://velog.velcdn.com/images/koreanthuglife/post/10aa4d70-669a-4107-91c3-747d1dc0fe86/image.png)

위 예제는 start() 함수를 먼저 호출하고 process.nextTick queue에 있는 foo()를 호출 이후 promises microtask queue를 실행 bar를 출력하고 zoo()를 process.nextTick queue에 추가한다. 그 후 방금 추가된 zoo()를 호출하고 마지막으로 macrotask queue의 baz()를 호출한다.

# The Node.js Event emitter
자바스크립트와 함께 브라우저에 일한다면 유저와 얼마나 많이 event를 통해 상호작용하는지 잘 알것이다.

백엔드 사이드인 Node.js에서는 events module을 이용해 비슷한 시스템을 제공한다.

다음을 통해 초기화할 수 있다.
```javascript
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();
```
이 객체는 on 그리고 emit 메소드를 이용하여 드러난다.
- emit: 이벤트를 발생시키기 위해서 사용된다.
- on: 이벤트가 발생하면 실행할 콜백함수를 추가하기 위해 사용된다.

예제로 start 이벤트를 생성해보자.
```javascript
eventEmitter.on('start', () => {
	console.log('started');
});
```
이것을 실행하려면
```javascript
eventEmitter.emit('start');
```
이벤트 핸들러는 콜백 함수를 실행시킬 것이고 우리는 log를 볼 수 있을 것이다.

추가적인 매개변수를 구현해서 인수를 받을수도 있다.
```javascript
eventEmitter.on('start', number => {
	console.log(`started ${number}`);
});

eventEmitter.emit('start', 23);
```
더 다양한 인수
```javascript
eventEmitter.on('start', (start, end) => {
	console.log(`started from ${start} to ${end}`);
});

eventEmitter.emit('start', 1, 100);
```
EventEmitter 객체는 다른 여러 메소드를 통해 사용할 수 있다.
- once(): 단 한번만 listen하는 listener를 추가한다.
- removeListener() / off(): 이벤트 리스너를 이벤트로부터 제거한다.
- removeAllListeners(): 이벤트로부터 모든 리스너를 제거한다.

# Node.js file stats
Node.js를 이용해서 파일의 구체적인 정보를 어떻게 얻을 수 있을까?

모든 파일은 Node.js를 사용해서 조사할 수 있는 details를 가진다. fs모듈의 stat()메소드를 통해 확인할 수 있다.

파일 경로를 인수로 전달하면서 사용할 수 있다. Node.js가 파일을 details를 얻게되면 두가지 매개변수를 가지는 콜백함수를 호출한다.: error 메세지와 file stats이다.
```javascript
const fs = require('fs');

fs.stat('/Users/joe/test.txt', (err, stats) => {
	if (err) {
		console.error(err);
    }
});
```
Node.js는 또한 동기화 메소드도 제공한다.
```javascript
const fs = require('fs');

try {
	const stats = fs.statSync('/Users/joe/test.txt');
} catch (err) {
	console.error(err);
}
```
파일의 정보는 stats 변수에 저장된다. 정확히 어떤 정보를 stats을 통해 추출할 수 있나?
다음을 포함하여 많다.
 - 만약 파일이 폴더 또는 파일이라면 stats.isFile() 그리고 stats.isDirectory()를 사용하여 확인 가능하다.
 - 파일이 symbolic link라면 stats.isSymbolickLick()를 사용해라.
 - 파일사이즈는 stats.size
 > 심볼링 링크란?
 유닉스 베이스 OS에서 사용되는 파일 시스템이다.
 다른 파일 또는 폴더의 포인터나 참조로 사용되는 파일을 의미한다.
 
더 많은 메소드가 있지만 어떤 메소드를 사용할지는 그날 그날 프로그래밍에 달렸다.
```javascript
const fs = require('fs');

fs.stat('/Users/joe/test.txt', (err, stats) => {
	if (err) {
		console.error(err);
      	return;
    }
  
  	stats.isFile();
  	stats.isDirectory();
  	stats.isSymbolickLink();
  	stats.size;
});
```
또한 promise로 사용할 수 있다.
```javascript
const fs = require('fs/promises');

async function example() {
	try {
		const stats = await fs.stat('/Users/joe/test.txt');
        stats.isFile();
        stats.isDirectory();
        stats.isSymbolicLink();
        stats.size;
    } catch (err) {
		console.error(err);
    }
}
example();
```

# Node.js File Paths
Node.js에서 파일경로를 다루는 방법을 알아본다.
모든 파일들은 경로를가진다.

우리는 애플리케이션에서 경로를 사용할 때 주의를 기울여야 한다.

**const path = require('path');** 를 통해 모듈을 포함시킬 수 있다.

## Getting information out of a path
주어진 경로에서 다음 methods를 사용하여 정보를 뽑아낼 수 있다.
- **dirname**: 파일이 포함된 폴더 이름을 얻는다.
- **basename**: 파일 이름을 얻는다.
- **extname**: 파일의 확장자를 얻는다.
### Example
```javascript
const notes = '/users/joe/notes/txt';

path.dirname(notes); // /users/joe
path.basename(notes); // notes.txt
path.extname(notes); // .txt
```

basename을 통해 확장자 없는 파일 이름을 얻을 수 있다.
```javascript
path.basename(notes, path.extname(notes)); // notes
```

### Working with paths
두개 또는 그이상의 경로를 **path.join()**을 통해 합칠 수 있다.
```javascript
const name = 'joe';
path.join('/', 'users', name, 'notes.txt'); // '/users/joe/notes.txt'
```
**path.resolve()**를 통해 절대 경로를 얻을 수 있다.
```javascript
path.resolve('joe.txt'); // '/Users/joe/joe.txt'
```
이 경우에 Node.js는 간단하게 현재 작업하는 폴더 경로를 합친다. 만약 두번째 인수로 폴더를 넣어주면 두번째 인수에 기반하여 절대경로를 반환한다.
```javascript
path.resolve('tmp', 'joe.txt'); // '/Users/joe/tmp/joe.txt'
```
만약 첫번째 매개변수가 /로 시작한다면 그것은 절대 경로를 의미한다.
```javascript
path.resolve('/etc', 'joe.txt'); // '/etc/joe.txt'
```
**path.normalize()**는 실질적인 경로를 계산해주는 유용한 함수이다.
```javascript
path.normalize('/users/joe/..//test.txt'); // '/users/test.txt'
```
하지만 resolve() 나 normalize 둘 다 실제로 경로가 존재하는지는 확인하지 않는다. 그저 실질적인 경로를 계산해 반환할 뿐이다.

# Working with file descriptors in Node.js
> Descriptor란?
오브젝트의 프로퍼티의 특징을 말해주는 객체이다. 공부하는 걸 추천한다. value, writable, enumerable, configurable의 프로퍼티를 가지며 이 값에 따라 어떤 객체의 속성이 바뀐다.

파일시스템을 사용하기전에 파일 디스크립터에 대해서 알아야 한다.

파일 디스크립터는 어떤 파일의 참조이다, open()이라는 메소드로 파일을 열면 fd라는 숫자값을 반환한다. 이 숫자는 os에서 파일을 열기위해 사용하는 유니크한 숫자이다.
```javascript
const fs = require('fs');

fs.open('/Users/joe/test.txt', 'r', (err, fd) => {
	// fd is out file descriptor
});
```
두번째 배개변수로 사용한 **r** flag는 파일을 읽기 위해서 하용한다는 의미이다.
다른 플래그는 다음과 같다:
- **r+**: 읽기와 쓰기위해 파일을 연다.
- **w+**: 읽기와 쓰기 위해 파일을 열고, 파일의 시작에 스트림을 위치한다. 파일이 없으면 파일을 만든다.
- **a**: 쓰기위해 파일을 연다. 파일의 끝에 스트림을 위치시킨다.
- **a+**: 읽기와 쓰기 위해 파일을 열고, 파일 끝에 스트림을 위치시킨다.
> 스트림이란?
커서라 생각하면 편할듯 하다.

**fs.onpenSync** 메소드를 이용해서 파일을 열수도 있다. 콜백함수를 사용하는 대신 디스크립터를 반환한다.

**fsPromises.open**을 사용할수도 있다. Node.js v14 이후의 버전에서만 사용가능하며 **require('fs).promises**를 사용하면 된다.
```javascript
const fs = require('fs/promises');
// Or. const fs = require('fs').promises before v14.
async function example() {
	let filehandle;
  	try {
		filehandle = await fs.open('/Users/joe/test.txt', 'r');
      	console.log(filehandle.fd);
      	console.log(await filehandle.readFile({ encoding: 'utf8' }));
    } finally {
		if (filehandle) await filehandle.close();
    }
}
example();
```
util.promisify 는 fs메소드를 promise기반 메소드로 바꿔준다.
```javascript
const fs = require('fs');
const util = require('util');

async function example() {
	const open = util.promisify(fs.open);
  	const fd = await open('/Users/joe/test.txt', 'r');
}
example();
```

# Reading files with Node.js
Node.js에서 파일을 읽는 가장 간단한 방법은 **fs.readFile()**을 사용하는 것이다. 파일 경로를 인수로 넘겨주고 콜백함수를 정의해주면 된다.
```javascript
const fs = require('fs');

fs.readFile('/Users/joe/test.txt', 'utf8', (err, data) => {
  if (err) {
	console.error(err);
    return;
  }
  console.log(data);
});
```
동기적으로 사용하려면 **fs.readFileSync()**를 사용하면 된다.
```javascript
const fs = require('fs');

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```
또한 프로마이스 베이스의 **fs.Promises.readFile()**을 사용할수도 있다.
```javascript
const fs = require('fs/promises');

async funtion example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
exapmle();
```
모든 3개의 메소드는 데이터를 반환하기전에 메모리에서 모든 내용을 먼저 읽는다.

이 말은 큰 용량의 파일은 메모리에 영향을 줄 수 있다는 말이다.

# Writing files with Node.js
## writing a file
Node.js에서 파일을 쓰는 가장 쉬운 방법은 **fs.writeFile()**이다.
```javascript
const fs = require('fs');

const content = 'Some content!';

fs.writeFile('/Users/joe/test.txt', content, arr => {
	if (err) {
		console.error(err);
    }
});
```
fsPromises.writeFile()을 통해 프로마이스 베이스로 사용할수도 있다.
```javascript
const fs = require('fs/promises');

async function example() {
	try {
		const content = 'Some content!';
      	await fs.writeFile('/Users/joe/test.txt', content);
    } catch (err) {
		console.log(err);
    }
}
example();
```
Default로 이 API는 파일의 내용이 존재한다면 내용을 교체할것이다.
기본 설정을 플래그를 통해 변경할 수 있다.
```javascript
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {});
```
플래그의 종류는 다음과 같다.
- r+: 파일 읽고 쓰기
- w+: 파일 시작지점에서 읽고 쓰고 스트림을 파일 시작점에 위치시킴
- a: 파일 끝에서 쓰고 스트림을 파일 끝에 위치시킴
- a+: 파일 끝에서 읽고 쓰고 스트림을 파일 끝에 위치시킴

## Appending content to file
파일을 덮어쓰지않고 추가하고 싶다면 다음 메소드를 사용하면 된다.
### Examples
```javascript
const fs = require('fs');
const content = 'Some content!';

fs.appendFile('file.log', content, err => {
	if (err) {
		console.error(err);
    }
});
```
Promises 예제
```javascript
const fs = require('fs/promises');

async function example() {
	try {
		const content = 'Some content!';
      	await fs.appendFile('/Users/joe/test.txt', content);
    } catch (err) {
		console.log(err);
    }
}
example();
```

# Working with folders in Node.js
## Check if a folder exists
**fs.access()** 또는 **fsPromises.access()**를 통해ㅔ 폴더가 존재하고 Node.js가 접근할 수 있는지 확인할 수 있다.

## Create a new foler
**fs.mkdir()**, **fs.mkdirSync()**, **fsPromises.mkdir()**을 통해 새 폴더를 만들 수 있다.
```javascript
const fs = require('fs');

const folderaName = '/Users/joe/test';

try {
	if (!fs.existsSync(folderName)) {
		fs.makdirSync(folderName);
    }
} catch (err) {
	console.error(err);
}
```

## Read the content of a directory
**fs.readdir()**, **fs.readdirSync()**, **fsPromises.readdir()** 를 통해 폴더의 내용을 읽을 수 있다. 파일과 서브폴더 모두의 내용을 읽고 그것들의 경로를 반환한다.
```javascript
const fs = require('fs');

const folderPath = '/Users/joe';

fs.readdirSync(folderPath);
```
전체 경로도 얻을 수 있다.
```javascript
fs.readdirSync(folderPath).map(fileName => {
	return path.join(folderPath, fileName);
});
```
또한 filter를 통해 원하는 파일만 반환받을 수 있다.
```javascript
const isFile = fileName => {
	return fs.lstatSync(fileName).isFile();
};

fs.readdirSync(folderPath).map(fileName => {
	return path.join(folderPath, fileName);
}).filter(isFile);
```

## Rename a folder
**fs.rename()**, **fs.renameSync()**, **fs.Promeses.rename()**을 사용해서 폴더 이름을 변경할 수 있다.
```javascript
const fs = require('fs');

fs.rename('/Users/joe', '/Users/roger', err => {
	if (err) {
		console.error(err);
    }
});
```
```javascript
const fs = require('fs/promises');

async function example() {
	try {
		await fs.rename('/Users/joe', '/Users/roger');
    } catch (err) {
		console.log(err);
    }
}
example();
```

## Remove a folder
```javascript
const fs = require('fs');

fs.rmdir(dir, err => {
	if (err) {
		throw err;
    }
  	console.log(`${dir} is deleted!`);
});
```
```javascript
const fs = require('fs/promises');

async function example() {
	try {
		await fs.rmdir(dir);
    } catch (err) {
      console.error(err);
    }
}
```

폴더의 컨텐츠를 지우기 위해서는 **fs.rm()**의 옵션을 { recursive: true } 로 해주면 된다.
{ recursive: true, force: true }는 단 하나의 예외없이 모든 폴더를 지운다.
```javascript
const fs = require('fs/promises');

async function example() {
	try {
		await fs.rm(dir, { recursive: true, force: true });
    } catch (err) {
		console.error(err);
    }
}
```

# Run Node.js scripts from the command line
**node** 커맨드를 통해 전역으로 Node.js 프로그램을 실행하는 것이 가장 흔한 방식이다.

만약 **app.js**라는 애플리케이션을 실행하고 싶다면
```bash
node app.js
```

## Pass string as argument to node instead of file path
문자열을 통해 Node.js의 명령어를 실행할 수 있다.
```bash
node -e "console.log(123)"
```

## Restart the application automatically
애플리케이션에 변화가 일어날때마다 자동으로 재시작 하고 싶다면
```bash
npm i -g nodemon
```
또는 development dependency에만 설치할수도 있다.
```bash
npm i --save-dev nodemon
```

# How to read environment variables from Node.js
Node.js의 **process** 코어 모듈은 프로세스가 시작될 때 설정된 환경변수를 제공한다.

다음은 app.js를 USER_ID 와 USER_KET를 세팅해서 실행하는 방법이다.
```bash
USER_ID=239482 USER_KEY=foobar node app.js
```
테스팅에는 적합하지만 배포할때는 설정을 변경해야 한다.
> Node:
process는 require 커맨드를 필요로 하지 않는다.

다음은 USER_ID와 USER_KEY 환경 변수에 접근하는 방식이다.
```javascript
process.env.USER_ID;
process.env.USER_KEY;
```
이런 방식을 통해 커스텀 환경변수에도 접근할 수 있다.

만약 노드 프로젝트에 다양한 환경변수가 있다면 **.env**파일을 루트 폴더에 만들어 사용할 수 있다.
```bash
# .env file
USER_ID="239482"
USER_KEY="foobar"
NODE_ENV="development"
```
자바스크립트 파일에서는
```javascript
require('dotenv').config();

process.env.USER_ID;
process.env.USER_KEY;
process.env.NODE_ENV;
```
# How to use the Node.js REPL
REPL은 Read-Evaluate-Print-Loop 의 줄임말로 Node.js의 features를 탐색하는 좋은 방법이다.

**node** 커맨드는 Node.js 스크립트를 실행시키는 하나의 커맨드다.
```bash
node script.js
```
만약 우리가 **node**커맨드를 아무런 스크립트 없이 실행한다면 REPL세션의 시작이다.
```bash
node
```
> Note:
REPL은 프로그래밍 언어 환경이다. 하나의 표현식만 허용한다. 그리고 결과를 console로 반환한다.

다음과 같이 사용할 수 있다.
```bash
>console.log('test')
test
undefined
> 5 === '5'
false
> 
```

# Output to the command line using Node.js

Node.js console을 통해 형식을 지정해 로깅할 수 있다.
```javascript
console.log('My %s has %d ears', 'cat', 2);
```
- %s: 문자열
- %d: 숫자
- %i: 정수
- %o: 객체

## Clear the console
**Console.clear()**

## Counting elements
**console.count()**

## Color the output
**npm install calk@4**로 chalk를 다운받아 로그에 색을 입힐 수 있다.
```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

## Create a progress bar
**npm install progress**를 통해 progress bar를 만들 수 있다.
```javascript
const ProgressBar = require('progress');

const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
	bar.tick();
  if (bar.complete) {
	clearInterval(timer);
  }
}, 100);
```
Node.js CLI 프로그램을 인터랙티브하게 만드는 방법은 뭘까?

Node.js 버전 7부터는 readline 모듈을 제공하고 있다. 읽을 수 있는 스트림으로 부터 입력을 받기 위해서이다.
```javascript
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('what is your name?', name => {
  console.log(`Hi ${name}!`);
  readline.close();
});
```
위 코드는 유저의 이름을 입력받고 유저가 텍스트를 입력한 후 엔터를 누르면 그 값을 통해 환영 인사를 보낸다.

**quetion()** 메소드는 첫번째 매개변수를 보여주고 입력을 기다린다. 임력이 들어오면 콜백함수를 실행한다.

**npnmm install inquirer**을 통해 위 코드를 아래처럼 바꿀 수 있다.
```javascript
const inquirer = require('inquirer');

const questions = [
  {
	type: 'input',
    name: 'name',
    message: "What's your name?",
  },
];

inquirer.prompt(questions).then(answers => {
  console.log(`Hi ${answers.name}!`);
});
```

Node.js에서 소개하는 기본적으로 알아야한 개념은 모두 익혔다고 볼 수 있다. 특히 비동기 처리 부분에 대한 부분들은 제대로 익혀두는게 좋다고 한다. 이제는 프레임 워크인 express를 한번 자세히 알아보도록 하자.
