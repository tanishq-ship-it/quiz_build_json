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

// Numbers
<Button variant="square" character="1" />
<Button variant="square" character="2" />

// Different sizes
<Button variant="square" character="S" size={25} />
<Button variant="square" character="M" size={35} />
<Button variant="square" character="L" size={45} />
<Button variant="square" character="X" size={55} />

// With click handler
<Button 
  variant="square" 
  character="C" 
  size={40} 
  onClick={() => console.log("clicked")} 
/>
```

---

### 2. Image Card Button (`variant="imageCard"`)

A card-style button with an image on top and text label at the bottom. Great for selection cards like gender, categories, or profiles.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageSrc` | `string` | required | Image URL |
| `text` | `string` | required | Label text |
| `width` | `number` | `150` | Button width (height auto = 70% of width) |
| `textAlign` | `"left" \| "center" \| "right"` | `"left"` | Text alignment |
| `textBgColor` | `string` | `"#2563eb"` | Background color for text section |
| `textColor` | `string` | `"#fff"` | Text color |
| `imageShape` | `"none" \| "circle"` | `"none"` | Image display style |
| `onClick` | `() => void` | - | Click handler |

**Examples:**

```tsx
// Basic usage
<Button 
  variant="imageCard" 
  imageSrc="/male-avatar.png" 
  text="Male" 
/>

// Centered text, larger size
<Button 
  variant="imageCard" 
  imageSrc="/female-avatar.png" 
  text="Female"
  width={200}
  textAlign="center"
/>

// Circular image frame
<Button 
  variant="imageCard" 
  imageSrc="/profile.jpg" 
  text="John"
  imageShape="circle"
/>

// Custom colors
<Button 
  variant="imageCard" 
  imageSrc="/icon.png" 
  text="Option 1"
  textBgColor="#16a34a"
  textColor="#fff"
/>

// No background on text
<Button 
  variant="imageCard" 
  imageSrc="/icon.png" 
  text="Option 2"
  textBgColor="transparent"
  textColor="#333"
/>
```

---

### 3. Flat Button (`variant="flat"`)

A simple, full-width style button. Perfect for primary actions (Continue, Submit) or selection options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Button label |
| `width` | `number` | `300` | Button width (height auto = 20% of width) |
| `textAlign` | `"left" \| "center" \| "right"` | `"center"` | Text alignment |
| `bgColor` | `string` | `"#2563eb"` | Background color |
| `textColor` | `string` | `"#fff"` | Text color |
| `onClick` | `() => void` | - | Click handler |

**Note:** When `bgColor` is white (`#fff`, `white`, `#ffffff`), a subtle border is automatically added.

**Examples:**

```tsx
// Primary action button (blue, centered)
<Button 
  variant="flat" 
  text="Continue" 
/>

// Selection option (white, left-aligned)
<Button 
  variant="flat" 
  text="18-24"
  bgColor="#fff"
  textColor="#333"
  textAlign="left"
/>

// Custom width
<Button 
  variant="flat" 
  text="Submit"
  width={400}
/>

// Right-aligned text
<Button 
  variant="flat" 
  text="Next →"
  textAlign="right"
/>

// Custom color
<Button 
  variant="flat" 
  text="Delete"
  bgColor="#dc2626"
  textColor="#fff"
/>
```

---

## Common Props

These props are available across all variants:

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `"square" \| "imageCard" \| "flat"` | **Required.** Determines button type |
| `onClick` | `() => void` | Click event handler |

---

## Design Tokens

| Token | Value | Used In |
|-------|-------|---------|
| Primary Blue | `#2563eb` | Default backgrounds, borders |
| White | `#fff` | Light backgrounds |
| Dark Text | `#333` | Square button text, flat button light mode text |
| Light Border | `#e5e5e5` | Flat button light mode border |
| Gray Border | `#ccc` | Square button border |

---

## Aspect Ratios

| Variant | Ratio | Example |
|---------|-------|---------|
| Square | 1:1 | 30×30, 50×50 |
| Image Card | width : 70% height | 150×105, 200×140 |
| Flat | width : 20% height | 300×60, 400×80 |

---

## Adding New Variants

To add a new button variant:

1. Create the internal component with its own interface
2. Add the variant name to `ButtonVariant` type
3. Add props to `ButtonProps` interface
4. Add a case in the switch statement

```tsx
// Example: Adding a new "icon" variant
type ButtonVariant = "square" | "imageCard" | "flat" | "icon";
```
