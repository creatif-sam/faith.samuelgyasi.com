# Hero Component Folder

This folder contains the modern hero section redesign inspired by contemporary portfolio designs.

## Structure

```
hero/
├── HeroModern.tsx        # Main hero component
├── hero.module.css       # All hero-specific styles
├── translations.ts       # Bilingual content (EN/FR)
├── index.ts             # Export file
└── README.md            # This file
```

## Features

- ✅ Bilingual support (English/French)
- ✅ Modern, minimalist design
- ✅ Animated decorative elements
- ✅ Professional photo with blob backgrounds
- ✅ Experience badge
- ✅ Social media links
- ✅ Responsive mobile design
- ✅ Dark mode support
- ✅ Uses brand colors (gold gradient, navy, cream)

## Usage

```tsx
import { HeroModern } from "@/components/hero";

export default function HomePage() {
  return <HeroModern />;
}
```

## Content

The hero displays:
- Greeting: "Hello! 👋"
- Name: "I'm Samuel"
- Tagline: "Minister, Facilitator and Leader"
- Description: "I help you find your purpose, maximize your potential and develop christlike mind."
- Inspirational quote from 2 Corinthians 5:7
- Years of Ministry badge (10+)
- Social media links (Facebook, Twitter, Instagram, LinkedIn)

## Customization

### Translations
Edit `translations.ts` to change any text content in both languages.

### Styles
All styles are self-contained in `hero.module.css`. Colors use CSS custom properties from the global theme.

### Image
The component uses `/public/photo-hero.png`. Replace this file to change the hero image.

## Colors Used

- Gold gradient: `linear-gradient(90deg, #ffde59, #ff914d)`
- Background: `#faf8f5` (light) / `#0a0a0a` (dark)
- Accent: `#d4a843`
- Text: `#0a0a0a` (light) / `#f5f3ef` (dark)
