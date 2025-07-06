# FilterableTable 컴포넌트

## 새로운 filterRenderer 기능

`FilterableTable` 컴포넌트는 이제 `filterRenderer` 속성을 통해 커스텀 필터 컴포넌트를 지원합니다. 이는 기존의 `headerFilterOptions` 방식보다 더 유연하고 재사용 가능한 필터 시스템을 제공합니다.

## 기본 사용법

### 1. 커스텀 필터 컴포넌트 정의

```tsx
const MyCustomFilter: React.FC<{
  value: { [key: string]: string | number | null };
  onChange: (filterKey: string, value: string | number | null) => void;
  column: ColumnInfo;
}> = ({ value, onChange, column }) => {
  return (
    <input
      type="text"
      value={typeof value.name === "string" ? value.name : ""}
      onChange={(e) => onChange("name", e.target.value || null)}
      placeholder={`${column.label} 검색`}
    />
  );
};
```

### 2. columnInfo에 filterRenderer 추가

```tsx
const columnInfo: ColumnInfo[] = [
  {
    key: "name",
    label: "이름",
    type: "default",
    filterRenderer: MyCustomFilter,
  },
  {
    key: "age",
    label: "나이",
    type: "default",
    filterRenderer: NumberFilter,
  },
  {
    key: "status",
    label: "상태",
    type: "default",
    filterRenderer: (props) => (
      <SelectFilter
        {...props}
        options={[
          { value: "active", label: "활성" },
          { value: "inactive", label: "비활성" },
        ]}
      />
    ),
  },
];
```

## 제공되는 기본 필터 컴포넌트

### TextFilter

텍스트 입력 필터

```tsx
{
  key: "name",
  label: "이름",
  type: "default",
  filterRenderer: TextFilter,
}
```

### NumberFilter

숫자 입력 필터

```tsx
{
  key: "age",
  label: "나이",
  type: "default",
  filterRenderer: NumberFilter,
}
```

### SelectFilter

선택 박스 필터

```tsx
{
  key: "status",
  label: "상태",
  type: "default",
  filterRenderer: (props) => (
    <SelectFilter
      {...props}
      options={[
        { value: "active", label: "활성" },
        { value: "inactive", label: "비활성" },
      ]}
    />
  ),
}
```

## 다중 필터 컴포넌트

### CustomFilter

여러 입력 필드를 가진 커스텀 필터 (이름, 나이, 지역)

```tsx
const CustomFilter: React.FC<{
  value: { [key: string]: string | number | null };
  onChange: (filterKey: string, value: string | number | null) => void;
  column: ColumnInfo;
}> = ({ value, onChange, column }) => {
  const nameValue = value.name || "";
  const ageValue = value.age || "";
  const locationValue = value.location || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <input
        type="text"
        value={typeof nameValue === "string" ? nameValue : ""}
        onChange={(e) => onChange("name", e.target.value || null)}
        placeholder={`${column.label} 검색`}
      />
      <input
        type="number"
        value={typeof ageValue === "number" ? ageValue : ""}
        onChange={(e) => {
          const numValue =
            e.target.value === "" ? null : Number(e.target.value);
          onChange("age", numValue);
        }}
        placeholder="나이 검색"
      />
      <input
        type="text"
        value={typeof locationValue === "string" ? locationValue : ""}
        onChange={(e) => onChange("location", e.target.value || null)}
        placeholder="지역 검색"
      />
    </div>
  );
};
```

### DateRangeFilter

날짜 범위 필터

```tsx
const DateRangeFilter: React.FC<{
  value: { [key: string]: string | number | null };
  onChange: (filterKey: string, value: string | number | null) => void;
  column: ColumnInfo;
}> = ({ onChange, column }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <input
        type="date"
        onChange={(e) =>
          onChange(`${column.key}_start`, e.target.value || null)
        }
        placeholder="시작일"
      />
      <input
        type="date"
        onChange={(e) => onChange(`${column.key}_end`, e.target.value || null)}
        placeholder="종료일"
      />
    </div>
  );
};
```

### NumberRangeFilter

숫자 범위 필터

```tsx
const NumberRangeFilter: React.FC<{
  value: { [key: string]: string | number | null };
  onChange: (filterKey: string, value: string | number | null) => void;
  column: ColumnInfo;
}> = ({ onChange, column }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <input
        type="number"
        onChange={(e) => {
          const numValue =
            e.target.value === "" ? null : Number(e.target.value);
          onChange(`${column.key}_min`, numValue);
        }}
        placeholder="최소값"
      />
      <input
        type="number"
        onChange={(e) => {
          const numValue =
            e.target.value === "" ? null : Number(e.target.value);
          onChange(`${column.key}_max`, numValue);
        }}
        placeholder="최대값"
      />
    </div>
  );
};
```

## 고급 사용법

### 조건부 필터 렌더링

```tsx
const ConditionalFilter: React.FC<{
  value: { [key: string]: string | number | null };
  onChange: (filterKey: string, value: string | number | null) => void;
  column: ColumnInfo;
}> = ({ value, onChange, column }) => {
  // column 정보를 기반으로 다른 필터 렌더링
  if (column.key === "status") {
    return <SelectFilter {...props} options={statusOptions} />;
  }

  if (column.key === "age") {
    return <NumberFilter {...props} />;
  }

  return <TextFilter {...props} />;
};
```

## 필터 컴포넌트 Props

모든 필터 컴포넌트는 다음 props를 받습니다:

- `value: { [key: string]: string | number | null }` - 현재 필터 값들
- `onChange: (filterKey: string, value: string | number | null) => void` - 값 변경 콜백 (필터 키와 값 함께 전달)
- `column: ColumnInfo` - 컬럼 정보

## 다중 필터 키 사용법

여러 입력 필드가 있는 필터 컴포넌트에서는 각 입력 필드마다 고유한 필터 키를 사용할 수 있습니다:

```tsx
// 예시: CustomFilter에서 생성되는 필터 키들
onChange("name", "김철수"); // 이름 검색
onChange("age", 25); // 나이 검색
onChange("location", "서울"); // 지역 검색

// 예시: salary 컬럼에 대한 범위 필터
onChange("salary_min", 30000); // 최소 급여
onChange("salary_max", 50000); // 최대 급여

// 예시: joinDate 컬럼에 대한 날짜 범위 필터
onChange("joinDate_start", "2023-01-01"); // 시작일
onChange("joinDate_end", "2023-12-31"); // 종료일
```

## 하위 호환성

기존의 `headerFilterOptions` 방식도 계속 지원됩니다. `filterRenderer`가 없으면 `headerFilterOptions`를 사용합니다.

```tsx
// 기존 방식 (여전히 지원됨)
{
  key: "name",
  label: "이름",
  type: "default",
  headerFilterOptions: [
    {
      key: "name",
      type: "text",
      placeholder: "이름 검색",
    },
  ],
}
```

## 장점

1. **유연성**: 어떤 형태의 필터든 구현 가능
2. **재사용성**: 필터 컴포넌트를 다른 곳에서도 사용 가능
3. **타입 안전성**: TypeScript로 완전한 타입 지원
4. **커스터마이징**: 스타일링과 동작을 완전히 제어 가능
5. **하위 호환성**: 기존 코드 수정 없이 사용 가능
6. **다중 필터 지원**: 하나의 컬럼에 여러 필터 입력 필드 지원
7. **간단한 타입**: 복잡한 제네릭 없이 직관적인 타입 사용
