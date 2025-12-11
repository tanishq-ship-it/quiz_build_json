import { useState } from "react";
import Screens from "./Screens/Screens";
import qtImage from "./assests/qt.svg";

// ============================================================
// SCREENS JSON - Pure JSON definition of all 10 screens
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SCREENS_JSON: any[] = [
  // Screen 1: Welcome
  {
    id: "welcome",
    content: [
      { type: "image", src: "{{image}}", width: "45%", shape: "rounded" },
      { type: "heading", content: "Welcome to the Quiz!", fontSize: 26 },
      { type: "text", content: "Discover yourself through fun questions.", align: "center", color: "#555", fontSize: 15 },
      { type: "button", text: "Get Started", bgColor: "#2563eb" },
    ],
  },

  // Screen 2: 2x2 Image Cards (Checkbox) - INCREASED GAP
  {
    id: "interests",
    content: [
      { type: "heading", content: "What interests you?", fontSize: 24 },
      { type: "text", content: "Select all that apply", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "checkbox",
        layout: "2x2",
        gap: 16,
        options: [
          { variant: "imageCard", imageSrc: "{{image}}", text: "Design", width: 140, textBgColor: "#2563eb", textColor: "#fff", imageFill: true, value: "design" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Code", width: 140, textBgColor: "#10b981", textColor: "#fff", imageFill: true, value: "code" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Music", width: 140, textBgColor: "#f59e0b", textColor: "#fff", imageFill: true, value: "music" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Art", width: 140, textBgColor: "#ef4444", textColor: "#fff", imageFill: true, value: "art" },
        ],
      },
      { type: "button", text: "Continue", bgColor: "#2563eb" },
    ],
  },

  // Screen 3: 3x3 Square Buttons + Response Cards - INCREASED GAP & SIZE
  {
    id: "letter",
    content: [
      { type: "heading", content: "Choose your letter", fontSize: 24 },
      { type: "text", content: "Pick one that speaks to you", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "radio",
        layout: "3x3",
        gap: 12,
        options: [
          { variant: "square", character: "A", size: 65, value: "A" },
          { variant: "square", character: "B", size: 65, value: "B" },
          { variant: "square", character: "C", size: 65, value: "C" },
          { variant: "square", character: "D", size: 65, value: "D" },
          { variant: "square", character: "E", size: 65, value: "E" },
          { variant: "square", character: "F", size: 65, value: "F" },
          { variant: "square", character: "G", size: 65, value: "G" },
          { variant: "square", character: "H", size: 65, value: "H" },
          { variant: "square", character: "I", size: 65, value: "I" },
        ],
        responseCards: {
          A: { variant: "message", message: "**A** - You're an Achiever! 🏆", bgColor: "#dbeafe" },
          B: { variant: "message", message: "**B** - You're a Builder! 🔨", bgColor: "#dcfce7" },
          C: { variant: "quotation", quote: "C is for Courage!", author: "Quiz Master", bgColor: "#fef3c7" },
          D: { variant: "message", message: "**D** - You're Determined! 💪", bgColor: "#f3e8ff" },
          E: { variant: "message", message: "**E** - You're Energetic! ⚡", bgColor: "#ecfdf5" },
          F: { variant: "message", message: "**F** - You're Fantastic! ✨", bgColor: "#fef2f2" },
          G: { variant: "message", message: "**G** - You're Great! 🌟", bgColor: "#f0fdf4" },
          H: { variant: "message", message: "**H** - You're Heroic! 🦸", bgColor: "#eff6ff" },
          I: { variant: "message", message: "**I** - You're Incredible! 🚀", bgColor: "#fdf4ff" },
        },
        responsePosition: "bottom",
      },
      { type: "button", text: "Submit", bgColor: "#2563eb" },
    ],
  },

  // Screen 4: 4x1 Flat (Radio, Auto-complete) - INCREASED GAP
  {
    id: "age",
    content: [
      { type: "heading", content: "What's your age?", fontSize: 24 },
      { type: "text", content: "Select one to continue", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "radio",
        layout: "4x1",
        gap: 12,
        options: [
          { variant: "flat", text: "18-24", width: 280, height: 52, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "18-24" },
          { variant: "flat", text: "25-34", width: 280, height: 52, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "25-34" },
          { variant: "flat", text: "35-44", width: 280, height: 52, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "35-44" },
          { variant: "flat", text: "45+", width: 280, height: 52, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "45+" },
        ],
      },
    ],
  },

  // Screen 5: 4x2 Flat (Checkbox) - INCREASED GAP & SIZE
  {
    id: "growth",
    content: [
      { type: "heading", content: "Where do you want to grow?", fontSize: 22 },
      { type: "text", content: "Select all areas", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "checkbox",
        layout: "4x2",
        gap: 12,
        options: [
          { variant: "flat", text: "🚀 Leadership", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "leadership" },
          { variant: "flat", text: "🎨 Creativity", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "creativity" },
          { variant: "flat", text: "💼 Career", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "career" },
          { variant: "flat", text: "💰 Finance", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "finance" },
          { variant: "flat", text: "😎 Confidence", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "confidence" },
          { variant: "flat", text: "💕 Relationships", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "relationships" },
          { variant: "flat", text: "🛁 Self-care", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "self-care" },
          { variant: "flat", text: "🤗 Emotions", width: 140, height: 48, bgColor: "#fff", textColor: "#333", textAlign: "left", value: "emotions" },
        ],
      },
      { type: "button", text: "Continue", bgColor: "#2563eb" },
    ],
  },

  // Screen 6: 3x3 Circle Image Cards - INCREASED GAP & SIZE
  {
    id: "leaders",
    content: [
      { type: "heading", content: "Who inspires you?", fontSize: 24 },
      { type: "text", content: "Select your role models", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "checkbox",
        layout: "3x3",
        gap: 14,
        options: [
          { variant: "imageCard", imageSrc: "{{image}}", text: "Elon Musk", width: 95, imageShape: "circle", value: "l1" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Oprah", width: 95, imageShape: "circle", value: "l2" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Steve Jobs", width: 95, imageShape: "circle", value: "l3" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Beyoncé", width: 95, imageShape: "circle", value: "l4" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Bill Gates", width: 95, imageShape: "circle", value: "l5" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Michelle O", width: 95, imageShape: "circle", value: "l6" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Einstein", width: 95, imageShape: "circle", value: "l7" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Malala", width: 95, imageShape: "circle", value: "l8" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "Gandhi", width: 95, imageShape: "circle", value: "l9" },
        ],
      },
      { type: "button", text: "Continue", bgColor: "#2563eb" },
    ],
  },

  // Screen 7: 3x3 Image-only Cards - INCREASED GAP & SIZE
  {
    id: "favorites",
    content: [
      { type: "heading", content: "Pick your favorites", fontSize: 24 },
      { type: "text", content: "Select images you like", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "checkbox",
        layout: "3x3",
        gap: 14,
        options: [
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i1" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i2" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i3" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i4" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i5" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i6" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i7" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i8" },
          { variant: "imageCard", imageSrc: "{{image}}", text: "", width: 95, value: "i9" },
        ],
      },
      { type: "button", text: "Continue", bgColor: "#2563eb" },
    ],
  },

  // Screen 8: Yes/No + Response Screens - INCREASED GAP
  {
    id: "ready",
    content: [
      { type: "heading", content: "Ready to continue?", fontSize: 24 },
      { type: "text", content: "Your choice determines the next step", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "radio",
        layout: "1x2",
        gap: 20,
        options: [
          { variant: "flat", text: "Yes ✓", width: 130, height: 50, bgColor: "#dcfce7", textColor: "#166534", value: "yes" },
          { variant: "flat", text: "No ✗", width: 130, height: 50, bgColor: "#fef2f2", textColor: "#991b1b", value: "no" },
        ],
        responseScreens: {
          yes: {
            content: [
              { type: "heading", content: "Awesome! 🎉", fontSize: 28 },
              { type: "card", variant: "info", bgColor: "#ecfdf5", content: [
                { type: "text", content: "✅ **Great choice!**", align: "center", fontSize: 18 },
                { type: "text", content: "You're on the right track.", align: "center", color: "#166534" },
              ]},
              { type: "image", src: "{{image}}", width: "35%", shape: "circle" },
              { type: "button", text: "Continue", bgColor: "#10b981" },
            ],
          },
          no: {
            content: [
              { type: "heading", content: "No worries! 👋", fontSize: 28 },
              { type: "card", variant: "quotation", quote: "Every journey starts when you're ready.", author: "Wise Words", bgColor: "#fef3c7" },
              { type: "card", variant: "message", message: "Take your time. **No pressure!**", bgColor: "#fff" },
              { type: "button", text: "Continue Anyway", bgColor: "#f59e0b" },
            ],
          },
        },
      },
    ],
  },

  // Screen 9: 1x5 Rating + Response Cards (Auto-complete) - INCREASED GAP
  {
    id: "rating",
    content: [
      { type: "heading", content: "Rate your experience", fontSize: 24 },
      { type: "text", content: "1 = Poor, 5 = Amazing", align: "center", color: "#555", fontSize: 14 },
      {
        type: "selection",
        mode: "radio",
        layout: "1x5",
        gap: 16,
        options: [
          { variant: "square", character: "1", size: 52, value: 1 },
          { variant: "square", character: "2", size: 52, value: 2 },
          { variant: "square", character: "3", size: 52, value: 3 },
          { variant: "square", character: "4", size: 52, value: 4 },
          { variant: "square", character: "5", size: 52, value: 5 },
        ],
        responseCards: {
          1: { variant: "message", message: "😢 We're sorry! We'll do better.", bgColor: "#fef2f2" },
          2: { variant: "message", message: "🙁 Thanks for your honesty.", bgColor: "#fef3c7" },
          3: { variant: "quotation", quote: "Room to improve!", author: "Feedback", bgColor: "#f0fdf4" },
          4: { variant: "message", message: "😊 Great! Glad you enjoyed!", bgColor: "#ecfdf5" },
          5: { variant: "info", bgColor: "#eff6ff", content: [
            { type: "text", content: "🎉 **Perfect Score!**", align: "center", fontSize: 18, fontWeight: 700 },
            { type: "text", content: "Thank you so much!", align: "center", color: "#1d4ed8" },
          ]},
        },
        responsePosition: "top",
      },
    ],
  },

  // Screen 10: Complete
  {
    id: "complete",
    content: [
      { type: "heading", content: "You're all done! 🎊", fontSize: 28 },
      { type: "card", variant: "quotation", quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", quoteSymbolColor: "#2563eb" },
      { type: "card", variant: "message", message: "## Thank You! 🙏\n\nYou completed all **10 screens**.\n\n- ✅ Preferences saved\n- ✅ Personalization ready\n- ✅ You're good to go!", bgColor: "#f0fdf4" },
      { type: "card", variant: "info", bgColor: "#eff6ff", content: [
        { type: "image", src: "{{image}}", width: "35%", shape: "circle", align: "center" },
        { type: "text", content: "**Your Journey Begins**", align: "center", fontSize: 18 },
      ]},
      { type: "button", text: "Start Over", bgColor: "#2563eb" },
    ],
  },
];

// ============================================================
// APP - Renders screens from JSON
// ============================================================
function App() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, SCREENS_JSON.length - 1));
  const reset = () => setIndex(0);

  // Delayed next (2.5 sec) for radio auto-complete
  const delayedNext = () => {
    setTimeout(() => {
      next();
    }, 2500);
  };

  // Replace placeholders and inject callbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processContent = (content: any[], isLast: boolean): any[] => {
    // Check if this screen has a button (no auto-complete delay needed)
    const hasButton = content.some((item) => item.type === "button");

    return content.map((item) => {
      const copy = { ...item };

      // Replace image placeholders
      if (copy.src === "{{image}}") copy.src = qtImage;
      if (copy.imageSrc === "{{image}}") copy.imageSrc = qtImage;

      // Button: add onClick
      if (copy.type === "button") {
        copy.onClick = isLast ? reset : next;
      }

      // Selection: add callbacks
      if (copy.type === "selection") {
        copy.onChange = () => {};
        // If no button and radio mode, use delayed transition (2.5s)
        copy.onComplete = hasButton ? next : delayedNext;
        if (copy.options) {
          copy.options = copy.options.map((o: { imageSrc?: string }) =>
            o.imageSrc === "{{image}}" ? { ...o, imageSrc: qtImage } : o
          );
        }
        if (copy.responseScreens) {
          for (const key of Object.keys(copy.responseScreens)) {
            copy.responseScreens[key].content = processContent(copy.responseScreens[key].content, isLast);
          }
        }
      }

      // Card info: replace images
      if (copy.type === "card" && copy.variant === "info" && copy.content) {
        copy.content = copy.content.map((c: { src?: string }) =>
          c.src === "{{image}}" ? { ...c, src: qtImage } : c
        );
      }

      return copy;
    });
  };

  const screen = SCREENS_JSON[index];
  const isLast = index === SCREENS_JSON.length - 1;
  const content = processContent(screen.content, isLast);

  return (
    <div className="app-container">
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens key={screen.id} content={content} />
        </div>
      </section>
    </div>
  );
}

export default App;
