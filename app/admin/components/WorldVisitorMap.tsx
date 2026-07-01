"use client";
import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import worldTopology from "world-atlas/countries-110m.json";
import { ISO_NUMERIC_TO_ALPHA2 } from "./isoNumericToAlpha2";

interface Props {
  countryViews: { country: string; count: number }[];
}

const WIDTH = 960;
const HEIGHT = 460;

export default function WorldVisitorMap({ countryViews }: Props) {
  const [hover, setHover] = useState<{ name: string; count: number; x: number; y: number } | null>(null);

  const countsByAlpha2 = useMemo(() => {
    const m = new Map<string, number>();
    countryViews.forEach(({ country, count }) => m.set(country, count));
    return m;
  }, [countryViews]);

  const maxCount = useMemo(() => Math.max(1, ...countryViews.map((c) => c.count)), [countryViews]);

  const { features, path } = useMemo(() => {
    const topo = worldTopology as unknown as Topology;
    const geo = feature(topo, topo.objects.countries as GeometryCollection);
    const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], geo);
    return { features: geo.features, path: geoPath(projection) };
  }, []);

  function countFor(id: string): number {
    const alpha2 = ISO_NUMERIC_TO_ALPHA2[id];
    return (alpha2 ? countsByAlpha2.get(alpha2) : undefined) ?? 0;
  }

  function colorFor(count: number) {
    if (!count) return "rgba(255,255,255,.05)";
    const t = Math.min(1, Math.log(count + 1) / Math.log(maxCount + 1));
    return `rgba(212,168,67,${(0.15 + t * 0.75).toFixed(3)})`;
  }

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {features.map((f, i) => {
          const id = String(f.id);
          const count = countFor(id);
          const name = (f.properties as { name?: string } | null)?.name ?? "Unknown";
          return (
            <path
              key={f.id != null ? id : `feature-${i}`}
              d={path(f) ?? undefined}
              fill={colorFor(count)}
              stroke="rgba(255,255,255,.08)"
              strokeWidth={0.5}
              onMouseMove={(e) => setHover({ name, count, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: count ? "pointer" : "default" }}
            />
          );
        })}
      </svg>
      {hover && (
        <div
          className="font-poppins text-[11px] text-white/80 shadow-lg"
          style={{
            position: "fixed", left: hover.x + 12, top: hover.y + 12, zIndex: 50,
            background: "#14151d", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8,
            padding: "6px 10px", pointerEvents: "none",
          }}
        >
          <div className="font-semibold">{hover.name}</div>
          <div className="text-white/40">{hover.count} view{hover.count !== 1 ? "s" : ""}</div>
        </div>
      )}
    </div>
  );
}
