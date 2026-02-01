# ✈️ MFH vite migration

## 1. vite 스캐폴딩

```bash
npm create vite@latest
```

- vue, typescript 로 생성

## 2. package.json 디펜던시 최신화
- 불필요한 패키지는 제외하고 사용되는 패키지들을 확인해서 최신 버전으로 설치

### 제외된 패키지
- **core-js**: 폴리필 관련
- **react, react-dom**: storybook 에서 필요하지만 사용하지 않음
- **vue-grid-layout**: 사용하지 않음
- **vue-resize-observer**: 사용되진 않지만 프로젝트에서는 필요함 (evui 에서 vue 의 전역 디렉티브로 설정되 버린게 아닌가 싶음)
- **worker-loader**: vite 에서는 필요 없음

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1805518*
