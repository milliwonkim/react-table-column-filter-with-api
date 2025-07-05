import {
  Controller,
  Get,
  Redirect,
  Query,
  Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface FilterRequest {
  [key: string]: string | number | null;
}

interface TableData {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  age: number;
  location: string;
  salary: number;
  hireDate: string;
  status: string;
}

@Controller("tasks")
export class TasksController {
  // 샘플 데이터
  private sampleData: TableData[] = [
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      department: "개발팀",
      position: "시니어 개발자",
      age: 32,
      location: "서울",
      salary: 5000000,
      hireDate: "2020-01-15",
      status: "재직중",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      department: "디자인팀",
      position: "UI/UX 디자이너",
      age: 28,
      location: "경기",
      salary: 4000000,
      hireDate: "2021-03-20",
      status: "재직중",
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      department: "마케팅팀",
      position: "마케팅 매니저",
      age: 35,
      location: "부산",
      salary: 4500000,
      hireDate: "2019-07-10",
      status: "재직중",
    },
    {
      id: 4,
      name: "정수진",
      email: "jung@example.com",
      department: "개발팀",
      position: "주니어 개발자",
      age: 25,
      location: "인천",
      salary: 3500000,
      hireDate: "2022-02-28",
      status: "재직중",
    },
    {
      id: 5,
      name: "최동욱",
      email: "choi@example.com",
      department: "인사팀",
      position: "인사 담당자",
      age: 42,
      location: "대구",
      salary: 3800000,
      hireDate: "2020-11-05",
      status: "퇴사",
    },
    {
      id: 6,
      name: "한미영",
      email: "han@example.com",
      department: "디자인팀",
      position: "그래픽 디자이너",
      age: 29,
      location: "광주",
      salary: 3200000,
      hireDate: "2021-09-12",
      status: "재직중",
    },
    {
      id: 7,
      name: "송태호",
      email: "song@example.com",
      department: "개발팀",
      position: "백엔드 개발자",
      age: 38,
      location: "대전",
      salary: 4800000,
      hireDate: "2018-12-03",
      status: "재직중",
    },
    {
      id: 8,
      name: "윤지은",
      email: "yoon@example.com",
      department: "마케팅팀",
      position: "콘텐츠 매니저",
      age: 31,
      location: "울산",
      salary: 4200000,
      hireDate: "2020-06-18",
      status: "재직중",
    },
  ];

  @Get("docs")
  @Redirect("https://docs.nestjs.com", 302)
  getDocs(@Query("version") version) {
    if (version && version === "5") {
      return { url: "https://docs.nestjs.com/v5/" };
    }
  }

  @Get("table-data")
  @UseGuards(JwtAuthGuard)
  getTableData(
    @Query() filters: FilterRequest
  ): { data: TableData[]; total: number } {
    let filteredData = [...this.sampleData];

    // 필터 적용
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        filteredData = filteredData.filter((item) => {
          const itemValue = item[key as keyof TableData];

          if (typeof value === "string") {
            if (key === "salary") {
              // 급여는 숫자 비교
              const numValue = parseInt(value);
              return typeof itemValue === "number" && itemValue >= numValue;
            } else if (key === "age") {
              // 나이는 숫자 비교
              const numValue = parseInt(value);
              return typeof itemValue === "number" && itemValue >= numValue;
            } else if (key === "hireDate") {
              // 날짜는 정확히 일치
              return String(itemValue) === value;
            } else {
              // 문자열은 포함 여부로 검색
              return String(itemValue)
                .toLowerCase()
                .includes(value.toLowerCase());
            }
          } else if (typeof value === "number") {
            return itemValue === value;
          }

          return true;
        });
      }
    });

    return {
      data: filteredData,
      total: filteredData.length,
    };
  }

  @Get("column-info")
  @UseGuards(JwtAuthGuard)
  getColumnInfo() {
    return [
      {
        key: "name",
        label: "이름",
        type: "text",
        width: "120px",
      },
      {
        key: "email",
        label: "이메일",
        type: "text",
        width: "200px",
      },
      {
        key: "department",
        label: "부서",
        type: "select",
        options: [
          { value: "개발팀", label: "개발팀" },
          { value: "디자인팀", label: "디자인팀" },
          { value: "마케팅팀", label: "마케팅팀" },
          { value: "인사팀", label: "인사팀" },
        ],
        width: "100px",
      },
      {
        key: "position",
        label: "직급",
        type: "text",
        width: "150px",
      },
      {
        key: "age",
        label: "나이",
        type: "number",
        width: "80px",
      },
      {
        key: "location",
        label: "지역",
        type: "select",
        options: [
          { value: "서울", label: "서울" },
          { value: "부산", label: "부산" },
          { value: "대구", label: "대구" },
          { value: "인천", label: "인천" },
          { value: "광주", label: "광주" },
          { value: "대전", label: "대전" },
          { value: "울산", label: "울산" },
          { value: "세종", label: "세종" },
          { value: "경기", label: "경기" },
          { value: "강원", label: "강원" },
          { value: "충북", label: "충북" },
          { value: "충남", label: "충남" },
          { value: "전북", label: "전북" },
          { value: "전남", label: "전남" },
          { value: "경북", label: "경북" },
          { value: "경남", label: "경남" },
          { value: "제주", label: "제주" },
        ],
        width: "100px",
      },
      {
        key: "salary",
        label: "급여",
        type: "number",
        width: "100px",
      },
      {
        key: "hireDate",
        label: "입사일",
        type: "date",
        width: "120px",
      },
      {
        key: "status",
        label: "상태",
        type: "select",
        options: [
          { value: "재직중", label: "재직중" },
          { value: "퇴사", label: "퇴사" },
        ],
        width: "80px",
      },
    ];
  }
}
