import React from "react";
import { FONT_INTER } from "../styles/fonts";

interface ListItem {
  icon: string;
  text: string;
}

interface ListBlockContent {
  heading: string;
  data: ListItem[];
}

interface ListBlockProps {
  // Runtime payloads can be imperfect; keep strict typing but tolerate missing data safely.
  content: ListBlockContent;
  width?: number | string;
  height?: number | string;
  bgColor?: string;
  titleColor?: string;
  textColor?: string;
  iconSize?: number;
  titleFontSize?: number;
  titleFontWeight?: number;
  itemFontSize?: number;
  itemFontWeight?: number;
}

const ListBlock: React.FC<ListBlockProps> = ({
  content,
  width = 180,
  height,
  bgColor = "#fff",
  titleColor = "#999",
  textColor = "#333",
  iconSize = 32,
  titleFontSize = 18,
  titleFontWeight = 400,
  itemFontSize = 13,
  itemFontWeight = 500,
}) => {
  const heading = content?.heading ?? "";
  const data: ListItem[] = Array.isArray(content?.data) ? content.data : [];
  const computedHeight =
    height ?? (typeof width === "number" ? width * 2 : undefined);
  const borderRadius = 16;

  return (
    <div
      style={{
        width,
        height: computedHeight,
        backgroundColor: bgColor,
        borderRadius,
        padding: 20,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
        fontFamily: FONT_INTER,
      }}
    >
      {/* Heading */}
      <div
        style={{
          color: titleColor,
          fontSize: titleFontSize,
          fontWeight: titleFontWeight,
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        {heading}
      </div>

      {/* List Items */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
          paddingBottom: 10,
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: iconSize, lineHeight: 1 }}>{item.icon}</span>
            <span
              style={{
                color: textColor,
                fontSize: itemFontSize,
                fontWeight: itemFontWeight,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListBlock;
