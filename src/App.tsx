import Button from "./Components/Button";
import ListBlock from "./Components/listBock";
import Text from "./Components/Text";
import Image from "./Components/Image";
import qtImage from "./assests/qt.svg";

function App() {
  return (
    <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 40 }}>
      {/* Section 1: Square Buttons */}
      <section>
        <h2 style={{ marginBottom: 16 }}>1. Square Buttons</h2>
        <p style={{ marginBottom: 12, color: "#666" }}>Letters (default 30px):</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Button variant="square" character="A" />
          <Button variant="square" character="B" />
          <Button variant="square" character="C" />
          <Button variant="square" character="D" />
        </div>
        <p style={{ marginBottom: 12, color: "#666" }}>Numbers:</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <Button variant="square" character="1" />
          <Button variant="square" character="2" />
          <Button variant="square" character="3" />
          <Button variant="square" character="4" />
        </div>
        <p style={{ marginBottom: 12, color: "#666" }}>Different sizes:</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="square" character="S" size={25} />
          <Button variant="square" character="M" size={35} />
          <Button variant="square" character="L" size={45} />
          <Button variant="square" character="X" size={55} />
        </div>
      </section>

      {/* Section 2: Image Card Buttons */}
      <section>
        <h2 style={{ marginBottom: 16 }}>2. Image Card Buttons</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* Default */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="Default"
          />
          {/* Centered text */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="Centered"
            textAlign="center"
          />
          {/* Right aligned */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="Right"
            textAlign="right"
          />
          {/* Circle image */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="Circle"
            imageShape="circle"
            textAlign="center"
          />
          {/* Custom colors */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="Green BG"
            textBgColor="#16a34a"
            textAlign="center"
          />
          {/* No background */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="No BG"
            textBgColor="transparent"
            textColor="#333"
            textAlign="center"
          />
          {/* Larger size */}
          <Button
            variant="imageCard"
            imageSrc={qtImage}
            text="Large"
            width={200}
            textAlign="center"
          />
        </div>
      </section>

      {/* Section 3: Flat Buttons */}
      <section>
        <h2 style={{ marginBottom: 16 }}>3. Flat Buttons</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 350 }}>
          {/* Default blue centered */}
          <Button variant="flat" text="Continue" />
          {/* White left aligned */}
          <Button
            variant="flat"
            text="18-24"
            bgColor="#fff"
            textColor="#333"
            textAlign="left"
          />
          {/* White centered */}
          <Button
            variant="flat"
            text="25-34"
            bgColor="#fff"
            textColor="#333"
            textAlign="center"
          />
          {/* White right aligned */}
          <Button
            variant="flat"
            text="35-44"
            bgColor="#fff"
            textColor="#333"
            textAlign="right"
          />
          {/* Custom red */}
          <Button
            variant="flat"
            text="Delete"
            bgColor="#dc2626"
          />
          {/* Custom green */}
          <Button
            variant="flat"
            text="Success"
            bgColor="#16a34a"
          />
        </div>
      </section>

      {/* Section 4: List Blocks */}
      <section>
        <h2 style={{ marginBottom: 16 }}>4. List Blocks</h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {/* Default */}
          <ListBlock
            content={{
              heading: "After",
              data: [
                { icon: "😀", text: "Achieved goals" },
                { icon: "😀", text: "Career growth" },
                { icon: "😀", text: "Confident communication" },
                { icon: "😀", text: "High emotional intelligence" },
              ],
            }}
          />
          {/* Custom background */}
          <ListBlock
            content={{
              heading: "Benefits",
              data: [
                { icon: "🚀", text: "Fast results" },
                { icon: "💪", text: "Build strength" },
                { icon: "🧘", text: "Stay calm" },
                { icon: "✨", text: "Feel great" },
              ],
            }}
            bgColor="#f0f9ff"
          />
          {/* Larger size */}
          <ListBlock
            content={{
              heading: "Features",
              data: [
                { icon: "📱", text: "Mobile friendly" },
                { icon: "🔒", text: "Secure" },
                { icon: "⚡", text: "Lightning fast" },
              ],
            }}
            width={220}
            bgColor="#fef3c7"
            titleColor="#92400e"
            textColor="#78350f"
          />
        </div>
      </section>

      {/* Section 5: Text Component */}
      <section>
        <h2 style={{ marginBottom: 16 }}>5. Text Component</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 500 }}>
          {/* Left aligned (default) */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Left aligned:</p>
            <Text content="This is **bold text** and this is *italic text*. You can mix them." />
          </div>

          {/* Center aligned */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Center aligned:</p>
            <Text
              content="**Welcome to our app!** Start your journey today."
              align="center"
              fontSize={20}
            />
          </div>

          {/* Right aligned */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Right aligned:</p>
            <Text
              content="*Thank you for joining us*"
              align="right"
              color="#666"
            />
          </div>

          {/* Custom styling */}
          <div style={{ padding: 16, backgroundColor: "#1e3a5f", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#999", fontSize: 12 }}>Custom colors:</p>
            <Text
              content="**Build something amazing** with our tools."
              align="center"
              fontSize={18}
              color="#fff"
            />
          </div>

          {/* Markdown features */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Markdown features:</p>
            <Text
              content={`## Heading 2

This is a paragraph with **bold** and *italic*.

- Item one
- Item two
- Item three`}
              fontSize={14}
            />
          </div>
        </div>
      </section>

      {/* Section 6: Image Component */}
      <section>
        <h2 style={{ marginBottom: 16 }}>6. Image Component</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 400 }}>
          {/* Default (no shape, centered, 80% width) */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Default (no shape, 80% width):</p>
            <Image src={qtImage} alt="Chart" />
          </div>

          {/* Circle shape */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Circle shape (50% width):</p>
            <Image src={qtImage} alt="Chart" shape="circle" width="50%" />
          </div>

          {/* Rounded shape */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Rounded shape:</p>
            <Image src={qtImage} alt="Chart" shape="rounded" width="70%" />
          </div>

          {/* Blob shape */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Blob shape:</p>
            <Image src={qtImage} alt="Chart" shape="blob" width="60%" />
          </div>

          {/* With border (auto-enabled when borderColor provided) */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>With border (just pass borderColor):</p>
            <Image src={qtImage} alt="Chart" shape="rounded" borderColor="#2563eb" borderWidth={3} />
          </div>

          {/* Circle with border */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Circle + border:</p>
            <Image src={qtImage} alt="Chart" shape="circle" width="50%" borderColor="#16a34a" />
          </div>

          {/* Left aligned */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Left aligned:</p>
            <Image src={qtImage} alt="Chart" width="50%" align="left" shape="rounded" />
          </div>

          {/* Right aligned */}
          <div style={{ padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 12 }}>Right aligned:</p>
            <Image src={qtImage} alt="Chart" width="50%" align="right" shape="rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
