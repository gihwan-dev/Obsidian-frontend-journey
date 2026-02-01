# docker-compose 로 vm 에 생성하기

## 1. gitlab 프로젝트에서 Runner 생성

- gitlab 프로젝트 > Settings > CI/CD > Runners > `New project runner`

![](https://t25540965.p.clickup-attachments.com/t25540965/5ec84c00-ee08-4de7-9e7d-34d1e1625576/image.png)

## 2. VM 에서 gitlab-runner 폴더를 생성하고 docker-compose.yml 파일 작성

```yaml
version: "3.8"
services:
  gitlab-runner:
    image: gitlab/gitlab-runner:alpine
    container_name: gitlab-runner
    restart: always
    environment:
      # 컨테이너 안에서 도커 소켓 권한 문제 줄이기 위한 옵션(필요 시)
      # - TZ=Asia/Seoul
      - TZ=Asia/Seoul
    volumes:
      # Runner 설정/토큰/캐시 등 영구 저장
      - ./config:/etc/gitlab-runner
      # Docker executor가 "호스트 도커"를 사용하도록 소켓 마운트
      - /var/run/docker.sock:/var/run/docker.sock
      # (선택) 캐시 디렉토리 따로 쓰고 싶을 때
        - ./cache:/cache
```

## 3. 컨테이너 시작 후 runner 생성해서 받은 토큰을 등록

```bash
docker compose up -d
docker compose exec gitlab-runner gitlab-runner register
```

![](https://t25540965.p.clickup-attachments.com/t25540965/74800993-df9e-44f0-b465-59a2e19cda4c/image.png)

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3441818*
