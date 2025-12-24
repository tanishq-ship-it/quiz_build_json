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
  speed = 3000,
  padding = 0,
  showIndicators = true,
  renderItem,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- VERTICAL INFINITE TICKER ---
  if (direction === "vertical") {
    // For infinite loop, we duplicate the items once
    const duplicatedItems = [...items, ...items];
    // Dynamic height based on standard usually, but specifically passed for Ticker
    const containerHeight = height ?? 200; 
    
    // We use a CSS animation for the infinite scroll
    // We need to inject the keyframes style dynamically or use inline style for transform
    
    return (
      <div
        style={{
          position: "relative",
          height: containerHeight,
          overflow: "hidden",
          width: "100%",
          // Fade masks at top and bottom
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: gap,
            // Animation logic
            animation: `scrollVertical ${items.length * (speed / 1000)}s linear infinite`,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} style={{ flexShrink: 0 }}>
              {renderItem(item, index % items.length)}
            </div>
          ))}
        </div>
        
        <style>{`
          @keyframes scrollVertical {
            0% { transform: translateY(0); }
            100% { transform: translateY(calc(-50% - ${gap / 2}px)); }
          }
        `}</style>
      </div>
    );
  }

  // --- HORIZONTAL SWIPE CAROUSEL ---
  
  // Track active index on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    // const width = scrollRef.current.offsetWidth;
    // Simple calculation: center point
    // const index = Math.round(scrollLeft / (width * 0.85)); // approx based on item width
    // A better way is intersection observer, but scroll math is fine for simple usage
    // Actually, with variable widths it's tricky.
    // Let's rely on item width assumption or just dividing by ScrollWidth/Items
    
    // To keep it simple for now: simple index tracking relative to total scroll width
    const totalScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    if (totalScroll > 0) {
        const progress = scrollLeft / totalScroll;
        const newIndex = Math.round(progress * (items.length - 1));
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
        className="no-scrollbar" // Helper class if you have tailwind, otherwise inline style below handles it mostly
      >
        {/* Style to hide scrollbar in Webkit */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        {items.map((item, index) => (
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
      {showIndicators && items.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {items.map((_, idx) => (
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
