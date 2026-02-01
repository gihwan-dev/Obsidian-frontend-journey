# ⚙️ MM message server 개선

## 1. docker 컨테이너 내부 node 서버 원격 debugging

![](https://t25540965.p.clickup-attachments.com/t25540965/cc8f83c6-7362-4f66-bae7-6e42aea8e290/image.png)

node 실행 명령어에 다음 inspect 옵션을 넣고 실행하면 원격으로 디버깅이 가능해짐.

```bash
node --inspect=0.0.0.0 src/index.js
```

1. 디버깅을 위한 디폴트 포트 9229 번을 docker 와 62번 환경에 뚫어주고,
2. chrome://inspect 에 들어가면 디버깅 환경을 추가해서
3. remote target 의 inspect 를 누르면 디버거가 연결되서
4. 구동중인 node 를 chrome debugger 로 디버깅 가능

## 2. 빌드 방법과 레지스트리 변경
- dind 빌드 방식에서 kaniko 로 변경 (빌드 과정이 간단하며 권한 문제가 발생하지 않는다.)
- 팀 환경에 실행중이던 넥서스와 harbor 를 모두 중지시키고 http://nexus.exem.xyz/ 로 레지스트리를 이동

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1534098*
