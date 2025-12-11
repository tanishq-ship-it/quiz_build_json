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

      {/* Screen 3: 3x3 Square Buttons */}
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
                  { variant: "square", character: "A", size: 70 },
                  { variant: "square", character: "B", size: 70 },
                  { variant: "square", character: "C", size: 70 },
                  { variant: "square", character: "D", size: 70 },
                  { variant: "square", character: "E", size: 70 },
                  { variant: "square", character: "F", size: 70 },
                  { variant: "square", character: "G", size: 70 },
                  { variant: "square", character: "H", size: 70 },
                  { variant: "square", character: "I", size: 70 },
                ],
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

      {/* Screen 7: Image-only Cards (no text) - NO BUTTON */}
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

    </div>
  );
}

export default App;
