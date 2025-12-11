import React from "react";
import ReactMarkdown from "react-markdown";
import { FONT_INTER } from "../styles/fonts";

interface TextProps {
  content: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  lineHeight?: number;
}

const Text: React.FC<TextProps> = ({
  content,
  align = "left",
  fontSize = 16,
  color = "#333",
  fontWeight = 400,
  lineHeight = 1.5,
}) => {
  return (
    <div
      style={{
        textAlign: align,
        fontFamily: FONT_INTER,
        fontSize,
        color,
        fontWeight,
        lineHeight,
      }}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
          strong: ({ children }) => (
            <strong style={{ fontWeight: 700 }}>{children}</strong>
          ),
          em: ({ children }) => <em>{children}</em>,
          h1: ({ children }) => (
            <h1 style={{ fontSize: fontSize * 2, margin: "0.5em 0", fontWeight: 700 }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: fontSize * 1.5, margin: "0.5em 0", fontWeight: 600 }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: fontSize * 1.25, margin: "0.5em 0", fontWeight: 600 }}>
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "0.5em 0", paddingLeft: "1.5em" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "0.5em 0", paddingLeft: "1.5em" }}>{children}</ol>
          ),
          li: ({ children }) => <li style={{ marginBottom: "0.25em" }}>{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Text;
