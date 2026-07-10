import { useRef, useState } from "react";
import { Bold, Italic, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { BibleEnhancedContent } from "@/components/BibleEnhancedContent";
import { articleCss } from "@/app/blog/articleStyles";

interface BlogContentBuilderProps {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
}

type BlockType = "eyebrow" | "subtitle" | "lede" | "heading" | "subheading" | "paragraph" | "verse" | "quote" | "steps" | "prayer";

const BLOCKS: { id: BlockType; label: string }[] = [
  { id: "eyebrow",    label: "Eyebrow" },
  { id: "subtitle",   label: "Subtitle" },
  { id: "lede",       label: "Lede" },
  { id: "heading",    label: "Heading" },
  { id: "subheading", label: "Sub-heading" },
  { id: "paragraph",  label: "Paragraph" },
  { id: "verse",      label: "Bible Verse" },
  { id: "quote",      label: "Quote" },
  { id: "steps",      label: "Steps List" },
  { id: "prayer",     label: "Prayer Box" },
];

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function FormatToolbar({ taRef, text, setText }: {
  taRef: React.RefObject<HTMLTextAreaElement | null>;
  text: string;
  setText: (v: string) => void;
}) {
  function wrap(tag: string) {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (start === end) return;
    const next = `${text.slice(0, start)}<${tag}>${text.slice(start, end)}</${tag}>${text.slice(end)}`;
    setText(next);
    requestAnimationFrame(() => el.focus());
  }
  return (
    <div className="flex gap-1.5 mb-2">
      <button type="button" className={cn(TW.iconBtn, "!p-1.5")} title="Bold selection" onClick={() => wrap("strong")}><Bold size={12} /></button>
      <button type="button" className={cn(TW.iconBtn, "!p-1.5")} title="Italicize selection" onClick={() => wrap("em")}><Italic size={12} /></button>
    </div>
  );
}

export default function BlogContentBuilder({ value, onChange, label, placeholder }: BlogContentBuilderProps) {
  const [openBlock, setOpenBlock] = useState<BlockType | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [eyebrowText, setEyebrowText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [ledeText, setLedeText] = useState("");
  const [headingText, setHeadingText] = useState("");
  const [subheadingText, setSubheadingText] = useState("");
  const [paragraphText, setParagraphText] = useState("");
  const [verseQuote, setVerseQuote] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [verseTranslation, setVerseTranslation] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [stepsHeading, setStepsHeading] = useState("Application");
  const [steps, setSteps] = useState<string[]>([""]);
  const [prayerLabel, setPrayerLabel] = useState("Closing Prayer");
  const [prayerText, setPrayerText] = useState("");

  const ledeRef = useRef<HTMLTextAreaElement>(null);
  const paragraphRef = useRef<HTMLTextAreaElement>(null);
  const quoteRef = useRef<HTMLTextAreaElement>(null);
  const prayerRef = useRef<HTMLTextAreaElement>(null);

  function appendHtml(html: string) {
    const trimmed = value.trim();
    onChange(trimmed ? `${trimmed}\n\n${html}` : html);
  }

  function insert() {
    switch (openBlock) {
      case "eyebrow":
        if (!eyebrowText.trim()) return;
        appendHtml(`<div class="eyebrow">${escapeHtml(eyebrowText.trim())}</div>`);
        setEyebrowText("");
        break;
      case "subtitle":
        if (!subtitleText.trim()) return;
        appendHtml(`<div class="subtitle">${escapeHtml(subtitleText.trim())}</div>`);
        setSubtitleText("");
        break;
      case "lede":
        if (!ledeText.trim()) return;
        appendHtml(`<p class="lede">${ledeText.trim()}</p>`);
        setLedeText("");
        break;
      case "heading":
        if (!headingText.trim()) return;
        appendHtml(`<h2>${escapeHtml(headingText.trim())}</h2>`);
        setHeadingText("");
        break;
      case "subheading":
        if (!subheadingText.trim()) return;
        appendHtml(`<h3>${escapeHtml(subheadingText.trim())}</h3>`);
        setSubheadingText("");
        break;
      case "paragraph":
        if (!paragraphText.trim()) return;
        appendHtml(`<p>${paragraphText.trim()}</p>`);
        setParagraphText("");
        break;
      case "verse": {
        if (!verseQuote.trim() || !verseRef.trim()) return;
        const suffix = verseTranslation.trim() ? `, ${escapeHtml(verseTranslation.trim())}` : "";
        appendHtml(
          `<div class="verse-block"><p>“${escapeHtml(verseQuote.trim())}”</p><span><span class="bible-ref" data-ref="${escapeHtml(verseRef.trim())}">${escapeHtml(verseRef.trim())}</span>${suffix}</span></div>`
        );
        setVerseQuote(""); setVerseRef(""); setVerseTranslation("");
        break;
      }
      case "quote":
        if (!quoteText.trim()) return;
        appendHtml(`<blockquote>${quoteText.trim()}</blockquote>`);
        setQuoteText("");
        break;
      case "steps": {
        const clean = steps.map((s) => s.trim()).filter(Boolean);
        if (clean.length === 0) return;
        const heading = stepsHeading.trim() ? `<h2>${escapeHtml(stepsHeading.trim())}</h2>` : "";
        const items = clean.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
        appendHtml(`${heading}<ol class="application">${items}</ol>`);
        setSteps([""]);
        break;
      }
      case "prayer":
        if (!prayerText.trim()) return;
        appendHtml(`<div class="prayer"><div class="label">${escapeHtml(prayerLabel.trim() || "Closing Prayer")}</div><p>${prayerText.trim()}</p></div>`);
        setPrayerText("");
        break;
    }
    setOpenBlock(null);
  }

  return (
    <div className={TW.field}>
      <div className="flex justify-between items-center mb-2">
        <label className={cn(TW.label, "!mb-0")}>{label}</label>
        <button type="button" className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? <EyeOff size={11} /> : <Eye size={11} />} {showPreview ? "Hide preview" : "Preview"}
        </button>
      </div>

      <p className="font-poppins text-[10px] text-white/35 mb-2.5">
        Build the article with blocks below — no HTML needed. Or skip straight to the raw HTML box further down if you prefer to write it yourself.
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {BLOCKS.map((b) => (
          <button
            key={b.id}
            type="button"
            className={cn(TW.chip, openBlock === b.id && TW.chipAct)}
            onClick={() => setOpenBlock(openBlock === b.id ? null : b.id)}
          >
            + {b.label}
          </button>
        ))}
      </div>

      {openBlock && (
        <div className="bg-white/[.03] border border-white/[.08] rounded-lg p-4 mb-3">
          {openBlock === "eyebrow" && (
            <input className={TW.input} autoFocus value={eyebrowText} onChange={(e) => setEyebrowText(e.target.value)} placeholder="e.g. A Reflection on Sonship" />
          )}
          {openBlock === "subtitle" && (
            <input className={TW.input} autoFocus value={subtitleText} onChange={(e) => setSubtitleText(e.target.value)} placeholder="e.g. On trading fear for adoption" />
          )}
          {openBlock === "lede" && (
            <>
              <FormatToolbar taRef={ledeRef} text={ledeText} setText={setLedeText} />
              <textarea ref={ledeRef} className={cn(TW.tarea, "min-h-[90px]")} autoFocus value={ledeText} onChange={(e) => setLedeText(e.target.value)} placeholder="Opening hook paragraph…" />
            </>
          )}
          {openBlock === "heading" && (
            <input className={TW.input} autoFocus value={headingText} onChange={(e) => setHeadingText(e.target.value)} placeholder="Section heading" />
          )}
          {openBlock === "subheading" && (
            <input className={TW.input} autoFocus value={subheadingText} onChange={(e) => setSubheadingText(e.target.value)} placeholder="Sub-heading" />
          )}
          {openBlock === "paragraph" && (
            <>
              <FormatToolbar taRef={paragraphRef} text={paragraphText} setText={setParagraphText} />
              <textarea ref={paragraphRef} className={cn(TW.tarea, "min-h-[110px]")} autoFocus value={paragraphText} onChange={(e) => setParagraphText(e.target.value)} placeholder="Select text and use Bold/Italic above to format." />
            </>
          )}
          {openBlock === "verse" && (
            <div className="flex flex-col gap-3">
              <textarea className={cn(TW.tarea, "min-h-[80px]")} autoFocus value={verseQuote} onChange={(e) => setVerseQuote(e.target.value)} placeholder="Verse text…" />
              <div className={TW.fRow}>
                <input className={TW.input} value={verseRef} onChange={(e) => setVerseRef(e.target.value)} placeholder="Reference, e.g. Romans 8:15" />
                <input className={TW.input} value={verseTranslation} onChange={(e) => setVerseTranslation(e.target.value)} placeholder="Translation, e.g. ESV (optional)" />
              </div>
            </div>
          )}
          {openBlock === "quote" && (
            <>
              <FormatToolbar taRef={quoteRef} text={quoteText} setText={setQuoteText} />
              <textarea ref={quoteRef} className={cn(TW.tarea, "min-h-[90px]")} autoFocus value={quoteText} onChange={(e) => setQuoteText(e.target.value)} placeholder="Quote text…" />
            </>
          )}
          {openBlock === "steps" && (
            <div className="flex flex-col gap-3">
              <input className={TW.input} value={stepsHeading} onChange={(e) => setStepsHeading(e.target.value)} placeholder="Section heading (optional)" />
              {steps.map((s, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <textarea
                    className={cn(TW.tarea, "min-h-[60px]")}
                    autoFocus={i === 0}
                    value={s}
                    onChange={(e) => setSteps((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))}
                    placeholder={`Step ${i + 1}…`}
                  />
                  {steps.length > 1 && (
                    <button type="button" className={cn(TW.btn, TW.ghost, TW.sm, "!px-2")} onClick={() => setSteps((prev) => prev.filter((_, idx) => idx !== i))}><X size={12} /></button>
                  )}
                </div>
              ))}
              <button type="button" className={cn(TW.btn, TW.ghost, TW.sm, "self-start")} onClick={() => setSteps((prev) => [...prev, ""])}>+ Add step</button>
            </div>
          )}
          {openBlock === "prayer" && (
            <div className="flex flex-col gap-3">
              <input className={TW.input} value={prayerLabel} onChange={(e) => setPrayerLabel(e.target.value)} placeholder="Label, e.g. Closing Prayer" />
              <FormatToolbar taRef={prayerRef} text={prayerText} setText={setPrayerText} />
              <textarea ref={prayerRef} className={cn(TW.tarea, "min-h-[90px]")} value={prayerText} onChange={(e) => setPrayerText(e.target.value)} placeholder="Prayer text…" />
            </div>
          )}

          <div className="flex gap-2 justify-end mt-3">
            <button type="button" className={cn(TW.btn, TW.ghost, TW.sm)} onClick={() => setOpenBlock(null)}>Cancel</button>
            <button type="button" className={cn(TW.btn, TW.gold, TW.sm)} onClick={insert}>Insert</button>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="rounded-lg overflow-hidden border border-white/10 mb-3">
          <style>{articleCss}</style>
          <div className="fdp" style={{ background: "var(--bg)", padding: "24px 28px" }}>
            <div className="fa-body">
              <BibleEnhancedContent content={value} />
            </div>
          </div>
        </div>
      )}

      <textarea
        className={TW.tarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "<p>Full article…</p>"}
      />
    </div>
  );
}
