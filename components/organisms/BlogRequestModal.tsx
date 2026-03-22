"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { X, Sparkles } from "lucide-react";

interface BlogRequestModalProps {
  onClose: () => void;
  lang: "en" | "fr";
}

export function BlogRequestModal({ onClose, lang }: BlogRequestModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !topic.trim()) {
      toast.error(lang === "en" ? "Name, email, and topic are required" : "Le nom, l'email et le sujet sont requis");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error(lang === "en" ? "Please enter a valid email address" : "Veuillez entrer une adresse email valide");
      return;
    }

    setSubmitting(true);
    const db = createClient();

    const messageContent = details.trim() 
      ? `Blog Topic Request: ${topic.trim()}\n\nAdditional Details:\n${details.trim()}`
      : `Blog Topic Request: ${topic.trim()}`;

    const { error } = await db.from("messages").insert([{
      name: name.trim(),
      email: email.trim(),
      subject: `Blog Request: ${topic.trim()}`,
      message: messageContent,
      read: false,
    }]);

    setSubmitting(false);

    if (error) {
      toast.error(lang === "en" ? "Submission failed. Please try again." : "Échec de la soumission. Veuillez réessayer.");
      console.error(error);
      return;
    }

    toast.success(lang === "en" ? "Blog request submitted successfully! We'll get back to you soon." : "Demande de blog soumise avec succès! Nous vous répondrons bientôt.");
    onClose();
  };

  const t = {
    title: { en: "Request a Custom Blog Topic", fr: "Demander un Sujet de Blog Personnalisé" },
    subtitle: { en: "Can't find what you're looking for? Share your interests and we'll create content for you!", fr: "Vous ne trouvez pas ce que vous cherchez? Partagez vos intérêts et nous créerons du contenu pour vous!" },
    name: { en: "Your Name *", fr: "Votre Nom *" },
    email: { en: "Email Address *", fr: "Adresse Email *" },
    topic: { en: "Blog Topic *", fr: "Sujet du Blog *" },
    topicPlaceholder: { en: "e.g., Prayer and Fasting, Living with Purpose, Faith in Difficult Times", fr: "ex: Prière et Jeûne, Vivre avec un But, La Foi dans les Temps Difficiles" },
    details: { en: "Additional Details (optional)", fr: "Détails Supplémentaires (optionnel)" },
    detailsPlaceholder: { en: "Tell us more about what you'd like to learn or any specific questions you have...", fr: "Dites-nous en plus sur ce que vous aimeriez apprendre ou sur les questions spécifiques que vous avez..." },
    submit: { en: "Submit Request", fr: "Soumettre la Demande" },
    submitting: { en: "Submitting...", fr: "Soumission..." },
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-5" onClick={onClose}>
      <div 
        className="bg-[#0a0a0d] border border-[#d4a843]/20 rounded-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,.7),0_0_0_1px_rgba(212,168,67,.15)]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-7 border-b border-white/[.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-[#d4a843]" />
              <h2 className="font-playfair text-[24px] font-bold text-[#eef0f5]">{t.title[lang]}</h2>
            </div>
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

          <div>
            <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.email[lang]}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]"
              placeholder={lang === "en" ? "your@email.com" : "votre@email.com"}
              required
            />
          </div>

          <div>
            <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.topic[lang]}</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)]"
              placeholder={t.topicPlaceholder[lang]}
              required
            />
          </div>

          <div>
            <label className="block font-poppins text-[11px] font-medium text-white/50 mb-2">{t.details[lang]}</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-white/[.04] border border-white/[.09] rounded-lg text-[#eef0f5] font-poppins text-sm px-4 py-3 outline-none transition-all focus:border-[rgba(212,168,67,.5)] focus:bg-white/[.06] focus:shadow-[0_0_0_3px_rgba(212,168,67,.08)] resize-y min-h-[100px]"
              placeholder={t.detailsPlaceholder[lang]}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#d4a843] to-[#b8922e] text-[#080807] font-poppins text-sm font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-[0_8px_24px_rgba(212,168,67,.35)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? t.submitting[lang] : t.submit[lang]}
          </button>
        </form>
      </div>
    </div>
  );
}
