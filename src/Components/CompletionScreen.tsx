import React from "react";
import Image from "./Image";
import Text from "./Text";
import Button from "./Button";
import Carousel from "./Carousel";
import { FONT_INTER } from "../styles/fonts";

// Comparison card type
export interface ComparisonCard {
  image: string;
  title: string;
  subtitle: string;
  bgColor?: string;
}

// Button config type
export interface CompletionButton {
  text: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

// Main props interface
export interface CompletionScreenProps {
  logo?: string;
  heading: string;
  subtext?: string;
  image?: string; // Single full-width image (alternative to comparisonCards)
  comparisonCards?: ComparisonCard[];
  socialProof?: string;
  emailTicker?: string[];
  button?: CompletionButton;
  gap?: number;
  padding?: number;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  logo,
  heading,
  subtext,
  image,
  comparisonCards = [],
  socialProof,
  emailTicker = [],
  button,
  gap = 16,
  padding = 24,
}) => {
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
      {/* Top Section: Logo + Container Box */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          width: "100%",
          maxWidth: 500,
          paddingTop: 16,
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
            }}
          >
            <Image src={logo} alt="Logo" width="60%" align="center" />
          </div>
        )}

        {/* Container Box */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            padding: 24,
            width: "100%",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap,
          }}
        >
          {/* Heading */}
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

          {/* Single Full-Width Image */}
          {image && (
            <div
              style={{
                width: "calc(100% + 48px)",
                marginLeft: -24,
                marginRight: -24,
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

          {/* Comparison Cards */}
          {comparisonCards.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 8,
              }}
            >
              {comparisonCards.map((card, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    backgroundColor: card.bgColor || "#f5f5f5",
                    borderRadius: 12,
                    overflow: "hidden",
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Card Image - Full width/height */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 16,
                    }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Text Overlay at Bottom */}
                  <div
                    style={{
                      position: "relative",
                      marginTop: "auto",
                      padding: "12px 16px",
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      zIndex: 1,
                    }}
                  >
                    {/* Card Title */}
                    <div
                      style={{
                        fontFamily: FONT_INTER,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      {card.title}
                    </div>

                    {/* Card Subtitle */}
                    <div
                      style={{
                        fontFamily: FONT_INTER,
                        fontSize: 13,
                        fontWeight: 400,
                        color: "#f0f0f0",
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      {card.subtitle}
                    </div>
                  </div>
                </div>
              ))}
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
                speed={5000}
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
      </div>

      {/* Bottom Section: Continue Button */}
      {button && (
        <div
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <Button
            variant="flat"
            text={button.text}
            width={300}
            bgColor={button.bgColor ?? "#2563eb"}
            textColor={button.textColor ?? "#fff"}
            textAlign="center"
            onClick={button.onClick}
          />
        </div>
      )}
    </div>
  );
};

export default CompletionScreen;
