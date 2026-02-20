# [FE 설계 문서] Figma To Code 데스크톱 앱 (v2)

## 1. 핵심 기술 스택

- **Desktop Environment:** Electron (로컬 파일 시스템 제어 및 Node.js 기반의 Tailwind JIT 컴파일러 구동에 최적화)
    
- **UI Framework:** React, Tailwind CSS
    
- **State Management (상태 관리):** 응집도와 결합도를 고려하여 두 가지를 혼용합니다.
    
    - **Zustand:** 프로젝트 설정(Tailwind/CSS), 에이전트 상태, 프레임 히스토리 등 전역 도메인 상태 관리.
        
    - **Jotai:** 양쪽 화면의 마우스 호버 좌표, 인스펙터 하이라이트 박스 등 렌더링 업데이트가 매우 잦은 원자적(Atomic) UI 상태 관리.
        
- **Code Editor:** Monaco Editor (코드 및 ASCII 기반의 다이어그램 가독성을 극대화하기 위해 **D2Coding** 폰트를 기본 렌더링 폰트로 적용)
    

## 2. 디렉토리 구조 (FSD 아키텍처)

로직의 의존성을 단방향(아래에서 위로)으로 유지하여 유지보수성을 높입니다.

Plaintext

```
src/
 ├── app/             # 앱 초기화, 전역 라우팅, 로컬 파일 시스템 연동 프로바이더
 ├── processes/       # 에이전트 워크플로우 (코드 생성 -> 샌드박스 렌더링 -> 투트랙 비교 -> 피드백)
 ├── pages/           # 화면 단위 (Workspace 런처, 메인 Split View Editor)
 ├── widgets/         # 독립적인 UI 모듈 (LNB 사이드바, 좌측 렌더러 패널, 우측 Figma 패널, 콘솔)
 ├── features/        # 사용자 인터랙션 (인스펙터 토글, 설정 파일 저장, 에이전트 실행 트리거)
 ├── entities/        # 비즈니스 데이터 모델 (Project 스키마, Figma Node 스키마, 정규화된 DOM 스키마)
 └── shared/          # 공용 UI 컴포넌트, 유틸리티, 파일 시스템 제어 API, MCP Client
```

## 3. 화면 레이아웃 및 핵심 모듈 설계

화면은 크게 4개의 영역으로 나뉩니다.

### A. LNB (Left Navigation Bar) & Workspace 설정

- **프로젝트 관리:** 현재 작업 중인 프로젝트의 메타데이터를 관리합니다.
    
- **글로벌 설정 에디터:** `tailwind.config.js`, `global.css`, 사용할 플러그인 목록을 편집할 수 있는 Monaco Editor 패널을 제공합니다. 여기서 수정된 내용은 로컬 파일 시스템에 즉시 저장되며, AI 에이전트의 컨텍스트(사전 지식)로 주입됩니다.
    

### B. Left Panel: Sandbox Renderer (렌더링 영역)

- **격리형 뷰어:** `iframe` 내부에서 Vite 기반의 로컬 개발 서버가 구동됩니다.
    
- **HMR (Hot Module Replacement):** LNB에서 Tailwind 설정을 바꾸거나 AI가 코드를 수정하면, 즉시 브라우저를 새로고침하지 않고 렌더링된 화면만 업데이트합니다.
    
- **DOM Extractor:** 화면에 렌더링된 실제 DOM 트리를 순회하며 `getBoundingClientRect()` 및 `getComputedStyle()` 데이터를 추출해 메인 프로세스로 넘기는 역할을 합니다.
    

### C. Right Panel: Figma Viewer (원본 뷰어 영역)

- **이미지 + 메타데이터 레이어:** Figma API로 Export한 고해상도 이미지를 배경으로 깔고, 그 위에 투명한 SVG/Canvas 오버레이를 덮습니다.
    
- **노드 맵핑:** API로 받아온 각 노드의 `absoluteBoundingBox` 데이터를 메모리에 들고 있다가, 인스펙터 기능이 켜지면 해당 영역에만 시각적 하이라이트를 줍니다.
    

### D. Bottom Panel: Agent Console & Diff Viewer

- AI 에이전트의 실행 로그(프롬프트 분석, Reflexion 과정)를 출력합니다.
    
- '시각적 일치율(%)' 및 '구조적 오차 목록(예: Margin 8px 차이 발생)'을 직관적인 UI로 보여줍니다.
    

## 4. 로컬 환경 및 설정 주입 (DX 강화)

- **파일 시스템 동기화:** Electron의 `fs` 모듈을 활용해 사용자의 `~/Documents/FigmaToCode/{ProjectName}` 디렉토리에 작업 파일들을 물리적으로 저장합니다.
    
- **디자인 토큰 연동:** 사용자가 `tailwind.config.js`에 설정한 커스텀 색상(예: `brand-primary: '#1A2B3C'`)은 파싱되어 에이전트의 프롬프트에 자동 삽입됩니다. 이로 인해 에이전트가 임의의 Hex 코드를 쓰지 않고 프로젝트 규칙을 준수하게 됩니다.
    

## 5. 실시간 인스펙터 동기화 (Jotai 활용)

- 마우스가 좌측(DOM)이나 우측(Figma) 중 한 곳에 올라가면 `mousemove` 이벤트를 감지합니다.
    
- 복잡한 DOM 구조나 Figma의 깊은 트리 그룹 속에서도 리프 노드(Leaf Node)의 좌표 정보만을 빠르게 캡처합니다.
    
- 캡처된 좌표 데이터는 Jotai Atom으로 업데이트되고, 최상단에 `position: absolute`로 떠 있는 단일 오버레이 박스가 이 Atom을 구독하여 60fps로 매끄럽게 마진/패딩/보더를 시각화합니다. (React DOM의 재렌더링을 최소화하기 위함입니다.)
