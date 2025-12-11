import ShowcaseScreen from "./Screens/ShowcaseScreen";
import qtImage from "./assests/qt.svg";

function App() {
  return (
    <div className="app-container">
      {/* Screen 1: Showcase Screen */}
      <section className="screen-section">
        {/* Mobile Frame - Responsive width via CSS */}
        <div className="mobile-frame">
          <ShowcaseScreen
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
            ]}
            buttonText="Get Started"
            onButtonClick={() => console.log("Button clicked!")}
          />
        </div>
      </section>

    </div>
  );
}

export default App;
