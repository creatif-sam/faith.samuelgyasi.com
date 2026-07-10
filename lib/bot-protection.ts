// lib/bot-protection.ts
// Shared honeypot + time-trap constants and server-side validation, used by
// every public form (comments, newsletter, evaluations, contact, testimonials...).
//
// Two signals, both defeated by real users but trivial for unsophisticated
// bots/scripts to trip:
//  1. Honeypot field — visually hidden (off-screen, not display:none) input.
//     Bots that blindly fill every field in the DOM fill it; humans never see it.
//  2. Time-trap — a form submitted faster than a human could plausibly read
//     and fill it (script fills + POSTs instantly) is rejected.
//
// This is intentionally not a CAPTCHA: no third-party dependency, no friction
// for real visitors, and it stops the overwhelming majority of spam traffic.

export const HONEYPOT_FIELD_NAME = "hp_website";
export const FORM_TIMESTAMP_FIELD_NAME = "hp_ts";
export const MIN_FILL_TIME_MS = 1500;

/**
 * Server-side check for API routes. Pass the parsed request body — it should
 * include the two fields above (sent by useHoneypot's `getFields()`).
 * Missing/invalid timestamp is treated as a bot (a real form always sends one).
 */
export function isBotSubmission(
  body: Record<string, unknown>,
  minFillTimeMs: number = MIN_FILL_TIME_MS
): boolean {
  const honeypot = body[HONEYPOT_FIELD_NAME];
  if (typeof honeypot === "string" && honeypot.trim().length > 0) return true;

  const renderedAt = Number(body[FORM_TIMESTAMP_FIELD_NAME]);
  if (!renderedAt || Number.isNaN(renderedAt)) return true;

  const elapsed = Date.now() - renderedAt;
  if (elapsed < minFillTimeMs) return true;

  return false;
}
