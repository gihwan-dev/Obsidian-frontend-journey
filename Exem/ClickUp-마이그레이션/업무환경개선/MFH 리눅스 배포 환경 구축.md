# 👆 MFH 리눅스 배포 환경 구축

## 도입 배경
- 클라이언트 개발을 위해서는 WAS 와 PG Repository가 구동중이어야 합니다. 때문에 공용 window 환경에서 실행 할 수 있도록 구성되어 있습니다.
- [WAS gitlab 프로젝트](http://gitlab.exem.xyz/platform1/maxgauge/sap-hana)에서 확인해보니 배포 파일이 Docker Image 로 빌드 되어서 nexus 에 저장되고 있습니다. (쿠버네티스 live server 구성을 위해 gitlab CI/CD 로 생성됨)
- WAS 나, Repo 구동은 CLI 로 이루어지는데 굳이 window 환경에서 실행할 필요가 없고, 리눅스 환경이 multi user 로 사용하기 편합니다.
- 팀내 Live deploy server 를 구성하는데 리눅스 환경이 더 편할 것 같습니다.

## 작업 내용

### 1. WAS 빌드 과정 분석
- java 파일과 클라이언트 파일을 패키징하는 build
- Docker 이미지를 생성하고 넥서스에 푸시하는 docker
- 생성된 이미지를 쿠버네티스 라이브 서버에 배포하는 hub
- 세가지 스테이지로 나뉘어진다
- 클라이언트 파일은 `client_release` `sql_release` 라는 폴더에 git submodule 형태로 클론 받아 사용하도록 되어있다
- 클라이언트 Git 프로젝트에서는 릴리즈 브랜치에 저 폴더안에 들어갈 내용을 push 하고 있으며, CI/CD가 적용되어 있지는 않다

### 2. docker 에 Postgresql Repository 컨테이너 생성

```bash
docker pull postgres
mkdir pgdata

docker run --network docker-network -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -d -v ~/pgdata:/var/lib/postgresql/data postgres

# repo 계정과 비밀번호를 설정 하려는 경우 컨테이너에 들어가서 추가 및 변경
docker exec -it postgres /bin/bash
psql -U postgres
ALTER USER postgres WITH PASSWORD 'postgres'; -- 비밀번호 변경
```

### 3. WAS 이미지 pull
- WAS 프로젝트에서 생성한 이미지가 저장되는 [넥서스](http://nexus.exem.xyz/)에서 이미지를 pull 받아야 하는데, 권한이 필요하다
- 관리자에게 요청한 것이 아니라 BE 인원에게 물어서 개인적으로 사용가능한 id/와 pw 를 이용해서 pull 받아 두었으므로 개인적 사용을 위해서는 따로 요청을 해야한다
- ~~gitlab 에서 전역 variable 로 넥서스 id/pw 를 인증해서 사용할 수 있으므로 FE 프로젝트에서 팀내 도커에도 이미지를 최신화 하도록 할 예정~~ (23.11.10 넥서스에 이미지 푸시가 안되는 상황이라 최신 이미지가 아님)

### 4. WAS 컨테이너 생성

```javascript
docker run --network docker-network -p 8044:8044 -v /docker-data/mfh-dist:/maxgauge/maxgauge -v /docker-data/mfh-sql:/maxgauge/sql --name mfh nexus.exem.xyz:5000/maxgauge/mfh:latest -d /bin/bash
```

- Docker image 에서 엔트리 포인트를 start.debug.sh 로 지정해놨기 때문에 컨테이너를 실행하면 바로 서버가 구동된다
- 첫 실행시 java 코드에서 에러가 나는데, repository 설정이 선행 되어야 하며, 이미지에도 문제가 있는걸로 추측된다
- 컨테이너를 start 명령어로 재시작한뒤, 터미널로 컨테이너에 접속해서 admin.sh 를 실행하고, repo 설정을 해주어야 한다

```bash
docker exec -it mfh /bin/bash
apt-get install net-tools
sh admin.sh
```

- repo 설정 과정에서 ifconfig 커맨드를 컨테이너 내부에서 실행하는데, net-tools 가 설치되어 있지 않아 에러가 난다. 컨테이너에 접속해서 net-tools 를 설치해야함
- repo 와 WAS 모두 docker 컨테이너라서 그런지 default ip 인 127.0.0.1 루프백 주소로 연결이 되지않으므로 실제 ip 10.10.35.62 를 입력

- FE 파일은 git 으로 릴리즈 브랜치를 클론함

```bash
git clone -b release_build http://gitlab.exem.xyz/maxgauge-for-hana/front.git /docker-data/mfh-dist
git clone -b release_sql http://gitlab.exem.xyz/maxgauge-for-hana/front.git /docker-data/mfh-sql
```

- nexus 에 푸시된 이미지가 최신이 아니고, 이후에도 BE 수정시 maxgauge.jar 파일을 변경해야 한다
- 전달 받은 maxgauge.jar 파일을 컨테이너에 패치하면 된다 (패치 방법은 리눅스 환경에 파일을 scp 를 이용해 전송하고, mfh 컨테이너 내부의 파일을 docker cp 명령으로 덮어쓴다)

```bash
scp maxgauge.jar dpm-fe@10.10.35.62:/home/dpm-fe
docker cp /home/dpm-fe/maxgauge.jar mfh:/maxgauge
docker stop mfh
docker start mfh
```

### 5. FE - MFH 프로젝트에 CI/CD 구성
- WAS 프로세스를 완벽하게 CI/CD 로 구성하려면 FE 프로젝트의 변동사항이 생기면 WAS 프로젝트의 CI/CD 를 trigger 해서 새로운 docker image 를 생성해야한다
- 굳이 다른 팀에게 요청 할 만한 사항이 아니라서 내부에서 해결할 수 있는 방법을 고민하다가, pull 받은 컨테이너 내부의 FE 파일만 교체하는 방법으로 클라이언트 CI/CD 를 구성하려 한다
- MFH 컨테이너를 생성할때 리눅스 호스트 파일시스템에 바인드 마운트를 했으므로 해당 위치의 파일만 변경하면 된다
- gitlab CI/CD 가 아닌 Jenkins 를 활용하였으며 플로우는 다음과 같다:
  1. [MFH 프로젝트](http://gitlab.exem.xyz/maxgauge-for-hana/front)에 웹훅을 설정하고 해당 웹훅이 jenkins 서버에 작업을 Trigger
  2. 트리거된 jenkins 프로젝트에 설정된 작업이 jenkins agent 를 통해 실행됨
  3. jenkins agent 는 docker 에 컨테이너로 실행중이며, 해당 컨테이너에서 빌드 된다
  4. 빌드된 파일은 컨테이너가 ssh 로 10.10.35.62 에 연결해서 호스트의 파일 시스템에 저장하게 된다
- 위 과정에서 agent 가 npm install, npm build 등의 커맨드를 실행하게 되므로 agent 컨테이너에 node 가 설치 되어야 하는데, jenkins 의 node 플러그인을 잘 활용하지 못해 결국 직접 agent 컨테이너에 node를 설치 해놓았다. (jenkins-agent 컨테이너가 내려가면 다시 컨테이너를 생성하고, 컨테이너 안에 들어가서 node 와 npm 을 설치해야 한다)
- 웹훅 설정시 `Enable SSL verification` 을 체크 해제해야 웹훅이 동작한다

## 참고자료
- [Docker Postgresql 설치 및 셋팅하기](https://judo0179.tistory.com/96)

## 문제 상황
- port 변경으로 인한 connection refused

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1471800*
