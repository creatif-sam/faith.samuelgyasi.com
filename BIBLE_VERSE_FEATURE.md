# Bible Verse Hover Feature

## Overview

The Bible verse hover feature automatically detects Bible references in blog post content and enhances them with:
- **Underlined styling** to make Bible references visually distinct
- **Interactive tooltips** that show the full verse text when hovering
- **Language-aware fetching** that displays verses in English (KJV) or French (LSG) based on the user's language preference

## How It Works

### 1. Automatic Detection

The system automatically detects Bible references in the following formats:
- `John 3:16`
- `Romans 8:28-30` (verse ranges)
- `1 Corinthians 13:4-7`
- `Psalm 23:1`
- French references: `Jean 3:16`, `Romains 8:28`, etc.

### 2. Supported Books

The parser recognizes common Bible book names and abbreviations:

**Old Testament:**
- Genesis, Gen, Exodus, Ex, Leviticus, Lev, Numbers, Num, Deuteronomy, Deut
- Joshua, Josh, Judges, Judg, Ruth, 1 Samuel, 2 Samuel, 1 Kings, 2 Kings
- Psalms, Ps, Proverbs, Prov, Isaiah, Isa, Jeremiah, Jer, Ezekiel, Ezek
- And all other OT books...

**New Testament:**
- Matthew, Matt, Mt, Mark, Mk, Luke, Lk, John, Jn, Acts
- Romans, Rom, 1 Corinthians, 1 Cor, 2 Corinthians, 2 Cor, Galatians, Gal
- And all other NT books...

**French Names:**
- Genèse, Exode, Matthieu, Jean, Romains, Corinthiens, etc.

### 3. User Experience

When a user reads a blog post:
1. Bible references are **underlined** with a golden color
2. Hovering over a reference displays a **tooltip** with:
   - The full verse text
   - The reference citation
3. Verses are **cached** to avoid repeated API calls
4. Language is automatically selected based on user preference (EN/FR)

### 4. Translations Used

- **English:** King James Version (KJV)
- **French:** Louis Segond (LSG)

## Technical Implementation

### Components

1. **BibleEnhancedContent.tsx** - Main component that:
   - Parses HTML content for Bible references
   - Wraps references with interactive spans
   - Manages tooltip display and positioning
   - Fetches verse text from Bible API

2. **bible-parser.ts** - Utility functions for:
   - Detecting Bible references in text
   - Extracting reference patterns
   - Supporting multiple languages

### API Integration

The feature uses the [Bible API](https://bible-api.com/) which provides:
- Free access to KJV and LSG translations
- Simple RESTful interface
- No authentication required

Example API call:
```
GET https://bible-api.com/John 3:16?translation=KJV
```

### Caching Strategy

- Verses are cached in memory after first fetch
- Cache stores both English and French versions
- Prevents redundant API calls during a session
- Cache is cleared when the page is reloaded

## Usage in Blog Posts

When creating blog content, simply write Bible references naturally in your text:

```html
<p>
  The Bible tells us in John 3:16 that God loved the world. 
  Paul reminds us in Romans 8:28 that all things work together for good.
  The Psalms declare in Psalm 23:1 that the Lord is our shepherd.
</p>
```

The system will automatically enhance these references!

## Styling

The Bible references use custom CSS classes:
- `.bible-ref` - Styling for the underlined reference
- `.bible-tooltip` - Container for the hover tooltip
- `.bible-tooltip-text` - Verse text styling
- `.bible-tooltip-ref` - Reference citation styling

## Browser Compatibility

The feature uses modern CSS and JavaScript features:
- CSS custom properties (variables)
- Flexbox and Grid
- Fetch API for Bible verse retrieval
- Event listeners for hover interactions

Supported browsers:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential improvements:
- [ ] Offline verse database for faster loading
- [ ] Support for more Bible translations
- [ ] Click to copy verse text
- [ ] Share verse functionality
- [ ] Verse comparison between translations
- [ ] Audio narration of verses

## Troubleshooting

**References not being detected:**
- Ensure the book name is spelled correctly
- Check that the format matches: `Book Chapter:Verse`
- Verify the book name is in the supported list

**Tooltip not showing:**
- Check browser console for API errors
- Verify internet connection (API requires network access)
- Ensure JavaScript is enabled

**Wrong translation showing:**
- Check language preference in the UI
- Verify that the Bible API supports the requested translation

## Credits

- Bible API: [bible-api.com](https://bible-api.com/)
- King James Version (KJV) - Public domain
- Louis Segond (LSG) - Public domain
