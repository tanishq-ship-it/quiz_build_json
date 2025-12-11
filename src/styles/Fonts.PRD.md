# Fonts & Typography PRD

Typography system using Inter font family.

---

## Overview

The app uses **Inter** as the primary font family, loaded from Google Fonts. Font tokens are available as CSS variables, Tailwind classes, and TypeScript constants.

---

## Font Family

| Token | Value |
|-------|-------|
| Primary Font | `'Inter', sans-serif` |

---

## Font Weights

| Name | Weight | Usage |
|------|--------|-------|
| Regular | 400 | Body text, paragraphs |
| Medium | 500 | Buttons, labels |
| SemiBold | 600 | Headings, emphasis |
| Bold | 700 | Strong emphasis, titles |

---

## Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| Card Title | 19px | Card headings |

---

## Usage

### 1. Tailwind CSS Classes

```html
<!-- Font family -->
<p class="font-inter">Text</p>

<!-- Font weights -->
<p class="font-inter-regular">Regular (400)</p>
<p class="font-inter-medium">Medium (500)</p>
<p class="font-inter-semibold">SemiBold (600)</p>
<p class="font-inter-bold">Bold (700)</p>

<!-- Italic -->
<p class="font-inter-italic">Italic text</p>

<!-- Card title size -->
<p class="text-card-title">19px title</p>
```

### 2. TypeScript Constants (Inline Styles)

```tsx
import {
  FONT_INTER,
  FONT_INTER_REGULAR,
  FONT_INTER_MEDIUM,
  FONT_INTER_SEMIBOLD,
  FONT_INTER_BOLD,
  CARD_TITLE_SIZE,
} from "../styles/fonts";

// Usage
<p style={{ 
  fontFamily: FONT_INTER, 
  fontWeight: FONT_INTER_SEMIBOLD,
  fontSize: CARD_TITLE_SIZE 
}}>
  Title
</p>
```

### 3. CSS Variables

```css
:root {
  --font-inter: 'Inter', sans-serif;
  --font-inter-regular: 400;
  --font-inter-medium: 500;
  --font-inter-semibold: 600;
  --font-inter-bold: 700;
  --card-title-size: 19px;
}

/* Usage */
.my-class {
  font-family: var(--font-inter);
  font-weight: var(--font-inter-semibold);
  font-size: var(--card-title-size);
}
```

---

## Files

| File | Purpose |
|------|---------|
| `src/index.css` | CSS variables, Tailwind classes, Google Fonts import |
| `src/styles/fonts.ts` | TypeScript constants for React components |

---

## Components Using Inter

All components use Inter font by default:

- ✅ Button (all variants)
- ✅ ListBlock
- ✅ Text

---

## Quick Reference

```tsx
// Import
import { FONT_INTER, FONT_INTER_MEDIUM } from "../styles/fonts";

// Apply
style={{ fontFamily: FONT_INTER, fontWeight: FONT_INTER_MEDIUM }}

// Or use class
className="font-inter-medium"
```
