import React, { useState } from "react";
import Image from "../Components/Image";
import Text from "../Components/Text";
import Button from "../Components/Button";
import SelectionOptions from "../Components/SelectionOptions";
import Card, { type InfoContentItem } from "../Components/Card";
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
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // Preset size
  width?: number;
  height?: number;
  textAlign?: "left" | "center" | "right";
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  id?: string | number;
  value?: string | number;
};

type SelectionOptionItem = SquareOption | ImageCardOption | FlatOption;

// Response card types (without "type: card" since it's implied)
type ResponseQuotationCard = {
  variant: "quotation";
  quote: string;
  author?: string;
  authorAlign?: "left" | "center" | "right";
  width?: string | number;
  bgColor?: string;
  quoteColor?: string;
  authorColor?: string;
  quoteSymbolColor?: string;
  fontSize?: number;
  authorFontSize?: number;
};

type ResponseMessageCard = {
  variant: "message";
  message: string;
  width?: string | number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
};

type ResponseInfoCard = {
  variant: "info";
  content: InfoContentItem[];
  width?: string | number;
  bgColor?: string;
  gap?: number;
  padding?: number;
};

type ResponseCard = ResponseQuotationCard | ResponseMessageCard | ResponseInfoCard;

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
  // Response cards - shown when an option is selected
  responseCards?: Record<string | number, ResponseCard>;
  responsePosition?: "top" | "bottom"; // Where to show the response card relative to selection
};

// Card item types
type QuotationCardItem = {
  type: "card";
  variant: "quotation";
  quote: string;
  author?: string;
  authorAlign?: "left" | "center" | "right";
  width?: string | number;
  bgColor?: string;
  quoteColor?: string;
  authorColor?: string;
  quoteSymbolColor?: string;
  fontSize?: number;
  authorFontSize?: number;
};

type MessageCardItem = {
  type: "card";
  variant: "message";
  message: string;
  width?: string | number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
};

type InfoCardItem = {
  type: "card";
  variant: "info";
  content: InfoContentItem[];
  width?: string | number;
  bgColor?: string;
  gap?: number;
  padding?: number;
};

type CardItem = QuotationCardItem | MessageCardItem | InfoCardItem;

// Button item for bottom CTA
type ButtonItem = {
  type: "button";
  text: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  width?: number;
};

type ContentItem = ImageItem | TextItem | HeadingItem | SelectionItem | CardItem | ButtonItem;

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
  // State to track selected values for response cards
  const [selectionState, setSelectionState] = useState<Record<number, (string | number)[]>>({});

  // Extract button from content (if exists)
  const buttonItem = content.find((item) => item.type === "button") as ButtonItem | undefined;
  
  // Filter out button from regular content
  const regularContent = content.filter((item) => item.type !== "button");

  // If no button, separate selection from other content (selection goes to bottom)
  const hasSelection = regularContent.some((item) => item.type === "selection");
  const shouldMoveSelectionToBottom = !buttonItem && hasSelection;

  // Top content: everything except selection (when moving selection to bottom)
  const topContent = shouldMoveSelectionToBottom
    ? regularContent.filter((item) => item.type !== "selection")
    : regularContent;

  // Bottom content: selection only (when no button)
  const bottomSelection = shouldMoveSelectionToBottom
    ? (regularContent.find((item) => item.type === "selection") as SelectionItem | undefined)
    : undefined;

  // Find the selection item index for state tracking
  const getSelectionIndex = (): number => {
    return content.findIndex((item) => item.type === "selection");
  };

  // Render a response card based on selection
  const renderResponseCard = (responseCard: ResponseCard, key: string) => {
    if (responseCard.variant === "quotation") {
      return (
        <Card
          key={key}
          variant="quotation"
          quote={responseCard.quote}
          author={responseCard.author}
          authorAlign={responseCard.authorAlign}
          width={responseCard.width}
          bgColor={responseCard.bgColor}
          quoteColor={responseCard.quoteColor}
          authorColor={responseCard.authorColor}
          quoteSymbolColor={responseCard.quoteSymbolColor}
          fontSize={responseCard.fontSize}
          authorFontSize={responseCard.authorFontSize}
        />
      );
    }
    if (responseCard.variant === "message") {
      return (
        <Card
          key={key}
          variant="message"
          message={responseCard.message}
          width={responseCard.width}
          bgColor={responseCard.bgColor}
          textColor={responseCard.textColor}
          fontSize={responseCard.fontSize}
          align={responseCard.align}
        />
      );
    }
    if (responseCard.variant === "info") {
      return (
        <Card
          key={key}
          variant="info"
          content={responseCard.content}
          width={responseCard.width}
          bgColor={responseCard.bgColor}
          gap={responseCard.gap}
          padding={responseCard.padding}
        />
      );
    }
    return null;
  };

  // Get the current response card for a selection
  const getCurrentResponseCard = (selectionItem: SelectionItem, selectionIndex: number) => {
    if (!selectionItem.responseCards) return null;
    
    const selectedValues = selectionState[selectionIndex] || [];
    if (selectedValues.length === 0) return null;

    // For radio mode, use the single selected value
    // For checkbox mode, use the last selected value
    const currentValue = selectedValues[selectedValues.length - 1];
    const responseCard = selectionItem.responseCards[currentValue];
    
    if (!responseCard) return null;
    
    return renderResponseCard(responseCard, `response-${selectionIndex}-${currentValue}`);
  };

  const renderContentItem = (item: ContentItem, index: number) => {
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
      const selectionIndex = getSelectionIndex();
      const responsePosition = item.responsePosition ?? "top";
      const responseCard = getCurrentResponseCard(item, selectionIndex);

      // Handle selection change to update state for response cards
      const handleSelectionChange = (selected: (string | number)[]) => {
        setSelectionState((prev) => ({
          ...prev,
          [selectionIndex]: selected,
        }));
        item.onChange?.(selected);
      };
      
      return (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", width: "100%" }}>
          {/* Response card above selection */}
          {responsePosition === "top" && responseCard}
          
          <SelectionOptions
            mode={item.mode}
            layout={item.layout}
            options={item.options}
            selectedColor={item.selectedColor}
            selectedBorderWidth={item.selectedBorderWidth}
            gap={item.gap}
            onChange={handleSelectionChange}
            onComplete={item.onComplete}
            autoComplete={autoComplete}
            defaultSelected={item.defaultSelected}
          />
          
          {/* Response card below selection */}
          {responsePosition === "bottom" && responseCard}
        </div>
      );
    }

    if (item.type === "card") {
      if (item.variant === "quotation") {
        return (
          <Card
            key={index}
            variant="quotation"
            quote={item.quote}
            author={item.author}
            authorAlign={item.authorAlign}
            width={item.width}
            bgColor={item.bgColor}
            quoteColor={item.quoteColor}
            authorColor={item.authorColor}
            quoteSymbolColor={item.quoteSymbolColor}
            fontSize={item.fontSize}
            authorFontSize={item.authorFontSize}
          />
        );
      }
      if (item.variant === "message") {
        return (
          <Card
            key={index}
            variant="message"
            message={item.message}
            width={item.width}
            bgColor={item.bgColor}
            textColor={item.textColor}
            fontSize={item.fontSize}
            align={item.align}
          />
        );
      }
      if (item.variant === "info") {
        return (
          <Card
            key={index}
            variant="info"
            content={item.content}
            width={item.width}
            bgColor={item.bgColor}
            gap={item.gap}
            padding={item.padding}
          />
        );
      }
    }

    return null;
  };

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
      {/* Top Content - headings, text, images (and selection if button exists) */}
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
        {topContent.map((item, index) => renderContentItem(item, index))}
      </div>

      {/* Bottom Area - either Selection (no button) or Button */}
      {bottomSelection && (
        <div
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {renderContentItem(bottomSelection, 999)}
        </div>
      )}

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
