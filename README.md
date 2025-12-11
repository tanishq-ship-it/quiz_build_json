# Quiz Build JSON - Component Library

A React + TypeScript component library for building quiz and survey interfaces.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Inter Font** - Typography

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Build for production
pnpm run build
```

## Components

### 1. Button

A flexible button component with multiple variants.

| Variant | Description |
|---------|-------------|
| `square` | Small square button with single character (A, B, C, D) |
| `imageCard` | Card with image and text label |
| `flat` | Full-width action button |

```tsx
import Button from "./Components/Button";

// Square button
<Button variant="square" character="A" size={40} />

// Image card button
<Button variant="imageCard" imageSrc="/avatar.png" text="Male" />

// Flat button
<Button variant="flat" text="Continue" />
```

📄 [Full documentation](src/Components/Button.PRD.md)

---

### 2. ListBlock

Vertical list card with icons and text items.

```tsx
import ListBlock from "./Components/listBock";

<ListBlock
  content={{
    heading: "Benefits",
    data: [
      { icon: "🚀", text: "Fast results" },
      { icon: "💪", text: "Build strength" },
    ],
  }}
  bgColor="#f0f9ff"
/>
```

📄 [Full documentation](src/Components/ListBlock.PRD.md)

---

### 3. Text

Markdown-enabled text component with alignment options.

```tsx
import Text from "./Components/Text";

<Text
  content="This is **bold** and *italic* text."
  align="center"
  fontSize={18}
/>
```

**Supports:** Bold, italic, headings, bullet lists, numbered lists

📄 [Full documentation](src/Components/Text.PRD.md)

---

### 4. Image

Flexible image component with shape and border options.

```tsx
import Image from "./Components/Image";

// Circle avatar with border
<Image src="/avatar.jpg" shape="circle" borderColor="#2563eb" />

// Rounded image
<Image src="/photo.jpg" shape="rounded" width="70%" />
```

**Shapes:** `none`, `circle`, `rounded`, `blob`

📄 [Full documentation](src/Components/Image.PRD.md)

---

## Typography

The app uses **Inter** font family with the following weights:

| Class | Weight | Usage |
|-------|--------|-------|
| `font-inter-regular` | 400 | Body text |
| `font-inter-medium` | 500 | Buttons, labels |
| `font-inter-semibold` | 600 | Headings |
| `font-inter-bold` | 700 | Strong emphasis |

```tsx
// Using TypeScript constants
import { FONT_INTER, FONT_INTER_SEMIBOLD } from "./styles/fonts";

<p style={{ fontFamily: FONT_INTER, fontWeight: FONT_INTER_SEMIBOLD }}>
  Title
</p>
```

📄 [Full documentation](src/styles/Fonts.PRD.md)

---

## Project Structure

```
src/
├── Components/
│   ├── Button.tsx          # Button component
│   ├── Button.PRD.md       # Button documentation
│   ├── listBock.tsx        # ListBlock component
│   ├── ListBlock.PRD.md    # ListBlock documentation
│   ├── Text.tsx            # Text component
│   ├── Text.PRD.md         # Text documentation
│   ├── Image.tsx           # Image component
│   └── Image.PRD.md        # Image documentation
├── styles/
│   ├── fonts.ts            # Font constants
│   └── Fonts.PRD.md        # Font documentation
├── assests/
│   └── qt.svg              # Sample image
├── App.tsx                 # Demo page with all components
├── index.css               # Global styles + Tailwind
└── main.tsx                # App entry point
```

---

## Demo

Run `pnpm run dev` and open http://localhost:5173 to see all components in action.

---

## License

MIT
