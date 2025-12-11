import React from "react";

type ImageShape = "none" | "circle" | "rounded" | "blob";

interface ImageProps {
  src: string;
  alt?: string;
  width?: string | number;
  shape?: ImageShape;
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  align?: "left" | "center" | "right";
  onClick?: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  width = "80%",
  shape = "none",
  border,
  borderColor,
  borderWidth = 2,
  align = "center",
  onClick,
}) => {
  // Auto-enable border if borderColor is provided
  const showBorder = border === true || (border !== false && borderColor !== undefined);
  const finalBorderColor = borderColor || "#e5e5e5";

  // Get border radius based on shape
  const getBorderRadius = (): string => {
    switch (shape) {
      case "circle":
        return "50%";
      case "rounded":
        return "16px";
      case "blob":
        return "60% 40% 30% 70% / 60% 30% 70% 40%";
      case "none":
      default:
        return "0";
    }
  };

  // Get container alignment
  const getAlignment = (): string => {
    switch (align) {
      case "left":
        return "flex-start";
      case "right":
        return "flex-end";
      case "center":
      default:
        return "center";
    }
  };

  // For circle shape, we need to ensure aspect ratio is 1:1
  const isCircle = shape === "circle";

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: getAlignment(),
      }}
    >
      <div
        style={{
          width,
          aspectRatio: isCircle ? "1 / 1" : "auto",
          overflow: "hidden",
          borderRadius: getBorderRadius(),
          border: showBorder ? `${borderWidth}px solid ${finalBorderColor}` : "none",
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: isCircle ? "cover" : "contain",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default Image;
