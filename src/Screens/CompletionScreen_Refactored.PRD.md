# PRD: Completion Screen (Refactored)

**Type:** Screen Layout  
**Components Used:** `Card` (Container Variant), `Button`

## Overview

The new Completion Screen is built using the flexible **Container Card**. This allows the "boxed" layout to be used anywhere in the app (start, middle, or end) while maintaining the specific design requirements: a contained white box with logo, full-width image, social proof, and email ticker.

---

## Screen JSON Structure

```json
{
  "id": "completion",
  "content": [
    {
      "type": "card",
      "variant": "container",
      "logo": "{{logo}}",
      "heading": "Be part of more than 20 million people",
      "subtext": "Achieve more together with our growing global learning community.",
      "image": "{{image}}",
      "socialProof": "1103 people learned self-growth insights in the hour",
      "emailTicker": [
        "*@icloud.com",
        "mysticwo***@gmail.com",
        "solarchi***@yahoo.com",
        "echocha*@example.com"
      ]
    },
    {
      "type": "button",
      "text": "Continue",
      "bgColor": "#2563eb",
      "textColor": "#fff"
    }
  ]
}
```

---

## Component Details: Container Card

**Variant:** `variant="container"`

| Property | Type | Description |
|----------|------|-------------|
| `logo` | `string` | URL for the top logo (centered, 120px width) |
| `heading` | `string` | Main title text (Bold, 24px) |
| `subtext` | `string` | Description text below heading |
| `image` | `string` | **Full-width image** that spans edge-to-edge of the container |
| `socialProof` | `string` | Text showing user stats (e.g., "1000+ joined") |
| `emailTicker` | `string[]` | Array of emails for the infinite scrolling ticker |

### Visual Specs
- **Background:** White (`#fff`)
- **Shadow:** Subtle drop shadow (`0 2px 8px rgba(0,0,0,0.08)`)
- **Radius:** `16px` rounded corners
- **Padding:** `24px` internal padding
- **Image:** Uses negative margins to fill width (`calc(100% + 48px)`)
- **Ticker Speed:** 20 seconds per loop

---

## Why this approach?

1.  **Flexibility:** Can be used for Welcome Screens, Intro Cards, or Success States.
2.  **Composability:** Can be mixed with other content text or warnings if needed.
3.  **Consistency:** Uses the same `Card` system as Quotations and Info cards.
