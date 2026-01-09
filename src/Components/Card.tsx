import React from "react";
import ReactMarkdown from "react-markdown";
import { FONT_INTER } from "../styles/fonts";
import Image from "./Image";
import Text from "./Text";
import Carousel from "./Carousel";

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

type InfoRowItem = {
  /**
   * Layout group to render multiple content items horizontally inside an InfoCard.
   * The InfoCard itself remains a vertical stack, but you can place a row anywhere in the content array.
   */
  type: "row";
  items: InfoContentItem[];
  gap?: number;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
};

type InfoContentItem = InfoImageItem | InfoTextItem | InfoRowItem;

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
  const renderItem = (item: InfoContentItem, key: React.Key) => {
    if (item.type === "image") {
      return (
        <Image
          key={key}
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
        <div key={key} style={{ flex: 1, minWidth: 0 }}>
          <Text
            content={item.content}
            align={item.align}
            fontSize={item.fontSize}
            color={item.color}
            fontWeight={item.fontWeight}
          />
        </div>
      );
    }

    if (item.type === "row") {
      const rowItems = Array.isArray(item.items) ? item.items : [];
      return (
        <div
          key={key}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: item.gap ?? gap,
            alignItems: item.alignItems ?? "center",
            justifyContent: item.justifyContent ?? "flex-start",
            width: "100%",
            minWidth: 0,
          }}
        >
          {rowItems.map((child, idx) => {
            const childKey = `${String(key)}-row-${idx}`;

            // The shared `Image` component renders with an outer wrapper `width: 100%`,
            // which is great for vertical layouts but breaks horizontal rows (it squeezes siblings).
            // In rows, constrain image items to a fixed container width so text can take remaining space.
            if (child.type === "image") {
              const rowImageWidth = child.width ?? 32;
              return (
                <div key={`${childKey}-wrap`} style={{ width: rowImageWidth, flexShrink: 0, minWidth: 0 }}>
                  {renderItem({ ...child, width: "100%" }, childKey)}
                </div>
              );
            }

            return renderItem(child, childKey);
          })}
        </div>
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

// ========== 4. CONTAINER CARD (formerly CompletionScreen) ==========

interface ContainerCardProps {
  logo?: string;
  heading?: string;
  subtext?: string;
  image?: string;
  socialProof?: string;
  emailTicker?: string[];
  width?: string | number;
  gap?: number;
  padding?: number;
}

const ContainerCard: React.FC<ContainerCardProps> = ({
  logo,
  heading,
  subtext,
  image,
  socialProof,
  emailTicker = [],
  width = "100%",
  gap = 16,
  padding = 24,
}) => {
  return (
    <div
      style={{
        width,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding,
        boxSizing: "border-box",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap,
        maxWidth: 500,
      }}
    >
      {/* Logo */}
      {logo && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 8,
          }}
        >
          <Image src={logo} alt="Logo" width="120px" align="center" />
        </div>
      )}

      {/* Heading */}
      {heading && (
        <h2
          style={{
            margin: 0,
            fontFamily: FONT_INTER,
            fontSize: 24,
            fontWeight: 700,
            color: "#333",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {heading}
        </h2>
      )}

      {/* Subtext */}
      {subtext && (
        <Text
          content={subtext}
          align="center"
          fontSize={15}
          color="#666"
          lineHeight={1.5}
        />
      )}

      {/* Full-Width Image (Edge-to-Edge) */}
      {image && (
        <div
          style={{
            width: `calc(100% + ${padding * 2}px)`,
            marginLeft: -padding,
            marginRight: -padding,
            marginTop: 8,
          }}
        >
          <img
            src={image}
            alt="Content"
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Social Proof */}
      {socialProof && (
        <Text
          content={socialProof}
          align="center"
          fontSize={14}
          color="#555"
          lineHeight={1.4}
        />
      )}

      {/* Email Ticker */}
      {emailTicker.length > 0 && (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            marginTop: 4,
          }}
        >
          <Carousel
            direction="horizontal"
            items={emailTicker.map((email) => ({
              type: "text" as const,
              content: email,
              fontSize: 13,
              color: "#888",
              align: "center" as const,
            }))}
            itemWidth="auto"
            height={24}
            gap={16}
            autoplay={true}
            infinite={true}
            speed={20000}
            showIndicators={false}
            renderItem={(item, index) => (
              <div
                key={index}
                style={{
                  fontFamily: FONT_INTER,
                  fontSize: 13,
                  color: "#888",
                  whiteSpace: "nowrap",
                  padding: "0 8px",
                }}
              >
                {item.content}
              </div>
            )}
          />
        </div>
      )}
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

// Container card props
type ContainerCardFullProps = {
  variant: "container";
  logo?: string;
  heading?: string;
  subtext?: string;
  image?: string;
  socialProof?: string;
  emailTicker?: string[];
  width?: string | number;
  gap?: number;
  padding?: number;
};

type CardProps = QuotationCardFullProps | MessageCardFullProps | InfoCardFullProps | ContainerCardFullProps;

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
    case "container":
      return (
        <ContainerCard
          logo={props.logo}
          heading={props.heading}
          subtext={props.subtext}
          image={props.image}
          socialProof={props.socialProof}
          emailTicker={props.emailTicker}
          width={props.width}
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
export { QuotationCard, MessageCard, InfoCard, ContainerCard };

// Export types for use in Screens
export type { CardProps, InfoContentItem };

