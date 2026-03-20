"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import Breadcrumbs from "@/components/atoms/Breadcrumbs";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import { Download, Star } from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  author: string | null;
  category: "ebook" | "review";
  description: string | null;
  rating: number | null;
  download_url: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export default function BookViewClient({ item }: { item: LibraryItem }) {
  const { lang } = useLang();
  
  const translations = {
    home: lang === "fr" ? "Accueil" : "Home",
    resources: lang === "fr" ? "Ressources" : "Resources",
    by: lang === "fr" ? "Par" : "By",
    about: lang === "fr" ? "À propos de ce livre" : "About this Book",
    download: lang === "fr" ? "Télécharger" : "Download",
    rating: lang === "fr" ? "Évaluation" : "Rating",
    back: lang === "fr" ? "← Retour aux ressources" : "← Back to Resources",
  };

  return (
    <>
      <div className="book-view-page">
        <style>{bookCss}</style>
        
        {/* Nav */}
        <nav className="bv-nav">
          <Link href="/resources" className="bv-back-link">{translations.back}</Link>
          <div className="bv-logo">Samuel Kobina Gyasi</div>
          <span />
        </nav>

        {/* Content */}
        <article className="bv-article">
          <Breadcrumbs
            items={[
              { label: translations.home, href: "/" },
              { label: translations.resources, href: "/resources" },
              { label: item.title },
            ]}
          />

          <div className="bv-content">
            <div className="bv-cover-section">
              {item.cover_url && (
                <img src={item.cover_url} alt={item.title} className="bv-cover" />
              )}
            </div>

            <div className="bv-info-section">
              <div className="bv-badge">{item.category === "ebook" ? "eBook" : "Book Review"}</div>
              <h1 className="bv-title">{item.title}</h1>
              
              {item.author && (
                <p className="bv-author">{translations.by} {item.author}</p>
              )}

              {item.category === "review" && item.rating && (
                <div className="bv-rating">
                  <span className="bv-rating-label">{translations.rating}:</span>
                  <div className="bv-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        fill={star <= item.rating! ? "#c9a84c" : "none"}
                        stroke={star <= item.rating! ? "#c9a84c" : "#7a7060"}
                      />
                    ))}
                  </div>
                </div>
              )}

              {item.description && (
                <div className="bv-description">
                  <h2 className="bv-section-title">{translations.about}</h2>
                  <p className="bv-description-text">{item.description}</p>
                </div>
              )}

              {item.category === "ebook" && item.download_url && (
                <a
                  href={item.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bv-download-btn"
                >
                  <Download size={18} />
                  {translations.download}
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
      
      <SiteFooter />
    </>
  );
}

const bookCss = `
.book-view-page {
  --bg: #080807;
  --bg2: #0e0d0b;
  --white: #f0ece4;
  --cream: #e8e0d0;
  --gold: #c9a84c;
  --dim: #7a7060;
  min-height: 100vh;
  background: var(--bg);
  color: var(--white);
  font-family: var(--font-poppins), 'Poppins', sans-serif;
}

.bv-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 22px 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(6, 6, 5, 0.96);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 222, 89, 0.08);
}

.bv-back-link {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--dim);
  text-decoration: none;
  transition: color 0.3s;
}

.bv-back-link:hover {
  color: #ffde59;
}

.bv-logo {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 17px;
  color: var(--white);
  letter-spacing: 0.06em;
}

.bv-article {
  max-width: 1000px;
  margin: 0 auto;
  padding: 140px 40px 80px;
}

.bv-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
  margin-top: 40px;
}

.bv-cover-section {
  position: sticky;
  top: 140px;
  height: fit-content;
}

.bv-cover {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(201, 168, 76, 0.1);
}

.bv-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
} .bv-badge {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ffde59, #ff914d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  width: fit-content;
}

.bv-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(32px, 5vw, 48px);
  color: var(--white);
  line-height: 1.1;
  margin: 0;
}

.bv-author {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: var(--dim);
  font-style: italic;
}

.bv-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 222, 89, 0.08);
  border-bottom: 1px solid rgba(255, 222, 89, 0.08);
}

.bv-rating-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--dim);
}

.bv-stars {
  display: flex;
  gap: 4px;
}

.bv-description {
  margin-top: 16px;
}

.bv-section-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: 24px;
  color: var(--white);
  margin-bottom: 16px;
}

.bv-description-text {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 17px;
  font-weight: 300;
  line-height: 1.8;
  color: rgba(245, 243, 239, 0.7);
}

.bv-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 16px 32px;
  background: linear-gradient(135deg, #ffde59, #ff914d);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  margin-top: 24px;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(255, 222, 89, 0.3);
}

.bv-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(255, 222, 89, 0.5);
}

@media (max-width: 768px) {
  .bv-nav {
    padding: 18px 24px;
  }
  
  .bv-article {
    padding: 130px 24px 60px;
  }
  
  .bv-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .bv-cover-section {
    position: relative;
    top: 0;
    max-width: 300px;
    margin: 0 auto;
  }
}
`;
