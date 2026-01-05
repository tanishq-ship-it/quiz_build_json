import React, { useRef, useState } from "react";

// --- Types from Screens.tsx/Carousel ---
// We need to duplicate types to avoid circular deps if not centralized.

type CarouselProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]; 
  direction?: "horizontal" | "vertical";
  itemWidth?: string | number;
  height?: string | number;
  gap?: number;
  autoplay?: boolean;
  infinite?: boolean; // New prop for generic infinite loop
  speed?: number; // ms duration for scroll or interval
  padding?: number;
  showIndicators?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderItem: (item: any, index: number) => React.ReactNode;
};

const Carousel: React.FC<CarouselProps> = ({
  items,
  direction = "horizontal",
  itemWidth = "85%",
  height,
  gap = 16,
  infinite = false, // Default to false unless vertical
  speed = 3000,
  padding = 0,
  showIndicators = true,
  renderItem,
}) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use infinite mode if explicitly set OR if it's vertical (ticker is typically infinite)
  const isInfinite = infinite || direction === "vertical";

  // Smart default: If horizontal infinite (marquee), default width should be "auto" (content width) 
  // instead of "85%" (card width), unless user explicitly overrode it.
  const effectiveItemWidth = (direction === "horizontal" && isInfinite && itemWidth === "85%") 
    ? "auto" 
    : itemWidth;

  // --- INFINITE TICKER / MARQUEE (Both Directions) ---
  if (isInfinite) {
    // For infinite loop, we duplicate the items once to ensure smooth seam
    const duplicatedItems = [...safeItems, ...safeItems];
    const containerHeight = height ?? (direction === "vertical" ? 200 : "auto");
    const containerWidth = "100%";

    // Animation Keyframe Name
    const animName = direction === "vertical" ? "scrollVertical" : "scrollHorizontal";
    
    // CSS for Masks (Fade edges)
    const maskImage = direction === "vertical" 
      ? "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
      : "linear-gradient(to right, transparent, black 5%, black 95%, transparent)";

    return (
      <div
        style={{
          position: "relative",
          height: containerHeight,
          width: containerWidth,
          overflow: "hidden",
          maskImage: maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: direction === "vertical" ? "column" : "row",
            gap: gap,
            // Animation logic
            animation: `${animName} ${Math.max(safeItems.length, 1) * (speed / 1000)}s linear infinite`,
            width: direction === "horizontal" ? "max-content" : "100%",
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                flexShrink: 0,
                width: direction === "horizontal" ? effectiveItemWidth : "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {renderItem(item, index % Math.max(safeItems.length, 1))}
            </div>
          ))}
        </div>
        
        <style>{`
          @keyframes scrollVertical {
            0% { transform: translateY(0); }
            100% { transform: translateY(calc(-50% - ${gap / 2}px)); }
          }
           @keyframes scrollHorizontal {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - ${gap / 2}px)); }
          }
        `}</style>
      </div>
    );
  }

  // --- HORIZONTAL SWIPE CAROUSEL (Manual) ---
  
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const totalScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    if (totalScroll > 0) {
        const progress = scrollLeft / totalScroll;
        const newIndex = Math.round(progress * (safeItems.length - 1));
        setActiveIndex(newIndex);
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: gap,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingLeft: padding || 24, // Peeking padding (start)
          paddingRight: padding || 24, // Peeking padding (end)
          paddingBottom: 4, // Space for shadow
          scrollbarWidth: "none", // Hide scrollbar Firefox
          msOverflowStyle: "none", // Hide scrollbar IE
          WebkitOverflowScrolling: "touch",
        }}
        className="no-scrollbar"
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        {safeItems.map((item, index) => (
          <div
            key={index}
            style={{
              flex: `0 0 ${itemWidth}`,
              scrollSnapAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Indicators */}
      {showIndicators && safeItems.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {safeItems.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: idx === activeIndex ? "#2563eb" : "#d1d5db",
                transition: "background-color 0.2s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
