# 🏦 MinIO

- 계정: admin / exem1234!!

## 도입 배경
- k8s 에서 실행중인 gitlab-runner 에 replicas 설정으로 10개의 pod 로 독립된 실행 환경을 갖고 있어서 CI/CD 파이프라인에서 캐시 전략을 사용하기 어려웠음
  - S3 프로토콜을 만족하는 오브젝트 스토리지가 있으면 [분산 캐시](https://docs.gitlab.com/runner/configuration/autoscale/#distributed-runners-caching) 스토리지로 등록해서 각 러너가 공유된 캐시 스토리지로 활용이 가능함
- k8s 에 PV 관리를 위해 도입한 [[longhorn]] 에 백업 타겟 설정이 필요함.
  - 현재 PV는 longhorn 이 생성 및 관리를 하지만 백업은 되지 않고 있는 상황.
  - 백업 저장소로 NFS 나 S3 를 이용할 수 있음
- MinIO 는 AWS S3 대신 셀프 호스팅 해서 사용할 수 있는 S3 호환 오브젝트 스토리지 서비스

## 활용 방법

### 이미지 저장소로 사용할 것인지, 외부 저장소 이미지를 프록시 (캐시) 할 것인지에 따라 프로젝트를 분리해서 생성

1. 연동할 application 에서 사용할 bucket 을 MinIO 에 생성
2. MinIO 에 접근하려면 access token 이 필요한데, [minio-console](https://minio-console.fe1exem.xyz/access-keys) 에 들어가서 토큰을 생성
3. 사용하려는 application 에 minio-api.fe1exem.xyz 도메인을 주소로 넣고, 위에서 생성한 access token 을 이용해 연동
4. bucket 별로 lifecycle 설정이 가능한데, 보관 기간을 설정 가능함

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3053398*
