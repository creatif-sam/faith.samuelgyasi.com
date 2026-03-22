"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { X } from "lucide-react";

interface PrayerModalProps {
  onClose: () => void;
  lang: "en" | "fr";
}

export function PrayerModal({ onClose, lang }: PrayerModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !topic.trim()) {
      toast.error(lang === "en" ? "Name and prayer topic are required" : "Le nom et le sujet de prière sont requis");
      return;
    }

    setSubmitting(true);
    const db = createClient();

    const { error } = await db.from("prayer_submissions").insert([{
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      prayer_topic: topic.trim(),
      details: details.trim() || null,
      is_urgent: isUrgent,
    }]);

    setSubmitting(false);

    if (error) {
      toast.error(lang === "en" ? "Submission failed. Please try again." : "Échec de la soumission  Veuillez réessayer.");
      console.error(error);
      return;
    }

    toast.success(lang === "en" ? "Prayer request submitted successfully!" : "Demande de prière soumise avec succès!");
    onClose();
  };

  const t = {
    title: { en: "Submit a Prayer Request", fr: "Soumettre une Demande de Prière" },
    subtitle: { en: "We are honored to pray with and for you", fr: "Nous sommes honorés de prier avec et pour vous" },
    name: { en: "Your Name *", fr: "Votre Nom *" },
    email: { en: "Email (optional)", fr: "Email (optionnel)" },
    phone: { en: "Phone (optional)", fr: "Téléphone (optionnel)" },
    topic: { en: "Prayer Topic *", fr: "Sujet de Prière *" },
    details: { en: "Details (optional)", fr: "Détails (optionnels)" },
    urgent: { en: "Mark as urgent", fr: "Marquer comme urgent" },
    submit: { en: "Submit Prayer Request", fr: "Soumettre la Demande" },
    submitting: { en: "Submitting...", fr: "Soumission..." },
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-5" onClick={onClose}>
      <div 
        className="bg-[#0a0a0d] border border-[#d4a843]/20 rounded-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(212,168,67,.15)]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-7 border-b border-white/[.06]">
          <div>
            <h2 className="font-playfair text-[24px] font-bold text-[#eef0f5]">{t.title[lang]}</h2>
            <p className="font-poppins text-[12px] text-white/50 mt-1">{t.subtitle[lang]}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div>
            <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.name[lang]}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]"
              placeholder={lang === "en" ? "Enter your name" : "Entrez votre nom"}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.email[lang]}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]"
                placeholder={lang === "en" ? "your@email.com" : "votre@email.com"}
              />
            </div>

            <div>
              <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.phone[lang]}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]"
                placeholder={lang === "en" ? "Your phone" : "Votre téléphone"}
              />
            </div>
          </div>

          <div>
            <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.topic[lang]}</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]"
              placeholder={lang === "en" ? "e.g., Healing, Guidance, Breakthrough" : "ex: Guérison, Direction, Percée"}
              required
            />
          </div>

          <div>
            <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.details[lang]}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)] resize-y min-h-[120px]"
              placeholder={lang === "en" ? "Share details about your prayer request (optional)" : "Partagez les détails de votre demande de prière (optionnel)"}
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-5 h-5 rounded border border-white/20 bg-white/5 checked:bg-[#d4a843] checked:border-[#d4a843] cursor-pointer"
              />
              <span className="font-poppins text-[13px] text-white/70">{t.urgent[lang]}</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-5 border-t border-white/[.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-poppins text-[11px] font-medium text-white/50 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/[.09] hover:text-white/85 hover:border-white/[.18]"
            >
              {lang === "en" ? "Cancel" : "Annuler"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 font-poppins text-[11px] font-medium bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] rounded-lg cursor-pointer transition-all shadow-[0_2px_12px_rgba(212,168,67,.25)] hover:from-[#e0b84e] hover:to-[#d4a843] hover:shadow-[0_4px_18px_rgba(212,168,67,.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? t.submitting[lang] : t.submit[lang]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
