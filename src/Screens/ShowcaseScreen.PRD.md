# ShowcaseScreen Component PRD

A flexible screen component for displaying content items (headings, images, and text) in any order with a bottom action button.

---

## Overview

The `ShowcaseScreen` component renders an array of content items (headings, images, text) in the order provided, with a centered flat button at the bottom. Perfect for onboarding screens, feature showcases, or informational pages.

- **Background**: Transparent by default (inherits from parent)
- **Height**: Fills container (`height: 100%`)
- **Content**: Vertically centered with flexible ordering

```tsx
import ShowcaseScreen from "./Screens/ShowcaseScreen";
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `ContentItem[]` | Yes | - | Array of content items to display |
| `buttonText` | `string` | No | `"Continue"` | Button label |
| `onButtonClick` | `() => void` | No | - | Button click handler |
| `buttonBgColor` | `string` | No | `"#2563eb"` | Button background color |
| `buttonTextColor` | `string` | No | `"#fff"` | Button text color |
| `buttonWidth` | `number` | No | `300` | Button width in pixels |
| `gap` | `number` | No | `24` | Gap between content items |
| `padding` | `number` | No | `24` | Screen padding |

---

## Content Item Types

### Image Item

```tsx
{
  type: "image";
  src: string;              // Required - Image URL
  alt?: string;             // Alt text
  width?: string | number;  // Default: "80%"
  shape?: "none" | "circle" | "rounded" | "blob";
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
  align?: "left" | "center" | "right";
}
```

### Text Item

```tsx
{
  type: "text";
  content: string;          // Required - Markdown text
  align?: "left" | "center" | "right";
  fontSize?: number;        // Default: 16
  color?: string;           // Default: "#333"
  fontWeight?: number;      // Default: 400
  lineHeight?: number;      // Default: 1.5
}
```

### Heading Item

```tsx
{
  type: "heading";
  content: string;          // Required - Heading text (plain, no markdown)
  align?: "left" | "center" | "right";  // Default: "center"
  fontSize?: number;        // Default: 28
  color?: string;           // Default: "#333"
  fontWeight?: number;      // Default: 700
}
```

---

## Examples

### Basic Usage (Image, Heading, Text, Image)

```tsx
<ShowcaseScreen
  content={[
    { type: "image", src: "/hero.png", width: "50%", shape: "rounded" },
    { type: "heading", content: "Welcome to the App!" },
    { type: "text", content: "Start your journey with us today.", align: "center", color: "#666" },
    { type: "image", src: "/icon.png", width: "30%", shape: "circle" },
  ]}
  buttonText="Get Started"
  onButtonClick={() => navigate("/next")}
/>
```

### Heading with Text

```tsx
<ShowcaseScreen
  content={[
    { type: "heading", content: "Welcome" },
    { type: "text", content: "This is a **great** app for you.", align: "center" },
    { type: "text", content: "- Feature one\n- Feature two\n- Feature three" },
  ]}
  buttonText="Continue"
/>
```

### Mixed Order

```tsx
<ShowcaseScreen
  content={[
    { type: "text", content: "## Step 1", align: "center", fontSize: 18 },
    { type: "image", src: "/step1.png", width: "60%" },
    { type: "text", content: "Complete your profile", align: "center" },
    { type: "text", content: "## Step 2", align: "center", fontSize: 18 },
    { type: "image", src: "/step2.png", width: "60%" },
    { type: "text", content: "Set your goals", align: "center" },
  ]}
  buttonText="Next"
  gap={16}
/>
```

### Custom Button Colors

```tsx
<ShowcaseScreen
  content={[
    { type: "image", src: "/success.png", shape: "blob" },
    { type: "text", content: "**Congratulations!**", align: "center", fontSize: 24 },
  ]}
  buttonText="Finish"
  buttonBgColor="#16a34a"
  buttonTextColor="#fff"
  buttonWidth={250}
/>
```

---

## Layout

```
┌─────────────────────────────┐
│         [padding]           │
│                             │
│    ┌─────────────────┐      │
│    │     Content     │      │
│    │    (centered)   │      │
│    │                 │      │
│    │  [gap between]  │      │
│    │                 │      │
│    │     items...    │      │
│    └─────────────────┘      │
│                             │
│    ┌─────────────────┐      │
│    │  [Flat Button]  │      │
│    └─────────────────┘      │
│                             │
└─────────────────────────────┘
```

---

## Use Cases

1. **Onboarding screens** - Welcome users with images and text
2. **Feature showcases** - Highlight app features
3. **Success/completion screens** - Show confirmation with action
4. **Information pages** - Display content before proceeding
5. **Tutorial steps** - Guide users through a process

---

## Styling Details

| Element | Style |
|---------|-------|
| Container | `height: 100%`, transparent background, flex column |
| Content area | Flex 1, centered, max-width 500px |
| Button area | Fixed at bottom with 16px padding |
| Button | Flat variant, 12px border-radius |

---

## Screen Layout Integration

This component is designed to work with the **Screen Layout System**. See `ScreenLayout.PRD.md` for full documentation.

### Quick Usage

```tsx
<div className="app-container">
  <section className="screen-section">
    <div className="mobile-frame">
      <ShowcaseScreen
        content={[...]}
        buttonText="Get Started"
      />
  </div>
</section>
```

### Responsive Mobile Frame

| Device | Breakpoint | Frame Width | Frame Height |
|--------|------------|-------------|--------------|
| Desktop | ≥ 1440px | `30vw` | `80vh` |
| Laptop | 1024px - 1439px | `35vw` | `80vh` |
| Tablet | 768px - 1023px | `50vw` | `80vh` |
| Mobile | < 768px | `100%` | `100%` |

For full layout documentation, see `ScreenLayout.PRD.md`.

---

## Dependencies

Uses existing components:
- `Image` - For image items
- `Text` - For text items (with markdown)
- `Button` - Flat variant for action button (12px border-radius)

---

## Related Documentation

- `ScreenLayout.PRD.md` - Full-viewport screen layout system
- `Button.PRD.md` - Button component variants
- `Image.PRD.md` - Image component with shapes
- `Text.PRD.md` - Markdown text component
