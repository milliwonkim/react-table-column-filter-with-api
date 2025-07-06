import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import FilterableTable from "../components/FilterableTable";
import type { FilterValue, TableData } from "../types/table";
import apiClient from "../utils/axios";
import {
  columnInfoWithFilterRenderer,
  columnInfoWithHeaderOptions,
} from "./tableColumnInfo";

const TablePage: React.FC = React.memo(() => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [isInternalFilter, setIsInternalFilter] = useState(false);
  const [filters, setFilters] = useState<FilterValue>({});

  // React Query를 사용한 데이터 페칭 (원본 데이터)
  const {
    data: originalData = [],
    isLoading: originalLoading,
    error: originalError,
  } = useQuery({
    queryKey: ["tableData", {}], // 원본 데이터는 필터 없이 가져오기
    queryFn: async () => {
      const response = await apiClient.get("/tasks/table-data", {
        params: {},
      });

      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재호출 방지
  });

  // API 필터링을 위한 쿼리
  const {
    data: filteredData = [],
    isLoading: filteredLoading,
    error: filteredError,
  } = useQuery({
    queryKey: ["tableData", filters],
    queryFn: async () => {
      // 필터에서 빈 값 제거
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => value !== null && value !== ""
        )
      );

      const response = await apiClient.get("/tasks/table-data", {
        params: cleanFilters,
      });

      return response.data.data;
    },
    enabled:
      !isInternalFilter &&
      Object.keys(filters).some(
        (key) => filters[key] !== null && filters[key] !== ""
      ), // 내부 필터링이 아니고 필터가 있을 때만 실행
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 내부 필터링 함수
  const filterDataInternally = useCallback(
    (data: TableData[], filters: FilterValue): TableData[] => {
      let filteredData = [...data];

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          filteredData = filteredData.filter((item) => {
            const itemValue = item[key];

            if (typeof value === "string") {
              if (key === "salary" || key === "age") {
                const numValue = parseInt(value);
                return typeof itemValue === "number" && itemValue >= numValue;
              } else if (key === "hireDate") {
                return String(itemValue) === value;
              } else {
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

      return filteredData;
    },
    []
  );

  // 로딩 상태와 에러 상태 통합
  const loading = originalLoading || filteredLoading;
  const error = originalError || filteredError;

  // 테이블 데이터 결정
  const tableData = isInternalFilter
    ? filterDataInternally(originalData, filters)
    : Object.keys(filters).some(
        (key) => filters[key] !== null && filters[key] !== ""
      )
    ? filteredData
    : originalData;

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((newFilters: FilterValue) => {
    setFilters(newFilters);
  }, []);

  // 선택된 행 변경 핸들러
  const handleSelectionChange = useCallback(
    (selectedIds: (string | number)[]) => {
      setSelectedRows(selectedIds);
    },
    []
  );

  // 선택된 항목 처리 핸들러
  const handleProcessSelected = useCallback(() => {
    alert(`선택된 ID: ${selectedRows.join(", ")}`);
  }, [selectedRows]);

  // 선택 해제 핸들러
  const handleClearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  // 행 클릭 핸들러
  const handleRowClick = useCallback((row: TableData) => {
    console.log("행 클릭:", row);
  }, []);

  // 셀 클릭 핸들러
  const handleCellClick = useCallback(
    (
      columnKey: string,
      value: string | number | boolean | null,
      row: TableData
    ) => {
      console.log("셀 클릭:", columnKey, value, row);
    },
    []
  );

  // 행 스타일 핸들러
  const handleRowStyle = useCallback(() => {
    return {
      cursor: "pointer",
      transition: "background-color 0.2s",
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."}
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>직원 관리 테이블</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        필터 입력 시 포커스가 유지되며, API 응답 후에도 입력 중인 필터에
        포커스가 복원됩니다.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <p>선택된 행: {selectedRows.length}개</p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={isInternalFilter}
                onChange={(e) => setIsInternalFilter(e.target.checked)}
                style={{ margin: 0 }}
              />
              내부 필터링
            </label>
            <span style={{ fontSize: "12px", color: "#666" }}>
              {isInternalFilter ? "클라이언트에서 필터링" : "서버에서 필터링"}
            </span>
          </div>
        </div>
        {selectedRows.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleProcessSelected}
              style={{
                padding: "8px 16px",
                marginRight: "10px",
                cursor: "pointer",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              선택된 항목 처리
            </button>
            <button
              onClick={handleClearSelection}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              선택 해제
            </button>
          </div>
        )}
      </div>

      <FilterableTable
        columnInfo={columnInfoWithFilterRenderer}
        data={tableData}
        onFilterChange={handleFilterChange}
        loading={loading}
        selectedRows={selectedRows}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        rowStyle={handleRowStyle}
        emptyText="직원 데이터가 없습니다."
        loadingText="직원 데이터를 불러오는 중..."
        className="custom-table"
      />

      <h2>2. 기존 headerFilterOptions 방식 (하위 호환성)</h2>
      <p>기존 방식으로도 계속 사용할 수 있습니다.</p>
      <FilterableTable
        columnInfo={columnInfoWithHeaderOptions}
        data={tableData}
        selectedRows={selectedRows}
        onSelectionChange={handleSelectionChange}
        onFilterChange={handleFilterChange}
        onRowClick={handleRowClick}
      />

      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h3>현재 선택된 행:</h3>
        <pre>{JSON.stringify(selectedRows, null, 2)}</pre>

        <h3>현재 필터:</h3>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
    </div>
  );
});

TablePage.displayName = "TablePage";

export default TablePage;
