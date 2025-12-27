# CompletionScreen Component PRD

## Overview

The `CompletionScreen` component is a specialized screen layout designed for quiz/survey completion flows. It features a distinctive container box design with logo, heading, comparison cards, social proof, and an infinite scrolling email ticker.

## When to Use

Use this component when you want to:
- Show a completion/success screen at the end of a quiz
- Display social proof and community engagement
- Present comparison cards (e.g., "before vs after", "old way vs new way")
- Create a visually distinct final screen with a contained layout

## Component Structure

```
┌─────────────────────────────────┐
│          Logo (top)             │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Container Box (white)   │  │
│  │   ├─ Heading              │  │
│  │   ├─ Subtext              │  │
│  │   ├─ Comparison Cards     │  │
│  │   ├─ Social Proof         │  │
│  │   └─ Email Ticker         │  │
│  └───────────────────────────┘  │
│                                 │
│      [Continue Button]          │
└─────────────────────────────────┘
```

## Props

### CompletionScreenProps

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `logo` | `string` | No | - | Logo image source (supports placeholders like `{{logo}}`) |
| `heading` | `string` | Yes | - | Main heading text |
| `subtext` | `string` | No | - | Subtitle/description text below heading |
| `comparisonCards` | `ComparisonCard[]` | No | `[]` | Array of comparison cards (2-column grid) |
| `socialProof` | `string` | No | - | Social proof text (e.g., "1103 people learned...") |
| `emailTicker` | `string[]` | No | `[]` | Array of email strings for infinite scroll |
| `button` | `CompletionButton` | No | - | Button configuration |
| `gap` | `number` | No | `16` | Gap between elements inside container (px) |
| `padding` | `number` | No | `24` | Screen padding (px) |

### ComparisonCard

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | - | Card image source |
| `title` | `string` | Yes | - | Card title text |
| `subtitle` | `string` | Yes | - | Card subtitle text |
| `bgColor` | `string` | No | `#f5f5f5` | Card background color |

### CompletionButton

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `text` | `string` | Yes | - | Button text |
| `bgColor` | `string` | No | `#2563eb` | Button background color |
| `textColor` | `string` | No | `#fff` | Button text color |
| `onClick` | `() => void` | No | - | Click handler (auto-injected by ScreenRouter) |

## Usage

### Basic Example

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

### Full Example

```json
{
  "id": "completion",
  "content": [
    {
      "type": "completion",
      "logo": "{{logo}}",
      "heading": "Be part of more than 20 million people",
      "subtext": "Achieve more together with our growing global learning community.",
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
      "socialProof": "1103 people learned self-growth insights in the hour",
      "emailTicker": [
        "*@icloud.com",
        "mysticwo***@gmail.com",
        "solarchi***@yahoo.com",
        "echocha*@example.com"
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

## Features

### Container Box
- White background with subtle shadow
- Rounded corners (16px)
- Contains all main content
- Max width: 500px (matches other screens)
- Responsive padding

### Comparison Cards
- 2-column grid layout
- Each card has:
  - Image (70% width, centered)
  - Title (bold, 16px)
  - Subtitle (regular, 13px)
  - Custom background color
- Rounded corners (12px)
- Equal width distribution
- Responsive on mobile (may stack)

### Email Ticker
- Infinite horizontal scroll
- Uses Carousel component internally
- Auto-plays continuously
- Seamless loop animation
- Small, subtle text styling
- Speed: 30 seconds per full loop

### Button
- Fixed at bottom of screen
- Full-width style (300px)
- Customizable colors
- Auto-connected to navigation by ScreenRouter

## Design Tokens

### Colors
- Container background: `#ffffff`
- Container shadow: `rgba(0, 0, 0, 0.08)`
- Heading: `#333`
- Subtext: `#666`
- Social proof: `#555`
- Email ticker: `#888`
- Default button: `#2563eb`
- Default card bg: `#f5f5f5`

### Typography
- Font family: Inter (from `FONT_INTER`)
- Heading: 24px, bold (700)
- Subtext: 15px, regular (400)
- Card title: 16px, semibold (600)
- Card subtitle: 13px, regular (400)
- Social proof: 14px, regular (400)
- Email ticker: 13px, regular (400)

### Spacing
- Container border radius: 16px
- Card border radius: 12px
- Default gap: 16px
- Default padding: 24px
- Card padding: 16px
- Grid gap: 12px

## Auto-Detection

The component is automatically rendered when:
1. Screen `id` is `"completion"`
2. First content item has `type: "completion"`

This is handled by the `Screens.tsx` component:

```typescript
if (screenId === "completion" && content[0].type === "completion") {
  return <CompletionScreen {...content[0]} />;
}
```

## Placeholder Support

The component supports placeholders in:
- `logo` - e.g., `"{{logo}}"`
- `comparisonCards[].image` - e.g., `"{{image1}}"`

These are replaced by ScreenRouter's `processContent` function.

## Responsive Behavior

- **Desktop/Tablet**: Full layout with 2-column comparison cards
- **Mobile**: May need to adjust card layout (currently 2 columns, may be tight on small screens)

## Dependencies

- `Image` - For logo and card images
- `Text` - For subtext and social proof
- `Button` - For continue button
- `Carousel` - For email ticker infinite scroll
- `FONT_INTER` - Font family constant

## Best Practices

1. **Keep heading concise** - Max 2 lines for best appearance
2. **Use 2 comparison cards** - Layout optimized for 2 cards
3. **Provide 4-6 emails** - Enough for smooth infinite scroll
4. **Use contrasting card colors** - Makes comparison clear
5. **Keep social proof short** - 1-2 lines max
6. **Use placeholders** - For images to work with ScreenRouter

## Future Enhancements

- Support for 3+ comparison cards with responsive grid
- Animated counter for social proof numbers
- Custom ticker speed control
- Optional card icons/badges
- Vertical ticker option for emails
