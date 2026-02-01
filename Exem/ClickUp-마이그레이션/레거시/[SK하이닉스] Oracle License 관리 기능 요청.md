---
title: "[SK하이닉스] Oracle License 관리 기능 요청"
status: resolved
created: 2025-05-14
completed: 2025-09-09
assignee: 최기환
creator: 강지명
priority: urgent
source: ClickUp
clickup_id: 86etf4dja
clickup_url: https://app.clickup.com/t/86etf4dja
product: DFL (Dashboard for License)
customer: SK하이닉스
tags:
  - legacy
  - on-premise
  - SK하이닉스
  - license
  - oracle
  - dashboard
---

# [SK하이닉스] Oracle License 관리 기능 요청

## 요약

SK하이닉스를 위한 Oracle License 관리 대시보드 개발. FAB별 인스턴스 그룹핑, 라이센스 옵션 사용량 시각화, 데이터 수집 설정 기능 포함.

## 일정

- **설치 예정**: 9월 2째주

## 주요 작업 내용

### 09.04 논의 사항

- 필터링(groupBy 및 그룹 선택) 로컬 스토리지 저장으로 결정
- groupList, instanceList 형태:
```json
{
  "groups": [
    {
      "groupName": "M11",
      "instanceList": ["orcl"]
    },
    {
      "groupName": "M12",
      "instanceList": ["orcl"]
    }
  ]
}
```
- Options Usage by FAB 필터 적용 수정 필요
- 드롭다운 검색 기능 추가
- 파이 차트 너비 조정

### 09.01 작업 리스트

- Overview 컨트롤러 API 검증 완료
- API 변경점 반영
- API 변경에 따른 컴포넌트 로직 수정

### 09.01 논의 정리

- GroupBy 백엔드 처리로 인스턴스 리스트를 그룹별로 전송
- GroupBy 테이블 바로 위로 이동, 콤보 2개로 수정
- 검색 기능 제거 (백엔드 공수 이슈)
- 스케줄러 1~31일 모두 선택 가능하게 수정

## 05.28 피드백 정리

### 컨피그

- 데이터 수집 설정 메뉴에서 '설정' 단어 제거
- 코어팩터 설정 서머리 카드/Form 타이틀 제거
- 설정 저장 → 저장으로 수정
- 분단위까지 설정 가능하도록 수정

### 토탈

- 탭을 GNB 메뉴로 이동
- List only → Instance로 수정
- Total 대시보드 타이틀 제거
- FAB 선택 디폴트를 전체 체크로
- 차트 타이틀에서 '차트' 단어 제거
- yAxisLabel 제거
- 차트 높이 수정 (차트 2개 + 테이블 한번에 다 보이게)
- 상세 테이블 타이틀 → '인스턴스 목록'으로 수정
- 테이블에 FAB 콤보박스 추가 (전체 선택 디폴트, 다중 선택)
- 테이블 세로선 추가
- Last Date 칼럼 제거 및 괄호 형태로 병합
- Current Count 제거
- 전체 업데이트 버튼 → '지금 수집'으로 명칭 수정
- 새로고침 제거

## 관련 링크

- [ClickUp 원본](https://app.clickup.com/t/86etf4dja)
