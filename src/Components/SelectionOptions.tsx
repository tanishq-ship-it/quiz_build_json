import React, { useState } from "react";
import Button from "./Button";

// Option types matching Button variants
type SquareOption = {
  variant: "square";
  character: string;
  size?: number;
};

type ImageCardOption = {
  variant: "imageCard";
  imageSrc: string;
  text: string;
  width?: number;
  textAlign?: "left" | "center" | "right";
  textBgColor?: string;
  textColor?: string;
  imageShape?: "none" | "circle";
  imageFill?: boolean;
};

type FlatOption = {
  variant: "flat";
  text: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // Preset size
  width?: number;
  height?: number;
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
};

type OptionItem = (SquareOption | ImageCardOption | FlatOption) & {
  id?: string | number;
  value?: string | number;
};

type SelectionMode = "radio" | "checkbox";

// Layout format: "ROWSxCOLS" e.g., "3x3", "4x1", "2x2"
type LayoutString = `${number}x${number}`;

interface SelectionOptionsProps {
  mode: SelectionMode;
  layout: LayoutString;
  options: OptionItem[];
  selectedColor?: string;
  selectedBorderWidth?: number;
  /**
   * Visual indicator for selection state.
   * - "none" (default): current behavior (no right-side circle, no neutral border)
   * - "circle": shows a right-side circle indicator (checked/unchecked) and a neutral border when unselected
   */
  indicator?: "none" | "circle";
  /**
   * Border color when not selected (only used when indicator="circle")
   */
  unselectedBorderColor?: string;
  gap?: number;
  onChange?: (selected: (string | number)[]) => void;
  onComplete?: (selected: (string | number)[]) => void; // Auto-fires for radio when autoComplete is true
  autoComplete?: boolean; // If true, radio selection triggers onComplete immediately
  defaultSelected?: (string | number)[];
}

const parseLayout = (layout: LayoutString): { rows: number; cols: number } => {
  const [rows, cols] = layout.split("x").map(Number);
  return { rows: rows || 1, cols: cols || 1 };
};

const SelectionOptions: React.FC<SelectionOptionsProps> = ({
  mode,
  layout,
  options,
  selectedColor = "#2563eb",
  selectedBorderWidth = 2,
  indicator = "none",
  unselectedBorderColor = "#e5e7eb",
  gap = 8,
  onChange,
  onComplete,
  autoComplete = false,
  defaultSelected = [],
}) => {
  const [selected, setSelected] = useState<(string | number)[]>(defaultSelected);
  const { rows, cols } = parseLayout(layout);

  const getOptionId = (option: OptionItem, index: number): string | number => {
    return option.id ?? option.value ?? index;
  };

  const isSelected = (option: OptionItem, index: number): boolean => {
    const id = getOptionId(option, index);
    return selected.includes(id);
  };

  const handleSelect = (option: OptionItem, index: number) => {
    const id = getOptionId(option, index);
    let newSelected: (string | number)[];

    if (mode === "radio") {
      // Radio: only one selection
      newSelected = [id];
    } else {
      // Checkbox: toggle selection
      if (selected.includes(id)) {
        newSelected = selected.filter((s) => s !== id);
      } else {
        newSelected = [...selected, id];
      }
    }

    setSelected(newSelected);
    onChange?.(newSelected);

    // Auto-complete for radio mode when no button exists
    if (mode === "radio" && autoComplete && onComplete) {
      onComplete(newSelected);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, auto)`,
        gap,
        width: "100%",
        boxSizing: "border-box",
        justifyItems: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {options.slice(0, rows * cols).map((option, index) => {
        const optionSelected = isSelected(option, index);
        const showCircleIndicator = indicator === "circle" && option.variant === "flat";

        // Style for the clickable wrapper - fits exactly around button
        const wrapperStyle: React.CSSProperties = {
          display: "inline-flex",
          cursor: "pointer",
          borderRadius: showCircleIndicator ? 24 : option.variant === "square" ? 8 : 16,
          border: optionSelected
            ? `${selectedBorderWidth}px solid ${selectedColor}`
            : `${selectedBorderWidth}px solid ${
                showCircleIndicator ? unselectedBorderColor : "transparent"
              }`,
          boxSizing: "border-box",
          transition: "border-color 0.15s ease",
          overflow: "hidden",
          maxWidth: "100%",
        };

        return (
          <div
            key={getOptionId(option, index)}
            style={wrapperStyle}
            onClick={() => handleSelect(option, index)}
          >
            {option.variant === "square" && (
              <Button
                variant="square"
                character={option.character}
                size={option.size ?? 60}
              />
            )}
            {option.variant === "imageCard" && (
              <Button
                variant="imageCard"
                imageSrc={option.imageSrc}
                text={option.text}
                width={option.width ?? 140}
                textAlign={option.textAlign}
                textBgColor={option.textBgColor}
                textColor={option.textColor}
                imageShape={option.imageShape}
                imageFill={option.imageFill}
              />
            )}
            {option.variant === "flat" && (
              <Button
                variant="flat"
                text={option.text}
                size={option.size}
                width={option.width}
                height={option.height}
                textAlign={option.textAlign}
                bgColor={option.bgColor}
                textColor={option.textColor}
                fontSize={option.fontSize}
                allowWrap={showCircleIndicator}
                rightIcon={
                  showCircleIndicator ? (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box",
                        border: optionSelected
                          ? `2px solid ${selectedColor}`
                          : "2px solid #c7c7c7",
                        backgroundColor: optionSelected ? selectedColor : "transparent",
                      }}
                    >
                      {optionSelected && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="#fff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  ) : undefined
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SelectionOptions;
