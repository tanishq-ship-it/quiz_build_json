# Text Component PRD

A flexible text component with markdown support and customizable styling.

---

## Overview

The `Text` component renders text content with markdown formatting support. It allows for easy text alignment, sizing, and styling while supporting common markdown syntax like bold, italic, headings, and lists.

```tsx
import Text from "./Components/Text";
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `string` | Yes | - | Markdown text content |
| `segments` | `TextSegment[]` | No | - | Optional: inline segments (no HTML/CSS). If provided, `content` is ignored. Supports hyperlinks per segment. |
| `align` | `"left" \| "center" \| "right"` | No | `"left"` | Text alignment |
| `fontSize` | `number` | No | `16` | Base font size in pixels |
| `color` | `string` | No | `"#333"` | Text color |
| `fontWeight` | `number` | No | `400` | Font weight |
| `lineHeight` | `number` | No | `1.5` | Line height multiplier |

---

## TextSegment

When using `segments`, each segment supports styling and optional hyperlinks:

```ts
type TextSegment = {
  content: string;
  color?: string;
  fontWeight?: number;
  fontSize?: number;
  /**
   * Optional hyperlink for this segment.
   * When provided, the segment renders as an <a>.
   */
  url?: string;
  /**
   * When true, opens the link in a new tab (target="_blank").
   */
  openInNewTab?: boolean;
  /**
   * Optional underline toggle for links.
   */
  underline?: boolean;
};
```

**Link behavior:**
- If a segment has `url`, it renders as a clickable link.
- Link default color (when `color` is not set): `#1677ff`
- When `openInNewTab: true`, the link opens in a new tab with `rel="noopener noreferrer"`.

---

## Markdown Support

The component supports the following markdown syntax:

| Syntax | Output | Example |
|--------|--------|---------|
| `**text**` | Bold | **bold text** |
| `*text*` | Italic | *italic text* |
| `# Heading` | H1 | Large heading (2× font size) |
| `## Heading` | H2 | Medium heading (1.5× font size) |
| `### Heading` | H3 | Small heading (1.25× font size) |
| `- item` | Bullet list | • item |
| `1. item` | Numbered list | 1. item |
| `[text](https://...)` | Link | Opens in a new tab |

---

## Examples

### Basic Text with Markdown

```tsx
<Text content="This is **bold text** and this is *italic text*." />
```

### Centered Text

```tsx
<Text
  content="**Welcome to our app!** Start your journey today."
  align="center"
  fontSize={20}
/>
```

### Right Aligned Text

```tsx
<Text
  content="*Thank you for joining us*"
  align="right"
  color="#666"
/>
```

### Custom Styling

```tsx
<Text
  content="**Build something amazing** with our tools."
  align="center"
  fontSize={18}
  color="#fff"
  fontWeight={500}
  lineHeight={1.8}
/>
```

### Inline Color Without HTML (Segments)

Use `segments` when you want to color only part of the text without embedding HTML/CSS in the content string.

```tsx
<Text
  align="center"
  fontSize={24}
  fontWeight={700}
  color="#333"
  segments={[
    { content: "Join millions who trust " },
    { content: "micro-learning", color: "#2563eb" },
    { content: " to build life skills." },
  ]}
/>
```

### Inline Links (Segments)

Use `segments` when you want certain words to be clickable links (e.g., Terms / Privacy / Cookie):

```tsx
<Text
  align="center"
  fontSize={12}
  color="#888"
  segments={[
    { content: "By selecting your age, you agree with the " },
    { content: "Terms of Use and Service", url: "https://example.com/terms", openInNewTab: true },
    { content: ", " },
    { content: "Privacy Policy", url: "https://example.com/privacy", openInNewTab: true },
    { content: " and " },
    { content: "Cookie Policy", url: "https://example.com/cookies", openInNewTab: true },
    { content: "." },
  ]}
/>
```

### Links in Markdown Content

Markdown links also work and open in a new tab:

```tsx
<Text content="Read our [Terms of Use](https://example.com/terms)." />
```

### Multi-line with Headings and Lists

```tsx
<Text
  content={`## Features

Here are the **key features**:

- Fast performance
- Easy to use
- *Highly customizable*

1. Step one
2. Step two
3. Step three`}
  fontSize={14}
/>
```

---

## Text Alignment

| Value | Description |
|-------|-------------|
| `"left"` | Left-aligned text (default) |
| `"center"` | Center-aligned text |
| `"right"` | Right-aligned text |

---

## Heading Sizes

Headings scale relative to the base `fontSize`:

| Heading | Scale | Example (base 16px) |
|---------|-------|---------------------|
| H1 (`#`) | 2× | 32px |
| H2 (`##`) | 1.5× | 24px |
| H3 (`###`) | 1.25× | 20px |

---

## Styling Details

| Element | Style |
|---------|-------|
| Paragraphs | No margin (inline flow) |
| Bold | fontWeight: 700 |
| Headings | 0.5em vertical margin |
| Lists | 1.5em left padding |
| List items | 0.25em bottom margin |

---

## Design Tokens

| Token | Value | Used In |
|-------|-------|---------|
| Default Color | `#333` | Text color |
| Default Size | `16px` | Base font size |
| Default Weight | `400` | Normal weight |
| Bold Weight | `700` | Bold text |
| Line Height | `1.5` | Default line spacing |

---

## Use Cases

1. **Headings** - Page or section titles
2. **Body text** - Paragraphs with formatting
3. **Captions** - Image or content descriptions
4. **Instructions** - Step-by-step guides with lists
5. **Quotes** - Styled testimonials or callouts
6. **Dynamic content** - Text from API/JSON with markdown

---

## Dependencies

This component requires `react-markdown` package:

```bash
pnpm add react-markdown
# or
npm install react-markdown
```

