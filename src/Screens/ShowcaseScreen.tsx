import React from "react";
import Image from "../Components/Image";
import Text from "../Components/Text";
import Button from "../Components/Button";
import { FONT_INTER } from "../styles/fonts";

// Content item types
type ImageItem = {
  type: "image";
  src: string;
  alt?: string;
  width?: string | number;
  shape?: "none" | "circle" | "rounded" | "blob";
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  align?: "left" | "center" | "right";
};

type TextItem = {
  type: "text";
  content: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  lineHeight?: number;
};

type HeadingItem = {
  type: "heading";
  content: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
};

type ContentItem = ImageItem | TextItem | HeadingItem;

interface ShowcaseScreenProps {
  content: ContentItem[];
  buttonText?: string;
  onButtonClick?: () => void;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonWidth?: number;
  gap?: number;
  padding?: number;
}

const ShowcaseScreen: React.FC<ShowcaseScreenProps> = ({
  content,
  buttonText = "Continue",
  onButtonClick,
  buttonBgColor = "#2563eb",
  buttonTextColor = "#fff",
  buttonWidth = 300,
  gap = 24,
  padding = 24,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding,
        gap,
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: "transparent ",
      }}
    >
      {/* Content Items */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap,
          width: "100%",
          maxWidth: 500,
        }}
      >
        {content.map((item, index) => {
          if (item.type === "image") {
            return (
              <Image
                key={index}
                src={item.src}
                alt={item.alt}
                width={item.width}
                shape={item.shape}
                border={item.border}
                borderColor={item.borderColor}
                borderWidth={item.borderWidth}
                align={item.align}
              />
            );
          }

          if (item.type === "text") {
            return (
              <Text
                key={index}
                content={item.content}
                align={item.align}
                fontSize={item.fontSize}
                color={item.color}
                fontWeight={item.fontWeight}
                lineHeight={item.lineHeight}
              />
            );
          }

          if (item.type === "heading") {
            return (
              <h2
                key={index}
                style={{
                  margin: 0,
                  fontFamily: FONT_INTER,
                  fontSize: item.fontSize ?? 28,
                  fontWeight: item.fontWeight ?? 700,
                  color: item.color ?? "#333",
                  textAlign: item.align ?? "center",
                  width: "100%",
                }}
              >
                {item.content}
              </h2>
            );
          }

          return null;
        })}
      </div>

      {/* Bottom Button */}
      <div
        style={{
          paddingTop: 16,
          paddingBottom: 16,
        }}
      >
        <Button
          variant="flat"
          text={buttonText}
          width={buttonWidth}
          bgColor={buttonBgColor}
          textColor={buttonTextColor}
          textAlign="center"
          onClick={onButtonClick}
        />
      </div>
    </div>
  );
};

export default ShowcaseScreen;
