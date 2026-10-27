"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";
import { localizedHref } from "@/lib/i18n/locale";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { Suspense } from "react";
import { ClipboardCheck, CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight, Compass } from "lucide-react";

type FaithTest = {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  test_type: "quiz" | "reflection";
  description_en: string | null;
  description_fr: string | null;
  disclaimer_en: string | null;
  disclaimer_fr: string | null;
  learn_en: string | null;
  learn_fr: string | null;
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
  correct_option: 'A' | 'B' | 'C' | null;
  option_a_profile_id: string | null;
  option_b_profile_id: string | null;
  option_c_profile_id: string | null;
  explanation_en: string | null;
  explanation_fr: string | null;
  sort_order: number;
};

type FaithTestProfile = {
  id: string;
  test_id: string;
  name_en: string;
  name_fr: string;
  interpretation_en: string | null;
  interpretation_fr: string | null;
  advice_en: string | null;
  advice_fr: string | null;
  sort_order: number;
};

interface TestPageClientProps {
  test: FaithTest;
  questions: FaithTestQuestion[];
  profiles: FaithTestProfile[];
}

export default function TestPageClient({ test, questions, profiles }: TestPageClientProps) {
  if (test.test_type === "reflection") {
    return <ReflectionTestClient test={test} questions={questions} profiles={profiles} />;
  }
  return <QuizTestClient test={test} questions={questions} />;
}

// ──────────────────────────────────────────────────────────────────────────
// QUIZ — correct/incorrect biblical questions (original Faith Analyzer mode)
// ──────────────────────────────────────────────────────────────────────────
function QuizTestClient({ test, questions }: { test: FaithTest; questions: FaithTestQuestion[] }) {
  const { lang } = useLang();

  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C'>>({});
  const [submitted, setSubmitted] = useState(false);

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
      test_id: test.id,
      score: correct,
      total_questions: questions.length,
    });

    // Increment total_takes
    await supabase.from("faith_tests")
      .update({ total_takes: (test.total_takes || 0) + 1 })
      .eq("id", test.id);

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const correct = questions.filter(q => answers[q.id] === q.correct_option).length;
  const incorrect = Object.keys(answers).length - correct;
  const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f3ef] to-white dark:from-[#09090d] dark:via-[#0e0f16] dark:to-[#09090d] px-5 py-10">
        <div className="max-w-[900px] mx-auto">
          <Breadcrumbs
            items={[
              { label: lang === "fr" ? "Accueil" : "Home", href: localizedHref(lang, "/") },
              { label: lang === "fr" ? "Analyseur" : "Analyzer", href: localizedHref(lang, "/faith-analyzer") },
              { label: getName(test) },
            ]}
          />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#546cfa] to-[#546cfa] flex items-center justify-center shadow-[0_8px_30px_rgba(84,108,250,.4)]">
                <ClipboardCheck size={32} className="text-[#09090d]" />
              </div>
            </div>

            <h1 className="font-poppins text-[36px] md:text-[44px] font-bold text-[#1a1816] dark:text-[#f0ece4] mb-3">
              {getName(test)}
            </h1>

            {getDescription(test) && (
              <p className="font-poppins text-[15px] text-black/60 dark:text-white/60 leading-relaxed max-w-[650px] mx-auto">
                {getDescription(test)}
              </p>
            )}
          </div>

          {/* Disclaimer */}
          {getDisclaimer(test) && !submitted && (
            <div className="mb-8 p-6 bg-[rgba(84,108,250,.08)] border border-[rgba(84,108,250,.2)] rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[#546cfa] flex-shrink-0 mt-0.5" />
                <p className="font-poppins text-[14px] text-black/70 dark:text-white/70 leading-relaxed">
                  {getDisclaimer(test)}
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {submitted && (
            <div className="mb-10 p-8 bg-[#f5f3ef] border border-black/[.08] dark:bg-[#0b0c12] dark:border-white/[.08] rounded-xl">
              <h2 className="font-poppins text-[28px] font-bold text-[#1a1816] dark:text-[#f0ece4] mb-6 text-center">
                {lang === "fr" ? "Vos Résultats" : "Your Results"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 bg-[rgba(84,108,250,.1)] border border-[rgba(84,108,250,.2)] rounded-lg text-center">
                  <div className="text-[32px] font-bold text-[#546cfa] mb-1">{correct}</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60 font-poppins">
                    {lang === "fr" ? "Correct" : "Correct"}
                  </div>
                </div>

                <div className="p-5 bg-black/[.03] border border-black/[.1] dark:bg-white/[.04] dark:border-white/[.1] rounded-lg text-center">
                  <div className="text-[32px] font-bold text-black/40 dark:text-white/40 mb-1">{incorrect}</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60 font-poppins">
                    {lang === "fr" ? "Incorrect" : "Incorrect"}
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-[#546cfa]/10 to-[#546cfa]/5 border border-[#546cfa]/20 rounded-lg text-center">
                  <div className="text-[32px] font-bold text-[#546cfa] mb-1">{percentage}%</div>
                  <div className="text-[13px] text-black/60 dark:text-white/60 font-poppins">
                    {lang === "fr" ? "Score" : "Score"}
                  </div>
                </div>
              </div>

              {/* Biblical principle: 2-3 witnesses */}
              {incorrect >= 2 && (
                <div className="p-5 bg-[rgba(84,108,250,.05)] border-l-4 border-[#546cfa] rounded">
                  <p className="font-poppins text-[14px] text-black/70 dark:text-white/70 leading-relaxed mb-2">
                    <em>
                      {lang === "fr"
                        ? "« Sur la déposition de deux ou trois témoins, une chose sera établie. » — Matthieu 18:16"
                        : "\"By the testimony of two or three witnesses, a matter shall be established.\" — Matthew 18:16"}
                    </em>
                  </p>
                  <p className="font-poppins text-[13px] text-black/60 dark:text-white/60">
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
                  className="px-6 py-2.5 bg-black/[.05] border border-black/[.15] text-black/80 dark:bg-white/[.08] dark:border-white/[.15] dark:text-white/80 font-poppins text-[13px] font-medium rounded-lg hover:bg-black/[.08] dark:hover:bg-white/[.12] transition-all"
                >
                  {lang === "fr" ? "Réessayer" : "Retake Test"}
                </button>
                <Link
                  href={localizedHref(lang, "/faith-analyzer")}
                  className="px-6 py-2.5 bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] font-poppins text-[13px] font-medium rounded-lg hover:shadow-[0_4px_20px_rgba(84,108,250,.3)] transition-all no-underline"
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
                        : "bg-black/[.02] border-black/[.08] dark:bg-white/[.02] dark:border-white/[.08]"
                      : "bg-[#f5f3ef] border-black/[.08] dark:bg-[#0b0c12] dark:border-white/[.08]"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(84,108,250,.15)] border border-[rgba(84,108,250,.3)] flex items-center justify-center flex-shrink-0 font-poppins text-[14px] font-semibold text-[#546cfa]">
                      {idx + 1}
                    </div>
                    <p className="font-poppins text-[16px] text-black/90 dark:text-white/90 leading-relaxed flex-1 pt-0.5">
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
                              ? "bg-green-500/[.15] border-green-500/40 text-green-700 dark:text-green-100"
                              : showIncorrect
                              ? "bg-red-500/[.15] border-red-500/40 text-red-700 dark:text-red-100"
                              : isSelected
                              ? "bg-[rgba(84,108,250,.15)] border-[rgba(84,108,250,.4)] text-black/90 dark:text-white/95"
                              : "bg-black/[.02] border-black/[.1] text-black/70 hover:bg-black/[.05] hover:border-black/[.15] dark:bg-white/[.03] dark:border-white/[.1] dark:text-white/70 dark:hover:bg-white/[.06] dark:hover:border-white/[.15]"
                          } ${submitted ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-semibold text-[13px] ${
                              showCorrect
                                ? "border-green-400 bg-green-400 text-[#09090d]"
                                : showIncorrect
                                ? "border-red-400 bg-red-400 text-[#09090d]"
                                : isSelected
                                ? "border-[#546cfa] bg-[#546cfa] text-[#09090d]"
                                : "border-black/30 text-black/50 dark:border-white/30 dark:text-white/50"
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
                    <div className="mt-4 p-4 bg-[rgba(84,108,250,.05)] border-l-2 border-[#546cfa] rounded">
                      <div className="text-[11px] font-poppins font-semibold text-[#546cfa] mb-1 uppercase tracking-wider">
                        {lang === "fr" ? "Explication" : "Explanation"}
                      </div>
                      <p className="font-poppins text-[13px] text-black/70 dark:text-white/70 leading-relaxed">
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
                className="px-8 py-3.5 bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] font-poppins text-[15px] font-semibold rounded-lg hover:shadow-[0_4px_20px_rgba(84,108,250,.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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

// ──────────────────────────────────────────────────────────────────────────
// REFLECTION — scored self-assessment, one question at a time, no right
// answers. Each option counts toward a result profile; the profile with the
// most answers wins. Ported from the standalone "Three Islands of Life"
// prototype so content stays editable from /admin.
// ──────────────────────────────────────────────────────────────────────────
function ReflectionTestClient({ test, questions, profiles }: { test: FaithTest; questions: FaithTestQuestion[]; profiles: FaithTestProfile[] }) {
  const { lang } = useLang();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Array<'A' | 'B' | 'C' | null>>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const getName = (t: FaithTest) => lang === "fr" ? t.name_fr : t.name_en;
  const getDescription = (t: FaithTest) => lang === "fr" ? t.description_fr : t.description_en;
  const getDisclaimer = (t: FaithTest) => lang === "fr" ? t.disclaimer_fr : t.disclaimer_en;
  const getLearn = (t: FaithTest) => lang === "fr" ? t.learn_fr : t.learn_en;
  const getQuestion = (q: FaithTestQuestion) => lang === "fr" ? q.question_fr : q.question_en;
  const getOption = (q: FaithTestQuestion, opt: 'A' | 'B' | 'C') =>
    lang === "fr" ? (opt === 'A' ? q.option_a_fr : opt === 'B' ? q.option_b_fr : q.option_c_fr)
                  : (opt === 'A' ? q.option_a_en : opt === 'B' ? q.option_b_en : q.option_c_en);
  const getProfileId = (q: FaithTestQuestion, opt: 'A' | 'B' | 'C') =>
    opt === 'A' ? q.option_a_profile_id : opt === 'B' ? q.option_b_profile_id : q.option_c_profile_id;
  const getProfileName = (p: FaithTestProfile) => lang === "fr" ? p.name_fr : p.name_en;
  const getInterpretation = (p: FaithTestProfile) => lang === "fr" ? p.interpretation_fr : p.interpretation_en;
  const getAdvice = (p: FaithTestProfile) => lang === "fr" ? p.advice_fr : p.advice_en;

  if (questions.length === 0 || profiles.length === 0) {
    return (
      <>
        <div className="min-h-screen px-5 py-10 flex items-center justify-center text-center">
          <p className="font-poppins text-black/50 dark:text-white/50">
            {lang === "fr" ? "Ce test n'est pas encore prêt." : "This test isn't ready yet."}
          </p>
        </div>
        <SiteFooter />
      </>
    );
  }

  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPct = (answeredCount / questions.length) * 100;

  async function finish() {
    if (answers.some((a) => a === null)) return;

    const supabase = createClient();
    await supabase.from("faith_tests")
      .update({ total_takes: (test.total_takes || 0) + 1 })
      .eq("id", test.id);

    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers(Array(questions.length).fill(null));
    setPage(0);
    setShowResults(false);
    setStarted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f3ef] to-white dark:from-[#09090d] dark:via-[#0e0f16] dark:to-[#09090d] px-5 py-10">
        <div className="max-w-[760px] mx-auto">
          <Breadcrumbs
            items={[
              { label: lang === "fr" ? "Accueil" : "Home", href: localizedHref(lang, "/") },
              { label: lang === "fr" ? "Analyseur" : "Analyzer", href: localizedHref(lang, "/faith-analyzer") },
              { label: getName(test) },
            ]}
          />

          <div className="text-center mb-8 mt-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#546cfa] to-[#546cfa] flex items-center justify-center shadow-[0_8px_30px_rgba(84,108,250,.4)]">
                <Compass size={32} className="text-[#09090d]" />
              </div>
            </div>
            <h1 className="font-playfair text-[32px] md:text-[42px] font-bold text-[#1a1816] dark:text-[#f0ece4] mb-3">
              {getName(test)}
            </h1>
            {getDescription(test) && !showResults && (
              <p className="font-poppins text-[14px] text-black/60 dark:text-white/60 leading-relaxed max-w-[560px] mx-auto">
                {getDescription(test)}
              </p>
            )}
          </div>

          {getDisclaimer(test) && !showResults && (
            <div className="mb-8 p-5 bg-[rgba(84,108,250,.08)] border border-[rgba(84,108,250,.2)] rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-[#546cfa] flex-shrink-0 mt-0.5" />
                <p className="font-poppins text-[13px] text-black/70 dark:text-white/70 leading-relaxed">
                  {getDisclaimer(test)}
                </p>
              </div>
            </div>
          )}

          {!started ? (
            <div className="p-6 md:p-8 bg-[#f5f3ef] border border-black/[.08] dark:bg-[#0b0c12] dark:border-white/[.08] rounded-xl">
              <div className="flex justify-center">
                <button
                  onClick={() => setStarted(true)}
                  className="px-8 py-3 bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] font-poppins text-[14px] font-semibold rounded-lg hover:shadow-[0_4px_20px_rgba(84,108,250,.4)] transition-all"
                >
                  {lang === "fr" ? `Commencer les ${questions.length} questions` : `Start the ${questions.length} questions`}
                </button>
              </div>
            </div>
          ) : !showResults ? (
            <div className="p-6 md:p-8 bg-[#f5f3ef] border border-black/[.08] dark:bg-[#0b0c12] dark:border-white/[.08] rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-poppins text-[12px] font-semibold text-black/60 dark:text-white/60">
                  {(lang === "fr" ? "Question" : "Question")} {page + 1}/{questions.length}
                </span>
                <span className="font-poppins text-[11px] text-black/40 dark:text-white/40">
                  {answeredCount}/{questions.length} {lang === "fr" ? "répondu(e)s" : "answered"}
                </span>
              </div>
              <div className="h-[6px] bg-black/[.08] dark:bg-white/[.08] rounded-full overflow-hidden mb-7">
                <div className="h-full bg-[#546cfa] transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>

              <h2 className="font-poppins text-[19px] md:text-[22px] font-semibold text-[#1a1816] dark:text-[#f0ece4] mb-5 leading-snug">
                {getQuestion(questions[page])}
              </h2>

              <div className="space-y-2.5 mb-7">
                {(['A', 'B', 'C'] as const).map((opt) => {
                  const isSelected = answers[page] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        const next = [...answers];
                        next[page] = opt;
                        setAnswers(next);
                      }}
                      className={`w-full text-left p-4 rounded-lg border font-poppins text-[14px] leading-relaxed transition-all ${
                        isSelected
                          ? "bg-[rgba(84,108,250,.15)] border-[rgba(84,108,250,.45)] text-black/90 dark:text-white/95"
                          : "bg-black/[.02] border-black/[.1] text-black/70 hover:bg-black/[.05] hover:border-black/[.15] dark:bg-white/[.03] dark:border-white/[.1] dark:text-white/70 dark:hover:bg-white/[.06] dark:hover:border-white/[.15]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected ? "border-[#546cfa] bg-[#546cfa]" : "border-black/25 dark:border-white/25"
                        }`} />
                        <span className="flex-1">{getOption(questions[page], opt)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center gap-3 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black/[.05] border border-black/[.15] text-black/80 dark:bg-white/[.08] dark:border-white/[.15] dark:text-white/80 font-poppins text-[13px] font-medium rounded-lg hover:bg-black/[.08] dark:hover:bg-white/[.12] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={14} /> {lang === "fr" ? "Précédent" : "Previous"}
                </button>
                {page < questions.length - 1 ? (
                  <button
                    onClick={() => setPage((p) => Math.min(questions.length - 1, p + 1))}
                    disabled={answers[page] === null}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] font-poppins text-[13px] font-semibold rounded-lg hover:shadow-[0_4px_20px_rgba(84,108,250,.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {lang === "fr" ? "Suivant" : "Next"} <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    disabled={answers.some((a) => a === null)}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] font-poppins text-[13px] font-semibold rounded-lg hover:shadow-[0_4px_20px_rgba(84,108,250,.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {lang === "fr" ? "Voir mon résultat" : "See my result"}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-6">
                {answers.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-7 h-7 rounded-md font-poppins text-[11px] font-medium transition-all ${
                      i === page
                        ? "bg-[#546cfa] text-[#09090d]"
                        : a !== null
                        ? "bg-[rgba(84,108,250,.18)] text-[#546cfa]"
                        : "bg-black/[.05] text-black/40 dark:bg-white/[.06] dark:text-white/40"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ReflectionResults
              lang={lang}
              questions={questions}
              profiles={profiles}
              answers={answers}
              getProfileId={getProfileId}
              getProfileName={getProfileName}
              getInterpretation={getInterpretation}
              getAdvice={getAdvice}
              onRetake={restart}
              learn={getLearn(test)}
            />
          )}
        </div>
      </div>

      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </>
  );
}

// Renders a test's "learn more" text. Blank lines separate blocks; a block
// where every line contains "|" is rendered as a table (first line = header
// row, rest = "Row label: val1 | val2 | val3" data rows). Everything else
// renders as a plain paragraph.
function LearnContent({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isTable = lines.length > 1 && lines.every((l) => l.includes("|"));

        if (isTable) {
          const [headerLine, ...rowLines] = lines;
          const headerCells = headerLine.split("|").map((c) => c.trim());
          const rows = rowLines.map((line) => {
            const [label, rest] = line.split(/:(.+)/);
            return [label.trim(), ...(rest ?? "").split("|").map((c) => c.trim())];
          });

          return (
            <div key={i} className="overflow-x-auto rounded-lg border border-black/[.08] dark:border-white/[.08]">
              <table className="w-full text-[13px] font-poppins border-collapse">
                <thead>
                  <tr className="bg-[rgba(84,108,250,.1)]">
                    {headerCells.map((c, ci) => (
                      <th key={ci} className="text-left px-3 py-2 font-semibold text-black/80 dark:text-white/80 border-b border-black/[.08] dark:border-white/[.08]">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={ri} className={ri % 2 === 1 ? "bg-black/[.015] dark:bg-white/[.02]" : ""}>
                      {r.map((c, ci) => (
                        <td
                          key={ci}
                          className={`px-3 py-2 border-b border-black/[.06] dark:border-white/[.06] ${
                            ci === 0 ? "font-medium text-black/80 dark:text-white/80" : "text-black/60 dark:text-white/60"
                          }`}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={i} className="font-poppins text-[14px] text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}

function ReflectionResults({
  lang, questions, profiles, answers,
  getProfileId, getProfileName, getInterpretation, getAdvice, onRetake, learn,
}: {
  lang: "en" | "fr";
  questions: FaithTestQuestion[];
  profiles: FaithTestProfile[];
  answers: Array<'A' | 'B' | 'C' | null>;
  getProfileId: (q: FaithTestQuestion, opt: 'A' | 'B' | 'C') => string | null;
  getProfileName: (p: FaithTestProfile) => string;
  getInterpretation: (p: FaithTestProfile) => string | null;
  getAdvice: (p: FaithTestProfile) => string | null;
  onRetake: () => void;
  learn: string | null;
}) {
  const [showLearn, setShowLearn] = useState(false);
  const counts = new Map<string, number>(profiles.map((p) => [p.id, 0]));
  questions.forEach((q, i) => {
    const opt = answers[i];
    if (!opt) return;
    const profileId = getProfileId(q, opt);
    if (profileId && counts.has(profileId)) counts.set(profileId, (counts.get(profileId) ?? 0) + 1);
  });

  const max = Math.max(...Array.from(counts.values()));
  const winners = profiles.filter((p) => (counts.get(p.id) ?? 0) === max);
  const winner = winners.length === 1 ? winners[0] : null;

  return (
    <div className="p-6 md:p-8 bg-[#f5f3ef] border border-black/[.08] dark:bg-[#0b0c12] dark:border-white/[.08] rounded-xl">
      <p className="font-poppins text-[11px] font-semibold tracking-[.18em] uppercase text-[#546cfa] text-center mb-2">
        {lang === "fr" ? "Votre résultat" : "Your result"}
      </p>
      <h2 className="font-playfair text-[26px] md:text-[32px] font-bold text-[#1a1816] dark:text-[#f0ece4] text-center mb-4">
        {winner ? getProfileName(winner) : (lang === "fr" ? "Vous êtes entre plusieurs îles" : "You are between islands")}
      </h2>
      <p className="font-poppins text-[14px] text-black/70 dark:text-white/70 leading-relaxed text-center max-w-[560px] mx-auto mb-8">
        {winner
          ? getInterpretation(winner)
          : (lang === "fr"
              ? "Vos réponses sont partagées entre plusieurs profils plutôt qu'un seul clairement dominant."
              : "Your responses are split across profiles rather than one clear leader.")}
      </p>

      <div className="space-y-3 mb-8">
        {profiles.map((p) => {
          const n = counts.get(p.id) ?? 0;
          return (
            <div key={p.id}>
              <div className="flex justify-between font-poppins text-[12px] text-black/60 dark:text-white/60 mb-1">
                <span>{getProfileName(p)}</span>
                <span>{n}/{questions.length}</span>
              </div>
              <div className="h-[8px] bg-black/[.08] dark:bg-white/[.08] rounded-full overflow-hidden">
                <div className="h-full bg-[#546cfa] transition-all duration-500" style={{ width: `${(n / questions.length) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {winner && getAdvice(winner) && (
        <div className="p-5 bg-[rgba(84,108,250,.05)] border-l-4 border-[#546cfa] rounded mb-8">
          <div className="text-[11px] font-poppins font-semibold text-[#546cfa] mb-1.5 uppercase tracking-wider">
            {lang === "fr" ? "Votre prochaine étape" : "Your next step"}
          </div>
          <p className="font-poppins text-[14px] text-black/70 dark:text-white/70 leading-relaxed">
            {getAdvice(winner)}
          </p>
        </div>
      )}

      {learn && (
        <div className="mb-8">
          <button
            onClick={() => setShowLearn((v) => !v)}
            className="font-poppins text-[13px] font-semibold text-[#546cfa] hover:underline"
          >
            {showLearn
              ? (lang === "fr" ? "Masquer les explications ▲" : "Hide explanation ▲")
              : (lang === "fr" ? "Pourquoi ce résultat ? En savoir plus ▼" : "Why this result? Learn more ▼")}
          </button>
          {showLearn && (
            <div className="mt-4">
              <LearnContent text={learn} />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={onRetake}
          className="px-6 py-2.5 bg-black/[.05] border border-black/[.15] text-black/80 dark:bg-white/[.08] dark:border-white/[.15] dark:text-white/80 font-poppins text-[13px] font-medium rounded-lg hover:bg-black/[.08] dark:hover:bg-white/[.12] transition-all"
        >
          {lang === "fr" ? "Recommencer" : "Start Again"}
        </button>
        <Link
          href={localizedHref(lang, "/faith-analyzer")}
          className="px-6 py-2.5 bg-gradient-to-br from-[#546cfa] to-[#546cfa] text-[#09090d] font-poppins text-[13px] font-medium rounded-lg hover:shadow-[0_4px_20px_rgba(84,108,250,.3)] transition-all no-underline"
        >
          {lang === "fr" ? "Plus de Tests" : "More Tests"}
        </Link>
      </div>
    </div>
  );
}
