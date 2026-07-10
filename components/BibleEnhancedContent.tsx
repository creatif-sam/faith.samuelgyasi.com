// components/BibleEnhancedContent.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

interface BibleEnhancedContentProps {
  content: string;
}

interface VerseCache {
  [key: string]: { en: string; fr: string };
}

const verseCache: VerseCache = {};

export function BibleEnhancedContent({ content }: BibleEnhancedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const [tooltipData, setTooltipData] = useState<{
    text: string;
    ref: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ text: "", ref: "", x: 0, y: 0, visible: false });

  useEffect(() => {
    if (!contentRef.current) return;

    const handleMouseEnter = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains("bible-ref")) return;

      const reference = target.getAttribute("data-ref");
      if (!reference) return;

      const rect = target.getBoundingClientRect();
      setTooltipData({
        text: "Loading...",
        ref: reference,
        x: rect.left + rect.width / 2,
        y: rect.top,
        visible: true,
      });

      // Check cache
      if (verseCache[reference]?.[lang]) {
        setTooltipData(prev => ({ ...prev, text: verseCache[reference][lang] }));
        return;
      }

      // Fetch verse
      try {
        const text = await fetchVerseText(reference, lang);

        // Update cache
        if (!verseCache[reference]) {
          verseCache[reference] = { en: "", fr: "" };
        }
        verseCache[reference][lang] = text;

        setTooltipData(prev => ({ ...prev, text }));
      } catch (error) {
        console.error("Error fetching verse:", error);
        setTooltipData(prev => ({ ...prev, text: "Unable to load verse" }));
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("bible-ref")) {
        setTooltipData(prev => ({ ...prev, visible: false }));
      }
    };

    // Touch devices simulate a "mouseenter" on tap but never fire "mouseleave"
    // (there's no real hover), so the tooltip would otherwise stay open until
    // some other hover event happens to land elsewhere. Close it on the next
    // tap anywhere outside the reference, and on scroll (its position is
    // computed once from the reference's rect, so it'd go stale anyway).
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("bible-ref")) return;
      setTooltipData(prev => (prev.visible ? { ...prev, visible: false } : prev));
    };

    const handleScroll = () => {
      setTooltipData(prev => (prev.visible ? { ...prev, visible: false } : prev));
    };

    const container = contentRef.current;
    container.addEventListener("mouseenter", handleMouseEnter, true);
    container.addEventListener("mouseleave", handleMouseLeave, true);
    document.addEventListener("touchstart", handlePointerDown, true);
    document.addEventListener("mousedown", handlePointerDown, true);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter, true);
      container.removeEventListener("mouseleave", handleMouseLeave, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
      document.removeEventListener("mousedown", handlePointerDown, true);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [lang]);

  // Parse content and wrap Bible references
  const enhancedContent = enhanceBibleReferences(stripDocumentBoilerplate(content));

  return (
    <>
      <div
        ref={contentRef}
        className="fa-body bible-enhanced"
        dangerouslySetInnerHTML={{ __html: enhancedContent }}
      />
      {tooltipData.visible && (
        <div
          className="bible-tooltip"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
          }}
        >
          <div className="bible-tooltip-text">{tooltipData.text}</div>
          <div className="bible-tooltip-ref">— {tooltipData.ref}</div>
        </div>
      )}
    </>
  );
}

// Some posts were pasted in as full standalone HTML documents (meta/title/link/style
// tags with hardcoded colors for a fixed light background). A <style> tag applies
// globally no matter where it's injected in the DOM, so it silently overrides the
// site's theme-aware colors for that post. Strip document-level boilerplate so only
// the actual article markup remains.
function stripDocumentBoilerplate(html: string): string {
  return html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .trim();
}

// Bible book names/abbreviations (English + French) mapped to the standard
// USFM 3-letter book codes used by the bible.helloao.org API. Ambiguous short
// French forms ("Jean", "Pierre", "Corinthiens"...) fall back to book 1 of
// that name, but the numbered forms ("1 Jean", "2 Pierre"...) are listed
// explicitly so they resolve to the correct book instead of colliding.
const BOOK_CODES: Record<string, string> = {
  // English
  "Genesis": "GEN", "Gen": "GEN", "Exodus": "EXO", "Ex": "EXO", "Exod": "EXO",
  "Leviticus": "LEV", "Lev": "LEV", "Numbers": "NUM", "Num": "NUM",
  "Deuteronomy": "DEU", "Deut": "DEU", "Dt": "DEU", "Joshua": "JOS", "Josh": "JOS",
  "Judges": "JDG", "Judg": "JDG", "Ruth": "RUT",
  "1 Samuel": "1SA", "1 Sam": "1SA", "2 Samuel": "2SA", "2 Sam": "2SA",
  "1 Kings": "1KI", "1 Kgs": "1KI", "2 Kings": "2KI", "2 Kgs": "2KI",
  "1 Chronicles": "1CH", "1 Chr": "1CH", "2 Chronicles": "2CH", "2 Chr": "2CH",
  "Ezra": "EZR", "Nehemiah": "NEH", "Neh": "NEH", "Esther": "EST", "Est": "EST", "Job": "JOB",
  "Psalm": "PSA", "Psalms": "PSA", "Ps": "PSA", "Proverbs": "PRO", "Prov": "PRO",
  "Ecclesiastes": "ECC", "Eccl": "ECC", "Song of Solomon": "SNG", "Song": "SNG",
  "Isaiah": "ISA", "Isa": "ISA", "Jeremiah": "JER", "Jer": "JER",
  "Lamentations": "LAM", "Lam": "LAM", "Ezekiel": "EZK", "Ezek": "EZK", "Daniel": "DAN", "Dan": "DAN",
  "Hosea": "HOS", "Hos": "HOS", "Joel": "JOL", "Amos": "AMO", "Obadiah": "OBA", "Obad": "OBA",
  "Jonah": "JON", "Jon": "JON", "Micah": "MIC", "Mic": "MIC", "Nahum": "NAM", "Nah": "NAM",
  "Habakkuk": "HAB", "Hab": "HAB", "Zephaniah": "ZEP", "Zeph": "ZEP", "Haggai": "HAG", "Hag": "HAG",
  "Zechariah": "ZEC", "Zech": "ZEC", "Malachi": "MAL", "Mal": "MAL",
  "Matthew": "MAT", "Matt": "MAT", "Mt": "MAT", "Mark": "MRK", "Mk": "MRK",
  "Luke": "LUK", "Lk": "LUK", "John": "JHN", "Jn": "JHN", "Acts": "ACT", "Romans": "ROM", "Rom": "ROM",
  "1 Corinthians": "1CO", "1 Cor": "1CO", "2 Corinthians": "2CO", "2 Cor": "2CO",
  "Galatians": "GAL", "Gal": "GAL", "Ephesians": "EPH", "Eph": "EPH",
  "Philippians": "PHP", "Phil": "PHP", "Colossians": "COL", "Col": "COL",
  "1 Thessalonians": "1TH", "1 Thess": "1TH", "2 Thessalonians": "2TH", "2 Thess": "2TH",
  "1 Timothy": "1TI", "1 Tim": "1TI", "2 Timothy": "2TI", "2 Tim": "2TI",
  "Titus": "TIT", "Tit": "TIT", "Philemon": "PHM", "Phlm": "PHM",
  "Hebrews": "HEB", "Heb": "HEB", "James": "JAS", "Jas": "JAS",
  "1 Peter": "1PE", "1 Pet": "1PE", "2 Peter": "2PE", "2 Pet": "2PE",
  "1 John": "1JN", "1 Jn": "1JN", "2 John": "2JN", "2 Jn": "2JN", "3 John": "3JN", "3 Jn": "3JN",
  "Jude": "JUD", "Revelation": "REV", "Rev": "REV",
  // French
  "Genèse": "GEN", "Exode": "EXO", "Lévitique": "LEV", "Nombres": "NUM", "Deutéronome": "DEU",
  "Josué": "JOS", "Juges": "JDG", "Samuel": "1SA",
  "1 Rois": "1KI", "2 Rois": "2KI", "Rois": "1KI",
  "1 Chroniques": "1CH", "2 Chroniques": "2CH", "Chroniques": "1CH",
  "Esdras": "EZR", "Néhémie": "NEH", "Psaume": "PSA", "Psaumes": "PSA",
  "Proverbes": "PRO", "Ecclésiaste": "ECC", "Cantique": "SNG", "Ésaïe": "ISA", "Jérémie": "JER",
  "Ézéchiel": "EZK", "Osée": "HOS", "Joël": "JOL", "Abdias": "OBA", "Jonas": "JON", "Michée": "MIC",
  "Sophonie": "ZEP", "Aggée": "HAG", "Zacharie": "ZEC", "Malachie": "MAL",
  "Matthieu": "MAT", "Marc": "MRK", "Luc": "LUK", "Jean": "JHN", "Actes": "ACT", "Romains": "ROM",
  "1 Corinthiens": "1CO", "2 Corinthiens": "2CO", "Corinthiens": "1CO",
  "Galates": "GAL", "Éphésiens": "EPH", "Philippiens": "PHP",
  "Colossiens": "COL",
  "1 Thessaloniciens": "1TH", "2 Thessaloniciens": "2TH", "Thessaloniciens": "1TH",
  "1 Timothée": "1TI", "2 Timothée": "2TI", "Timothée": "1TI",
  "Tite": "TIT", "Philémon": "PHM", "Hébreux": "HEB", "Jacques": "JAS",
  "1 Pierre": "1PE", "2 Pierre": "2PE", "Pierre": "1PE",
  "1 Jean": "1JN", "2 Jean": "2JN", "3 Jean": "3JN",
  "Apocalypse": "REV",
};

const BOOK_CODES_LC: Record<string, string> = Object.fromEntries(
  Object.entries(BOOK_CODES).map(([name, code]) => [name.toLowerCase(), code])
);

const BIBLE_BOOKS = Object.keys(BOOK_CODES);

function enhanceBibleReferences(html: string): string {
  const bookPattern = BIBLE_BOOKS.map(book =>
    book.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  ).join("|");

  // Match Bible references: Book Chapter:Verse or Book Chapter:Verse-Verse
  const pattern = new RegExp(
    `(?<!<[^>]*)(\\b(?:${bookPattern})\\s+\\d+:\\d+(?:-\\d+)?(?:\\s*,\\s*\\d+(?::\\d+)?(?:-\\d+)?)*\\b)`,
    "gi"
  );

  return html.replace(pattern, (match) => {
    const cleanRef = match.trim();
    return `<span class="bible-ref" data-ref="${cleanRef}">${cleanRef}</span>`;
  });
}

// ── Verse lookup ──────────────────────────────────────────────────────────
// bible-api.com (the previous source) has no French translation at all —
// "LSG" silently 404s — so every French tooltip failed. bible.helloao.org
// hosts both eng_kjv and fra_lsg (Louis Segond 1910) from the same API shape,
// with open CORS, so both languages now go through one reliable source.

const TRANSLATION_ID: Record<"en" | "fr", string> = { en: "eng_kjv", fr: "fra_lsg" };

const chapterCache: Record<string, Promise<Map<number, string>>> = {};

interface ReferenceParts {
  book: string;
  parts: { chapter: number; verses: number[] }[];
}

function parseReference(ref: string): ReferenceParts | null {
  const m = ref.match(/^(.+?)\s+(\d+:\d+(?:-\d+)?(?:\s*,\s*\d+(?::\d+)?(?:-\d+)?)*)$/);
  if (!m) return null;
  const book = m[1].trim();
  const segments = m[2].split(",").map((s) => s.trim());

  let currentChapter: number | null = null;
  const parts: { chapter: number; verses: number[] }[] = [];

  for (const seg of segments) {
    const withChapter = seg.match(/^(\d+):(\d+)(?:-(\d+))?$/);
    const withoutChapter = seg.match(/^(\d+)(?:-(\d+))?$/);

    if (withChapter) {
      const chapter = parseInt(withChapter[1], 10);
      const start = parseInt(withChapter[2], 10);
      const end = withChapter[3] ? parseInt(withChapter[3], 10) : start;
      currentChapter = chapter;
      const verses: number[] = [];
      for (let v = start; v <= end; v++) verses.push(v);
      parts.push({ chapter, verses });
    } else if (withoutChapter && currentChapter !== null) {
      const start = parseInt(withoutChapter[1], 10);
      const end = withoutChapter[2] ? parseInt(withoutChapter[2], 10) : start;
      const verses: number[] = [];
      for (let v = start; v <= end; v++) verses.push(v);
      parts.push({ chapter: currentChapter, verses });
    }
  }

  if (parts.length === 0) return null;
  return { book, parts };
}

// Verse content items come back either as a plain string or as an object
// with a `text` field (plus flags like `poem`/`wordsOfJesus`/`lineBreak`/
// `noteId` that carry no displayable text of their own).
function extractText(content: unknown[]): string {
  const pieces: string[] = [];
  for (const item of content) {
    if (typeof item === "string") {
      pieces.push(item);
    } else if (item && typeof item === "object" && typeof (item as { text?: unknown }).text === "string") {
      pieces.push((item as { text: string }).text);
    }
  }
  return pieces.join(" ").replace(/^¶\s*/, "").replace(/\s+/g, " ").trim();
}

function getChapterVerses(translationId: string, bookCode: string, chapter: number): Promise<Map<number, string>> {
  const key = `${translationId}/${bookCode}/${chapter}`;
  if (!chapterCache[key]) {
    chapterCache[key] = fetch(`https://bible.helloao.org/api/${translationId}/${bookCode}/${chapter}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Chapter fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const verses = new Map<number, string>();
        const content: { type?: string; number?: number; content?: unknown[] }[] = data?.chapter?.content ?? [];
        for (const item of content) {
          if (item.type === "verse" && typeof item.number === "number") {
            verses.set(item.number, extractText(item.content ?? []));
          }
        }
        return verses;
      })
      .catch((err) => {
        delete chapterCache[key];
        throw err;
      });
  }
  return chapterCache[key];
}

async function fetchVerseText(reference: string, lang: "en" | "fr"): Promise<string> {
  const parsed = parseReference(reference);
  if (!parsed) throw new Error(`Unrecognized reference: ${reference}`);

  const bookCode = BOOK_CODES_LC[parsed.book.toLowerCase()];
  if (!bookCode) throw new Error(`Unknown book: ${parsed.book}`);

  const translationId = TRANSLATION_ID[lang];
  const pieces: string[] = [];

  for (const part of parsed.parts) {
    const verses = await getChapterVerses(translationId, bookCode, part.chapter);
    for (const v of part.verses) {
      const text = verses.get(v);
      if (text) pieces.push(text);
    }
  }

  if (pieces.length === 0) throw new Error(`Verse not found: ${reference}`);
  return pieces.join(" ");
}
