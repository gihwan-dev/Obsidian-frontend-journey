# longhorn

- open web ui 를 차트로 추가하였으나 argocd 에서 확인하면 PVC 가 생성되지 않는 다는 오류가 발생함
- K8s 에서 데이터를 영구 저장하기 위해 PV 가 필요한데, PV 를 생성 요청 하는 것이 pvc
- k8s 에 pv 를 생성하지 않았기 때문에 pvc 를 생성할수 없어 오류가 발생했었고, pv 관리 도구인 longhorn 을 차트로 추가함
- longhorn 은 node 내부 storage 를 pv 로 할당해서 리소스로 할당해주는 도구이며, web ui 가 있어 확인 및 관리가 편함
- ~~백업 도구를 추가해서 내부 pv를 영구 저장할 방법을 찾아야함~~ > velero 도입 완료

- 자체 로그인 기능이 없어서 Oauth2-Proxy 를 인증 서버로 로그인 기능을 추가함

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-2838618*
