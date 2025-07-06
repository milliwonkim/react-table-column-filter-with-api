import type { ColumnInfo } from "../types/table";
import {
  TextFilter,
  NumberFilter,
  SelectFilter,
  CustomFilter,
  DateRangeFilter,
  NumberRangeFilter,
} from "../components/FilterableTable";

// 새로운 filterRenderer 방식의 columnInfo
export const columnInfoWithFilterRenderer: ColumnInfo[] = [
  {
    key: "id",
    label: "ID",
    type: "default",
    width: "80px",
    filterRenderer: NumberFilter,
  },
  {
    key: "name",
    label: "이름",
    type: "default",
    width: "150px",
    filterRenderer: TextFilter,
  },
  {
    key: "email",
    label: "이메일",
    type: "default",
    width: "200px",
    filterRenderer: TextFilter,
  },
  {
    key: "age",
    label: "나이",
    type: "default",
    width: "80px",
    bodyOptions: {
      formatter: (_, row) => {
        return (
          <div>
            <div>{row.age}</div>
            <div>{row.location}</div>
          </div>
        );
      },
    },
    filterRenderer: ({ onChange, value }) => {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <input
            type="number"
            value={typeof value.age === "number" ? value.age : ""}
            onChange={(e) => {
              const numValue =
                e.target.value === "" ? null : Number(e.target.value);
              onChange("age", numValue);
            }}
            placeholder="나이 검색"
            style={{
              width: "100%",
              padding: "4px",
              fontSize: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="text"
            value={typeof value.location === "string" ? value.location : ""}
            onChange={(e) => onChange("location", e.target.value || null)}
            placeholder="지역 검색"
            style={{
              width: "100%",
              padding: "4px",
              fontSize: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>
      );
    },
  },
  {
    key: "status",
    label: "상태",
    type: "default",
    width: "100px",
    filterRenderer: (props) => (
      <SelectFilter
        {...props}
        options={[
          { value: "active", label: "활성" },
          { value: "inactive", label: "비활성" },
          { value: "pending", label: "대기중" },
        ]}
      />
    ),
  },
  {
    key: "department",
    label: "부서",
    type: "default",
    width: "120px",
    filterRenderer: (props) => (
      <SelectFilter
        {...props}
        options={[
          { value: "engineering", label: "개발팀" },
          { value: "marketing", label: "마케팅팀" },
          { value: "sales", label: "영업팀" },
          { value: "hr", label: "인사팀" },
        ]}
      />
    ),
  },
  {
    key: "joinDate",
    label: "입사일",
    type: "default",
    width: "120px",
    filterRenderer: DateRangeFilter,
  },
  {
    key: "salary",
    label: "급여",
    type: "default",
    width: "100px",
    filterRenderer: NumberRangeFilter,
  },
  {
    key: "custom",
    label: "커스텀 필터",
    type: "default",
    width: "200px",
    filterRenderer: CustomFilter,
  },
];

// 기존 headerFilterOptions 방식의 columnInfo (하위 호환성)
export const columnInfoWithHeaderOptions: ColumnInfo[] = [
  {
    key: "id",
    label: "ID",
    type: "default",
    width: "80px",
    headerFilterOptions: [
      {
        key: "id",
        type: "number",
        placeholder: "ID 검색",
      },
    ],
  },
  {
    key: "name",
    label: "이름",
    type: "default",
    width: "150px",
    headerFilterOptions: [
      {
        key: "name",
        type: "text",
        placeholder: "이름 검색",
      },
    ],
  },
  {
    key: "status",
    label: "상태",
    type: "default",
    width: "100px",
    headerFilterOptions: [
      {
        key: "status",
        type: "select",
        options: [
          { value: "active", label: "활성" },
          { value: "inactive", label: "비활성" },
        ],
      },
    ],
  },
];

// 기본 columnInfo (기존 호환성)
export const columnInfo: ColumnInfo[] = [
  {
    key: "id",
    label: "ID",
    type: "default",
    width: "80px",
  },
  {
    key: "name",
    label: "이름",
    type: "default",
    width: "150px",
  },
  {
    key: "email",
    label: "이메일",
    type: "default",
    width: "200px",
  },
  {
    key: "age",
    label: "나이",
    type: "default",
    width: "80px",
  },
  {
    key: "status",
    label: "상태",
    type: "default",
    width: "100px",
  },
  {
    key: "department",
    label: "부서",
    type: "default",
    width: "120px",
  },
  {
    key: "joinDate",
    label: "입사일",
    type: "default",
    width: "120px",
  },
  {
    key: "salary",
    label: "급여",
    type: "default",
    width: "100px",
  },
];
