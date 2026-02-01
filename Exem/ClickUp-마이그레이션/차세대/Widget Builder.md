# Widget Builder

## 메타데이터
- **상태**: ✅ resolved
- **담당자**: 최기환
- **작성자**: 문성우
- **생성일**: 2026-01-12
- **완료일**: 2026-01-29
- **ClickUp**: [링크](https://app.clickup.com/t/86ew6bv7e)

---

## 요약

Widget Builder의 '기능 계층(Functional Layer)' 아키텍처에서 '시각화 도메인(Visualization Domain)' 아키텍처로 리팩토링. Zod 스키마를 활용한 폼 검증 구조 개선.

---

## 버그 픽스
- 폼 입력 중 시각화 변경시 모달이 닫히고 다른 인터랙션이 동작하지 않음

## 미구현 기능
- Bar, Area 차트 Stack 기능
- Table
- Scatter

---

## 리팩토링 상세

### 목표
`@src/pages/dashboard/dashboardDetail/ui/WidgetBuilderSheet/`를 리팩토링하여 특정 시각화가 선택적 필드로 공유 글로벌 스키마를 오염시키지 않고 자체 데이터 요구 사항, 추가 설정 및 미리보기를 쉽게 정의할 수 있도록 함.

### 현재 vs 제안 아키텍처

#### 현재 (Functional Layer)
- GraphDataSection (모두에게 공통, Metric/Formula 전환 처리)
- MarkerSection (기술적으로는 공통이지만 차트에만 관련됨)
- 스키마: Metric 또는 Formula의 유니온인 data 필드를 가진 단일 WidgetBuilderSchema

#### 제안 (Visualization Domain)
```
ui/WidgetBuilderSheet/
├── model/
│   ├── common.ts           # 공유 정의 (MetricForm, FormulaForm, Aggregations)
│   └── root.schema.ts      # 폼 리졸버의 진입점
├── ui/
│   ├── line/
│   │   ├── LineChartPreview.tsx
│   │   ├── LineForm.tsx
│   │   └── line.schema.ts
│   ├── bar/
│   │   ├── BarChartPreview.tsx
│   │   ├── BarForm.tsx
│   │   └── bar.schema.ts
│   └── WidgetBuilderForm.tsx  # 오케스트레이터
```

### 스키마 설계

#### 시각화별 스키마 예시 (line.schema.ts)
```typescript
const LineDataSchema = z.discriminatedUnion('type', [
  MetricDataSchema,
  FormulaDataSchema
]);

const LineAdditionalFields = z.object({
  markers: z.array(MarkerSchema).optional(),
});

export const LineWidgetSchema = z.object({
  visualization: z.literal('line'),
  data: LineDataSchema,
  options: LineAdditionalFields,
});
```

#### 루트 스키마
```typescript
export const WidgetBuilderSchema = z.discriminatedUnion('visualization', [
  LineWidgetSchema,
  BarWidgetSchema,
  // ...
]);
```

### 마이그레이션 단계
1. **모델 리팩토링**: schema.ts에서 Metric/Formula 스키마를 추출하여 model/common.ts로 이동
2. **Line 모듈 생성**: ui/line/ 디렉토리 생성, line.schema.ts 생성
3. **루트 업데이트**: discriminated union 사용하도록 업데이트
