import React, { useEffect, useRef, useState } from "react";
import Image from "../Components/Image";
import Text, { type TextSegment } from "../Components/Text";
import Button from "../Components/Button";
import Input from "../Components/Input";
import Carousel from "../Components/Carousel";
import SelectionOptions from "../Components/SelectionOptions";
import Card, { type InfoContentItem } from "../Components/Card";
import LoadingComponent, { type LoadingPopupConfig } from "../Components/LoadingComponent";
import ListBlock from "../Components/listBock";
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
  segments?: TextSegment[];
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
  // NOTE: historically some JSON uses `content` instead of `items`.
  // We support both to avoid breaking existing screen configs.
  items?: ContentItem[]; // Recursive content!
  content?: ContentItem[]; // Alias for items
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
  text?: string;
  segments?: TextSegment[];
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

type SelectionEdgeLabel = {
  text: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
};

type SelectionLabels =
  | { left?: SelectionEdgeLabel | string; right?: SelectionEdgeLabel | string }
  | [SelectionEdgeLabel | string, SelectionEdgeLabel | string];

type SelectionItem = {
  type: "selection";
  mode: "radio" | "checkbox";
  layout: `${number}x${number}`;
  options: SelectionOptionItem[];
  /**
   * When true, user must select at least one option before continuing.
   * (Only applies when a bottom button exists. Auto-complete radio already requires a click.)
   */
  required?: boolean;
  selectedColor?: string;
  selectedBorderWidth?: number;
  /**
   * Optional visual indicator style.
   * - "none" (default): current behavior
   * - "circle": shows right-side circle (checked/unchecked) and a neutral border when unselected (flat options)
   */
  indicator?: "none" | "circle";
  /**
   * Border color when not selected (only used when indicator="circle")
   */
  unselectedBorderColor?: string;
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
  labels?: SelectionLabels;
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

// Two-column list blocks (e.g., "Before" / "After")
type ListBlockRowItem = {
  type: "listBlockRow";
  gap?: number;
  blocks: Array<{
    heading: string;
    data: Array<{ icon: string; text: string }>;
    width?: number | string;
    height?: number | string;
    bgColor?: string;
    titleColor?: string;
    textColor?: string;
    iconSize?: number;
  }>;
};

type ContentItem =
  | ImageItem
  | TextItem
  | HeadingItem
  | SelectionItem
  | CardItem
  | ButtonItem
  | InputItem
  | CarouselItem
  | LoadingItem
  | ListBlockRowItem;

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
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // State to track active conditional screen (when an option triggers a full screen change)
  const [activeConditionalScreen, setActiveConditionalScreen] = useState<ConditionalScreenContent | null>(null);
  
  // State to track active branch value for analytics
  const [activeBranch, setActiveBranch] = useState<string | number | undefined>(undefined);

  // Optional UX: if a screen has selection + a confirm button at the bottom,
  // scroll to the confirm button on the first selection interaction.
  const confirmButtonContainerRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledToConfirmRef = useRef<boolean>(false);

  // Reset sequential state when screen changes
  useEffect(() => {
    setCompletedLoadingIndices(new Set());
  }, [screenId]);

  // Reset one-time auto-scroll when screen changes
  useEffect(() => {
    hasAutoScrolledToConfirmRef.current = false;
  }, [screenId]);

  // Extract button from content (if exists)
  const buttonItem = content.find((item) => item.type === "button") as ButtonItem | undefined;

  const getInputKey = (item: InputItem, index: number): string => {
    return item.responseKey ?? `input-${index}`;
  };
  
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
    if (item.type === "listBlockRow") {
      const rowGap = item.gap ?? 16;
      return (
        <div
          key={index}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: rowGap,
            flexWrap: "nowrap",
          }}
        >
          {item.blocks.map((b, blockIndex) => (
            <ListBlock
              key={`${index}-${blockIndex}`}
              content={{ heading: b.heading, data: b.data }}
              width={b.width ?? `calc((100% - ${rowGap}px) / 2)`}
              height={b.height}
              bgColor={b.bgColor}
              titleColor={b.titleColor}
              textColor={b.textColor}
              iconSize={b.iconSize}
            />
          ))}
        </div>
      );
    }

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
          segments={item.segments}
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

      const tryScrollToConfirmButton = () => {
        // Only for flows that have an explicit confirm button (i.e., NOT auto-complete).
        if (!buttonItem) return;
        if (hasAutoScrolledToConfirmRef.current) return;

        hasAutoScrolledToConfirmRef.current = true;

        // Defer until after React commits layout changes (e.g., response cards / conditional screen).
        setTimeout(() => {
          const el = confirmButtonContainerRef.current;
          if (!el) return;
          if (typeof window === "undefined") return;

          const rect = el.getBoundingClientRect();
          const viewH = window.innerHeight || document.documentElement.clientHeight;
          const alreadyVisible = rect.top >= 0 && rect.bottom <= viewH;
          if (alreadyVisible) return;

          el.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 0);
      };

      // Handle selection change to update state for response cards/screens
      const handleSelectionChange = (selected: (string | number)[]) => {
        setSelectionState((prev) => ({
          ...prev,
          [selectionIndex]: selected,
        }));
        setValidationError(null);
        
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
        tryScrollToConfirmButton();
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
            indicator={item.indicator}
            unselectedBorderColor={item.unselectedBorderColor}
            gap={item.gap}
            onChange={handleSelectionChange}
            onComplete={item.onComplete}
            autoComplete={autoComplete}
            defaultSelected={item.defaultSelected}
            labels={item.labels}
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
      const key = getInputKey(item, index);
      const value = inputState[key] ?? "";
      
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
              [key]: val
            }));
            setValidationError(null);
            
            // Sync to parent immediately so data is captured even without button click
            if (onScreenResponse && screenIndex != null && screenId) {
              onScreenResponse({
                [key]: val
              });
            }
          }}
        />
      );
    }

    if (item.type === "carousel") {
      const carouselItems = item.items ?? item.content ?? [];
      return (
        <Carousel
          key={index}
          items={carouselItems}
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
           }}
           onPopupResponse={(key, value) => {
              if (onScreenResponse && screenIndex != null && screenId) {
                 // Store response directly using the provided key
                 onScreenResponse({
                  [key]: value
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
        className="scrollbar-hide"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: responsePadding,
          height: "100%",
          boxSizing: "border-box",
          backgroundColor: "transparent",
          overflowY: "auto",
          overflowX: "hidden",
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
            ref={confirmButtonContainerRef}
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
      className="scrollbar-hide"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding,
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: "transparent",
        overflowY: "auto",
        overflowX: "hidden",
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
          ref={confirmButtonContainerRef}
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {validationError && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: 420,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#ef4444",
                  textAlign: "center",
                }}
              >
                {validationError}
              </div>
            </div>
          )}
          <Button
            variant="flat"
            text={buttonItem.text}
            width={buttonItem.width ?? 300}
            bgColor={buttonItem.bgColor ?? "#2563eb"}
            textColor={buttonItem.textColor ?? "#fff"}
            textAlign="center"
            onClick={() => {
              // Basic validation for required inputs + required selection
              const isInputInvalid = content.some((i, idx) => {
                if (i.type !== "input" || !i.required) return false;
                const key = getInputKey(i, idx);
                const val = inputState[key] ?? "";
                return !val.trim();
              });

              const selectionIndex = getSelectionIndex();
              const selectedValues =
                selectionIndex >= 0 ? (selectionState[selectionIndex] ?? []) : [];
              const isSelectionInvalid =
                Boolean(selectionItem?.required) && selectedValues.length === 0;

              if (isInputInvalid || isSelectionInvalid) {
                setValidationError("Please answer all required question(s) to continue.");
                return;
              }

              setValidationError(null);

              if (onScreenResponse && screenIndex != null && screenId) {
                // Collect all input values
                const inputValues = content.reduce<Record<string, string>>((acc, i, idx) => {
                  if (i.type !== "input") return acc;
                  const key = getInputKey(i, idx);
                  acc[key] = inputState[key] ?? "";
                  return acc;
                }, {});

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
