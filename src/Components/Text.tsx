import React from "react";
import ReactMarkdown from "react-markdown";
import { FONT_INTER } from "../styles/fonts";

export type TextSegment = {
  content: string;
  color?: string;
  fontWeight?: number;
  fontSize?: number;
  /**
   * Optional hyperlink for this segment.
   * When provided, the segment renders as an <a>.
   */
  url?: string;
  /**
   * When true, opens the link in a new tab (target="_blank").
   */
  openInNewTab?: boolean;
  /**
   * Optional underline toggle for links.
   */
  underline?: boolean;
};

interface TextProps {
  content: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  lineHeight?: number;
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
            segment.url ? (
              <a
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                href={segment.url}
                target={segment.openInNewTab ? "_blank" : undefined}
                rel={segment.openInNewTab ? "noopener noreferrer" : undefined}
                style={{
                  color: segment.color ?? "#1677ff",
                  cursor: "pointer",
                  textDecoration: segment.underline === false ? "none" : "underline",
                  ...(segment.fontWeight ? { fontWeight: segment.fontWeight } : null),
                  ...(segment.fontSize ? { fontSize: segment.fontSize } : null),
                }}
              >
                {segment.content}
              </a>
            ) : (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                style={{
                  ...(segment.color ? { color: segment.color } : null),
                  ...(segment.fontWeight ? { fontWeight: segment.fontWeight } : null),
                  ...(segment.fontSize ? { fontSize: segment.fontSize } : null),
                }}
              >
                {segment.content}
              </span>
            )
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
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1677ff", textDecoration: "underline" }}
              >
                {children}
              </a>
            ),
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
