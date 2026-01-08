import React, { useState } from "react";
import Button from "./Button";
import type { TextSegment } from "./Text";

// Option types matching Button variants
type SquareOption = {
  variant: "square";
  character: string;
  size?: number;
};

type ImageCardOption = {
  variant: "imageCard";
  imageSrc: string;
  text?: string;
  segments?: TextSegment[];
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

type SelectionEdgeLabel = {
  text: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
};

type SelectionLabels =
  | { left?: SelectionEdgeLabel | string; right?: SelectionEdgeLabel | string }
  | [SelectionEdgeLabel | string, SelectionEdgeLabel | string];

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
  /**
   * Optional edge labels for rating-style rows (e.g. layout "1x5").
   * Renders a label under the first and last option.
   *
   * Supported shapes:
   * - { left: "Not like me", right: "Just like me" }
   * - { left: { text, textColor, fontSize }, right: { text, textColor, fontSize } }
   * - [leftLabel, rightLabel]
   */
  labels?: SelectionLabels;
}

const parseLayout = (layout: LayoutString): { rows: number; cols: number } => {
  const [rows, cols] = layout.split("x").map(Number);
  return { rows: rows || 1, cols: cols || 1 };
};

const isEdgeLabelObject = (value: unknown): value is SelectionEdgeLabel => {
  if (typeof value !== "object" || value == null) return false;
  return "text" in value && typeof (value as { text?: unknown }).text === "string";
};

const normalizeEdgeLabel = (value: SelectionEdgeLabel | string | undefined): SelectionEdgeLabel | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return { text: value };
  return value;
};

const normalizeLabels = (labels: SelectionLabels | undefined): { left?: SelectionEdgeLabel; right?: SelectionEdgeLabel } | null => {
  if (!labels) return null;

  if (Array.isArray(labels)) {
    const leftRaw = labels[0];
    const rightRaw = labels[1];

    const left =
      typeof leftRaw === "string"
        ? normalizeEdgeLabel(leftRaw)
        : isEdgeLabelObject(leftRaw)
          ? normalizeEdgeLabel(leftRaw)
          : undefined;
    const right =
      typeof rightRaw === "string"
        ? normalizeEdgeLabel(rightRaw)
        : isEdgeLabelObject(rightRaw)
          ? normalizeEdgeLabel(rightRaw)
          : undefined;

    return left || right ? { left, right } : null;
  }

  const left = normalizeEdgeLabel(labels.left);
  const right = normalizeEdgeLabel(labels.right);
  return left || right ? { left, right } : null;
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
  labels,
}) => {
  const [selected, setSelected] = useState<(string | number)[]>(defaultSelected);
  const { rows, cols } = parseLayout(layout);

  // Special-case: rating rows (1x5) should NOT animate in.
  // These screens are typically used for quick rating/emoji selection and should feel instant.
  const shouldAnimateArrive = !(rows === 1 && cols === 5);

  const edgeLabels =
    rows === 1 && cols === 5 ? normalizeLabels(labels) : null;

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
    <div style={{ width: "100%", boxSizing: "border-box" }}>
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
              className={shouldAnimateArrive ? "qb-option-arrive" : undefined}
              style={{
                ...wrapperStyle,
                // Stagger the entrance slightly (top-left -> bottom-right)
                animationDelay: shouldAnimateArrive ? `${index * 70}ms` : undefined,
              }}
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
                  text={option.text ?? ""}
                  segments={option.segments}
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

      {/* Rating labels (only for 1x5 when provided) */}
      {(edgeLabels?.left || edgeLabels?.right) && (
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap,
            width: "100%",
            boxSizing: "border-box",
            alignItems: "center",
          }}
        >
          {edgeLabels.left && (
            <div
              style={{
                gridColumn: 1,
                justifySelf: "center",
                fontSize: edgeLabels.left.fontSize ?? 14,
                fontWeight: edgeLabels.left.fontWeight ?? 500,
                color: edgeLabels.left.textColor ?? "#9ca3af",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {edgeLabels.left.text}
            </div>
          )}
          {edgeLabels.right && (
            <div
              style={{
                gridColumn: cols,
                justifySelf: "center",
                fontSize: edgeLabels.right.fontSize ?? 14,
                fontWeight: edgeLabels.right.fontWeight ?? 500,
                color: edgeLabels.right.textColor ?? "#9ca3af",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {edgeLabels.right.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectionOptions;
