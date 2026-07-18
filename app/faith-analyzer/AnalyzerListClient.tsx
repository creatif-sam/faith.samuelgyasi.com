"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { Suspense } from "react";
import { ClipboardCheck, TrendingUp, Users, ArrowRight } from "lucide-react";

type FaithTest = {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description_en: string | null;
  description_fr: string | null;
  total_takes: number;
  published: boolean;
  sort_order: number;
};

export default function AnalyzerListClient({ initialTests }: { initialTests: FaithTest[] }) {
  const { lang } = useLang();
  const [tests, setTests] = useState<FaithTest[]>(initialTests);

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("faith_tests")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTests(data as FaithTest[]);
      });
  }, []);

  const getName = (test: FaithTest) => lang === "fr" ? test.name_fr : test.name_en;
  const getDescription = (test: FaithTest) => lang === "fr" ? test.description_fr : test.description_en;

  const heroStyles = `
    min-h-[60vh] flex flex-col items-center justify-center
    bg-gradient-to-br from-[#09090d] via-[#0e0f16] to-[#09090d]
    relative overflow-hidden px-5 py-20
  `;

  const cardStyles = `
    bg-[#0b0c12] border border-white/[.08] rounded-xl p-8
    hover:border-[rgba(212,168,67,.3)] hover:shadow-[0_8px_30px_rgba(212,168,67,.15)]
    transition-all duration-300 group cursor-pointer
  `;

  const headingStyles = `
    font-poppins text-[42px] md:text-[54px] font-bold
    bg-gradient-to-br from-[#f0ece4] via-[#546cfa] to-[#f0ece4]
    bg-clip-text text-transparent leading-tight text-center mb-5
  `;

  return (
    <>
      {/* Hero Section */}
      <div className={heroStyles}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#546cfa] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#546cfa] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto">
          <Breadcrumbs
            items={[
              { label: lang === "fr" ? "Accueil" : "Home", href: localizedHref(lang, "/") },
              { label: lang === "fr" ? "Analyseur de Foi" : "Faith Analyzer" },
            ]}
          />

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#546cfa] to-[#546cfa] flex items-center justify-center shadow-[0_8px_30px_rgba(212,168,67,.4)]">
              <ClipboardCheck size={40} className="text-[#09090d]" />
            </div>
          </div>

          <h1 className={headingStyles}>
            {lang === "fr" ? "Analyseur de Foi" : "Faith Analyzer"}
          </h1>

          <p className="font-poppins text-[17px] text-white/60 leading-relaxed text-center max-w-[700px] mx-auto mb-8">
            {lang === "fr"
              ? "Évaluez votre foi à travers des tests bibliques conçus pour vous aider à grandir spirituellement. Chaque test comprend 10-12 questions basées sur les Écritures."
              : "Assess your faith through biblical tests designed to help you grow spiritually. Each test includes 10-12 questions based on Scripture."}
          </p>

          <div className="flex items-center justify-center gap-8 text-[15px] text-white/50 font-poppins">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-[#546cfa]" />
              <span>{tests.length} {lang === "fr" ? "Tests" : "Tests"}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#546cfa]" />
              <span>{lang === "fr" ? "Croissance spirituelle" : "Spiritual Growth"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#546cfa]" />
              <span>{lang === "fr" ? "Anonyme" : "Anonymous"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        {tests.length === 0 ? (
          <p className="text-center text-white/40 font-poppins text-[16px] py-20">
            {lang === "fr" ? "Aucun test disponible pour le moment." : "No tests available at the moment."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
              <Link href={localizedHref(lang, `/faith-analyzer/${test.slug}`)} key={test.id} className="no-underline">
                <div className={cardStyles}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#546cfa]/20 to-[#546cfa]/10 flex items-center justify-center flex-shrink-0 border border-[#546cfa]/20 group-hover:border-[#546cfa]/40 transition-all">
                      <ClipboardCheck size={24} className="text-[#546cfa]" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-poppins text-[22px] font-semibold text-[#f0ece4] mb-2 group-hover:text-[#546cfa] transition-colors">
                        {getName(test)}
                      </h3>

                      {getDescription(test) && (
                        <p className="font-poppins text-[14px] text-white/60 leading-relaxed mb-4">
                          {getDescription(test)}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[12px] font-poppins text-white/40">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} />
                          <span>{test.total_takes} {lang === "fr" ? "tentatives" : "attempts"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClipboardCheck size={14} />
                          <span>10-12 {lang === "fr" ? "questions" : "questions"}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className="inline-flex items-center gap-2 text-[#546cfa] font-poppins text-[13px] font-medium group-hover:gap-3 transition-all">
                          {lang === "fr" ? "Commencer le test" : "Take Test"}
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Biblical Foundation */}
        <div className="mt-20 p-8 bg-[rgba(212,168,67,.05)] border border-[rgba(212,168,67,.15)] rounded-xl">
          <h3 className="font-poppins text-[20px] font-semibold text-[#546cfa] mb-4">
            {lang === "fr" ? "Fondement Biblique" : "Biblical Foundation"}
          </h3>
          <p className="font-poppins text-[15px] text-white/70 leading-relaxed mb-3">
            <em>
              {lang === "fr"
                ? "« Examinez-vous vous-mêmes pour savoir si vous êtes dans la foi, éprouvez-vous vous-mêmes. » — 2 Corinthiens 13:5"
                : "\"Examine yourselves to see whether you are in the faith; test yourselves.\" — 2 Corinthians 13:5"}
            </em>
          </p>
          <p className="font-poppins text-[14px] text-white/60 leading-relaxed">
            {lang === "fr"
              ? "Ces tests sont conçus pour vous aider à réfléchir sur votre marche spirituelle. Basés sur le principe de 2-3 témoins (Matthieu 18:16), un résultat indiquant 2+ domaines nécessitant une attention suggère des opportunités de croissance."
              : "These tests are designed to help you reflect on your spiritual walk. Based on the principle of 2-3 witnesses (Matthew 18:16), a result indicating 2+ areas needing attention suggests opportunities for growth."}
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </>
  );
}
