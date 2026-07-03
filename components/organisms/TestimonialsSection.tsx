import { createAnonClient } from "@/lib/supabase/anon";
import { TestimonialSubmitForm } from "./TestimonialSubmitForm";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createAnonClient();
    const { data } = await supabase
      .from("testimonials")
      .select("id,name,role,company,avatar_url,quote,rating")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(12);
    return data ?? [];
  } catch {
    return [];
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="ts-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "ts-star ts-star--on" : "ts-star ts-star--off"}>
          ★
        </span>
      ))}
    </div>
  );
}

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section id="testimonials" className="ts-section">
      <div className="ts-inner">
        <div className="ts-header">
          <div className="ts-label">
            <span className="ts-label-line" />
            Testimonials
          </div>
          <h2 className="ts-headline">
            Words from <em>Those Who Know</em>
          </h2>
          <p className="ts-sub">
            Voices of those who have walked alongside, been mentored by, or collaborated with Samuel.
          </p>
        </div>

        {testimonials.length > 0 && (
        <div className="ts-grid">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`ts-card ${idx === 0 ? "ts-card--featured" : ""}`}
            >
              <StarRating rating={t.rating} />
              <blockquote className="ts-quote">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="ts-author">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.name}
                    className="ts-avatar"
                    loading="lazy"
                  />
                ) : (
                  <div className="ts-avatar-initials">
                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                )}
                <div className="ts-author-info">
                  <div className="ts-author-name">{t.name}</div>
                  {(t.role || t.company) && (
                    <div className="ts-author-role">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <TestimonialSubmitForm />
      </div>
    </section>
  );
}
