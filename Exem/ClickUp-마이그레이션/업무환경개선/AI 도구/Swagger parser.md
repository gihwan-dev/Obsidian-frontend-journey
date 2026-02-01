# 🐙 Swagger parser

## 레포
- [gitlab.exem.xyz - open-api-parser-mcp](http://gitlab.exem.xyz/fe1/open-api-parser-mcp)

Swagger/OpenAPI JSON 파일을 파싱하여 API 정보를 분석하는 MCP 서버입니다. Claude와 함께 사용하여 API 문서를 쉽게 분석하고 이해할 수 있습니다.

## 주요 기능
- ✅ 원하는 컨트롤러에 대한 path 리스트 조회
- ✅ JSON에서 컨트롤러(태그) 리스트 추출
- ✅ Path에 대한 parameters, requestBody, responseBody 정보 및 스키마 조회
- ✅ $ref로 참조된 스키마의 실제 타입 정보 제공 (자동 해결)

## 설치 및 사용법

### 방법 1: npx 등록 (권장)

```json
{
  "mcpServers": {
    "swagger-parser": {
      "command": "npx",
      "args": ["-y","swagger-parser-mcp-server"]
    }
  }
}
```

**Claude Code CLI 사용시:**
```bash
claude mcp add swagger-parser -- npx -y swagger-parser-mcp-server
```

### 방법 2: 소스코드 직접 사용

```bash
git clone http://gitlab.exem.xyz/fe1/open-api-parser-mcp.git
cd swagger-parser-mcp-server
npm install
npm run build
```

```json
{
  "mcpServers": {
    "swagger-parser": {
      "command": "node",
      "args": ["<프로젝트 절대경로>/dist/index.js"]
    }
  }
}
```

## 사용 예시

⚠️ JSON 형태 스웨거를 반환하는 URL을 줘야합니다.

```
# Swagger JSON 로드
이 API 문서를 분석해줘: https://petstore.swagger.io/v2/swagger.json

# 컨트롤러 목록 보기
어떤 컨트롤러들이 있는지 보여줘

# 특정 컨트롤러의 API 목록
pet 컨트롤러의 모든 API를 보여줘

# API 상세 정보
GET /pet/{petId} API의 파라미터와 응답 스키마를 자세히 보여줘
```

## 지원하는 OpenAPI 버전
- ✅ Swagger 2.0
- ✅ OpenAPI 3.0.x

---
*ClickUp 원본: https://app.clickup.com/25540965/docs/rbeb5-443818/rbeb5-3090238*
