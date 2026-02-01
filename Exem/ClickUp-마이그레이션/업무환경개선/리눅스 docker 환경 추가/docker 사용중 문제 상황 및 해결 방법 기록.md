# ⚠️ docker 사용중 문제 상황 및 해결 방법 기록

## 레지스트리로 이미지 푸시가 되지 않는 문제
- gitlab ci/cd 로 이미지 빌드 및 푸시가 되지 않아 로그를 확인해보니 무한재시도 되는 상황
- 디스크 용량 문제로 확인됨

## 디스크 용량 문제
- `df -h` 명령어로 용량 확인해보면 used 가 99% 에 가까워짐
- `du -h --max-depth=1 | sort -hr` 명령어로 많이 사용되는 폴더를 찾아감
- mfh 도커 컨테이너 로그가 너무 커져서 문제 발생한것 확인
- `truncate -s 0 <json-log-file>` 명령어로 로그 파일의 용량을 줄여서 해결
- `/etc/docker/daemon.json` 파일을 수정하여 로그를 제한하도록 설정함

### 참고
- [Docker 로그 제대로 사용하기](https://insight.infograb.net/blog/2022/11/22/docker-logging-driver/)

## VM disk 용량 증설
- 아래 블로그를 참고하여 50GB > 200GB 로 증설함
- [리눅스 (CentOS 7) 디스크 용량 증설하기](https://velog.io/@junbeomm-park/리눅스-CentOS-7-디스크-용량-증설하기)

## 패키지 다운로드 되지 않는 상황
- DNS 서버 설정을 잘못한듯
- `vi /etc/resolv.conf`
- 위 파일에 vi 로 아래 dns server 를 추가

```
nameserver 8.8.8.8
```

## runner 로 수행한 커맨드 로그와 직접 ssh 로 붙어서 수행한 커맨드의 로그가 다른 경우
- gitlab CI/CD 는 연결된 runner 를 통해서 yml 의 스크립트를 수행한다
- 10.10.35.62 의 경우 docker 에 gitlab-runner 컨테이너를 올려두었으므로 컨테이너 프로세스가 스크립트를 실행하게 된다
- deploy 를 수행하기 위해서는 host 에 명령어를 입력해야 하는데 gitlab-runner 컨테이너가 ssh 로 10.10.35.62 에 접속하여 host 에 명령어를 입력하게 된다
- yml 에 정의한 스크립트에 escape 를 하지 않아 명령어가 잘못 전달되었던 이유로 수행 결과가 다르게 나왔다

```bash
# 잘못된 예
- ssh $PROD_SERVER_USER@$PROD_SERVER_IP -p$PROD_SERVER_PORT "sudo docker rmi $(docker images -f "dangling=true" -q)"

# 올바른 예 (escape 처리)
- ssh $PROD_SERVER_USER@$PROD_SERVER_IP -p$PROD_SERVER_PORT "sudo docker rmi \$(docker images -f \"dangling=true\" -q)"
```

## harbor down
/home/dpm-fe/harbor 에 접근해서 docker-compose.yml 를 이용해 컨테이너 재시작

```bash
docker-compose start
```

## jenkins 버전 업그레이드 후 jenkins 컨테이너 무한 restart

```bash
docker logs --tail 50 --follow --timestamps jenkins
```

위 명령어로 컨테이너 로그를 살펴보니 java version 이 11 이라서 문제 발생 하고 있다는것을 확인 (17 버전 이상이 필요하다 함)

lts 버전의 이미지를 받아서 사용한거라서 이미지 빌드는 불가... 다행히 설정 파일을 host 에 마운트 해둬서 최신 lts 버전으로 이미지를 교체하거나, blue ocean 사용 가능한 이미지를 빌드하는 방법으로 해결

### 참고
- [Docker Jenkins 설치 가이드](https://www.jenkins.io/doc/book/installing/docker/#downloading-and-running-jenkins-in-docker)

## gitlab runner 컨테이너가 실행중인데도, gitlab job 이 무한 pending 되는 현상
- untagged job 을 가져가지 않고 있어서 발생한 문제
- 러너 옵션에서 설정 하면 됨
- [해결 방법 참고](https://jmholly.tistory.com/entry/GitLab-CICD-This-job-is-stuck-because-the-project-doesnt-have-any-runners-online-assigned-to-it-에러-해결방법)

## 10.10.35.62 에서 공식 레지스트리에서 이미지 pull 이 되지 않는 상황

## gitlab CI/CD 가 간헐적으로 실패하고 There has been a runner system failure 로그가 나오는 현상
- [Stack Overflow 참고](https://stackoverflow.com/questions/61939202/gitlab-there-has-been-a-runner-system-failure)
- 러너 환경의 disk 가 가득차서 문제가 발생함

```bash
du -h --max-depth=1 /
du -h --max-depth=1

# 위 명령어로 용량이 큰 폴더를 하나씩 찾아가서
# 특정 컨테이너의 로그 파일이 110g 를 차지하고 있는것을 확인함
# 이후 truncate 명령으로 로그를 삭제
```

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-1532298*
