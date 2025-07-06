import type { ColumnInfo } from "../types/table";

const columnInfo: ColumnInfo[] = [
  {
    key: "name",
    label: "이름",
    type: "default",
    width: "120px",
    sortable: true,
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "직원의 이름",
      icon: "👤",
    },
    headerFilterOptions: [
      {
        key: "name",
        type: "text",
        placeholder: "이름으로 검색",
      },
    ],
    bodyOptions: {
      align: "center",
      formatter: (value) => (
        <span style={{ fontWeight: "bold", color: "#007bff" }}>
          {String(value)}
        </span>
      ),
      onClick: (value, row) => {
        console.info({ value });
        alert(`${String(row.name)}의 상세 정보를 보여줍니다.`);
      },
      tooltip: (_value, row) => `${String(row.name)} 클릭하여 상세보기`,
    },
  },
  {
    key: "email",
    label: "이메일",
    type: "default",
    width: "200px",
    filterable: true,
    headerOptions: {
      align: "left",
      tooltip: "직원의 이메일 주소",
      icon: "📧",
    },
    headerFilterOptions: [
      {
        key: "email",
        type: "text",
        placeholder: "이메일로 검색",
      },
    ],
    bodyOptions: {
      align: "left",
      formatter: (value) => (
        <a
          href={`mailto:${value}`}
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          {String(value)}
        </a>
      ),
      tooltip: (value) => `${value}로 이메일 보내기`,
    },
  },
  {
    key: "department",
    label: "부서",
    type: "default",
    width: "100px",
    sortable: true,
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "소속 부서",
      icon: "🏢",
    },
    headerFilterOptions: [
      {
        key: "department",
        type: "select",
        options: [
          { value: "개발팀", label: "개발팀" },
          { value: "디자인팀", label: "디자인팀" },
          { value: "마케팅팀", label: "마케팅팀" },
          { value: "인사팀", label: "인사팀" },
        ],
      },
    ],
    bodyOptions: {
      align: "center",
      conditionalStyle: (value) => {
        const colors = {
          개발팀: { backgroundColor: "#e3f2fd" },
          디자인팀: { backgroundColor: "#f3e5f5" },
          마케팅팀: { backgroundColor: "#e8f5e8" },
          인사팀: { backgroundColor: "#fff3e0" },
        };
        return colors[value as keyof typeof colors] || {};
      },
    },
  },
  {
    key: "position",
    label: "직급",
    type: "default",
    width: "150px",
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "직원의 직급",
      icon: "🎯",
    },
    headerFilterOptions: [
      {
        key: "position",
        type: "text",
        placeholder: "직급으로 검색",
      },
    ],
    bodyOptions: {
      align: "center",
      formatter: (value) => (
        <span
          style={{
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
          }}
        >
          {String(value)}
        </span>
      ),
    },
  },
  {
    key: "age",
    label: "나이",
    type: "default",
    width: "80px",
    sortable: true,
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "직원의 나이",
      icon: "🎂",
    },
    headerFilterOptions: [
      {
        key: "age",
        type: "number",
        placeholder: "나이 이상",
        min: 0,
        max: 100,
      },
    ],
    bodyOptions: {
      align: "center",
      formatter: (value) => (
        <span style={{ fontWeight: "bold", color: "#007bff" }}>{value}세</span>
      ),
      conditionalStyle: (value) => {
        const age = Number(value);
        if (age >= 50) return { backgroundColor: "#fff3cd" };
        if (age >= 40) return { backgroundColor: "#d1ecf1" };
        if (age >= 30) return { backgroundColor: "#e8f5e8" };
        return {};
      },
    },
  },
  {
    key: "location",
    label: "지역",
    type: "default",
    width: "100px",
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "직원의 근무 지역",
      icon: "📍",
    },
    headerFilterOptions: [
      {
        key: "location",
        type: "select",
        placeholder: "지역 선택",
        options: [
          { value: "서울", label: "서울" },
          { value: "부산", label: "부산" },
          { value: "대구", label: "대구" },
          { value: "인천", label: "인천" },
          { value: "광주", label: "광주" },
          { value: "대전", label: "대전" },
          { value: "울산", label: "울산" },
          { value: "경기", label: "경기" },
        ],
      },
    ],
    bodyOptions: {
      align: "center",
      formatter: (value) => (
        <span style={{ color: "#666" }}>{String(value)}</span>
      ),
    },
  },
  {
    key: "salary",
    label: "급여",
    type: "default",
    width: "200px",
    sortable: true,
    filterable: true,
    headerFilterOptions: [
      {
        key: "salary",
        type: "number",
        placeholder: "최소 급여",
        min: 0,
      },
    ],
    bodyOptions: {
      align: "right",
      formatter: (value) => {
        const numValue = Number(value);
        return numValue.toLocaleString("ko-KR") + "원";
      },
    },
  },
  {
    key: "hireDate",
    label: "입사일",
    type: "default",
    sortable: true,
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "입사 날짜",
      icon: "📅",
    },
    headerFilterOptions: [
      {
        key: "hireDate",
        type: "date",
      },
    ],
    bodyOptions: {
      align: "center",
      formatter: (value) => {
        const date = new Date(String(value));
        return date.toLocaleDateString("ko-KR");
      },
      conditionalStyle: (value) => {
        const hireDate = new Date(String(value));
        const years =
          (new Date().getTime() - hireDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365);
        if (years >= 5)
          return { backgroundColor: "#fff3cd", fontWeight: "bold" };
        if (years >= 3) return { backgroundColor: "#d1ecf1" };
        return {};
      },
    },
  },
  {
    key: "status",
    label: "상태",
    type: "default",
    width: "80px",
    filterable: true,
    headerOptions: {
      align: "center",
      tooltip: "재직 상태",
      icon: "📊",
    },
    headerFilterOptions: [
      {
        key: "status",
        type: "select",
        options: [
          { value: "재직중", label: "재직중" },
          { value: "퇴사", label: "퇴사" },
        ],
      },
    ],
    bodyOptions: {
      align: "center",
      formatter: (value) => (
        <span
          style={{
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: value === "재직중" ? "#28a745" : "#dc3545",
          }}
        >
          {String(value)}
        </span>
      ),
    },
  },
];
export { columnInfo };
