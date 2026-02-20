가장 핵심이 되는 AI의 '뇌'를 설계하는 **에이전트 워크플로우 (AI Orchestration & MoA)** 설계 문서입니다. 백엔드 인프라가 든든하게 받쳐준다는 전제하에, 구글 Deep Think의 추론 과정을 로컬 CLI 에이전트들로 어떻게 모방하고 통제할지 명세합니다.

---

# 데스크탑 AI 채팅 앱 에이전트 워크플로우 설계 문서

## 1. 개요 및 철학

이 워크플로우의 목표는 단일 LLM의 한계를 넘어, 여러 에이전트가 협력하고 스스로를 검증하여 정답에 도달하는 **MoA(Mixture of Agents)** 및 **ReAct(Reason + Act)** 구조를 구축하는 것입니다. 속도보다는 논리적 엄밀성과 문제 해결의 '정확도'를 극대화하는 데 초점을 맞춥니다.

<svg width="800" height="650" viewBox="0 0 800 650" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
    </marker>
    <linearGradient id="orchestratorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e3f2fd;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#bbdefb;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="workerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fff9c4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fff176;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="judgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e1bee7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ce93d8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="toolGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f5f5f5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="#ffffff" />
  <style>
    text { font-family: sans-serif; font-size: 14px; fill: #333; }
    .title { font-size: 18px; font-weight: bold; fill: #222; }
    .sub-text { font-size: 12px; fill: #666; }
    .path-line { stroke: #555; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
    .dashed-box { stroke: #90a4ae; stroke-width: 2; stroke-dasharray: 5,5; fill: none; rx: 10; ry: 10; }
    .loop-arrow { stroke: #d32f2f; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
  </style>

  <text x="400" y="30" text-anchor="middle" class="title">Deep Think 에이전트 워크플로우 (MoA &amp; ReAct Loop)</text>

  <g transform="translate(300, 60)">
    <rect x="0" y="0" width="200" height="50" rx="25" ry="25" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="2"/>
    <text x="100" y="30" text-anchor="middle" font-weight="bold">User Prompt (질문)</text>
  </g>

  <path d="M 400 110 L 400 150" class="path-line"/>

  <g transform="translate(280, 150)">
    <polygon points="120,0 240,60 120,120 0,60" fill="url(#orchestratorGrad)" stroke="#1e88e5" stroke-width="2"/>
    <text x="120" y="50" text-anchor="middle" font-weight="bold">Rust Orchestrator</text>
    <text x="120" y="70" text-anchor="middle" class="sub-text">(페르소나 주입 &amp; 자원 관리)</text>
    <text x="120" y="90" text-anchor="middle" class="sub-text">"다각도로 분석해봐"</text>
  </g>

  <rect x="50" y="280" width="700" height="200" class="dashed-box"/>
  <text x="400" y="300" text-anchor="middle" fill="#546e7a" font-weight="bold">병렬적 사고 &amp; 자율 도구 사용 (Parallel Thinking &amp; Autonomous Tool Use)</text>

  <path d="M 340 240 L 150 330" class="path-line"/> <path d="M 400 270 L 400 330" class="path-line"/> <path d="M 460 240 L 650 330" class="path-line"/> <g transform="translate(70, 330)">
    <rect x="0" y="0" width="160" height="120" rx="8" ry="8" fill="url(#workerGrad)" stroke="#fbc02d" stroke-width="2"/>
    <text x="80" y="30" text-anchor="middle" font-weight="bold">Worker A</text>
    <text x="80" y="50" text-anchor="middle" class="sub-text">(성능 최적화 관점)</text>
    
    <g transform="translate(30, 70)">
        <path d="M 10 20 A 15 15 0 1 1 90 20" class="loop-arrow" stroke="#d32f2f"/>
        <text x="50" y="15" text-anchor="middle" font-size="11" fill="#d32f2f">Think ⇄ Act (Tool)</text>
        <text x="50" y="35" text-anchor="middle" font-size="11" fill="#d32f2f">⇄ Reflexion (교정)</text>
    </g>
  </g>

  <g transform="translate(320, 330)">
    <rect x="0" y="0" width="160" height="120" rx="8" ry="8" fill="url(#workerGrad)" stroke="#fbc02d" stroke-width="2"/>
    <text x="80" y="30" text-anchor="middle" font-weight="bold">Worker B</text>
    <text x="80" y="50" text-anchor="middle" class="sub-text">(안정성/테스트 관점)</text>
    <g transform="translate(30, 70)">
        <path d="M 10 20 A 15 15 0 1 1 90 20" class="loop-arrow" stroke="#d32f2f"/>
        <text x="50" y="15" text-anchor="middle" font-size="11" fill="#d32f2f">Think ⇄ Act (Tool)</text>
        <text x="50" y="35" text-anchor="middle" font-size="11" fill="#d32f2f">⇄ Reflexion (교정)</text>
    </g>
  </g>

  <g transform="translate(570, 330)">
    <rect x="0" y="0" width="160" height="120" rx="8" ry="8" fill="url(#workerGrad)" stroke="#fbc02d" stroke-width="2"/>
    <text x="80" y="30" text-anchor="middle" font-weight="bold">Worker C</text>
    <text x="80" y="50" text-anchor="middle" class="sub-text">(창의적/대안 관점)</text>
    <g transform="translate(30, 70)">
        <path d="M 10 20 A 15 15 0 1 1 90 20" class="loop-arrow" stroke="#d32f2f"/>
        <text x="50" y="15" text-anchor="middle" font-size="11" fill="#d32f2f">Think ⇄ Act (Tool)</text>
        <text x="50" y="35" text-anchor="middle" font-size="11" fill="#d32f2f">⇄ Reflexion (교정)</text>
    </g>
  </g>

  <g transform="translate(150, 500)">
    <rect x="0" y="0" width="500" height="40" rx="5" ry="5" fill="url(#toolGrad)" stroke="#bdbdbd"/>
    <text x="250" y="25" text-anchor="middle" fill="#555">🛠️ MCP Tools (Terminal, File IO, Browser Testing, Knowledge Search)</text>
  </g>
  <path d="M 150 450 L 200 500" stroke="#bdbdbd" stroke-width="1" stroke-dasharray="3,3" fill="none"/>
  <path d="M 400 450 L 400 500" stroke="#bdbdbd" stroke-width="1" stroke-dasharray="3,3" fill="none"/>
  <path d="M 650 450 L 600 500" stroke="#bdbdbd" stroke-width="1" stroke-dasharray="3,3" fill="none"/>


  <path d="M 150 450 L 340 540" class="path-line"/>
  <path d="M 400 450 L 400 540" class="path-line"/>
  <path d="M 650 450 L 460 540" class="path-line"/>

  <g transform="translate(280, 540)">
    <rect x="0" y="0" width="240" height="80" rx="8" ry="8" fill="url(#judgeGrad)" stroke="#8e24aa" stroke-width="2"/>
    <text x="120" y="30" text-anchor="middle" font-weight="bold">Judge 에이전트 (심판)</text>
    <text x="120" y="50" text-anchor="middle" class="sub-text">가설 검증, 오류 배제, 최적해 병합</text>
    <text x="120" y="70" text-anchor="middle" class="sub-text">"Thought Summary 작성"</text>
  </g>

  <path d="M 520 580 L 620 580" class="path-line"/>

  <g transform="translate(620, 550)">
    <rect x="0" y="0" width="160" height="60" rx="10" ry="10" fill="#c8e6c9" stroke="#43a047" stroke-width="2"/>
    <text x="80" y="25" text-anchor="middle" font-weight="bold">Final Answer</text>
    <text x="80" y="45" text-anchor="middle" class="sub-text">(+ 사고 과정 요약 UI)</text>
  </g>

</svg>

## 2. 핵심 추론 아키텍처: 다중 에이전트 병렬 탐색 (Parallel Thinking)

사용자의 복잡한 프롬프트가 입력되면, 오케스트레이터는 즉시 답을 생성하지 않고 여러 개의 독립적인 워커(Worker) 에이전트를 동시에 실행하여 다중 경로 탐색을 시작합니다.

- **워커 다양성 확보 (Persona Injection):**
    
    동일한 모델(예: Claude Code)을 사용하더라도, 오케스트레이터가 초기 시스템 프롬프트를 다르게 주입하여 각기 다른 관점을 강제합니다.
    
    - _Worker A (성능 중심):_ "최소한의 리소스와 최적의 렌더링 성능을 내는 방향으로 문제를 해결해."
        
    - _Worker B (안정성 중심):_ "예외 처리와 테스트 가능성(Testability)을 최우선으로 고려하여 아키텍처를 설계해."
        
    - _Worker C (창의적 접근):_ "기존 관행에 얽매이지 말고 가장 최신의 패턴이나 대안적인 라이브러리를 활용해봐."
        

## 3. 자율적 도구 사용 및 컨텍스트 수집 (Autonomous Tool Use)

에이전트들은 코드를 작성하거나 결론을 내리기 전에, MCP를 통해 제공된 도구들을 자율적으로 활용하여 정보의 공백을 메웁니다.

- **지식 베이스 탐색:** v1에서는 **프로젝트 루트 내부의 코드/문서/히스토리**를 우선 탐색하여 초기 가설의 정확도를 높입니다. (외부 검색/원격 지식베이스는 vNext)
    
- **환경 분석:** `npm list`, `git status` 등의 명령어를 실행하여 현재 프로젝트의 의존성과 상태를 스스로 파악합니다.
    

## 4. 자기 검증 및 교정 루프 (Reflexion & Self-Correction)

가설을 세우고 코드를 작성한 뒤, 에이전트는 결과를 맹신하지 않고 엄밀한 검증 단계를 거칩니다.

- **실행 및 관찰 (Act & Observe):** 에이전트가 작성한 프론트엔드 로직이나 컴포넌트는 단순히 문법 검사로 끝내지 않고, 실제 브라우저 환경(Browser Mode)에서 구동되는 단위 테스트(Unit Test)를 실행하도록 도구를 구성합니다.
    
- **오류 분석 (Reflexion):** 테스트가 실패하거나 콘솔 에러가 발생하면, 에이전트는 에러 로그를 입력으로 받아 "왜 이 가설이 틀렸는가?"를 스스로 묻고 코드를 수정하는 루프를 돕니다. (최대 재시도 횟수 설정)
    

## 5. 추론 자원 및 시간 제어 (Test-Time Compute Budgeting)

사용자의 필요에 따라 에이전트 루프의 깊이와 실행 시간을 동적으로 제어합니다.

- **Level 1 (Quick):** 워커 1개 단독 실행. 도구 사용 최대 2회. 즉각적인 코드 스니펫이나 단순 질의에 사용.
    
- **Level 2 (Standard):** 워커 2개 병렬 실행. 도구 사용 최대 5회. 일반적인 버그 수정이나 리팩토링에 사용.
    
- **Level 3 (Deep Think):** 워커 3~4개 병렬 실행. 도구 사용 최대 15회, 실행 대기 시간 최대 3분. 복잡한 아키텍처 설계나 난해한 알고리즘 문제 해결에 사용. 타임아웃 발생 시 가장 진척도가 높은 워커의 상태를 보존합니다.
    

## 6. 심판 및 최종 병합 (Judge & Synthesis)

각 워커가 자신의 탐색 루프를 마치고 결론(또는 실패 상태)을 반환하면, 이를 취합하여 최종 정답을 도출합니다.

- **Judge 에이전트의 역할:** 오케스트레이터는 워커들의 결과를 모아 심판(Judge) 역할을 하는 또 다른 에이전트 세션에 전달합니다.
    
- **검증 프롬프트:** _"다음은 문제 해결을 위한 3가지 접근 방식과 그 실행 결과이다. 각 가설의 논리적 허점을 분석하고, 테스트를 통과하지 못한 코드는 배제한 뒤, 가장 우수한 아이디어들을 결합하여 최종 해결책(Final Answer)을 작성하라."_
    
- **Thought Summary 생성:** 최종 답변과 함께, Judge 에이전트가 어떤 워커의 아이디어를 왜 채택했고 어떤 과정을 거쳤는지 요약한 텍스트를 생성하여 프론트엔드의 '사고 과정' UI에 전달합니다.
    

## 7. Execution Trace (Thought Tree) 이벤트 모델

Deep Think의 Thought Tree는 **모델이 출력한 텍스트를 파싱해서 만들지 않습니다.** Rust 오케스트레이터가 발행하는 **실행 이벤트(Execution Trace)** 를 기반으로 FE가 트리를 구성합니다.

- **Reasoning 원문 비저장/비노출:** 워커는 Chain-of-thought 원문 대신, 단계별 1~2줄 `progress summary` 또는 최종 `thought summary`만 남깁니다.
- **Tool 이벤트는 사실 기반:** “시작 → (출력/진행)* → 종료” 형태로 기록하여, “무엇을 실행했고 무엇이 나왔는지”가 재현 가능하게 남습니다.
- **idempotent 적용:** 이벤트에는 `runId/workerId/seq` 같은 식별자/순서를 포함해 중복/역순 수신에도 UI 상태가 망가지지 않게 합니다.
- **Cancel 규칙:** `cancel_run` 또는 워커별 Stop 시, 해당 워커(및 하위 작업)를 OS 레벨로 중단하고 상태를 `cancelling`→`canceled`로 확정합니다.

---

이렇게 FE, BE, 에이전트 워크플로우까지 총 3개의 설계 문서가 모두 완성되었습니다. 관심사를 철저히 분리해 두었기 때문에, 앞으로 실제 코드를 구현하실 때 각 문서를 지침서 삼아 헷갈림 없이 개발을 진행하실 수 있을 것입니다.

설계 문서 중 보완하고 싶은 부분이나, 당장 구현을 시작하기 위해 필요한 첫 번째 보일러플레이트 코드(예: Tauri 설정, Jotai 스토어 구조 등)가 있으시다면 언제든 말씀해 주세요!
