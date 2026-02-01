# 🐵 Jenkins (10.10.35.63)

- https://jenkins.exem-fe1.com/
- 10.10.35.63 Rocky VM 에 docker compose 로 구동중.
  - legacy (10.10.35.62) 에서 사용하던 데이터를 옮겨서 그대로 활용
  - domain 이 fe1exem.xyz > exem-fe1.com 으로 변경되었고, java version 업데이트로 jenkins 버전 업데이트가 가능해짐

![](https://t25540965.p.clickup-attachments.com/t25540965/c2265454-ab76-4f76-8f99-b9c173a56311/image.png)

## 마이그레이션 작업 내용

### 1. 공식문서의 설명대로 Dockerfile 생성

```dockerfile
FROM jenkins/jenkins:2.528.3-jdk21
USER root
RUN apt-get update && apt-get install -y lsb-release ca-certificates curl && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && apt-get install -y docker-ce-cli && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
USER jenkins
    RUN jenkins-plugin-cli --plugins "blueocean docker-workflow json-path-api"
```

### 2. docker compose 를 활용하기 위한 docker-compose.yml 파일 생성

```yaml
services:
  # 1. Docker 데몬 서비스 (DinD)
  jenkins-docker:
    image: docker:dind
    container_name: jenkins-docker
    privileged: true
    networks:
      jenkins:
        aliases:
          - docker
    environment:
      - DOCKER_TLS_CERTDIR=/certs
    volumes:
      - jenkins-docker-certs:/certs/client
      - jenkins-data:/var/jenkins_home
    ports:
      - "2376:2376"
    command: --storage-driver overlay2
  # 2. Jenkins 컨트롤러 서비스
  jenkins-blueocean:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: jenkins-blueocean
    restart: on-failure
    networks:
      - jenkins
    environment:
      - DOCKER_HOST=tcp://docker:2376
      - DOCKER_CERT_PATH=/certs/client
      - DOCKER_TLS_VERIFY=1
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins-data:/var/jenkins_home
      - jenkins-docker-certs:/certs/client:ro
networks:
  jenkins:
    driver: bridge
volumes:
  jenkins-docker-certs:
  jenkins-data:
    driver: local
    driver_opts:
      type: none
      o: bind
          device: /home/fe1/jenkins/jenkins_home
```

### 3~6. 데이터 복사 및 설정

3. 62번에 저장된 jenkins 데이터를 63 번으로 복사
   - `rsync -avz -e "ssh -p 53261" dpm-fe@10.10.35.62:/jenkins/ /home/fe1/jenkins/jenkins_home/`

4. Docker 컨테이너 내부의 Jenkins 유저(UID 1000)가 파일을 읽고 쓸 수 있도록 권한 설정
   - `sudo chown -R 1000:1000 /home/fe1/jenkins/jenkins_home`

5. domain 변경 및 keycloak client 등록

6. 복제된 jenkins 내부 credential 정합성 확인 및 기존 pipeline 웹훅 변경
   - k8s credential 업데이트
   - `kubectl --kubeconfig=/User/nakyup/.kube/company-config.yaml create token jenkins-agent -n jenkins-agent --duration=87600h`

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3345358*
