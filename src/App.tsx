import Screens from "./Screens/Screens";
import qtImage from "./assests/qt.svg";

function App() {
  return (
    <div className="app-container">
      {/* Screen 1: Showcase Screen */}
      <section className="screen-section">
        {/* Mobile Frame - Responsive width via CSS */}
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "image", src: qtImage, width: "50%", shape: "rounded" },
              { type: "heading", content: "Welcome to the App!" },
              {
                type: "text",
                content: "Start your journey with us today.",
                align: "center",
                color: "#666",
              },
              { type: "image", src: qtImage, width: "30%", shape: "circle" },
              { type: "button", text: "Get Started", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 2: 2x2 Image Cards */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "What interests you?" },
              {
                type: "text",
                content: "Select all that apply",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "checkbox",
                layout: "2x2",
                gap: 10,
                options: [
                  { variant: "imageCard", imageSrc: qtImage, text: "Design", width: 150, textBgColor: "#2563eb", textColor: "#fff", imageFill: true },
                  { variant: "imageCard", imageSrc: qtImage, text: "Code", width: 150, textBgColor: "#10b981", textColor: "#fff", imageFill: true },
                  { variant: "imageCard", imageSrc: qtImage, text: "Music", width: 150, textBgColor: "#f59e0b", textColor: "#fff", imageFill: true },
                  { variant: "imageCard", imageSrc: qtImage, text: "Art", width: 150, textBgColor: "#ef4444", textColor: "#fff", imageFill: true },
                ],
                onChange: () => {},
              },
              { type: "button", text: "Continue", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 3: 3x3 Square Buttons WITH BUTTON + Response Cards */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Choose your answer" },
              {
                type: "text",
                content: "Pick the correct option",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "radio",
                layout: "3x3",
                gap: 6,
                options: [
                  { variant: "square", character: "A", size: 70, value: "A" },
                  { variant: "square", character: "B", size: 70, value: "B" },
                  { variant: "square", character: "C", size: 70, value: "C" },
                  { variant: "square", character: "D", size: 70, value: "D" },
                  { variant: "square", character: "E", size: 70, value: "E" },
                  { variant: "square", character: "F", size: 70, value: "F" },
                  { variant: "square", character: "G", size: 70, value: "G" },
                  { variant: "square", character: "H", size: 70, value: "H" },
                  { variant: "square", character: "I", size: 70, value: "I" },
                ],
                responseCards: {
                  "A": { variant: "message", message: "You selected **A** - First letter!", bgColor: "#dbeafe" },
                  "B": { variant: "message", message: "You selected **B** - Good choice!", bgColor: "#dcfce7" },
                  "C": { variant: "quotation", quote: "C is for Courage!", author: "Quiz Master", bgColor: "#fef3c7" },
                  "D": { variant: "message", message: "**D** - Determined!", bgColor: "#f3e8ff" },
                  "E": { variant: "message", message: "**E** - Excellent!", bgColor: "#ecfdf5" },
                  "F": { variant: "message", message: "**F** - Fantastic!", bgColor: "#fef2f2" },
                  "G": { variant: "message", message: "**G** - Great!", bgColor: "#f0fdf4" },
                  "H": { variant: "message", message: "**H** - Heroic!", bgColor: "#eff6ff" },
                  "I": { variant: "message", message: "**I** - Incredible!", bgColor: "#fdf4ff" },
                },
                responsePosition: "bottom", // Card appears AFTER options, before button
                onChange: () => {},
              },
              { type: "button", text: "Submit", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 4: 4x1 Flat Buttons - Age Selection (NO BUTTON - auto-complete on radio select) */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "What's your age?" },
              {
                type: "text",
                content: "We only use your age to personalize your plan",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "radio",
                layout: "4x1",
                gap: 8,
                options: [
                  { variant: "flat", text: "18-24", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "25-34", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "35-44", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "45+", width: 300, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                ],
                onComplete: () => {}, // Called immediately when option is selected
              },
              // No button - clicking an option auto-completes
            ]}
          />
        </div>
      </section>

      {/* Screen 5: 4x2 Flat Buttons - Growth Areas */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "In which areas would you like to grow?" },
              {
                type: "text",
                content: "Your experience won't be limited by choice.",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "checkbox",
                layout: "4x2",
                gap: 8,
                options: [
                  { variant: "flat", text: "🚀 Leadership", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "🎨 Productivity", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "💼 Career", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "💰 Finance", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "😎 Confidence", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "💕 Relationships", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "🛁 Self-care", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                  { variant: "flat", text: "🤗 Emotions", width: 145, bgColor: "#fff", textColor: "#333", textAlign: "left" },
                ],
                onChange: () => {},
              },
              { type: "button", text: "Continue", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 6: 3x3 Image Cards - Role Models */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Who stands out to you as a role model?", fontSize: 24 },
              {
                type: "selection",
                mode: "checkbox",
                layout: "3x3",
                gap: 8,
                options: [
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 1", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 2", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 3", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 4", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 5", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 6", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 7", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 8", width: 105, imageShape: "circle" },
                  { variant: "imageCard", imageSrc: qtImage, text: "Person 9", width: 105, imageShape: "circle" },
                ],
                onChange: () => {},
              },
              { type: "button", text: "Continue", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 7: Image-only Cards (no text) - WITH BUTTON */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Pick your favorites", fontSize: 24 },
              {
                type: "text",
                content: "Select the images you like",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "checkbox",
                layout: "3x3",
                gap: 8,
                options: [
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                  { variant: "imageCard", imageSrc: qtImage, text: "", width: 100 },
                ],
                onChange: () => {},
              },
              { type: "button", text: "Continue", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 8: Yes/No with Response Screens - Clicking navigates to a different screen */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Do you agree?" },
              {
                type: "text",
                content: "Select one option to continue",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "radio",
                layout: "1x2",
                gap: 10,
                options: [
                  { variant: "flat", text: "Yes", size: "sm", bgColor: "#fff", textColor: "#333", value: "yes" },
                  { variant: "flat", text: "No", size: "sm", bgColor: "#fff", textColor: "#333", value: "no" },
                ],
                // Response Screens - clicking an option shows a completely different screen
                responseScreens: {
                  "yes": {
                    content: [
                      { type: "heading", content: "Great! 🎉" },
                      {
                        type: "card",
                        variant: "info",
                        bgColor: "#ecfdf5",
                        content: [
                          { type: "text", content: "✅ **Thank you for agreeing!**", align: "center", fontSize: 18 },
                          { type: "text", content: "We're excited to have you on board.", align: "center", color: "#166534" },
                        ],
                      },
                      { type: "image", src: qtImage, width: "40%", shape: "circle" },
                      { type: "text", content: "Let's get started with your journey!", align: "center", color: "#666" },
                      { type: "button", text: "Continue", onClick: () => {} },
                    ],
                  },
                  "no": {
                    content: [
                      { type: "heading", content: "No problem! 👋" },
                      {
                        type: "card",
                        variant: "quotation",
                        quote: "Every journey begins when you're ready.",
                        author: "Wise Words",
                        bgColor: "#fef3c7",
                      },
                      {
                        type: "card",
                        variant: "message",
                        message: "We respect your decision. Feel free to come back anytime!\n\n**We'll be here when you need us.**",
                        bgColor: "#fff",
                      },
                      { type: "button", text: "Maybe Later", onClick: () => {} },
                    ],
                  },
                },
                onChange: () => {},
              },
              // NO BUTTON on main screen - clicking option triggers response screen
            ]}
          />
        </div>
      </section>

      {/* Screen 9: 1x5 Rating with Response Cards - Shows different card for each rating */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Rate your experience" },
              {
                type: "text",
                content: "1 = Poor, 5 = Excellent",
                align: "center",
                color: "#666",
              },
              {
                type: "selection",
                mode: "radio",
                layout: "1x5",
                gap: 12,
                options: [
                  { variant: "square", character: "1", size: 55, value: 1 },
                  { variant: "square", character: "2", size: 55, value: 2 },
                  { variant: "square", character: "3", size: 55, value: 3 },
                  { variant: "square", character: "4", size: 55, value: 4 },
                  { variant: "square", character: "5", size: 55, value: 5 },
                ],
                responseCards: {
                  1: { variant: "message", message: "😢 We're sorry to hear that! We'll work hard to improve.", bgColor: "#fef2f2" },
                  2: { variant: "message", message: "🙁 Thanks for your honesty. We'll do better!", bgColor: "#fef3c7" },
                  3: { variant: "quotation", quote: "Every journey starts with a single step.", author: "Lao Tzu", bgColor: "#f0fdf4" },
                  4: { variant: "message", message: "😊 Great! We're glad you had a good experience!", bgColor: "#ecfdf5" },
                  5: { variant: "info", bgColor: "#eff6ff", content: [
                    { type: "text", content: "🎉 **Perfect Score!**", align: "center", fontSize: 18, fontWeight: 700 },
                    { type: "text", content: "Thank you so much for the amazing rating!", align: "center", color: "#1d4ed8" },
                  ]},
                },
                responsePosition: "top",
                onComplete: () => {},
              },
              // NO BUTTON - Selection auto-completes
            ]}
          />
        </div>
      </section>

      {/* ========== CARD COMPONENT DEMOS ========== */}

      {/* Screen 10: Quotation Card */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Words of Wisdom", fontSize: 24 },
              {
                type: "card",
                variant: "quotation",
                quote: "Stay hungry, stay foolish.",
                author: "Steve Jobs",
                authorAlign: "left",
              },
              {
                type: "card",
                variant: "quotation",
                quote: "The only way to do great work is to love what you do.",
                author: "Steve Jobs",
                authorAlign: "right",
                quoteSymbolColor: "#2563eb",
              },
              { type: "button", text: "Continue", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 11: Message Card - Markdown Support */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Important Message", fontSize: 24 },
              {
                type: "card",
                variant: "message",
                message: "## Welcome! 👋\n\nThis is a **message card** with full markdown support.\n\n- ✅ Bold and *italic* text\n- ✅ Lists and headings\n- ✅ Links and `code`",
              },
              {
                type: "card",
                variant: "message",
                message: "### Quick Tip 💡\n\nYou can customize the **background color**, text color, and alignment!",
                bgColor: "#fef3c7",
                align: "center",
              },
              { type: "button", text: "Got it!", onClick: () => {} },
            ]}
          />
        </div>
      </section>

      {/* Screen 12: Info Card - Flexible Content */}
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens
            content={[
              { type: "heading", content: "Meet Your Guide", fontSize: 24 },
              {
                type: "card",
                variant: "info",
                content: [
                  { type: "image", src: qtImage, width: "50%", shape: "circle", align: "center" },
                  { type: "text", content: "**John Doe**", align: "center", fontSize: 18, fontWeight: 600 },
                  { type: "text", content: "Software Engineer", align: "center", color: "#666" },
                ],
              },
              {
                type: "card",
                variant: "info",
                bgColor: "#f0fdf4",
                content: [
                  { type: "text", content: "🎉 **Achievement Unlocked!**", align: "center", fontSize: 16 },
                  { type: "image", src: qtImage, width: "40%", shape: "rounded", align: "center" },
                  { type: "text", content: "You completed your first quiz!", align: "center", color: "#166534" },
                ],
              },
              { type: "button", text: "Let's Go!", onClick: () => {} },
            ]}
          />
        </div>
      </section>

    </div>
  );
}

export default App;
