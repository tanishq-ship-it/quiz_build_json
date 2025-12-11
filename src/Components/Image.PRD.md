# Image Component PRD

A flexible image component with shape options, borders, and alignment controls.

---

## Overview

The `Image` component displays images with customizable shapes, borders, and positioning. It maintains aspect ratio by default and supports professional shape variants.

```tsx
import Image from "./Components/Image";
```

---

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | Yes | - | Image URL or path |
| `alt` | `string` | No | `""` | Alt text for accessibility |
| `width` | `string \| number` | No | `"80%"` | Image width |
| `shape` | `"none" \| "circle" \| "rounded" \| "blob"` | No | `"none"` | Image shape |
| `border` | `boolean` | No | auto | Show border (auto-enabled if borderColor provided) |
| `borderColor` | `string` | No | `"#e5e5e5"` | Border color |
| `borderWidth` | `number` | No | `2` | Border width in pixels |
| `align` | `"left" \| "center" \| "right"` | No | `"center"` | Horizontal alignment |
| `onClick` | `() => void` | No | - | Click handler |

---

## Shapes

| Shape | Description | Border Radius |
|-------|-------------|---------------|
| `none` | No border radius (default) | `0` |
| `circle` | Perfect circle (1:1 aspect ratio enforced) | `50%` |
| `rounded` | Rounded corners | `16px` |
| `blob` | Organic blob shape | Complex curve |

---

## Examples

### Basic Usage (Default)

```tsx
// 80% width, centered, no shape
<Image src="/photo.jpg" />
```

### Circle Shape

```tsx
// Circle with 50% width
<Image src="/avatar.jpg" shape="circle" width="50%" />
```

### Rounded Shape

```tsx
// Rounded corners
<Image src="/chart.png" shape="rounded" width="70%" />
```

### Blob Shape

```tsx
// Organic blob shape
<Image src="/icon.png" shape="blob" width="60%" />
```

### With Border

```tsx
// Border auto-enabled when borderColor is provided
<Image src="/photo.jpg" shape="rounded" borderColor="#2563eb" />

// Custom border width
<Image src="/photo.jpg" shape="circle" borderColor="#16a34a" borderWidth={4} />

// Explicit border with default color
<Image src="/photo.jpg" shape="rounded" border />
```

### Alignment

```tsx
// Left aligned
<Image src="/photo.jpg" align="left" width="50%" />

// Center aligned (default)
<Image src="/photo.jpg" align="center" />

// Right aligned
<Image src="/photo.jpg" align="right" width="50%" />
```

### Clickable Image

```tsx
<Image 
  src="/photo.jpg" 
  shape="rounded" 
  onClick={() => console.log("Image clicked")} 
/>
```

### Combined Props

```tsx
<Image
  src="/avatar.jpg"
  alt="User avatar"
  width="150px"
  shape="circle"
  borderColor="#2563eb"
  borderWidth={3}
  align="center"
  onClick={() => openProfile()}
/>
```

---

## Border Behavior

The border is **automatically enabled** when:
- `borderColor` is provided, OR
- `border={true}` is set

The border is **disabled** when:
- `border={false}` is explicitly set (even if borderColor exists)
- Neither `border` nor `borderColor` is provided

```tsx
// Border shows (borderColor provided)
<Image src="/img.jpg" borderColor="#000" />

// Border shows (explicit)
<Image src="/img.jpg" border />

// No border (explicit false)
<Image src="/img.jpg" border={false} borderColor="#000" />

// No border (nothing provided)
<Image src="/img.jpg" />
```

---

## Sizing

| Property | Value |
|----------|-------|
| Default Width | 80% of container |
| Height | Auto (maintains aspect ratio) |
| Circle | Forces 1:1 aspect ratio |

**Width accepts:**
- Percentage: `"80%"`, `"50%"`
- Pixels: `"150px"`, `150`
- Any valid CSS width

---

## Styling Details

| Element | Style |
|---------|-------|
| Container | Full width flex container |
| Image wrapper | Overflow hidden, border-radius applied |
| Image | 100% width/height, object-fit based on shape |

**Object Fit:**
- Circle shape: `cover` (crops to fill)
- Other shapes: `contain` (full image visible)

---

## Use Cases

1. **Avatars** - Circle shape with border
2. **Product images** - Rounded shape
3. **Charts/Graphics** - No shape, centered
4. **Decorative** - Blob shape for organic look
5. **Galleries** - Clickable images with hover states
6. **Profile pictures** - Circle with border color

---

## Alignment Visual

```
Left:     [IMG]___________
Center:   ____[IMG]_______
Right:    ___________[IMG]
```
