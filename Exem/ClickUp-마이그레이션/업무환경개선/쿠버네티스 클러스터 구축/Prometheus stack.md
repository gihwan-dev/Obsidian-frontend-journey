# 🔥 Prometheus stack (사용 중지)

- Prometheus Stack은 모니터링·알림·시각화를 하나로 묶은 오픈소스 관측 플랫폼 세트를 말하며, 단순히 Prometheus 서버만 쓰는 것이 아니라 관련 도구들을 함께 구성해 통합 모니터링 환경 구성
- Kubernetes 환경에서 애플리케이션/인프라/네트워크/서비스 헬스까지 통합적으로 모니터링

## 동작 흐름
1. Exporter들이 /metrics로 메트릭 노출
2. Prometheus가 주기적으로 scrape
3. Prometheus가 데이터 저장 (TSDB)
4. Alert Rules 평가 → Alertmanager로 전달
5. Alertmanager가 알림 전송
6. Grafana가 Prometheus API를 통해 데이터 시각화

## 접속 정보
- [Alert manager](https://alertmanager.fe1exem.xyz/)
- [Grafana](https://grafana.fe1exem.xyz/) - admin / exem1234!!
- [Prometheus](https://prometheus.fe1exem.xyz/)

## 사용 중단
- k8s 디스크 용량을 너무 많이 먹어 에러 탐지 및 사후 분석을 위해 도입한 모니터링 도구가 에러가 발생하면 k8s 전체가 다운되므로 어차피 이용 할수가 없어서 배보다 배꼽이 커진 상황이 되버림
- 모니터링 도구는 k8s외부로 옮기기로 결정

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3038078*
