import React, { useState } from "react";
import { FONT_INTER } from "../styles/fonts";

type InputProps = {
  type?: "text" | "email" | "tel" | "number" | "password" | "url";
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  width?: string | number;
  required?: boolean;
  borderColor?: string;
  focusColor?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  padding?: number;
  borderRadius?: number;
};

const Input: React.FC<InputProps> = ({
  type = "text",
  value = "",
  onChange,
  placeholder,
  label,
  width = "100%",
  required = false,
  borderColor = "#e5e7eb",
  focusColor = "#2563eb",
  bgColor = "#fff",
  textColor = "#1f2937",
  fontSize = 16,
  padding = 12,
  borderRadius = 12,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: typeof width === "number" ? width : width,
        fontFamily: FONT_INTER,
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#374151",
            marginLeft: 2,
          }}
        >
          {label}
          {required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          padding,
          fontSize,
          border: `1.5px solid ${isFocused ? focusColor : borderColor}`,
          borderRadius,
          outline: "none",
          backgroundColor: bgColor,
          color: textColor,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxSizing: "border-box",
          boxShadow: isFocused ? `0 0 0 2px ${focusColor}33` : "none",
        }}
      />
    </div>
  );
};

export default Input;
