// lib/useHoneypot.ts
"use client";

import { useRef } from "react";
import { HONEYPOT_FIELD_NAME, FORM_TIMESTAMP_FIELD_NAME, MIN_FILL_TIME_MS } from "./bot-protection";

/**
 * Attach to every public form. Renders a hidden trap field via `inputRef`
 * (see components/HoneypotField.tsx) and exposes `isBot()` for a client-only
 * gate (direct-to-Supabase forms) or `getFields()` to send along to an API
 * route for a server-enforced check (see lib/bot-protection.ts).
 */
export function useHoneypot() {
  const mountedAt = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  function isBot(minFillTimeMs: number = MIN_FILL_TIME_MS): boolean {
    if (inputRef.current?.value) return true;
    if (Date.now() - mountedAt.current < minFillTimeMs) return true;
    return false;
  }

  function getFields(): Record<string, string | number> {
    return {
      [HONEYPOT_FIELD_NAME]: inputRef.current?.value ?? "",
      [FORM_TIMESTAMP_FIELD_NAME]: mountedAt.current,
    };
  }

  return { inputRef, isBot, getFields };
}
