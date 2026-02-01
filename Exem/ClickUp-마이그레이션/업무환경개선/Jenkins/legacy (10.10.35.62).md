# 🙈 legacy (10.10.35.62)

## 도입배경
- gitlab CI/CD 관련 자료를 찾다보니 Jenkins 에 대해 알게되었고, 생태계가 넓어서 정보를 찾기 편함
- gitlab 에 종속된 CI/CD 가 아니라서 github 에도 적용 가능하며 파이프라인 커스터마이징이 더 자유롭다. ~~대신 직접 하나하나 세팅해줘야한다...~~
- .gitlab-ci.yml 파일 작성을 안해도 되고 이미 작성된 yml 파일을 고려하지 않아도 된다

## 작업내용

### 도커에 젠킨스 컨테이너 구동

```markdown
- agent 연결을 위한 port 가 50000 번인데, 컨테이너 등록할때 50000번도 바인딩 해놔야함

# docker run -itd -p 8085:8080 -p 50000:50000 -v /jenkins:/var/jenkins_home --name jenkins -u root jenkins/jenkins:lts
```

### ssh, gitlab, 등등 플러그인 설치

> jenkins 업데이트 이후 java version 때문에 무한 restart 되는 현상 발생.
> blue ocean 이라는 기능을 이용하려면 직접 image 를 빌드 해야 한다는 문서가 있어서 해당 방법으로 다시 이미지 생성.
> https://www.jenkins.io/doc/book/installing/docker/#on-macos-and-linux

```bash
docker stop jenkins
docker rm jenkins
docker rmi jenkins/jenkins:lts
```

```dockerfile
FROM jenkins/jenkins:lts

USER root
RUN apt-get update && apt-get install -y sudo
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers

USER jenkins
RUN jenkins-plugin-cli --plugins blueocean docker-workflow
```

```bash
docker build -t my-jenkins:latest .
```

```bash
docker run -d \
  -p 8085:8080 -p 50000:50000 \
  -v /jenkins:/var/jenkins_home \
  --name jenkins \
  --user root \
  my-jenkins:latest
```

### 10.10.35.61 에 윈도우 agent 설치 및 jenkins setup

```powershell
로컬 pc 에 openssh 서버 설정
1. 관리자 모드로 PowerShell 실행
2. OpenSSH.Server 설치 명령
 - $ Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
3. sshd 서비스 등록
 - Start-Service sshd
4.부팅 시점에 자동으로 서비스를 실행하고 싶으면 Set-Service에 등록
  - Set-Service -Name sshd -StartupType 'Automatic'
5. OpenSSH-Server에 대한 방화벽 규칙 확인
 - 명령 : Get-NetFirewallRule -Name OpenSSH-Server-In-TCP
 - Enabled : True면 정상
5.1 만약 OpenSSH-Server-In-TCP 이름이 검색되지 않는다면, New-NetFirewallRule 명령어로 직접 방화벽 규칙 생성
 - New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH-Server-In-TCP' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22

node 설정
- java 버전이 낮으면 agent 실행이 안되므로 낮은 버전을 사용하고 있던 경우jdk 를 패치하고 path, java home 등의 환경변수 변경이 필요함
- 로컬에 agent 를 실행시켜서 빌드 파일을 생성하려고 하기 때문에, windows 환경인데 젠킨스의 node 설정에 디렉토리 구분자를 \ 가 아닌 / 로 넣어야 정상적으로 동작한다. ( D:/Jenkins/nodes )
```

### 10.10.35.62 에 리눅스 agent 설치 ( on docker )

```bash
docker run -d --name=jenkins-agent -p 4444:22 -e "JENKINS_AGENT_SSH_PUBKEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDxII1MEFE1D04QUh8HfXWpSmD9M61mc6MsrvkLLZFa/w+/6/BwL63T1AlKB/bn/954TI5xzsE379BHboByfVeT6Aq40w5odtSVd9vVzg6FEbQb7l/c7wa6DhlkCKNckfyTCKPGcaVgoXmqnoKJ059IA/ORFHQ+SbVfct3hQHeu0ggbgsLkS5lz0cZZ9GPcFtrRXl1llLlxjocu5l16N+AC6gWsZMfB3H9T2f9KtY7dJuE3LkJFlyNTE88RY1v2Svt7fPfqM+ywMYyq2vxn53AFnbXKmuqdUIygYOkR78mshl/TIGyo/x01f9JrIt2sLkHepo13tSrxQuSc4VbHX7jz root@localhost.localdomain" jenkins/ssh-agent:alpine-jdk17


docker exec -it jenkins-agent /bin/bash
apk add nodejs npm
```

> nodejs 플러그인을 사용할수가 없어서 위 방식으로 컨테이너에 직접 npm 을 설치한건데, ssh-agent 를 이용하는 경우 내부 java 버전때문인지 모르겟지만 에러를 해결할수 없다.
> 그래서 jenkins/agent:latest 이미지로 컨테이너를 생성해보니 nodejs 플러그인을 정상적으로 사용 할수 있었다.

- ssh agent 는 ssh 연결을 이용해서 jenkins 서버가 agent 에 연결을 하는 구조인데, 일반적인 agent 는 agent 에 connection 을 요청 하는것 같다. 그래서 컨테이너 생성시 java 명령이 필요한데, jenkins 에서 node 생성후에 node 설정 화면을 보면 key 와 java 명령어가 있다. 해당 명령어를 포함해서 container 를 생성하면 agent 가 연결된다.

```bash
docker run -d --name jenkins-agent --init jenkins/agent sh -c "curl -sO http://10.10.35.62:8085/jnlpJars/agent.jar && java -jar agent.jar -url http://10.10.35.62:8085/ -secret 3a85f55949e2ac5603d65139f96170a4e8bbf8db9e61e34e28ffec80e400e127 -name '10.10.35.62' -webSocket -workDir '/home/jenkins/agent'"
```

- 재시작시 jenkins 서버와 agent 가 연결될때 ssh key 신뢰를 확인해줘야 한다 (trust ssh host key)

### 추가로 필요한 사항
- user 를 생성해주고 권한 할당 까지 해야겠지만 운영까지는 관심 없으므로.... jenkins 활용이 커지면 고려해볼만 하다. 현재 id/pw = dpm-fe / exem1234!!

## 쿠버네티스 agent 이용 방법

1. jenkins 관리에서 cloud 에 새로운 클라우드를 등록
2. 쿠버네티스 선택하여 configure
3. credential 등록하여 test

```bash
kubectl create namespace jenkins-agent
kubectl create serviceaccount jenkins-agent -n jenkins-agent
kubectl create rolebinding jenkins-agent-rb \
  --clusterrole=edit \
  --serviceaccount=jenkins-agent:jenkins-agent \
  --namespace=jenkins-agent
kubectl -n jenkins-agent create token jenkins-agent --duration=8760h
```

- 생성되는 토큰을 credential 로 cloud 에 쿠버네티스 클러스터를 등록함

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1471760*
