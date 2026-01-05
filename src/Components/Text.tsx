import React from "react";
import ReactMarkdown from "react-markdown";
import { FONT_INTER } from "../styles/fonts";

export type TextSegment = {
  content: string;
  color?: string;
  fontWeight?: number;
};

interface TextProps {
  content: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  lineHeight?: number;
  /**
   * Optional: render inline colored segments without HTML/CSS in the content string.
   * When provided, `content` is ignored.
   */
  segments?: TextSegment[];
}

const Text: React.FC<TextProps> = ({
  content,
  align = "left",
  fontSize = 16,
  color = "#333",
  fontWeight = 400,
  lineHeight = 1.5,
  segments,
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
      {Array.isArray(segments) && segments.length > 0 ? (
        <span>
          {segments.map((segment, idx) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              style={{
                ...(segment.color ? { color: segment.color } : null),
                ...(segment.fontWeight ? { fontWeight: segment.fontWeight } : null),
              }}
            >
              {segment.content}
            </span>
          ))}
        </span>
      ) : (
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
      )}
    </div>
  );
};

export default Text;
