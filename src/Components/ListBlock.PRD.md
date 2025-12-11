# ListBlock Component PRD

A vertical list card component for displaying items with icons and text labels.

---

## Overview

The `ListBlock` component displays a card with a heading and a vertical list of icon + text items. Perfect for showing benefits, features, outcomes, or any categorized list.

```tsx
import ListBlock from "./Components/listBock";
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `ListBlockContent` | Yes | - | The content data object |
| `width` | `number` | No | `180` | Block width in pixels |
| `bgColor` | `string` | No | `"#fff"` | Background color |
| `titleColor` | `string` | No | `"#999"` | Heading text color |
| `textColor` | `string` | No | `"#333"` | Item text color |
| `iconSize` | `number` | No | `32` | Icon font size in pixels |

---

## Content Structure

The `content` prop accepts a JSON object with the following structure:

```tsx
interface ListBlockContent {
  heading: string;        // Required - Title at the top
  data: ListItem[];       // Required - Array of items
}

interface ListItem {
  icon: string;           // Emoji or icon character
  text: string;           // Label text
}
```

**Example JSON:**

```json
{
  "heading": "After",
  "data": [
    { "icon": "😀", "text": "Achieved goals" },
    { "icon": "😀", "text": "Career growth" },
    { "icon": "😀", "text": "Confident communication" }
  ]
}
```

---

## Sizing

| Property | Value |
|----------|-------|
| Width | Customizable (default: 180px) |
| Height | 2× width (auto-calculated) |
| Border Radius | 16px |
| Padding | 20px |

---

## Examples

### Basic Usage

```tsx
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
```

### Custom Background Color

```tsx
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
```

### Custom Size and Colors

```tsx
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
```

### Larger Icons

```tsx
<ListBlock
  content={{
    heading: "Goals",
    data: [
      { icon: "🎯", text: "Hit targets" },
      { icon: "📈", text: "Grow revenue" },
    ],
  }}
  iconSize={48}
/>
```

---

## Styling Details

| Element | Style |
|---------|-------|
| Container | White background, 16px border-radius, subtle shadow |
| Heading | 18px font, 400 weight, gray color (#999) |
| Item Text | 14px font, 500 weight, dark color (#333) |
| Icons | 32px default, centered above text |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` |

---

## Design Tokens

| Token | Value | Used In |
|-------|-------|---------|
| Background | `#fff` | Card background |
| Title Color | `#999` | Heading text |
| Text Color | `#333` | Item labels |
| Border Radius | `16px` | Card corners |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` | Card elevation |

---

## Use Cases

1. **Before/After comparisons** - Show outcomes or transformations
2. **Feature lists** - Display product features with icons
3. **Benefits sections** - Highlight key benefits
4. **Goal tracking** - Show achievements or milestones
5. **Category displays** - Group related items visually
