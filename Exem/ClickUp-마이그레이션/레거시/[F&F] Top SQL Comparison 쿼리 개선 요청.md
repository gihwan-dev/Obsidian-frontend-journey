---
title: "[F&F] Top SQL Comparison 쿼리 개선 요청"
status: resolved
created: 2025-10-15
completed: 2026-01-27
assignee: 최기환
creator: 강지명
source: ClickUp
clickup_id: 86ev5mczw
clickup_url: https://app.clickup.com/t/86ev5mczw
tags:
  - legacy
  - on-premise
  - F&F
  - SQL
  - bug-fix
---

# [F&F] Top SQL Comparison 쿼리 개선 요청

## 요약

Top SQL Comparison 화면에서 per exec 계산이 잘못되어 있던 버그 수정 건. SQL 쿼리에서 자식 행들의 평균값을 합산하는 방식이 아닌, 총합을 총 executions로 나누는 방식으로 수정함.

## 문제 상황

SQL의 실행 결과가 `합산 / execution`이 아닌 **합산으로만** 응답되고 있었음.

### 예시 데이터

| d_time | sql_plan_hash | s_execution | s_logical |
|--------|---------------|-------------|-----------|
| 2026-01-19 | 2641576435 | 1 | 16,935,560 |
| 2026-01-19 | 2641576435 | 1 | 0 |

### 기존 SQL 로직 (잘못된 방식)

1. 각 행마다 1회당 평균을 먼저 계산: `s_logical / s_execution`
2. 계산된 평균값들을 `SUM()`으로 합산

```sql
-- 현재 방식 (잘못됨)
sum(t.logical_reads_exec) as logical_reads_exec
-- 여기서 logical_reads_exec는 이미 s_logical/s_execution으로 계산된 값
```

**결과**: `(16935560/1) + (0/1) = 16,935,560` ❌

### 올바른 로직

1. 합계 컬럼들을 먼저 `SUM()`으로 합산
2. 합산된 값으로 1회당 평균 계산

```sql
-- 올바른 방식
round(cast(sum(t.s_logical) as numeric) / cast(sum(t.s_execution) as numeric), 0) as logical_reads_exec
```

**결과**: `(16935560 + 0) / (1 + 1) = 8,467,780` ✅

## 해결 방법

FE 코드를 수정하여 다음 5가지 칼럼이 `총 합 / 총 executions`로 나눗셈 될 수 있게 수정함:
- Elapsed Time/exec
- Logical Reads/exec
- 기타 per exec 칼럼들

## 관련 링크

- [ClickUp 원본](https://app.clickup.com/t/86ev5mczw)
