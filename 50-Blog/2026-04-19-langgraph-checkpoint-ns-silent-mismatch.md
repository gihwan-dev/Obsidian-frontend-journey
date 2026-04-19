---
type: blog-post
source: claude-conversation
author: "koreanthuglife"
title: "LangGraph interrupt() 디버깅: checkpoint_ns가 조용히 삼킨 resume 경로"
slug: "langgraph-checkpoint-ns-silent-mismatch"
published: false
updated: "2026-04-19T09:00:00.000Z"
tags: [langgraph, debugging, human-in-the-loop, checkpoint, state-management]
description: "LangGraph의 interrupt()로 Human-in-the-Loop 승인 게이트를 구현하다가 resume가 영원히 작동하지 않는 버그를 만났다. 원인은 root graph가 checkpoint_ns를 조용히 무시하는 동작이었다."
aliases:
  - "2026-04-19 langgraph checkpoint ns silent mismatch"
---

# LangGraph interrupt() 디버깅: checkpoint_ns가 조용히 삼킨 resume 경로

## 문제 상황

LLM 에이전트가 코드를 수정한 뒤 바로 커밋하지 않고, 사람의 승인을 받고 나서 커밋하는 Human-in-the-Loop(HIL) 워크플로우를 만들고 있었다. LangGraph의 `interrupt()` 프리미티브가 딱 이 용도다. 그래프 실행 중간에 멈추고, 체크포인트에 상태를 저장하고, 나중에 사용자가 "ok" 또는 "cancel"을 보내면 거기서부터 이어서 실행한다.

4개 노드짜리 StateGraph를 설계했다:

```
orchestrate(에이전트 실행) → critic(검증) → awaitApproval(interrupt + 대기) → commit(푸시)
```

구현은 순조로웠다. 500개 넘는 테스트가 통과했고, 타입 체크도 깨끗했다. 실제 환경에서 E2E 테스트를 돌렸더니 첫 번째 pause는 완벽하게 작동했다. 승인 요청 댓글이 올라가고, 그래프가 멈췄다.

문제는 resume였다. 사용자가 "ok"를 보냈는데, 시스템이 이걸 resume로 인식하지 못하고 완전히 새로운 요청으로 처리해버렸다. 2글자짜리 "ok"가 에이전트 지시어로 들어가서, 당연히 아무 파일도 변경하지 않고 조용히 끝났다.

## 시도한 접근들

피드백 루프가 한 번에 4분씩 걸렸다. 에이전트가 코드를 분석하고 수정하는 시간이 포함되니까. 그래서 매 이터레이션마다 진단 로깅을 추가하면서 체계적으로 범위를 좁혀갔다.

**1차: resume intent 감지 확인**

혹시 사용자 메시지에서 "ok"를 승인 의도로 파싱하지 못하는 건 아닌가? 로그를 확인했더니 resume intent는 정상적으로 감지되고 있었다. 문제는 그 다음 단계.

**2차: pending checkpoint 조회 실패**

resume intent를 감지한 뒤 `hasPendingMentionCheckpoint()`를 호출하는데, 여기서 `false`가 리턴되고 있었다. 내부적으로 `checkpointer.getTuple(threadConfig)`가 `undefined`를 반환. 저장된 체크포인트가 없다는 뜻인데, 분명히 pause는 성공했으니 저장은 됐을 것이다.

**3차: 저장소 전체 덤프**

여기서 결정적 수를 뒀다. namespace 필터를 빼고 체크포인터에 저장된 **모든** 스레드를 덤프했다.

```
stored threads:
  mention:1377:72:d664... | ns=          ← 실제 저장된 값
  mention:1377:72:d664... | ns=tools:... ← 서브그래프 노드
```

`ns=` 뒤에 아무것도 없다. 빈 문자열이다.

## 돌파구

내 코드는 `checkpoint_ns: "mention"`을 config에 넣어서 invoke하고 있었다. 네임스페이스로 체크포인트를 구분하려는 의도였다. 그런데 LangGraph는 root graph에 대해 이 값을 **조용히 무시**한다. `checkpoint_ns`는 LangGraph 내부적으로 서브그래프 네임스페이싱에만 사용되는 필드이고, root graph는 항상 `ns=""`로 저장된다.

결과적으로:
- **쓰기 경로** (initial invoke + interrupt): `thread_id=xxx, checkpoint_ns=""` 에 저장됨
- **읽기 경로** (resume 시 getTuple): `thread_id=xxx, checkpoint_ns="mention"` 으로 조회 → miss

같은 thread_id인데 namespace가 달라서 찾지 못한 것이다. 에러도 없고, 경고도 없고, 그냥 `undefined`. 이게 가장 짜증나는 부분이었다. "해당 namespace의 체크포인트는 없습니다" 같은 메시지라도 있었으면 30분은 아꼈을 것이다.

```typescript
// 수정 전 — checkpoint_ns를 명시적으로 지정
export function buildThreadConfig(...): RunnableConfig {
  return {
    configurable: {
      thread_id: buildThreadId(projectId, mrIid, discussionId),
      checkpoint_ns: "mention",  // root graph에서는 무의미
    },
  };
}

// 수정 후 — root graph는 ns="" 고정이므로 생략
export function buildThreadConfig(...): RunnableConfig {
  return {
    configurable: {
      thread_id: buildThreadId(projectId, mrIid, discussionId),
      // checkpoint_ns 제거: LangGraph root graph는 항상 ns=""로 저장
    },
  };
}
```

수정 후 resume가 정상 작동했다. pending checkpoint를 찾고, `Command({ resume: decision })`으로 그래프를 이어서 실행하고, commit 노드까지 도달했다.

## 보너스: 그래프에서 사이드 이펙트를 미루면 안 된다

같은 E2E 세션에서 하나 더 발견했다. critic 노드가 검증 실패를 감지했을 때 `warningBody`를 state에 넣어놓고, 나중에 어떤 노드가 이걸 읽어서 댓글로 올려주길 기대하는 구조였다. 문제는 검증 실패 시 conditional edge가 `END`로 빠지면서, 그 "나중의 노드"가 실행되지 않는다는 것이다.

그래프 아키텍처에서 "state에 써 놓고 다른 노드가 처리하게 하자"는 패턴은, 그 다른 노드가 반드시 실행된다는 보장이 있을 때만 안전하다. 조건부 라우팅이 있는 그래프에서는 사이드 이펙트를 정보를 가진 노드에서 직접 수행해야 한다.

```typescript
// critic 노드 내부에서 직접 처리
if (update.warningBody) {
  await postComment(ctx, update.warningBody);  // 여기서 바로 실행
}
return update;  // state 업데이트도 함께
```

## 배운 점

**1. "조용한 무시"는 가장 위험한 API 동작이다.** `checkpoint_ns`를 넣으면 에러를 던지든, 경고를 로깅하든, 아니면 실제로 그 namespace로 저장하든 해야 한다. "받아놓고 안 쓰는" 동작은 디버깅 비용을 기하급수적으로 늘린다. 내가 만드는 API에서도 이런 패턴이 있는지 점검해봐야겠다.

**2. 체크포인터 디버깅의 정석: 필터 없이 전체 덤프.** "이 key로 찾았는데 없다"에서 멈추지 말고, "그러면 실제로 뭐가 저장되어 있는데?"를 확인하는 게 핵심이었다. key-value 저장소 디버깅에서 key mismatch를 의심할 때는 항상 양쪽(쓰기/읽기)의 실제 key를 비교해야 한다.

**3. 그래프 노드의 사이드 이펙트는 "내가 가진 정보는 내가 쓴다" 원칙.** 다른 노드에게 위임하면 실행 순서나 조건부 경로에 의해 누락될 수 있다. 특히 실패 경로에서 사용자에게 피드백을 주는 동작은 절대 미루면 안 된다.

**4. 느린 피드백 루프에서의 디버깅은 계획이 전부다.** 한 번 돌리는데 4분 걸리는 E2E에서 "일단 로그 찍어보자"는 전략이 7번 반복되었다. 매번 정확히 어떤 가설을 검증할지 정하고, 그 가설이 맞든 틀리든 다음 스텝이 명확하도록 진단을 설계하는 게 중요했다.
