"use client";

interface EvaluationModalProps {
  lang: string;
  rating: number;
  setRating: (v: number) => void;
  hoveredRating: number;
  setHoveredRating: (v: number) => void;
  pragmatic: boolean;
  setPragmatic: (v: boolean) => void;
  faithBuilding: boolean;
  setFaithBuilding: (v: boolean) => void;
  clear: boolean;
  setClear: (v: boolean) => void;
  confusing: boolean;
  setConfusing: (v: boolean) => void;
  relatedToMe: boolean;
  setRelatedToMe: (v: boolean) => void;
  feedbackText: string;
  setFeedbackText: (v: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  translations: {
    evalTitle: string;
    evalSub: string;
    rateLabel: string;
    categoriesLabel: string;
    pragmaticLabel: string;
    faithLabel: string;
    clearLabel: string;
    confusingLabel: string;
    relatedLabel: string;
    commentLabel: string;
    submitBtn: string;
    skipBtn: string;
  };
}

export function EvaluationModal({
  lang,
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  pragmatic,
  setPragmatic,
  faithBuilding,
  setFaithBuilding,
  clear,
  setClear,
  confusing,
  setConfusing,
  relatedToMe,
  setRelatedToMe,
  feedbackText,
  setFeedbackText,
  submitting,
  onClose,
  onSubmit,
  translations,
}: EvaluationModalProps) {
  return (
    <div className="eval-modal-overlay" onClick={onClose}>
      <div className="eval-modal" onClick={(e) => e.stopPropagation()}>
        <button className="eval-close" onClick={onClose}>×</button>

        <div className="eval-header">
          <h3>{translations.evalTitle}</h3>
          <p>{translations.evalSub}</p>
        </div>

        <div className="eval-body">
          <label className="eval-label">
            {translations.rateLabel} <span className="eval-required">*</span>
          </label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={star <= (hoveredRating || rating) ? "star-active" : ""}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                {star <= (hoveredRating || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>

          <label className="eval-label eval-label-categories">
            {translations.categoriesLabel || "What resonated with you?"}
          </label>
          <div className="eval-checkboxes">
            {[
              { label: translations.pragmaticLabel, checked: pragmatic, onChange: setPragmatic },
              { label: translations.faithLabel, checked: faithBuilding, onChange: setFaithBuilding },
              { label: translations.clearLabel, checked: clear, onChange: setClear },
              { label: translations.confusingLabel, checked: confusing, onChange: setConfusing },
              { label: translations.relatedLabel, checked: relatedToMe, onChange: setRelatedToMe },
            ].map(({ label, checked, onChange }) => (
              <label key={label} className="eval-checkbox-label">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <label className="eval-label eval-label-comment">{translations.commentLabel}</label>
          <textarea
            className="eval-textarea"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={lang === "fr" ? "Partagez vos réflexions (optionnel)..." : "Share your thoughts (optional)..."}
            rows={4}
          />
        </div>

        <div className="eval-actions">
          <button type="button" className="eval-btn eval-btn-skip" onClick={onClose}>
            {translations.skipBtn}
          </button>
          <button
            type="button"
            className="eval-btn eval-btn-submit"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "..." : translations.submitBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
