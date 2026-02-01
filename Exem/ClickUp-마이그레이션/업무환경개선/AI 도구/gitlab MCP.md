# 🦊 gitlab MCP

## 설정 방법

### 1. Gitlab Access Token 발급
gitlab > edit profile > access tokens 발급해서 아래 access token 에 입력

### 2. MCP 설정
```json
{
  "mcpServers": {
    "GitLab communication server": {
      "command": "npx",
      "args": [
        "-y",
        "@zereight/mcp-gitlab"
      ],
      "env": {
        "GITLAB_PERSONAL_ACCESS_TOKEN": "glpat-xxxxxxxxxxxxxxx",
        "GITLAB_API_URL": "http://gitlab.exem.xyz/api/v4",
        "GITLAB_READ_ONLY_MODE": "true"
      }
    }
  }
}
```

### 3. cursor settings > MCP tools 에 등록
- read only 가 아닌경우 토큰 권한에 write api 권한도 줘야함

### 4. enable 된것 확인

## 사용 방법
- agent mode 로 질문할 때 gitlab link 제공시 해당 link 에 cursor 가 mcp 로 gitlab 데이터를 활용해서 답변하고 comment 도 남기게 할수 있음
- Auto run enable 시 mcp 도구 사용을 승인 하지 않아도 됨

### 예시
- http://gitlab.exem.xyz/fe1/MaxGauge-VI/-/merge_requests/553

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-2714018*
