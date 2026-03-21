# Integration Guide for HeroModern Component

## Quick Start

To use the new hero section on your homepage, replace the existing `<HeroSection />` with `<HeroModern />`.

### Option 1: Update app/page.tsx

```tsx
import { HeroModern } from "@/components/hero";

export default function HomePage() {
  return (
    <main>
      <HeroModern />
      {/* Other sections... */}
    </main>
  );
}
```

### Option 2: Side-by-side comparison

Keep both heroes and test:

```tsx
import { HeroSection } from "@/components/organisms/HeroSection";
import { HeroModern } from "@/components/hero";

export default function HomePage() {
  const useNewHero = true; // Toggle this

  return (
    <main>
      {useNewHero ? <HeroModern /> : <HeroSection />}
      {/* Other sections... */}
    </main>
  );
}
```

## What's Different?

### Visual Changes
- ✅ Modern card-based layout inspired by portfolio design
- ✅ Animated waving hand emoji
- ✅ Colorful blob backgrounds behind image
- ✅ Floating "Years of Ministry" badge
- ✅ Prominent social media icons
- ✅ Bible verse quote box
- ✅ Cleaner, more minimal typography

### Content Changes
- **Greeting**: "Hello! 👋"
- **Title**: "I'm Samuel / Minister, Facilitator and Leader"
- **Description**: "I help you find your purpose, maximize your potential and develop christlike mind."
- **Quote**: Walking by faith verse from 2 Corinthians
- **Badge**: "10+ Years Of Ministry"
- **CTA**: "Follow me" button

### Technical Changes
- All styles isolated in `hero.module.css` (no global CSS pollution)
- Uses CSS Modules for scoped styling
- Fully bilingual (EN/FR)
- Responsive from mobile to desktop
- Dark mode compatible
- Self-contained in `/components/hero/` folder

## Customization

### Update Social Links
Edit [HeroModern.tsx](HeroModern.tsx) and replace the placeholder URLs:
```tsx
<a href="YOUR_FACEBOOK_URL" ...>
<a href="YOUR_TWITTER_URL" ...>
<a href="YOUR_INSTAGRAM_URL" ...>
<a href="YOUR_LINKEDIN_URL" ...>
```

### Change Years of Ministry
Edit [translations.ts](translations.ts):
```ts
experience: {
  years: {
    en: "10+",
    fr: "10+",
  },
}
```

### Adjust Colors
The component uses your existing brand colors from `globals.css`:
- Gold gradient: `--gold-gradient`
- Primary gold: `#d4a843`
- Background colors from theme variables

To customize further, edit [hero.module.css](hero.module.css).

### Modify Text Content
All text is in [translations.ts](translations.ts) for both English and French.

## Browser Testing Checklist

- [ ] Desktop Chrome/Edge
- [ ] Mobile Safari/Chrome
- [ ] Dark mode toggle
- [ ] Language toggle (EN ↔ FR)
- [ ] Hover effects on buttons
- [ ] Social link clicks
- [ ] Responsive breakpoints

## Preview

The hero section displays:
1. **Left Side**: Content with greeting, name, role, description, quote, and CTA
2. **Right Side**: Professional photo with decorative blobs and experience badge
3. **Bottom**: Social media icon row

Decorative elements (circles) float gently in the background for visual interest.
