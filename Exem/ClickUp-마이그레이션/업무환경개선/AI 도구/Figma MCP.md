# 🐽 Figma MCP

## 설정 방법

### 1. Figma Access Token 발급
figma > settings > security > access token 발급해서 아래 api key 에 입력

### 2. MCP 설정
```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=figd_xxxxxxxxxxxxxxxxxxxxxxxxx",
        "--stdio"
      ]
    }
  }
}
```

### 3. cursor settings > MCP tools 에 등록

### 4. enable 된것 확인

## 사용 방법
- agent mode 로 질문할 때 figma link 제공시 해당 link 에 cursor 가 mcp 로 피그마 데이터를 활용해서 답변함
- Auto run enable 시 mcp 도구 사용을 승인 하지 않아도 됨

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-2713898*
