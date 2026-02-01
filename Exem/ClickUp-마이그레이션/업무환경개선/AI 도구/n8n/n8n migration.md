# n8n migration

- 서비스 URL: https://n8n.exem-fe1.com/

## 마이그레이션 배경
- k8s 의 안정성이 떨어져서, 클러스터가 다운되면 n8n 을 이용하지 못함
- 2.0 버전 출시로 버전업을 해야함
- exem-fe1.com 도메인으로 이전 해야함
- 멀티 실행이 되는 worker 기반의 n8n 과 같은 옵션으로 서비스 해야함

## 작업 내용
- 10.10.35.63 vm 에서 docker-compose 로 설치
  - https://github.com/n8n-io/n8n-hosting/tree/main/docker-compose/withPostgresAndWorker
  - host path 에 bind 되어, 이후 데이터 이전시 data 폴더를 통째로 복사 하면 됨.
  - docker-compose.yml 에 설정 값 및 버전이 명시되어 있으므로 업그레이드시 태그 버전을 올리고, 리스타트 하면 됨.

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3339638*
