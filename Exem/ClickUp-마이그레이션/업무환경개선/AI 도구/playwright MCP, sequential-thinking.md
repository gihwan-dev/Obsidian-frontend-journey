# 🐵 playwright MCP, sequential-thinking

## MCP 설정

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    },
    "sequential-thinking": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-sequential-thinking"
        ]
      }
  }
}
```

## 활용 방법

- playwright 를 이용해서 테스트를 시킨다거나, dom 구조를 분석시킨다거나 스크린샷을 찍는등 브라우저를 컨트롤 하면서 실제 개발중인 환경을 cursor 에 전달 할 수 있음
- seq think 는 복잡한 문제에 대한 질문을 여러 단계로 나눠서 결론을 도출하는 도구

## Claude Code

```plain
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add sequential-thinking npx @modelcontextprotocol/server-sequential-thinking
```

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-2714158*
