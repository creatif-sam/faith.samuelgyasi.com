"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { createAnonClient } from "@/lib/supabase/anon";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  created_at: string;
  read_time_minutes: number;
  featured_image_url: string | null;
}

const SAMPLE_POSTS: Post[] = [
  { id: "s1", title: "When the Word Becomes the Map: Navigating Life Abroad by Scripture", slug: "when-the-word-becomes-the-map", category: "faith", excerpt: "What does it mean to orient a 21st-century life by a 2,000-year-old text? Samuel explores the surprising coherence of Biblical wisdom and modern daily life.", created_at: "2026-03-01", read_time_minutes: 7, featured_image_url: null },
  { id: "s5", title: "On Gratitude as a Daily Discipline", slug: "on-gratitude", category: "faith", excerpt: "Four scholarships. Three countries. One life. Samuel reflects on the practice of gratitude not as an emotion but as a deliberate posture of the will before God.", created_at: "2025-11-10", read_time_minutes: 4, featured_image_url: null },
  { id: "s9", title: "What Proverbs 3:5 Taught Me About Uncertainty", slug: "proverbs-3-5-uncertainty", category: "faith", excerpt: '"Lean not on your own understanding." In a world driven by data and analysis, this ancient instruction is both counter-intuitive and deeply clarifying.', created_at: "2025-07-14", read_time_minutes: 4, featured_image_url: null },
  { id: "s13", title: "Walking by Faith, Not by Sight: A Meditation", slug: "walking-by-faith-not-by-sight", category: "faith", excerpt: "2 Corinthians 5:7 has become the compass of Samuel's life — a verse about trust rooted not in circumstances but in the unchanging character of God.", created_at: "2025-06-02", read_time_minutes: 5, featured_image_url: null },
  { id: "s14", title: "The Bible as Architecture: How Scripture Builds a Life", slug: "bible-as-architecture", category: "faith", excerpt: "More than a book of promises, the Bible is a blueprint for living. Samuel reflects on how consistent engagement with Scripture has restructured his thinking.", created_at: "2025-05-14", read_time_minutes: 6, featured_image_url: null },
  { id: "s15", title: "Prayer in the Desert: Lessons from Silence", slug: "prayer-in-the-desert", category: "faith", excerpt: "During a year of study in Morocco, the desert became an unlikely sanctuary. Samuel writes on discovering the power of contemplative prayer.", created_at: "2025-04-01", read_time_minutes: 5, featured_image_url: null },
  { id: "s16", title: "Lordship and Stewardship: A Christian View of Ambition", slug: "lordship-and-stewardship", category: "faith", excerpt: "Is ambition a sin or a gift? Samuel wrestles with the biblical tension between striving and surrendering, between drive and dependence on God.", created_at: "2025-03-10", read_time_minutes: 6, featured_image_url: null },
  { id: "s17", title: "The Sermon on the Mount as Life Policy", slug: "sermon-on-the-mount-life-policy", category: "faith", excerpt: "What if the Beatitudes were not poetry but policy? Samuel reads Matthew 5–7 as a practical manifesto for a counter-cultural, Spirit-led life.", created_at: "2025-02-20", read_time_minutes: 8, featured_image_url: null },
  { id: "s18", title: "Advent in Africa: Waiting as a Spiritual Discipline", slug: "advent-in-africa", category: "faith", excerpt: "In a culture that prizes speed and progress, Advent is a radical act. Samuel reflects on what the season of waiting reveals about trust and expectation.", created_at: "2024-12-01", read_time_minutes: 5, featured_image_url: null },
];

const CAT_MAP: Record<string, { label: string; cls: string; href: string }> = {
  faith:          { label: "Faith & Beliefs",  cls: "faith",    href: "/faith" },
  scripture:      { label: "Scripture",         cls: "faith",    href: "/faith" },
  prayer:         { label: "Prayer",            cls: "faith",    href: "/faith" },
  devotion:       { label: "Devotion",          cls: "faith",    href: "/faith" },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

const journalCss = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Unbounded:wght@300;400;600;700;900&family=Azeret+Mono:wght@300;400;500&display=swap');

.gyasi-journal {
  --parchment:  #f0ead8;
  --parchment2: #e8e0cc;
  --parchment3: #ddd4be;
  --ink:        #0e0d0a;
  --ink2:       #1e1c18;
  --ink-mid:    #4a4640;
  --ink-faint:  #8a8278;
  --rule:       rgba(14,13,10,.12);
  --faith:      #2d5a3d;
  --leadership: #8b6914;
  --intellect:  #1a3a5c;
  --transform:  #8b2020;
  --gold:       #c9a84c;
  min-height: 100vh;
  background: var(--parchment);
  color: var(--ink);
  font-family: 'Libre Baskerville', Georgia, serif;
  overflow-x: hidden;
}

/* Paper texture */
.gyasi-journal::before {
  content:'';
  position:fixed; inset:0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
  pointer-events:none; z-index:0; opacity:.6;
}

/* NAV / MASTHEAD */
.gj-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  background:var(--parchment);
  border-bottom:2px solid var(--ink);
}
.gj-masthead {
  display:flex; justify-content:space-between; align-items:center;
  padding:8px 56px;
  border-bottom:1px solid var(--rule);
}
.gj-back {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.2em; text-transform:uppercase;
  color:var(--ink-faint); text-decoration:none;
  display:flex; align-items:center; gap:8px;
  transition:color .25s;
}
.gj-back:hover { color:var(--ink); }
.gj-back::before { content:'←'; }
.gj-nav-date {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.15em; color:var(--ink-faint); text-transform:uppercase;
}
.gj-nav-issue {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.15em; color:var(--ink-faint); text-transform:uppercase;
}
.gj-title-row {
  text-align:center; padding:14px 56px 12px;
  position:relative;
}
.gj-journal-name {
  font-family:'Unbounded',sans-serif; font-weight:900;
  font-size:clamp(22px,3vw,38px);
  letter-spacing:-.01em; color:var(--ink);
  text-transform:uppercase;
}
.gj-tagline {
  font-family:'Libre Baskerville',serif; font-style:italic;
  font-size:11px; color:var(--ink-mid);
  margin-top:3px; letter-spacing:.08em;
}
.gj-topics {
  display:flex; justify-content:center; gap:0;
  border-top:1px solid var(--rule);
  flex-wrap:wrap;
}
.gj-topic-btn {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.2em; text-transform:uppercase;
  color:var(--ink); background:transparent; border:none;
  padding:8px 24px; border-right:1px solid var(--rule);
  transition:background .2s, color .2s; cursor:pointer;
}
.gj-topic-btn:first-child { border-left:1px solid var(--rule); }
.gj-topic-btn:hover { background:var(--ink); color:var(--parchment); }
.gj-topic-btn.active { background:var(--ink); color:var(--parchment); }
.gj-topic-btn.faith.active    { background:var(--faith); }
.gj-topic-btn.lead.active     { background:var(--leadership); }
.gj-topic-btn.intel.active    { background:var(--intellect); }
.gj-topic-btn.trans.active    { background:var(--transform); }

/* HERO / FRONT PAGE */
#gj-hero {
  padding:148px 56px 0;
  position:relative; z-index:1;
}
.gj-hero-rule { width:100%; height:3px; background:var(--ink); margin-bottom:4px; }
.gj-hero-rule2 { width:100%; height:1px; background:var(--ink); margin-bottom:40px; }

.gj-hero-layout {
  display:grid;
  grid-template-columns:1fr 2px 1fr 2px 1fr;
  gap:0;
  padding-bottom:48px;
  border-bottom:2px solid var(--ink);
}
.gj-col-divider { background:var(--rule); }

/* FEATURED */
.gj-feat {
  padding:0 40px 0 0;
  animation:gj-ink-in .9s .1s ease both;
}
@keyframes gj-ink-in {
  from{opacity:0;transform:translateY(12px);}
  to{opacity:1;transform:none;}
}

.gj-feat-cat {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.3em; text-transform:uppercase;
  padding:3px 10px; margin-bottom:16px; display:inline-block;
}
.gj-feat-cat.faith    { background:var(--faith);    color:white; }
.gj-feat-cat.lead     { background:var(--leadership);color:white; }
.gj-feat-cat.intel    { background:var(--intellect); color:white; }
.gj-feat-cat.trans    { background:var(--transform); color:white; }

.gj-feat-headline {
  font-family:'Unbounded',sans-serif; font-weight:700;
  font-size:clamp(22px,3vw,36px);
  line-height:1.05; letter-spacing:-.02em; color:var(--ink);
}
.gj-feat-deck {
  font-size:15px; font-style:italic; line-height:1.6;
  color:var(--ink-mid); margin-top:14px;
}
.gj-feat-meta {
  margin-top:20px; display:flex; align-items:center; gap:14px;
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.15em; text-transform:uppercase; color:var(--ink-faint);
}
.gj-feat-meta .dot::before { content:'·'; margin-right:14px; }
.gj-feat-body {
  margin-top:20px; font-size:15px; line-height:1.85;
  color:var(--ink2);
}
.gj-feat-body p+p { margin-top:14px; }
.gj-feat-readmore {
  margin-top:22px; display:inline-block;
  font-family:'Azeret Mono',monospace; font-size:10px;
  letter-spacing:.22em; text-transform:uppercase;
  color:var(--ink); border-bottom:1px solid var(--ink);
  padding-bottom:2px; text-decoration:none;
  transition:letter-spacing .3s;
}
.gj-feat-readmore:hover { letter-spacing:.3em; }

/* MIDDLE COL */
.gj-mid-col {
  padding:0 36px;
  display:flex; flex-direction:column; gap:32px;
  animation:gj-ink-in .9s .25s ease both;
}
.gj-mid-art { padding-bottom:28px; border-bottom:1px solid var(--rule); }
.gj-mid-art:last-child { border-bottom:none; }
.gj-mid-cat {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.3em; text-transform:uppercase;
  padding:2px 8px; margin-bottom:10px; display:inline-block;
}
.gj-mid-cat.faith    { background:var(--faith);    color:white; }
.gj-mid-cat.lead     { background:var(--leadership);color:white; }
.gj-mid-cat.intel    { background:var(--intellect); color:white; }
.gj-mid-cat.trans    { background:var(--transform); color:white; }
.gj-mid-headline {
  font-family:'Unbounded',sans-serif; font-weight:600;
  font-size:clamp(15px,1.6vw,19px);
  line-height:1.15; letter-spacing:-.01em; color:var(--ink);
}
.gj-mid-deck {
  font-size:13px; font-style:italic; color:var(--ink-mid);
  margin-top:8px; line-height:1.6;
}
.gj-mid-meta {
  margin-top:10px;
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.15em; text-transform:uppercase; color:var(--ink-faint);
}

/* RIGHT COL */
.gj-right-col {
  padding:0 0 0 36px;
  display:flex; flex-direction:column; gap:0;
  animation:gj-ink-in .9s .4s ease both;
}
.gj-right-col h3 {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.3em; text-transform:uppercase; color:var(--ink);
  padding-bottom:8px; border-bottom:2px solid var(--ink);
  margin-bottom:20px;
}
.gj-sidebar-item {
  display:flex; gap:14px;
  padding:14px 0; border-bottom:1px solid var(--rule);
  transition:background .2s;
}
.gj-si-num {
  font-family:'Unbounded',sans-serif; font-weight:900;
  font-size:20px; color:var(--parchment3);
  line-height:1; min-width:28px; padding-top:2px;
}
.gj-si-title {
  font-family:'Unbounded',sans-serif; font-weight:600;
  font-size:12px; line-height:1.3; letter-spacing:-.01em; color:var(--ink);
}
.gj-si-cat {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.15em; text-transform:uppercase;
  color:var(--ink-faint); margin-top:4px;
}
.gj-sidebar-quote {
  margin-top:28px; padding:20px 22px;
  background:var(--ink); color:var(--parchment);
}
.gj-sq-text {
  font-family:'Libre Baskerville',serif; font-style:italic;
  font-size:14px; line-height:1.6;
}
.gj-sq-attr {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.15em; text-transform:uppercase;
  color:var(--gold); margin-top:10px;
}

/* SECTION BANNER */
.gj-section-banner {
  padding:18px 56px;
  background:var(--ink); color:var(--parchment);
  display:flex; justify-content:space-between; align-items:center;
  position:relative; z-index:1;
}
.gj-sb-title {
  font-family:'Unbounded',sans-serif; font-weight:900;
  font-size:13px; letter-spacing:.15em; text-transform:uppercase;
}
.gj-sb-rule { flex:1; height:1px; background:rgba(240,234,216,.15); margin:0 24px; }
.gj-sb-count {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.2em; color:rgba(240,234,216,.5); text-transform:uppercase;
  white-space:nowrap;
}

/* ARTICLES GRID */
#gj-articles { padding:0 56px 80px; position:relative; z-index:1; }

.gj-filter-bar {
  display:flex; gap:0; padding:20px 0;
  border-bottom:1px solid var(--rule);
  margin-bottom:40px; flex-wrap:wrap;
}
.gj-filter-btn {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.22em; text-transform:uppercase;
  padding:7px 18px; border:1px solid var(--rule);
  border-right:none; background:transparent;
  color:var(--ink-faint); cursor:pointer;
  transition:all .25s;
}
.gj-filter-btn:last-child { border-right:1px solid var(--rule); }
.gj-filter-btn:hover, .gj-filter-btn.active { background:var(--ink); color:var(--parchment); border-color:var(--ink); }
.gj-filter-btn.active.faith    { background:var(--faith);    border-color:var(--faith); }
.gj-filter-btn.active.lead     { background:var(--leadership);border-color:var(--leadership); }
.gj-filter-btn.active.intel    { background:var(--intellect); border-color:var(--intellect); }
.gj-filter-btn.active.trans    { background:var(--transform); border-color:var(--transform); }

.gj-articles-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px; background:var(--rule);
}

.gj-card {
  background:var(--parchment);
  padding:36px 32px;
  position:relative;
  opacity:0; transform:translateY(16px);
  transition:opacity .6s ease, transform .6s ease, background .25s;
  cursor:pointer;
  text-decoration:none;
  display:block;
  color:inherit;
}
.gj-card.visible { opacity:1; transform:none; }
.gj-card:hover { background:var(--parchment2); }

.gj-card::before {
  content:'';
  position:absolute; top:0; left:0; right:0; height:3px;
  opacity:0; transition:opacity .3s;
}
.gj-card[data-cat="faith"]::before          { background:var(--faith); }
.gj-card[data-cat="leadership"]::before     { background:var(--leadership); }
.gj-card[data-cat="intellectuality"]::before{ background:var(--intellect); }
.gj-card[data-cat="transformation"]::before { background:var(--transform); }
.gj-card:hover::before { opacity:1; }
.gj-card.wide { grid-column:span 2; display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:start; }

.gj-ac-cat {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.28em; text-transform:uppercase;
  padding:2px 10px; margin-bottom:14px; display:inline-block;
}
.gj-ac-cat.faith          { background:var(--faith);       color:white; }
.gj-ac-cat.lead           { background:var(--leadership);  color:white; }
.gj-ac-cat.intel          { background:var(--intellect);   color:white; }
.gj-ac-cat.trans          { background:var(--transform);   color:white; }

.gj-ac-title {
  font-family:'Unbounded',sans-serif; font-weight:700;
  font-size:clamp(14px,1.4vw,18px);
  line-height:1.15; letter-spacing:-.01em; color:var(--ink);
  margin-bottom:10px;
}
.gj-ac-excerpt {
  font-size:13px; line-height:1.75; color:var(--ink-mid);
  font-style:italic;
}
.gj-ac-footer {
  margin-top:20px; padding-top:14px; border-top:1px solid var(--rule);
  display:flex; justify-content:space-between; align-items:center;
}
.gj-ac-meta {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.12em; text-transform:uppercase; color:var(--ink-faint);
}
.gj-ac-read {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.12em; text-transform:uppercase; color:var(--ink-faint);
}

/* NEWSLETTER SECTION */
#gj-newsletter {
  background:var(--ink); color:var(--parchment);
  padding:72px 56px;
  display:grid; grid-template-columns:1fr 1fr; gap:80px;
  align-items:center;
  position:relative; z-index:1;
}
.gj-nl-heading {
  font-family:'Unbounded',sans-serif; font-weight:900;
  font-size:clamp(28px,4vw,52px); letter-spacing:-.02em; line-height:.95;
}
.gj-nl-heading span { color:var(--gold); }
.gj-nl-subtext {
  font-size:16px; font-style:italic; font-weight:300;
  color:rgba(240,234,216,.6); margin-top:18px; line-height:1.6;
}
.gj-nl-form { display:flex; flex-direction:column; gap:12px; }
.gj-nl-label {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.25em; text-transform:uppercase;
  color:rgba(240,234,216,.5); margin-bottom:4px;
}
.gj-nl-input {
  width:100%; padding:14px 18px;
  background:rgba(240,234,216,.06);
  border:1px solid rgba(240,234,216,.15);
  color:var(--parchment); font-family:'Libre Baskerville',serif;
  font-size:15px; font-style:italic; outline:none;
  transition:border-color .3s;
}
.gj-nl-input::placeholder { color:rgba(240,234,216,.3); }
.gj-nl-input:focus { border-color:var(--gold); }
.gj-nl-btn {
  padding:14px 32px; background:var(--gold);
  border:none; color:var(--ink);
  font-family:'Azeret Mono',monospace; font-size:10px;
  letter-spacing:.28em; text-transform:uppercase;
  cursor:pointer; transition:background .25s, letter-spacing .25s;
  align-self:flex-start;
}
.gj-nl-btn:hover { background:var(--parchment); letter-spacing:.35em; }
.gj-nl-note {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.12em; color:rgba(240,234,216,.3);
  text-transform:uppercase; margin-top:4px;
}

/* TOPICS */
#gj-topics {
  padding:56px;
  border-top:1px solid var(--rule);
  border-bottom:2px solid var(--ink);
  display:flex; gap:32px; align-items:center;
  flex-wrap:wrap;
  position:relative; z-index:1;
}
.gj-topics-label {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.28em; text-transform:uppercase; color:var(--ink-faint);
  white-space:nowrap;
}
.gj-topic-tags { display:flex; flex-wrap:wrap; gap:8px; }
.gj-tag {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.18em; text-transform:uppercase;
  padding:5px 14px; border:1px solid var(--rule);
  color:var(--ink-mid); text-decoration:none;
  transition:all .25s;
}
.gj-tag:hover { background:var(--ink); color:var(--parchment); border-color:var(--ink); }

/* FOOTER */
.gj-footer {
  background:var(--ink); color:var(--parchment);
  padding:40px 56px;
  display:grid; grid-template-columns:1fr auto 1fr;
  align-items:center;
  border-top:3px solid var(--gold);
  position:relative; z-index:1;
}
.gj-f-name {
  font-family:'Unbounded',sans-serif; font-weight:900;
  font-size:14px; letter-spacing:.1em; text-transform:uppercase;
}
.gj-f-center {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.2em; text-transform:uppercase;
  color:rgba(240,234,216,.35); text-align:center;
}
.gj-f-links {
  display:flex; gap:24px; justify-content:flex-end; flex-wrap:wrap;
}
.gj-f-link {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.18em; text-transform:uppercase;
  color:var(--gold); text-decoration:none; transition:color .25s;
}
.gj-f-link:hover { color:var(--parchment); }

/* SEARCH BAR */
.gj-search-wrap {
  padding:16px 56px;
  background:var(--parchment);
  border-bottom:1px solid var(--rule);
  position:sticky; top:106px; z-index:150;
}
.gj-search-inner {
  display:flex; align-items:center; gap:12px;
  max-width:600px;
}
.gj-search-icon {
  font-size:14px; color:var(--ink-faint); flex-shrink:0;
}
.gj-search-input {
  flex:1; background:transparent; border:none; border-bottom:1px solid var(--rule);
  font-family:'Libre Baskerville',serif; font-style:italic; font-size:15px;
  color:var(--ink); padding:6px 0; outline:none;
  transition:border-color .25s;
}
.gj-search-input::placeholder { color:var(--ink-faint); }
.gj-search-input:focus { border-bottom-color:var(--gold); }
.gj-search-clear {
  background:none; border:none; color:var(--ink-faint); cursor:pointer;
  font-size:16px; padding:0; line-height:1; transition:color .2s;
  flex-shrink:0;
}
.gj-search-clear:hover { color:var(--ink); }
.gj-search-count {
  font-family:'Azeret Mono',monospace; font-size:9px;
  letter-spacing:.18em; text-transform:uppercase; color:var(--ink-faint);
  white-space:nowrap;
}
.gj-no-results {
  padding:60px 56px; text-align:center;
  font-family:'Libre Baskerville',serif; font-style:italic;
  font-size:17px; color:var(--ink-mid);
}
  .gj-hero-layout { grid-template-columns:1fr 2px 1fr; }
  .gj-right-col { display:none; }
  .gj-articles-grid { grid-template-columns:1fr 1fr; }
  .gj-card.wide { grid-column:span 2; }
}
@media(max-width:760px){
  .gj-nav { position:fixed; }
  .gj-masthead { padding:8px 20px; }
  .gj-title-row { padding:10px 20px 8px; }
  .gj-topics { }
  .gj-topic-btn { padding:6px 12px; font-size:8px; }
  #gj-hero { padding: 160px 20px 0; }
  .gj-hero-layout { grid-template-columns:1fr; }
  .gj-col-divider { display:none; }
  .gj-feat { padding:0; margin-bottom:32px; }
  .gj-mid-col { padding:0; }
  #gj-articles { padding-left:20px; padding-right:20px; }
  .gj-articles-grid { grid-template-columns:1fr; }
  .gj-card.wide { grid-column:span 1; display:block; }
  #gj-newsletter { grid-template-columns:1fr; gap:40px; padding:40px 20px; }
  #gj-topics { padding:32px 20px; }
  .gj-section-banner { padding:14px 20px; }
  .gj-footer { grid-template-columns:1fr; gap:16px; padding:28px 20px; }
  .gj-f-links { justify-content:flex-start; }
}

/* SEARCH BAR */
.gj-search-wrap {
  padding:14px 56px;
  background:var(--parchment);
  border-bottom:2px solid var(--ink);
  position:sticky; top:106px; z-index:150;
}
.gj-search-inner {
  display:flex; align-items:center; gap:12px; max-width:640px;
}
.gj-search-icon { font-size:13px; color:var(--ink-faint); flex-shrink:0; }
.gj-search-input {
  flex:1; background:transparent; border:none;
  border-bottom:1px solid var(--rule);
  font-family:'Libre Baskerville',serif; font-style:italic; font-size:14px;
  color:var(--ink); padding:6px 0; outline:none; transition:border-color .25s;
}
.gj-search-input::placeholder { color:var(--ink-faint); }
.gj-search-input:focus { border-bottom-color:var(--gold); }
.gj-search-clear {
  background:none; border:none; color:var(--ink-faint); cursor:pointer;
  font-size:18px; padding:0; line-height:1; transition:color .2s; flex-shrink:0;
}
.gj-search-clear:hover { color:var(--ink); }
.gj-search-count {
  font-family:'Azeret Mono',monospace; font-size:8px;
  letter-spacing:.18em; text-transform:uppercase; color:var(--ink-faint); white-space:nowrap;
}
@media(max-width:760px) {
  .gj-search-wrap { padding:12px 20px; top:90px; }
}
`;

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // sync search from URL on mount
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    if (q) setSearch(q);
  }, []);

  function handleSearch(val: string) {
    setSearch(val);
    const url = new URL(window.location.href);
    if (val.trim()) url.searchParams.set("q", val);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }

  const load = useCallback(async () => {
    try {
      const sb = createAnonClient();
      const { data } = await sb
        .from("blog_posts")
        .select("id, title, slug, category, excerpt, created_at, read_time_minutes, featured_image_url")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) setPosts(data);
    } catch {
      // fallback to sample
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".gj-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts, filter]);

  const searchTerm = search.trim().toLowerCase();
  const byFilter = filter === "all" ? posts : posts.filter((p) => p.category === filter);
  const displayed = searchTerm
    ? byFilter.filter((p) =>
        p.title.toLowerCase().includes(searchTerm) ||
        (p.excerpt ?? "").toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      )
    : byFilter;
  const featured = displayed[0];
  const midPosts = displayed.slice(1, 4);
  const allPosts = displayed;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const sb = createAnonClient();
      const { error } = await sb.from("newsletter_subscribers").insert({ email: email.trim() });
      if (error) throw error;
      setSubMsg("Subscribed! Thank you.");
      setEmail("");
    } catch {
      setSubMsg("You are already subscribed or there was an error.");
    }
  }

  function getCatCls(cat: string) {
    if (cat === "faith") return "faith";
    if (cat === "leadership") return "lead";
    if (cat === "intellectuality") return "intel";
    if (cat === "transformation") return "trans";
    return "";
  }

  return (
    <div className="gyasi-journal">
      <style>{journalCss}</style>

      {/* NAV */}
      <nav className="gj-nav">
        <div className="gj-masthead">
          <Link href="/faith" className="gj-back">Faith</Link>
          <div className="gj-nav-date">{dateStr}</div>
          <div className="gj-nav-issue">The Journal · Vol. I</div>
        </div>
        <div className="gj-title-row">
          <div className="gj-journal-name">The Faith Journal</div>
          <div className="gj-tagline">Reflections on Scripture, Prayer &amp; Walking with God</div>
        </div>
        <div className="gj-topics">
          {[
            { key: "all", label: "All Reflections", cls: "" },
            { key: "faith", label: "Faith & Beliefs", cls: "faith" },
            { key: "scripture", label: "Scripture", cls: "faith" },
            { key: "prayer", label: "Prayer", cls: "faith" },
          ].map((t) => (
            <button
              key={t.key}
              className={`gj-topic-btn ${t.cls} ${filter === t.key ? "active" : ""}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* SEARCH BAR */}
      <div className="gj-search-wrap">
        <div className="gj-search-inner">
          <span className="gj-search-icon">◎</span>
          <input
            ref={searchRef}
            type="text"
            className="gj-search-input"
            placeholder="Search reflections, scripture, topics…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search articles"
          />
          {search && (
            <button className="gj-search-clear" onClick={() => handleSearch("")} aria-label="Clear search">&times;</button>
          )}
          {search && (
            <span className="gj-search-count">{displayed.length} result{displayed.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      {/* HERO */}
      <section id="gj-hero">
        <div className="gj-hero-rule" />
        <div className="gj-hero-rule2" />

        <div className="gj-hero-layout">
          {/* FEATURED */}
          <div className="gj-feat">
            {featured ? (
              <>
                <div className={`gj-feat-cat ${getCatCls(featured.category)}`}>
                  {CAT_MAP[featured.category]?.label ?? featured.category}
                </div>
                <h1 className="gj-feat-headline">{featured.title}</h1>
                {featured.excerpt && <p className="gj-feat-deck">{featured.excerpt}</p>}
                <div className="gj-feat-meta">
                  <span>Samuel K. Gyasi</span>
                  <span className="dot">{fmt(featured.created_at)}</span>
                  <span className="dot">{featured.read_time_minutes} min read</span>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="gj-feat-readmore"
                >
                  Continue Reading →
                </Link>
              </>
            ) : (
              <p style={{ fontStyle: "italic", color: "var(--ink-faint)" }}>No posts yet.</p>
            )}
          </div>

          <div className="gj-col-divider" />

          {/* MIDDLE */}
          <div className="gj-mid-col">
            {midPosts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="gj-mid-art">
                  <div className={`gj-mid-cat ${getCatCls(p.category)}`}>
                    {CAT_MAP[p.category]?.label ?? p.category}
                  </div>
                  <div className="gj-mid-headline">{p.title}</div>
                  {p.excerpt && <div className="gj-mid-deck">{p.excerpt}</div>}
                  <div className="gj-mid-meta">Samuel K. Gyasi · {fmt(p.created_at)} · {p.read_time_minutes} min</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="gj-col-divider" />

          {/* SIDEBAR */}
          <div className="gj-right-col">
            <h3>Most Recent</h3>
            {allPosts.slice(0, 5).map((p, i) => (
              <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="gj-sidebar-item">
                  <div className="gj-si-num">0{i + 1}</div>
                  <div>
                    <div className="gj-si-title">{p.title}</div>
                    <div className="gj-si-cat">{CAT_MAP[p.category]?.label ?? p.category} · {p.read_time_minutes} min</div>
                  </div>
                </div>
              </Link>
            ))}
            <div className="gj-sidebar-quote">
              <div className="gj-sq-text">&ldquo;Trust in the Lord with all your heart, and do not lean on your own understanding.&rdquo;</div>
              <div className="gj-sq-attr">— Proverbs 3:5</div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL ARTICLES */}
      <div className="gj-section-banner">
        <span className="gj-sb-title">{search ? `Search: "${search}"` : "All Articles"}</span>
        <span className="gj-sb-rule" />
        <span className="gj-sb-count">{allPosts.length} {allPosts.length === 1 ? "Essay" : "Essays & Reflections"}</span>
      </div>

      <section id="gj-articles">
        <div className="gj-filter-bar">
          {[
            { key: "all", label: "All Reflections", cls: "" },
            { key: "faith", label: "Faith & Beliefs", cls: "faith" },
            { key: "scripture", label: "Scripture", cls: "faith" },
            { key: "prayer", label: "Prayer", cls: "faith" },
          ].map((t) => (
            <button
              key={t.key}
              className={`gj-filter-btn ${t.cls} ${filter === t.key ? "active" : ""}`}
              onClick={() => setFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="gj-articles-grid">
          {allPosts.length === 0 && (
            <div style={{ gridColumn:"1/-1", padding:"72px 24px", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-playfair),'Playfair Display',serif", fontSize:"32px", fontStyle:"italic", color:"rgba(245,243,239,.25)", marginBottom:"16px" }}>
                ◆
              </div>
              <p style={{ fontFamily:"var(--font-cormorant),'Cormorant Garamond',serif", fontSize:"19px", fontStyle:"italic", color:"rgba(245,243,239,.4)" }}>
                No essays match &ldquo;{search}&rdquo;. Try a different term or <button onClick={() => handleSearch("")} style={{ background:"none", border:"none", cursor:"pointer", textDecoration:"underline", color:"rgba(201,168,76,.7)", fontSize:"inherit", fontFamily:"inherit", fontStyle:"inherit" }}>clear the search</button>.
              </p>
            </div>
          )}
          {allPosts.map((p, i) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className={`gj-card${i === 0 ? " wide" : ""}`}
              data-cat={p.category}
            >
              {i === 0 ? (
                <>
                  <div>
                    <div className={`gj-ac-cat ${getCatCls(p.category)}`}>
                      {CAT_MAP[p.category]?.label ?? p.category}
                    </div>
                    <div className="gj-ac-title">{p.title}</div>
                    <div className="gj-ac-footer">
                      <span className="gj-ac-meta">{fmt(p.created_at)}</span>
                      <span className="gj-ac-read">{p.read_time_minutes} min read</span>
                    </div>
                  </div>
                  <div className="gj-ac-excerpt">{p.excerpt}</div>
                </>
              ) : (
                <>
                  <div className={`gj-ac-cat ${getCatCls(p.category)}`}>
                    {CAT_MAP[p.category]?.label ?? p.category}
                  </div>
                  <div className="gj-ac-title">{p.title}</div>
                  {p.excerpt && <div className="gj-ac-excerpt">{p.excerpt}</div>}
                  <div className="gj-ac-footer">
                    <span className="gj-ac-meta">{fmt(p.created_at)}</span>
                    <span className="gj-ac-read">{p.read_time_minutes} min read</span>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* TOPICS CLOUD */}
      <div id="gj-topics">
        <span className="gj-topics-label">Browse by Topic</span>
        <div className="gj-topic-tags">
          {["Scripture", "Prayer", "Gratitude", "Trust in God", "Biblical Wisdom", "Discipleship", "Christology", "Psalms", "New Testament", "Gospel", "Holy Spirit", "Faith Over Fear", "Providence", "Worship", "Servanthood"].map((tag) => (
            <span key={tag} className="gj-tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* NEWSLETTER */}
      <section id="gj-newsletter">
        <div>
          <div className="gj-nl-heading">Subscribe to<br /><span>The Faith Journal</span></div>
          <p className="gj-nl-subtext">New reflections on Scripture, prayer, and walking with God — delivered when the writing is ready. No noise. Just the Word.</p>
        </div>
        <form className="gj-nl-form" onSubmit={handleSubscribe}>
          <div className="gj-nl-label">Your Email Address</div>
          <input
            type="email"
            className="gj-nl-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="gj-nl-btn">Subscribe to the Journal</button>
          {subMsg ? (
            <div className="gj-nl-note" style={{ color: "var(--gold)" }}>{subMsg}</div>
          ) : (
            <div className="gj-nl-note">No spam. No schedule. Just writing worth reading.</div>
          )}
        </form>
      </section>

      {/* FOOTER */}
      <footer className="gj-footer">
        <div className="gj-f-name">The Faith Journal</div>
        <div className="gj-f-center">© {today.getFullYear()} Samuel Kobina Gyasi · Walking by Faith</div>
        <div className="gj-f-links">
          <Link href="/faith" className="gj-f-link">Faith</Link>
          <Link href="/blog" className="gj-f-link">Journal</Link>
          <Link href="/my-story" className="gj-f-link">My Story</Link>
        </div>
      </footer>
    </div>
  );
}
