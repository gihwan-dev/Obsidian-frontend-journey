# 💨 Tailwind 자동완성

## 문제

**Tailwind IntelliSense** 세팅 후에도 JSX에서 사용하지 않는 한, 속성 자동완성이 작동되지 않습니다.

## 해결법

### cursor 또는 vscode

1. **shift + ctrl + P ( User Settings (JSON) ) 열기**

2. **JSON 파일에 아래 내용을 복사 붙여넣기**

```json
"tailwindCSS.classFunctions": ["cva", "cn"],
"tailwindCSS.classAttributes": [".*class.*", ".*styles.*"]
```

- 지정한 함수 내부 문자열에 Tailwind 클래스 자동완성 적용
- 속성 이름에 class 또는 styles가 포함되면 Tailwind 자동완성 적용

### 작동 확인하기

- **cva 함수에서 자동완성**
- **변수명에 특정 키워드를 포함한 String 리터럴에서 자동완성**
  - class
  - styles

### WebStorm

- https://cva.style/docs/getting-started/installation#handling-style-conflicts 참고

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-2765698*
