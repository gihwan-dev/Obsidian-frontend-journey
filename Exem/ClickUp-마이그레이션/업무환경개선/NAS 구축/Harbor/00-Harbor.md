# ⚓ Harbor

[harbor.fe1exem.xyz](https://harbor.fe1exem.xyz/)

- 계정
  - admin / exem1234!!
  - fe1 / Exem1234!!

## 도입 배경
- nexus 는 docker image 저장 뿐 아니라 maven, gradle 등의 범용 아티팩트라 컨테이너 관련 아티펙트로 운영 하기엔 harbor 가 더 적절합니다
- 운영중인 nexus 는 관리 권한이 없어서 사용시 조심해야 할 부분들이 있고 특히 https 를 지원하지 않아 pull push 할때 추가 설정이 필요하기도 하며 http 제한이 걸린 곳에서는 이용이 불가능 하는 등등 사용에 불편합니다
- 현재 nexus 에 설정된 proxy 레지스트리가 없어서, 외부 이미지가 필요한 경우 hosted 레지스트리에 직접 push 해서 저장후 사용 해야 하는 불편함이 있었습니다
- 서버실 내부 네트워크에서 image pull 명령어를 실행하면 거부 당하는 경우가 있는데 분석해보니 특정 CDN 에서 network 주소를 기반으로 차단하고 있던 경우가 있었습니다.

## 활용 방법
- 이미지 저장소로 사용할 것인지, 외부 저장소 이미지를 프록시 (캐시) 할 것인지에 따라 프로젝트를 분리해서 생성
  - proxy 하려는 경우 proxy 하려는 레지스트리를 등록
  - docker hub (registry-1.docker.io) 와 gcr (google container registry) 는 등록해뒀음. 해당 레지스트리에서 이미지가 필요한 경우 harbor.fe1exem.xyz/hub, harbor.fe1exem.xyz/gcr 로 pull 받으면 proxy 되어 캐싱됨
- 저장소로 사용하려는 프로젝트는 생성된 프로젝트에 유저를 추가하고 해당 유저로 이미지를 pull / push
  (개인 용도가 아니라면 팀용 fe1 계정을 생성 후 할당 해뒀으니 fe1 계정 사용하셔도 됩니다)

## 설치 과정

1. NAS host 의 디스크 자원을 활용하면서 network 문제를 해결하기 위해서는 TrueNAS 를 설치한 host 에 harbor 를 설치해야 한다.

2. TrueNAS 에 app 으로 존재하지 않기 때문에 custom app 으로 설치를 해야하는데, [공식 문서](https://goharbor.io/docs/2.13.0/install-config/)의 설치 방법으로 docker-compose.yml 파일을 생성해서 Install via YAML 기능으로 설치하면 실패하므로, 공식 문서의 설치 방법을 그대로 따른다.

3. TrueNAS 의 Dataset 에 감지 되고 관리가 가능하게 하기 위해서 `pool1` 하위에 harbor 를 생성하고, 해당 dataset 내부에 모든 harbor 데이터를 저장 및 마운트 한다.

4. host 에서 shell 로 명령어를 실행하기 위해 ssh 를 켜고 포트를 설정

5. nas 가 설치된 host 에 ssh 로 접속해서 /mnt/pool1/harbor/install 폴더에 harbor installer 를 다운로드하고 압축 해제

6. harbor.yml.tmpl 파일을 harbor.yml 파일로 복사하고 code-server 로 수정
   - vi 로 수정해도 되지만, vim 모드인지 CLI 환경에서 수정이 어려워, nas에 code-server 를 app으로 설치후 harbor 폴더를 app 에 mount함
   - hostname, password, data_volume, external_url 등 접속 url port 설정과 mnt 설정 값을 변경함

7. `sudo ./install.sh --with-trivy` 실행

8. npm 으로 proxy 설정하고 domain 지정

9. 외부 레지스트리 추가

10. 사용자 계정 fe1 추가

11. 용도별 프로젝트 추가

12. 프로젝트별 멤버 할당

13. 가비지 컬렉션 설정 (매일 밤 11시 tag 없는 데이터 삭제)

14. kubernetes 환경에서 레지스트리 접근 허용을 위해 containerd 에 레지스트리 추가
    - kubespray 로 구축한 것이므로 containerd.yml 파일 수정
    - playbook 명령어로 수정된 항목 적용

## 문제 상황
- NAS down 이후 harbor 에 접속 할 수 없는 상태
  - 재부팅 이후 restart 가 되긴 하지만, nginx 가 restart 되며 비정상 상태가 유지됨
  - harbor 경로에 들어가서 `docker compose down` 이후 `docker compose up -d` 명령을 직접 실행 하면 문제 없이 재부팅 됨

## 하위 문서
- [[10.10.35.62 linux 에 설치했던 harbor]]

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3104738*
