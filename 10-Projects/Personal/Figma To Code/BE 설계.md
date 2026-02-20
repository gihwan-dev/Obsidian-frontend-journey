# [BE 설계 문서] Figma To Code 데스크톱 앱

## 1. 기술 스택 및 인프라

- **Runtime:** Node.js (Electron Main Process)
    
- **Local Server:** Vite (Dev Server API) - 생성된 코드의 실시간 HMR 및 빌드 담당
    
- **Agent Framework:** Claude Code / Figma Dev MCP 기반 커스텀 에이전트
    
- **Comparison Engine:** * **Visual:** `Pixelmatch` (픽셀 단위 비교)
    
    - **Structural:** `Cheerio` (DOM 파싱 및 정규화)
        
- **Database:** `Lowdb` (JSON 기반 로컬 데이터베이스, 프로젝트 및 히스토리 관리용)
    

---

## 2. 시스템 아키텍처 및 데이터 흐름

백엔드는 FE의 요청을 받아 Figma 데이터를 가져오고, AI에게 코드를 생성시킨 뒤, 그 결과물을 검증하는 파이프라인을 관리합니다.

### A. 프로젝트 시스템 (File System & Project Manager)

- **Workspace Sync:** 프로젝트 생성 시 로컬 디렉토리에 `tailwind.config.js`, `global.css`, `components/` 폴더를 물리적으로 생성합니다.
    
- **Configuration Watcher:** `chokidar` 라이브러리를 사용하여 사용자가 외부 에디터로 설정을 수정하더라도 BE가 이를 감지하고 에이전트의 컨텍스트를 갱신합니다.
    

### B. Figma Dev MCP Connector

- Figma API를 호출하여 대상 프레임의 전체 노드 트리(JSON)와 렌더링된 원본 이미지(PNG/SVG)를 획득합니다.
    
- **Node Normalizer:** Figma의 복잡한 노드 트리에서 스타일이 없는 단순 Group 노드들을 병합하거나 제거하여, FE 렌더링 결과와 비교하기 쉬운 형태의 **Common Intermediate Representation(CIR)**으로 변환합니다.
    

---

## 3. 투트랙 비교 엔진 (Two-track Comparison Engine)

이 앱의 핵심 로직입니다. 구조가 다른 Figma와 DOM 사이의 간극을 메웁니다.

### Track 1: 구조적 비교 (CIR-based Diff)

1. **DOM Flattening:** 렌더링된 HTML에서 시각적으로 유효한 요소(텍스트, 배경색, 테두리가 있는 요소)만 추출하여 평탄화된 리스트를 만듭니다.
    
2. **Geometry Mapping:** Figma 노드와 DOM 요소를 **절대 좌표(x, y)** 기준으로 매칭합니다.
    
3. **Style Score:** 매칭된 쌍(Pair) 사이의 스타일 속성(Padding, Gap, Font-size 등) 차이를 계산하여 점수화합니다.
    

### Track 2: 시각적 비교 (Visual Regression)

1. **Headless Screenshot:** 좌측 렌더링 패널을 `capturePage()` API로 스냅샷을 찍습니다.
    
2. **Diff Map Generation:** Figma 원본 이미지와 캡처본을 겹쳐 차이가 발생하는 픽셀 영역을 붉은색으로 강조한 이미지를 생성합니다.
    
3. **Feedback Synthesis:** 픽셀 차이가 큰 좌표 구역을 찾아내어, 해당 구역에 위치한 DOM 요소가 무엇인지 구조적 비교 결과와 결합합니다.
    

---

## 4. 에이전트 조율 (Agent Orchestration)

에이전트가 단순히 코드를 짜는 것에 그치지 않고, 비교 엔진의 결과를 보고 스스로 수정하게 만듭니다.

- **Prompt Engineering:** * 사용자의 Tailwind 설정을 `system_prompt`로 주입합니다.
    
    - 비교 엔진에서 나온 "오차 리스트"를 AI가 이해할 수 있는 텍스트 형태(예: "Button 1의 Padding-left가 디자인보다 4px 부족함")로 변환하여 전달합니다.
        
- **Reflexion Loop:** 일치 점수가 설정값(예: 95%) 미만일 경우, 에이전트가 코드를 다시 수정하도록 최대 3회까지 루프를 돌립니다.
    

---

## 5. API 및 통신 설계 (IPC)

Electron의 Main과 Renderer 프로세스 간 통신 규격입니다.

|**기능**|**채널명**|**설명**|
|---|---|---|
|**프로젝트 로드**|`project:load`|로컬 파일 시스템에서 설정 및 코드 불러오기|
|**Figma 데이터 조회**|`figma:get-frame`|Figma API를 통해 노드 및 이미지 가져오기|
|**코드 생성 및 실행**|`agent:run`|AI 에이전트 호출 및 샌드박스 반영|
|**비교 수행**|`compare:run`|투트랙 엔진 가동 및 결과(Score, Diff) 반환|
|**설정 업데이트**|`config:update`|Tailwind 설정 수정 및 파일 시스템 반영|

---

백엔드 설계까지 완료되면서 전체적인 시스템의 작동 원리가 정의되었습니다. 에이전트가 디자인과 코드 사이의 "차이"를 객관적인 수치로 인지하게 만드는 것이 이 설계의 핵심입니다.

이제 마지막으로 **에이전트(Agent) 설계 문서**를 만들어볼까요? 에이전트가 어떤 전략(Chain of Thought)으로 디자인 노드를 분석하고 코드를 생성할지 구체화해 보겠습니다.