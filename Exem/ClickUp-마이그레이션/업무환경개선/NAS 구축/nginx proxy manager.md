# 🔯 nginx proxy manager

- 계정: fe1@ex-em.com / exem1234!!

## 도입 배경
- k8s 에는 ingress-nginx 와 cert-manager 를 이용해서 DNS 를 이용한 도메인으로의 접근이 가능하고 https 이용이 가능하지만, NAS 와 62번 리눅스에서 실행하는 서비스들은 ip:port 형태로 공개해서 이용하고 있던 상황
- ingress-nginx 같은 reverse proxy 를 이용하면 http 로 서비스중인 application 도 https 를 통한 접근이 가능하도록 변경이 가능하고 도메인 설정으로 실제 서버를 숨길 수 있음
- GUI로 쉽게 설정이 가능한 nginx proxy manager 가 NAS 에 application 으로 배포 가능해서 설치 및 활용

## 설정 방법

### 1. trueNAS 의 web UI 포트를 8080, 10443 으로 변경

### 2. trueNAS 의 web UI 에서 npm proxy manager 를 설치 ( 80, 443 포트 할당 )

### 3. proxy 하고 싶은 서비스들을 proxy 호스트로 추가하고 fe1exem.xyz 의 하위 도메인에 추가

### 4. nginx-proxy-manager 를 이용해 할당된 도메인은 10.20.141.40 으로 요청이 가도록 cloudflare 의 DNS record 등록

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3052938*
