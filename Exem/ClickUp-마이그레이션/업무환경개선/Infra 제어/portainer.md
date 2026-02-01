# 🚢 portainer

- 서비스 URL: https://portainer.fe1exem.xyz/
- 계정: fe1 / exem1234!@#$

## 도입 배경
- Portainer는 컨테이너 관리 플랫폼으로, Docker, Docker Swarm, Kubernetes 같은 컨테이너 오케스트레이션 환경을 웹 기반 UI로 쉽게 관리할 수 있게 해주는 툴입니다.
- 복잡한 CLI 명령어를 몰라도 GUI를 통해 컨테이너, 이미지, 볼륨, 네트워크, 스택 등을 직관적으로 제어할 수 있습니다.
- 사용하지 않는 리소스 정리 및 상태 확인이 편리하고 트러블 슈팅을 위한 CLI 접근 까지 가능

## 연결 환경

### NAS
- portainer 가 구동중인 trueNAS 호스트의 docker 환경

### 10.10.35.62
- 리눅스 도커 환경으로 사용하던 VM

### k8s
- 10.10.35.65~10.10.35.68 로 구성한 클러스터
- portainer 데몬을 helm chart 를 이용한 gitops 방식으로 배포해야하는데, 아직 지원하지 않음
  - https://docs.portainer.io/admin/environments/add/kubernetes/agent

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3052878*
