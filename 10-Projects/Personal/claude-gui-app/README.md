# Claude GUI App

> Claude Code의 기능을 그대로 드러내면서, 더 간단하게 관리하고 사용할 수 있도록 확장하는 macOS 네이티브 GUI 애플리케이션

## Overview

Claude Code CLI를 subprocess로 감싸서, 세션 관리 / 체크포인트 / 무한 루프 / 워크플로우 등 파워유저 기능을 GUI로 제공합니다.

## Tech Stack

- **App Framework**: Tauri v2 (Rust + WebView)
- **Frontend**: React + TypeScript
- **Terminal**: xterm.js
- **PTY**: Rust (portable-pty)
- **Claude Code 연동**: CLI subprocess + JSON stream parsing
- **Platform**: macOS only

## Architecture

```
Tauri App
├── React/TS UI (WebView)
│   ├── xterm.js 터미널
│   ├── 워크플로우 에디터
│   ├── 설정 패널
│   └── 모니터링 대시보드
├── Rust Backend
│   ├── PTY Manager
│   ├── Git 관리
│   ├── 세션 관리
│   └── 파일 시스템
└── Claude Code CLI (subprocess)
    └── JSON stream 파싱
```

## Key Features

- **세션 관리**: git worktree 기반 격리, bypass 모드, 다중 세션
- **체크포인트**: git commit 기반 스냅샷, 롤백, diff, 타임라인
- **무한 루프 모드**: 자동 반복 실행 + 종료 조건 설정
- **워크플로우**: n8n 스타일 비주얼 노드 에디터
- **모니터링**: 토큰/비용 추적, 컨텍스트 윈도우 시각화
- **설정 GUI**: MCP, 스킬, 정책 관리

## Project Structure

```
claude-gui-app/
├── docs/
│   └── SPEC.md              # 제품 스펙 문서
├── src-tauri/                # Rust 백엔드 (Tauri)
│   ├── src/
│   │   ├── main.rs
│   │   ├── pty/              # PTY 관리
│   │   ├── session/          # 세션 관리
│   │   ├── git/              # Git 조작
│   │   ├── claude/           # Claude Code CLI 연동
│   │   └── workflow/         # 워크플로우 엔진
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                      # React 프론트엔드
│   ├── components/
│   │   ├── terminal/         # xterm.js 터미널
│   │   ├── session/          # 세션 UI
│   │   ├── checkpoint/       # 체크포인트 UI
│   │   ├── workflow/         # 워크플로우 에디터
│   │   ├── monitoring/       # 모니터링 대시보드
│   │   └── settings/         # 설정 패널
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

> TODO: 프로젝트 초기 세팅 후 작성 예정

## Documentation

- [제품 스펙 문서 (v1)](./docs/SPEC.md)

## License

TBD
