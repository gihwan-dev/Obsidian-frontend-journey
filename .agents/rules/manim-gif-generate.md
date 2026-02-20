---
description: 옵시디언 등 마크다운 문서에 삽입하기 위한 Manim GIF 애니메이션 코드 작성 및 렌더링 규칙
trigger: model_decision
---

# Manim GIF 애니메이션 생성 규칙

Manim 라이브러리를 통해 다이어그램이나 과정을 모션 그래픽으로 설명할 때 적용하는 표준 규칙입니다. 이 규칙은 마크다운(옵시디언 등) 환경에서 렌더링하기 편하도록 코드를 작성하고 GIF 형태로 출력하는 과정을 명시합니다.

## 1. Manim 코드 작성 가이드라인 (Code Guidelines)
- **명시적 폰트 지정:** 한글 깨짐을 방지하기 위해 텍스트 작성 시 환경(macOS 기준)에 맞는 폰트를 명시합니다. (예: `font="AppleGothic"`)
- **안정적인 파라미터 사용:** 최신 Manim 패키지 버전 호환성 문제 상황을 예방하기 위해 `Text` 객체의 `letter_spacing`과 같은 민감성 파라미터는 사용을 자제합니다.
- **부드러운 화면 전환:** `Transform`, `ReplacementTransform`, `FadeIn`, `FadeOut` 등을 적재적소에 배분하여 정적인 다이어그램이 아닌 동적인 흐름(전개, 평가, 축약 등)을 시각적으로 체감할 수 있도록 구성합니다.

## 2. 렌더링 및 파일 추출 규칙 (Rendering & Extraction)
옵시디언 마크다운 문서는 복잡한 설정 없이도 GIF를 훌륭하게 렌더링합니다. 따라서 **동영상(.mp4)이 아닌 GIF(.gif)** 포맷으로 결과물을 생성하여 즉시 삽입할 수 있도록 돕습니다.

- **GIF 변환 옵션:** 렌더링 명령 실행 시 반드시 `--format=gif` 플래그를 추가합니다.
- **파일 복사 자동화:** Manim은 렌더링 된 파일을 `media/videos/...`와 같은 깊은 경로에 은닉시킵니다. 작업 완료 직후 사용자가 찾기 쉽도록 생성된 GIF 파일을 현재 작업 폴더로 직접 `cp` 해오는 명령어 체인을 구성하여 제공합니다.

### 💡 표준 명령어 템플릿
```bash
manim -qh --format=gif [스크립트_파일명.py] [클래스명] && cp media/videos/[스크립트_파일명(확장자 제외)]/1080p60/[클래스명]*.gif ./[최종클래스명].gif
```

**예시:**
```bash
manim -qh --format=gif sicp_animation.py MyScene && cp media/videos/sicp_animation/1080p60/MyScene*.gif ./MyScene.gif
```

## 3. 예외 및 후속 조치
- 렌더링 에러가 발생한 경우 에러 메시지를 우선 파악하고 가이드를 제공합니다. (예: *ffmpeg, pango, cairo 등의 부가 모듈 설치 필요 여부* 등)
- 시스템 자원이나 시간이 너무 많이 소모되는 복잡한 Scene일 경우 `-ql` (480p15 해상도) 옵션으로 먼저 테스트 렌더링을 시도하도록 안내합니다.
