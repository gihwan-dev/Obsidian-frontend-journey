# 😅 리눅스, docker 환경 추가

## 도입배경
- windows 환경에서 팀내 공용 서버를 올려두다 보니 다중 접속이 불가함
- CI/CD 를 공부하다 보니 리눅스 환경에 익숙해질 필요가 있음
- 권한 문제 때문에 windows 스크립트는 gitlab runner 로 실행할때 불편함이 있었음

## 작업내용

### xcp 에 CentOS:7 VM 설치

![](https://t25540965.p.clickup-attachments.com/t25540965/144bf4ea-3cf0-4fc2-9903-d27856d4b961/image.png)

- root id: dpm-fe
- pw: exem1234!!
- 네트워크 주소는 10.10.35.62 를 사용하며, snapshot 스케쥴링하지 않음

### VM 에 docker 설치

![](https://t25540965.p.clickup-attachments.com/t25540965/fa29952a-7d97-4e39-8cc6-36cccc5c8d2e/image.png)

### docker 에 컨테이너 구성

- `gitlab-runner`: gitlab 과 연동하기 위한 러너
- `gitlab-dind`: 이미지 빌드를 위한 dind
- `nexus`: 이미지 저장을 위한 컨테이너

![](https://t25540965.p.clickup-attachments.com/t25540965/a6a91879-3540-4bcf-87f4-63be10151403/image.png)

- 넥서스(admin/exem1234!!)에 private registry 로 사용하기 위한 `docker-hosted` repository 생성

## 참고 자료

- [gitlab-runnner 를 활용한 docker 배포](https://bravenamme.github.io/2020/09/16/gitlab-runner-deploy-with-docker/)
- [nexus3 docker image 로 private docker repository 만들기](https://bitgadak.tistory.com/8)

## 하위 문서
- [[docker 사용중 문제 상황 및 해결 방법 기록]]
- [[Ollama]]

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1471780*
