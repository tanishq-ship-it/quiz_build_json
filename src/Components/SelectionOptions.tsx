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
  width?: number;
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
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
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, auto)`,
        gap,
        width: "100%",
        boxSizing: "border-box",
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      {options.slice(0, rows * cols).map((option, index) => {
        const optionSelected = isSelected(option, index);

        // Style for the clickable wrapper - fits exactly around button
        const wrapperStyle: React.CSSProperties = {
          display: "inline-flex",
          cursor: "pointer",
          borderRadius: option.variant === "square" ? 8 : 16,
          border: optionSelected
            ? `${selectedBorderWidth}px solid ${selectedColor}`
            : `${selectedBorderWidth}px solid transparent`,
          boxSizing: "border-box",
          transition: "border-color 0.15s ease",
          overflow: "hidden",
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
                width={option.width ?? 280}
                textAlign={option.textAlign}
                bgColor={option.bgColor}
                textColor={option.textColor}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SelectionOptions;
