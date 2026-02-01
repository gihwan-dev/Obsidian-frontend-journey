# 🌐 Chrome Devtools MCP

**레포:** [GitHub - ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp/?tab=readme-ov-file#chrome-devtools-mcp)

## 지원 도구

### 입력 도구
- `click`, `drag`, `fill`, `fill_form`, `handle_dialog`, `hover`, `upload_file`

### 네비게이션 도구
- `close_page`, `list_pages`, `navigate_page`, `navigate_page_history`, `new_page`, `select_page`, `wait_for`

### 측정 도구
- `emulate_cpu`, `emulate_network`, `resize_page`

### 성능 측정 도구
- `performance_analyze_insight`, `performance_start_trace`, `performance_stop_trace`

### 네트워크 요청 측정 도구
- `get_network_request`, `list_network_requests`

### 디버깅 도구
- `evaluate_script`, `list_console_messages`, `take_screenshot`, `take_snapshot`

## 설치 방법

### Claude Code
```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

### Cursor
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### Codex CLI
```bash
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3131298*
