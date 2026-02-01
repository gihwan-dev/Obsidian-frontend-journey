# Xen Orchestra

- 서비스 URL: https://xo.exem-fe1.com/

## 도입 배경
- windows 환경에서는 서버실 하이퍼바이저에 접근할 방법으로 xcp-ng 를 이용 할 수 있지만, xcp-ng 가 windows 만 지원해서 MAC 에서 VM 을 컨트롤 할 방법이 없음

## 문제 상황
- NAS down 이후 reboot 하면 xen-orchestra app 이 deploying 상태에서 멈춰있음
- log 를 확인해보면 redis port 가 사용중이라면서 무한 재부팅 되는 상황

### 해결 방법

```bash
sudo docker exec -it xen-orchestra sh -lc "redis-cli -h 127.0.0.1 -p 6379 shutdown nosave || kill 15"
```

NAS 에 ssh 로 접속해서 위 명령어로 내부 redis 를 재부팅 시키고 app 을 restart 하고 기다리면 해결은 됨

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3295518*
