# API 정의부 구현

## 메타데이터
- **상태**: ✅ resolved
- **담당자**: 최기환
- **작성자**: 강지명
- **생성일**: 2025-09-24
- **완료일**: 2025-10-01
- **Product**: Maxgauge VI
- **DB**: Oracle
- **ClickUp**: [링크](https://app.clickup.com/t/86euye65u)

---

## 요약

`src/shared/api` 레이어의 표준 구조, 작성 규칙, 구현 절차를 정리한 API 문서 구조 가이드.

---

## 상위 디렉터리 구조

```
src/shared/api/
├── _core/                 # 공용 인스턴스, 타입, 유틸리티
│   ├── instance.ts        # v1ApiInstance 등 HTTP 클라이언트 설정
│   └── types.ts           # ApiResponse, PagingDataApiResponse 등 공통 타입
├── configuration/         # Swagger Configuration 컨트롤러 (10개)
├── oracle/                # Swagger Oracle 컨트롤러 (14개)
├── worker/                # 워커/배치 전용 API
└── docs/                  # API 관련 문서
```

---

## 컨트롤러 폴더 표준

컨트롤러 폴더는 반드시 3개 파일로 구성:

| 파일 | 역할 | 주요 규칙 |
|------|------|----------|
| `[controller].schema.ts` | Request/Response 타입 선언 | PascalCase, 공통 타입은 `_core/types`에서 import |
| `[controller].api.ts` | HTTP 호출 함수 정의 | `v1ApiInstance` 활용, `BASE_URL` 필수 |
| `[controller].factory.ts` | TanStack Query Factory | Keys, Queries, Mutations 세 객체로 분리 |

---

## 파일별 상세 규칙

### .schema.ts
- Swagger 스펙을 그대로 타입으로 변환
- `TraceInfo`, `PaginationParams` 등 중복 타입은 `_core/types`에서 가져오기

### .api.ts
```typescript
import { v1ApiInstance } from '../../_core/instance';

const BASE_URL = '/domain/path';

export const someControllerApi = {
  list: async (params: SomeRequest): Promise<SomeResponse[]> => {
    const response = await v1ApiInstance.get<ApiResponse<SomeResponse[]>>(
      BASE_URL, { params }
    );
    return response;
  },
};
```
- URL은 `BASE_URL` 기준으로 조합, `/api/v1` 접두사 제거
- 데이터 래퍼를 벗겨 실제 데이터만 반환

### .factory.ts

#### 1. Keys Definition
```typescript
export const someControllerKeys = createQueryKeys('some-controller', {
  list: (params: SomeRequest) => [params],
  detail: (id: string) => [id],
  getAll: () => [''],  // 파라미터 없으면 빈 문자열
});
```

#### 2. Queries Definition
```typescript
export const someControllerQueries = {
  list: (params: SomeRequest) => ({
    queryKey: someControllerKeys.list(params).queryKey,
    queryFn: () => someControllerApi.list(params),
  }),
};
```

#### 3. Mutations Definition
```typescript
export const someControllerMutations = {
  create: () => ({
    mutationKey: [...someControllerKeys._def, 'create'],
    mutationFn: someControllerApi.create,
  }),
};
```

---

## 사용 예시

```typescript
// 조회 (Query)
const { data, isLoading } = useQuery(
  someControllerQueries.list(params)
);

// 변경 (Mutation)
const createMutation = useMutation(
  someControllerMutations.create()
);

// Key 무효화
queryClient.invalidateQueries({
  queryKey: someControllerKeys.list(params).queryKey
});
```

---

## 금지 사항
- 컨트롤러 객체 밖으로 개별 API 함수 export 금지
- `_core/types`에 존재하는 타입 재정의 금지
- API 함수에 비즈니스 로직, 에러 핸들링, 캐싱 로직 추가 금지
- Keys 객체에서 `queryFn` 정의 금지
- 빈 배열 `[]` 대신 빈 문자열 `['']` 사용

---

## 체크리스트
- [ ] 폴더 경로가 `src/shared/api/{group}/{controller}/` 규칙 준수
- [ ] 세 가지 파일 모두 존재 (.schema.ts, .api.ts, .factory.ts)
- [ ] .api.ts가 BASE_URL 상수 사용
- [ ] .factory.ts에 Keys, Queries, Mutations 순서대로 정의
- [ ] 파라미터 시그니처가 Keys와 Queries/Mutations 간 일치
