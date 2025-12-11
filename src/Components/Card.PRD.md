# Card Component PRD

A flexible card component system with three variants for displaying quotes, messages, and flexible content.

---

## Overview

The `Card` component uses a **variant-based pattern** where you specify the card type via the `variant` prop. Cards are **non-interactive display elements** — they're used with buttons for navigation.

```tsx
import Card from "./Components/Card";
```

---

## Variants

### 1. Quotation Card (`variant="quotation"`)

A stylized quote card with a large `"` symbol, quote text, and author attribution.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `quote` | `string` | required | The quote text |
| `author` | `string` | - | Author name (displays as "— Author") |
| `authorAlign` | `"left" \| "center" \| "right"` | `"left"` | Author text alignment |
| `width` | `string \| number` | `"80%"` | Card width |
| `bgColor` | `string` | `"#fff"` | Background color |
| `quoteColor` | `string` | `"#333"` | Quote text color |
| `authorColor` | `string` | `"#666"` | Author text color |
| `quoteSymbolColor` | `string` | `"#e5e5e5"` | Big `"` symbol color |
| `fontSize` | `number` | `18` | Quote text font size |
| `authorFontSize` | `number` | `14` | Author text font size |

**Styling:**
- Background: White (`#fff`)
- Quote symbol: 64px Georgia serif, positioned top-left
- Quote text: 18px, weight 500, line-height 1.5
- Author: Italic, em-dash prefix
- Border radius: 16px
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Padding: 24px

**Examples:**

```tsx
// Basic quote with author
<Card
  variant="quotation"
  quote="Stay hungry, stay foolish."
  author="Steve Jobs"
/>

// Author aligned right
<Card
  variant="quotation"
  quote="The only way to do great work is to love what you do."
  author="Steve Jobs"
  authorAlign="right"
/>

// Centered author with custom colors
<Card
  variant="quotation"
  quote="Innovation distinguishes between a leader and a follower."
  author="Steve Jobs"
  authorAlign="center"
  bgColor="#f0f9ff"
  quoteSymbolColor="#0ea5e9"
/>

// Quote without author
<Card
  variant="quotation"
  quote="Be the change you wish to see in the world."
/>
```

---

### 2. Message Card (`variant="message"`)

A card for displaying markdown-formatted messages. Perfect for instructions, tips, or announcements.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | required | Markdown-formatted text |
| `width` | `string \| number` | `"80%"` | Card width |
| `bgColor` | `string` | `"#fff"` | Background color |
| `textColor` | `string` | `"#333"` | Text color |
| `fontSize` | `number` | `16` | Base font size |
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment |

**Markdown Support:**

| Syntax | Output |
|--------|--------|
| `**text**` | Bold |
| `*text*` | Italic |
| `# Heading` | H1 (1.75× font size) |
| `## Heading` | H2 (1.5× font size) |
| `### Heading` | H3 (1.25× font size) |
| `- item` | Bullet list |
| `1. item` | Numbered list |
| `` `code` `` | Inline code |
| `[link](url)` | Hyperlink |

**Styling:**
- Background: White (`#fff`)
- Border radius: 16px
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Padding: 24px
- Line height: 1.6

**Examples:**

```tsx
// Basic message
<Card
  variant="message"
  message="Welcome to the app! Let's get started."
/>

// With markdown formatting
<Card
  variant="message"
  message="## Welcome! 👋

This is a **message card** with full markdown support.

- ✅ Bold and *italic* text
- ✅ Lists and headings
- ✅ Links and `code`"
/>

// Centered with custom background
<Card
  variant="message"
  message="### Quick Tip 💡

You can customize the **background color**, text color, and alignment!"
  bgColor="#fef3c7"
  align="center"
/>

// Dark theme message
<Card
  variant="message"
  message="**Pro tip:** Use markdown for rich formatting!"
  bgColor="#1f2937"
  textColor="#f9fafb"
/>
```

---

### 3. Info Card (`variant="info"`)

A flexible card that can contain any combination of images and text in any order. Similar to a mini-Screens component but for cards.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `InfoContentItem[]` | required | Array of image/text items |
| `width` | `string \| number` | `"80%"` | Card width |
| `bgColor` | `string` | `"#fff"` | Background color |
| `gap` | `number` | `12` | Gap between content items |
| `padding` | `number` | `20` | Card padding |

**Content Item Types:**

```tsx
// Image item
{
  type: "image";
  src: string;              // Required
  alt?: string;
  width?: string | number;  // Default: "100%"
  shape?: "none" | "circle" | "rounded" | "blob";
  align?: "left" | "center" | "right";
}

// Text item
{
  type: "text";
  content: string;          // Markdown supported
  align?: "left" | "center" | "right";
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}
```

**Styling:**
- Background: White (`#fff`)
- Border radius: 16px
- Shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Flexbox column layout

**Examples:**

```tsx
// Profile card (image + name + role)
<Card
  variant="info"
  content={[
    { type: "image", src: avatarImg, width: "50%", shape: "circle", align: "center" },
    { type: "text", content: "**John Doe**", align: "center", fontSize: 18, fontWeight: 600 },
    { type: "text", content: "Software Engineer", align: "center", color: "#666" },
  ]}
/>

// Achievement card (text + image + text)
<Card
  variant="info"
  bgColor="#f0fdf4"
  content={[
    { type: "text", content: "🎉 **Achievement Unlocked!**", align: "center", fontSize: 16 },
    { type: "image", src: badgeImg, width: "40%", shape: "rounded", align: "center" },
    { type: "text", content: "You completed your first quiz!", align: "center", color: "#166534" },
  ]}
/>

// Product card (image + details)
<Card
  variant="info"
  content={[
    { type: "image", src: productImg, width: "80%", shape: "rounded" },
    { type: "text", content: "**Premium Plan**", align: "center", fontSize: 20 },
    { type: "text", content: "$9.99/month", align: "center", color: "#2563eb", fontSize: 18 },
    { type: "text", content: "All features included", align: "center", color: "#666" },
  ]}
/>

// Text-only info card
<Card
  variant="info"
  content={[
    { type: "text", content: "**Step 1**", align: "left", fontSize: 14, color: "#2563eb" },
    { type: "text", content: "Create your profile", align: "left", fontSize: 18 },
    { type: "text", content: "Fill in your details to get started with personalized recommendations.", align: "left", color: "#666" },
  ]}
/>
```

---

## Usage in Screens

Cards are **non-clickable display elements**. Use them with the button in Screens for navigation:

```tsx
<Screens
  content={[
    { type: "heading", content: "Words of Wisdom" },
    {
      type: "card",
      variant: "quotation",
      quote: "Stay hungry, stay foolish.",
      author: "Steve Jobs",
    },
    { type: "button", text: "Continue", onClick: () => {} },
  ]}
/>
```

### Card Item Types in Screens

```tsx
// Quotation Card Item
{
  type: "card";
  variant: "quotation";
  quote: string;
  author?: string;
  authorAlign?: "left" | "center" | "right";
  width?: string | number;
  bgColor?: string;
  quoteColor?: string;
  authorColor?: string;
  quoteSymbolColor?: string;
  fontSize?: number;
  authorFontSize?: number;
}

// Message Card Item
{
  type: "card";
  variant: "message";
  message: string;
  width?: string | number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: "left" | "center" | "right";
}

// Info Card Item
{
  type: "card";
  variant: "info";
  content: InfoContentItem[];
  width?: string | number;
  bgColor?: string;
  gap?: number;
  padding?: number;
}
```

---

## Design Tokens

| Token | Value | Used In |
|-------|-------|---------|
| Background | `#fff` | Default card background |
| Border Radius | `16px` | All card variants |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` | Card elevation |
| Quote Symbol | `64px` | Quotation card |
| Quote Symbol Color | `#e5e5e5` | Light gray default |
| Text Color | `#333` | Default text |
| Author Color | `#666` | Quote attribution |
| Padding | `24px` / `20px` | Card internal spacing |

---

## Aspect Ratios

| Variant | Height | Notes |
|---------|--------|-------|
| Quotation | Auto | Based on text length |
| Message | Auto | Based on content |
| Info | Auto | Based on content items |

---

## Use Cases

### Quotation Card
1. **Inspirational quotes** - Motivational content
2. **Testimonials** - Customer quotes
3. **Daily wisdom** - Quote of the day
4. **Author highlights** - Famous sayings

### Message Card
1. **Instructions** - Step-by-step guidance
2. **Tips** - Quick tips and tricks
3. **Announcements** - Important notices
4. **Onboarding** - Welcome messages

### Info Card
1. **Profile cards** - User/team member info
2. **Achievement badges** - Milestones and rewards
3. **Product cards** - Feature highlights
4. **Step indicators** - Progress steps

---

## Dependencies

- `react-markdown` - For markdown rendering in Message and Info cards
- `Image` component - Used in Info card
- `Text` component - Used in Info card

---

## Files

| File | Purpose |
|------|---------|
| `src/Components/Card.tsx` | Main component |
| `src/Components/Card.PRD.md` | This documentation |
