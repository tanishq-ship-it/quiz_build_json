import React from "react";
import { FONT_INTER } from "../styles/fonts";

// --- Internal Button Components ---

// 1. Square Button
interface SquareButtonProps {
  character: string;
  size?: number;
  onClick?: () => void;
}

const SquareButton: React.FC<SquareButtonProps> = ({
  character,
  size = 30,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        color: "#333",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_INTER,
        fontSize: size * 0.5,
        fontWeight: 600,
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

  // Check if text is provided
  const hasText = text && text.trim() !== "";

  // If no text, make it a square with 5% padding
  const height = hasText ? width * 0.85 : width;
  const imagePadding = hasText ? (imageFill ? 0 : 12) : width * 0.05;

  // Use provided textBgColor, or default to transparent (no colored footer)
  const finalTextBgColor = textBgColor || "transparent";
  const hasTextBg = textBgColor && textBgColor !== "transparent";

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
            alt={text || "image"}
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
              alt={text}
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
            alt={text}
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
            fontSize: Math.max(12, width * 0.1),
            fontWeight: 500,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
          }}
        >
          {text}
        </div>
      )}
    </button>
  );
};

// 3. Flat Button
interface FlatButtonProps {
  text: string;
  width?: number;
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const FlatButton: React.FC<FlatButtonProps> = ({
  text,
  width = 300,
  textAlign = "center",
  bgColor = "#2563eb",
  textColor = "#fff",
  onClick,
}) => {
  const height = width * 0.2;
  const borderRadius = 12;
  const isLight = bgColor === "#fff" || bgColor === "white" || bgColor === "#ffffff";

  return (
    <button
      onClick={onClick}
      style={{
        width,
        height,
        borderRadius,
        border: isLight ? "1px solid #e5e5e5" : "none",
        backgroundColor: bgColor,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent:
          textAlign === "left"
            ? "flex-start"
            : textAlign === "right"
            ? "flex-end"
            : "center",
        paddingLeft: textAlign === "left" ? 20 : 0,
        paddingRight: textAlign === "right" ? 20 : 0,
        color: textColor,
        fontFamily: FONT_INTER,
        fontSize: height * 0.35,
        fontWeight: 500,
      }}
    >
      {text}
    </button>
  );
};

// --- Main Button Component ---

type ButtonVariant = "square" | "imageCard" | "flat";

interface ButtonProps {
  variant: ButtonVariant;
  // Square button props
  character?: string;
  size?: number;
  // Image card button props
  imageSrc?: string;
  text?: string;
  width?: number;
  textAlign?: "left" | "center" | "right";
  textBgColor?: string;
  textColor?: string;
  imageShape?: "none" | "circle";
  imageFill?: boolean;
  // Flat button props
  bgColor?: string;
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
          size={props.size}
          onClick={props.onClick}
        />
      );
    case "imageCard":
      return (
        <ImageCardButton
          imageSrc={props.imageSrc || ""}
          text={props.text || ""}
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
          width={props.width}
          textAlign={props.textAlign}
          bgColor={props.bgColor}
          textColor={props.textColor}
          onClick={props.onClick}
        />
      );
    default:
      return null;
  }
};

export default Button;