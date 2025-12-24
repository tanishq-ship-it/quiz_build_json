# Input Component PRD

A flexible text input component for collecting user data (email, name, phone, etc.).

---

## Overview

The `Input` component renders a styled HTML input field. It supports various HTML5 input types and handles basic focus/blur styling.

```tsx
import Input from "../Components/Input";
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"text" \| "email" \| "tel" \| "number" \| "password" \| "url"` | `"text"` | HTML5 input type |
| `value` | `string` | `""` | Current value |
| `onChange` | `(value: string) => void` | - | Valid change handler |
| `placeholder` | `string` | - | Placeholder text |
| `label` | `string` | - | Optional label above input |
| `width` | `string \| number` | `"100%"` | Width of the input container |
| `required` | `boolean` | `false` | Visual indicator only (logic handled in Screens) |
| `borderColor` | `string` | `"#e5e7eb"` | Default border color |
| `focusColor` | `string` | `"#2563eb"` | Border color on focus |
| `bgColor` | `string` | `"#fff"` | Background color |
| `textColor` | `string` | `"#1f2937"` | Text color |
| `fontSize` | `number` | `16` | Font size in px |
| `padding` | `number` | `12` | Internal padding in px |

---

## Styling

- **Border Radius**: `8px` (Standard rounded)
- **Transition**: `border-color 0.2s ease, box-shadow 0.2s ease`
- **Focus State**: Changes border color and adds a subtle shadow/ring.

---

## Examples

### Email Input

```tsx
<Input
  type="email"
  placeholder="name@example.com"
  label="Email Address"
  onChange={(val) => console.log(val)}
/>
```

### Simple Text Input

```tsx
<Input
  type="text"
  placeholder="Your full name"
  onChange={(val) => setIcon(val)}
/>
```
