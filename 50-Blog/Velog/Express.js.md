---
type: blog-post
source: velog
author: "koreanthuglife"
title: "Express.js 공식 문서 번역(Guide)"
slug: "Express.js"
velogId: "1e731e0e-9228-4cce-85b6-c6789488e405"
velogUrl: "https://velog.io/@koreanthuglife/Express.js"
published: "2023-04-05T12:35:38.977Z"
updated: "2026-02-10T21:00:21.829Z"
tags:
  - "express.js"
description: "Express 공식 문서를 번역하며 이해해보자!Node.js를 이미 설치했다고 가정하고 시작한다. 애플리케이션을 만들 폴더를 만들자.npm init를 이용해서 package.json을 생성하자많은 내용을 물어볼텐데 지금은 다음을 제외하고는 그냥 넘기면 된다.app.js"
importedAt: "2026-02-18T07:28:49.893Z"
---

# Express.js 공식 문서 번역!
Express 공식 문서를 번역하며 이해해보자!
https://expressjs.com/en/guide/routing.html

## Installing
Node.js를 이미 설치했다고 가정하고 시작한다. 애플리케이션을 만들 폴더를 만들자.
```bash
mkdir myapp
cd myapp
```
npm init를 이용해서 package.json을 생성하자
```bash
npm init
```
많은 내용을 물어볼텐데 지금은 다음을 제외하고는 그냥 넘기면 된다.
```
entry point: (index.js)
```
app.js를 입력해야 한다.
이제 Express를 설치해보자. 그리고 dependencies에 추가해보자.
```bash
npm install express
```
임시로 설치하고 dependencies에 추가하고 싶지 않다면
```bash
npm install express --no-save
```
>note
디폴트로 npm 5.0이상에서는 모듈을 설치하게 되면 dependencies에 자동으로 추가한다. 그러므로 명확하게 플래그를 통해 알려야 한다. 그렇지 않다면 dependencies에 있는 모듈을 자동으로 다운로드 할거다.


## Hello world Example
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```
```bash
node app.js
```
이 앱은 서버를 시작하고 3000번 포트에 연결될거다. "Hello World!"가 root URL 또는 route 요청에 응답될거다. 다른 경로 요청에는 **404 Not Found**가 응답될거다.

## Express application generator
빠른 express 앱 뼈대를 구축하기위해 express-generator를 사용해라.
```bash
npx express-generator
```
좀 더 구버전의 node.js에서는 다음과 같이 할 수 있다.
```bash
npm install -g express-generator
express
```
-h 옵션을 통해 커맨드를 볼 수 있다.
```
express -h
Usage: express [options] [dir]

  Options:

    -h, --help          output usage information
        --version       output the version number
    -e, --ejs           add ejs engine support
        --hbs           add handlebars engine support
        --pug           add pug engine support
    -H, --hogan         add hogan.js engine support
        --no-view       generate without view engine
    -v, --view <engine> add view <engine> support (ejs|hbs|hjs|jade|pug|twig|vash) (defaults to jade)
    -c, --css <engine>  add stylesheet <engine> support (less|stylus|compass|sass) (defaults to plain css)
        --git           add .gitignore
    -f, --force         force on non-empty directory
```
예를들어 다음은 view엔진이 Pug인 myapp이 만들어 질것이다.
```bash
express --view=pug myapp
```
그리고 dependencies를 설치하면 된다.
```bash
cd myapp
npm install
```
맥이나 리눅스에서는 앱을 실행하기 위해 다음 커맨드를 입력하면 된다.
```bash
DEBUG=myapp:* npm start
```
>
제네래이터를 통해 만든 구조는 express를 만드는 구조 중 하나의 방법일 뿐이다. 입맛에 맞게 수정하고 추가하길 바란다.

## Basic routing
**Routing**는 URI나 특정한 HTTP 요청에 애플리케이션이 어떻게 응답할지 결정하기위해 사용된다.

각각의 라우터는 하나 또는 그 이상의 handler 함수를 가질 수 있다.
라우터 정의는 다음 구조를 따른다:
```
app.METHOD(PATH, HANDLER)
```
Where:
- app는 express의 인스턴스다.
- METHOD는 HTTP 요청 method의 소문자 형태이다.
- PATH는 서버의 경로다.
- HANDLER는 요청에 일치하는 라우터가 실행할 함수다.
>이후 나오는 예제들은 app이 express의 인스턴스이고 서버가 실행중이라 가정하고 진행된다.

아래 예제는 간단한 라우트를 정의하고 있다.
홈페이지에 Hello World!를 응답한다.
```javascript
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```
root route(/)에 POST요청이 들어왔을때의 동작
```javascript
app.post('/', (req, res) => {
  res.send('Got a POST request');
});
```
/user route에 PUT요청이 들어왔을때의 동작
```javascript
app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});
```
/user route에 DELETE요청이 들어왔을때
```javascript
app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});
```

## Serving static files in Express
이미지, CSS, JavaScript와 같은 정적 파일을 제공하기 위해서 express.static과 같은 미들웨어 기능을 사용해라.

함수 구조는 다음과 같다:
```
express.static(root, [options])
```
root인수는 정적파일을 제공하야하는 폴더의 root 폴더를 의미한다.

public 폴더안에 있는 이미지, CSS, JavaScript파일을 제공하기 위해서는 다음과 같은 코드를 작성하면 된다.
```javascript
app.use(express.static('public'));
```
이제 public 폴더에 있는 정적 파일들을 불러올 수 있다.

여러 디렉토리에 있는 정적 파일들을 제공하기 위해서는 미들웨어 함수를 여러번 쓰면 된다.
```javascript
app.use(express.static('public'));
app.use(express.static('files'));
```
express.static함수에 제공되는 파일들에 가상의 경로를 추가하고 싶다면 다음과 같이 하면 된다.
```javascript
app.use('/static', express.static('public'))
```
이제 /static이라는 가상의 경로가 추가된 정적 파일들을 얻을 수 있다.

하지만 express.static함수에 제공한 경로는 상대경로다. 만약 다른 폴더로부터 앱을 실행한다면 절대경로를 사용하는것이 안전하다.
```javascript
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public')));
```

## Express examples
이 페이지는 다음을 사용하는 예제들을 담고 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/83531ebc-1ba4-43e5-9e02-19c7109a6b5c/image.png)
https://expressjs.com/en/starter/examples.html
여기서 확인 가능하다. github페이지이고 간단한 예제들이 있다.

# Express 가이드
## Routing
라우팅은 클라이언트의 요청에 endpoints에서 어떻게 응답하는지를 말한다.

라우팅이 Express app object를 사용하여 HTTP 요청에 응답하는 것이라는걸 알것이다. app.all() 메소드를 통해 모든 요청에 응답하게 할수도 있고 app.use()를 통해 콜백함수로 특정한 미들웨어를 다룰수도 있다.

이 라우팅 methods는 HTTP method나 특정한 라우트 요청이 들어왔을 때 특정한 callback함수를 실행한다. 즉, 어떤 라우터들은 어떤 특정한 요청을 기다리고 있다가 요청이 들어올경우 콜백함수를 실행한다.

아래 코드는 아주 기본적인 route 예제이다.
```javascript
const express = require('express');
const app = express();

// repond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world!');
});
```

## Route methods
route method는 HTTP methods로부터 파생되었다. 그리고 express 클래스의 인스턴스로서 생성된다.
```javascript
// GET method route
app.get('/', (req, res) => {
  res.send('GET request to the homepage')
});

// POST method route
app.post('/', (req,res) => {
  res.send('POST request to the homepage');
});
```
Express 는 HTTP 요청 methods에 상응하는 methods를 제공한다.

또다른 하나의 특별한 method가 있다. app.all()이다. 이름에서 알 수 있듯이 모든 요청에 응답한다. 예를들어 "/secret"이라는 route가 있다면 "/secret"에 일치하는 모든 GET, POST, PUT, DELETE 그외의 모든 방식의 요청에 응답한다.
```javascript
app.all('/scret', (req, res, next) => {
  console.log('Accessing the secret section ...');
  next() // pass control to the next handler
});
```

## Route paths
method와 조합되어 들어오는 Route paths를 통해 어떤 요청에 어떤 응답을 하게 될지가 정해진다. Route Path는 문자열, 문자 패턴, 정규표현식 등이 될 수 있다.

여기 문자열에 기만한 route paths의 예제가 있다.
```javascript
app.get('/', (req, res) => {
  res.send('root');
});

app.get('/about', (req, res) => {
  res.send('about');
});

app.get('/random.text', (req, res) => {
  res.send('random.txt');
});

```

다음은 문자 패턴에 따른 route paths다.
```javascript
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd');
});

app.get('/ab+cd', (req, res) => {
  res.send('ab+cd');
});
```
다음은 정규 표현식이다.
```javascript
app.get(/a/, (req, res) => {
  res.send('/a/');
});

app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/');
});
```

## Route parameters
Route parameters는 위치에 있는 자리의 특정한 값을 취득하기위해 사용한다. **req.params**에 저장된다. 예제를 보면 이해하기 쉽다.
```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```
route parameters를 라우트에 정의하기 위해서는 아래처럼 하면 된다.
```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params);
});
```
- 또는 . 은 문자로서 변역되기 때문에 유용하게 다음과같이 사용할 수 있다.
```
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }
```
```
Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```
좀 더 특정된 값을 얻기 위해서 정규표현식을 () 안에 감싸 추가할 수 있다.
```
Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}
```
## Route handlers
요청을 처리하기 위해 미들웨어처럼 동작하는 여러개의 콜백함수를 제공할수도 있다.
유일한 차이점은 이 콜백 함수들은 next('route')를 통해 발생된다.
미리 어떠한 상태를 설정한 뒤 다음 라우트에서 그것을 컨트롤 하는 방식으로 사용할 수 있다. 함수 또는 배열 또는 둘 다 사용 가능하다.
```javascript
app.get('/example/a', (req, res) => {
  res.send('Hello form A!');
});
```
하나 그리고 그 이상의 콜백함수를 사용할 수 있다.
```javascript
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...');
  next();
}, (req, res) => {
  res.send('Hello from B!');
});
```
배열 통해서 한 라우트를 관리할 수도 있다.
```javascript
const cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

const cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

const cb2 = function (req, res) {
  res.send('Hello from C!');
}

app.get('/example/c', [cb0, cb1, cb2]);
```
각각의 독립된 함수들을 조합하는 다음과 같은 방식도 가능하다.
```javascript
const cb0 = function (req, res, next) {
  console.log('CB0');
  next();
}

const cb1 = function (req, res, next) {
  console.log('CB1');
  next();
}

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function ...');
  next();
}, (req, res) => {
  res.send('Hello from D!');
});
```
## Response methods
다음의 res 객체의 methods를 통해 클라이언트에게 response를 보내고 request-response 사이클을 중단시킬 수 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/e8d92c71-39b1-47d9-bd2c-60d8a7c657e1/image.png)

## app.route()
한 라우트에 여러 체인의 라우트 핸들러를 만들 수 있다. 경로는 하나의 위치로 특정화되고, 모듈형식의 routes를 만드는것은 타이핑의 낭비를 줄여준다.
```javascript
app.route('/book').get((req, res) => {
  res.send('Get a random book');
}).post((req, res) => {
  res.send('Add a book');
}).put((req, res) => {
  res.send('Update the book');
});
```

## express.Router
모듈의, moutable한 route handlers를 만들기 위해 **express.Router** 클래스를 사용해라. **Router**인스턴스는 완전한 미들웨어이며 라우팅 시스템이다. 이러한 이유로 종종 "mini-app"이라고 불리기도 한다.

app directory에 birds.js라는 router파일을 만들어 다음의 내용을 만들 수 있다.
```javascript
const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
});

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

module.exports = router;
```
이후 router 모듈을 app에서 다음과 같이 불러올 수 있다.
```javascript
const birds = require('./birds');
//....
app.use('/birds', birds);
```
이제 앱은 /birds 그리고 /birds/about라를 요청에 대한 응답을 할 수 있다.

## Writing middleware for use in Express apps
### Overview
**Middleware** 함수는 어플리케이션 request-response 사이클의 req, res, next에 접근가능한 함수다. **next**함수는 언제 어떤 미들웨어를 현 미들웨어에 이어서 발생할지 결정하는 함수다.

미들웨어 함수는 다음과 같은 일을 수행할 수 있다:
- 어떤 코드든 실행할 수 있다.
- request, response objects를 수정할 수 있다.
- request-response cycle을 끝낼 수 있다.
- 스택에 다음 미들웨어를 호출할 수 있다.

만약 현 미들웨어 함수가 request-response cycle을 끝내지 않는다면 반드시 **next()**를 호출해야한다. 다음 미들웨어 함수로의 pass를 control하기 위해서.
다음 사진은 미들웨어 함수의 호출 요소에 대해서 설명한다.
![](https://velog.velcdn.com/images/koreanthuglife/post/383ddad5-3c0c-4bcd-94d3-17fceaf1b865/image.png)
Express 버전 5이상부터 미들웨어 함수는 거절되었을 때 next(value) 호출하고나 error를 던지는 Promise를 반환한다. next는 거절되었을 때나 Error를 던졌을 때 모두 호출될것이다.
### Example
아래에 간단한 예제가 있다. 이 예제의 남은 코드는 세가지 미들웨어를 정의하는 것이다. 하나는 log 메세지를 출력하는 **myLogger**, 하나는 HTTP 요처의 timestamp를 보여주는 **requestTime** 그리고 마지막 하나는 들어오는 cookies의 유효성을 확인하는 **validateCookies**이다.
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```

### Middleware function myLogger
요청이 들어오면 간단하게 LOGGED 를 출력한다. myLogger라는 변수에 미들웨어 함수를 할당했다.
```javascript
const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
}
```
>
위의 next() 호출은 앱에서의 다음 미들웨어를 호출을 발생시킨다. next() 함수는 Node.js 또는 Express API의 일부분이 아니다. 하지만 미들웨어 함수의 세번째 ��수로 통과된다. 어떤 이름이 될 수 있지만 관습적으로 next라 이름 붙인다. 혼란을 피하기 위해 이 관습을 따르는것을 추천한다.

미들웨어 함수를 불러오기 위해서는 **app.use()**를 사용하면 된다. 예를들어 다음 코드는 root경로 (/)에 route하기 전에 **myLogger** 미들웨어 함수를 불러온다.
```javascript
const express = require('express');
const app = express();

const myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
}

app.use(myLogger);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```
app이 요청을 받을때 마다 "LOGGED"를 터미널에 프린트한다.
미들웨어 loading의 순서는 중요하다: 첫번째로 loaded되는 미들웨어 함수는 첫번째로 실행된다.
만약 **myLogger**가 root path에 route되기 전에 loaded되었다면, 요청은 절때 'LOGGED'를 프린트하지 않는다. root path의 route handler가 request-response 사이클을 종료시키기 때문이다.

미들웨워 함수 **myLogger**는 간단하게 메시지를 출력한다. 그리고 요청에 대한 다음 미들웨어 함수를 next() 함수를  통해 스택에 쌓음으로써 호출한다.

### Middleware function requestTime
다음으로 requestTime이라는 미들웨어 함수를 만들고 requestTime이라는 프로퍼티를 request 객체에 추가할 것이다.
```javascript
const requestTime = function (req, res, next) {
  req.requestTiime = Date.now();
  next();
}
```
이제 app이 **requestTime**을 사용하게 할것이다. 또한 root path route의 콜백 함수가 req에 추가된 프로퍼티를 사용할 것이다.
```javascript
const express = require('express');
const app = express();

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  next();
}

app.use(requestTime);

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${req.requestTime}</small>`
  res.send(responseText);
});

app.listen(3000);
```
app의 root에 대한 요청을 하게되면, 앱은 timestamp를 브라우저에 display할것이다.
### Middleware function validateCookies
마지막으로 들어오는 cookies가 유요한지 확인하여 유요하지 않다면 400 응답을 보내는 미들웨어 함수를 만들것이다.
```javascript
async function cookieValidator (cookies) {
  try {
    await externallValidateCookie(cookies.testCookie);
  } catch {
    throw new Error('Invalid cookies');
  }
}
```
여기 우리는 **cookie-parser**를 통해 들어오는 req객체의 cookies를 구문분석해서 **cookieValidator** 함수에 인수로 전달한다. **validateCookies** 미들웨어는 자동적으로 에러를 처리하는 Promise를 반환할것이다.
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieValidator = require('./cookieValidator');

const app = express();

async function validateCookies (req, res, next) {
  await cookieValidator(req.cookies);
  next();
}

app.use(cookieParser());

app.use(validateCookies);

// error handler
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

app.listen(3000);
```
> next()는 await cookieValidator(req.cookies)이후에 호출된다. 이것은 만약 **cookieValidator**가 resolve된다면, 스택의 다음 미들웨어가 호출된다. 만약 니가 next()함수에 어떤것이든 전달한다면 Express는 현재 요청이 에러가 있다고 판단하고, 남은 non-error-handling routing 과 미들웨어 함수를 스킵한다.

request object 와 response object에 접근 덕분에 스택의 미들웨어 함수와 전체적인 Node.js API의 가능성은 무한하다.

### Configurable middleware
만약 미들웨어가 설정가능할 필요가 있다면 option object 또는 다른 매개변수를 받는 함수를 export해라. 그리고 미들웨어 implementation이 그 매개변수에 따라 반환되게 해라.
```javascript
//File: my-middlware.js
module.exports = function (options) {
  return function (req, res, next) {
	// Implement the middleware function based on the options object
    next();
  }
}
```
미들웨어는 아래와 같이 사용될 수 있다.
```javascript
const mw = require('./my-middleware.js');

app.use(mw({ option: '1', option: '2' }));
```

## Using middleware
Express는 routing 과 미들웨어 웹 프레임워크다. 스스로 최소한의 기능성을 가진다: Express는 필수적으로 미들웨어 함수의 연속으로 구성된다.

미들웨어 함수는 req, res와 다음 미들웨어 함수에 대한 접근 권한을 가진다. 

미들웨어 함수는 다음과 같은 일을 할 수 있다.
- 코드 실행
- req, res 객체의 변경
- request-response 사이클의 종료
- stack에 다음 미들웨어 함수 호출

만약 미들웨어가 res-req 사이클을 종료하지 않는다면 반드시 next()를 호출해야 한다.
Express applicatioin은 다음과 같은 타입의 미들웨어를 사용할 수 있다:
- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware
- Third-party middleware

aplication-level 과 router-level 미들웨어를 optional mount path와 함께 불러올 수 있다. 또한 미들웨어 함수의 연속을 불러올수도 있다.
### Application-level middleware
application-level 미들웨어를 **app.use()** 와 **app.METHOD()**를 통해 바인딩할 수 있다. METHOD는 HTTP mothod의 소문자 형이다.

아래 예제는 no mount path 미들웨어 함수의 예제이다. app이 어떤 요청을 받을 때 항상 실행된다.
```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
})
```
아래 예제는 /user/:id에 마운트된 미들웨어 함수 예제이다. /user/:id path를 가진 모든 요청에 실행된다.
```javascript
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});
```
아래 예제는 route와 handler 함수를 보여준다. 함수는 /user/:id path에 대한 GET 요청을 처리한다.
```javascript
app.get('/user/:id', (req, res, next) => {
  res.send('USER');
});
```
다음 예제는 mount point에서 미들웨어 함수의 연속을 불러오는 예제이다.
```javascript
app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
}, (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});
```
Route handlers는 하나의 path를 위한 여러 route를 정의할 수 있게 해준다. 아래의 예제는 /user/:id path의 GET 요청을 위한 두개의 route를 정의한다. 두번째 route는 어떠한 문제도 일으키지 않지만 첫번째 route가 사이클을 끝내기 때문에 절대 호출되지 않는다.
```javascript
app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id);
  next();
}, (req, res, next) => {
  res.send('User Info');
});

app.get('/user/:id', (req, res, next) => {
  res.send(req.params.id);
});
```
남은 router 스택의 남은 미들웨어 함수를 스킵하기 위해서 next('route')를 호출해라.
>next('route')는 app.METHOD() 또는 router.METHOD()의 미들웨어 함수에서만 동작한다.

```javascript
app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route');
  // otherwise pass the control to the next middleware function in this stack
  else next();
}, (req, res, next) => {
  // send a regular response
  res.send('regular');
});

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', (req, res, next) => {
  res.send('special');
});
```
라우터의 남은 미들웨어 함수를 스킵하려면 next('router')을 부르면 된다.
```javascript
const express = require('express');
const app = express();
const router = express.Router();

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  if (!req.headers['x-auth'] return next('router');
  next();
});

router.get('/user/:id', (req, res) => {
  res.send('hello, user!');
});

// use the router and 401 anything falling through
app.use('/admin', router, (req, res) => {
  res.sendStatus(401);
});
```
> router와 route는 다르다.
router는 미들웨어나, route작업을 처리하는 객체를 말하며, route는 router에서 요청에 대해서 처리하는 작업을 의미한다.
즉, next('router')같은 경우에는 다음 라우터로 즉 모든 작업에 반응하는 위 router에서 /user/:id로 또는 /user/:id를 스킵하고 /admin 라우터로 넘어가는 것. next('route')는 같은 path의 요청을 처리하는 router내에서 다음 미들웨어처리를 스킵하는 것이다.

### Error-handling middleware
> 에러 핸들링 미들웨어는 항상 4개의 인수를 받는다. 반드시 error-handling 미들웨어를 위해서 네개의 인수를 전달해줘야 한다. next object를 하용하지 않더라도 유지해야한다. 그렇지 않으면 next object는 보통의 미들웨어로 익식되고 에러를 다루는데 실패하게 된다.

error-handling 미들웨어 함수를 정의하는 예제는 다음과 같다.
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```
### Built-in middleware
Express 버전 4 이상부터 Express는 더이상 Connect에 의존하지 않는다. 이전에는 미들웨어 함수가 Express에 포함되어 있었지만 이제는 별개의 모듈로 존재한다.

Express는 다음과 같은 built-in 미들웨어 함수를 가진다:
- express.static: HTML, 이미지, CSS등과 같은 정적 파일을 제공한다.
- expreess.json: 요청을 JSON payloads로 parse해준다.
- express.urlencoded: URL-encoded payloads로 parse해준다.

### Third-party middleware
Express app에 기능성을 추가하기 위해 third-party middlware를 추가해라.
요구되는 기능을 위해 Node.js모듈을 설치가하고 application level 또는 router level app에 load해라.
```bash
npm install cookie-parser
```
```javascript
const express= require('express');
const app = express();
const cookieParser = require('cookie-parser');

// load the cookie-parsing middleware
app.use(cookieParser());
```

## Overriding the Express API
Express API는 req 와 res object에 대해 많은 프로퍼티와 methods를 가지고 있다. 이것들은 프로토타입에 의해서 상속된다.
Express API는 다음과 같은 두 종류의 Prototype을 가진다:

1. Global Prototypes: express.request, express.response.
2. App-specific Prototypes: app.reqest, app.response.

Global Prototypes을 수정하는 것은 lode된 모든 Express app에 영향을 끼친다. 만약 원한다면 새로운 app을 만든 후 app-specific prototypes를 바꿀 수 있다.

### Methods
기존에 존재하는 methods에 custom 함수를 할당함으로써 덮어쓸 수 있디ㅏ.
```javascript
app.response.sendStatus = function (statusCode, type, message) {
  // cod is intentionally kept simple for demonstration purpose
  return this.contentType(type).status(statusCode).send(message);
}
```
위 예체는 res.sendStatus를 변경한다. 다음과 같이 사용할 수 있다.
```javascript
res.sendStatus(404, 'application/json', '{"error": "resource not found"}');
```
### Properties
Express API의 프로퍼티들을 통해 다음과 같은 작업이 가능하다:

1. 프로퍼티 할당(ex: req.baseURL, req.originalUrl)
2. getter 정의(ex: req.secure, req.ip)

현재의 req-res 사이클의 res, req 객체의 프로퍼티를 할당할 수 있다.

프로퍼티는 Express API extensions API를 통해서 덮어쓸 수 있다.

다음의 코드는 req.ip의 값을 얻는 방법에 대해서 재정의 했다. 이제 이것은 Client-IP의 값을 반환할것이다.
```javascript
Object.defineProperty(app.request, 'ip', {
  configurable: true,
  enumerable: true,
  get () { return this. get('Client-IP') }
});
```
### Prototype
Express.js를 제공하기 위해서 req/res 객체는 같은 Prototype 체인으로부터 상속될 필요가 있다. Default로 req = http.IncomingRequest.prototype/ res = http.IncomingResponse.prototype이다.

정말 필요한 경우가 아니라면 이 작업을 전역적으로 수행하는 것이 아니라 애플리케이션 수준에서만 수행하는 것이 좋다. 또한, 사용되는 프로토타입이 가능한 기본 프로토타입의 기능과 가장 가깝게 일치하도록 주의해야 한다.
```javascript
// Use FakeRequest and FakeResponse in place of http.IncomingRequest and http.ServerResponse
// for the given app reference
Object.setPrototypeOf(Object.getPrototypeOf(app.request), FakeRequest.prototype);
Object.setPrototypeOf(Object.getPrototypeOf(app.response), FakeResponse.prototype);
```

## Using template engines with Express
**템플릿 엔진**은 애플리케이션에서 정적파일을 사용하는것을 가능하게 한다.
템플릿 엔진은 말 그대로 어떤 html, css, javascript파일 그자체를 프론트엔드에 제공하는 방법이다. 요즘은 리액트나 뷰, 앵귤러등의 프레임워크로 프론트엔드를 구성하므로 넘어가도록 한다. 필요하다면 따로 공부하면 된다. 그렇게 어렵지 않다.

## Error Handling
**Error Handling**은 동기적, 또는 비동기적으로 발생하는 에러를 어떻게 처리하는지에 대한것이다. Express는 기본 에러 핸들러를 제공하므로 걱정할 필요가 없다.

### Catching Errors
라우트 핸들로와 미들웨어가 실행되는동안 발생하는 에러를 잡아내는것은 아주 중요하다.

라우트 핸들러나 미들웨어에서 동기적으로 발생하는 에러에 대해서는 따로 추가적인 작업이 필요없다. 만약 동기적으로 작동하는 코드가 에러를 발생시킨다면 Express는 에러를 잡아낸다.
```javascript
app.get('/', (req, res) => {
  throw new Error('BROKEN');
});
```
미들웨어 또는 라우트 핸들러에 의해 발생되는 비동기적 에러는 반드시 next()함수로 넘겨줘야한다.
```javascript
app.get('/', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      next(err);
    } else {
      res.send(data);
    }
  });
});
```
Express 버전 5 이상부터 미들웨어는 Promise를 반환한다. 그리고 Promise는 자동적으로 next(value)를 호출한다.
```javascript
app.get('/user/:id', asyn (req, res, next) => {
  const user = await getUserById(req.params.id);
  res.send(user);
});
```
만약 **getUserById**가 거절되거나 에러를 발생시킨다면 **next**는 에러 또는 거절된 값과 함께 next를 호출할것이다. 만약 거절된 값이 제공되자 않는다면 **next**는 기본 에러와 함께 호출될것이다.

'route'를 제외한 어떤 값이든 **next()**함수에 전달한다면 Express는 현 요청이 에러가 발생했다고 여기고 남은 에러를 핸들링하지 않는 미들웨어 함수나 라우팅을 스킵할것이다.

만약 콜백의 연속이 어떠한 데이터도 제공하지 않고 에러만 제공하는경우 다음과 같이 고드를 간소화할 수 있다:
```javascript
app.get('/', [
  function (req, res, next) {
    fs.writeFile('/inaccessible-path', 'data', next);
  },
  function (req, res) {
    res.send('OK');
  }
]);
```
위 예제에서 **next**가 **fs.writeFile**이 에러를 발생하거나, 발생하지 않을때를 위해 콜백으로 제공되었다. 만약 에러가 없다면 두번째 핸들러가 실행될것이다. 에러가 있다면 Express는 에러를 잡아내고 에러처리를 시작한다.

비동기 코드에서 에러가 발생하면 반드시 catch에서 넘겨줘야 한다.
```javascript
app.get('/', (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error('BROKEN');
    } catch (err) {
      next(err);
    }
  }, 100);
});
```
위 예제는 **try...catch** 블록을 사용하여 비동기 에러를 잡아내고 전달했다. 만약 **try...catch**블록을 생략한다면, 비동기 핸들러 코드의 일부가 아니기 때문에 에러를 잡아내지 못한다.

**try...catch**블록을 사용하고싶지 않다면 다음과 같이 하면 된다:
```javascript
app.get('/', (req, res, next) => {
  Promise.resolve().then(() => {
    throw new Error('BROKEN');
  }).catch(next); // Erros will be passed to Express.
});
```
promises는 자동적으로 동기적, 비동기적 에러 모두를 잡아내기 때문에 간단하게 next를 catch 핸들러에 제공할 수 있다. catch핸들러는 첫 인수로 에러를 받기 때문이다.

동기적 에러 발견에 읜존하는 핸들러 체인을 사용할수도 있다. 사소한 비동기적 코드를 줄임으로써.
```javascript
app.get('/', [
  function (req, res, next) {
    fs.readFile('/maybe-valid-file', 'utf-8', (err, data) => {
      res.locals.data = data;
      next(err);
    });
  },
  function (req, res) {
    res.locals.data = res.locals.data.split(',')[1];
    res.send(res.locals.data);
  }
]);
```

위 예제는 **readFile**로부터의 사소한 몇가지 사소한 문이 있다. 만약 **readFile**이 에러를 발생한다면 에러를 Express로 전달하고 그렇지 않으면 다음 체인으로 넘어간다. 그 후 데이터로 뭔가를 진행하고, 만약 이것을 실패한다면 동기적 에러 핸들러가 그것을 잡아낸다. 문제가 없다면 에러 핸들러는 실행되지 않을것이다.

어떤 방법을 사용하든 만약 에러 핸들러가 호출되고, 애플리케이션이 살아남기 위해서는 반드시 Express가 error를 받도록 해야한다.

### The default error handler
Express는 애러를 관리하는 빌트인 에러 핸들러를 가지고 있다. 디폴트 에러 핸들링 미들웨어 함수는 미들웨어 함수 수택 마지막에 추가된다.

만약 **next()**에 에러를 전달하고 커스텀 에러 핸들러로 처리하지 않느다면 필트인 에러 핸들러에 의해 처리된다. 에러는 stack trace내용을 보여준다. stack trace는 프로덕션 환경에는 포함되지 않는다.

에러가 작성되면, 다음과 같은 정보가 응답에 기록된다:
- res.statusCode가 err.status의 값으로 세팅된다. 400, 500대 번호라면 500으로 세팅된다.
- res.statusMessage가 statusCode에 따라 세팅된다.
- 프로덕션 환경에서는 HTML body가 status code message로 세팅될거고 그렇지 않으면 err.stack로 작성된다.
- headers가 err.headers 객체로 특정된다.

만약 응답을 쓰는 도중 에러와 **next()**가 호출된다면 Express 디폴트 에러 핸들러는 연결을 종료하고 요청에 실패할것이다.

만약 커스텀 에러 핸들러를 추가한다면 headers가 이미 클라이언트에게 보내졌을 때 디폴트 에러 핸들러에게 위임해야한다.
```javascript
function errorHandler (err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}
```
커스텀 에러 핸들러 미들웨어가 정이되어 있더라도 **next()**를 에러와 함께 호출한다면 디폴트 에러 핸들러가 호출된다.

### Writing error handlers.
에러 핸들러 미들웨어 함수는 인수를 4개를 받는다는것만 빼면 기존 미들웨어 함수와 비슷하다.
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something brokd!');
});
```
에러 핸들러 미들웨어는 마지막에 정의해야 한다.
```javascript
const bodyParser = require('body-parser');
const methodOverride = require('mothod-override');

app.use(bodyParser.urlencoded({
  exteded: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use((err, req, res, next) => {
  // logic
});
```
미들웨어 함수의 응답은 어떤 형태든지 가능하다.

보통의 비들웨어 함수처럼 여러개의 에러 핸들링 미들웨어 함수를 정의할 수 있다.
```javascript
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
```
이 예제의 경우 **logErrors**는 빌트인 에러 핸들링으로 에러를 처리할 수 있다.
```javascript
function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err);
}
```
또한 이 예제에서 **clientErrorHandle**는 아래와 같이 정의되었다. 이 경우에, 에러는 명확하게 다음으로 넘어간다.

>
에러 핸들링 함수에서 next를 부르지 않을경우 res를 써줘야한다. 그렇지않으면 요청이 "hang"상태에 머무르게 되고 이는 가비지 컬렉션의 대상이 되지 않는다. 즉 메모리 누수가 발생하게 되는것이다.

```javascript
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}
```
모든 에러에 반응하는 핸들러는 다음과 같이 정의할 수 있다:
```javascript
function errorHandler (err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
```
만약 많은 콜백 함수를 가진 라우트를 가진다면 **route** 매개변수를 통해 다음 라우트 핸들러로 넘어갈 수 있다.
```javascript
app.get('/a_route_behind_paywall',
        (req, res, next) => {
  		  if (!req.user.hasPaid) {
            // continue handling this request
            next('route');
          } else {
			next();
          }
}, (req, res, next) => {
  PaidContent.fine((err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});
```


>라우터, 라우트, 미들웨어함수, 미들웨어에대한 정리
라우터: 라우터는 다른 URL과 HTTP 메소드 라우트를 조직하고 관리하도록 해주는 하나의 객체다.
라우트: 어떤 특정한 요청 관리 함수와 연관된 URL 패턴 또는 특정한 경로를 의미한다.
미들웨어 함수: 미들웨어 함수는 요청-응답 사이클에서 next 함수와, 요청 응답 객체에 대한 접근 권한을 가지는 함수다.
미들웨어: 미들웨는 클라이언트의 요청과 서버의 응답 사이이에서 실행되는 소프트웨어 요소이다.
요약하면, 라우터는 라우트를 조직하고 관리하도록 해주는 객체이며, 라우트는 핸들링 함수과 연관된 특정한 경로이고, 미들웨어 함수는 응답과 요청 객체를 수정할 수 있는 함수이고 미들웨어는 서버와 클라이언트 사이에서 동작하는 하나의 소프트웨어 컴포넌트다.

>next(), next('route'), next('router')에 대한 정리
next(): 미들웨어 스택에 있는 다음 미들웨어 함수로 넘어간다.
next('route'): 현 라우트에 남은 모든 남은 미들웨어 함수를 스킵하고 같은 라우트에 일치하는 다음 라우트 핸들러로 넘어간다.
next('router'): 남은 모든 미들웨어 함수를 스킵하고 현재 라우터의 컨트롤을 그만둔다.
요약하자면 next()는 다음 미들웨어 ㅎ마수로 넘어가고, next('route') 현 라우트에대한 남은 미들웨어 함수를 모두 스킵하고, next('router')는 현 라우터에 남은 모든 미들웨어 함수를 스킵한다.

next('route') next('router')의 차이에 대한 예제

```javascript
const express = require('express');
const app = express();
const router1 = express.Router();
const router2 = express.Router();

router1.use((req, res, next) => {
  console.log('Middleware 1');
  next();
});

router1.get('/example', (req, res, next) => {
  console.log('Route handler 1.1');
  next('route');
}, (req, res, next) => {
  console.log('Route handler 1.2');
  next();
});

router2.use((req, res, next) => {
  console.log('Middle ware 2');
  next();
});

router2.get('/example', (req, res, next) => {
  console.log('Route handler 2.1');
  next('router');
}, (req, res, next) => {
  console.log('Route Handler 2.2');
  next();
});

app.use('/router1', router1);
app.use('/router2', router2);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```
제대로 이해가 가지 않아 나와 같은 문제를 겪는 사람들을 위해 예제를 첨부한다. GPT가 만들어줬다. 
이 예제에서 우리는 두개의 라우터가있다(router1, router2) 각각이 '/example'경로에 대한 미들웨어 함수와 라우트 핸들러를 가진다.

'/router1/example'에 대한 GET 요청이 오면 다음과 같은 일이 일어난다:
1. Middleware 1이 실행된다.
2. Route handler 1.1이 실행된다.
3. **next('route')**가 호출되면 라우트 핸들러 1.2는 스킵된다.

'/router2/example'에 대한 GET 요청이 오면:
1. Middleware 2가 실행된다.
2. Route handler 2.1이 실행된다.
3. **'next('router')**가 호출되면 Route handler 2.2가 스킵되고 router2에 대한 컨트롤을 그만둔다.

요약해서 next('route')는 현재 라우트에 남은 라우트 핸들러를 스킵하기 위해 사용되고, next('router')는 현 라우터를 나가고 컨트로를 다음 라우터나 미들웨어 함수에 넘기기위해 사용된다.


## Debugging Express
Express는 내부적으로 라우트 매치, 미들웨어 함수의 사용, 애플리케이션 모드, 요청-응답 사이클의 흐름에 대한 정보를 제공하는 debug모듈을 사용한다.

Express 모든 내부 log를 보기위해서 DEBUG 환경변수를 express:* 로 하면 된다.
```bash
DEBUT=express:* node index.js
```
만약 라우터로부터의 로그만 보고싶다면 DEBUG = express:router로 설정하면 된다.

## Applications generated by express
Express에 의해 생성된 애플리케이션에 한정해서 디버그를 볼 수 있다.
```bash
DEBUT=sample-app:* node ./bin/www
```
하나 또는 그 이상의 애플리케이션을 콤마를 통해 특정할 수 있다.
```bash
DEBUT=http,mail,express:* node index.js
```

### Advanced options
다음과 같은 여러 기능을 추가할 수 있다.
![](https://velog.velcdn.com/images/koreanthuglife/post/22747e0d-6a39-4807-a984-b850a97df6b6/image.png)

## Express behind proxies
Reverse proxy를 통해 Express앱을 실행시키면 Express API의 몇몇 값을은 예상과 다르게 반환될 수 있다. 이러한 경우 **trust proxy**앱 세팅을 통해 값을 제대로된 값을 드러낼 수 있다.
> Reverse proxy란?
하나 또는 그 이상의 백엔드와 클라이언트 사이에서 동작하는 서버를 의미한다. 클라이언트에게 요청을 받고 그것을 적절한 백엔드 서버에게 보낸다. 백엔드 서버는 요청에 대한 응답을 reverse proxy로 보낸다. 이후 reverse proxy는 클라이언트에게 응답을 전달한다. 다음은 reverse proxy 사용의 이점이다:
- Load balancing: 여러개의 서버에게 전송되는 요청을 분배하고 조절하여 하나의 서버가 많은 양의 요청에 과부화되는것을 막는다.
-  Security: 클라이언트로부터의 IP 주소나 다른 상세한 정보를 숨김으로써 방화벽처럼 동작할 수 있다.
- SSL/TLS termination: SSL/TLS 암호화와 복호화를 다룰 수 있다. 
-  Caching: 백엔드 서버의 내용을 저장해 응답시간을 줄이며 백엔드 서버로부터의 load를 감소시킨다.
- Compression: 클라이언트에게 보내는 데이터를 압축할 수 있고 이것은 대역폭을 저장하고 지연성을 줄이는데 도움을 준다.
요약해서, reverse proxy는 클라이언트와 백엔드 사이에서 중계로서 동족하고, 위에서 기술한 다양한 이익을 제공한다.

**trust proxy** 설정을 구성할 때 리버스 프록시의 정확한 설정을 이해하는 것이 중요하다. 이 설정은 요청에서 제공된 값을 신뢰하기 때문에 Express에서의 설정 조합이 리버스 프록시가 작동하는 방식과 일치해야 한다.

**trust proxy** 설정은 다음에 나열된 값 중 하나로 설정될 수 있다.

| Type | Value |
| - | - |
| <strong>Bolean&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</strong> | 만약 **true**라면 클라이언트의 IP 주소는 X-Forwarded-For 헤더의 가장 왼쪽 항목으로 이해된다. 이 헤더는 클라이언트의 요청이 프록시를 거쳐 갈 때, 프록시 서버에 의해 설정되며, 각 프로시 서버를 거치면서 IP 주소가 추가된다. 가장 왼쪽 항목은 원래 클라이언트의 IP주소를 타나내며, 이를 통해 클라이언트의 실제 IP 주소를 알 수 있다.</br></br>만약 **false**라면 앱은 클라이언트와 직접적으로 연결되어 있다고 만단하고 클라이언트의 IP주소는 **req.socket.remoteAddress**로부터 불러와진다. 이것은 기본 설정이다.</br></br>**true**로 설정할 때 마지막 리버스 프록시가 다음 HTTP 헤더를 제거하거나/덮어썼는지 확실히 하는것은 중요하다: **X-Forwarded-For, X-Forwarded-Host, X-Forwarded-Proto**|
|<strong>IP address</strong>|IP주소, 서브넷 또는 리버스 프록시로 신뢰할 수 있는 IP주소와 서브넷의 배열이다. 다음 리스트는 미리 설정된 서브넷 이름을 보여준다.</br><ul><li>loopback - 127.0.0.1/8, :: 1/128</li><li>linklocal - 169.254.0.0/16, fe80 :: /10</li><li>uniquelocal - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00 :: /7</li></ul></br>IP주소를 다음과 같은 방식으로 세팅할 수 있다.</br> <code>`app.set('trust proxy', 'loopback')`</br>`app.set('trust proxy', 'loopback, 123.123.123.123')`</br>`app.set('trust proxy', 'loopback, linklocal, uniquelocal')`</br>`app.set('trust proxy', ['loopback', 'linklocal', 'unique'local'])`</br>특정되면 IP주소나 서브넷은 주소 결정 작업으로부터 제외된다. 그리고 애플리케이션 서버에 가장 가까운 신뢰할 수 없는 IP주소는 클라이언트의 주소로 정의된다. 이를 통해 신뢰할 수 있는 리버스 프록시를 통한 요청만 허용하고 다른 출처의 요청은 차단하거나 제한할 수 있다.|
|<strong>Number</strong>|Express 애플리케이션으로부터 최대 n번 떨어진 홉(hop)의 주소를 사용한다. 홉(hop)은 통신 경로 상에서 두 장비(예: 프록시 서버)간의 거리를 나타낸다. 이렇게 설정하면 애플리케이션에서 원격 클라이언트의 IP 주소를 파악하는 데 도움이 된다. 이 기능은 여러 리버스 프록시를 거쳐 오는 요청의 경우 특히 유용할 수 있다. **req.socket.remoteAddress**가 첫번째 홉이고, 나머지는 **X-Forwarded-For**에서 오른쪽에서 왼쪽으로 찾아볼 수 있다. </br><span style="color:pink">이 설정을 사용할 때는 클라이언트가 구성된 홉 수보다 작은 Express 애플리케이션에 도달할 수 있는 다양한 길이의 경로가 없도록 해야한다. 그렇지 않으면 클라이언트가 임의의 값을 제공할 수 있다. 즉 리버스 프록시와 Express 애플리케이션 사이에 있는 경로의 길이가 일정하게 유지되도록 주의해야 한다.</span>|
|<strong>Function</strong>|커스텀 trust 정의</br>`app.set('trust proxy', (ip) => { if (ip === '127.0.0.1 or ip === '123.123.123.123') return true else return false })`|
**trust proxy**를 사용하는 것은 다음과 같은 효과를 가진다:
- **req.hostname**의 값이 클라이언트로부터 또는 프록시로부터 설정 될 수 있는 **X-Forwarded-Host** 헤더의 값으로 설정된다.
- **X-Forwarded-Proto**가 앱에게 **https**인지 **http**인지 또는 유효하지 않은 이름인지를 말해주기 위해서 리버스 프록시에 의해 설정될 수 있다. **req.protocol**에 값이 반영된다.
- req.ip 및 req.ips 값은 소켓 주소와 X-Forwarded-For 헤더를 기반으로 첫 번째 신뢰할 수 없는 주소에서부터 채워진다. req.ip는 클라이언트의 단일 IP주소를, req.ips는 클라이언트의 IP 주소 목록을 포함한다. 이 값들은 소켓 주소와 X-Forwarded-For 헤더를 사용하여 결정된다. 여기서 X-Forwarded-For 헤더는 클라이언트 요청이 리버스 프록시를 거치면서 생성되며, 프록시 서버를 거칠 때마다 IP주소가 추가된다. Express 애플리케이션은 설정된 신뢰할 수 없는 주소를 기준으로 시작하여 req.ip및 req.ips 값을 채운다. 이렇게 함으로써 애플리케이션은 신뢰할 수 없는 주소를 식별하고 처리할 수 있다. 이 기능은 주로 보안 목적으로 사용되며, 신뢰할 수 있는 리버스 프록시를 통한 요청만 허용하고 다른 추철의 요청은 차단하거나 제한할 수 있다.

> 소켓 주소란?
소켓 주소는 인터넷 프로토콜(IP) 기반의 네트워크에서 특정 네트워크 노드를 식벽하는 데 사용되는 주소이다. 소켓 주소는 IP주소와 포트 번호의 조합으로 구성된다.
1. IP주소: 인터넷 프로토콜 주소는 네트워크상의 장치를 고유하게 식별하는 주소이다. IPv4와 IPv6 두 가지 버전이 있다.
2. 포트 번호: 포트 번호는 네트워크상의 특정 장치에서 실행되는 특정 프로세스 또는 애플리케이션을 구분하는 데 사용되는 16비트 숫자이다.
-----
소켓 주소는 네트워크에서 통신을 위한 엔드포인트로 사용되며, 데이터를 보내고 받을 수 있는 고유한 식별자이다. 예를 들어, 웹 서버는 일반적으로 IP 주소와 80(HTTP) 또는 443(HTTPS) 포트 번호를 사용하여 소켓 주소를 구성한다. 이렇게 하면 클라이언트가 웹 서버에 접속할 때 해당 소켓 주소를 통해 통신할 수 있다.

**trust proxy** 세팅은 proxy-addr 패키지를 통해 설치될 수 있다.

## Moving to Express 4

### Overview
Express 4는 아주 많은 변화를 가져왔다.
다음과 같은 내용을 다룬다.
- Express 4에서 변경된점
- 예제
- Express 4 앱 제네레이터로 업그레이드

### Changes in Express 4
몇가지 주요한 변경이 있다.
- Express 코어와 미들웨어 시스템의 변경. 연결에 대한 의존성과 빌트인 미들웨어가 제거되었다. 그러므로 미들웨어를 스스로 추가해줘야 한다.
- 라우팅 시스템의 변화
- 다양한 다른 변경점.

### Changes to Express core and middleware system
Express 4는 더이상 연결에 의존하지 않고, 빌트인 미들웨어를 제거했다. **express.static**을 제외하고. 이것은 Express가 이제 독립적인 라우팅과 미들웨어 웹 프레임워크를 가지고 Express의 versioning과 릴리즈가 미들웨어 업데이트로부터 영향을 받지 않는다는 것을 의미한다.

따라서 우리는 명확하게 요구되는 미들웨어를 추가해줘야 한다. 다음과 같은 과정을 거치면 된다:
1. 모듈 설치: `npm install --save <module-name>`
2. 앱에서, 모듈 불러오기: `require('module-name')`
3. 모듈 사용: `app.use(...)`

다음 표는 Expree 3 미들웨어와 상응하는 Express 4의 미들웨어다

| Express3 | Express 4 |
| - | - |
|express.bodyParser|body-parser + multer|
|express.compress|compression|
|express.cookieSession|cookie-session|
|express.cookieParser|cookie-parser|
|express.logger|morgan|
|express.session|express-session|
|express.favicon|serve-favicon|
|express.responseTime|response-time|
|express.errorHandler|errorhandler|
|express.methodOverride|method-override|
|express.timeout|connect-timeout|
|express.vhost|vhost|
|express.csrf|csurf|
|express.directory|serve-index|
|express.static|serve-static|

대부분의 경우에 간단하게 상응하는 미들웨어로 변경할 수 있따.

#### `app.use`가 매개변수를 허용한다.
버전 4에서 미들웨어를 불러온 곳에서 경로를 정의하기 위해 매개변수를 사용할 수 있다. 이후 라우트 핸들러에서 값을 읽어들일 수 있다. 예제:
```javascript
app.use('/book/:id', (req, res, next) => {
  console.log('ID:', req,params.id);
  next();
});
```

### The routing system
앱이 명확하게 라우팅 미들웨어를 불러오기 때문에 더이상 미들웨어의 순서에 대해서 걱정할 필요가 없다.

라우트를 정의하는 방법은 바뀌지 않았지만 라우트를 조직하는 것을 돕기 위한 두 기능이 추가되었다.
- 새로운 메소드, `app.route()`, 라우트 경로를 위한 체인화 할 수 있는 라우트 핸들러는 만드는데 사용된다.
- 새로운 클래스, `express.Router()`, 모듈의 탑재가능한 라우트 핸들러를 만들기 위해 사용된다.

`app.route()` method

`app.route()`는 라우트 경로에 체인화 할 수 있는 라우트 핸들러를 만들기 위해 사용된다.

`app.route()`의 사용 예제다.
```javascript
app.route('/book')
	.get((req, res) => {
  	  res.send('Get a random book');
	})
	.post((req, res) => {
	  res.send('Add a book');
	})
	.put((req, res) => {
  	  res.send('Update the book');
	});
```

`express.Router` **클래스**
라우트 조직화에 도움을 주는 다른 하나의 특징은 새로운 클래스인 `express.Router`이다. 이를 통해 모듈의 탑재가능한 라우트 핸들러를 만들 수 있다. `Router`인스턴스는 완전한 미들웨어이고 라우팅 시스템이다; 이러한 이유로 종종 미니앱이라고 불리기도 한다.

아래 예제는 라우터를 모듈로 만들고, 그 안에 미들웨어를 불러오고, 몇몇 라우트를 정의하고, 이것을 메인앱 경로에 탑재한다.

예를 들어 `birds.js`이름의 라우터 파일을 앱 디렉토리에 만들고 다음을 따라해보자:

```javascript
#birds.js
var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page');
});
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

module.exports = router;
```
이후 메인 앱에서 라우터 모듈을 불러온다.
```javascript
# main
var birds = require('/birds')
// ...
app.use('/birds', birds);
```

이제 앱은 `/birds` 와 `/birds/about` 경로에 대한 요청을 처리할 수 있고, `timeLog`를 호출할 것이다.

### Other changes
다음 표는 작지만 중요한 변경점들이다:

| Object | Description|
| - | - |
|Node.js| Express 4는 Node.js 0.10.x나 그 이후 버전을 필요로 한다.
|http.createServer()|`http`모듈을 더이상 요구되지 않는다. `app.listen()`을 통해 시작할 수 있다.
|app.configure()&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp| `app.configure()`함수는 제거되었다. `process.env.NODE_ENV`나 `app.get('env')`를 사용해라.
|json spaces|`json spaces`앱 프로퍼티는 디폴트로 사용할 수 없다.
|req.accepted()|`req.accepts()`, `req.acceptsEncodings()`, `req.acceptsCharsets()`, `req.acceptsLanguages()`를 사용해라.
|res.location()| 더이상 URL의 상대경로를 취득할 수 없다.|
|req.params| 배열이였지만 이제는 객체다.|
|req.locals| 함수였지만 이제는 객체다.|
|res.headerSent| `res.headersSent`로 변경되었다.|
|app.route|`app.mountpath`로 사용가능하다.|
|res.on('heander')| 제거되었다.|
|res.charset| 제거되었다.|
|res.setHeader('Set-Cookie', val)|간단한 쿠기 값으로 기능이 제한되었다. 추가적인 기능성을 위해 `res.cookie()`를 사용해라.|

### Example app migration
Express 3에서 Express 4로의 이동을 보여주는 예제가 있다.
#### Version 3 app
`app.js`
```javascript
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret here' }));
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port' + app.get('port'));
});
```
`package.json`
```json
{
  "name": "application-name",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node app.js"
  },
  "dependecies": {
    "express": "3.12.0",
    "pug": "*"
  }
}
```
#### Process
Express 4를 시작하기 위해서는 필요한 미들웨어를 설치해야 한다:
```bash
npm install serve-favicon morgan method-override express-session body-parser multer errorhandler express@latest pug@latest --save
```
`app.js`는 다음과 같은 변화가 필요하다.
1. 빌트인 미들웨어는 더이상 사용할 수 없다. 모두 변경해야 한다.
2. `app.router`함수를 사용할 필요가 없다. 따라서 `app.use(app.router);`코드를 제거해야 한다.
3. 정확한 순서로 미들웨어 함수가 쓰였는지 확인해야 한다. `errorHandler`는 앱 라우트를 불러오기 전에 불러와야 한다.
### Version 4 app
`package.json`
```json
{
  "name": "application-name",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "body-parser": "^1.5.2",
    "errorhandler": "^1.1.1",
    "express": "^4.8.0",
    "express-session": "^1.7.2",
    "pug": "^2.0.0",
    "method-override": "^2.1.2",
    "morgan": "^1.2.2",
    "multer": "^0.1.3",
    "serve-favicon": "^2.0.1"
  }
}
```
`app.js`
```javascript
var http = require('http');
var express = require('express');
var routes = require('./routes');
var user = require('/routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__diraname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/users', user.list);

// 에러 핸들링 미들웨어는 라우터를 불러온 뒤 불러와야 한다.
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), () => {
  console.log('Express server listening on port' + app.get('port'));
});
```

## Express 5
아직 beta release stage에 있다. 그러므로 번역하지 않고 넘어가도록 하겠다. 추후 번역된다면 그때 번역하도록 한다

## Database integration
필요할때마다 찾아보면 될듯하다. 쉽다.
https://expressjs.com/en/guide/database-integration.html#mysql
