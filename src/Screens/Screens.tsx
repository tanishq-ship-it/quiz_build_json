import React from "react";
import Image from "../Components/Image";
import Text from "../Components/Text";
import Button from "../Components/Button";
import SelectionOptions from "../Components/SelectionOptions";
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

// Selection option types
type SquareOption = {
  variant: "square";
  character: string;
  size?: number;
  id?: string | number;
  value?: string | number;
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
  id?: string | number;
  value?: string | number;
};

type FlatOption = {
  variant: "flat";
  text: string;
  width?: number;
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  id?: string | number;
  value?: string | number;
};

type SelectionOptionItem = SquareOption | ImageCardOption | FlatOption;

type SelectionItem = {
  type: "selection";
  mode: "radio" | "checkbox";
  layout: `${number}x${number}`;
  options: SelectionOptionItem[];
  selectedColor?: string;
  selectedBorderWidth?: number;
  gap?: number;
  onChange?: (selected: (string | number)[]) => void;
  onComplete?: (selected: (string | number)[]) => void; // Auto-fires for radio when no button
  defaultSelected?: (string | number)[];
};

// Button item for bottom CTA
type ButtonItem = {
  type: "button";
  text: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  width?: number;
};

type ContentItem = ImageItem | TextItem | HeadingItem | SelectionItem | ButtonItem;

interface ScreensProps {
  content: ContentItem[];
  gap?: number;
  padding?: number;
}

const Screens: React.FC<ScreensProps> = ({
  content,
  gap = 16,
  padding = 24,
}) => {
  // Extract button from content (if exists)
  const buttonItem = content.find((item) => item.type === "button") as ButtonItem | undefined;
  
  // Filter out button from regular content
  const regularContent = content.filter((item) => item.type !== "button");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding,
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: "transparent",
      }}
    >
      {/* Content Items - aligned to top */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap,
          width: "100%",
          maxWidth: 500,
          paddingTop: 16,
        }}
      >
        {regularContent.map((item, index) => {
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

          if (item.type === "selection") {
            // Auto-complete for radio mode when no button exists
            const autoComplete = item.mode === "radio" && !buttonItem;
            
            return (
              <SelectionOptions
                key={index}
                mode={item.mode}
                layout={item.layout}
                options={item.options}
                selectedColor={item.selectedColor}
                selectedBorderWidth={item.selectedBorderWidth}
                gap={item.gap}
                onChange={item.onChange}
                onComplete={item.onComplete}
                autoComplete={autoComplete}
                defaultSelected={item.defaultSelected}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Bottom Button - only render if button exists in content */}
      {buttonItem && (
        <div
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <Button
            variant="flat"
            text={buttonItem.text}
            width={buttonItem.width ?? 300}
            bgColor={buttonItem.bgColor ?? "#2563eb"}
            textColor={buttonItem.textColor ?? "#fff"}
            textAlign="center"
            onClick={buttonItem.onClick}
          />
        </div>
      )}
    </div>
  );
};

export default Screens;
