"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { Suspense } from "react";
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type FaithTest = {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  description_en: string | null;
  description_fr: string | null;
  disclaimer_en: string | null;
  disclaimer_fr: string | null;
  total_takes: number;
};

type FaithTestQuestion = {
  id: string;
  test_id: string;
  question_en: string;
  question_fr: string;
  option_a_en: string;
  option_a_fr: string;
  option_b_en: string;
  option_b_fr: string;
  option_c_en: string;
  option_c_fr: string;
  correct_option: 'A' | 'B' | 'C';
  explanation_en: string | null;
  explanation_fr: string | null;
  sort_order: number;
};

export default function TestPage() {
  const { lang } = useLang();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [test, setTest] = useState<FaithTest | null>(null);
  const [questions, setQuestions] = useState<FaithTestQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C'>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("on-fdp");
    return () => document.body.classList.remove("on-fdp");
  }, []);

  useEffect(() => {
    if (!slug) return;
    
    const supabase = createClient();
    
    Promise.all([
      supabase
        .from("faith_tests")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single(),
      supabase
        .from("faith_test_questions")
        .select("*")
        .eq("test_id", "*")
        .order("sort_order", { ascending: true })
    ]).then(async ([testRes, questionsPreRes]) => {
      if (testRes.error || !testRes.data) {
        router.push("/analyzer");
        return;
      }

      setTest(testRes.data as FaithTest);

      // Now fetch questions with correct test_id
      const { data: questionsData } = await supabase
        .from("faith_test_questions")
        .select("*")
        .eq("test_id", testRes.data.id)
        .order("sort_order", { ascending: true });

      setQuestions((questionsData as FaithTestQuestion[]) ?? []);
      setLoading(false);
    });
  }, [slug, router]);

  const getName = (t: FaithTest) => lang === "fr" ? t.name_fr : t.name_en;
  const getDescription = (t: FaithTest) => lang === "fr" ? t.description_fr : t.description_en;
  const getDisclaimer = (t: FaithTest) => lang === "fr" ? t.disclaimer_fr : t.disclaimer_en;
  const getQuestion = (q: FaithTestQuestion) => lang === "fr" ? q.question_fr : q.question_en;
  const getOption = (q: FaithTestQuestion, opt: 'A' | 'B' | 'C') => {
    if (lang === "fr") {
      return opt === 'A' ? q.option_a_fr : opt === 'B' ? q.option_b_fr : q.option_c_fr;
    }
    return opt === 'A' ? q.option_a_en : opt === 'B' ? q.option_b_en : q.option_c_en;
  };
  const getExplanation = (q: FaithTestQuestion) => lang === "fr" ? q.explanation_fr : q.explanation_en;

  async function handleSubmit() {
    if (Object.keys(answers).length !== questions.length) {
      alert(lang === "fr" ? "Veuillez répondre à toutes les questions" : "Please answer all questions");
      return;
    }

    const correct = questions.filter(q => answers[q.id] === q.correct_option).length;
    
    // Save anonymous attempt
    const supabase = createClient();
    await supabase.from("faith_test_attempts").insert({
      test_id: test!.id,
      score: correct,
      total_questions: questions.length,
    });

    // Increment total_takes
    await supabase.from("faith_tests")
      .update({ total_takes: (test!.total_takes || 0) + 1 })
      .eq("id", test!.id);

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090d] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 200, 400].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-[#d4a843] rounded-full animate-pulse"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  const correct = questions.filter(q => answers[q.id] === q.correct_option).length;
  const incorrect = Object.keys(answers).length - correct;
  const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#09090d] via-[#0e0f16] to-[#09090d] px-5 py-10">
        <div className="max-w-[900px] mx-auto">
          <Breadcrumbs
            items={[
              { label: lang === "fr" ? "Accueil" : "Home", href: "/" },
              { label: lang === "fr" ? "Analyseur" : "Analyzer", href: "/analyzer" },
              { label: getName(test) },
            ]}
          />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#c49838] flex items-center justify-center shadow-[0_8px_30px_rgba(212,168,67,.4)]">
                <ClipboardCheck size={32} className="text-[#09090d]" />
              </div>
            </div>

            <h1 className="font-poppins text-[36px] md:text-[44px] font-bold text-[#f0ece4] mb-3">
              {getName(test)}
            </h1>

            {getDescription(test) && (
              <p className="font-poppins text-[15px] text-white/60 leading-relaxed max-w-[650px] mx-auto">
                {getDescription(test)}
              </p>
            )}
          </div>

          {/* Disclaimer */}
          {getDisclaimer(test) && !submitted && (
            <div className="mb-8 p-6 bg-[rgba(212,168,67,.08)] border border-[rgba(212,168,67,.2)] rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[#d4a843] flex-shrink-0 mt-0.5" />
                <p className="font-poppins text-[14px] text-white/70 leading-relaxed">
                  {getDisclaimer(test)}
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {submitted && (
            <div className="mb-10 p-8 bg-[#0b0c12] border border-white/[.08] rounded-xl">
              <h2 className="font-poppins text-[28px] font-bold text-[#f0ece4] mb-6 text-center">
                {lang === "fr" ? "Vos Résultats" : "Your Results"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 bg-[rgba(212,168,67,.1)] border border-[rgba(212,168,67,.2)] rounded-lg text-center">
                  <div className="text-[32px] font-bold text-[#d4a843] mb-1">{correct}</div>
                  <div className="text-[13px] text-white/60 font-poppins">
                    {lang === "fr" ? "Correct" : "Correct"}
                  </div>
                </div>

                <div className="p-5 bg-white/[.04] border border-white/[.1] rounded-lg text-center">
                  <div className="text-[32px] font-bold text-white/40 mb-1">{incorrect}</div>
                  <div className="text-[13px] text-white/60 font-poppins">
                    {lang === "fr" ? "Incorrect" : "Incorrect"}
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-[#d4a843]/10 to-[#c49838]/5 border border-[#d4a843]/20 rounded-lg text-center">
                  <div className="text-[32px] font-bold text-[#d4a843] mb-1">{percentage}%</div>
                  <div className="text-[13px] text-white/60 font-poppins">
                    {lang === "fr" ? "Score" : "Score"}
                  </div>
                </div>
              </div>

              {/* Biblical principle: 2-3 witnesses */}
              {incorrect >= 2 && (
                <div className="p-5 bg-[rgba(212,168,67,.05)] border-l-4 border-[#d4a843] rounded">
                  <p className="font-poppins text-[14px] text-white/70 leading-relaxed mb-2">
                    <em>
                      {lang === "fr"
                        ? "« Sur la déposition de deux ou trois témoins, une chose sera établie. » — Matthieu 18:16"
                        : "\"By the testimony of two or three witnesses, a matter shall be established.\" — Matthew 18:16"}
                    </em>
                  </p>
                  <p className="font-poppins text-[13px] text-white/60">
                    {lang === "fr"
                      ? `Avec ${incorrect} domaines nécessitant une attention, cela suggère des opportunités pour la croissance spirituelle.`
                      : `With ${incorrect} areas needing attention, this suggests opportunities for spiritual growth.`}
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-white/[.08] border border-white/[.15] text-white/80 font-poppins text-[13px] font-medium rounded-lg hover:bg-white/[.12] transition-all"
                >
                  {lang === "fr" ? "Réessayer" : "Retake Test"}
                </button>
                <Link
                  href="/analyzer"
                  className="px-6 py-2.5 bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] font-poppins text-[13px] font-medium rounded-lg hover:shadow-[0_4px_20px_rgba(212,168,67,.3)] transition-all no-underline"
                >
                  {lang === "fr" ? "Plus de Tests" : "More Tests"}
                </Link>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6 mb-10">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_option;
              const showResult = submitted;

              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-xl border transition-all ${
                    showResult
                      ? isCorrect
                        ? "bg-green-500/[.08] border-green-500/30"
                        : userAnswer
                        ? "bg-red-500/[.08] border-red-500/30"
                        : "bg-white/[.02] border-white/[.08]"
                      : "bg-[#0b0c12] border-white/[.08]"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(212,168,67,.15)] border border-[rgba(212,168,67,.3)] flex items-center justify-center flex-shrink-0 font-poppins text-[14px] font-semibold text-[#d4a843]">
                      {idx + 1}
                    </div>
                    <p className="font-poppins text-[16px] text-white/90 leading-relaxed flex-1 pt-0.5">
                      {getQuestion(q)}
                    </p>
                    {showResult && (
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle size={24} className="text-green-400" />
                        ) : userAnswer ? (
                          <XCircle size={24} className="text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {(['A', 'B', 'C'] as const).map((opt) => {
                      const isSelected = userAnswer === opt;
                      const isCorrectOption = q.correct_option === opt;
                      const showCorrect = showResult && isCorrectOption;
                      const showIncorrect = showResult && isSelected && !isCorrectOption;

                      return (
                        <button
                          key={opt}
                          onClick={() => !submitted && setAnswers({ ...answers, [q.id]: opt })}
                          disabled={submitted}
                          className={`w-full text-left p-4 rounded-lg border font-poppins text-[14px] transition-all ${
                            showCorrect
                              ? "bg-green-500/[.15] border-green-500/40 text-green-100"
                              : showIncorrect
                              ? "bg-red-500/[.15] border-red-500/40 text-red-100"
                              : isSelected
                              ? "bg-[rgba(212,168,67,.15)] border-[rgba(212,168,67,.4)] text-white/95"
                              : "bg-white/[.03] border-white/[.1] text-white/70 hover:bg-white/[.06] hover:border-white/[.15]"
                          } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-semibold text-[13px] ${
                              showCorrect
                                ? "border-green-400 bg-green-400 text-[#09090d]"
                                : showIncorrect
                                ? "border-red-400 bg-red-400 text-[#09090d]"
                                : isSelected
                                ? "border-[#d4a843] bg-[#d4a843] text-[#09090d]"
                                : "border-white/30 text-white/50"
                            }`}>
                              {opt}
                            </div>
                            <span className="flex-1">{getOption(q, opt)}</span>
                            {showCorrect && <CheckCircle size={18} className="text-green-400" />}
                            {showIncorrect && <XCircle size={18} className="text-red-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResult && getExplanation(q) && (
                    <div className="mt-4 p-4 bg-[rgba(212,168,67,.05)] border-l-2 border-[#d4a843] rounded">
                      <div className="text-[11px] font-poppins font-semibold text-[#d4a843] mb-1 uppercase tracking-wider">
                        {lang === "fr" ? "Explication" : "Explanation"}
                      </div>
                      <p className="font-poppins text-[13px] text-white/70 leading-relaxed">
                        {getExplanation(q)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          {!submitted && questions.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="px-8 py-3.5 bg-gradient-to-br from-[#d4a843] to-[#c49838] text-[#09090d] font-poppins text-[15px] font-semibold rounded-lg hover:shadow-[0_4px_20px_rgba(212,168,67,.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === "fr" ? "Soumettre les Réponses" : "Submit Answers"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </>
  );
}
