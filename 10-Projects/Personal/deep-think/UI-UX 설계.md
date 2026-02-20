복잡한 AI의 사고 과정을 사용자에게 직관적이고 아름답게 전달하는 것은 이 프로젝트의 성패를 가르는 가장 중요한 요소입니다. 프론트엔드(FE) 문서가 '어떻게 구현할 것인가(상태 관리, 최적화)'에 집중했다면, 이번 문서는 **'사용자가 무엇을 보고 어떻게 느낄 것인가'**에 집중합니다.

위키나 협업 툴에 바로 붙여넣어 활용하실 수 있도록, UI/UX 설계 명세서를 작성해 드립니다.

https://stitch.withgoogle.com/projects/9780979268607718145

---

# 데스크탑 AI 채팅 앱 UI/UX 설계 명세서

## 1. UX 핵심 철학 (Design Principles)

본 애플리케이션은 개발자의 생산성 극대화와 AI의 투명성 확보를 최우선으로 합니다.

- **투명성(Transparency):** AI가 결론을 내리기까지의 과정(Deep Think)을 블랙박스로 두지 않고, 사용자가 납득하고 개입할 수 있도록 시각적으로 개방합니다.
    
- **통제감(Control):** 백그라운드에서 터미널 명령어가 실행되거나 리소스를 소모할 때, 사용자가 이를 명확히 인지하고 원할 때 즉각 중단(Cancel)할 수 있는 주도권을 제공합니다.
    
- **인지적 편안함(Cognitive Ease):** 방대한 양의 텍스트와 로그가 쏟아져도 시각적으로 압도당하지 않도록, 정보의 위계를 나누고 필요할 때만 펼쳐보게(Progressive Disclosure) 만듭니다.
    

## 2. 레이아웃 구조 (Anatomy of the App)

화면은 크게 3개의 영역으로 분리되어, 채팅의 흐름을 방해하지 않으면서도 에이전트의 상태를 쉽게 파악할 수 있도록 구성합니다.

- **Left Sidebar (에이전트 및 컨텍스트 패널):**
    
    - 현재 활성화된 에이전트(Codex, Claude Code)의 프로필 및 상태 인디케이터.
        
    - '사고 깊이(Thinking Level: Quick / Standard / Deep)' 조절 슬라이더.
        
    - 활성화된 워크스페이스(디렉토리 경로) 표시.
        
- **Main Chat Area (대화 및 추론 렌더링 영역):**
    
    - 사용자의 질문과 AI의 답변이 오가는 메인 공간.
        
    - 가장 넓은 면적을 차지하며, 시선이 위에서 아래로 자연스럽게 흐르도록 설계.
        
- **Bottom Input Area (명령 프롬프트):**
    
    - 다중 줄 입력이 가능한 텍스트 에어리어.
        
    - 파일 첨부, 도구 사용 권한 토글 버튼 배치.
        

## 3. 핵심 UI 컴포넌트: Deep Think 시각화

가장 난이도가 높고 중요한 '생각하는 과정'을 렌더링하는 UI 규칙입니다.

### A. 병렬 사고 뷰 (Parallel Thinking Tabs)

여러 워커(Worker) 에이전트가 동시에 가설을 탐색할 때, 이를 시각적으로 분리합니다.

- 답변 블록 상단에 작은 탭(Tab) 또는 분할된 카드 레이아웃을 제공합니다.
    
- _예: `[가설 A 탐색 중 ⏳]` | `[가설 B 탐색 중 ⏳]`_
    
- 각 탭을 클릭하면 해당 워커가 현재 어떤 논리를 전개하고 있는지 실시간 스트리밍 텍스트로 볼 수 있습니다.
    

### B. 사고 과정 아코디언 (Thought Process Tree)

AI의 추론 단계와 도구 실행 내역을 트리(Tree) 형태의 아코디언 컴포넌트로 접어둡니다(Progressive Disclosure).

- **상태 아이콘:** 각 스텝의 상태를 아이콘으로 직관적으로 표시합니다.
    
    - ⏳ 진행 중 (스피너)
        
    - ✅ 검증 성공 (녹색 체크)
        
    - ❌ 오류 발생 및 반성(Reflexion) 시작 (빨간색 크로스)
        
    - 🛠️ 도구 실행 중 (렌치 아이콘)
        
- **내용 예시:**
    
    Plaintext
    
    ```
    ▼ 🧠 3개의 가설을 바탕으로 최적의 아키텍처를 고민했습니다. (클릭하여 접기/펴기)
      ✅ Step 1: 프로젝트 구조 및 의존성 분석 완료
      ▼ 🛠️ Step 2: 단위 테스트 실행 (vitest --browser)
        [터미널 뷰포트: 테스트 통과 로그 출력]
      ❌ Step 3: 초기 렌더링 성능 측정 결과 FPS 저하 발견 -> 원인 분석(Reflexion) 진행
      ✅ Step 4: DOM 노드 가상화 적용 코드로 수정 완료
    ```
    

### C. 최종 요약 블록 (Thought Summary)

최종 답변 바로 위에, 심판(Judge) 에이전트가 어떤 기준으로 이 결론을 채택했는지 1~2줄의 짧은 요약(Thought Summary) 뱃지를 제공하여 신뢰도를 높입니다.

## 4. 타이포그래피 및 데이터 표현 (Typography & Data)

개발자가 주로 사용하는 앱인 만큼, 코드와 데이터의 가독성이 사용성에 직결됩니다.

- **본문 텍스트:** San-serif 계열의 깔끔한 시스템 폰트(Pretendard 등)를 사용하여 일반 대화의 가독성을 높입니다.
    
- **코드 블록 및 터미널 뷰포트:** ASCII 다이어그램, 복잡한 디렉토리 트리, 코드 스니펫이 어긋남 없이 출력되도록 **D2Coding 폰트를 전역적으로 적용**합니다. 영문과 한글이 혼용되는 환경에서 개발자의 눈 피로도를 최소화합니다.
    
- **표(Table) 렌더링:** 복잡한 데이터 구조를 표 형태로 반환할 때, 열 너비 조절(Column Resizing)이 가능하고 헤더가 고정(Sticky)되는 UI를 적용하여 긴 데이터를 읽을 때 컨텍스트를 잃지 않도록 합니다.
    

## 5. 마이크로 인터랙션 및 피드백 (Micro-Interactions)

- **부드러운 스크롤 (Smooth Scrolling):** 긴 사고 과정이나 무거운 빌드 로그가 스트리밍될 때 화면이 뚝뚝 끊기지 않도록, DOM 가상화와 결합된 부드러운 자동 스크롤(Auto-scroll to bottom) UX를 제공합니다. 스크롤을 위로 올리면 자동 스크롤이 일시 정지됩니다.
    
- **실시간 도구 피드백:** 에이전트가 파일을 읽거나 터미널을 조작할 때, 입력창 상단에 작고 은은한 펄스(Pulse) 애니메이션과 함께 `Reading src/components/Table.tsx...` 같은 텍스트를 띄워 앱이 멈춘 것이 아님을 알립니다.
    
- **명시적 중단 (Graceful Cancel):** 언제든 AI의 폭주나 불필요한 생각 과정을 끊을 수 있는 명확한 `[■ 중단]` 버튼을 툴팁과 함께 제공합니다.
    
---

# Glass Console AI Interface

## Product Overview

**The Pitch:** A high-fidelity AI chat environment that treats intelligence as a visible, tangible process rather than a black box. By visualizing the "Deep Think" reasoning layers through glassmorphic panels and live state indicators, users gain trust and granular control over complex agent tasks.

**For:** AI Engineers, Data Scientists, and Power Users who need to debug reasoning chains, monitor parallel hypothesis testing, and intervene during long-running agentic workflows.

**Device:** Desktop (optimized for 1440px+ width)

**Design Direction:** **Crystalline Intelligence.** A dark-mode dominant interface defined by frosted glass layers, neon accent glows, and fluid motion. The interface feels "alive"—pulsing when thinking, crystallizing when deciding.

**Inspired by:** macOS Vision Pro OS (depth/glass), Linear (precision/typography), Raycast (command palette efficiency).

---

## Screens

- **[Screen 1] Main Console View:** The primary workspace integrating chat, sidebar controls, and the active thinking canvas.
- **[Screen 2] Deep Think Overlay:** Expanded modal view for inspecting complex, multi-branch reasoning trees in detail.
- **[Screen 3] Settings & Agent Config:** Glass panel overlay for configuring model temperature, tools, and system prompts.
- **[Screen 4] Code/Artifact Preview:** Dedicated focused view for rendered code, markdown files, or data tables generated by the AI.

---

## Key Flows

**[Flow: Parallel Hypothesis Testing]**

1.  User enters complex query in **Bottom Input** -> hits Enter.
2.  **Main Chat** spawns two translucent **Thinking Tabs** ("Strategy A", "Strategy B").
3.  Tabs pulse with a cyan glow (processing state).
4.  User clicks "Strategy A" -> **Process Tree** accordion expands to show live terminal logs.
5.  User notices "Strategy A" looping -> clicks red **Stop** button on that specific tab.
6.  AI collapses "Strategy A", finalizes "Strategy B", and outputs the **Thought Summary**.

**[Flow: Code Generation & Review]**

1.  User requests a Python script.
2.  AI enters **Thinking Mode** (Purple pulse).
3.  **Terminal Block** streams code generation in real-time (D2Coding font).
4.  User hovers over code block -> clicks "Detach" icon.
5.  Code moves to **Artifact Preview** (Screen 4) for syntax-highlighted, full-screen review.

---

## Design System

## Color Palette

The palette relies on alpha channels for the glass effect. Values below assume a dark grey background context.

- **Background:** `#0A0A0C` - Deep void space
- **Glass Base:** `rgba(20, 20, 25, 0.65)` - Panels, sidebar, input (requires `backdrop-filter: blur(20px)`)
- **Glass Highlight:** `rgba(255, 255, 255, 0.08)` - Borders, top highlights
- **Primary Glow:** `#00F0FF` - Active state, "Cyber Cyan"
- **Secondary Glow:** `#7B61FF` - Deep thinking, "Neural Purple"
- **Success:** `#27C96E` - Completion, Checkmarks
- **Error:** `#FF4B4B` - Reflexion, Stops
- **Text Primary:** `#ECECEC` - High contrast readability
- **Text Muted:** `rgba(236, 236, 236, 0.5)` - Metadata, timestamps

## Typography

- **Headings/UI:** `Pretendard`, 600/700 weights. Tight tracking (-0.02em).
- **Body:** `Pretendard`, 400 weight.
- **Code/Terminal:** `D2Coding`, 400 weight. Ligatures enabled.

## Design Tokens

```css
:root {
  --glass-panel: rgba(255, 255, 255, 0.03);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36);
  --blur-strength: 24px;
  
  --font-ui: 'Pretendard Variable', -apple-system, sans-serif;
  --font-code: 'D2Coding', monospace;
  
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  
  --glow-cyan: 0 0 20px rgba(0, 240, 255, 0.3);
}
```

**Style Notes:**
- **Frosting:** All panels use `backdrop-filter: blur()`.
- **Noise:** A subtle SVG noise texture overlay at 2% opacity sits on the background to prevent color banding.
- **Borders:** 1px borders are white at 8% opacity, representing the "edge" of the glass.

</details>

---

## Screen Specifications

### [Screen 1] Main Console View

**Purpose:** The daily driving interface. Balances input, history, and live process monitoring.

**Layout:** Three-column grid (fluid).
- **Left (260px fixed):** Sidebar (Navigation & Agent Status).
- **Center (Fluid):** Chat Stream.
- **Bottom (Fixed, 140px):** Input assembly area (floating glass).

**Key Elements:**
- **Sidebar Profile:** Top-left. 48px avatar circle with pulsing ring border (Green=Idle, Purple=Thinking). Name: "Glass-01".
- **Thinking Level Slider:** Vertical slider in sidebar. Range 1-5. Visual: Frosted track, glowing cyan thumb. Label: "Depth: Deep".
- **Parallel Thinking Tabs:** Located inside the chat stream.
    - **Container:** Horizontal flex row.
    - **Tab:** `160px` x `120px` glass card.
    - **Content:** "Hypothesis A", Status Icon (Spinner/Check), minimal sparkline graph of token usage.
- **Thought Tree Accordion:**
    - **Header:** "Reasoning Chain" (Text) + Chevron.
    - **Body:** Vertical list of steps connected by a thin 1px line.
    - **Step:** Icon (Search/Calc) + Action text ("Querying vector DB...") in `14px` Muted Text.

**States:**
- **Empty:** "Awaiting Directive" centered in `32px` Pretendard. Subtle breathing glow animation.
- **Thinking:** Input field locks (semi-transparent). Stop button appears (Square icon, red hover glow).
- **Streaming:** Text characters appear character-by-character (typing effect, 20ms delay).

**Components:**
- **Message Bubble:** No background. Text aligned left. `16px/1.6` line-height.
- **Input Field:** Floating glass pill at bottom. `64px` height. `24px` blur. Placeholder: "Enter directive or /command..."

**Interactions:**
- **Hover Sidebar Item:** Background becomes `rgba(255,255,255,0.05)`.
- **Click Thought Tab:** Expands that specific hypothesis inline, pushing other content down.

**Responsive:**
- **Desktop:** 3-column.
- **Tablet:** Sidebar collapses to icons only.
- **Mobile:** Not supported (Desktop-first tool).

---

### [Screen 2] Deep Think Overlay

**Purpose:** A "War Room" view for debugging when the AI is stuck or hallucinating. Focuses entirely on the logic logs.

**Layout:** Full-screen modal overlay with 95% black opacity backdrop.

**Key Elements:**
- **Header:** "Deep Trace: ID #8291" (Left), "Close [Esc]" (Right).
- **Tree Visualization:** Left 30% panel. Visual node graph of the reasoning steps.
    - **Node:** Circle `12px`. Connected by bezier curves.
    - **Active Node:** Pulsing white ring.
- **Log Terminal:** Right 70% panel.
    - **Font:** `D2Coding`, `13px`.
    - **Style:** Raw JSON/System logs.
    - **Colors:** Keywords in Cyan, Strings in Green, Errors in Red.

**States:**
- **Active:** New log lines autoscroll to bottom.
- **Paused:** Scroll up pauses autoscroll. "Paused" badge appears top-right.

**Interactions:**
- **Click Node:** Jumps the Log Terminal to the corresponding timestamp.

---

### [Screen 3] Settings & Agent Config

**Purpose:** Adjust the "personality" and capabilities of the glass console.

**Layout:** Centered glass modal `600px` width.

**Key Elements:**
- **Tabs:** "Model", "Tools", "Persona". Segmented control style.
- **Temperature Dial:** customized circular input.
    - **Visual:** SVG ring. Dragging rotates the "notch". Value `0.0` - `1.0` displayed in center.
- **System Prompt Editor:** Large textarea, `D2Coding` font.
    - **Background:** `rgba(0,0,0,0.3)` (darker than glass).
- **Tool Toggles:** List of integrations (Web Search, Python, File I/O).
    - **Toggle:** iOS style switch, but square corners and cyan active color.

**Interactions:**
- **Change Value:** Immediate "save" toast notification (Small pill top center, glass style).

---

### [Screen 4] Code/Artifact Preview

**Purpose:** Viewing generated output in a clean, distraction-free IDE-lite environment.

**Layout:** Split view.
- **Left:** Chat context (minimized/collapsed).
- **Right (Expanded):** The Artifact.

**Key Elements:**
- **Code Block:** Full height, full width. Line numbers enabled.
- **Toolbar:** Top right of the block.
    - **Actions:** "Copy", "Download", "Fork to Gist", "Run".
    - **Style:** Icon-only buttons with tooltips.
- **Language Badge:** Bottom right. e.g., "Python 3.11".

**States:**
- **Running:** If the artifact is a script, a "Console Output" drawer slides up from the bottom (`30%` height) showing execution results.


---


## Build Guide

**Stack:** HTML + Tailwind CSS v3

**Configuration:**
- Enable `backdrop-filter` utilities.
- Add custom font families in `tailwind.config.js`.
- Define custom colors for neon accents.

**Build Order:**
1.  **[Screen 1] Main Console:** This establishes the core `GlassContainer` component, the Sidebar layout, and the Input micro-interactions. It sets the baseline for the lighting/depth engine.
2.  **[Screen 2] Deep Think Overlay:** Implements the complex data visualization and `D2Coding` typography hierarchy.
3.  **[Screen 4] Code/Artifact:** focused on the syntax highlighting and "IDE-lite" features.
4.  **[Screen 3] Settings:** Standard form elements styled to match the glass aesthetic.

