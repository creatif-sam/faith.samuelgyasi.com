// components/HoneypotField.tsx
"use client";

import type { RefObject } from "react";
import { HONEYPOT_FIELD_NAME } from "@/lib/bot-protection";

/**
 * Visually-hidden trap input. Positioned off-screen rather than
 * display:none/visibility:hidden, since some bots skip fields a CSS check
 * would flag as invisible but still fill anything merely off-screen.
 */
export function HoneypotField({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  return (
    <input
      ref={inputRef}
      type="text"
      name={HONEYPOT_FIELD_NAME}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}
