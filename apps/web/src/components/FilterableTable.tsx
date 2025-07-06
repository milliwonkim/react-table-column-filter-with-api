import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
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
  onKeyUp: () => void;
  onFocus: (columnKey: string, filterKey: string) => void;
  onBlur: () => void;
  focusedFilter: string | null;
  getFilterKey: (columnKey: string, filterKey: string) => string;
}>(
  ({
    column,
    filters,
    onChange,
    onKeyUp,
    onFocus,
    onBlur,
    focusedFilter,
    getFilterKey,
  }) => {
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const cursorPositions = useRef<{ [key: string]: number }>({});

    // 포커스 복원 효과
    useEffect(() => {
      column.headerFilterOptions?.forEach((filterConfig) => {
        const filterId = getFilterKey(column.key, filterConfig.key);
        if (focusedFilter === filterId && inputRefs.current[filterId]) {
          const input = inputRefs.current[filterId];
          input?.focus();

          // 저장된 커서 위치로 복원
          const savedPosition = cursorPositions.current[filterId];
          if (savedPosition !== undefined && input) {
            // 입력값 길이를 초과하지 않도록 제한
            const maxPosition = input.value.length;
            const position = Math.min(savedPosition, maxPosition);
            input.setSelectionRange(position, position);
          }
        }
      });
    }, [focusedFilter, column.key, column.headerFilterOptions, getFilterKey]);

    // 필터가 없으면 null 반환
    if (
      !column.headerFilterOptions ||
      column.headerFilterOptions.length === 0
    ) {
      return null;
    }

    // 여러 필터를 수직으로 배치
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {column.headerFilterOptions.map((filterConfig) => {
          const filterValue = filters[filterConfig.key];
          const filterId = getFilterKey(column.key, filterConfig.key);

          const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
          ) => {
            const value = e.target.value;

            // HTMLInputElement인 경우에만 커서 위치 계산
            if (e.target instanceof HTMLInputElement) {
              const input = e.target;
              const currentCursorPosition = input.selectionStart || 0;

              // 이전 값 가져오기
              const previousValue =
                typeof filterValue === "string" ? filterValue : "";

              // 값이 변경된 위치 찾기
              let newCursorPosition = currentCursorPosition;

              if (value.length > previousValue.length) {
                // 문자 추가된 경우
                // 추가된 문자가 삽입된 위치를 찾기
                for (
                  let i = 0;
                  i < Math.min(value.length, previousValue.length);
                  i++
                ) {
                  if (value[i] !== previousValue[i]) {
                    newCursorPosition = i + 1; // 삽입된 위치 다음으로 커서 이동
                    break;
                  }
                }
                if (
                  value.length > previousValue.length &&
                  value.startsWith(previousValue)
                ) {
                  // 끝에 추가된 경우
                  newCursorPosition = previousValue.length + 1;
                }
              } else if (value.length < previousValue.length) {
                // 문자 삭제된 경우
                // 삭제된 위치를 찾기
                for (
                  let i = 0;
                  i < Math.min(value.length, previousValue.length);
                  i++
                ) {
                  if (value[i] !== previousValue[i]) {
                    newCursorPosition = i; // 삭제된 위치에 커서 유지
                    break;
                  }
                }
                if (
                  value.length < previousValue.length &&
                  previousValue.startsWith(value)
                ) {
                  // 끝에서 삭제된 경우
                  newCursorPosition = value.length;
                }
              }

              // 커서 위치 저장 (계산된 위치 사용)
              cursorPositions.current[filterId] = newCursorPosition;
            }

            if (filterConfig.type === "number") {
              // 숫자 타입인 경우 숫자로 변환
              const numValue = value === "" ? null : Number(value);
              onChange(filterConfig.key, numValue);
            } else {
              // 다른 타입은 문자열로 처리
              onChange(filterConfig.key, value || null);
            }
          };

          const handleInput = () => {
            // 입력 중에도 커서 위치 저장 (HTMLInputElement인 경우에만)
            const input = inputRefs.current[filterId];
            if (input && input instanceof HTMLInputElement) {
              const currentPosition = input.selectionStart || 0;
              // onChange에서 계산한 위치가 없거나 현재 위치가 더 정확한 경우에만 저장
              if (
                cursorPositions.current[filterId] === undefined ||
                Math.abs(
                  currentPosition - (cursorPositions.current[filterId] || 0)
                ) <= 1
              ) {
                cursorPositions.current[filterId] = currentPosition;
              }
            }
          };

          const handleSelect = () => {
            // 선택 영역 변경 시에도 커서 위치 저장 (HTMLInputElement인 경우에만)
            const input = inputRefs.current[filterId];
            if (input && input instanceof HTMLInputElement) {
              cursorPositions.current[filterId] = input.selectionStart || 0;
            }
          };

          const handleSelectChange = (selectedValue: string) => {
            if (selectedValue === "전체" || selectedValue === "") {
              onChange(filterConfig.key, null);
            } else {
              onChange(filterConfig.key, selectedValue);
            }
          };

          const handleKeyUp = () => {
            // HTMLInputElement인 경우에만 커서 위치 저장
            const input = inputRefs.current[filterId];
            if (input && input instanceof HTMLInputElement) {
              cursorPositions.current[filterId] = input.selectionStart || 0;
            }
            onKeyUp();
          };

          const handleMouseUp = () => {
            // HTMLInputElement인 경우에만 커서 위치 저장
            const input = inputRefs.current[filterId];
            if (input && input instanceof HTMLInputElement) {
              cursorPositions.current[filterId] = input.selectionStart || 0;
            }
            onKeyUp();
          };

          const handleFocus = () => {
            onFocus(column.key, filterConfig.key);
          };

          const handleBlur = () => {
            onBlur();
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
                  key={`${column.key}-${filterConfig.key}`}
                  value={typeof filterValue === "string" ? filterValue : ""}
                  onChange={handleSelectChange}
                  options={options}
                  placeholder={placeholder}
                  searchable={filterConfig.searchable ?? true}
                  className={filterConfig.className || ""}
                  style={filterStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              );
            }

            case "number":
              return (
                <input
                  key={`${column.key}-${filterConfig.key}`}
                  ref={(el) => {
                    inputRefs.current[filterId] = el;
                  }}
                  type="number"
                  value={typeof filterValue === "number" ? filterValue : ""}
                  onChange={handleChange}
                  onInput={handleInput}
                  onSelect={handleSelect}
                  onKeyUp={handleKeyUp}
                  onMouseUp={handleMouseUp}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
                  key={`${column.key}-${filterConfig.key}`}
                  ref={(el) => {
                    inputRefs.current[filterId] = el;
                  }}
                  type="date"
                  value={typeof filterValue === "string" ? filterValue : ""}
                  onChange={handleChange}
                  onInput={handleInput}
                  onSelect={handleSelect}
                  onKeyUp={handleKeyUp}
                  onMouseUp={handleMouseUp}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={filterConfig.className || ""}
                  style={filterStyle}
                />
              );

            case "text":
            default: {
              return (
                <input
                  key={`${column.key}-${filterConfig.key}`}
                  ref={(el) => {
                    inputRefs.current[filterId] = el;
                  }}
                  type="text"
                  value={typeof filterValue === "string" ? filterValue : ""}
                  onChange={handleChange}
                  onInput={handleInput}
                  onSelect={handleSelect}
                  onKeyUp={handleKeyUp}
                  onMouseUp={handleMouseUp}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
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
  }
);

FilterInput.displayName = "FilterInput";

// 필터 행 컴포넌트를 별도로 분리하고 memo로 최적화
const FilterRow = React.memo<{
  columnInfo: ColumnInfo[];
  filters: FilterValue;
  onFilterChange: (key: string, value: string | number | null) => void;
  onFilterKeyUp: () => void;
  onFilterFocus: (columnKey: string, filterKey: string) => void;
  onFilterBlur: () => void;
  focusedFilter: string | null;
  filterHeaderStyles: React.CSSProperties;
  getFilterKey: (columnKey: string, filterKey: string) => string;
}>(
  ({
    columnInfo,
    filters,
    onFilterChange,
    onFilterKeyUp,
    onFilterFocus,
    onFilterBlur,
    focusedFilter,
    filterHeaderStyles,
    getFilterKey,
  }) => {
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
                onKeyUp={onFilterKeyUp}
                onFocus={onFilterFocus}
                onBlur={onFilterBlur}
                focusedFilter={focusedFilter}
                getFilterKey={getFilterKey}
              />
            )}
          </th>
        ))}
      </tr>
    );
  }
);

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
    getRowKey,
    getFilterKey = (columnKey: string, filterKey: string) =>
      `${columnKey}-${filterKey}`,
    isInternalFilter = false,
  }) => {
    const [filters, setFilters] = useState<FilterValue>({});
    const [debouncedFilters, setDebouncedFilters] = useState<FilterValue>({});
    const [focusedFilter, setFocusedFilter] = useState<string | null>(null);

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

    // 실시간 커서 위치 추적 핸들러
    const handleFilterKeyUp = useCallback(() => {
      // 커서 위치 추적은 FilterInput 컴포넌트 내부에서 처리
    }, []);

    // 포커스 관리 핸들러
    const handleFilterFocus = useCallback(
      (columnKey: string, filterKey: string) => {
        setFocusedFilter(getFilterKey(columnKey, filterKey));
      },
      [getFilterKey]
    );

    const handleFilterBlur = useCallback(() => {
      setFocusedFilter(null);
    }, []);

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

    if (loading && data.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          {loadingText}
        </div>
      );
    }

    return (
      <div style={{ overflowX: "auto", ...style }} className={className}>
        {/* 로딩 인디케이터 (데이터가 있을 때만) */}
        {loading && data.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "8px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #dee2e6",
              fontSize: "12px",
              color: "#666",
            }}
          >
            🔄 서버에서 데이터를 업데이트하는 중...
          </div>
        )}

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
              onFilterKeyUp={handleFilterKeyUp}
              onFilterFocus={handleFilterFocus}
              onFilterBlur={handleFilterBlur}
              focusedFilter={focusedFilter}
              filterHeaderStyles={filterHeaderStyles}
              getFilterKey={getFilterKey}
            />
          </thead>

          <tbody>
            {data.map((row, index) => (
              <TableRow
                key={getRowKey(row)}
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
            ))}
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
