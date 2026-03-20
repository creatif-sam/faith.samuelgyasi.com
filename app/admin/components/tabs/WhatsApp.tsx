import { useState } from "react";
import { Phone, Send, ExternalLink, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";

export default function WhatsApp() {
  const DEFAULT_NUM = "233244000000";
  const [num, setNum]       = useState(DEFAULT_NUM);
  const [saved, setSaved]   = useState(DEFAULT_NUM);
  const [recip, setRecip]   = useState("");
  const [msg, setMsg]       = useState("Hello Samuel, I'd like to connect.");
  const [copied, setCopied] = useState(false);

  const chatLink    = `https://wa.me/${saved.replace(/\D/g, "")}`;
  const composeLink = recip
    ? `https://wa.me/${recip.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`
    : "";

  const QUICK = [
    "Hello! I'd love to connect with you.",
    "Hi Samuel, I'm interested in your speaking services.",
    "Hi, I'd like to discuss a collaboration.",
    "Hello Samuel, I have a question about your work.",
  ];

  async function copy() {
    await navigator.clipboard.writeText(chatLink);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div className="flex justify-between items-start mb-10 pb-7 border-b border-white/[.05]">
        <div><div className={TW.pgTitle}>WhatsApp</div><p className={TW.pgSub}>Manage your WhatsApp presence</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={TW.waCard}>
          <div className="font-mono text-[10px] tracking-[.2em] uppercase text-white/50 mb-5 flex items-center gap-2"><Phone size={13} />Your WhatsApp Number</div>
          <div className={TW.field}><label className={TW.label}>Phone (with country code)</label><input className={TW.input} value={num} onChange={(e) => setNum(e.target.value)} placeholder="233XXXXXXXXX" /></div>
          <div className={cn(TW.actRow, "flex-wrap")}>
            <button className={cn(TW.btn, TW.gold, TW.sm)} onClick={() => { setSaved(num); toast.success("Number saved"); }}>Save</button>
            <button className={cn(TW.btn, TW.ghost, TW.sm)} onClick={copy}>
              {copied ? <CheckCheck size={9} /> : <Copy size={9} />}{copied ? "Copied!" : "Copy Link"}
            </button>
            <a href={chatLink} target="_blank" rel="noreferrer" className={cn(TW.btn, TW.ghost, TW.sm)} style={{ textDecoration: "none" }}>
              <ExternalLink size={9} />Open WhatsApp
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[.05]">
            <span className="block font-mono text-[9px] text-white/35 mb-1">Your chat link:</span>
            <a href={chatLink} target="_blank" rel="noreferrer" className="text-[#25d366] font-mono text-[11px] break-all">{chatLink}</a>
          </div>
        </div>

        <div className={TW.waCard}>
          <div className="font-mono text-[10px] tracking-[.2em] uppercase text-white/50 mb-5 flex items-center gap-2"><Send size={13} />Send Quick Message</div>
          <div className={TW.field}><label className={TW.label}>Recipient Number</label><input className={TW.input} value={recip} onChange={(e) => setRecip(e.target.value)} placeholder="233XXXXXXXXX" /></div>
          <div className={TW.field}><label className={TW.label}>Message</label><textarea className={cn(TW.tarea, "min-h-[90px]")} value={msg} onChange={(e) => setMsg(e.target.value)} /></div>
          <div className={cn(TW.actRow, "flex-wrap mb-3.5")}>
            {QUICK.map((q) => (
              <button key={q} className={cn(TW.btn, TW.ghost, TW.sm, "text-[9px]")} onClick={() => setMsg(q)}>{q.slice(0, 30)}...</button>
            ))}
          </div>
          {composeLink
            ? <a href={composeLink} target="_blank" rel="noreferrer" className={cn(TW.btn, TW.gold)} style={{ textDecoration: "none", display: "inline-flex" }}><Phone size={11} />Open in WhatsApp</a>
            : <button className={cn(TW.btn, TW.ghost, "opacity-35")} disabled>Enter recipient first</button>
          }
        </div>
      </div>

      <div className="mt-10">
        <div className={cn(TW.sTitle, "mb-4")}>Chat Button Preview</div>
        <div className="flex gap-4 flex-wrap items-center">
          <a href={chatLink} target="_blank" rel="noreferrer" className="bg-[#25d366] text-white px-6 py-3.5 inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[.15em]" style={{ textDecoration: "none" }}>
            <Phone size={14} />Chat on WhatsApp
          </a>
          <span className="font-mono text-[9px] text-white/25 tracking-[.1em]">Site-visible chat button</span>
        </div>
      </div>
    </>
  );
}
