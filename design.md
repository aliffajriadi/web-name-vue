# Design System — Organic Botanical Portfolio (Hero Section)

> Reference: Personal portfolio landing page for "NF" — Web Developer & UI/UX Enthusiast.
> Style category: **Organic Minimalism / Sage Green Editorial**.
> Use this document as the single source of truth when generating HTML/CSS/React for this design.

---

## 1. Overall Aesthetic

- Soft, calm, "nature-inspired" tech portfolio.
- Light, airy, lots of whitespace — no harsh contrast.
- Organic decorative shapes (thin curved lines, outlined circles) layered subtly behind content — never distracting.
- Editorial-style typography: bold serif headlines mixed with an italic serif accent word.
- Rounded, pill-shaped buttons.
- Minimal, single-accent-color UI (green) on a near-white/mint background.

---

## 2. Color Palette

| Token | Hex (approx) | Usage |
|---|---|---|
| `--bg-base` | `#F2F8F1` | Page background (very light mint) |
| `--bg-gradient-end` | `#FFFFFF` | Gradient fade toward white (top-right / edges) |
| `--color-primary` | `#3E7C3E` / `#4A8B3A` | Primary green (logo, links hover, solid button) |
| `--color-primary-dark` | `#1F3D1F` | Dark heading text (near-black green) |
| `--color-accent-italic` | `#5A9B4F` | Italic accent word ("Experiences") — mid green |
| `--color-text-body` | `#7C8A80` | Paragraph / subtext (muted grey-green) |
| `--color-text-nav` | `#3A4A3E` | Navigation links |
| `--border-outline` | `#3E7C3E` (30–50% opacity) | Outline button border, decorative circle strokes |
| `--decorative-line` | `#000000` (5–8% opacity) | Thin organic background line art |

**Rule:** Only ONE saturated accent color (green) is used throughout. Everything else is neutral (white, light mint, muted grey-green). Do not introduce secondary accent colors.

---

## 3. Typography

- **Display / Headline font:** Bold serif (e.g., "Playfair Display", "Fraunces", or "Lora Bold") — used for the large 3-line hero headline.
  - Line 1 & 3: upright bold serif, dark green/black.
  - Line 2 (accent word): *italic* serif, medium green, visually distinct from lines 1 & 3.
- **Body font:** Clean sans-serif (e.g., "Inter", "Poppins", "General Sans") for nav, eyebrow label, paragraph, buttons.
- **Logo:** Bold serif monogram ("NF"), dark green, small underline accent.
- **Eyebrow label** (e.g., "WEB DEVELOPER & UI/UX ENTHUSIAST"): uppercase, letter-spaced, small size, flanked by thin horizontal rule lines on both sides.

### Type Scale
| Element | Size (desktop) | Weight | Style |
|---|---|---|---|
| Hero headline | 64–72px | Bold | Serif, 3 lines, tight line-height |
| Hero accent line (italic) | 64–72px | Bold Italic | Serif |
| Body / subtext | 16–18px | Regular | Sans-serif, muted color |
| Nav links | 15–16px | Medium | Sans-serif |
| Eyebrow label | 12–13px | Medium, uppercase, letter-spacing 2px | Sans-serif |
| Buttons | 15–16px | Medium/Semibold | Sans-serif |

---

## 4. Layout Structure (Hero Section)

1. **Navbar** (top, full width, transparent background)
   - Left: logo mark ("NF" serif monogram)
   - Right: horizontal nav links (Home, About Me, Organization, Project, Contact)
   - Generous horizontal padding (~80–100px desktop)

2. **Hero content block** (centered, max-width ~750px, horizontally centered on page)
   - Eyebrow label with flanking rule lines
   - 3-line headline (upright / italic / upright)
   - Supporting paragraph (2–3 lines, centered, muted color)
   - Button group (centered, horizontal, gap ~16px)

3. **Decorative layer** (absolute-positioned, behind content, low opacity)
   - Large outlined circle top-left, partially off-canvas
   - Thin curved/organic line paths crossing the hero diagonally
   - Small filled dot + outlined circle pair near bottom-right (decorative accent)

4. **Scroll indicator** (bottom center)
   - Small uppercase "Scroll" label
   - Small dot or animated line beneath it

---

## 5. Components

### Buttons
- **Primary (solid):** pill shape (`border-radius: 999px`), solid green fill (`--color-primary`), white text, padding ~14px 32px, subtle hover darken.
- **Secondary (outline):** pill shape, transparent fill, 1.5px green border, green text, same padding as primary.
- Buttons sit side-by-side with ~16px gap, centered.

### Navigation
- Text-only links, no background, subtle green hover/underline.
- No mobile menu shown in reference — assume hamburger icon on breakpoints < 768px.

### Decorative Shapes
- Circles: stroke-only, 1px, low-opacity green or black.
- Curved lines: thin (1px), very low opacity (5–10%), flowing/organic paths — implement as background SVG.
- These must remain purely decorative — `pointer-events: none`, placed behind (`z-index: 0`) all text/interactive content.

---

## 6. Spacing & Sizing

- Section vertical padding: ~120–160px top, generous bottom before scroll indicator.
- Content max-width: ~750–800px, centered via `margin: 0 auto`.
- Line-height for headline: ~1.1 (tight, editorial feel).
- Line-height for body text: ~1.6.
- Consistent 8px spacing scale recommended (8/16/24/32/48/64/96/128).

---

## 7. Responsive Notes

- Headline should scale down to ~36–40px on mobile, remain 3-line stacked structure.
- Nav collapses to hamburger menu below 768px.
- Decorative circles/lines should shrink or partially clip off-screen rather than disappear entirely, to preserve the organic-background feel.
- Buttons stack vertically on very small screens (<400px) if they don't fit in one row.

---

## 8. Tone & Content Guidelines (for AI agent generating copy)

- Eyebrow label: short role/title, uppercase, e.g. "ROLE & SPECIALTY".
- Headline: 3-part structure — [Verb+Noun] / [Italic emphasis word] / [Closing phrase]. Keep concise, aspirational, purpose-driven language.
- Subtext: 1–2 sentences, first-person, warm/passionate tone, mentions craft + values (e.g., creativity, functionality, meaningful experience).
- CTA buttons: one action-oriented ("Let's Connect", "Get in Touch"), one informational ("See My Stack", "View Work").

---

## 9. Implementation Checklist for AI Agent

- [ ] Use CSS custom properties for all colors listed in §2 — never hardcode hex values inline.
- [ ] Load serif font for headline, sans-serif for everything else.
- [ ] Build decorative SVG background layer separately from content layer.
- [ ] Ensure buttons are pill-shaped with correct fill/outline variants.
- [ ] Keep color palette strictly to green + neutral tones — no additional accent colors.
- [ ] Center all hero content within a constrained max-width container.
- [ ] Add scroll indicator at the bottom of the hero section.