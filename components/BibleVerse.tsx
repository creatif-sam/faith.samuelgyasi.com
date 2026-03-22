// components/BibleVerse.tsx
"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";

interface BibleVerseProps {
  reference: string;
  children: React.ReactNode;
}

interface VerseData {
  text: string;
  reference: string;
}

// Simple cache to avoid re-fetching the same verses
const verseCache = new Map<string, { en: string; fr: string }>();

export function BibleVerse({ reference, children }: BibleVerseProps) {
  const { lang } = useLang();
  const [verseText, setVerseText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check cache first
    const cached = verseCache.get(reference);
    if (cached) {
      setVerseText(lang === "fr" ? cached.fr : cached.en);
      return;
    }

    // Fetch verse text when hovering (lazy loading)
    if (showTooltip && !verseText && !loading) {
      fetchVerseText();
    }
  }, [showTooltip, reference, lang]);

  const fetchVerseText = async () => {
    setLoading(true);
    try {
      // Using Bible API - you can switch to another API or local database
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(reference)}?translation=${lang === "fr" ? "LSG" : "KJV"}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const text = data.text?.trim() || "Verse not found";
        
        // Update cache
        const currentCache = verseCache.get(reference) || { en: "", fr: "" };
        if (lang === "fr") {
          currentCache.fr = text;
        } else {
          currentCache.en = text;
        }
        verseCache.set(reference, currentCache);
        
        setVerseText(text);
      } else {
        setVerseText("Unable to load verse");
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      setVerseText("Unable to load verse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span
      className="bible-verse"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <span className="bible-verse-tooltip">
          {loading ? (
            <span className="bible-verse-loading">Loading...</span>
          ) : (
            <>
              <span className="bible-verse-text">{verseText}</span>
              <span className="bible-verse-ref">— {reference}</span>
            </>
          )}
        </span>
      )}
    </span>
  );
}
