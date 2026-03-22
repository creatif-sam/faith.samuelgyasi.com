// lib/bible-parser.ts
/**
 * Parses HTML content and wraps Bible references with interactive components
 */

import { ReactElement } from "react";

// Common Bible book abbreviations and names
const BIBLE_BOOKS = [
  // Old Testament
  "Genesis", "Gen", "Exodus", "Ex", "Exod", "Leviticus", "Lev", "Numbers", "Num", 
  "Deuteronomy", "Deut", "Dt", "Joshua", "Josh", "Judges", "Judg", "Ruth",
  "1 Samuel", "1 Sam", "2 Samuel", "2 Sam", "1 Kings", "1 Kgs", "2 Kings", "2 Kgs",
  "1 Chronicles", "1 Chr", "2 Chronicles", "2 Chr", "Ezra", "Nehemiah", "Neh",
  "Esther", "Est", "Job", "Psalm", "Psalms", "Ps", "Proverbs", "Prov",
  "Ecclesiastes", "Eccl", "Song of Solomon", "Song", "Isaiah", "Isa",
  "Jeremiah", "Jer", "Lamentations", "Lam", "Ezekiel", "Ezek", "Daniel", "Dan",
  "Hosea", "Hos", "Joel", "Amos", "Obadiah", "Obad", "Jonah", "Jon",
  "Micah", "Mic", "Nahum", "Nah", "Habakkuk", "Hab", "Zephaniah", "Zeph",
  "Haggai", "Hag", "Zechariah", "Zech", "Malachi", "Mal",
  
  // New Testament
  "Matthew", "Matt", "Mt", "Mark", "Mk", "Luke", "Lk", "John", "Jn",
  "Acts", "Romans", "Rom", "1 Corinthians", "1 Cor", "2 Corinthians", "2 Cor",
  "Galatians", "Gal", "Ephesians", "Eph", "Philippians", "Phil",
  "Colossians", "Col", "1 Thessalonians", "1 Thess", "2 Thessalonians", "2 Thess",
  "1 Timothy", "1 Tim", "2 Timothy", "2 Tim", "Titus", "Tit",
  "Philemon", "Phlm", "Hebrews", "Heb", "James", "Jas",
  "1 Peter", "1 Pet", "2 Peter", "2 Pet", "1 John", "1 Jn", "2 John", "2 Jn",
  "3 John", "3 Jn", "Jude", "Revelation", "Rev",
  
  // French names
  "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome",
  "Josué", "Juges", "Samuel", "Rois", "Chroniques",
  "Esdras", "Néhémie", "Esther", "Psaume", "Psaumes",
  "Proverbes", "Ecclésiaste", "Cantique", "Ésaïe", "Jérémie",
  "Lamentations", "Ézéchiel", "Daniel", "Osée", "Joël",
  "Abdias", "Jonas", "Michée", "Sophonie", "Aggée",
  "Zacharie", "Malachie", "Matthieu", "Marc", "Luc", "Jean",
  "Actes", "Romains", "Corinthiens", "Galates", "Éphésiens",
  "Philippiens", "Colossiens", "Thessaloniciens", "Timothée",
  "Tite", "Philémon", "Hébreux", "Jacques", "Pierre", "Jude",
  "Apocalypse"
];

// Create regex pattern for Bible references
// Matches patterns like: "John 3:16", "Romans 8:28-30", "1 Corinthians 13:4-7"
const createBibleReferencePattern = () => {
  const bookPattern = BIBLE_BOOKS.map(book => book.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return new RegExp(
    `\\b(${bookPattern})\\s+(\\d+):(\\d+)(?:-(\\d+))?(?:\\s*,\\s*(\\d+):(\\d+)(?:-(\\d+))?)*\\b`,
    'gi'
  );
};

export function parseBibleReferences(html: string): string {
  const pattern = createBibleReferencePattern();
  
  // Replace Bible references with specially marked spans
  return html.replace(pattern, (match) => {
    // Clean up the reference
    const cleanRef = match.trim();
    return `<span class="bible-ref" data-ref="${cleanRef}">${cleanRef}</span>`;
  });
}

/**
 * Enhanced version that works with React components
 * This can be used in a future iteration for more complex parsing
 */
export function wrapBibleReferences(text: string): string {
  const pattern = createBibleReferencePattern();
  return text.replace(pattern, (match) => {
    const cleanRef = match.trim();
    return `<span class="bible-ref" data-ref="${cleanRef}">${cleanRef}</span>`;
  });
}

/**
 * Extract all Bible references from HTML content
 */
export function extractBibleReferences(html: string): string[] {
  const pattern = createBibleReferencePattern();
  const matches = html.match(pattern);
  return matches ? Array.from(new Set(matches.map(m => m.trim()))) : [];
}
