"use client";
import { credoStyles } from "./credoStyles";

import { Suspense, useEffect, useState } from "react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/lib/i18n";

interface CredoContent {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  updated_at: string;
  created_at: string;
}

const css = credoStyles;


const beliefs = [
  {
    title: "I believe in the absolute authority of Scripture",
    body: "The Bible is not merely a historical document — it is the living, breathing Word of God. I read it not to confirm my opinions but to be confronted, corrected, and transformed by truth that is outside and above me. Every conviction I hold is tested against it. Where Scripture speaks, it speaks with final authority.",
    verse: "\"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.\" — 2 Timothy 3:16",
    title_fr: "Je crois en l\u2019autorit\u00e9 absolue des \u00c9critures",
    body_fr: "La Bible n\u2019est pas simplement un document historique \u2014 c\u2019est la Parole vivante et inspir\u00e9e de Dieu. Je la lis non pour confirmer mes opinions, mais pour \u00eatre confront\u00e9, corrig\u00e9 et transform\u00e9 par une v\u00e9rit\u00e9 qui m\u2019est ext\u00e9rieure et sup\u00e9rieure. Chaque conviction que je d\u00e9tiens est \u00e9prouv\u00e9e \u00e0 son aune. L\u00e0 o\u00f9 les \u00c9critures parlent, elles parlent avec une autorit\u00e9 d\u00e9finitive.",
    verse_fr: "\"Toute \u00c9criture est inspir\u00e9e de Dieu et utile pour enseigner, pour convaincre, pour corriger, pour former \u00e0 la justice.\" \u2014 2 Timoth\u00e9e 3:16",
  },
  {
    title: "I believe in the lordship of Jesus Christ",
    body: "Not as a metaphor, not as a moral teacher, not as a spiritual concept — but as the risen Lord. Christ is not one option among many. He is the Way, the Truth, and the Life. I have staked everything on the reality of His resurrection. The shape of my life is a response to that claim.",
    verse: "\"Jesus said to him, I am the way, and the truth, and the life. No one comes to the Father except through me.\" — John 14:6",
    title_fr: "Je crois en la seigneurie de J\u00e9sus-Christ",
    body_fr: "Non comme une m\u00e9taphore, non comme un enseignant moral, non comme un concept spirituel \u2014 mais comme le Seigneur ressuscit\u00e9. Christ n\u2019est pas une option parmi d\u2019autres. Il est le Chemin, la V\u00e9rit\u00e9 et la Vie. J\u2019ai tout mis\u00e9 sur la r\u00e9alit\u00e9 de Sa r\u00e9surrection. La forme de ma vie est une r\u00e9ponse \u00e0 cette affirmation.",
    verse_fr: "\"J\u00e9sus lui dit : Je suis le chemin, la v\u00e9rit\u00e9 et la vie. Nul ne vient au P\u00e8re que par moi.\" \u2014 Jean 14:6",
  },
  {
    title: "I believe in the power and necessity of prayer",
    body: "Prayer is not a spiritual technique or a coping mechanism. It is the primary conversation of my life — the means by which I remain tethered to God, calibrated to His will, and sustained through every season. I do not always know what to say. But I know that God hears, and that changes everything about how I live.",
    verse: "\"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.\" — Philippians 4:6",
    title_fr: "Je crois \u00e0 la puissance et \u00e0 la n\u00e9cessit\u00e9 de la pri\u00e8re",
    body_fr: "La pri\u00e8re n\u2019est pas une technique spirituelle ni un m\u00e9canisme d\u2019adaptation. C\u2019est la conversation principale de ma vie \u2014 le moyen par lequel je reste ancr\u00e9 \u00e0 Dieu, calibr\u00e9 selon Sa volont\u00e9 et soutenu \u00e0 travers chaque saison. Je ne sais pas toujours quoi dire. Mais je sais que Dieu entend, et cela change tout dans ma fa\u00e7on de vivre.",
    verse_fr: "\"Ne vous inqui\u00e9tez de rien, mais en toutes choses, par la pri\u00e8re et la supplication avec des actions de gr\u00e2ce, pr\u00e9sentez vos requ\u00eates \u00e0 Dieu.\" \u2014 Philippiens 4:6",
  },
  {
    title: "I believe that faith without works is dead",
    body: "I am not saved by what I do — but what I believe will always produce action. Faith is not a private feeling; it is a public practice. Serving the poor, pursuing justice, caring for the marginalised, building community — these are not additions to my faith. They are its expression.",
    verse: "\"What good is it, my brothers, if someone says he has faith but does not have works? Can that faith save him?\" — James 2:14",
    title_fr: "Je crois que la foi sans les \u0153uvres est morte",
    body_fr: "Je ne suis pas sauv\u00e9 par ce que je fais \u2014 mais ce en quoi je crois produira toujours de l\u2019action. La foi n\u2019est pas un sentiment priv\u00e9\u00a0; c\u2019est une pratique publique. Servir les pauvres, poursuivre la justice, prendre soin des marginalis\u00e9s, construire une communaut\u00e9 \u2014 ce ne sont pas des ajouts \u00e0 ma foi. Ce sont son expression.",
    verse_fr: "\"\u00c0 quoi cela sert-il, mes fr\u00e8res, si quelqu\u2019un dit avoir la foi, mais n\u2019a pas les \u0153uvres\u00a0? La foi peut-elle le sauver\u00a0?\" \u2014 Jacques 2:14",
  },
  {
    title: "I believe in the sanctity of each human life",
    body: "Every person bears the image of God — the Imago Dei. This is not contingent on their productivity, their nationality, their achievement, or their proximity to me. It means every human being deserves to be treated with dignity, respect, and love. This conviction is the root of my commitment to serve, lead, and advocate.",
    verse: "\"So God created man in his own image, in the image of God he created him; male and female he created them.\" — Genesis 1:27",
    title_fr: "Je crois en la saintet\u00e9 de chaque vie humaine",
    body_fr: "Chaque personne porte l\u2019image de Dieu \u2014 l\u2019Imago Dei. Cela ne d\u00e9pend pas de sa productivit\u00e9, de sa nationalit\u00e9, de ses accomplissements ni de sa proximit\u00e9 avec moi. Cela signifie que chaque \u00eatre humain m\u00e9rite d\u2019\u00eatre trait\u00e9 avec dignit\u00e9, respect et amour. Cette conviction est \u00e0 la racine de mon engagement \u00e0 servir, \u00e0 diriger et \u00e0 d\u00e9fendre.",
    verse_fr: "\"Dieu cr\u00e9a l\u2019homme \u00e0 son image, il le cr\u00e9a \u00e0 l\u2019image de Dieu\u00a0; il les cr\u00e9a homme et femme.\" \u2014 Gen\u00e8se 1:27",
  },
  {
    title: "I believe in the community of the Church",
    body: "The Church is not a building or a Sunday event. It is the Body of Christ — broken and beautiful, flawed and essential. I am committed to it not because it is perfect but because it is the vessel through which God has chosen to work in the world. My faith has always been shaped by community, and I belong to one.",
    verse: "\"And day by day, attending the temple together and breaking bread in their homes, they received their food with glad and generous hearts.\" — Acts 2:46",
    title_fr: "Je crois en la communaut\u00e9 de l\u2019\u00c9glise",
    body_fr: "L\u2019\u00c9glise n\u2019est pas un b\u00e2timent ni un \u00e9v\u00e9nement dominical. C\u2019est le Corps du Christ \u2014 bris\u00e9 et beau, imparfait et essentiel. Je m\u2019y engage non parce qu\u2019elle est parfaite, mais parce qu\u2019elle est le vase \u00e0 travers lequel Dieu a choisi d\u2019agir dans le monde. Ma foi a toujours \u00e9t\u00e9 fa\u00e7onn\u00e9e par la communaut\u00e9, et j\u2019y appartiens.",
    verse_fr: "\"Chaque jour, d\u2019un commun accord, ils fr\u00e9quentaient le temple, rompaient le pain dans les maisons et prenaient leur nourriture avec joie et simplicit\u00e9 de c\u0153ur.\" \u2014 Actes 2:46",
  },
  {
    title: "I believe that Intelligence and Spirituality are not in conflict — they are companions",
    body: "The world has long presented a false choice between the life of the mind and the life of the Spirit. I reject that choice. Jesus — our perfect model — was a carpenter who confounded the Pharisees, teachers, and scholars. Daniel, taken as a captive into Babylon, rose to the pinnacle of an empire through both the wisdom of God and the sharpest of minds: 'in whom was no blemish, but well-favoured, and skilful in all wisdom, and cunning in knowledge.' I finished my undergraduate studies at the University of Ghana as the top student in my cohort — while being actively, publicly, and deeply committed to my faith. That is not a contradiction. It is a confirmation. Paul, one of the greatest intellects of the ancient world, did not abandon his mind when he met Christ — he consecrated it. I have seen in the lives of Jesus, Paul, and Daniel, and in the arc of my own life, that the fear of God is not the enemy of inquiry. It is its foundation.",
    verse: "\"But Daniel resolved that he would not defile himself... As for these four youths, God gave them learning and skill in all literature and wisdom.\" — Daniel 1:8, 17",
    title_fr: "Je crois que l\u2019Intelligence et la Spiritualit\u00e9 ne sont pas en conflit \u2014 elles sont compagnes",
    body_fr: "Le monde a longtemps pr\u00e9sent\u00e9 un faux choix entre la vie de l\u2019esprit et la vie de l\u2019Esprit. Je rejette ce choix. J\u00e9sus \u2014 notre mod\u00e8le parfait \u2014 \u00e9tait un charpentier qui confondit les pharisiens, les docteurs et les \u00e9rudits. Daniel, emmen\u00e9 captif \u00e0 Babylone, s\u2019\u00e9leva au sommet d\u2019un empire gr\u00e2ce \u00e0 la sagesse de Dieu et \u00e0 l\u2019acuit\u00e9 de son esprit\u00a0: \u2018en qui il n\u2019y avait aucun d\u00e9faut, beaux de visage, vers\u00e9s en toute sagesse, savants en connaissance.\u2019 J\u2019ai termin\u00e9 mes \u00e9tudes de premier cycle \u00e0 l\u2019Universit\u00e9 du Ghana comme premier de ma promotion \u2014 tout en \u00e9tant activement, publiquement et profond\u00e9ment engag\u00e9 dans ma foi. Ce n\u2019est pas une contradiction. C\u2019est une confirmation. Paul, l\u2019un des plus grands intellectuels du monde antique, n\u2019abandonna pas son esprit en rencontrant Christ \u2014 il le consacra. J\u2019ai vu dans la vie de J\u00e9sus, de Paul et de Daniel, et dans l\u2019arc de ma propre vie, que la crainte de Dieu n\u2019est pas l\u2019ennemi de la curiosit\u00e9 intellectuelle. Elle en est le fondement.",
    verse_fr: "\"Daniel prit la r\u00e9solution de ne pas se souiller\u2026 Dieu donna \u00e0 ces quatre jeunes gens la science et l\u2019intelligence dans toute litt\u00e9rature et toute sagesse.\" \u2014 Daniel 1:8, 17",
  },
  {
    title: "I believe I was made for a purpose larger than myself",
    body: "I was not born to accumulate. I was born to contribute. This conviction drives everything: the scholarships I received are commissions; the gifts I carry are not for display but for deployment. I am here — in this moment, in this body, in this generation — for a reason I did not choose and will not fully understand until eternity.",
    verse: "\"For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.\" — Ephesians 2:10",
    title_fr: "Je crois que j\u2019ai \u00e9t\u00e9 cr\u00e9\u00e9 pour une vocation plus grande que moi-m\u00eame",
    body_fr: "Je ne suis pas n\u00e9 pour accumuler. Je suis n\u00e9 pour contribuer. Cette conviction guide tout\u00a0: les bourses que j\u2019ai re\u00e7ues sont des missions\u00a0; les dons que je porte ne sont pas faits pour \u00eatre expos\u00e9s, mais pour \u00eatre d\u00e9ploy\u00e9s. Je suis ici \u2014 en ce moment, dans ce corps, dans cette g\u00e9n\u00e9ration \u2014 pour une raison que je n\u2019ai pas choisie et que je ne comprendrai pleinement que dans l\u2019\u00e9ternit\u00e9.",
    verse_fr: "\"Nous sommes son ouvrage, ayant \u00e9t\u00e9 cr\u00e9\u00e9s en J\u00e9sus-Christ pour de bonnes \u0153uvres, que Dieu a pr\u00e9par\u00e9es d\u2019avance, afin que nous les pratiquions.\" \u2014 \u00c9ph\u00e9siens 2:10",
  },
];

export default function CredoPage() {
  const { lang, toggleLang } = useLang();
  const [dbContent, setDbContent] = useState<CredoContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const db = createClient();
      const { data } = await db.from("credo_content").select("*").single();
      setDbContent(data);
      setLoading(false);
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("credo-visible"); }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".credo-item").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="credo-pg">
        <style>{css}</style>

        {/* ── HERO ── */}
        <div className="credo-hero">
          <p className="credo-eyebrow">
            {lang === "fr" ? "Samuel Kobina Gyasi · Ce Que Je Crois" : "Samuel Kobina Gyasi · What I Believe"}
          </p>
          <h1 className="credo-headline">
            {lang === "fr" ? "Mon" : "My"}<br /><em>Credo</em>
          </h1>
          <div className="credo-rule" />
          <p className="credo-hero-sub">
            {lang === "fr"
              ? "Ce sont les convictions selon lesquelles je vis. Pas des conclusions auxquelles je suis parvenu confortablement, mais des vérités dans lesquelles j'ai été brisé. Une vie n'est pas un argument — c'est un témoignage."
              : "These are the convictions by which I live. Not conclusions I have arrived at comfortably, but truths I have been broken into. A life is not an argument — it is a witness."}
          </p>
        </div>

        {/* ── DECLARATION STRIP ── */}
        <div className="credo-strip">
          <span>I Believe</span>
          <span className="credo-strip-dot">·</span>
          <span>Je Crois</span>
          <span className="credo-strip-dot">·</span>
          <span>Ana Aaminu</span>
          <span className="credo-strip-dot">·</span>
          <span>Menim</span>
        </div>

        {/* ── BELIEFS ── */}
        <div className="credo-body">
          {beliefs.map((b, i) => (
            <div key={i} className="credo-item" style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className="credo-num">0{i + 1}</div>
              <div className="credo-text">
                <h2 className="credo-item-title">{lang === "fr" ? b.title_fr : b.title}</h2>
                <p className="credo-item-body">{lang === "fr" ? b.body_fr : b.body}</p>
                <div className="credo-verse">{lang === "fr" ? b.verse_fr : b.verse}</div>
              </div>
            </div>
          ))}
        </div>

        {/* DATABASE-DRIVEN CONTENT */}
        {dbContent && (
          <section style={{
            maxWidth: '1100px',
            margin: '60px auto 0',
            padding: '0 8% 80px',
            borderTop: '1px solid rgba(201,168,76,.18)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '60px',
              marginBottom: '40px',
            }}>
              <div style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: '10px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {lang === "fr" ? "Mon Credo" : "My Credo"}
              </div>
              <div style={{
                display: 'inline-flex',
                gap: 0,
                border: '1px solid rgba(201,168,76,.3)',
              }}>
                <button
                  onClick={() => { if (lang !== "en") toggleLang(); }}
                  style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    background: lang === "en" ? 'rgba(201,168,76,.1)' : 'transparent',
                    border: 'none',
                    color: lang === "en" ? 'rgba(201,168,76,.9)' : 'rgba(245,243,239,.4)',
                    cursor: 'pointer',
                    transition: 'color .2s, background .2s',
                  }}
                >
                  EN
                </button>
                <button
                  onClick={() => { if (lang !== "fr") toggleLang(); }}
                  style={{
                    fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    background: lang === "fr" ? 'rgba(201,168,76,.1)' : 'transparent',
                    border: 'none',
                    color: lang === "fr" ? 'rgba(201,168,76,.9)' : 'rgba(245,243,239,.4)',
                    cursor: 'pointer',
                    transition: 'color .2s, background .2s',
                  }}
                >
                  FR
                </button>
              </div>
            </div>
            <h2 style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'var(--white)',
              marginBottom: '32px',
            }}>
              {lang === "fr" && dbContent.title_fr ? dbContent.title_fr : dbContent.title_en}
            </h2>
            <div style={{
              fontFamily: "var(--font-poppins),Poppins,sans-serif",
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              lineHeight: 1.75,
              color: 'rgba(245,243,239,.72)',
              maxWidth: '840px',
              whiteSpace: 'pre-wrap',
            }}>
              {lang === "fr" && dbContent.content_fr ? dbContent.content_fr : dbContent.content_en}
            </div>
          </section>
        )}

        {/* ── CLOSING DECLARATION ── */}
        <section className="credo-close">
          <div className="credo-close-inner">
            <div className="credo-close-ornament">◆ ◆ ◆</div>
            <p className="credo-close-quote">
              {lang === "fr"
                ? <>&ldquo;Nous donc aussi, puisque nous sommes environn&eacute;s d&rsquo;une si grande nu&eacute;e de t&eacute;moins, rejetons tout fardeau et le p&eacute;ch&eacute; qui nous enveloppe si facilement, et courons avec pers&eacute;v&eacute;rance dans la carri&egrave;re qui nous est ouverte, les regards fix&eacute;s sur J&eacute;sus, le chef et le consommateur de la foi.&rdquo;</>
                : <>&ldquo;Therefore, since we are surrounded by so great a cloud of witnesses, let us lay aside every weight, and sin which clings so closely, and let us run with endurance the race that is set before us, looking to Jesus, the founder and perfecter of our faith.&rdquo;</>
              }
            </p>
            <div className="credo-close-ref">{lang === "fr" ? "Hébreux 12:1–2" : "Hebrews 12:1–2"}</div>
            <p className="credo-close-sign">
              {lang === "fr" ? (
                <>&Eacute;crit et v&eacute;cu par Samuel Kobina Gyasi.<br />Erudit. Ancien. Serviteur. Croyant.</>
              ) : (
                <>Written and lived by Samuel Kobina Gyasi.<br />Scholar. Elder. Servant. Believer.</>
              )}
            </p>
          </div>
        </section>
      </div>
      <Suspense fallback={null}><SiteFooter /></Suspense>
    </>
  );
}
