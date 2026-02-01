# 🔎 Serena

코드 탐색에 도움이 되는 MCP 입니다. 심볼 단위로 코드 검색이 가능해서 토큰 절약이나 코드 파악에 도움이 됩니다.

## 레포
- [GitHub - oraios/serena](https://github.com/oraios/serena?tab=readme-ov-file#claude-code)

## 1. UV 설치 (필수)

### Windows
```powershell
irm https://astral.sh/uv/install.ps1 | iex
uv --version
```

### macOS / Linux
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv --version
```

## 2. Claude Code 설정

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/your/project

# Serena MCP 서버 추가
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project $(pwd)
```

## 3. Cursor IDE 설정

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant"
      ]
    }
  }
}
```

## 4. Claude Desktop 설정

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server"
      ]
    }
  }
}
```

## 프로젝트 활성화 및 사용

```
Activate the project /absolute/path/to/my-project
```

### 대형 프로젝트 인덱싱 (권장)
```bash
uvx --from git+https://github.com/oraios/serena serena project index
```

## 추가 리소스
- [Serena GitHub](https://github.com/oraios/serena)
- [UV 공식 문서](https://docs.astral.sh/uv/)
- [MCP 프로토콜 문서](https://modelcontextprotocol.io/)

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3090018*
