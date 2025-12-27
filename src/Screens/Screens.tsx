import React, { useState, useEffect } from "react";
import Image from "../Components/Image";
import Text from "../Components/Text";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Carousel from "../Components/Carousel";
import SelectionOptions from "../Components/SelectionOptions";
import Card, { type InfoContentItem } from "../Components/Card";
import LoadingComponent, { type LoadingPopupConfig } from "../Components/LoadingComponent";
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

type InputItem = {
  type: "input";
  inputType?: "text" | "email" | "tel" | "number" | "password" | "url";
  placeholder?: string;
  label?: string;
  width?: string | number;
  required?: boolean;
  responseKey?: string;
};

type CarouselItem = {
  type: "carousel";
  direction?: "horizontal" | "vertical";
  items: ContentItem[]; // Recursive content!
  itemWidth?: string | number;
  height?: string | number;
  gap?: number;
  autoplay?: boolean;
  infinite?: boolean;
  speed?: number;
  showIndicators?: boolean;
};

type LoadingItem = {
  type: "loading";
  message?: string;
  duration?: number;
  progressColor?: string;
  trackColor?: string;
  popup?: LoadingPopupConfig;
  responseKey?: string;
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

// Conditional screen content - a full screen that replaces the current screen
type ConditionalScreenContent = {
  content: ContentItem[];
  gap?: number;
  padding?: number;
};

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
  // Response cards - shown inline when an option is selected (stays on same screen)
  responseCards?: Record<string | number, ResponseCard>;
  responsePosition?: "top" | "bottom"; // Where to show the response card relative to selection
  // Conditional screens - replaces entire screen content when an option is selected
  conditionalScreens?: Record<string | number, ConditionalScreenContent>;
  // Position of the selection on screen: "top" (default), "middle", "bottom"
  // If not specified and no button exists, defaults to "bottom"
  position?: "top" | "middle" | "bottom";
  responseKey?: string;
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

type ContainerCardItem = {
  type: "card";
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

type CardItem = QuotationCardItem | MessageCardItem | InfoCardItem | ContainerCardItem;

// Button item for bottom CTA
type ButtonItem = {
  type: "button";
  text: string;
  onClick?: () => void;
  bgColor?: string;
  textColor?: string;
  width?: number;
};

type ContentItem = ImageItem | TextItem | HeadingItem | SelectionItem | CardItem | ButtonItem | InputItem | CarouselItem | LoadingItem;

interface ScreensProps {
  content: ContentItem[];
  gap?: number;
  padding?: number;
  screenIndex?: number;
  screenId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScreenResponse?: (response: any) => void;
}

const Screens: React.FC<ScreensProps> = ({
  content,
  gap = 16,
  padding = 24,
  screenIndex,
  screenId,
  onScreenResponse,
}) => {
  // State to track completed loading items for sequential reveal
  const [completedLoadingIndices, setCompletedLoadingIndices] = useState<Set<number>>(new Set());
  
  // State to track selected values for response cards
  const [selectionState, setSelectionState] = useState<Record<number, (string | number)[]>>({});
  const [inputState, setInputState] = useState<Record<string, string>>({});
  
  // State to track active conditional screen (when an option triggers a full screen change)
  const [activeConditionalScreen, setActiveConditionalScreen] = useState<ConditionalScreenContent | null>(null);
  
  // State to track active branch value for analytics
  const [activeBranch, setActiveBranch] = useState<string | number | undefined>(undefined);

  // Reset sequential state when screen changes
  useEffect(() => {
    setCompletedLoadingIndices(new Set());
  }, [screenId]);

  // Extract button from content (if exists)
  const buttonItem = content.find((item) => item.type === "button") as ButtonItem | undefined;
  
  // Sequential Logic: Determine which content items are visible
  // We iterate through content. If we hit a "loading" item that is NOT completed, 
  // we include it but stop rendering anything after it.
  const getVisibleContent = () => {
    const visible: ContentItem[] = [];
    const allContentWithoutButton = content.filter((item) => item.type !== "button");

    for (let i = 0; i < allContentWithoutButton.length; i++) {
      const item = allContentWithoutButton[i];
      visible.push(item);
      
      if (item.type === "loading") {
        // Use the index from the ORIGINAL content array to track uniqueness if possible,
        // but here we are iterating specific filtered list. 
        // Let's use the index within this filtered list for simplicity as it's deterministic per screen.
        if (!completedLoadingIndices.has(i)) {
          // Found an active loading item - stop here.
          break;
        }
      }
    }
    return visible;
  };

  const regularContent = getVisibleContent();
  const allLoadingComplete = regularContent.length === content.filter(i => i.type !== "button").length 
    && (!regularContent.some(i => i.type === "loading" && !completedLoadingIndices.has(regularContent.indexOf(i))));

  // Find the selection item to check its position
  const selectionItem = regularContent.find((item) => item.type === "selection") as SelectionItem | undefined;
  
  // Determine selection position:
  // - If position is explicitly set, use it
  // - If no button exists, default to "bottom"
  // - Otherwise default to "top"
  const selectionPosition = selectionItem?.position ?? (!buttonItem ? "bottom" : "top");
  
  // Separate content based on selection position
  const topContent = selectionPosition !== "top" 
    ? regularContent.filter((item) => item.type !== "selection")
    : regularContent;

  // Middle content: selection when position is "middle"
  const middleSelection = selectionPosition === "middle" ? selectionItem : undefined;

  // Bottom content: selection when position is "bottom"
  const bottomSelection = selectionPosition === "bottom" ? selectionItem : undefined;

  // Find the selection item index for state tracking
  const getSelectionIndex = (): number => {
    return regularContent.findIndex((item) => item.type === "selection");
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
      // Auto-complete for radio mode when no button exists AND no conditional screens
      const hasConditional = item.conditionalScreens && Object.keys(item.conditionalScreens).length > 0;
      const autoComplete = item.mode === "radio" && !buttonItem && !hasConditional;
      const selectionIndex = getSelectionIndex();
      const responsePosition = item.responsePosition ?? "top";
      const responseCard = getCurrentResponseCard(item, selectionIndex);

      // Handle selection change to update state for response cards/screens
      const handleSelectionChange = (selected: (string | number)[]) => {
        setSelectionState((prev) => ({
          ...prev,
          [selectionIndex]: selected,
        }));
        
        // Check if there's a conditional screen for the selected option
        let branchValue: string | number | undefined;
        if (item.conditionalScreens && selected.length > 0) {
          const selectedValue = selected[selected.length - 1];
          // Normalize key to string for safety
          const key = String(selectedValue);
          const conditionalScreen = item.conditionalScreens[key];
          
          // Set or clear explicitly
          setActiveConditionalScreen(conditionalScreen ?? null);
          
          if (conditionalScreen) {
            branchValue = selectedValue;
            setActiveBranch(selectedValue);
          } else {
            setActiveBranch(undefined);
          }
        } else {
          setActiveConditionalScreen(null);
          setActiveBranch(undefined);
        }

        if (onScreenResponse && screenIndex != null && screenId) {
          onScreenResponse({
            responseKey: item.responseKey ?? screenId,
            selected,
            ...(branchValue !== undefined ? { branch: branchValue } : {}),
          });
        }

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
      if (item.variant === "container") {
        return (
          <Card
            key={index}
            variant="container"
            logo={item.logo}
            heading={item.heading}
            subtext={item.subtext}
            image={item.image}
            socialProof={item.socialProof}
            emailTicker={item.emailTicker}
            width={item.width}
            gap={item.gap}
            padding={item.padding}
          />
        );
      }
    }

    if (item.type === "input") {
      const value = inputState[item.responseKey ?? `input-${index}`] ?? "";
      
      return (
        <Input
          key={index}
          type={item.inputType}
          placeholder={item.placeholder}
          label={item.label}
          width={item.width}
          required={item.required}
          value={value}
          onChange={(val) => {
            setInputState(prev => ({
              ...prev,
              [item.responseKey ?? `input-${index}`]: val
            }));
          }}
        />
      );
    }

    if (item.type === "carousel") {
      return (
        <Carousel
          key={index}
          items={item.items}
          direction={item.direction}
          itemWidth={item.itemWidth}
          height={item.height}
          gap={item.gap}
          autoplay={item.autoplay}
          infinite={item.infinite}
          speed={item.speed}
          showIndicators={item.showIndicators}
          renderItem={(childItem, childIndex) => renderContentItem(childItem, childIndex)}
        />
      );
    }

    if (item.type === "loading") {
      // Logic to check if this specific loading item is complete
      // We need its index in the regularContent array to match the set logic
      // Note: renderContentItem is mapped from topContent etc, which are subsets. 
      // Actually, standard index passed to this function `index` is from the map.
      // `renderContentItem` is called as `renderContentItem(item, index)`.
      // BUT `topContent.map` index is 0,1,2... which might not match `regularContent` index if splitting happened.
      // Safest is to find index in `regularContent` or pass real index.
      // Since `regularContent` is the source of truth for visibility, let's look it up.
      const realIndex = regularContent.indexOf(item);

      return (
        <LoadingComponent
           key={index}
           message={item.message}
           duration={item.duration}
           progressColor={item.progressColor}
           trackColor={item.trackColor}
           popup={item.popup}
           onComplete={() => {
             // Mark this loading item as complete to show next items
             setCompletedLoadingIndices(prev => {
                const newSet = new Set(prev);
                newSet.add(realIndex);
                return newSet;
             });

             // Auto-advance when loading is done IF it's the last thing? 
             // Or just let the sequence play out.
             // Original logic for auto-advance:
             /*
             if (onScreenResponse && screenIndex != null && screenId) {
                onScreenResponse({
                  responseKey: item.responseKey ?? screenId,
                  action: "next", // specific signal for completion
                  completed: true
                });
             }
             */
           }}
           onPopupResponse={(key, value) => {
              if (onScreenResponse && screenIndex != null && screenId) {
                // Log the intermediate response
                 onScreenResponse({
                  responseKey: key,
                  selected: [value],
                  isIntermediate: true // Flag to say "don't go to next screen yet" if needed, though usually onScreenResponse might trigger nav.
                });
              }
           }}
        />
      );
    }

    return null;
  };

  // If a conditional screen is active, render it instead of the original content
  if (activeConditionalScreen) {
    const responseContent = activeConditionalScreen.content;
    const responseGap = activeConditionalScreen.gap ?? gap;
    const responsePadding = activeConditionalScreen.padding ?? padding;
    
    // Extract button from response content
    const responseButtonItem = responseContent.find((item) => item.type === "button") as ButtonItem | undefined;
    const responseRegularContent = responseContent.filter((item) => item.type !== "button");

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: responsePadding,
          height: "100%",
          boxSizing: "border-box",
          backgroundColor: "transparent",
        }}
      >
        {/* Response Screen Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: responseGap,
            width: "100%",
            maxWidth: 500,
            paddingTop: 16,
          }}
        >
          {responseRegularContent.map((item, index) => renderContentItem(item, index))}
        </div>

        {/* Response Screen Button */}
        {responseButtonItem && (
          <div
            style={{
              paddingTop: 16,
              paddingBottom: 16,
            }}
          >
            <Button
              variant="flat"
              text={responseButtonItem.text}
              width={responseButtonItem.width ?? 300}
              bgColor={responseButtonItem.bgColor ?? "#2563eb"}
              textColor={responseButtonItem.textColor ?? "#fff"}
              textAlign="center"
              onClick={() => {
                if (onScreenResponse && screenIndex != null && screenId) {
                  onScreenResponse({
                    button: {
                      text: responseButtonItem.text,
                    },
                    responseKey: selectionItem?.responseKey ?? screenId,
                    branch: activeBranch,
                  });
                }
                // Reset conditional screen and call the button's onClick
                setActiveConditionalScreen(null);
                setActiveBranch(undefined);
                responseButtonItem.onClick?.();
              }}
            />
          </div>
        )}
        
      </div>
    );
  }

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
      {/* Top Content - headings, text, images (and selection if position is "top") */}
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

      {/* Middle Selection - when position is "middle" */}
      {middleSelection && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {renderContentItem(middleSelection, 998)}
        </div>
      )}

      {/* Bottom Area - Selection (when position is "bottom") or Button */}
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

      {buttonItem && allLoadingComplete && (
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
            onClick={() => {
              // Basic validation for required inputs
              const requiredInputs = content.filter(i => i.type === "input" && i.required) as InputItem[];
              const isInvalid = requiredInputs.some(i => {
                const val = inputState[i.responseKey ?? ""] ?? "";
                return !val.trim();
              });

              if (isInvalid) {
                // Shake effect or alert could go here
                alert("Please fill in all required fields.");
                return;
              }

              if (onScreenResponse && screenIndex != null && screenId) {
                // Collect all input values
                const inputValues = content
                  .filter(i => i.type === "input")
                  .reduce((acc, i: any) => ({
                    ...acc,
                    [i.responseKey ?? "input"]: inputState[i.responseKey ?? ""] ?? ""
                  }), {});

                onScreenResponse({
                  button: {
                    text: buttonItem.text,
                  },
                  ...inputValues
                });
              }
              buttonItem.onClick?.();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Screens;
