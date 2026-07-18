export const visualStyles = `

.visual-pg {
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  position: relative;
}
.visual-pg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(ellipse at 20% 60%, rgba(201,168,76,.04) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
}
.visual-pg > * { position: relative; z-index: 1; }

/* ── HEADER ── */
.visual-header {
  padding: 140px 8% 64px;
  border-bottom: 1px solid rgba(201,168,76,.1);
  max-width: 1100px; margin: 0 auto;
}
.visual-back {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: color-mix(in srgb, var(--white) 40%, transparent); text-decoration: none;
  display: flex; align-items: center; gap: 8px; margin-bottom: 40px;
  transition: color .25s;
}
.visual-back:hover { color: var(--gold); }
.visual-eyebrow {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 10px; letter-spacing: .35em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 20px;
  opacity: 0; animation: vis-rise .9s .1s ease forwards;
}
.visual-headline {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(44px, 7vw, 96px); font-weight: 900;
  line-height: .9; letter-spacing: -.03em;
  color: var(--white); text-transform: uppercase;
  opacity: 0; animation: vis-rise .9s .25s ease forwards;
}
.visual-headline em {
  font-style: italic; font-weight: 400;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  display: block;
}
.visual-rule {
  width: 56px; height: 2px;
  background: linear-gradient(90deg,#ffde59,#ff914d);
  margin: 24px 0;
  opacity: 0; animation: vis-rise .9s .4s ease forwards;
}
.visual-sub {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: clamp(16px, 1.8vw, 20px); font-weight: 300;
  color: color-mix(in srgb, var(--white) 60%, transparent); max-width: 520px; line-height: 1.7;
  opacity: 0; animation: vis-rise .9s .5s ease forwards;
}
@keyframes vis-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* ── GRID ── */
.visual-grid {
  max-width: 1100px; margin: 0 auto;
  padding: 72px 8% 100px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}
.video-card {
  background: rgba(14,13,11,.9);
  border: 1px solid rgba(201,168,76,.08);
  overflow: hidden;
  opacity: 0; transform: translateY(18px);
  transition: opacity .7s ease, transform .7s ease, border-color .3s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}
.video-card.vis-visible { opacity: 1; transform: none; }
.video-card:hover { border-color: rgba(201,168,76,.22); }
.video-thumbnail {
  width: 100%; aspect-ratio: 16/9;
  background: rgba(201,168,76,.08);
  border-bottom: 1px solid rgba(201,168,76,.12);
  position: relative;
  overflow: hidden;
}
.video-thumbnail img {
  width: 100%; height: 100%; object-fit: cover;
}
.video-thumbnail::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity .3s;
}
.video-card:hover .video-thumbnail::after {
  opacity: 1;
}
.video-play-icon {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 60px; height: 60px;
  background: rgba(255,255,255,.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  opacity: 0;
  transition: opacity .3s, transform .3s;
  pointer-events: none;
}
.video-card:hover .video-play-icon {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1);
}
.video-info {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.video-cat {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px; letter-spacing: .25em; text-transform: uppercase;
  background: var(--gold-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.video-title {
  font-family: var(--font-playfair), 'Playfair Display', serif;
  font-size: clamp(18px, 2vw, 24px); font-weight: 700;
  color: var(--white); line-height: 1.2;
}
.video-desc {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 14px; font-weight: 300;
  color: color-mix(in srgb, var(--white) 58%, transparent); line-height: 1.65;
}
.video-meta {
  display: flex; gap: 16px; align-items: center;
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: color-mix(in srgb, var(--white) 25%, transparent);
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(201,168,76,.08);
}

/* ── GALLERY SECTION ── */
.gallery-section {
  max-width: 1100px; margin: 0 auto;
  padding: 0 8% 80px;
}
.gallery-section-title {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 11px; letter-spacing: .28em; text-transform: uppercase;
  color: color-mix(in srgb, var(--white) 30%, transparent);
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 28px;
}
.gallery-section-title::after {
  content: ''; flex: 1; height: 1px; background: rgba(201,168,76,.08);
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.gallery-card {
  background: rgba(14,13,11,.95);
  border: 1px solid rgba(201,168,76,.08);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .3s, box-shadow .3s, transform .3s;
  opacity: 0; transform: translateY(14px);
}
.gallery-card.vis-visible { opacity: 1; transform: none; }
.gallery-card:hover {
  border-color: rgba(201,168,76,.3);
  box-shadow: 0 12px 32px rgba(0,0,0,.4);
  transform: translateY(-3px);
}
.gallery-card-thumb {
  width: 100%; aspect-ratio: 4/3; overflow: hidden;
  background: rgba(201,168,76,.07);
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.gallery-card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
.gallery-card:hover .gallery-card-thumb img { transform: scale(1.06); }
.gallery-card-count {
  position: absolute; bottom: 8px; right: 8px;
  background: rgba(0,0,0,.65); backdrop-filter: blur(6px);
  color: color-mix(in srgb, var(--white) 80%, transparent);
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 9px; letter-spacing: .12em;
  padding: 4px 9px; border-radius: 3px;
}
.gallery-card-info {
  padding: 18px 20px;
}
.gallery-card-title {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 15px; font-weight: 600; color: var(--white); line-height: 1.3; margin-bottom: 6px;
}
.gallery-card-desc {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 12px; font-weight: 300; color: color-mix(in srgb, var(--white) 45%, transparent); line-height: 1.65;
}

/* ── LIGHTBOX ── */
.lb-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,.94); backdrop-filter: blur(16px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  animation: lb-in .25s ease;
}
@keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }
.lb-close {
  position: absolute; top: 20px; right: 24px;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
  border-radius: 8px; color: rgba(255,255,255,.7);
  cursor: pointer; padding: 8px; display: flex; transition: all .2s; z-index: 10;
}
.lb-close:hover { background: rgba(255,255,255,.15); color: #fff; }
.lb-main {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  max-width: min(90vw, 1100px); width: 100%;
}
.lb-arrow {
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1);
  border-radius: 50%; color: rgba(255,255,255,.6);
  cursor: pointer; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all .2s;
}
.lb-arrow:hover { background: rgba(201,168,76,.2); color: #546cfa; border-color: rgba(201,168,76,.3); }
.lb-arrow:disabled { opacity: .2; cursor: default; }
.lb-img-wrap {
  flex: 1; max-height: 78vh; display: flex; align-items: center; justify-content: center;
}
.lb-img-wrap img {
  max-width: 100%; max-height: 78vh; object-fit: contain;
  border-radius: 4px; box-shadow: 0 12px 48px rgba(0,0,0,.6);
}
.lb-footer {
  margin-top: 20px; text-align: center;
}
.lb-caption {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 13px; color: color-mix(in srgb, var(--white) 55%, transparent); font-weight: 300;
  margin-bottom: 10px; min-height: 20px;
}
.lb-dots {
  display: flex; gap: 7px; justify-content: center;
}
.lb-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,.18); cursor: pointer; transition: background .2s;
  border: none;
}
.lb-dot.active { background: #546cfa; }

/* ── EMPTY ── */
.visual-empty {
  font-family: var(--font-poppins), 'Poppins', sans-serif;
  font-size: 22px; color: color-mix(in srgb, var(--white) 35%, transparent);
  padding: 80px; text-align: center; grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .visual-header { padding: 130px 6% 56px; }
  .visual-grid { grid-template-columns: 1fr; padding: 48px 6% 72px; }
  .gallery-section { padding: 0 6% 72px; }
  .gallery-grid { grid-template-columns: 1fr; }
  .lb-arrow { width: 36px; height: 36px; }
}

`;
