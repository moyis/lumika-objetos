---
name: Lumika Objetos
description: Handmade soy candles and resin pieces from Mar del Plata — loud, warm, and unmistakably handmade.
colors:
  ink: "#0a0a0a"
  cream: "#fff8d9"
  blue: "#2f5bff"
  pink: "#ff4fb4"
  blush: "#f6c7d1"
  wavy-stroke: "#e63d9d"
typography:
  display:
    fontFamily: "Stropica, Georgia, serif"
    fontSize: "clamp(64px, 12vw, 168px)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Stropica, Georgia, serif"
    fontSize: "clamp(40px, 7vw, 88px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Stropica, Georgia, serif"
    fontSize: "clamp(28px, 4vw, 44px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "16px"
  full: "9999px"
spacing:
  section: "clamp(3.5rem, 7vw, 6rem)"
  section-tight: "clamp(2.5rem, 4.5vw, 3.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.cream}"
  button-secondary:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  button-disabled:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  chip:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "{colors.blush}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
---

# Design System: Lumika Objetos

## 1. Overview

**Creative North Star: "The Handmade Poster"**

Lumika reads like a silkscreen poster taped to a workshop wall: two loud inks on
warm cream, oversized hand-set display type, and a hand-drawn wavy underline used
like a signature. It is the storefront of someone who makes things by hand and is
proud of them — the personality of the maker is in the ink, not in the chrome. The
design's job is to make the craft feel desirable and the maker feel real, then
route the sale out cleanly to WhatsApp. It is a window and a handshake, not a
checkout.

The system is bold and graphic by default. Color is committed: hot pink and
electric blue carry the brand against a saturated cream field, framed by thick 2px
ink borders that give everything a printed, cut-out edge. Photography of the real
product is the hero; the UI stays out of its way. Warmth comes from the color, the
type, and the first-person Rioplatense voice — never from softness or hush.

This system explicitly rejects cold luxury minimalism (thin gray type on white,
hushed premium restraint), the generic marketplace template (a voiceless
Shopify/Etsy grid), and corporate SaaS polish (hero-metric blocks, identical
icon-card grids, tracked-uppercase eyebrows on every section). Lumika is the
opposite of safe.

**Key Characteristics:**
- Committed two-ink color on warm cream — pink and blue do the talking.
- Thick 2px ink borders everywhere: a printed, cut-out-of-paper edge.
- Oversized Stropica display type set tight; the wavy underline as signature.
- Real product photography leads; chrome recedes.
- Bold and graphic over soft and gentle. Flat color blocks, decisive contrast.

## 2. Colors

A committed two-ink palette: saturated brand color on warm cream, anchored by
near-black ink. Restraint lives in the count (five colors), not the volume.

### Primary
- **Electric Blue** (#2f5bff): The primary call-to-action. Buy buttons, active nav,
  inline emphasis (the hero `&`), the marquee band. The color that says "do this."
- **Hot Pink** (#ff4fb4): The secondary buy path (Instagram), list markers, the star
  accent in the marquee. Playful counterweight to the blue.

### Secondary
- **Blush** (#f6c7d1): Soft pink surface for image placeholders behind product
  photos, the selected fragrance chip, and the order-preview box. The quiet member
  of the pink family.

### Neutral
- **Ink** (#0a0a0a): All body text, every 2px border, the dark-fill buttons and
  active filter chips. The structural line of the whole system.
- **Cream** (#fff8d9): The body background and the text color on every saturated
  fill. Warm, never white.
- **Wavy Stroke** (#e63d9d): A deeper pink reserved for the hand-drawn underline SVG.
  Intentionally darker than Hot Pink so the underline clears WCAG 1.4.11 (3:1) as a
  link affordance on cream. Do not swap it for #ff4fb4.

### Named Rules
**The Two-Ink Rule.** Pink and blue are the brand. Don't introduce a third accent
hue; reach for ink, cream, or blush instead. New color is a brand decision, not a
component decision.

**The Cream-Not-White Rule.** The page background is always cream (#fff8d9), never
#ffffff. Text on any saturated fill is cream, not pure white — it keeps the warmth
even on the loud blocks.

## 3. Typography

**Display Font:** Stropica (with Georgia, serif fallback)
**Body Font:** Poppins (with system-ui, sans-serif fallback)

**Character:** A distinctive display serif set huge and tight against a clean,
friendly geometric sans. The contrast axis (characterful serif + neutral sans) does
the work — the personality is in the headline, the legibility is in the body.

### Hierarchy
- **Display** (400, `clamp(64px, 12vw, 168px)`, line-height 0.9, -0.04em): The hero
  statement. One per page, set as tight as the letters allow. (`.display-1`)
- **Headline** (400, `clamp(40px, 7vw, 88px)`, line-height 1.05, -0.03em): Section
  and page headers. Line-height stays at 1.05 so wrapped lines never collide.
  (`.display-2`)
- **Title** (400, `clamp(28px, 4vw, 44px)`, line-height 1, -0.02em): Sub-section
  headers, modal titles. (`.h2`)
- **Body** (400, 1rem, line-height 1.6): All prose. `text-wrap: pretty` to reduce
  orphans. Cap measure at ~40–65ch (the hero intro uses `max-w-[40ch]`).
- **Label** (600, 11px, letter-spacing 0.2em, uppercase): Eyebrows, nav links,
  chips, the marquee, badges, fieldset legends. The one place uppercase is allowed.

### Named Rules
**The One-Display Rule.** Stropica is for headings and labels only. Body copy is
always Poppins. Never set a paragraph in the display serif.

**The Caps-Label-Only Rule.** Uppercase + 0.2em tracking is the `.label` treatment,
reserved for short labels (≤4 words), nav, and badges. Never set a sentence or body
copy in all caps.

## 4. Elevation

Flat by default. Lumika has no shadow vocabulary — depth comes from thick 2px ink
borders and flat color blocks, the printed-poster logic, not from drop shadows. The
one exception is the product card image, which scales subtly on hover (1.02) to
signal it's a link; the surface itself never lifts on a shadow.

The modal (`<dialog>`) uses a tinted ink backdrop
(`color-mix(in oklab, ink 55%, transparent)`) to separate from the page — a flat
scrim, not a blurred glass panel.

### Named Rules
**The Border-Not-Shadow Rule.** Separation and containment are drawn with 2px ink
borders, never with shadows. If something needs to feel raised, it doesn't — give
it a border or a color fill instead.

## 5. Components

Buttons, chips, and cards are **bold and graphic**: flat color or hard 2px ink
borders, pill or cut-edge shapes, high contrast. Motion is minimal and tactile, not
decorative.

### Buttons
- **Shape:** Full pill (`rounded-full`, 9999px). Generous tap target (`px-6 py-3`,
  ≥44px high).
- **Primary:** Electric Blue fill, cream text, semibold tracked. The WhatsApp /
  primary CTA. Carries the `.btn-press` micro-interaction: lifts 2px on hover,
  settles to `scale(0.98)` on press (`--ease-out-quart`, no bounce).
- **Secondary:** Hot Pink fill, ink text. The Instagram buy path. Same pill + press.
- **Outline:** Transparent on cream, 2px ink border, ink text. Hover inverts to ink
  fill + cream text. The lower-emphasis action (e.g. "Pedir por WhatsApp" in hero).
- **Disabled:** Ink at 30% opacity, cream text, `cursor-not-allowed`,
  `pointer-events-none`. Used for the "Agotado" (sold-out) state.
- **Focus:** Always a 2px blue (or ink, for outline buttons) focus ring with a 2px
  cream offset. Never `outline: none` without a visible replacement.

### Chips
- **Style:** Pill, 2px ink border on cream, `.label` type (uppercase 11px). ≥44px
  tall, horizontal-scroll row under the sticky header.
- **State:** Selected fills with ink + cream text (`data-active='true'`). The
  fragrance picker variant fills with blush + ink text when checked.

### Cards (Product Card)
- **Corner Style:** `rounded-md` (6px) on the image frame.
- **Image frame:** `aspect-[4/5]`, 2px ink border, blush background behind the photo
  (so the frame reads even before the image loads).
- **Shadow Strategy:** None — see Elevation. Hover scales the image 1.02 inside the
  clipped frame; the card itself stays flat.
- **Content:** Title in Stropica with the `.wavy-underline` link affordance
  (deepens to wavy-stroke pink), price below via `PriceDisplay` (`tabular-nums`).
- **Sold out:** Ink badge, top-left, cream `.label` text.

### Inputs / Fields (Fragrance picker)
- **Style:** Radio rendered as a pill (`sr-only` input + styled `<span>`), 2px ink
  border, `.label` type.
- **Selected:** Blush fill + blush border, ink text.
- **Focus:** 2px blush focus ring with 2px offset (keyboard-visible).

### Navigation
- **Desktop:** `.label` links (uppercase 11px), ink default, blue on hover and for
  the active page (`aria-current`). Sticky header with a bottom 2px ink border.
- **Mobile:** Hamburger (three 2px ink bars, ≥44px target) opening `MobileMenu`.

### Signature Component (Marquee)
A full-bleed Electric Blue band, cream `.label` text, 2px ink top/bottom borders,
scrolling horizontally with a hot-pink star between items. Pure CSS keyframe
(`lk-marquee`, linear, infinite), `aria-hidden`, and fully stopped under
`prefers-reduced-motion`.

### Signature Detail (Wavy Underline)
A hand-drawn SVG wavy underline (`.wavy-underline`) used as the link affordance on
product titles and hero words. Stroke is wavy-stroke pink (#e63d9d) for 3:1 contrast
on cream. This is the brand's handwritten signature; use it deliberately, not on
every link.

## 6. Do's and Don'ts

### Do:
- **Do** keep the background cream (#fff8d9) and put cream text on saturated fills.
  Warm, never white.
- **Do** draw separation with 2px ink borders. They're the printed edge that makes
  the whole thing feel handmade.
- **Do** let real product photography lead. The candles are the hero; the UI stays
  out of the way.
- **Do** set headings in Stropica, big and tight, and use the wavy underline as a
  deliberate signature.
- **Do** route every buy path cleanly to WhatsApp (primary) or Instagram
  (secondary). Never make someone hunt for how to purchase.
- **Do** write in the maker's first-person Rioplatense voice — warm, direct, zero
  buzzwords.
- **Do** keep contrast honest: body and any text on pink/blue/cream clears 4.5:1
  (3:1 for large display), and honor `prefers-reduced-motion` on the marquee and
  transitions.

### Don't:
- **Don't** go cold-luxury-minimal: thin gray type on white, hushed premium
  restraint, lots of empty negative space. Wrong emotional register for
  handmade-and-friendly.
- **Don't** ship the generic marketplace template — a voiceless Shopify/Etsy grid
  with no personality.
- **Don't** reach for corporate SaaS polish: hero-metric blocks, identical
  icon-card grids, or tracked-uppercase eyebrows above every section.
- **Don't** introduce a third accent hue. Pink and blue are the brand; everything
  else is ink, cream, or blush.
- **Don't** use drop shadows or glassmorphism for depth. Borders and flat color
  only.
- **Don't** set body copy in the display serif, and don't set sentences in all caps.
  Uppercase is the `.label` treatment only.
- **Don't** use pure white (#ffffff) anywhere as a surface or as text on color.
