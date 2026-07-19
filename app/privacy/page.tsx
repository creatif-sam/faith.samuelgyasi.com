import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { localizedHref } from "@/lib/i18n/locale";
import { resolveLocale, pageAlternates, SITE_URL } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = resolveLocale((await headers()).get("x-locale"));
  return {
    title: "Privacy Policy",
    description:
      "How faith.samuelgyasi.com collects, uses, and protects your personal information.",
    alternates: pageAlternates(lang, "/privacy"),
  };
}

const siteUrl = SITE_URL;

export default async function PrivacyPage() {
  const lang = resolveLocale((await headers()).get("x-locale"));

  return (
    <>
      <main
        style={{
          background: "#080807",
          color: "#f0ece4",
          minHeight: "100vh",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "140px 40px 80px",
          }}
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              background: "linear-gradient(90deg,#546cfa,#546cfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "20px",
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px,6vw,64px)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "16px",
              color: "#f0ece4",
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              color: "rgba(240,236,228,0.45)",
              fontSize: "13px",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "0.08em",
              marginBottom: "56px",
            }}
          >
            Last updated: July 2026
          </p>

          <p
            style={{
              color: "rgba(240,236,228,0.65)",
              fontSize: "15px",
              lineHeight: 1.8,
              fontWeight: 300,
              marginBottom: "48px",
            }}
          >
            This Privacy Policy explains how {siteUrl.replace(/^https?:\/\//, "")} ("this site,"
            "we," "us") collects, uses, shares, and protects information about you when you
            visit the site, subscribe to updates, submit a prayer request, leave a comment,
            or otherwise interact with us. By using this site, you agree to the practices
            described below.
          </p>

          {[
            {
              title: "1. Who We Are",
              body: `This website (${siteUrl}) is a personal platform operated by Samuel Kobina Gyasi for faith, writing, and ministry — sharing reflections, teaching, and resources on Scripture and the Christian walk. For any question about this policy or your data, contact impact@samuelgyasi.com.`,
            },
            {
              title: "2. Information We Collect",
              body: "We collect information you provide directly: your email address and topic preferences when you subscribe to the newsletter; your name, email, and message content when you submit a prayer request, book a training, or use the contact form; your name and (optionally) email when you leave a blog comment or submit a testimonial — comment and testimonial names may be displayed publicly, emails never are. If you create a dashboard account, we collect your email and authentication data via Supabase. We also collect limited technical data automatically — page views, referring pages, device/browser type, and approximate location derived from your IP or browser language — used only in aggregate to understand how the site is used.",
            },
            {
              title: "3. How We Use Your Information",
              body: "We use your information to: send the reflections, updates, and newsletter content you subscribed to; respond to prayer requests, messages, and training enrollments; display blog comments and testimonials you choose to submit; maintain and secure your dashboard account if you have one; detect and prevent abuse; and understand aggregate site usage so we can improve the content and experience. We do not sell, rent, or use your data for third-party advertising.",
            },
            {
              title: "4. Legal Basis for Processing",
              body: "Where applicable law requires a legal basis (e.g. under the GDPR for visitors in the EU/EEA), we process your data based on your consent (newsletter sign-up, cookie preferences, comment/testimonial submissions), the performance of a request you initiate (prayer requests, training enrollment, account creation), and our legitimate interest in operating and improving the site securely.",
            },
            {
              title: "5. Cookies & Similar Technologies",
              body: "This site uses a small number of cookies: a language-preference cookie (NEXT_LOCALE) that remembers whether you're browsing in English or French, a cookie recording your cookie-consent choice, and, if you sign in, a Supabase authentication session cookie. We do not use third-party advertising or cross-site tracking cookies. You can block or delete cookies in your browser settings, though the site may not function correctly without the essential ones.",
            },
            {
              title: "6. Third-Party Services",
              body: "We rely on a small number of trusted service providers to run this site: Supabase (database, authentication, and file storage), Vercel (hosting and edge infrastructure), and Resend (transactional and newsletter email delivery). Each of these providers processes data on our behalf under their own privacy and security commitments, and we only share the minimum data necessary for them to perform their function — we do not permit them to use your data for their own marketing purposes.",
            },
            {
              title: "7. Data Sharing & Disclosure",
              body: "We do not sell or rent your personal information. We may disclose information if required to do so by law, to protect the rights, safety, or property of this site, its visitors, or the public, or in connection with a good-faith belief that disclosure is necessary to comply with a legal obligation.",
            },
            {
              title: "8. Data Retention",
              body: "Newsletter subscriptions and account data are retained until you unsubscribe or request deletion. Prayer requests are retained for as long as reasonably needed for ministry purposes and are never published or shared publicly. Blog comments and testimonials are retained as part of the public record of the site unless you request removal. Analytics data is retained in aggregate form and is not used to re-identify individual visitors.",
            },
            {
              title: "9. Data Security",
              body: "We use industry-standard safeguards — including encrypted connections (HTTPS), access-controlled databases, and row-level security on stored data — to protect your information against unauthorized access, alteration, or loss. No method of transmission or storage is perfectly secure, but we take reasonable steps to protect what you share with us.",
            },
            {
              title: "10. Your Rights",
              body: "Depending on where you live, you may have the right to access, correct, export, or delete your personal data, to withdraw consent at any time (e.g. unsubscribing from the newsletter), and to object to or restrict certain processing. To exercise any of these rights, contact impact@samuelgyasi.com — we will respond within 30 days.",
            },
            {
              title: "11. Children's Privacy",
              body: "This site is not directed at children under 13, and we do not knowingly collect personal information from children under that age. If you believe a child has provided us with personal data, please contact us so we can remove it.",
            },
            {
              title: "12. International Visitors",
              body: "This site is operated from Ghana and hosted using international infrastructure providers, which means your information may be processed in countries other than your own. We take steps to ensure any such processing meets the standards described in this policy.",
            },
            {
              title: "13. Changes to This Policy",
              body: "We may update this policy from time to time as the site and its features evolve. The date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance of the updated policy.",
            },
            {
              title: "14. Contact",
              body: "For any privacy-related questions or requests, reach out at impact@samuelgyasi.com.",
            },
          ].map(({ title, body }) => (
            <section key={title} style={{ marginBottom: "40px" }}>
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#f0ece4",
                  marginBottom: "10px",
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  color: "rgba(240,236,228,0.6)",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                {body}
              </p>
            </section>
          ))}

          <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(240,236,228,0.08)" }}>
            <Link
              href={localizedHref(lang, "/")}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#c9a84c",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ArrowLeft size={13} /> Back to Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
