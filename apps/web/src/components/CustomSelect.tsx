import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  FloatingPortal,
  FloatingFocusManager,
  FloatingOverlay,
} from "@floating-ui/react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  searchable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  searchable = true,
  className = "",
  style = {},
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNavigation]
  );

  // 검색어에 따른 필터링된 옵션
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue, searchable]);

  // 선택된 옵션 찾기
  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchValue("");
      setActiveIndex(null);
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      setActiveIndex(null);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && activeIndex !== null) {
        e.preventDefault();
        const option = filteredOptions[activeIndex];
        if (option) {
          handleSelect(option.value);
        }
      }
    },
    [activeIndex, filteredOptions, handleSelect]
  );

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`custom-select ${className}`}
        style={{
          position: "relative",
          width: "100%",
          ...style,
        }}
      >
        <input
          type="text"
          value={
            isOpen && searchable ? searchValue : selectedOption?.label || ""
          }
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "4px 8px",
            fontSize: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            backgroundColor: disabled ? "#f5f5f5" : "white",
            cursor: disabled ? "not-allowed" : "text",
          }}
          readOnly={!isOpen || !searchable}
        />
        <div
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          ▼
        </div>
      </div>

      <FloatingPortal>
        {isOpen && (
          <FloatingOverlay lockScroll>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={{
                  ...floatingStyles,
                  zIndex: 1000,
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  maxHeight: "200px",
                  overflowY: "auto",
                  minWidth: "150px",
                }}
                {...getFloatingProps()}
              >
                {filteredOptions.length === 0 ? (
                  <div
                    style={{
                      padding: "8px 12px",
                      color: "#666",
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      ref={(el) => {
                        listRef.current[index] = el;
                      }}
                      {...getItemProps({
                        onClick: () => handleSelect(option.value),
                      })}
                      style={{
                        padding: "8px 12px",
                        fontSize: "12px",
                        cursor: "pointer",
                        backgroundColor:
                          activeIndex === index ? "#f0f0f0" : "transparent",
                        color: option.value === value ? "#007bff" : "inherit",
                        fontWeight: option.value === value ? "bold" : "normal",
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {option.label}
                    </div>
                  ))
                )}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};

export default CustomSelect;
