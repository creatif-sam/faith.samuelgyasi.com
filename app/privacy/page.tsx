import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/organisms/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How faith.samuelgyasi.com collects, uses, and protects your personal information.",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://faith.samuelgyasi.com";

export default function PrivacyPage() {
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
              fontFamily: "'Space Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              background: "linear-gradient(90deg,#ffde59,#ff914d)",
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
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.08em",
              marginBottom: "56px",
            }}
          >
            Last updated: May 2026
          </p>

          {[
            {
              title: "1. Who We Are",
              body: `This website (${siteUrl}) is operated by Samuel Kobina Gyasi — a personal platform for faith, writing, and ministry. Contact: impact@samuelgyasi.com`,
            },
            {
              title: "2. Information We Collect",
              body: "We collect your email address when you subscribe to the newsletter or submit a prayer request. We also collect basic analytics data (page views, referrers) to understand how the site is used. No sensitive personal data is collected.",
            },
            {
              title: "3. How We Use Your Information",
              body: "Your email address is used solely to send reflections, updates, and content you subscribed to. We do not sell, rent, or share your data with third parties for marketing purposes.",
            },
            {
              title: "4. Cookies",
              body: "This site uses a minimal cookie to store your language preference (EN/FR) and your consent choice. No third-party tracking cookies are set without your consent.",
            },
            {
              title: "5. Third-Party Services",
              body: "We use Supabase (database and authentication) and Vercel (hosting). Each service has its own privacy policy. Analytics data is processed without storing personally identifiable information.",
            },
            {
              title: "6. Your Rights",
              body: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact impact@samuelgyasi.com and we will respond within 30 days.",
            },
            {
              title: "7. Data Retention",
              body: "Newsletter subscriptions are retained until you unsubscribe. Prayer requests are retained for ministry purposes but are never made public.",
            },
            {
              title: "8. Changes to This Policy",
              body: "We may update this policy from time to time. The date at the top of this page reflects the most recent revision. Continued use of the site after changes constitutes acceptance.",
            },
            {
              title: "9. Contact",
              body: "For any privacy-related questions, reach out at impact@samuelgyasi.com.",
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
              href="/"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#c9a84c",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
