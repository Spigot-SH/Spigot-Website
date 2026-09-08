# taste.md — Phase 1, reference decode

Phase 1 of `design-system-pipeline`. Rules extracted from 22 reference screenshots (19 unique;
`1`=`2`, `9`=`10`, `11`=`12` are duplicates). Every rule names the shot it came from — an
unattributed rule is an invention, not an observation.

This file is **not** the design system. It is evidence. `ui.md` (Phase 2) is the decision.

---

## 0. Preflight

| Question                | Answer                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Product                 | Spigot — a marketplace and publisher platform for paid APIs. Calls are metered and settle in USDC on Arc Testnet |
| Audience                | Developers on both sides: API consumers making paid calls, publishers listing and pricing endpoints              |
| Landing-shaped surfaces | `Marketplace` (`/`) only — the single public page                                                                |
| App-shaped surfaces     | `Dashboard`, `Onboarding` (10-step wizard), `ConsumerTest`, `Profile`                                            |
| Existing tokens         | 9, being replaced                                                                                                |
| Baseline                | 0 lint errors, 0 warnings, 40/40 security, 0 vulnerabilities                                                     |
| Themes                  | Both light and dark, already switchable                                                                          |

---

## 1. What the references agree on

These recur across enough independent shots to be treated as signal rather than coincidence.

### 1.1 Near-black, not pure black — 16 of 19 shots

Dark dominates overwhelmingly. Critically, most are **not** `#000000`:

- `17` (Sentinel 001) and `18` (Siopp) sit around `#0d0f11`–`#141414`
- `19` (Metrohub) and `20` (Our values) carry a slight blue cast in the black
- `13` (dam map) and `15` (world map) are the exceptions — true black, and both are data
  visualisations where maximum contrast is the point

**Rule:** background is off-black with a slight cool cast. Reserve true black for data-viz
surfaces where dot contrast carries meaning.

### 1.2 Monospace uppercase carries all metadata — 10 shots

The single most consistent typographic move in the set. `1`, `4`, `5`, `6`, `7`, `11`, `16`,
`17` all use letterspaced mono caps for labels, section markers, coordinates and column heads,
while body copy stays in a normal-case face.

- `16` (Acquire) footer: `SYSTEM` / `ITEMS` / `HELP CENTER` / `GET STARTED TODAY` — mono caps
  column heads over normal-case links
- `7` (Noctra) runs an entire body paragraph in mono caps as a deliberate texture
- `11` (Interzone) uses mono for coordinate strings

**Rule:** two-face system. Mono uppercase, letterspaced, small, for labels/metadata/IDs. A
second face for headings and reading copy. The split is by **role**, not by size.

### 1.3 Dot-matrix, halftone and dither as the house image treatment — 10 shots

The strongest visual motif in the entire set, and it appears in every sub-genre:

| Shot | Treatment                                        |
| ---- | ------------------------------------------------ |
| `1`  | Dithered halftone portrait, orange/yellow        |
| `3`  | ASCII characters rendering a photograph          |
| `4`  | ASCII art figure                                 |
| `6`  | Dot-matrix flower, white with blue accent dots   |
| `13` | Dot-matrix US map, dot **size** encodes the data |
| `15` | Dotted world map, glowing nodes, connection arcs |
| `16` | Particle-dust human figures                      |
| `19` | Dotted world map with avatar pins                |
| `20` | Dot-matrix shapes inside cards                   |

**Rule:** imagery is constructed from a discrete grid of marks, never a photograph placed as-is.
`13` matters most — it proves the treatment can carry real data, not just decoration.

### 1.4 Instrument and specification aesthetic — 6 shots

Interfaces that present themselves as readouts:

- `17` (Sentinel 001): `Production code 001.STL.001.0025.875`, `Production date 06/11/23`,
  numbered section `01 Overview`, then label/value pairs — `Height 108.00 cm`, `Arm 80.00 kg`
- `5` (UESC): registration crosses, `N1`–`N5` tick labels along both axes, batch and clause
  numbers
- `11` (Interzone): latitude/longitude strings, grid overlay, corner crosses
- `14` (Into the Blue): explicit grid with selectively filled cells
- `7`, `18`: numbered sections `01` / `02` / `03`

**Rule:** structural numbering, alignment marks, and label/value pairs are the layout grammar.

**This is the most important finding for Spigot.** A payments platform's core content _is_
label/value pairs — transaction ID, payment hash, amount, asset, settlement status, timestamp.
`17` is not a mood reference; it is close to a literal spec for how a settlement receipt or an
API detail panel should be laid out.

### 1.5 Monochrome plus exactly one accent

No reference uses more than one accent hue. Saturation is spent in one place only:

| Shot             | Accent                                                          |
| ---------------- | --------------------------------------------------------------- |
| `1`              | Orange/red, very high chroma, covering large image fields       |
| `5`              | Red, tiny — rule marks, one filled square, one rotated word     |
| `6`              | Blue, tiny — small squares beside text only                     |
| `7`              | Warm cream/ivory as the light value, no chromatic accent at all |
| `14`, `19`, `20` | Blue, restrained                                                |
| `13`, `15`, `17` | None. Pure monochrome                                           |

**Rule:** one accent hue, and in most of the set it occupies **under 5% of the surface**. `1` is
the outlier that spends chroma across whole image fields.

### 1.6 CTAs are small, solid, rectangular, high-contrast

`7`, `16`, `18` all use a compact solid light button on dark, near-square corners, normal-case
label. `1` uses white label chips prefixed with `>`. No gradients, no glow.

`8` (Built for the thinkers) and `19` (Metrohub) are the exceptions — full pill radius, gradient
glow. They are also the two softest, least technical references in the set.

**Rule:** solid, small radius, high contrast, no ornament.

### 1.7 Type is small and copy is sparse

`4`, `13`, `17` all pair a large display line with body copy at a notably small size and a
generous measure of surrounding space. `13` carries an entire chart with two lines of label.

**Rule:** high contrast between display and body sizes. Resist mid-sized text.

---

## 2. What the references avoid

Consistent absences are as informative as the presences:

- **No rounded-corner card grids.** `20` is the only card layout, and its radius is small.
- **No three equal feature cards.** `1` is three panels, but each is a distinct poster, not a
  templated feature triple.
- **No drop shadows.** Depth comes from surface value shifts and borders, never elevation blur.
- **No gradient backgrounds** except as photographic glow in `8`.
- **No stock photography** placed unprocessed. Every image is dithered, dotted, line-drawn or
  particle-rendered.
- **No colour-coded status chips** anywhere in the set. Nothing green-for-good,
  red-for-bad — which is precisely the pattern this app currently improvises 35 times.

---

## 3. Line-art as an alternative to dot-matrix

`17` (Sentinel) and `18` (Siopp) use white technical line drawings on near-black — wireframe
robot arm, F1 suspension, helicopter cutaway. Same instrument feeling as the dot-matrix family,
different production method.

Relevant because line-art is achievable as SVG at any resolution, whereas dot-matrix is a raster
treatment. For an API product with no physical object to draw, the line-art equivalent would be
request/response flow diagrams, network topology, or settlement paths.

---

## 4. Tensions — these are user decisions, not agent decisions

The references genuinely disagree. Each of these changes the system materially.

### T1 — Accent hue

Orange/red (`1`, `5`) reads as alert, industrial, high-energy. Blue (`6`, `14`, `19`, `20`)
reads as calm, financial, conventional. Cream (`7`) reads as editorial and warm. Pure mono
(`13`, `17`) reads as instrument.

Conflict specific to this product: a payments platform needs red to mean **failure**. If red is
also the brand accent, every error state loses its urgency. `1`'s orange is the visual centre of
those posters — as a brand accent it would collide with error semantics.

### T2 — Display typeface

Mono caps as display (`1`, `5`, `17`) versus serif display (`7` italic, `20`) versus geometric
sans (`16`, `19`). The set splits roughly evenly.

Live constraint: the app currently loads **Inter + JetBrains Mono**. `frontend-design` and
`design-taste-frontend` both flag Inter as a generic default. Changing it is a `next/font` edit,
not a rewrite — but it is your call, and it was recorded as an open conflict during setup.

### T3 — Accent coverage

`1` floods orange across whole image fields. `5` and `6` use accent at under 2% coverage. Both
are in your set. Poster-scale flooding does not survive translation to a dashboard where the
accent must also mark interactive state.

### T4 — Light mode is nearly unreferenced

**Only `5` and `22` are light**, and `22` is a generic wireframe, not a taste reference. The app
ships a light theme today.

Three ways out: drop light mode; derive it mechanically and accept it will be less distinctive;
or find 3–4 light references. Deriving a light theme by inverting a dark one is exactly the
failure that produced the current palette, where light values were never chosen deliberately.

### T5 — Poster density versus product restraint

`1`–`6` are posters. `17`, `19` are product UI. Posters can spend the whole surface on one idea;
a 10-step wizard and a revenue dashboard cannot.

**How I read your set:** the posters supply texture, type role, and colour discipline. `17`,
`18`, `19`, `16` supply layout. `13` supplies the data-viz method. Poster energy belongs in the
Marketplace hero and in empty states, not in the dashboard chrome.

---

## 5. Coverage gap — the honest part

Your references are overwhelmingly **hero moments**: posters, landing heroes, one spec sheet,
two maps. Four of five surfaces in this app are none of those.

| Needed                       | Referenced |
| ---------------------------- | ---------- |
| Data tables (dashboard rows) | none       |
| Forms and inputs             | none       |
| Multi-step wizard chrome     | none       |
| Modals and dialogs           | none       |
| Error, empty, loading states | none       |
| Light theme                  | `5` only   |

Sections 1.2, 1.4 and 1.7 extend to these surfaces cleanly — mono caps column heads, label/value
rows, small type, structural numbering all belong in a table or a form. **Colour behaviour under
state does not.** No reference shows a validation error, a disabled control, or a focus ring, so
the semantic state palette has no evidence behind it and will be reasoned from contrast
requirements instead.

That is the correct place to reason from anyway — state colour is an accessibility problem
before it is a taste problem — but it should be recorded that this part of `ui.md` is derived,
not observed.

---

## 6. Batch 2 — the gap, filled

28 further shots supplied grouped by category: tables (8), forms (2), wizard chrome (4),
modals (8), error/empty/loading (3), other (3). These cover exactly the surfaces §5 recorded as
unreferenced.

**Attribution method differs here.** Batch 1 rules cite a shot number. Batch 2 arrived grouped
by category, so rules below cite `category / descriptor` instead — verifiable by a human
looking at the set, without asserting a numbering that was not given.

### 6.1 Tables

Strongly consistent across all eight:

- **Rows separated by hairlines. No zebra striping.** Not one example stripes rows
- **Hover raises the row** to the next surface value — the `panel-hover` step, used as designed
- **Sort affordance** is a small double-arrow glyph on sortable column heads only
  (`table / Visible`, `table / Claritas`)
- **Leading checkbox column** for bulk select (`table / Claritas`, `table / Toloshi`)
- **Trailing action column**, right-aligned: `View project ↗` or a bare `→`
- **Pagination is explicit**: `Showing 1–10 of 50`, `Per page: 10 ∨`, `← Prev · 1 · Next →`
- **Mono for machine values.** `table / Kafka console` is the clearest: mono timestamps, mono
  UUID keys, mono JSON values, all tabular. Human names stay in the sans face
- **Copy-to-clipboard icon** sits directly beside IDs (`other / Visible`), a small square
  icon button revealed on row hover
- **Tree rows** with expand chevrons and indented children (`table / Toloshi`)

`table / Kafka console` is the closest analogue in the whole set to this app's dashboard: a
dense log of timestamped, keyed, machine-generated rows above a thin metadata strip
(`RECORDS 34 · TOPIC SIZE 8 KiB · REPLICATION FACTOR 1`) in mono caps. That strip is the
`text-micro` role from §3.2 doing real work.

### 6.2 Status in tables — the evidence §5 was missing

Two distinct treatments, both present:

| Treatment                       | Where              | Form                                                                            |
| ------------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| **Coloured text**, no container | `table / Claritas` | `Proposal sent` amber, `Signed` green, `On Negotiation` blue, `Delivered` green |
| **Tinted chip**, small radius   | `other / Visible`  | `New` blue, `Live` green, `Paused` grey                                         |

`table / shadcn sheet` uses plain uncoloured text for `Success / Processing / Failed` and
relies on column position alone.

**This closes the `ui.md` §2.5 gap.** State colour is no longer derived — there is now direct
evidence for both a chip and a bare-text treatment, and for grey meaning inactive rather than
absent.

### 6.3 The spec row, confirmed and extended

`other / Quinstreet` runs `Key · Date received · Company · Verticals · Name` as label-left,
value-right pairs under an `Overview` heading — the exact pattern `ui.md` §5.1 already
specifies, arrived at independently.

**It also answers the mobile question.** The paired phone shot shows the same rows stacking
label-above-value, and long values (a UUID) wrapping to a second line rather than truncating.
The table beside it scrolls horizontally with the status column pinned.

### 6.4 Forms

Two opposed treatments, both usable:

- **Underline-only inputs**, no box, grouped under section headings, radio rows with the price
  right-aligned, full-width solid submit (`forms / LINOGE`, light)
- **Filled panel inputs** with visible container and generous radius, full-width solid submit
  (`forms / contact`, dark)

Shared: label above field; a single full-width primary action closing the form; related fields
grouped under a plain heading rather than boxed into cards.

`wizard / poll` adds a **segmented control** (`Select list · Emojis · Numerical`), drag handles
on reorderable rows, and a `+ Add option` text button — all directly applicable to the pricing
and endpoint-import steps.

### 6.5 Wizard chrome

**Vertical step list in a left rail, not a horizontal stepper.** The current step is
highlighted with a filled surface; completed and future steps are plain. Each step carries an
icon.

`wizard / poll` pairs it with `Step 1 of 7` plus a thin progress bar at the rail's foot —
count and bar together, not either alone.

Relevant: this app's onboarding is 10 steps, and a horizontal stepper at 10 items does not fit
a viewport. The left rail does.

### 6.6 Modals

- Centred, generous radius, scrim is the **blurred page behind** rather than a flat wash
- Header: title plus one-line subtitle, `X` at top right
- Footer: secondary then primary, right-aligned
- **Destructive action sits far left**, separated from the safe actions
  (`modals / Untitled UI` — `Delete user` in red with a trash icon)
- **Option-card grids** for exclusive choice: accent border plus a check badge on the selected
  card (`modals / Banner appearance`)
- **Two-pane modal** — nav left, content right — for anything multi-step (`wizard / poll`)

The destructive-far-left convention is worth keeping: this app has irreversible actions
(unpublish an API, withdraw settlement) that should not sit adjacent to `Cancel`.

### 6.7 Error, empty and loading

- **Empty states are per-context, never generic.** The set shows six different empty screens,
  each with its own illustration and copy. None says "No data"
- Structure is fixed: illustration, heading, one line of explanation, **exactly one** CTA
- **404 uses the numeral itself as the artwork** at display scale, with a card overlapping it
  carrying the message and a single button (`error / Cryptoverse`, `error / Creditflow`)

### 6.8 Charts

`other / Apple silicon` and `charts / Hexbin` both encode magnitude as **a count of discrete
marks** rather than a continuous bar. That is the same method as batch 1's shot `13`, arriving
from two more directions.

Also present but less distinctive: sparklines inside metric cards, and a green/red arrow with a
percentage delta (`charts / Spline`).

---

## 7. Batch 2 contradicts batch 1 in three places

Recorded rather than silently resolved. `ui.md` currently follows batch 1 on all three.

### C1 — Radius

Batch 1: small radius throughout, no pills. `ui.md` set 2 / 4 / 8px.

Batch 2 product UI is **noticeably rounder** — modals around 12–16px, cards around 12px,
filled form inputs around 12px, and `charts / stock widgets` uses full pills.

The split is not random: batch 1 is posters and marketing, batch 2 is application UI. The
rounder values come from the shots that are actually the same _kind of thing_ as this app.

### C2 — Shadows

Batch 1: no shadows anywhere; depth from surface value shifts only. `ui.md` §4.3 forbids them.

Batch 2's light modals clearly float on a blurred, shadowed scrim, and `charts / Hyper` cards
carry visible drop shadows.

Narrower reading that fits both: **dark surfaces get no shadow** (it does not read on
near-black anyway), **overlays get separation** — via blur and scrim rather than a soft
elevation shadow.

### C3 — Multi-hue categorical tags

Batch 1: one accent hue, full stop.

`table / Toloshi` uses simultaneous blue, green and orange tag pills for categories
(`Features`, `Reviews`, `Technical`). `other / Visible` adds a `+2` overflow badge.

These are **categorical**, not semantic — they encode which bucket, not how healthy. That is a
genuinely different colour problem from state, and reusing the semantic ramp for it would make
a `Technical` tag look like a warning. If this app needs endpoint or category tags, it needs a
separate categorical palette with its own contrast rules.
