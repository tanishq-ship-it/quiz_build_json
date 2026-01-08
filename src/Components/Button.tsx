import React from "react";
import { FONT_INTER } from "../styles/fonts";
import type { TextSegment } from "./Text";

// --- Internal Button Components ---

// 1. Square Button
interface SquareButtonProps {
  character: string;
  size?: number;
  fontWeight?: number;
  fontSize?: number;
  onClick?: () => void;
}

const SquareButton: React.FC<SquareButtonProps> = ({
  character,
  size = 30,
  fontWeight = 600,
  fontSize,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        padding: 0,
        boxSizing: "border-box",
        borderRadius: 6,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        color: "#333",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_INTER,
        fontSize: fontSize ?? size * 0.5,
        fontWeight,
      }}
    >
      {character.charAt(0)}
    </button>
  );
};

// 2. Image Card Button
interface ImageCardButtonProps {
  imageSrc: string;
  text: string;
  segments?: TextSegment[];
  width?: number;
  textAlign?: "left" | "center" | "right";
  textBgColor?: string;
  textColor?: string;
  imageShape?: "none" | "circle";
  imageFill?: boolean; // New: fill entire image area
  onClick?: () => void;
}

const ImageCardButton: React.FC<ImageCardButtonProps> = ({
  imageSrc,
  text,
  segments,
  width = 150,
  textAlign = "center",
  textBgColor,
  textColor = "#333",
  imageShape = "none",
  imageFill = false,
  onClick,
}) => {
  const borderRadius = 16;
  const imageSize = width * 0.55;

  const hasSegments =
    Array.isArray(segments) && segments.some((s) => typeof s.content === "string" && s.content.trim() !== "");

  // Check if text is provided (string fallback)
  const hasText = hasSegments || (text && text.trim() !== "");

  const altText = hasSegments ? segments.map((s) => s.content).join("") : (text || "image");

  // If no text, make it a square with 5% padding
  const height = hasText ? Math.round(width * 1.25) : width;
  const imagePadding = hasText ? (imageFill ? 0 : 12) : width * 0.05;

  // Use provided textBgColor, or default to transparent (no colored footer)
  const finalTextBgColor = textBgColor || "transparent";
  const hasTextBg = textBgColor && textBgColor !== "transparent";

  const renderLabel = (): React.ReactNode => {
    // 1) Segments path: support "\n" inside segment content to force line breaks.
    if (hasSegments && segments) {
      const lines: TextSegment[][] = [[]];

      segments.forEach((seg) => {
        const parts = String(seg.content ?? "").split("\n");
        parts.forEach((part, partIdx) => {
          if (part.length > 0) {
            lines[lines.length - 1].push({ ...seg, content: part });
          }
          if (partIdx < parts.length - 1) {
            lines.push([]);
          }
        });
      });

      const normalizedLines = lines
        .map((line) => line.filter((s) => s.content !== ""))
        .filter((line) => line.some((s) => s.content.trim() !== ""));

      if (normalizedLines.length >= 2) {
        const [line1, line2] = normalizedLines;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {line1.map((segment, idx) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={`l1-${idx}`}
                  style={{
                    ...(segment.color ? { color: segment.color } : null),
                    ...(segment.fontWeight ? { fontWeight: segment.fontWeight } : null),
                    ...(segment.fontSize ? { fontSize: segment.fontSize } : null),
                  }}
                >
                  {segment.content}
                </span>
              ))}
            </div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400, opacity: 0.9 }}>
              {line2.map((segment, idx) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={`l2-${idx}`}
                  style={{
                    ...(segment.color ? { color: segment.color } : null),
                    ...(segment.fontWeight ? { fontWeight: segment.fontWeight } : null),
                    ...(segment.fontSize ? { fontSize: segment.fontSize } : null),
                  }}
                >
                  {segment.content}
                </span>
              ))}
            </div>
          </div>
        );
      }

      // Single line (default segments behavior)
      return (
        <span>
          {segments.map((segment, idx) => (
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
          ))}
        </span>
      );
    }

    // 2) String path: support "Name\nSubtitle" and bold the first line.
    if (typeof text === "string" && text.includes("\n")) {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const titleLine = lines[0] ?? "";
      const subtitleLine = lines.slice(1).join(" ");

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {titleLine}
          </div>
          <div style={{ fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: 0.9 }}>
            {subtitleLine}
          </div>
        </div>
      );
    }

    // 3) Default string behavior (clamped to 2 lines via container style)
    return text;
  };

  return (
    <button
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius,
        border: "none",
        backgroundColor: "#f5f5f5",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: imagePadding,
        }}
      >
        {(imageFill || !hasText) ? (
          // Full area image (covers entire image section, or image-only mode)
          <img
            src={imageSrc}
            alt={altText}
            style={{
              width: "100%",
              height: "100%",
              objectFit: hasText ? "cover" : "contain",
            }}
          />
        ) : imageShape === "circle" ? (
          <div
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={imageSrc}
              alt={altText}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ) : (
          <img
            src={imageSrc}
            alt={altText}
            style={{
              maxWidth: "85%",
              maxHeight: "85%",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      {/* Text Section - only render if text is provided */}
      {hasText && (
        <div
          style={{
            backgroundColor: finalTextBgColor,
            padding: "10px 8px",
            textAlign,
            color: hasTextBg ? textColor : "#333",
            fontFamily: FONT_INTER,
            fontSize: Math.max(12, width * 0.09),
            fontWeight: 500,
            lineHeight: 1.2,
            overflow: "hidden",
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          }}
        >
          {/* Default label gets clamped to 2 lines; 2-line (Name + Subtitle) uses its own truncation */}
          {!hasSegments && !(typeof text === "string" && text.includes("\n")) ? (
            <div
              style={{
                display: "-webkit-box",
                // @ts-ignore
                WebkitLineClamp: 2,
                // @ts-ignore
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {renderLabel()}
            </div>
          ) : (
            renderLabel()
          )}
        </div>
      )}
    </button>
  );
};

// 3. Flat Button
type FlatButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// Predefined sizes: { width, height, fontSize }
const FLAT_BUTTON_SIZES: Record<FlatButtonSize, { width: number; height: number; fontSize: number }> = {
  xs: { width: 120, height: 36, fontSize: 12 },
  sm: { width: 150, height: 44, fontSize: 14 },
  md: { width: 200, height: 52, fontSize: 16 },
  lg: { width: 280, height: 60, fontSize: 18 },
  xl: { width: 340, height: 72, fontSize: 22 },
};

interface FlatButtonProps {
  text: string;
  size?: FlatButtonSize; // Preset size: xs, sm, md, lg, xl
  width?: number;
  height?: number;
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  /**
   * Flat buttons add a subtle border automatically when bgColor is pure white (#fff),
   * to avoid white-on-white blending. Set showBorder=false to force borderless.
   */
  showBorder?: boolean;
  /**
   * Optional border color when showBorder is enabled and bgColor is pure white.
   */
  borderColor?: string;
  fontSize?: number;
  /**
   * Optional element rendered on the right (e.g., selection indicator).
   * Used by some contexts (like SelectionOptions). Safe to ignore elsewhere.
   */
  rightIcon?: React.ReactNode;
  /**
   * When true, text can wrap to multiple lines (clamped to 2 lines).
   * Defaults to false to preserve existing behavior.
   */
  allowWrap?: boolean;
  onClick?: () => void;
}

const FlatButton: React.FC<FlatButtonProps> = ({
  text,
  size,
  width: customWidth,
  height: customHeight,
  textAlign = "center",
  bgColor = "#2563eb",
  textColor = "#fff",
  showBorder = true,
  borderColor,
  fontSize: customFontSize,
  rightIcon,
  allowWrap = false,
  onClick,
}) => {
  // Use preset size if provided, otherwise use custom values or defaults
  const preset = size ? FLAT_BUTTON_SIZES[size] : null;
  const width = customWidth ?? preset?.width ?? 300;
  const height = customHeight ?? preset?.height ?? width * 0.2;
  const fontSize = customFontSize ?? preset?.fontSize ?? height * 0.24;
  
  const borderRadius = 12;
  const isLight = bgColor === "#fff" || bgColor === "white" || bgColor === "#ffffff";
  const resolvedBorder =
    showBorder && isLight ? `1px solid ${borderColor ?? "#e5e5e5"}` : "none";

  return (
    <button
      onClick={onClick}
      style={{
        width,
        maxWidth: "100%",
        height,
        borderRadius,
        border: resolvedBorder,
        backgroundColor: bgColor,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: rightIcon
          ? "space-between"
          : textAlign === "left"
            ? "flex-start"
            : textAlign === "right"
              ? "flex-end"
              : "center",
        paddingLeft: textAlign === "left" ? 16 : 8,
        paddingRight: rightIcon ? 16 : textAlign === "right" ? 16 : 8,
        color: textColor,
        fontFamily: FONT_INTER,
        fontSize,
        fontWeight: 500,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: allowWrap ? "normal" : "nowrap",
          textAlign,
          lineHeight: 1.2,
          ...(allowWrap
            ? ({
                display: "-webkit-box",
                // @ts-ignore
                WebkitLineClamp: 2,
                // @ts-ignore
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties)
            : {}),
        }}
      >
        {text}
      </span>
      {rightIcon && (
        <span style={{ marginLeft: 12, display: "flex", alignItems: "center", flexShrink: 0 }}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// --- Main Button Component ---

type ButtonVariant = "square" | "imageCard" | "flat";

interface ButtonProps {
  variant: ButtonVariant;
  // Square button props
  character?: string;
  size?: number | FlatButtonSize; // number for square, string for flat preset
  fontWeight?: number; // square button custom font weight
  // Image card button props
  imageSrc?: string;
  text?: string;
  segments?: TextSegment[];
  width?: number;
  height?: number; // For flat button custom height
  textAlign?: "left" | "center" | "right";
  textBgColor?: string;
  textColor?: string;
  imageShape?: "none" | "circle";
  imageFill?: boolean;
  // Flat button props
  bgColor?: string;
  showBorder?: boolean;
  borderColor?: string;
  fontSize?: number; // For flat button custom font size
  rightIcon?: React.ReactNode;
  allowWrap?: boolean;
  // Common
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { variant } = props;

  switch (variant) {
    case "square":
      return (
        <SquareButton
          character={props.character || ""}
          size={typeof props.size === "number" ? props.size : undefined}
          fontWeight={props.fontWeight}
          fontSize={typeof props.fontSize === "number" ? props.fontSize : undefined}
          onClick={props.onClick}
        />
      );
    case "imageCard":
      return (
        <ImageCardButton
          imageSrc={props.imageSrc || ""}
          text={props.text || ""}
          segments={props.segments}
          width={props.width}
          textAlign={props.textAlign}
          textBgColor={props.textBgColor}
          textColor={props.textColor}
          imageShape={props.imageShape}
          imageFill={props.imageFill}
          onClick={props.onClick}
        />
      );
    case "flat":
      return (
        <FlatButton
          text={props.text || ""}
          size={typeof props.size === "string" ? props.size : undefined}
          width={props.width}
          height={props.height}
          textAlign={props.textAlign}
          bgColor={props.bgColor}
          textColor={props.textColor}
          showBorder={props.showBorder}
          borderColor={props.borderColor}
          fontSize={props.fontSize}
          rightIcon={props.rightIcon}
          allowWrap={props.allowWrap}
          onClick={props.onClick}
        />
      );
    default:
      return null;
  }
};

export default Button;