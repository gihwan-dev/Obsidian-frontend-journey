## useSelectedInstance 리팩토링 계획
### 인자
- 전체 인스턴스 리스트
- groupBy
- groupBy에 따른 선택된 인스턴스 리스트

### 역할
- 선택된 인스턴스 리스트를 기반으로 선택된 그룹 명 리스트를 추출. 그룹 명 추출 기준은 해당 그룹 내의 모든 인스턴스가 선택 상태여야함
- 선택된 그룹 명에 포함되지 않은 인스턴스 리스트. 해당 그룹의 모든 인스턴스가 선택되지는 않았지만 일부 선택된 경우

### 구현 방식
- 그룹 명 추출 및 선택된 그룹에 포함되지 않은 인스턴스 리스트를 추출하는 로직은 순수 함수로 구성해 테스트하기 좋게 만들어야함.
- 4개의 ContextAPI를 만들어야함. FAB, System, Cluster, Instance 즉 groupBy 별 인스턴스 선택을 별도로 관리하는 ContextAPI 4개를 만들거임
- 선택된 인스턴스 리스트는 null 값일 수 있음. null 값인 경우 모두 선택 상태이며, 초기값임.
- useSelectedInstance의 함수 명을 해당 훅의 역할에 맞게 수정해야함.
완벽합니다! 이제 모든 컨텍스트를 이해했습니다. 제공해주신 정보를 바탕으로 프롬프트를 개선해드리겠습니다.

# 개선된 프롬프트 - 최종 버전

````markdown
## useSelectionGroupExtractor 훅 구현 명세

### 도메인 컨텍스트
- **목적**: DB 인스턴스 선택 상태를 기반으로 API 요청에 필요한 그룹명과 인스턴스명을 추출
- **인스턴스 타입**: InstanceInfo (DB 인스턴스 정보)
- **그룹화 기준**: FAB, System, Cluster(rac 필드), Instance (4가지 독립적 기준)

### 핵심 인터페이스
```typescript
interface InstanceInfo {
  dbmsId?: number;
  fab?: string;
  system?: string;
  rac?: string;  // Cluster 그룹화 기준
  instanceName?: string;
  // ... 기타 필드
}

type GroupBy = 'FAB' | 'System' | 'Cluster' | 'Instance';

interface SelectionGroupExtractorParams {
  allInstances: InstanceInfo[];
  selectedInstances: InstanceInfo[] | null;  // null = 모두 선택
  groupBy: GroupBy;
}

interface ExtractedSelection {
  groupNames: string[];      // 완전히 선택된 그룹명 리스트
  instanceNames: string[];   // 부분 선택된 인스턴스명 리스트
}
```

### 주요 기능 요구사항

#### 1. 선택 상태 규칙

- `null`: 모든 인스턴스 선택 (초기값)
- `[]`: 선택된 인스턴스 없음
- `InstanceInfo[]`: 특정 인스턴스들만 선택

#### 2. 그룹 추출 로직

- **groupNames 포함 조건**: 해당 그룹의 모든 인스턴스가 선택된 경우
- **instanceNames 포함 조건**: 그룹이 부분 선택된 경우의 개별 인스턴스
- 그룹별 필드 매핑:
    - FAB: `instance.fab`
    - System: `instance.system`
    - Cluster: `instance.rac`
    - Instance: `instance.instanceName`

#### 3. 순수 함수 구현

```typescript
// 핵심 추출 로직 (순수 함수)
const extractGroupsAndInstances = (
  allInstances: InstanceInfo[],
  selectedInstances: InstanceInfo[] | null,
  groupBy: GroupBy
): ExtractedSelection => {
  // 1. null 처리: 모두 선택
  // 2. 그룹별 인스턴스 매핑 생성
  // 3. 완전 선택 그룹과 부분 선택 인스턴스 분리
  // 4. 반환: { groupNames, instanceNames }
};
```

### Context API 구조

#### 4개의 독립적인 Context

```typescript
// 각 Context는 해당 groupBy에 대한 선택 상태만 관리
- FABSelectionContext
- SystemSelectionContext  
- ClusterSelectionContext
- InstanceSelectionContext

// 각 Context 내부 상태
interface SelectionContextState {
  selectedInstances: InstanceInfo[] | null;
  setSelectedInstances: (instances: InstanceInfo[] | null) => void;
}
```

### 구현 제약사항

- 각 Context는 독립적으로 동작 (상호 의존성 없음)
- 소비처에서 groupBy에 따라 적절한 Context 선택
- 모든 추출 로직은 테스트 가능한 순수 함수로 구현
- 엣지 케이스 처리:
    - 빈 allInstances 배열
    - undefined/null 필드 값 처리
    - 중복 그룹명 제거

### 테스트 시나리오

1. null 상태 → 모든 그룹명 반환, 빈 instanceNames
2. 빈 배열 → 빈 groupNames, 빈 instanceNames
3. 그룹 완전 선택 → groupNames에 포함
4. 그룹 부분 선택 → instanceNames에 개별 항목 포함
5. 혼합 선택 → 적절한 분리

```

## 주요 개선 사항:
1. **명확한 타입 정의**: InstanceInfo, GroupBy, 반환 타입 등 모든 인터페이스 명시
2. **도메인 컨텍스트 추가**: DB 인스턴스와 API 요청 구조 설명
3. **구체적인 구현 가이드**: 순수 함수 시그니처와 Context 구조 제시
4. **엣지 케이스 명시**: 빈 배열, null 필드 등 처리 방법 포함
5. **테스트 시나리오**: 주요 케이스별 예상 동작 정의

## 토큰 최적화:
- 원본: ~180 토큰
- 개선: ~450 토큰
- 명확성 증가: 불명확한 부분을 구체화하여 구현 시 혼란 최소화

## 추가 권장사항:
- 유틸리티 함수 분리 (getGroupKey, isGroupFullySelected 등)
- 메모이제이션 적용 검토 (대량 인스턴스 처리 시)
- TypeScript strict 모드 활용하여 타입 안정성 확보
```