"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  /** Current rating (or, for interactive mode, the committed value). */
  rating: number;
  max?: number;
  /** Icon size in px. */
  size?: number;
  /** Gap between stars in px. */
  gap?: number;
  color?: string;
  emptyColor?: string;
  className?: string;
  /** Renders clickable stars with hover preview and calls onChange. */
  interactive?: boolean;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

/** Shared star-rating display/picker used across testimonials, reviews, and admin rating fields. */
export function StarRating({
  rating,
  max = 5,
  size = 14,
  gap = 3,
  color = "#c9a84c",
  emptyColor = "rgba(201,168,76,.25)",
  className,
  interactive = false,
  onChange,
  disabled = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const activeCount = interactive && hovered > 0 ? hovered : rating;

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap }}
      {...(!interactive ? { role: "img", "aria-label": `${rating} out of ${max}` } : {})}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const filled = n <= activeCount;
        const star = (
          <Star
            size={size}
            fill={filled ? color : "none"}
            stroke={filled ? color : emptyColor}
            strokeWidth={filled ? 0 : 1.75}
          />
        );

        if (!interactive) {
          return (
            <span key={n} style={{ display: "inline-flex" }}>
              {star}
            </span>
          );
        }

        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            disabled={disabled}
            style={{
              display: "inline-flex",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              lineHeight: 0,
              cursor: disabled ? "default" : "pointer",
              transition: "transform .15s ease",
              transform: interactive && hovered === n ? "scale(1.12)" : "scale(1)",
            }}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
