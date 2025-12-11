# Button Component PRD

A flexible button component system with multiple variants for different use cases.

---

## Overview

The `Button` component uses a **variant-based pattern** where you specify the button type via the `variant` prop, and the component renders the appropriate internal button.

```tsx
import Button from "./Components/Button";
```

---

## Variants

### 1. Square Button (`variant="square"`)

A small square button with a single character inside. Perfect for option selectors (A, B, C, D) or icon-like buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `character` | `string` | required | Single character to display |
| `size` | `number` | `30` | Width & height in pixels |
| `onClick` | `() => void` | - | Click handler |

**Styling:**
- Background: White (`#fff`)
- Text color: Dark gray (`#333`)
- Border: Light gray (`#ccc`)
- Border radius: 6px
- Font size: 50% of button size
- Font weight: 600 (semi-bold)

**Examples:**

```tsx
// Default 30x30 with letter
<Button variant="square" character="A" />

// Larger size for grids
<Button variant="square" character="A" size={70} />
```

---

### 2. Image Card Button (`variant="imageCard"`)

A card-style button with an image on top and optional text label at the bottom. Great for selection cards like categories, profiles, or image-only options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageSrc` | `string` | required | Image URL |
| `text` | `string` | `""` | Label text (empty = image-only mode) |
| `width` | `number` | `150` | Button width |
| `textAlign` | `"left" \| "center" \| "right"` | `"center"` | Text alignment |
| `textBgColor` | `string` | `undefined` | Background color for text section |
| `textColor` | `string` | `"#333"` | Text color |
| `imageShape` | `"none" \| "circle"` | `"none"` | Image display style |
| `imageFill` | `boolean` | `false` | **NEW:** Fill entire image area edge-to-edge |
| `onClick` | `() => void` | - | Click handler |

**Height Calculation:**
- With text: `width × 0.85`
- Without text: `width` (square)

**Special Behaviors:**

1. **Image-only mode (no text):**
   - When `text` is empty or not provided
   - Card becomes square (`width × width`)
   - Image fills area with 5% padding
   - No text section rendered

2. **imageFill mode:**
   - When `imageFill: true`
   - Image covers entire image section (edge-to-edge)
   - Uses `object-fit: cover`

3. **Default (neutral) styling:**
   - Background: Light gray (`#f5f5f5`)
   - No colored border by default
   - Border radius: 16px

**Examples:**

```tsx
// With colored text background
<Button 
  variant="imageCard" 
  imageSrc="/design.png" 
  text="Design"
  textBgColor="#2563eb"
  textColor="#fff"
/>

// Image fills entire area
<Button 
  variant="imageCard" 
  imageSrc="/photo.jpg" 
  text="Photo"
  imageFill={true}
  textBgColor="#10b981"
  textColor="#fff"
/>

// Image-only (no text) - becomes square with 5% padding
<Button 
  variant="imageCard" 
  imageSrc="/gallery.jpg" 
  text=""
  width={100}
/>

// Circle image inside card
<Button 
  variant="imageCard" 
  imageSrc="/avatar.jpg" 
  text="John"
  imageShape="circle"
/>
```

---

### 3. Flat Button (`variant="flat"`)

A simple, full-width style button. Perfect for primary actions (Continue, Submit) or selection options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Button label |
| `width` | `number` | `300` | Button width (height = 20% of width) |
| `textAlign` | `"left" \| "center" \| "right"` | `"center"` | Text alignment |
| `bgColor` | `string` | `"#2563eb"` | Background color |
| `textColor` | `string` | `"#fff"` | Text color |
| `onClick` | `() => void` | - | Click handler |

**Note:** When `bgColor` is white, a subtle border is automatically added.

**Examples:**

```tsx
// Primary action button (blue, centered)
<Button variant="flat" text="Continue" />

// Selection option (white, left-aligned)
<Button 
  variant="flat" 
  text="18-24"
  bgColor="#fff"
  textColor="#333"
  textAlign="left"
  width={300}
/>

// With emoji
<Button 
  variant="flat" 
  text="🚀 Leadership"
  bgColor="#fff"
  textColor="#333"
  textAlign="left"
  width={145}
/>
```

---

## Common Props

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `"square" \| "imageCard" \| "flat"` | **Required.** Determines button type |
| `onClick` | `() => void` | Click event handler |

---

## Design Tokens

| Token | Value | Used In |
|-------|-------|---------|
| Primary Blue | `#2563eb` | Default flat button bg, selection highlight |
| Light Gray | `#f5f5f5` | ImageCard background |
| White | `#fff` | Square/Flat light backgrounds |
| Dark Text | `#333` | Default text color |
| Border Radius (ImageCard) | `16px` | Rounded corners |
| Border Radius (Flat) | `12px` | Rounded corners |
| Border Radius (Square) | `6px` | Slight rounding |

---

## Aspect Ratios

| Variant | Ratio | Example |
|---------|-------|---------|
| Square | 1:1 | 70×70 |
| Image Card (with text) | width : 85% height | 150×127 |
| Image Card (no text) | 1:1 | 100×100 |
| Flat | width : 20% height | 300×60 |
