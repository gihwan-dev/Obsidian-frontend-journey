# 🔑 Keycloak

![](https://t25540965.p.clickup-attachments.com/t25540965/683daf7f-529b-430a-980a-b3ebc5c2ac11/image.png)
![](https://t25540965.p.clickup-attachments.com/t25540965/72a7a453-f571-4719-8ead-aec4ba1e4882/image.png)

- URL: https://keycloak.fe1exem.xyz/

## 계정
- **admin 계정**: administrator / ExEm1234!!
- **DB-Dev 렐름 사용자 계정** (초기 비밀번호 1)

## 도입 배경
- 팀내 서비스가 많아지는데, 공통 계정을 이용하고 ID/PW 를 공유해서 사용하다보니 권한 관리를 할수 없음.
- 각자의 아이디를 만들어서 알려주는 방식으로 하려니 서비스마다 아이디를 10개씩 만들어야하고, 관리가 어려움

## 활용 방법
- SSO 기능을 제공하는 서비스마다 keycloak 을 이용한 로그인 방법을 추가
- keycloak 에 생성한 ID / PW 로 로그인해서 각 서비스를 이용
  - keycloak 에 생성한 ID / PW 를 모든 서비스에서 공통으로 사용 할 수 있다 (완료)

## 작업 내용
1. Keycloak 을 k8s에 배포
2. Keycloak 에 서비스 및 유저 등록
   - `DB-Dev` 렐름을 생성
   - `FE1` 그룹을 생성하고, 팀원들의 계정을 모두 등록
   - `FE1` 그룹에 `DB-Dev` 렐름의 디폴트 role 을 부여해서 모든 유저가 모든 서비스에 접근 가능하도록 설정
3. `DB-Dev` 렐름에 클라이언트들을 등록 (팀내 서비스들을 OIDC 로 등록)
   - portainer (CE RBAC 기능이 막혀있어서 로그인은 가능하지만 admin 권한은 없음)
   - jenkins
   - harbor
   - open webui
   - grafana
   - longhorn, prometheus, alert-manager (OAuth2-proxy 를 통해 로그인 기능 구현)
   - minio (작업중)
   - ArgoCD (작업중)
   - n8n (작업중)

## 참고
- [OAuth 일러스트 가이드](https://www.ducktyped.org/p/an-illustrated-guide-to-oauth)

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3108078*
