import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and Cookie Policy for samuelgyasi.com",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pp-page">
      <style>{`
        .pp-page {
          min-height: 100vh;
          background: #080807;
          color: #f0ece4;
          font-family: 'Cormorant Garamond', serif;
          padding: 120px 56px 80px;
          max-width: 860px;
          margin: 0 auto;
        }
        .pp-back {
          font-family: 'Space Mono', monospace;
          font-size: 10px; letter-spacing: .22em;
          text-transform: uppercase;
          color: #7a7060; text-decoration: none;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 64px;
          transition: color .3s;
        }
        .pp-back:hover { color: #c9a84c; }
        .pp-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 9px; letter-spacing: .4em;
          text-transform: uppercase; color: #c9a84c;
          margin-bottom: 20px;
        }
        .pp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 700;
          color: #f0ece4;
          line-height: 1.0;
          margin-bottom: 16px;
        }
        .pp-updated {
          font-family: 'Space Mono', monospace;
          font-size: 9px; letter-spacing: .2em;
          text-transform: uppercase; color: #7a7060;
          margin-bottom: 60px;
        }
        .pp-rule { border: none; border-top: 1px solid rgba(240,236,228,.08); margin: 48px 0; }
        .pp-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #f0ece4; margin-bottom: 16px;
        }
        .pp-body {
          font-size: 17px; line-height: 1.85;
          color: #a09888; font-weight: 300;
          margin-bottom: 16px;
        }
        .pp-body a { color: #c9a84c; }
        .pp-list {
          margin: 12px 0 16px 20px;
          font-size: 17px; line-height: 1.85;
          color: #a09888; font-weight: 300;
        }
        .pp-list li { margin-bottom: 8px; }
        @media (max-width: 768px) {
          .pp-page { padding: 100px 24px 60px; }
        }
      `}</style>

      <Link href="/" className="pp-back">← Back Home</Link>

      <p className="pp-eyebrow">Legal</p>
      <h1 className="pp-title">Privacy Policy</h1>
      <p className="pp-updated">Last updated: March 2026</p>

      <p className="pp-body">
        This Privacy Policy explains how Samuel Kobina Gyasi (&ldquo;I&rdquo;, &ldquo;my&rdquo;, &ldquo;this
        website&rdquo;) collects, uses, and protects information when you visit{" "}
        <a href="https://samuelgyasi.com">samuelgyasi.com</a>.
      </p>

      <hr className="pp-rule" />

      <h2 className="pp-section-title">Information We Collect</h2>
      <p className="pp-body">When you use this website, the following data may be collected:</p>
      <ul className="pp-list">
        <li>
          <strong>Newsletter subscriptions:</strong> Your email address, submitted voluntarily
          through the subscription form.
        </li>
        <li>
          <strong>Contact messages:</strong> Your name, email, and message content when you
          submit the contact form.
        </li>
        <li>
          <strong>Usage data:</strong> Pages visited, time spent, and general browser/device
          information collected through analytics tools (only with your consent).
        </li>
        <li>
          <strong>Cookie data:</strong> See the Cookie Policy section below.
        </li>
      </ul>

      <hr className="pp-rule" />

      <h2 className="pp-section-title">How We Use Your Information</h2>
      <ul className="pp-list">
        <li>To send newsletters and reflections you have subscribed to.</li>
        <li>To respond to contact enquiries.</li>
        <li>To improve the website based on how visitors interact with it.</li>
        <li>We never sell or share your personal data with third parties for marketing.</li>
      </ul>

      <hr className="pp-rule" />

      <h2 id="cookies" className="pp-section-title">Cookie Policy</h2>
      <p className="pp-body">
        This website uses cookies — small text files stored on your device — to enhance your
        experience.
      </p>

      <p className="pp-body"><strong style={{ color: "#f0ece4" }}>Essential cookies</strong></p>
      <p className="pp-body">
        Required for the website to function correctly (e.g. session management, security).
        These cannot be disabled.
      </p>

      <p className="pp-body"><strong style={{ color: "#f0ece4" }}>Analytics cookies</strong></p>
      <p className="pp-body">
        Used to understand how visitors interact with the site (pages visited, time spent).
        These are only set with your explicit consent. You may decline them without affecting
        core site functionality.
      </p>

      <p className="pp-body">
        You can change your cookie preferences at any time by clearing your browser&apos;s local
        storage or reloading the page in a private window.
      </p>

      <hr className="pp-rule" />

      <h2 className="pp-section-title">Data Retention</h2>
      <p className="pp-body">
        Newsletter subscriber data is retained until you unsubscribe. Contact messages are
        retained for correspondence purposes and deleted upon request. Analytics data is
        aggregated and anonymised.
      </p>

      <hr className="pp-rule" />

      <h2 className="pp-section-title">Your Rights</h2>
      <p className="pp-body">You have the right to:</p>
      <ul className="pp-list">
        <li>Access the personal data held about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Withdraw consent at any time (e.g. unsubscribe from the newsletter).</li>
      </ul>
      <p className="pp-body">
        To exercise any of these rights, contact:{" "}
        <a href="mailto:impact@samuelgyasi.com">impact@samuelgyasi.com</a>
      </p>

      <hr className="pp-rule" />

      <h2 className="pp-section-title">Third-Party Services</h2>
      <p className="pp-body">
        This site uses{" "}
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
          Supabase
        </a>{" "}
        for database storage and{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          Vercel
        </a>{" "}
        for hosting. Both operate under their own privacy policies.
      </p>

      <hr className="pp-rule" />

      <h2 className="pp-section-title">Contact</h2>
      <p className="pp-body">
        Questions about this policy?{" "}
        <a href="mailto:impact@samuelgyasi.com">impact@samuelgyasi.com</a>
      </p>
    </div>
  );
}
