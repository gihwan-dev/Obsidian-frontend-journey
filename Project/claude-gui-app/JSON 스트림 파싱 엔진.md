# JSON 스트림 파싱 엔진

#claude-gui-app #단기 #CLI연동 #파싱

## 요약
Claude Code CLI의 `stream-json` 출력을 실시간으로 파싱하여 타입별 이벤트 객체로 변환하는 엔진을 구현한다.

## 왜?
- CLI의 JSON 스트림은 다양한 이벤트 타입(assistant message, tool call, result, error 등)을 포함
- 각 이벤트를 정확히 파싱해야 GUI에서 적절한 UI 업데이트가 가능
- 무한 루프, 워크플로우 등 고급 기능에서 이벤트 파싱은 자동 판단의 핵심 입력

## 어떻게?
1. `serde` + `serde_json`으로 이벤트 타입 enum 정의 (Rust)
2. 주요 이벤트 구조:
   - `AssistantMessage { content, stop_reason }`
   - `ToolUse { name, input }`
   - `ToolResult { output, is_error }`
   - `SystemEvent { type, message }`
3. 스트림 버퍼링: 줄 단위 또는 JSON 객체 단위로 분리
4. 파싱 실패 시 graceful fallback (원시 텍스트 표시)
5. Tauri event로 프론트엔드에 타입별 이벤트 push
6. TypeScript 측 인터페이스 정의 (`types/claude-events.ts`)

## 예상 효과
- 모든 Claude Code 동작을 구조적으로 이해·표시 가능
- 도구 호출, 에러, 결과 등을 UI에서 구분하여 시각화
- 워크플로우 조건 노드에서 이벤트 기반 분기 처리 가능

## 작업 로그

