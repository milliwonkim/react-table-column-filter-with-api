import React from "react";

// 필터 값의 기본 타입
export type BaseFilterValue = string | number | null;

// 필터 정보를 위한 제네릭 타입
export interface FilterInfo<T = BaseFilterValue> {
  [key: string]: T;
}

export interface ColumnInfo {
  key: string;
  label: string;
  type: "default" | "checkbox";
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  fixed?: "left" | "right";

  // 커스텀 필터 렌더러
  filterRenderer?: React.ComponentType<{
    value: { [key: string]: string | number | null };
    onChange: (filterKey: string, value: string | number | null) => void;
    column: ColumnInfo;
  }>;

  // 필터 설정 (배열로 여러 필터 지원) - 기존 방식과 호환성을 위해 유지
  headerFilterOptions?: {
    key: string;
    type: "text" | "select" | "number" | "date" | "range" | "multi-select";
    label?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
    step?: number;
    dateFormat?: string;
    debounceMs?: number;
    className?: string;
    style?: React.CSSProperties;
    searchable?: boolean;
    customFilter?: (
      value: string | number | boolean | null,
      filterValue:
        | string
        | number
        | null
        | string[]
        | { min: number; max: number }
    ) => boolean;
  }[];

  // 헤더 옵션
  headerOptions?: {
    align?: "left" | "center" | "right";
    className?: string;
    style?: React.CSSProperties;
    tooltip?: string;
    icon?: string;
    onClick?: () => void;
  };

  // 바디 옵션
  bodyOptions?: {
    align?: "left" | "center" | "right";
    className?: string;
    style?: React.CSSProperties;
    formatter?: (
      value: string | number | boolean | null,
      row: TableData
    ) => React.ReactNode;
    onClick?: (value: string | number | boolean | null, row: TableData) => void;
    tooltip?: (
      value: string | number | boolean | null,
      row: TableData
    ) => string;
    conditionalStyle?: (
      value: string | number | boolean | null,
      row: TableData
    ) => React.CSSProperties;
  };

  // 검증 옵션
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: string | number | boolean | null) => boolean | string;
  };
}

export interface FilterValue {
  [key: string]:
    | string
    | number
    | null
    | string[]
    | { min: number; max: number };
}

export interface TableData {
  id: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface TableProps {
  columnInfo: ColumnInfo[];
  data: TableData[];
  loading?: boolean;
  onFilterChange: (filters: FilterValue) => void;
  selectedRows: (string | number)[];
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  isInternalFilter?: boolean; // 내부 필터링 활성화 여부

  // 추가 옵션들
  sortable?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (row: TableData) => void;
  onCellClick?: (
    columnKey: string,
    value: string | number | boolean | null,
    row: TableData
  ) => void;
  rowClassName?: (row: TableData, index: number) => string;
  rowStyle?: (row: TableData, index: number) => React.CSSProperties;
  emptyText?: string;
  loadingText?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 테이블 설정 인터페이스
export interface TableConfig {
  showHeader?: boolean;
  showFilters?: boolean;
  showSelection?: boolean;
  showPagination?: boolean;
  showEmptyText?: boolean;
  showLoadingText?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark" | "auto";
}

// 독립적인 컬럼 관리를 위한 타입
export interface ColumnConfig {
  columns: ColumnInfo[];
}
