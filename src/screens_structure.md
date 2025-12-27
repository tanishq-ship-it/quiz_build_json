# 🏆 GOD PRD: JSON Screen Builder System

> **Master Reference Document** for creating 50-60+ quiz, survey, and onboarding screens using the JSON-driven screen system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Quick Start](#quick-start)
3. [Screen JSON Schema](#screen-json-schema)
4. [Content Types Reference](#content-types-reference)
5. [Selection System](#selection-system)
6. [Card System](#card-system)
7. [Conditional System](#conditional-system)
8. [Layout Patterns](#layout-patterns)
9. [Design Tokens](#design-tokens)
10. [50+ Screen Examples](#screen-examples)

---

## System Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  SCREENS_JSON (Array of Screen Objects)                     │
│  ├── Screen 1: { id, content: [...] }                       │
│  ├── Screen 2: { id, content: [...] }                       │
│  └── Screen N: { id, content: [...] }                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Screens Component (Renders content array)                   │
│  ├── Image, Text, Heading                                   │
│  ├── Selection (radio/checkbox grids)                       │
│  ├── Card (quotation/message/info)                          │
│  └── Button (CTA at bottom)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Content Flow

```
User sees Screen → Interacts with Selection/Button → Next Screen
                          ↓
              Optional: Response Card/Screen shown
```

---

## Quick Start

### Minimal Screen

```json
{
  "id": "welcome",
  "content": [
    { "type": "heading", "content": "Welcome!" },
    { "type": "button", "text": "Get Started" }
  ]
}
```

### Complete Screen Structure

```json
{
  "id": "unique-screen-id",
  "content": [
    { "type": "image", ... },
    { "type": "heading", ... },
    { "type": "text", ... },
    { "type": "selection", ... },
    { "type": "card", ... },
    { "type": "button", ... }
  ]
}
```

---

## Screen JSON Schema

### Screen Object

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | `string` | Yes | - | Unique screen identifier |
| `category` | `string` | No | - | Optional category/tag for organizing screens (not used in UI rendering) |
| `content` | `ContentItem[]` | Yes | - | Array of content items |
| `gap` | `number` | No | `16` | Gap between items (px) |
| `padding` | `number` | No | `24` | Screen padding (px) |

### Screen Categories (`category`)

The optional `category` field lets you **label and group screens by their purpose**, without changing how they look or behave in the UI.

- **Why it exists**
  - Helps product/ops **organize large quizzes** (50–60+ screens).
  - Allows you to later:
    - Filter screens by type (e.g. profile vs core questions).
    - Run analytics by category (e.g. “how many profile questions?”).
    - Build flows that can **skip or reorder categories** (e.g. skip all `profile` questions for returning users).

- **Important:**  
  - `category` is **not read by the `Screens` renderer**.
  - It **does not affect layout, navigation, or scoring** by itself.
  - It is pure metadata that the backend and tools can use for management and analysis.

#### Recommended category values

You can use any string, but for consistency it’s recommended to use a small controlled set, for example:

- `"profile"` – basic user information (age, gender, lifestyle, onboarding questions).
- `"core-quiz"` – main quiz questions that drive logic, scoring, or branching.
- `"diagnostic"` – deeper assessment questions used for advanced insights.
- `"results"` – result/summary/result‑explanation screens.
- `"completion"` – final thank‑you, end‑of‑flow, or “start using the product” screens.
- `"system"` – internal/utility screens (error states, maintenance messages, etc).

You can always extend this list (e.g. `"onboarding"`, `"follow-up"`, `"upsell"`) as your product grows.

#### Example: Profile vs Core Quiz screens

```json
{
  "id": "profile-age",
  "category": "profile",
  "content": [
    { "type": "heading", "content": "What's your age?" },
    { "type": "text", "content": "Select one to continue", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "4x1",
      "options": [
        { "variant": "flat", "text": "18-24", "value": "18-24" },
        { "variant": "flat", "text": "25-34", "value": "25-34" },
        { "variant": "flat", "text": "35-44", "value": "35-44" },
        { "variant": "flat", "text": "45+", "value": "45+" }
      ]
    }
  ]
}
```

```json
{
  "id": "core-q1-reading",
  "category": "core-quiz",
  "content": [
    { "type": "heading", "content": "How often do you read books?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "5x1",
      "options": [
        { "variant": "flat", "text": "Never", "value": "never" },
        { "variant": "flat", "text": "Rarely", "value": "rarely" },
        { "variant": "flat", "text": "Sometimes", "value": "sometimes" },
        { "variant": "flat", "text": "Often", "value": "often" },
        { "variant": "flat", "text": "Daily", "value": "daily" }
      ]
    }
  ]
}
```

---

## Content Types Reference

### 📷 Image

```json
{
  "type": "image",
  "src": "{{image}}",
  "alt": "Description",
  "width": "50%",
  "shape": "circle",
  "border": true,
  "borderColor": "#2563eb",
  "borderWidth": 3,
  "align": "center"
}
```

| Property | Type | Default | Options |
|----------|------|---------|---------|
| `src` | `string` | required | URL or `{{image}}` placeholder |
| `alt` | `string` | `""` | Accessibility text |
| `width` | `string \| number` | `"80%"` | CSS width |
| `shape` | `string` | `"none"` | `none`, `circle`, `rounded`, `blob` |
| `border` | `boolean` | `false` | Show border |
| `borderColor` | `string` | `"#e5e5e5"` | Border color |
| `borderWidth` | `number` | `2` | Border pixels |
| `align` | `string` | `"center"` | `left`, `center`, `right` |

**Shape Examples:**
- `none` → No border radius
- `circle` → Perfect circle (1:1 ratio)
- `rounded` → 16px border radius
- `blob` → Organic curved shape

---

### 📝 Heading

```json
{
  "type": "heading",
  "content": "What's your age?",
  "fontSize": 24,
  "color": "#333",
  "fontWeight": 700,
  "align": "center"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string` | required | Heading text |
| `fontSize` | `number` | `28` | Font size in px |
| `color` | `string` | `"#333"` | Text color |
| `fontWeight` | `number` | `700` | Font weight |
| `align` | `string` | `"center"` | `left`, `center`, `right` |

---

### �️ Slider

Renders a scrollable carousel of content items.

```json
{
  "type": "slider",
  "content": [
    { "type": "image", "src": "image1.jpg" },
    { "type": "text", "content": "Slide 2" }
  ],
  "height": 200,
  "autoplay": true,
  "infinite": true,
  "speed": 3000
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `"carousel"` | - | Component identifier |
| `direction` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `items` | `ContentItem[]` | `[]` | Array of content items to render |
| `itemWidth` | `string` | `"85%"` | `"auto"` if infinite=true, to avoid gaps |
| `height` | `number` | `200` | Fixed height (Vertical) |
| `autoplay` | `boolean` | `false` | Enable auto-scroll |
| `infinite` | `boolean` | `false` | Enable seamless infinite loop (Marquee) |
| `speed` | `number` | `3000` | Animation duration or speed |
| `align` | `string` | `"center"` | `left`, `center`, `right` |

**Example 1: Review Slider (Horizontal)**

---

### �📄 Text

```json
{
  "type": "text",
  "content": "This is **bold** and *italic* text.",
  "align": "center",
  "fontSize": 16,
  "color": "#666",
  "fontWeight": 400,
  "lineHeight": 1.5
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string` | required | Markdown-enabled text |
| `align` | `string` | `"left"` | `left`, `center`, `right` |
| `fontSize` | `number` | `16` | Font size in px |
| `color` | `string` | `"#333"` | Text color |
| `fontWeight` | `number` | `400` | Font weight |
| `lineHeight` | `number` | `1.5` | Line height multiplier |

**Markdown Support:**
- `**bold**` → **bold**
- `*italic*` → *italic*
- `# H1`, `## H2`, `### H3` → Headings
- `- item` → Bullet list
- `1. item` → Numbered list
- `` `code` `` → Inline code

---

### 4.7 Input Item
 
Renders a text input field.
 
| Property | Type | Description |
|----------|------|-------------|
| `type` | `"input"` | Component identifier |
| `inputType` | `"text" \| "email" \| "tel" \| "number"` | HTML input type |
| `label` | `string` | Label above input |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | If true, validates on continue |
| `responseKey` | `string` | Key for analytics response |
| `width` | `string \| number` | Width of input |
 
```json
{
  "type": "input",
  "inputType": "email",
  "label": "Email Address",
  "placeholder": "you@example.com",
  "required": true,
  "responseKey": "user_email"
}
```
 
### 4.8 Button Item

```json
{
  "type": "button",
  "text": "Continue",
  "bgColor": "#2563eb",
  "textColor": "#fff",
  "width": 300
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | required | Button label |
| `bgColor` | `string` | `"#2563eb"` | Background color |
| `textColor` | `string` | `"#fff"` | Text color |
| `width` | `number` | `300` | Button width in px |

**Button Behavior:**
- Always renders at **bottom** of screen
- If **no button** in content + **radio mode** selection → **auto-complete** on select

---

### 4.9 Completion Screen

**Special screen type for quiz/survey completion flows.**

The CompletionScreen is a specialized layout that renders when `screenId === "completion"`. It features a unique container box design with logo, heading, content image, social proof, and infinite scrolling email ticker.

#### When to Use

- Quiz completion screens
- Survey thank you pages
- Onboarding finish screens
- Community welcome screens
- Success/achievement screens

#### Screen Structure

```json
{
  "id": "completion",
  "content": [
    {
      "type": "completion",
      "logo": "{{logo}}",
      "heading": "Be part of more than 20 million people",
      "subtext": "Achieve more together with our growing global learning community.",
      "image": "{{image}}",
      "socialProof": "1103 people learned self-growth insights in the hour",
      "emailTicker": [
        "*@icloud.com",
        "mysticwo***@gmail.com",
        "solarchi***@yahoo.com"
      ],
      "button": {
        "text": "Continue",
        "bgColor": "#2563eb",
        "textColor": "#fff"
      }
    }
  ]
}
```

#### Props Reference

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `type` | `"completion"` | Yes | - | Must be "completion" |
| `logo` | `string` | No | - | Logo image URL (supports placeholders) |
| `heading` | `string` | Yes | - | Main heading text |
| `subtext` | `string` | No | - | Subtitle/description text |
| `image` | `string` | No | - | Single full-width image (edge-to-edge) |
| `comparisonCards` | `ComparisonCard[]` | No | `[]` | Alternative to image: 2-column comparison cards |
| `socialProof` | `string` | No | - | Social proof text (e.g., "1103 people...") |
| `emailTicker` | `string[]` | No | `[]` | Array of emails for infinite scroll |
| `button` | `CompletionButton` | No | - | Continue button config |
| `gap` | `number` | No | `16` | Gap between elements (px) |
| `padding` | `number` | No | `24` | Screen padding (px) |

#### ComparisonCard (Alternative to single image)

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | - | Card image (fills entire card) |
| `title` | `string` | Yes | - | Card title (overlaid on image) |
| `subtitle` | `string` | Yes | - | Card subtitle (overlaid on image) |
| `bgColor` | `string` | No | `#f5f5f5` | Card background color |

#### CompletionButton

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `text` | `string` | Yes | - | Button text |
| `bgColor` | `string` | No | `#2563eb` | Button background color |
| `textColor` | `string` | No | `#fff` | Button text color |

#### Layout

```
┌─────────────────────────────────┐
│          Logo (top)             │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Container Box (white)   │  │
│  │   ├─ Heading              │  │
│  │   ├─ Subtext              │  │
│  │   ├─ Image (full-width)   │  │
│  │   ├─ Social Proof         │  │
│  │   └─ Email Ticker         │  │
│  └───────────────────────────┘  │
│                                 │
│      [Continue Button]          │
└─────────────────────────────────┘
```

#### Features

**Container Box:**
- White background with subtle shadow
- Rounded corners (16px)
- All content contained inside
- Max width: 500px

**Single Image:**
- Full width, edge-to-edge (no padding)
- Breaks out of container padding
- Supports any image URL or placeholder

**Comparison Cards (Alternative):**
- 2-column grid layout
- Images fill entire card
- Text overlaid at bottom with gradient
- White text for visibility

**Email Ticker:**
- Infinite horizontal scroll
- Auto-plays continuously
- Seamless loop animation
- Speed: 20 seconds per loop

**Auto-Detection:**
- Automatically renders when `id === "completion"`
- No special routing needed

#### Examples

**Minimal Example:**

```json
{
  "id": "completion",
  "content": [
    {
      "type": "completion",
      "heading": "Welcome to the community!",
      "button": {
        "text": "Get Started"
      }
    }
  ]
}
```

**With Single Image:**

```json
{
  "id": "completion",
  "content": [
    {
      "type": "completion",
      "logo": "{{logo}}",
      "heading": "Join 20 million learners",
      "subtext": "Start your journey today.",
      "image": "https://example.com/hero.jpg",
      "socialProof": "1103 people joined today",
      "emailTicker": ["user1@email.com", "user2@email.com"],
      "button": {
        "text": "Continue"
      }
    }
  ]
}
```

**With Comparison Cards:**

```json
{
  "id": "completion",
  "content": [
    {
      "type": "completion",
      "heading": "Choose your path",
      "comparisonCards": [
        {
          "image": "{{image1}}",
          "title": "Full books",
          "subtitle": "too many hours",
          "bgColor": "#f5f5f5"
        },
        {
          "image": "{{image2}}",
          "title": "Key insights",
          "subtitle": "15 minutes",
          "bgColor": "#e3f2fd"
        }
      ],
      "button": {
        "text": "Continue"
      }
    }
  ]
}
```

#### Design Tokens

**Colors:**
- Container: `#ffffff` (white)
- Shadow: `rgba(0, 0, 0, 0.08)`
- Heading: `#333`
- Subtext: `#666`
- Social proof: `#555`
- Email ticker: `#888`
- Card text: `#fff` (white, overlaid)

**Typography:**
- Heading: 24px, bold (700)
- Subtext: 15px, regular (400)
- Card title: 16px, semibold (600)
- Card subtitle: 13px, regular (400)
- Social proof: 14px, regular (400)

**Spacing:**
- Container border radius: 16px
- Container padding: 24px
- Card border radius: 12px
- Default gap: 16px

---

## Selection System

### Selection Structure

```json
{
  "type": "selection",
  "mode": "radio",
  "layout": "3x3",
  "gap": 12,
  "options": [...],
  "responseCards": {...},
  "conditionalScreens": {...},
  "responsePosition": "bottom"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `string` | required | `radio` (single) or `checkbox` (multi) |
| `layout` | `string` | required | Grid format: `"ROWSxCOLS"` |
| `options` | `array` | required | Array of option objects |
| `gap` | `number` | `8` | Gap between options (px) |
| `selectedColor` | `string` | `"#2563eb"` | Selection border color |
| `selectedBorderWidth` | `number` | `2` | Selection border width |
| `position` | `string` | varies | `"top"`, `"middle"`, or `"bottom"` - where selection appears on screen |
| `responseKey` | `string` | - | Optional key for tracking answer in analytics |
| `responseCards` | `object` | - | Map value → card config |
| `conditionalScreens` | `object` | - | Map value → screen content |
| `responsePosition` | `string` | `"top"` | `top` or `bottom` (for response card placement) |

**Position Property:**
- `"top"` - Selection stays with heading/text at top (default when button exists)
- `"middle"` - Selection centered between content and button
- `"bottom"` - Selection at bottom of screen (default when no button)

### Layout Formats

| Layout | Grid | Use Case |
|--------|------|----------|
| `"4x1"` | 4 rows × 1 col | Vertical list (age, options) |
| `"3x1"` | 3 rows × 1 col | Short vertical list |
| `"2x2"` | 2 rows × 2 cols | Category cards |
| `"3x3"` | 3 rows × 3 cols | Letter/number grid, avatars |
| `"4x2"` | 4 rows × 2 cols | Emoji/tag pills |
| `"1x2"` | 1 row × 2 cols | Yes/No |
| `"1x3"` | 1 row × 3 cols | Small/Medium/Large |
| `"1x5"` | 1 row × 5 cols | Rating (1-5) |
| `"2x3"` | 2 rows × 3 cols | Feature grid |

---

### Option Variants

#### 1. Square Option

Perfect for letter/number grids (A-I, 1-9).

```json
{
  "variant": "square",
  "character": "A",
  "size": 65,
  "value": "A"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `character` | `string` | required | Single character |
| `size` | `number` | `60` | Width/height in px |
| `value` | `string \| number` | index | Selection value |

---

#### 2. ImageCard Option

Perfect for category selection, role models, galleries.

```json
{
  "variant": "imageCard",
  "imageSrc": "{{image}}",
  "text": "Design",
  "width": 140,
  "textBgColor": "#2563eb",
  "textColor": "#fff",
  "imageShape": "circle",
  "imageFill": true,
  "value": "design"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `imageSrc` | `string` | required | Image URL |
| `text` | `string` | `""` | Label (empty = image-only) |
| `width` | `number` | `140` | Card width |
| `textBgColor` | `string` | - | Footer background color |
| `textColor` | `string` | `"#333"` | Footer text color |
| `imageShape` | `string` | `"none"` | `none` or `circle` |
| `imageFill` | `boolean` | `false` | Fill entire image area |
| `value` | `string \| number` | index | Selection value |

**Special Modes:**
- **Image-only:** Set `text: ""` → Card becomes square with image
- **Image-fill:** Set `imageFill: true` → Image covers entire top area
- **Circle avatar:** Set `imageShape: "circle"` → Circular image inside

---

#### 3. Flat Option

Perfect for text buttons, age ranges, categories.

```json
{
  "variant": "flat",
  "text": "🚀 Leadership",
  "size": "sm",
  "width": 140,
  "height": 48,
  "bgColor": "#fff",
  "textColor": "#333",
  "textAlign": "left",
  "fontSize": 14,
  "value": "leadership"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | required | Button text |
| `size` | `string` | - | Preset: `xs`, `sm`, `md`, `lg`, `xl` |
| `width` | `number` | from size | Custom width |
| `height` | `number` | from size | Custom height |
| `bgColor` | `string` | `"#2563eb"` | Background color |
| `textColor` | `string` | `"#fff"` | Text color |
| `textAlign` | `string` | `"center"` | `left`, `center`, `right` |
| `fontSize` | `number` | from size | Custom font size |
| `value` | `string \| number` | index | Selection value |

**Size Presets:**

| Size | Width | Height | Font Size |
|------|-------|--------|-----------|
| `xs` | 120 | 36 | 12 |
| `sm` | 150 | 44 | 14 |
| `md` | 200 | 52 | 16 |
| `lg` | 280 | 60 | 18 |
| `xl` | 340 | 72 | 22 |

---

## Card System

### Card Structure

```json
{
  "type": "card",
  "variant": "quotation | message | info",
  ...variantProps
}
```

---

### 💬 Quotation Card

```json
{
  "type": "card",
  "variant": "quotation",
  "quote": "Stay hungry, stay foolish.",
  "author": "Steve Jobs",
  "authorAlign": "right",
  "bgColor": "#fef3c7",
  "quoteColor": "#333",
  "authorColor": "#666",
  "quoteSymbolColor": "#2563eb",
  "fontSize": 18,
  "authorFontSize": 14,
  "width": "85%"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `quote` | `string` | required | Quote text |
| `author` | `string` | - | Author name |
| `authorAlign` | `string` | `"left"` | `left`, `center`, `right` |
| `bgColor` | `string` | `"#fff"` | Background |
| `quoteColor` | `string` | `"#333"` | Quote text color |
| `authorColor` | `string` | `"#666"` | Author text color |
| `quoteSymbolColor` | `string` | `"#e5e5e5"` | Big `"` symbol color |
| `fontSize` | `number` | `18` | Quote font size |
| `authorFontSize` | `number` | `14` | Author font size |
| `width` | `string \| number` | `"80%"` | Card width |

---

### 📋 Message Card

```json
{
  "type": "card",
  "variant": "message",
  "message": "## Welcome! 🎉\n\nThis is **markdown** text with:\n\n- ✅ Lists\n- ✅ **Bold**\n- ✅ *Italic*",
  "bgColor": "#f0fdf4",
  "textColor": "#333",
  "fontSize": 16,
  "align": "left",
  "width": "85%"
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | `string` | required | Markdown text |
| `bgColor` | `string` | `"#fff"` | Background |
| `textColor` | `string` | `"#333"` | Text color |
| `fontSize` | `number` | `16` | Font size |
| `align` | `string` | `"left"` | `left`, `center`, `right` |
| `width` | `string \| number` | `"80%"` | Card width |

---

### ℹ️ Info Card

```json
{
  "type": "card",
  "variant": "info",
  "bgColor": "#eff6ff",
  "gap": 12,
  "padding": 20,
  "width": "85%",
  "content": [
    { "type": "image", "src": "{{image}}", "width": "50%", "shape": "circle", "align": "center" },
    { "type": "text", "content": "**John Doe**", "align": "center", "fontSize": 18 },
    { "type": "text", "content": "Software Engineer", "align": "center", "color": "#666" }
  ]
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `array` | required | Array of image/text items |
| `bgColor` | `string` | `"#fff"` | Background |
| `gap` | `number` | `12` | Gap between items |
| `padding` | `number` | `20` | Card padding |
| `width` | `string \| number` | `"80%"` | Card width |

**Content Items:**
- `{ type: "image", src, width, shape, align }`
- `{ type: "text", content, align, fontSize, color, fontWeight }`

---

### 🔄 Carousel

Renders a horizontal carousel of content items.

```json
{
  "type": "carousel",
  "content": [
    { "type": "image", "src": "image1.jpg" },
    { "type": "text", "content": "Slide 2" }
  ],
  "bgColor": "#fff",
  "gap": 16,
  "autoplay": true,
  "infinite": true,
  "speed": 3000,
  "showIndicators": true
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `array` | required | Array of image/text items |
| `bgColor` | `string` | `"#fff"` | Background |
| `gap` | `number` | `16` | Gap between slides |
| `autoplay` | `boolean` | `false` | Enables animation |
| `infinite` | `boolean` | `false` | Enable infinite marquee loop |
| `speed` | `number` | `3000` | Duration of 1 loop (Vertical) |
| `showIndicators` | `boolean` | `true` | Show dots (Horizontal only) |

---

## Conditional System

### Response Cards (Inline)

Shows a card on the **same screen** when an option is selected.

```json
{
  "type": "selection",
  "mode": "radio",
  "layout": "1x5",
  "options": [
    { "variant": "square", "character": "1", "size": 55, "value": 1 },
    { "variant": "square", "character": "2", "size": 55, "value": 2 },
    { "variant": "square", "character": "3", "size": 55, "value": 3 },
    { "variant": "square", "character": "4", "size": 55, "value": 4 },
    { "variant": "square", "character": "5", "size": 55, "value": 5 }
  ],
  "responseCards": {
    "1": { "variant": "message", "message": "😢 We'll improve!", "bgColor": "#fef2f2" },
    "2": { "variant": "message", "message": "🙁 Thanks for honesty.", "bgColor": "#fef3c7" },
    "3": { "variant": "quotation", "quote": "Room to grow!", "author": "Team", "bgColor": "#f0fdf4" },
    "4": { "variant": "message", "message": "😊 Glad you enjoyed!", "bgColor": "#ecfdf5" },
    "5": { "variant": "info", "bgColor": "#eff6ff", "content": [
      { "type": "text", "content": "🎉 **Perfect!**", "align": "center", "fontSize": 18 }
    ]}
  },
  "responsePosition": "top"
}
```

---

### Conditional Screens (Full Replacement)

**Replaces entire screen** when an option is selected.

```json
{
  "type": "selection",
  "mode": "radio",
  "layout": "1x2",
  "options": [
    { "variant": "flat", "text": "Yes ✓", "bgColor": "#dcfce7", "textColor": "#166534", "value": "yes" },
    { "variant": "flat", "text": "No ✗", "bgColor": "#fef2f2", "textColor": "#991b1b", "value": "no" }
  ],
  "conditionalScreens": {
    "yes": {
      "content": [
        { "type": "heading", "content": "Awesome! 🎉" },
        { "type": "card", "variant": "info", "bgColor": "#ecfdf5", "content": [
          { "type": "text", "content": "✅ **Great choice!**", "align": "center" }
        ]},
        { "type": "image", "src": "{{image}}", "width": "40%", "shape": "circle" },
        { "type": "button", "text": "Continue", "bgColor": "#10b981" }
      ]
    },
    "no": {
      "content": [
        { "type": "heading", "content": "No worries! 👋" },
        { "type": "card", "variant": "quotation", "quote": "Every journey starts when you're ready.", "author": "Wisdom" },
        { "type": "button", "text": "Continue Anyway", "bgColor": "#f59e0b" }
      ]
    }
  }
}
```

---

### Comparison

| Feature | `responseCards` | `conditionalScreens` |
|---------|-----------------|-------------------|
| **What happens** | Card appears inline | Entire screen replaced |
| **Content** | Single card | Full screen |
| **Original visible** | Yes | No |
| **Use case** | Quick feedback | Branching flows |

---

## Layout Patterns

### With Button (Standard)

```
┌─────────────────────────────┐
│         [Content]           │  ← Top aligned
│         (heading,           │
│          text,              │
│          selection)         │
│                             │
│      ┌──────────────┐       │
│      │    Button    │       │  ← Fixed bottom
│      └──────────────┘       │
└─────────────────────────────┘
```

### Without Button (Auto-Complete) - Default: position="bottom"

```
┌─────────────────────────────┐
│         [Content]           │  ← Top aligned
│         (heading,           │
│          text)              │
│                             │
│      ┌──────────────┐       │
│      │  Selection   │       │  ← Moves to bottom (default)
│      └──────────────┘       │
└─────────────────────────────┘
```

### With position="middle"

```
┌─────────────────────────────┐
│         [Content]           │  ← Top aligned
│         (heading,           │
│          text)              │
│                             │
│      ┌──────────────┐       │
│      │  Selection   │       │  ← Centered in middle
│      └──────────────┘       │
│                             │
│      ┌──────────────┐       │
│      │    Button    │       │  ← Fixed bottom (if exists)
│      └──────────────┘       │
└─────────────────────────────┘
```

### With position="top" (No Button)

```
┌─────────────────────────────┐
│         [Content]           │  ← Top aligned
│         (heading,           │
│          text,              │
│          selection)         │  ← Selection stays at top
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

**Auto-Complete Behavior:**
- Radio mode + No button + **has responseCards** = Selection fires `onComplete` after **2 second delay** (so user can read the message)
- Radio mode + No button + **no responseCards** + **no conditionalScreens** = Selection fires `onComplete` **immediately**
- **Has conditionalScreens** = Auto-complete **DISABLED**. User must interact with conditional screen.
- Checkbox mode always needs button

---

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Primary Blue | `#2563eb` | Buttons, selection border |
| Success Green | `#10b981` | Positive actions |
| Warning Orange | `#f59e0b` | Warnings, attention |
| Error Red | `#ef4444` | Negative, errors |
| Dark Text | `#333` | Primary text |
| Muted Text | `#666` | Secondary text |
| Light Text | `#555` | Subtitles |
| Card BG | `#fff` | Card backgrounds |
| Light Green BG | `#ecfdf5` / `#f0fdf4` | Success cards |
| Light Blue BG | `#eff6ff` / `#dbeafe` | Info cards |
| Light Yellow BG | `#fef3c7` | Warning cards |
| Light Red BG | `#fef2f2` | Error cards |
| Light Purple BG | `#f3e8ff` / `#fdf4ff` | Special cards |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Screen Padding | `24px` | Screen edges |
| Content Gap | `16px` | Between items |
| Selection Gap | `12-16px` | Between options |
| Card Padding | `20-24px` | Inside cards |
| Card Gap | `12px` | Inside info cards |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| Font Family | `'Inter', sans-serif` | All text |
| Heading Size | `24-28px` | Screen headings |
| Body Size | `14-16px` | Descriptions |
| Button Size | `14-18px` | Button text |
| Weight Regular | `400` | Body text |
| Weight Medium | `500` | Buttons |
| Weight SemiBold | `600` | Emphasis |
| Weight Bold | `700` | Headings |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| Square Button | `6px` | Letter/number buttons |
| Flat Button | `12px` | CTA buttons |
| Card/ImageCard | `16px` | Cards, image cards |
| Circle | `50%` | Avatar images |

---

## Screen Examples

### Category 1: Welcome & Onboarding

#### 1.1 Welcome with Image

```json
{
  "id": "welcome",
  "content": [
    { "type": "image", "src": "{{image}}", "width": "45%", "shape": "rounded" },
    { "type": "heading", "content": "Welcome to the Quiz!", "fontSize": 26 },
    { "type": "text", "content": "Discover yourself through fun questions.", "align": "center", "color": "#555" },
    { "type": "button", "text": "Get Started", "bgColor": "#2563eb" }
  ]
}
```

#### 1.2 Welcome with Circle Avatar

```json
{
  "id": "welcome-avatar",
  "content": [
    { "type": "image", "src": "{{image}}", "width": "35%", "shape": "circle" },
    { "type": "heading", "content": "Hi, I'm your guide! 👋", "fontSize": 24 },
    { "type": "text", "content": "Let's personalize your experience.", "align": "center", "color": "#555" },
    { "type": "button", "text": "Let's Go!", "bgColor": "#10b981" }
  ]
}
```

#### 1.3 Welcome with Quote Card

```json
{
  "id": "welcome-quote",
  "content": [
    { "type": "heading", "content": "Words to Live By", "fontSize": 24 },
    { "type": "card", "variant": "quotation", "quote": "The journey of a thousand miles begins with a single step.", "author": "Lao Tzu", "quoteSymbolColor": "#2563eb" },
    { "type": "text", "content": "Ready to start your journey?", "align": "center", "color": "#555" },
    { "type": "button", "text": "Begin", "bgColor": "#2563eb" }
  ]
}
```

#### 1.4 App Benefits

```json
{
  "id": "benefits",
  "content": [
    { "type": "heading", "content": "Why You'll Love This", "fontSize": 24 },
    { "type": "card", "variant": "message", "message": "### What you'll get:\n\n- 🎯 Personalized insights\n- 📊 Track your progress\n- 🏆 Earn achievements\n- 💡 Daily tips", "bgColor": "#f0fdf4" },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

---

### Category 2: Single Choice (Radio)

#### 2.1 Age Selection (4x1 Vertical)

```json
{
  "id": "age",
  "content": [
    { "type": "heading", "content": "What's your age?", "fontSize": 24 },
    { "type": "text", "content": "Select one to continue", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "4x1",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "18-24", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "18-24" },
        { "variant": "flat", "text": "25-34", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "25-34" },
        { "variant": "flat", "text": "35-44", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "35-44" },
        { "variant": "flat", "text": "45+", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "45+" }
      ]
    }
  ]
}
```

#### 2.2 Gender Selection (3x1)

```json
{
  "id": "gender",
  "content": [
    { "type": "heading", "content": "How do you identify?", "fontSize": 24 },
    { "type": "text", "content": "This helps us personalize content", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "3x1",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "👨 Male", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "male" },
        { "variant": "flat", "text": "👩 Female", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "female" },
        { "variant": "flat", "text": "🧑 Other", "width": 280, "height": 52, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "other" }
      ]
    }
  ]
}
```

#### 2.3 Experience Level (3x1)

```json
{
  "id": "experience",
  "content": [
    { "type": "heading", "content": "Your experience level?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "3x1",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "🌱 Beginner", "width": 280, "height": 52, "bgColor": "#dcfce7", "textColor": "#166534", "textAlign": "left", "value": "beginner" },
        { "variant": "flat", "text": "🌿 Intermediate", "width": 280, "height": 52, "bgColor": "#fef3c7", "textColor": "#92400e", "textAlign": "left", "value": "intermediate" },
        { "variant": "flat", "text": "🌳 Advanced", "width": 280, "height": 52, "bgColor": "#dbeafe", "textColor": "#1e40af", "textAlign": "left", "value": "advanced" }
      ]
    }
  ]
}
```

#### 2.4 Yes/No Decision (1x2)

```json
{
  "id": "yes-no",
  "content": [
    { "type": "heading", "content": "Ready to continue?", "fontSize": 24 },
    { "type": "text", "content": "Your choice determines the next step", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "1x2",
      "gap": 20,
      "options": [
        { "variant": "flat", "text": "Yes ✓", "width": 130, "height": 50, "bgColor": "#dcfce7", "textColor": "#166534", "value": "yes" },
        { "variant": "flat", "text": "No ✗", "width": 130, "height": 50, "bgColor": "#fef2f2", "textColor": "#991b1b", "value": "no" }
      ],
      "conditionalScreens": {
        "yes": {
          "content": [
            { "type": "heading", "content": "Awesome! 🎉" },
            { "type": "card", "variant": "info", "bgColor": "#ecfdf5", "content": [
              { "type": "text", "content": "✅ **Great choice!**", "align": "center", "fontSize": 18 }
            ]},
            { "type": "button", "text": "Continue", "bgColor": "#10b981" }
          ]
        },
        "no": {
          "content": [
            { "type": "heading", "content": "No worries! 👋" },
            { "type": "card", "variant": "quotation", "quote": "Every journey starts when you're ready.", "author": "Wise Words" },
            { "type": "button", "text": "Continue Anyway", "bgColor": "#f59e0b" }
          ]
        }
      }
    }
  ]
}
```

#### 2.5 Size Selection (1x3)

```json
{
  "id": "size",
  "content": [
    { "type": "heading", "content": "Choose your size", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "1x3",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "S", "width": 80, "height": 50, "bgColor": "#fff", "textColor": "#333", "value": "small" },
        { "variant": "flat", "text": "M", "width": 80, "height": 50, "bgColor": "#fff", "textColor": "#333", "value": "medium" },
        { "variant": "flat", "text": "L", "width": 80, "height": 50, "bgColor": "#fff", "textColor": "#333", "value": "large" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

---

### Category 3: Multi-Choice (Checkbox)

#### 3.1 Interests Grid (2x2 Image Cards)

```json
{
  "id": "interests",
  "content": [
    { "type": "heading", "content": "What interests you?", "fontSize": 24 },
    { "type": "text", "content": "Select all that apply", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "checkbox",
      "layout": "2x2",
      "gap": 16,
      "options": [
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Design", "width": 140, "textBgColor": "#2563eb", "textColor": "#fff", "imageFill": true, "value": "design" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Code", "width": 140, "textBgColor": "#10b981", "textColor": "#fff", "imageFill": true, "value": "code" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Music", "width": 140, "textBgColor": "#f59e0b", "textColor": "#fff", "imageFill": true, "value": "music" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Art", "width": 140, "textBgColor": "#ef4444", "textColor": "#fff", "imageFill": true, "value": "art" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

#### 3.2 Growth Areas (4x2 Emoji Pills)

```json
{
  "id": "growth",
  "content": [
    { "type": "heading", "content": "Where do you want to grow?", "fontSize": 22 },
    { "type": "text", "content": "Select all areas", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "checkbox",
      "layout": "4x2",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "🚀 Leadership", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "leadership" },
        { "variant": "flat", "text": "🎨 Creativity", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "creativity" },
        { "variant": "flat", "text": "💼 Career", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "career" },
        { "variant": "flat", "text": "💰 Finance", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "finance" },
        { "variant": "flat", "text": "😎 Confidence", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "confidence" },
        { "variant": "flat", "text": "💕 Relationships", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "relationships" },
        { "variant": "flat", "text": "🛁 Self-care", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "self-care" },
        { "variant": "flat", "text": "🤗 Emotions", "width": 140, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "emotions" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

#### 3.3 Role Models (3x3 Circle Avatars)

```json
{
  "id": "role-models",
  "content": [
    { "type": "heading", "content": "Who inspires you?", "fontSize": 24 },
    { "type": "text", "content": "Select your role models", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "checkbox",
      "layout": "3x3",
      "gap": 14,
      "options": [
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Elon Musk", "width": 95, "imageShape": "circle", "value": "elon" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Oprah", "width": 95, "imageShape": "circle", "value": "oprah" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Steve Jobs", "width": 95, "imageShape": "circle", "value": "steve" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Beyoncé", "width": 95, "imageShape": "circle", "value": "beyonce" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Bill Gates", "width": 95, "imageShape": "circle", "value": "bill" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Michelle O", "width": 95, "imageShape": "circle", "value": "michelle" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Einstein", "width": 95, "imageShape": "circle", "value": "einstein" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Malala", "width": 95, "imageShape": "circle", "value": "malala" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Gandhi", "width": 95, "imageShape": "circle", "value": "gandhi" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

#### 3.4 Image Gallery (3x3 Image-Only)

```json
{
  "id": "favorites",
  "content": [
    { "type": "heading", "content": "Pick your favorites", "fontSize": 24 },
    { "type": "text", "content": "Select images you like", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "checkbox",
      "layout": "3x3",
      "gap": 14,
      "options": [
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i1" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i2" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i3" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i4" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i5" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i6" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i7" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i8" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "", "width": 95, "value": "i9" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

#### 3.5 Features (2x3)

```json
{
  "id": "features",
  "content": [
    { "type": "heading", "content": "What features matter?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "checkbox",
      "layout": "2x3",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "🔔 Reminders", "width": 100, "height": 44, "bgColor": "#fff", "textColor": "#333", "fontSize": 12, "value": "reminders" },
        { "variant": "flat", "text": "📊 Analytics", "width": 100, "height": 44, "bgColor": "#fff", "textColor": "#333", "fontSize": 12, "value": "analytics" },
        { "variant": "flat", "text": "🎯 Goals", "width": 100, "height": 44, "bgColor": "#fff", "textColor": "#333", "fontSize": 12, "value": "goals" },
        { "variant": "flat", "text": "📱 Mobile", "width": 100, "height": 44, "bgColor": "#fff", "textColor": "#333", "fontSize": 12, "value": "mobile" },
        { "variant": "flat", "text": "🔒 Privacy", "width": 100, "height": 44, "bgColor": "#fff", "textColor": "#333", "fontSize": 12, "value": "privacy" },
        { "variant": "flat", "text": "☁️ Sync", "width": 100, "height": 44, "bgColor": "#fff", "textColor": "#333", "fontSize": 12, "value": "sync" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

---

### Category 4: Quiz/Letter Grids

#### 4.1 Letter Grid (3x3)

```json
{
  "id": "letter-grid",
  "content": [
    { "type": "heading", "content": "Choose your letter", "fontSize": 24 },
    { "type": "text", "content": "Pick one that speaks to you", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "3x3",
      "gap": 12,
      "options": [
        { "variant": "square", "character": "A", "size": 65, "value": "A" },
        { "variant": "square", "character": "B", "size": 65, "value": "B" },
        { "variant": "square", "character": "C", "size": 65, "value": "C" },
        { "variant": "square", "character": "D", "size": 65, "value": "D" },
        { "variant": "square", "character": "E", "size": 65, "value": "E" },
        { "variant": "square", "character": "F", "size": 65, "value": "F" },
        { "variant": "square", "character": "G", "size": 65, "value": "G" },
        { "variant": "square", "character": "H", "size": 65, "value": "H" },
        { "variant": "square", "character": "I", "size": 65, "value": "I" }
      ],
      "responseCards": {
        "A": { "variant": "message", "message": "**A** - You're an Achiever! 🏆", "bgColor": "#dbeafe" },
        "B": { "variant": "message", "message": "**B** - You're a Builder! 🔨", "bgColor": "#dcfce7" },
        "C": { "variant": "quotation", "quote": "C is for Courage!", "author": "Quiz Master", "bgColor": "#fef3c7" },
        "D": { "variant": "message", "message": "**D** - You're Determined! 💪", "bgColor": "#f3e8ff" },
        "E": { "variant": "message", "message": "**E** - You're Energetic! ⚡", "bgColor": "#ecfdf5" },
        "F": { "variant": "message", "message": "**F** - You're Fantastic! ✨", "bgColor": "#fef2f2" },
        "G": { "variant": "message", "message": "**G** - You're Great! 🌟", "bgColor": "#f0fdf4" },
        "H": { "variant": "message", "message": "**H** - You're Heroic! 🦸", "bgColor": "#eff6ff" },
        "I": { "variant": "message", "message": "**I** - You're Incredible! 🚀", "bgColor": "#fdf4ff" }
      },
      "responsePosition": "bottom"
    },
    { "type": "button", "text": "Submit", "bgColor": "#2563eb" }
  ]
}
```

#### 4.2 Number Grid (2x2)

```json
{
  "id": "number-grid",
  "content": [
    { "type": "heading", "content": "Pick a number", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "2x2",
      "gap": 16,
      "options": [
        { "variant": "square", "character": "1", "size": 80, "value": 1 },
        { "variant": "square", "character": "2", "size": 80, "value": 2 },
        { "variant": "square", "character": "3", "size": 80, "value": 3 },
        { "variant": "square", "character": "4", "size": 80, "value": 4 }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

---

### Category 5: Rating Screens

#### 5.1 1-5 Rating (Auto-Complete)

```json
{
  "id": "rating",
  "content": [
    { "type": "heading", "content": "Rate your experience", "fontSize": 24 },
    { "type": "text", "content": "1 = Poor, 5 = Amazing", "align": "center", "color": "#555" },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "1x5",
      "gap": 16,
      "options": [
        { "variant": "square", "character": "1", "size": 52, "value": 1 },
        { "variant": "square", "character": "2", "size": 52, "value": 2 },
        { "variant": "square", "character": "3", "size": 52, "value": 3 },
        { "variant": "square", "character": "4", "size": 52, "value": 4 },
        { "variant": "square", "character": "5", "size": 52, "value": 5 }
      ],
      "responseCards": {
        "1": { "variant": "message", "message": "😢 We're sorry! We'll do better.", "bgColor": "#fef2f2" },
        "2": { "variant": "message", "message": "🙁 Thanks for your honesty.", "bgColor": "#fef3c7" },
        "3": { "variant": "quotation", "quote": "Room to improve!", "author": "Feedback", "bgColor": "#f0fdf4" },
        "4": { "variant": "message", "message": "😊 Great! Glad you enjoyed!", "bgColor": "#ecfdf5" },
        "5": { "variant": "info", "bgColor": "#eff6ff", "content": [
          { "type": "text", "content": "🎉 **Perfect Score!**", "align": "center", "fontSize": 18, "fontWeight": 700 },
          { "type": "text", "content": "Thank you so much!", "align": "center", "color": "#1d4ed8" }
        ]}
      },
      "responsePosition": "top"
    }
  ]
}
```

#### 5.2 Emoji Rating (1x5)

```json
{
  "id": "emoji-rating",
  "content": [
    { "type": "heading", "content": "How are you feeling?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "1x5",
      "gap": 12,
      "options": [
        { "variant": "square", "character": "😢", "size": 55, "value": 1 },
        { "variant": "square", "character": "😕", "size": 55, "value": 2 },
        { "variant": "square", "character": "😐", "size": 55, "value": 3 },
        { "variant": "square", "character": "🙂", "size": 55, "value": 4 },
        { "variant": "square", "character": "😄", "size": 55, "value": 5 }
      ]
    }
  ]
}
```

#### 5.3 Difficulty Rating (1x3)

```json
{
  "id": "difficulty",
  "content": [
    { "type": "heading", "content": "How was the difficulty?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "1x3",
      "gap": 16,
      "options": [
        { "variant": "flat", "text": "Too Easy", "width": 95, "height": 50, "bgColor": "#dcfce7", "textColor": "#166534", "fontSize": 12, "value": "easy" },
        { "variant": "flat", "text": "Just Right", "width": 95, "height": 50, "bgColor": "#dbeafe", "textColor": "#1e40af", "fontSize": 12, "value": "right" },
        { "variant": "flat", "text": "Too Hard", "width": 95, "height": 50, "bgColor": "#fef2f2", "textColor": "#991b1b", "fontSize": 12, "value": "hard" }
      ]
    }
  ]
}
```

---

### Category 6: Card Displays

#### 6.1 Quote Display

```json
{
  "id": "quote-display",
  "content": [
    { "type": "heading", "content": "Words of Wisdom", "fontSize": 24 },
    { "type": "card", "variant": "quotation", "quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs", "authorAlign": "right", "quoteSymbolColor": "#2563eb" },
    { "type": "card", "variant": "quotation", "quote": "Stay hungry, stay foolish.", "author": "Steve Jobs", "bgColor": "#fef3c7" },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

#### 6.2 Message Display

```json
{
  "id": "message-display",
  "content": [
    { "type": "heading", "content": "Important Message", "fontSize": 24 },
    { "type": "card", "variant": "message", "message": "## Welcome! 👋\n\nThis is a **message card** with full markdown support.\n\n- ✅ Bold and *italic* text\n- ✅ Lists and headings\n- ✅ Links and `code`" },
    { "type": "card", "variant": "message", "message": "### Quick Tip 💡\n\nYou can customize the background!", "bgColor": "#fef3c7", "align": "center" },
    { "type": "button", "text": "Got it!", "bgColor": "#2563eb" }
  ]
}
```

#### 6.3 Profile Card (Info)

```json
{
  "id": "profile-card",
  "content": [
    { "type": "heading", "content": "Meet Your Guide", "fontSize": 24 },
    { "type": "card", "variant": "info", "content": [
      { "type": "image", "src": "{{image}}", "width": "50%", "shape": "circle", "align": "center" },
      { "type": "text", "content": "**John Doe**", "align": "center", "fontSize": 18, "fontWeight": 600 },
      { "type": "text", "content": "Software Engineer", "align": "center", "color": "#666" }
    ]},
    { "type": "button", "text": "Let's Go!", "bgColor": "#2563eb" }
  ]
}
```

#### 6.4 Achievement Card

```json
{
  "id": "achievement",
  "content": [
    { "type": "heading", "content": "Achievement Unlocked! 🏆", "fontSize": 24 },
    { "type": "card", "variant": "info", "bgColor": "#fef3c7", "content": [
      { "type": "text", "content": "🎉 **First Quiz Complete!**", "align": "center", "fontSize": 18 },
      { "type": "image", "src": "{{image}}", "width": "40%", "shape": "rounded", "align": "center" },
      { "type": "text", "content": "You earned 100 points", "align": "center", "color": "#92400e" }
    ]},
    { "type": "button", "text": "Continue", "bgColor": "#f59e0b" }
  ]
}
```

---

### Category 7: Completion Screens

#### 7.1 Thank You Screen

```json
{
  "id": "thank-you",
  "content": [
    { "type": "heading", "content": "Thank You! 🙏", "fontSize": 28 },
    { "type": "card", "variant": "message", "message": "## You're all done!\n\n- ✅ Preferences saved\n- ✅ Profile created\n- ✅ Ready to go!", "bgColor": "#f0fdf4" },
    { "type": "button", "text": "Get Started", "bgColor": "#10b981" }
  ]
}
```

#### 7.2 Complete with Quote

```json
{
  "id": "complete-quote",
  "content": [
    { "type": "heading", "content": "You're all done! 🎊", "fontSize": 28 },
    { "type": "card", "variant": "quotation", "quote": "The journey of a thousand miles begins with a single step.", "author": "Lao Tzu", "quoteSymbolColor": "#2563eb" },
    { "type": "card", "variant": "info", "bgColor": "#eff6ff", "content": [
      { "type": "image", "src": "{{image}}", "width": "35%", "shape": "circle", "align": "center" },
      { "type": "text", "content": "**Your Journey Begins**", "align": "center", "fontSize": 18 }
    ]},
    { "type": "button", "text": "Start Over", "bgColor": "#2563eb" }
  ]
}
```

#### 7.3 Results Summary

```json
{
  "id": "results",
  "content": [
    { "type": "heading", "content": "Your Results 📊", "fontSize": 26 },
    { "type": "card", "variant": "info", "bgColor": "#dbeafe", "content": [
      { "type": "text", "content": "**Personality Type:**", "align": "center", "fontSize": 14, "color": "#1e40af" },
      { "type": "text", "content": "The Achiever 🏆", "align": "center", "fontSize": 24, "fontWeight": 700 }
    ]},
    { "type": "card", "variant": "message", "message": "### Your Strengths\n\n- 💪 Determined\n- 🎯 Goal-oriented\n- 🚀 Ambitious" },
    { "type": "button", "text": "View Full Report", "bgColor": "#2563eb" }
  ]
}
```

---

### Category 8: Error & Empty States

#### 8.1 Error Screen

```json
{
  "id": "error",
  "content": [
    { "type": "heading", "content": "Oops! 😅", "fontSize": 28 },
    { "type": "card", "variant": "message", "message": "Something went wrong.\n\nPlease try again.", "bgColor": "#fef2f2", "align": "center" },
    { "type": "button", "text": "Try Again", "bgColor": "#ef4444" }
  ]
}
```

#### 8.2 No Results

```json
{
  "id": "no-results",
  "content": [
    { "type": "image", "src": "{{image}}", "width": "40%", "shape": "rounded" },
    { "type": "heading", "content": "No Results Yet", "fontSize": 24 },
    { "type": "text", "content": "Complete the quiz to see your results.", "align": "center", "color": "#666" },
    { "type": "button", "text": "Start Quiz", "bgColor": "#2563eb" }
  ]
}
```

---

### Category 9: Time/Frequency Screens

#### 9.1 Time of Day

```json
{
  "id": "time-of-day",
  "content": [
    { "type": "heading", "content": "Best time for you?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "4x1",
      "gap": 12,
      "options": [
        { "variant": "flat", "text": "🌅 Morning (6-12)", "width": 280, "height": 52, "bgColor": "#fef3c7", "textColor": "#92400e", "textAlign": "left", "value": "morning" },
        { "variant": "flat", "text": "☀️ Afternoon (12-17)", "width": 280, "height": 52, "bgColor": "#dbeafe", "textColor": "#1e40af", "textAlign": "left", "value": "afternoon" },
        { "variant": "flat", "text": "🌆 Evening (17-21)", "width": 280, "height": 52, "bgColor": "#f3e8ff", "textColor": "#6b21a8", "textAlign": "left", "value": "evening" },
        { "variant": "flat", "text": "🌙 Night (21-6)", "width": 280, "height": 52, "bgColor": "#1f2937", "textColor": "#f9fafb", "textAlign": "left", "value": "night" }
      ]
    }
  ]
}
```

#### 9.2 Frequency

```json
{
  "id": "frequency",
  "content": [
    { "type": "heading", "content": "How often?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "5x1",
      "gap": 10,
      "options": [
        { "variant": "flat", "text": "Daily", "width": 280, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "daily" },
        { "variant": "flat", "text": "2-3 times/week", "width": 280, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "often" },
        { "variant": "flat", "text": "Once a week", "width": 280, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "weekly" },
        { "variant": "flat", "text": "A few times/month", "width": 280, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "monthly" },
        { "variant": "flat", "text": "Rarely", "width": 280, "height": 48, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "rarely" }
      ]
    }
  ]
}
```

---

### Category 10: Lifestyle/Personality

#### 10.1 Lifestyle (2x2)

```json
{
  "id": "lifestyle",
  "content": [
    { "type": "heading", "content": "Your lifestyle?", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "2x2",
      "gap": 16,
      "options": [
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Active", "width": 140, "textBgColor": "#10b981", "textColor": "#fff", "imageFill": true, "value": "active" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Balanced", "width": 140, "textBgColor": "#2563eb", "textColor": "#fff", "imageFill": true, "value": "balanced" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Relaxed", "width": 140, "textBgColor": "#8b5cf6", "textColor": "#fff", "imageFill": true, "value": "relaxed" },
        { "variant": "imageCard", "imageSrc": "{{image}}", "text": "Busy", "width": 140, "textBgColor": "#f59e0b", "textColor": "#fff", "imageFill": true, "value": "busy" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

#### 10.2 Personality Type

```json
{
  "id": "personality",
  "content": [
    { "type": "heading", "content": "I am more...", "fontSize": 24 },
    {
      "type": "selection",
      "mode": "radio",
      "layout": "2x1",
      "gap": 16,
      "options": [
        { "variant": "flat", "text": "🧠 Introverted - I recharge alone", "width": 300, "height": 60, "bgColor": "#f3e8ff", "textColor": "#6b21a8", "textAlign": "left", "value": "introvert" },
        { "variant": "flat", "text": "🎉 Extroverted - I recharge with people", "width": 300, "height": 60, "bgColor": "#fef3c7", "textColor": "#92400e", "textAlign": "left", "value": "extrovert" }
      ]
    },
    { "type": "button", "text": "Continue", "bgColor": "#2563eb" }
  ]
}
```

---

## Usage Tips

### 1. Auto-Complete Screens

Remove the button for radio selections to enable auto-advance:

```json
{
  "id": "age",
  "content": [
    { "type": "heading", "content": "Age?" },
    { "type": "selection", "mode": "radio", "layout": "4x1", "options": [...] }
    // NO BUTTON = auto-advance after selection
  ]
}
```

**Delay Behavior:**
- With `responseCards` → **2 second delay** (user reads message first)
- Without `responseCards` → **Immediate** advance

### 2. Selection Position Control

Use `position` to control where selection appears on screen:

```json
{
  "type": "selection",
  "mode": "radio",
  "layout": "1x5",
  "position": "middle",  // "top", "middle", or "bottom"
  "options": [...]
}
```

| Position | When to Use |
|----------|-------------|
| `"top"` | Keep selection with heading/text (default with button) |
| `"middle"` | Center selection between content and button |
| `"bottom"` | Pin selection to bottom (default without button) |

### 2. Branching with Conditional Screens

Use `conditionalScreens` for different paths based on selection:

```json
{
  "type": "selection",
  "options": [
    { "variant": "flat", "text": "Yes", "value": "yes" },
    { "variant": "flat", "text": "No", "value": "no" }
  ],
  "conditionalScreens": {
    "yes": { "content": [...] },
    "no": { "content": [...] }
  }
}
```

### 3. Inline Feedback with Response Cards

Use `responseCards` for instant feedback on the same screen:

```json
{
  "type": "selection",
  "options": [...],
  "responseCards": {
    "1": { "variant": "message", "message": "😢 Sorry!", "bgColor": "#fef2f2" },
    "5": { "variant": "message", "message": "🎉 Perfect!", "bgColor": "#ecfdf5" }
  },
  "responsePosition": "top"
}
```

### 4. Image Placeholders

Use `{{image}}` as placeholder - it gets replaced with actual images at runtime:

```json
{ "type": "image", "src": "{{image}}", "width": "50%" }
```

---

## File Structure

```
src/
├── App.tsx                 # Main app with SCREENS_JSON
├── GOD_PRD.md              # This document
├── Components/
│   ├── Button.tsx          # Square, ImageCard, Flat variants
│   ├── Card.tsx            # Quotation, Message, Info variants
│   ├── Image.tsx           # Shape, border, alignment
│   ├── Text.tsx            # Markdown support
│   └── SelectionOptions.tsx # Grid selection system
├── Screens/
│   └── Screens.tsx         # Main screen renderer
├── styles/
│   └── fonts.ts            # Font constants
└── index.css               # Layout & Tailwind
```

---

## Quick Reference Card

### Content Types

| Type | Key Props |
|------|-----------|
| `image` | `src`, `width`, `shape` |
| `heading` | `content`, `fontSize` |
| `text` | `content`, `align`, `color` |
| `button` | `text`, `bgColor` |
| `selection` | `mode`, `layout`, `options`, `position` |
| `card` | `variant`, + variant props |

### Selection Variants

| Variant | Key Props |
|---------|-----------|
| `square` | `character`, `size` |
| `imageCard` | `imageSrc`, `text`, `width`, `imageShape`, `imageFill` |
| `flat` | `text`, `size`, `width`, `height`, `bgColor` |

### Selection Position

| Position | Default When | Description |
|----------|--------------|-------------|
| `"top"` | Button exists | Selection with content at top |
| `"middle"` | Never (explicit) | Selection centered |
| `"bottom"` | No button | Selection pinned to bottom |

### Card Variants

| Variant | Key Props |
|---------|-----------|
| `quotation` | `quote`, `author` |
| `message` | `message` (markdown) |
| `info` | `content` (array of image/text) |

### Common Layouts

| Use Case | Layout |
|----------|--------|
| Vertical list | `4x1`, `5x1` |
| Yes/No | `1x2` |
| Small/Medium/Large | `1x3` |
| Rating 1-5 | `1x5` |
| Category grid | `2x2` |
| Avatar/Image grid | `3x3` |
| Emoji pills | `4x2` |

---

**🎉 You now have everything you need to create 50-60+ unique screen variations!**
