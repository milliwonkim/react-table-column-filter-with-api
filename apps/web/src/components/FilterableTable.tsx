import React, { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ColumnInfo,
  FilterValue,
  TableData,
  TableProps,
} from "../types/table";
import CustomSelect from "./CustomSelect";

// 필터 입력 컴포넌트를 별도로 분리하고 memo로 최적화
const FilterInput = React.memo<{
  column: ColumnInfo;
  filters: FilterValue;
  onChange: (key: string, value: string | number | null) => void;
}>(({ column, filters, onChange }) => {
  // 필터가 없으면 null 반환
  if (!column.headerFilterOptions || column.headerFilterOptions.length === 0) {
    return null;
  }

  // 여러 필터를 수직으로 배치
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {column.headerFilterOptions.map((filterConfig) => {
        const filterValue = filters[filterConfig.key];

        const handleChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
          const value = e.target.value;
          if (filterConfig.type === "number") {
            // 숫자 타입인 경우 숫자로 변환
            const numValue = value === "" ? null : Number(value);
            onChange(filterConfig.key, numValue);
          } else {
            // 다른 타입은 문자열로 처리
            onChange(filterConfig.key, value || null);
          }
        };

        const handleSelectChange = (selectedValue: string) => {
          if (selectedValue === "전체" || selectedValue === "") {
            onChange(filterConfig.key, null);
          } else {
            onChange(filterConfig.key, selectedValue);
          }
        };

        const filterStyle: React.CSSProperties = {
          width: "100%",
          padding: "4px",
          fontSize: "12px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxSizing: "border-box",
          ...filterConfig.style,
        };

        const placeholder =
          filterConfig.placeholder ||
          `${filterConfig.label || filterConfig.key} 검색`;

        switch (filterConfig.type) {
          case "select": {
            const options = [
              { value: "", label: "전체" },
              ...(filterConfig.options || []),
            ];

            return (
              <CustomSelect
                key={`${column.key}`}
                value={typeof filterValue === "string" ? filterValue : ""}
                onChange={handleSelectChange}
                options={options}
                placeholder={placeholder}
                searchable={filterConfig.searchable ?? true}
                className={filterConfig.className || ""}
                style={filterStyle}
              />
            );
          }

          case "number":
            return (
              <input
                key={`${column.key}`}
                type="number"
                value={typeof filterValue === "number" ? filterValue : ""}
                onChange={handleChange}
                placeholder={placeholder}
                min={filterConfig.min}
                max={filterConfig.max}
                step={filterConfig.step}
                className={filterConfig.className || ""}
                style={filterStyle}
              />
            );

          case "date":
            return (
              <input
                key={`${column.key}`}
                type="date"
                value={typeof filterValue === "string" ? filterValue : ""}
                onChange={handleChange}
                className={filterConfig.className || ""}
                style={filterStyle}
              />
            );

          case "text":
          default: {
            console.info(column.key);
            return (
              <input
                key={`${column.key}`}
                type="text"
                value={typeof filterValue === "string" ? filterValue : ""}
                onChange={handleChange}
                placeholder={placeholder}
                className={filterConfig.className || ""}
                style={filterStyle}
              />
            );
          }
        }
      })}
    </div>
  );
});

FilterInput.displayName = "FilterInput";

// 필터 행 컴포넌트를 별도로 분리하고 memo로 최적화
const FilterRow = React.memo<{
  columnInfo: ColumnInfo[];
  filters: FilterValue;
  onFilterChange: (key: string, value: string | number | null) => void;
  filterHeaderStyles: React.CSSProperties;
}>(({ columnInfo, filters, onFilterChange, filterHeaderStyles }) => {
  return (
    <tr style={{ backgroundColor: "#fafafa" }}>
      <th style={filterHeaderStyles}>{/* 체크박스 열은 빈 공간 */}</th>
      {columnInfo.map((column) => (
        <th
          key={`headerFilterOptions-${column.key}`}
          style={filterHeaderStyles}
        >
          {column.filterable !== false && (
            <FilterInput
              column={column}
              filters={filters}
              onChange={onFilterChange}
            />
          )}
        </th>
      ))}
    </tr>
  );
});

FilterRow.displayName = "FilterRow";

// 테이블 행을 별도 컴포넌트로 분리
const TableRow = React.memo<{
  row: TableData;
  columnInfo: ColumnInfo[];
  selectedRows: (string | number)[];
  onSelectionChange: (id: string | number, checked: boolean) => void;
  onRowClick?: (row: TableData) => void;
  onCellClick?: (
    columnKey: string,
    value: string | number | boolean | null,
    row: TableData
  ) => void;
  rowClassName?: (row: TableData, index: number) => string;
  rowStyle?: (row: TableData, index: number) => React.CSSProperties;
  index: number;
}>(
  ({
    row,
    columnInfo,
    selectedRows,
    onSelectionChange,
    onRowClick,
    onCellClick,
    rowClassName,
    rowStyle,
    index,
  }) => {
    const handleRowSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange(row.id, e.target.checked);
      },
      [row.id, onSelectionChange]
    );

    const handleRowClick = useCallback(() => {
      onRowClick?.(row);
    }, [onRowClick, row]);

    const handleCellClick = useCallback(
      (columnKey: string, value: string | number | boolean | null) => {
        onCellClick?.(columnKey, value, row);
      },
      [onCellClick, row]
    );

    // 행 스타일 계산
    const computedRowStyle = useMemo(() => {
      const baseStyle = { borderBottom: "1px solid #ddd" };
      const customStyle = rowStyle?.(row, index);
      return { ...baseStyle, ...customStyle };
    }, [row, index, rowStyle]);

    // 행 클래스명 계산
    const computedRowClassName = useMemo(() => {
      return rowClassName?.(row, index) || "";
    }, [row, index, rowClassName]);

    return (
      <tr
        style={computedRowStyle}
        className={computedRowClassName}
        onClick={handleRowClick}
      >
        <td
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={handleRowSelect}
          />
        </td>
        {columnInfo.map((column) => {
          // 일반 컬럼 처리
          const rawValue = row[column.key];
          const value = rawValue === undefined ? null : rawValue;
          const cellValue = value !== null ? String(value) : "-";

          // bodyOptions 처리
          const bodyOptions = column.bodyOptions;

          if (!bodyOptions) {
            return (
              <td
                key={`${column.key}`}
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  width: column.width || "auto",
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onClick={() => handleCellClick(column.key, value)}
              >
                {cellValue}
              </td>
            );
          }
          if (typeof bodyOptions === "object") {
            const bodyAlign = bodyOptions.align || "left";
            const bodyStyle = bodyOptions.style || {};
            const bodyClassName = bodyOptions.className || "";
            const conditionalStyle =
              bodyOptions.conditionalStyle?.(value, row) || {};
            const displayValue = bodyOptions.formatter
              ? bodyOptions.formatter(value, row)
              : cellValue;
            return (
              <td
                key={`${column.key}`}
                style={{
                  padding: "8px",
                  border: "1px solid #ddd",
                  textAlign: bodyAlign,
                  width: column.width || "auto",
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  ...bodyStyle,
                  ...conditionalStyle,
                }}
                className={bodyClassName}
                onClick={() => handleCellClick(column.key, value)}
                title={bodyOptions.tooltip?.(value, row)}
              >
                {displayValue}
              </td>
            );
          }
          return null;
        })}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

const FilterableTable: React.FC<TableProps> = React.memo(
  ({
    columnInfo,
    data,
    loading = false,
    onFilterChange,
    selectedRows,
    onSelectionChange,
    onRowClick,
    onCellClick,
    rowClassName,
    rowStyle,
    emptyText = "데이터가 없습니다.",
    loadingText = "데이터를 불러오는 중...",
    className,
    style,
    isInternalFilter = false,
  }) => {
    const [filters, setFilters] = useState<FilterValue>({});
    const [debouncedFilters, setDebouncedFilters] = useState<FilterValue>({});

    // Debounce 필터링 (API 호출용, 300ms)
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedFilters(filters);
      }, 300);

      return () => clearTimeout(timer);
    }, [filters]);

    // 내부 필터링 또는 API 호출
    useEffect(() => {
      if (isInternalFilter) {
        // 내부 필터링: 즉시 필터 적용
        onFilterChange(filters);
      } else {
        // API 호출: debounced 필터 사용
        onFilterChange(debouncedFilters);
      }
    }, [filters, debouncedFilters, onFilterChange, isInternalFilter]);

    const handleFilterChange = useCallback(
      (key: string, value: string | number | null) => {
        setFilters((prev) => ({
          ...prev,
          [key]: value === "" ? null : value,
        }));
      },
      []
    );

    const handleSelectAll = useCallback(
      (checked: boolean) => {
        if (checked) {
          onSelectionChange(data.map((item) => item.id));
        } else {
          onSelectionChange([]);
        }
      },
      [data, onSelectionChange]
    );

    const handleSelectRow = useCallback(
      (id: string | number, checked: boolean) => {
        if (checked) {
          onSelectionChange([...selectedRows, id]);
        } else {
          onSelectionChange(selectedRows.filter((rowId) => rowId !== id));
        }
      },
      [selectedRows, onSelectionChange]
    );

    // 메모이제이션된 계산값들
    const isAllSelected = useMemo(
      () => data.length > 0 && selectedRows.length === data.length,
      [data.length, selectedRows.length]
    );

    const isIndeterminate = useMemo(
      () => selectedRows.length > 0 && selectedRows.length < data.length,
      [selectedRows.length, data.length]
    );

    // 테이블 헤더 스타일 메모이제이션
    const getHeaderStyles = useCallback(
      (column: ColumnInfo) => ({
        padding: "8px",
        border: "1px solid #ddd",
        textAlign: "left" as const,
        width: column.width || "auto",
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap" as const,
      }),
      []
    );

    const filterHeaderStyles = useMemo(
      () => ({
        padding: "4px",
        border: "1px solid #ddd",
        verticalAlign: "top",
        overflow: "hidden",
        maxWidth: "100%",
      }),
      []
    );

    const checkboxHeaderStyles = useMemo(
      () => ({
        padding: "8px",
        border: "1px solid #ddd",
        width: "50px",
      }),
      []
    );

    return (
      <div style={{ overflowX: "auto", ...style }} className={className}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            tableLayout: "fixed",
          }}
        >
          <thead>
            {/* 첫 번째 헤더 행: 라벨과 체크박스 */}
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={checkboxHeaderStyles}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              {columnInfo.map((column) => {
                // headerOptions 처리
                const headerOptions = column.headerOptions;
                if (!headerOptions) {
                  return (
                    <th key={column.key} style={getHeaderStyles(column)}>
                      {column.label}
                    </th>
                  );
                }
                if (typeof headerOptions === "object") {
                  const headerAlign = headerOptions.align || "left";
                  const headerStyle = headerOptions.style || {};
                  const headerClassName = headerOptions.className || "";
                  return (
                    <th
                      key={column.key}
                      style={{
                        ...getHeaderStyles(column),
                        textAlign: headerAlign,
                        ...headerStyle,
                      }}
                      className={headerClassName}
                      title={headerOptions.tooltip}
                      onClick={headerOptions.onClick}
                    >
                      {headerOptions.icon && (
                        <span style={{ marginRight: "4px" }}>
                          {headerOptions.icon}
                        </span>
                      )}
                      {column.label}
                    </th>
                  );
                }
                return null;
              })}
            </tr>

            {/* 두 번째 헤더 행: 필터 입력 */}
            <FilterRow
              columnInfo={columnInfo}
              filters={filters}
              onFilterChange={handleFilterChange}
              filterHeaderStyles={filterHeaderStyles}
            />
          </thead>

          <tbody>
            {data.map((row, index) => {
              if (loading) {
                return (
                  <tr>
                    <td colSpan={data.length}>
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        {loadingText}
                      </div>
                    </td>
                  </tr>
                );
              }
              return (
                <TableRow
                  key={row.id}
                  row={row}
                  columnInfo={columnInfo}
                  selectedRows={selectedRows}
                  onSelectionChange={handleSelectRow}
                  onRowClick={onRowClick}
                  onCellClick={onCellClick}
                  rowClassName={rowClassName}
                  rowStyle={rowStyle}
                  index={index}
                />
              );
            })}
          </tbody>
        </table>

        {data.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            {filters &&
            Object.keys(filters).some(
              (key) => filters[key] !== null && filters[key] !== ""
            )
              ? "필터 조건에 맞는 데이터가 없습니다."
              : emptyText}
          </div>
        )}
      </div>
    );
  }
);

FilterableTable.displayName = "FilterableTable";

export default FilterableTable;
