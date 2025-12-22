import React from "react";
import ReactMarkdown from "react-markdown";
import { FONT_INTER } from "../styles/fonts";
import Image from "./Image";
import Text from "./Text";

// ========== 1. QUOTATION CARD ==========

interface QuotationCardProps {
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
}

const QuotationCard: React.FC<QuotationCardProps> = ({
  quote,
  author,
  authorAlign = "left",
  width = "80%",
  bgColor = "#fff",
  quoteColor = "#333",
  authorColor = "#666",
  quoteSymbolColor = "#e5e5e5",
  fontSize = 18,
  authorFontSize = 14,
}) => {
  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        borderRadius: 16,
        padding: 24,
        boxSizing: "border-box",
        fontFamily: FONT_INTER,
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Quote Symbol */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 16,
          fontSize: 64,
          fontWeight: 700,
          color: quoteSymbolColor,
          lineHeight: 1,
          fontFamily: "Georgia, serif",
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Quote Text */}
      <div
        style={{
          paddingTop: 40,
          paddingBottom: author ? 16 : 0,
          fontSize,
          fontWeight: 500,
          color: quoteColor,
          lineHeight: 1.5,
        }}
      >
        {quote}
      </div>

      {/* Author Attribution */}
      {author && (
        <div
          style={{
            fontSize: authorFontSize,
            fontWeight: 400,
            color: authorColor,
            textAlign: authorAlign,
            fontStyle: "italic",
          }}
        >
          — {author}
        </div>
      )}
    </div>
  );
};

// ========== 2. MESSAGE CARD ==========

interface MessageCardProps {
  message: string;
  width?: string | number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  width = "80%",
  bgColor = "#fff",
  textColor = "#333",
  fontSize = 16,
  align = "left",
}) => {
  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        borderRadius: 16,
        padding: 24,
        boxSizing: "border-box",
        fontFamily: FONT_INTER,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        textAlign: align,
        color: textColor,
        fontSize,
        lineHeight: 1.6,
      }}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p style={{ margin: "0 0 0.75em 0" }}>{children}</p>,
          strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          h1: ({ children }) => (
            <h1 style={{ fontSize: fontSize * 1.75, margin: "0 0 0.5em 0", fontWeight: 700 }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: fontSize * 1.5, margin: "0 0 0.5em 0", fontWeight: 600 }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: fontSize * 1.25, margin: "0 0 0.5em 0", fontWeight: 600 }}>
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul style={{ margin: "0.5em 0", paddingLeft: "1.5em", textAlign: "left" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ margin: "0.5em 0", paddingLeft: "1.5em", textAlign: "left" }}>{children}</ol>
          ),
          li: ({ children }) => <li style={{ marginBottom: "0.25em" }}>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} style={{ color: "#2563eb", textDecoration: "underline" }}>
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code
              style={{
                backgroundColor: "#f5f5f5",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: "0.9em",
              }}
            >
              {children}
            </code>
          ),
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
};

// ========== 3. INFO CARD ==========

// Content items for Info Card
type InfoImageItem = {
  type: "image";
  src: string;
  alt?: string;
  width?: string | number;
  shape?: "none" | "circle" | "rounded" | "blob";
  align?: "left" | "center" | "right";
};

type InfoTextItem = {
  type: "text";
  content: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
};

type InfoContentItem = InfoImageItem | InfoTextItem;

interface InfoCardProps {
  content: InfoContentItem[];
  width?: string | number;
  bgColor?: string;
  gap?: number;
  padding?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  content,
  width = "80%",
  bgColor = "#fff",
  gap = 12,
  padding = 20,
}) => {
  const renderItem = (item: InfoContentItem, index: number) => {
    if (item.type === "image") {
      return (
        <Image
          key={index}
          src={item.src}
          alt={item.alt}
          width={item.width ?? "100%"}
          shape={item.shape}
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
        />
      );
    }

    return null;
  };

  return (
    <div
      style={{
        width,
        backgroundColor: bgColor,
        borderRadius: 16,
        padding,
        boxSizing: "border-box",
        fontFamily: FONT_INTER,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {content.map((item, index) => renderItem(item, index))}
    </div>
  );
};

// ========== MAIN CARD COMPONENT ==========

// Quotation card props
type QuotationCardFullProps = {
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

// Message card props
type MessageCardFullProps = {
  variant: "message";
  message: string;
  width?: string | number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
};

// Info card props
type InfoCardFullProps = {
  variant: "info";
  content: InfoContentItem[];
  width?: string | number;
  bgColor?: string;
  gap?: number;
  padding?: number;
};

type CardProps = QuotationCardFullProps | MessageCardFullProps | InfoCardFullProps;

const Card: React.FC<CardProps> = (props) => {
  switch (props.variant) {
    case "quotation":
      return (
        <QuotationCard
          quote={props.quote}
          author={props.author}
          authorAlign={props.authorAlign}
          width={props.width}
          bgColor={props.bgColor}
          quoteColor={props.quoteColor}
          authorColor={props.authorColor}
          quoteSymbolColor={props.quoteSymbolColor}
          fontSize={props.fontSize}
          authorFontSize={props.authorFontSize}
        />
      );
    case "message":
      return (
        <MessageCard
          message={props.message}
          width={props.width}
          bgColor={props.bgColor}
          textColor={props.textColor}
          fontSize={props.fontSize}
          align={props.align}
        />
      );
    case "info":
      return (
        <InfoCard
          content={props.content}
          width={props.width}
          bgColor={props.bgColor}
          gap={props.gap}
          padding={props.padding}
        />
      );
    default:
      return null;
  }
};

export default Card;

// Export individual cards for direct use
export { QuotationCard, MessageCard, InfoCard };

// Export types for use in Screens
export type { CardProps, InfoContentItem };

