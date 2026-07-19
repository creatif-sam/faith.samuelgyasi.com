// atoms/FaithMandala.tsx — decorative rotating SVG mandala
"use client";
import React from "react";

export function FaithMandala() {
  return (
    <svg className="mandala" width="900" height="900" viewBox="-450 -450 900 900" aria-hidden="true">
      <g className="m1">
        <circle r="200" /><circle r="280" /><circle r="360" />
      </g>
      <g className="m2">
        <polygon className="m-poly" points="0,-320 277,160 -277,160" />
        <polygon className="m-poly" points="0,320 -277,-160 277,-160" />
      </g>
      <g className="m3">
        <circle r="120" />
        <line x1="-360" y1="0" x2="360" y2="0" stroke="#7b8ffc" strokeWidth=".3" opacity=".06" />
        <line x1="0" y1="-360" x2="0" y2="360" stroke="#7b8ffc" strokeWidth=".3" opacity=".06" />
        <line x1="-255" y1="-255" x2="255" y2="255" stroke="#7b8ffc" strokeWidth=".3" opacity=".04" />
        <line x1="255" y1="-255" x2="-255" y2="255" stroke="#7b8ffc" strokeWidth=".3" opacity=".04" />
      </g>
    </svg>
  );
}
