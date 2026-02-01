# 🔧 extJS 프로젝트 Lint

## 도입 배경
- 레거시 프로젝트 초기에 Lint 를 사용 하지 않았으며 정적 분석도 수행되지 않아 현재 프로젝트내 코드 스타일이 다양하고, 버그나 기능의 문제를 조기에 발견하지 못함
- 코드 퀄리티를 올리기 위한 수단이 MR 확인 밖에 없는 상황
- 각자의 취향대로 코드를 작성하다 보니 중요하지 않은 것들에 MR 코멘트를 달게됨

## Lint 환경 및 실행 시점 결정

### A. 로컬 IDE 의 file open, edit 시점
- FE2 팀에서 Intermax 프로젝트에 사용하는 방식
- IDE (webstorm) 의 설정에 ESLint 패키지와 eslintrc 설정 파일을 등록하면, IDE 가 특정 파일 전체를 검사하여 text Editor 에 문제를 노출

### B. 로컬 githook 의 precommit 시점
- githook 과 몇 가지 npm 라이브러리를 이용하여 git 에 commit 하기 직전에 검사를 실행하여 결과에 따라 commit 을 막음

**구현 방법:**
1. githook 설정을 위한 husky 설치
2. pre commit 훅에 lint 를 수행하도록 코드 작성
3. 수정된 파일만 lint 대상이 되도록 하는 `lint-staged` 설정
4. 파일내 변경 사항만 lint 대상이 되도록 하는 `eslint-plugin-diff` 설정

### C. gitlab 서버에서 push 시점
- gitlab runner 가 push 된 코드를 검사하여 MR 단계에서 검사

## 각 방법 비교

| 방법 | 장점 | 단점 |
|------|------|------|
| 로컬 IDE | - | 제한 없이 commit 하므로, 코드를 복붙하거나 에러가 발생한 것을 눈에서 놓치면 에러가 나도 commit 됨 |
| 로컬 githook | 수정한 파일에 수정한 부분만 에러를 발생 시킬 수 있다 | - |
| gitlab 서버 | - | push 된 이후에 확인이 가능하므로 작업 속도가 느려진다 |

## 참고 자료
- [lint-staged로 commit시 ESlint 자동으로 검사하기](https://kyoung-jnn.com/posts/commit-lint)
- [How can I Eslint only changed lines of code](https://stackoverflow.com/questions/62074535/how-can-i-eslint-only-changed-lines-of-code)
- [Code Quality | GitLab](https://docs.gitlab.com/ee/ci/testing/code_quality.html)

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1652038*
