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
      if (verseCache[reference]) {
        const text = lang === "fr" ? verseCache[reference].fr : verseCache[reference].en;
        setTooltipData(prev => ({ ...prev, text }));
        return;
      }

      // Fetch verse
      try {
        const translation = lang === "fr" ? "LSG" : "KJV";
        const response = await fetch(
          `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.text?.trim().replace(/\s+/g, ' ') || "Verse not found";

          // Update cache
          if (!verseCache[reference]) {
            verseCache[reference] = { en: "", fr: "" };
          }
          verseCache[reference][lang === "fr" ? "fr" : "en"] = text;

          setTooltipData(prev => ({ ...prev, text }));
        } else {
          setTooltipData(prev => ({ ...prev, text: "Unable to load verse" }));
        }
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

    const container = contentRef.current;
    container.addEventListener("mouseenter", handleMouseEnter, true);
    container.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter, true);
      container.removeEventListener("mouseleave", handleMouseLeave, true);
    };
  }, [lang]);

  // Parse content and wrap Bible references
  const enhancedContent = enhanceBibleReferences(content);

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

// Bible book patterns
const BIBLE_BOOKS = [
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
  "Matthew", "Matt", "Mt", "Mark", "Mk", "Luke", "Lk", "John", "Jn",
  "Acts", "Romans", "Rom", "1 Corinthians", "1 Cor", "2 Corinthians", "2 Cor",
  "Galatians", "Gal", "Ephesians", "Eph", "Philippians", "Phil",
  "Colossians", "Col", "1 Thessalonians", "1 Thess", "2 Thessalonians", "2 Thess",
  "1 Timothy", "1 Tim", "2 Timothy", "2 Tim", "Titus", "Tit",
  "Philemon", "Phlm", "Hebrews", "Heb", "James", "Jas",
  "1 Peter", "1 Pet", "2 Peter", "2 Pet", "1 John", "1 Jn", "2 John", "2 Jn",
  "3 John", "3 Jn", "Jude", "Revelation", "Rev",
  "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome",
  "Josué", "Juges", "Samuel", "Rois", "Chroniques",
  "Esdras", "Néhémie", "Psaume", "Psaumes",
  "Proverbes", "Ecclésiaste", "Cantique", "Ésaïe", "Jérémie",
  "Ézéchiel", "Osée", "Joël", "Abdias", "Jonas", "Michée",
  "Sophonie", "Aggée", "Zacharie", "Malachie",
  "Matthieu", "Marc", "Luc", "Jean", "Actes", "Romains",
  "Corinthiens", "Galates", "Éphésiens", "Philippiens",
  "Colossiens", "Thessaloniciens", "Timothée", "Tite",
  "Philémon", "Hébreux", "Jacques", "Pierre", "Apocalypse"
];

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
