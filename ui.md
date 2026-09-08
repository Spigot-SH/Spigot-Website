# ui.md — Spigot design system

Phase 2 of `design-system-pipeline`. This file is **Layer 1: project truth**. Only Layer 0
(`x402-design`, the repo hard rules) outranks it. Every aesthetic skill is advisory against it.

Evidence lives in `taste.md`. Decisions live here. Where a value came from the references, the
shot is named. Where it was derived instead of observed, it says so — that distinction matters
when someone later asks whether a choice can be changed.

Nothing in this file is applied to the app yet. Phase 4 (demo) and Phase 5 (rollout) do that.

---

## 1. The four decisions

| Decision    | Choice                                         | Why                                                                                                                                                                    |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accent      | **Brand blue** — logo `#0049FD`                | Shots `6`, `14`, `19`, `20`, pushed to full saturation on request. Keeps red free to mean payment failure — a real requirement for this product, not a preference      |
| Type        | **Schibsted Grotesk + JetBrains Mono**         | Replaces Inter, which two installed skills flag as a generic default. Grotesque display with character; mono retained for the label role that dominates the references |
| Light theme | **Derived, not observed**                      | Only shot `5` is light. Values chosen against contrast targets, not by inverting dark                                                                                  |
| Imagery     | **Dot-matrix primary, SVG line-art secondary** | Dot-matrix is the strongest motif in the set (10 shots). Line-art (`17`, `18`) handles what raster cannot                                                              |

### `info` aliases `accent` — deliberate

A blue accent and a blue `info` state would put two blues on screen competing for the same
meaning, breaking the one-accent rule that every reference in `taste.md` §1.5 obeys.

**There is one blue.** `--color-info` carries the same value as `--color-accent`. The separate
token exists so call sites can express intent (`text-info` on an advisory message reads
differently from `text-accent` on a link), and so the two can diverge later without a
find-and-replace. **If they ever must diverge, change `info`. Never change `accent`.**

---

## 2. Colour

### 2.1 Tokens

Every value below is opaque hex. That is required, not stylistic: Tailwind alpha modifiers
(`bg-error/10`) only work on colours it can decompose. Pre-baked `rgba()` cannot take a further
modifier — which is why `--color-glass` is the one exception and is documented as such.

| Token                 | Dark               | Light                    | Role                                                                   |
| --------------------- | ------------------ | ------------------------ | ---------------------------------------------------------------------- |
| `--color-bg`          | `#000000`          | `#FFFFFF`                | Page background. **Pure black / pure white** — see §2.1a               |
| `--color-panel`       | `#0E0E0E`          | `#FAFAFA`                | Cards, sidebars, raised surfaces. Barely lifted off `bg`               |
| `--color-panel-hover` | `#1A1A1A`          | `#F2F2F2`                | Hover and selected rows                                                |
| `--color-border`      | `#2E2E2E`          | `#D4D4D4`                | Hairlines — and the primary separator. **Decorative only**, see §2.3   |
| `--color-main`        | `#EDEDED`          | `#0A0A0A`                | Primary text                                                           |
| `--color-muted`       | `#A1A1A1`          | `#666666`                | Secondary text, labels, metadata                                       |
| `--color-accent`      | `#33A1FF`          | `#0059B8`                | Links, focus, primary action, selection                                |
| `--color-accent-dim`  | `#2790E8`          | `#00458F`                | Accent hover and pressed                                               |
| `--color-success`     | `#3DD68C`          | `#0F7B4F`                | Settled, verified, published                                           |
| `--color-warning`     | `#F5A524`          | `#8A5300`                | Pending, low balance, needs attention                                  |
| `--color-error`       | `#FF5C5C`          | `#C42B2B`                | Failed payment, validation error, insufficient credit                  |
| `--color-info`        | `#33A1FF`          | `#0059B8`                | Advisory. Same value as accent, by §1                                  |
| `--color-glass`       | `rgba(0,0,0,0.88)` | `rgba(255,255,255,0.94)` | Frosted chrome and overlays — see §4.3a. Cannot take an alpha modifier |

### 2.1a Pure black, neutral grey — overrides `taste.md` §1.1

`taste.md` §1.1 recorded that 16 of 19 batch 1 shots use off-black **with a cool cast**, not
`#000000`. This section deliberately overrides that, on the strength of a later reference
(the Vercel dashboard) that is far closer to this product than a poster is.

Two changes, and the second matters more than the first:

1. **`bg` is pure black / pure white.**
2. **The neutral ramp has no hue cast.** The previous values were blue-tinted (`#131719`,
   `#949DA6`); these are true greys.

The consequence is structural: **`panel` sits at 1.16:1 against pure black, so a surface no
longer separates itself by fill.** Borders stop being decoration and become the primary means
of defining a box. That is exactly how the Vercel reference reads, and it is why `--color-border`
was strengthened rather than left alone.

Contrast did not suffer — it improved. Worst dark pair went from 4.84 to 5.17, worst light from
4.63 to 4.73.

**Not claimed as Vercel's tokens.** Geist does not publish hex values; its docs describe the
system and expose CSS variables only. These values were read from screenshots and then
contrast-verified here. They match the _approach_, not the literal palette.

### 2.2 Measured contrast

Every foreground token was checked against all three surfaces in both themes. **All 42 pairs
meet WCAG AA for body text (≥ 4.5:1).** Not asserted — computed.

Worst case in each theme, so future edits know the margin:

| Theme | Tightest pair                 | Ratio |
| ----- | ----------------------------- | ----- |
| Dark  | `accent-dim` on `panel-hover` | 5.17  |
| Dark  | `accent-dim` on `panel`       | 5.74  |
| Light | `success` on `panel-hover`    | 4.73  |
| Light | `error` on `panel-hover`      | 5.03  |

Light `success` at 4.73 has the least headroom in the system. Darkening it below `#0F7B4F` is
safe; lightening it is not.

**The logo blue cannot be used directly on dark.** `#0049FD` measures 3.37 / 3.10 / **2.79** on
`bg` / `panel` / `panel-hover` — well below AA. On light it is fine at 6.23 / 5.97 / 5.56, so
**light uses the logo value exactly**.

Dark uses `#4D7FFF`: the same hue (223°, identical to the logo) lightened until it clears AA at
5.80 / 5.33 / **4.80**. The brand reads as one colour across themes because the hue is unchanged
— only lightness moves, which is what the surface requires.

Earlier candidates rejected on measurement, not taste: `#0A84FF` (Apple system blue) at 4.46,
`#0066FF` and `#0F62FE` failing in light. Saturated blues cost contrast headroom.

**If you change any colour token, re-run the check.** Contrast is the one property of this
palette that is not a matter of taste.

### 2.3 Borders do not carry meaning

`border` is 1.35:1 against `bg` in dark and 1.30:1 in light — still far below the 3:1 a
meaning-bearing boundary needs. That is intentional, and unchanged by §2.1a: borders now carry
more _structural_ weight (they define every box) but still carry **no meaning**.

**Anything a user must perceive uses `accent`, never `border`.** Focus rings, error outlines,
and error outlines resolve to `accent` (7.68:1 dark, 6.73:1 light) or the matching state
colour. **Selection is the exception — see §2.4a.** A focus ring drawn in `border` would be invisible and would fail an accessibility audit.

### 2.4 Accent budget

`taste.md` §1.5: accent occupies under 5% of surface in every reference except shot `1`. Shot
`1` is a poster. This is a dashboard.

**Accent is spent on: the primary action, the focused element, the current nav item, and links.
Nothing else.** If a screen looks blue, the budget has been exceeded.

### 2.4a Selection is neutral, not accent

Selected states do **not** use `accent`. A selected option takes `border-main` plus a
`panel-hover` fill and reveals a check mark — monochrome, and unmistakable against a
`border`-only resting state.

Three reasons, in order of weight:

1. **Focus and selection must be distinguishable.** Both were resolving to `accent`, so a
   keyboard user focusing an already-selected option saw one signal doing two jobs. Focus stays
   `accent`; selection is neutral; both can now be visible at once.
2. **It protects the accent budget (§2.4).** Selection is common in this app — wizard options,
   nav, table rows. Spending accent on all of it would blow the under-5% rule immediately.
3. It matches the Vercel reference, where the active nav item is a neutral fill with no colour
   at all.

The check mark is rendered at all times with `opacity: 0` when unselected, so selecting does
not change the element's width. A mark that appears on select causes layout shift.

### 2.5 State colour is derived, not observed

No reference shows a validation error, a disabled control, or a focus ring — `taste.md` §5.
State hues were reasoned from convention and contrast, not extracted from your set.

This is the correct basis anyway (state colour is an accessibility problem before a taste
problem), but it is the part of this file with the least evidence behind it, and the part most
open to revision.

**Colour is never the only signal.** Every state carries an icon or a text label alongside it —
roughly 1 in 12 users cannot rely on the hue.

**Update after batch 2:** this section's premise is now partly out of date. `taste.md` §6.2
supplies direct evidence for two status treatments — coloured text with no container
(`table / Claritas`) and a tinted chip (`other / Visible`, where grey means paused rather than
absent). The _hues_ remain conventional rather than observed, but the _treatment_ is no longer
derived. `StatusBadge` follows the tinted-chip form; tables may use the bare-text form where a
chip would add noise to every row.

### 2.6 Categorical colour — a separate system

Resolves `taste.md` §7 C3. Skills are a categorical dimension (21 references to `skills` in
the codebase, driving the `SkillSelect` step). Batch 2 shows multi-hue tag pills, which
directly contradicts the one-accent rule — but only if you treat categorical and semantic
colour as the same problem. **They are not.** Categorical encodes _which bucket_; semantic
encodes _how healthy_. A `Technical` tag rendered in the warning ramp reads as a warning.

Four semantic hues are already spoken for (blue 210°, green 152°, amber 38°, red 0°), which
leaves little uncollided hue space. Rather than invent six hues that quietly clash, the chip
itself stays neutral and only a small dot carries the hue:

**A skill tag has no container: a 6px coloured dot plus `text-main`.** Only the dot carries
hue; the label stays neutral. Because the dot is a non-text mark it needs 3:1, not 4.5:1.

This matches the de-boxing applied to `StatusBadge`, but differs in one way that matters:
**status colours its text, a skill tag does not.** Status _is_ the colour — settled, failed,
pending. A skill is a name, and tinting nineteen skill names in five recycled hues would imply
a meaning the colour does not carry (§2.6 above: roughly four skills share each hue).

**The selectable variant is a different component.** In `SkillSelect` the tag is a control, not
a label, so it keeps a bordered hit target and a selected state (`border-accent` plus a 1px
ring). Removing the box there would leave nothing to click and no way to show selection.

| Variant | Where                     | Form                                                                                 |
| ------- | ------------------------- | ------------------------------------------------------------------------------------ |
| Tag     | Tables, cards, API detail | No container. Dot + neutral label                                                    |
| Option  | `SkillSelect` step        | `bg-panel`, `border-border`, `radius-sm`, 6px/12px. Selected: `border-accent` + ring |

| Token           | Dark      | Light     | Dark ratio | Light ratio |
| --------------- | --------- | --------- | ---------- | ----------- |
| `--color-cat-1` | `#A78BFA` | `#7C3AED` | 258°       | 6.63        | 5.36 |
| `--color-cat-2` | `#F472B6` | `#DB2777` | 330°       | 6.81        | 4.32 |
| `--color-cat-3` | `#2DD4BF` | `#0D9488` | 172°       | 9.69        | 3.52 |
| `--color-cat-4` | `#A3E635` | `#4D7C0F` | 82°        | 11.96       | 4.70 |
| `--color-cat-5` | `#FB923C` | `#C2410C` | 27°        | 7.97        | 4.87 |

Measured against `panel` in each theme. **All 10 pass 3:1**; tightest is `cat-3` light at 3.52.

**Five hues, not six — cyan was removed.** The ramp originally included `#38BDF8` at 199°. The
switch to electric blue put `accent` at 208°, nine degrees away at similar lightness, so a cyan
skill dot would have read as _selected_. Colliding with the accent is the one collision this
system cannot tolerate.

**Colour cannot identify a skill here, and the system does not pretend it can.** `SkillSelect`
offers **19 skills** against 5 hues, so roughly four skills share each colour by construction.
The dot is a scanning aid that helps the eye group a long list; the label is the identifier.
That is precisely why the chip stays neutral and the dot stays small — a fully tinted pill
would imply a uniqueness that does not exist.

Assign by stable hash of the skill name, never by array index — index assignment recolours
everything when a skill is inserted. Collisions are expected, not a bug.

**These six are never used for state, and the semantic four are never used for categories.**

---

## 3. Typography

### 3.1 Two faces, split by role

Per `taste.md` §1.2 — the most consistent move in the entire set. **The split is by role, not
by size.**

- **Schibsted Grotesk** — headings and reading copy
- **JetBrains Mono** — labels, metadata, IDs, hashes, amounts, column heads, section numbers.
  Uppercase, letterspaced, small

Both are on `next/font/google`, so this is an edit to `app/layout.tsx`, not new infrastructure.

**Superseded — see §3.1a.** The original pairing was Space Grotesk, which has no italic, and
that limitation was recorded here as an accepted trade. Schibsted Grotesk ships a true italic,
so the limitation no longer applies.

### 3.1a Display face — decided

**Schibsted Grotesk.** An editorial grotesque with real character, chosen over Space Grotesk
(now widely used) and Inter (flagged as a generic default by two installed skills).

**It ships a true italic**, which Space Grotesk does not. §3.1 previously recorded "no italic" as
an accepted constraint of the system; that constraint is now gone. Emphasis can use italic
rather than being restricted to weight and colour.

Verified present in `next/font/google` and self-hosted at build time — 10 woff2 files, no
third-party request. Weights 400–700, both styles.

The **mono stays JetBrains Mono**: it carries the label, ID and numeral roles, and none of this
affects that.

### 3.2 Scale

`taste.md` §1.7: large display against small body, and resist the middle. The gap between
`h2` and `body` is deliberately wide.

| Token          | Size      | Line height | Tracking | Use                                            |
| -------------- | --------- | ----------- | -------- | ---------------------------------------------- |
| `text-display` | 4rem      | 1.02        | −0.03em  | Marketplace hero only                          |
| `text-h1`      | 2.75rem   | 1.1         | −0.02em  | Page title                                     |
| `text-h2`      | 1.625rem  | 1.25        | −0.01em  | Section heading                                |
| `text-h3`      | 1.1875rem | 1.35        | 0        | Card title                                     |
| `text-body`    | 1rem      | 1.6         | 0        | Reading copy                                   |
| `text-small`   | 0.9375rem | 1.5         | 0        | Secondary copy, help text                      |
| `text-label`   | 0.75rem   | 1.4         | 0.09em   | **Mono, uppercase.** Labels, column heads      |
| `text-micro`   | 0.6875rem | 1.4         | 0.06em   | **Mono.** Tick marks, coordinates, batch codes |

**Scale raised two steps from the first draft** — body 14px → **16px**, display 56px → 64px.
The original 14px was justified by the references being uniformly small-type, but those
references are posters and marketing pages seen at a distance, not a dashboard read at arm's
length for an hour. Rendered at real size the whole scale sat too tight.

**The mono roles did not move.** `text-label` stayed at 12px and `text-micro` at 11px while every
sans role grew. That is deliberate, not an oversight: letterspaced uppercase mono reads visually
larger than its nominal size, and enlarging it would cost the _small label_ character the whole
system leans on. The label-to-body ratio tightened from 0.79 to 0.75 as a result, which is the
intended direction.

Display-against-body contrast — `taste.md` §1.7 — is preserved: the gap widened from 4.0× to
4.0× (64/16), unchanged in ratio while both ends grew.

### 3.3 Numerals

**All amounts, balances, IDs and hashes render in JetBrains Mono with `font-variant-numeric:
tabular-nums`.** Non-negotiable for a payments product: proportional digits make a column of
USDC amounts impossible to scan, and a truncated tx hash impossible to compare.

---

## 4. Space, radius, depth, motion

### 4.1 Spacing

4px base. Use Tailwind's default scale. Container padding steps: `16px` compact, `24px`
default, `40px` section, `64px` page-level.

### 4.2 Radius

Resolves `taste.md` §7 C1. Batch 1 (posters) is sharp; batch 2 (application UI) is rounder.
**Batch 2 wins** — those shots are the same kind of artifact as this app. Posters can be sharp
because they contain no controls to soften.

| Token         | Value | Use                   |
| ------------- | ----- | --------------------- |
| `--radius-sm` | 4px   | Inputs, badges, chips |
| `--radius-md` | 8px   | Buttons, cards        |
| `--radius-lg` | 12px  | Modals, large panels  |

Still **no `rounded-full` except on avatars.** Full pills appear only in the least technical
references in either batch — deliberately not followed.

### 4.3 Depth

Resolves `taste.md` §7 C2. Batch 1 uses no shadows at all; batch 2's light modals clearly
float. The reading that fits both: **in-page surfaces get no shadow, overlays get separation.**

- **In-page** — cards, panels, tables, rows: depth is `bg` → `panel` → `panel-hover` value
  shifts plus hairlines. No shadow, ever. On near-black a shadow does not read anyway
- **Overlays** — modal, dropdown, popover, toast: one `--shadow-overlay` token, paired with a
  scrim that blurs the page behind rather than flatly dimming it

```css
--shadow-overlay: 0 16px 48px -12px rgb(0 0 0 / 0.45);
```

That is the entire elevation system. There is no `sm`/`md`/`lg` shadow scale, and the
enforcement grep in §8 still fails any `shadow-{sm,md,lg,xl,2xl}` utility.

### 4.3a Frosted glass — deliberately weak

Requested, and constrained on purpose. Frost is easy to overdo and the failure mode is
directly a readability one.

```css
--glass-blur: 10px;
--color-glass: rgba(11, 13, 15, 0.88); /* dark  */
--color-glass: rgba(255, 255, 255, 0.94); /* light */
```

**Low blur, high opacity.** 10px is enough to suggest depth without turning the content behind
into mush; 0.88–0.94 opacity means text sitting on the frosted surface keeps essentially its
measured contrast.

**The constraint that makes this safe:** every contrast ratio in §2.2 assumes an _opaque_
backdrop. A translucent surface inherits whatever is behind it, so at low opacity the measured
4.5:1 stops being a guarantee. Holding opacity at 0.88 or above keeps the worst-case backdrop
influence under roughly 12%, which the existing headroom absorbs.

| Frost here               | Never frost here                                  |
| ------------------------ | ------------------------------------------------- |
| Sticky header            | Cards, panels                                     |
| Modal and drawer scrim   | Tables and rows                                   |
| Dropdown, popover, toast | Inputs                                            |
| —                        | Anything holding body text over arbitrary content |

Pair with `backdrop-filter: blur(var(--glass-blur))`. Add `saturate(1.05)` at most; anything
more tints the content behind and starts to look like a filter rather than a surface.

**Fallback is required.** `backdrop-filter` is unsupported or disabled in some contexts, so
`--color-glass` must remain legible with no blur at all — which the high opacity already
guarantees. Never rely on blur to create the contrast.

### 4.4 Motion

Restrained. Nothing in the reference set animates decoratively.

Three durations, one curve each way. Fast enough to read as _response_, never as a transition
you wait through.

| Token       | Value                           | Applies to                                     |
| ----------- | ------------------------------- | ---------------------------------------------- |
| `--dur-1`   | 90ms                            | **Press.** Buttons and options scale to `0.97` |
| `--dur-2`   | 140ms                           | Hover, colour, focus ring, table row highlight |
| `--dur-3`   | 200ms                           | Overlays, disclosure, theme swap               |
| `--ease`    | `cubic-bezier(0.16, 1, 0.3, 1)` | **Enter** — decelerating, settles into place   |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)`    | **Exit** — accelerating, gets out of the way   |

**Enter and exit are not the same curve.** A decelerating exit feels reluctant; things leaving
should accelerate away. Overlays enter with fade plus `translateY(8px)` and `scale(0.985)`, and
exit on `--ease-in`.

**Animate `opacity` and `transform` only.** Both composite on the GPU and never trigger layout.
Animating `width`, `height`, `top` or `margin` causes reflow on every frame.

**Reserve space for anything that appears.** The copy-to-clipboard check and the option tick
both render at `opacity: 0` when inactive rather than being absent — an element that appears on
interaction causes layout shift at the exact moment the user is looking at it.

**`prefers-reduced-motion: reduce` drops every duration to 0.01ms and removes press
transforms.** The state change still happens, it just arrives instantly. Never remove the state
change itself.

Micro-interactions currently specified: button and option press, row hover, focus ring, copy
morphing to a check and reverting after 1.5s, overlay enter/exit, and the theme swap. Nothing
loops, and nothing animates on an element repeated down a list.

---

### 4.5 Layers

Every `z-index` comes from a named token. Seven steps, ten apart — the gaps exist so something
can be slipped between two layers without renumbering the rest.

| Token          | Value | What sits here                                               |
| -------------- | ----- | ------------------------------------------------------------ |
| `--z-base`     | 0     | Page content                                                 |
| `--z-sticky`   | 10    | Sticky table headers, shell rules                            |
| `--z-header`   | 20    | App header                                                   |
| `--z-dropdown` | 30    | Select menus, tooltips, popovers                             |
| `--z-overlay`  | 40    | Scrims and drawers                                           |
| `--z-modal`    | 50    | Modals, command palette                                      |
| `--z-toast`    | 60    | Toasts — always on top, they report on the action just taken |

**No bare `z-index` anywhere.** A literal `z-index: 9999` is a bug report waiting to happen. If
something needs to sit between two layers, add a token rather than inventing a number at the
call site.

### 4.6 Breakpoints

Defined once in the `@theme` block of `frontend/src/styles/index.css` as `--breakpoint-*`.
Changing a value there moves every `sm:` / `md:` / `lg:` utility in the app with it.

**Never hand-write a `@media (max-width: …)` in a component.** There are currently zero in the
codebase; keep it that way, or the single source of truth stops being single.

**Minimum supported width is 320px.** Verified against the real device ladder rather than
assumed: 320 (small Android), 344 (Galaxy Z Fold 5 folded), 360 (Galaxy S8+), 375 (iPhone SE),
390 (iPhone 12 Pro), 412 (Pixel 7), 430 (iPhone 14 Pro Max), 540 (Surface Duo), 768 (iPad mini),
820 (iPad Air), 853 (Zenbook Fold), 912 (Surface Pro), 1024 (iPad Pro / Nest Hub), 1280 (Nest
Hub Max), 1440, 2560.

The awkward ones are **344px folded** and **540 × 720 Surface Duo** — narrow enough to break a
two-column grid but wide enough that people forget to test them.

Named by what changes at that width, not by device:

| Token              | Width  | Behaviour change                       |
| ------------------ | ------ | -------------------------------------- |
| `--breakpoint-xs`  | 480px  | Small phone. Two-up chips still fit    |
| `--breakpoint-sm`  | 640px  | Form fields go side by side            |
| `--breakpoint-md`  | 768px  | Sidebar appears; tables stop scrolling |
| `--breakpoint-lg`  | 1024px | Multi-column dashboard layouts         |
| `--breakpoint-xl`  | 1280px | Max content width reached              |
| `--breakpoint-2xl` | 1536px | Wide desktop, gutters grow             |

### 4.7 Text must not break

Control and label text wrapping onto a second line is always a layout bug, never a feature: it
changes the element's height, which shifts everything around it.

Set once in `@layer base`, not remembered as `whitespace-nowrap` at every call site:

```css
button,
[role='button'],
th,
label,
.badge,
nav a {
  white-space: nowrap;
}
h1,
h2,
h3,
h4 {
  text-wrap: balance;
} /* no orphan on the last line */
p {
  text-wrap: pretty;
} /* no single trailing word    */
body {
  overflow-wrap: break-word;
}
```

**If a label genuinely does not fit, shorten it or hide it at that breakpoint — never let it
wrap.** A two-line button is a design failure that looks like a rendering glitch.

`overflow-wrap: break-word` on `body` is not optional here: transaction IDs, payment hashes and
blockchain addresses are long unbroken strings, and one of them will otherwise force the page wider
than the viewport with every layout below inheriting the horizontal scroll.

**Text selection inverts the surface.** One rule covers both themes, because `main` and `bg`
already swap:

```css
::selection {
  background: var(--color-main);
  color: var(--color-bg);
}
```

Dark mode gets white-on-dark, light gets dark-on-white, and both land at 17.8:1. The browser
default blue is unreadable over `muted` text — which is most of the body copy in this system.

**Every layout must survive 320px.** A fixed-width element wider than that forces horizontal
scroll on the whole page, and the failure is inherited by every layout below it. Chrome that
cannot fit is hidden at a breakpoint, never squeezed: at narrow widths the docs shell drops its
breadcrumb, then its font picker, then the search label, in that order — each because it is the
least load-bearing thing still on screen.

**Navigation must exist at every width.** A sidebar that is `display: none` below a breakpoint
leaves a phone with no way to navigate at all. Collapse it to a drawer with a scrim; close it on
route change and on `Esc`.

**Overlays must never sit inside `overflow: hidden`.** A tooltip or popover in a clipped
container is silently cut off, and the clipping is invisible until someone hovers. Give the
container its corner radius on the children instead of clipping the parent.

--------- | ------ | --------------------------------------------- |
| `--bp-sm` | 640px | Spec rows stack label-above-value |
| `--bp-md` | 900px | Sidebar collapses; tables scroll horizontally |
| `--bp-lg` | 1180px | Multi-column layouts become available |
| `--bp-xl` | 1320px | Shell reaches max width and gutters appear |

---

## 5. Signature patterns

These are what make the system recognisable. They come straight from the references and should
appear far more often than any decorative flourish.

### 5.1 The spec row — `taste.md` §1.4

Shot `17` (Sentinel 001) is close to a literal spec for this product. Label left in mono caps
muted, value right in mono tabular main, hairline between rows.

Use for: settlement receipts, API detail panels, transaction records, wallet balances,
pricing tiers, onboarding review steps. **This is the default way to present any
label/value data in this app** — reach for it before reaching for a card.

### 5.2 Mono caps section label

A small letterspaced mono uppercase label above a block, in `muted`. Shot `16`'s footer column
heads, shot `7`'s section markers.

### 5.3 Structural numbering — `01`, `02`, `03`

Shots `7`, `17`, `18`. **Only where the number encodes real sequence** — wizard steps,
ordered procedures. Never as decoration on an unordered list; that is the templated pattern the
aesthetic skills exist to prevent.

### 5.4 Alignment marks

Shots `5`, `11`, `14`: registration crosses, tick labels, grid overlays. Use sparingly — the
Marketplace hero, an empty state, a chart frame. **Never inside dense UI**, where it becomes
noise rather than instrumentation.

---

## 6. Imagery

Dot-matrix primary, line-art secondary. Split by job, not by preference.

### 6.1 Dot-matrix — the house treatment

Shot `13` (dam map) is the important one: **dot size encodes the value.** The motif is not
decoration, it can carry data.

Apply to:

- Revenue and call-volume charts — dot density or radius as the encoding
- Marketplace hero
- Empty states
- Any geographic or distribution display

Must be generated (canvas or CSS), never a raster asset, so it responds to the theme switch.
A PNG would be the same bug as the current 35 fixed-hex palette values.

### 6.2 SVG line-art — accents and illustration

Shots `17`, `18`. White technical line drawings. This product has no physical object, so the
subjects are structural: request/response flow, settlement path, gateway topology, the x402
handshake.

Stroke uses `currentColor` so it inherits the theme. Hairline weight, no fills.

Use where dot-matrix would be wrong: explaining a flow, illustrating an onboarding step,
decorating a modal header. **Touch, not texture** — per the brief, line-art is the accent and
dot-matrix is the base.

### 6.2a The mark

`frontend/public/logo.svg` — brand blue. `frontend/public/logo-mono.svg` — `currentColor`, so a
single file serves the black, white and blue variants and the theme decides which.

`frontend/src/app/icon.svg` is the favicon; Next serves it automatically and lists it as a route,
so it appears in the build output and in `verify.md`'s expected route table.

**The wordmark is one unit: `Spigot Design System`, mono 700.** It was previously split into a
bold name plus a muted label, which read as two things and forced a hide-at-1240px rule to stop
it wrapping. One string at one weight is simpler and cannot wrap apart.

**The mark carries the colour; the wordmark stays neutral.** It renders in `accent`, which
resolves to the logo blue on light and the lightened same-hue variant on dark (§2.2). It is set
slightly larger than the wordmark's cap height — a mark matched to cap height reads smaller than
the text beside it.

### 6.3 Never

Unprocessed photography. `taste.md` §2 — not one reference in 19 uses it.

### 6.4 Icons

**Base set stays `lucide-react`.** Already a dependency at `^1.31.0` with 20 import sites. It
matches the hairline, geometric line-art language in §6.2 and costs nothing to keep.

**Animated icons: `lucide-animated.com`, used sparingly.** Same Lucide design language, so the
two mix without a visual seam. Facts that matter before adopting it:

- **No npm package.** Icons install individually via the shadcn CLI, which drops a TypeScript
  React component into the repo: `npx shadcn@latest add "https://lucide-animated.com/r/<icon>.json"`
- **It pulls in Motion** (`motion.dev`) as a new dependency. That is a real bundle cost, and
  Layer 3 (`vercel-react-best-practices`) will weigh it
- MIT licensed
- Each icon becomes **vendored source in this repo**, not a version-managed dependency — it
  will not update when upstream does

**Unverified:** the shadcn CLI normally expects a `components.json`, and this repo does not have
one. Whether `shadcn add` works here without an init step has not been tested. Do that before
committing to the approach, rather than discovering it mid-rollout.

Where animation earns its place — moments with real state change, not decoration:

| Use                         | Icon behaviour                                |
| --------------------------- | --------------------------------------------- |
| Payment settling            | Spinner resolving into a check                |
| Copy tx hash                | Copy morphing to check, reverting after ~1.5s |
| Domain verification passing | Shield or check drawing in once               |
| Publish succeeded           | Single celebratory pass, never looping        |

**Never animate:** table row icons, nav icons, or anything that repeats down a list. Motion on
a repeated element reads as a glitch, and at table density it is actively unpleasant.

`prefers-reduced-motion: reduce` applies here exactly as in §4.4 — the icon must still render
its final state with no animation, never disappear.

---

## 7. Primitives

The five existing components in `components/common/`. Every state is listed because unlisted
states get improvised, which is how the current 35 raw colours happened.

### Button

| Variant   | Rest                                     | Hover            | Focus                         | Disabled                       |
| --------- | ---------------------------------------- | ---------------- | ----------------------------- | ------------------------------ |
| Primary   | `bg-accent`, `text-bg`                   | `bg-accent-dim`  | 2px `accent` ring, 2px offset | 40% opacity, no pointer events |
| Secondary | `bg-panel`, `text-main`, `border-border` | `bg-panel-hover` | same ring                     | same                           |
| Ghost     | transparent, `text-muted`                | `text-main`      | same ring                     | same                           |
| Danger    | `bg-error`, `text-bg`                    | error at 85%     | same ring                     | same                           |

`radius-md`, `text-small`, medium weight, normal case. No uppercase button labels — mono caps
is the label role, not the action role.

### Card

`bg-panel`, `border-border` hairline, `radius-md`, 24px padding. No shadow. Hover only if
interactive, to `panel-hover`.

### Input

`bg-panel`, `border-border`, `radius-sm`, `text-body`. Focus: `border-accent` plus a 1px
`accent` ring. Error: `border-error`, message below in `text-error` `text-small`, **with an
icon** — never colour alone (§2.5). Label above in `text-label` mono caps `muted`.

### Modal

`bg-panel`, `radius-lg`, `--shadow-overlay`. Scrim is `bg-bg/70` **plus `backdrop-blur`** —
`taste.md` §6.6: every batch 2 modal blurs the page behind rather than flatly dimming it.

Header: title plus a one-line subtitle, `X` at top right. Footer: secondary then primary,
right-aligned.

**Destructive actions sit far left**, separated from the safe pair. This app has irreversible
operations — unpublishing an API, withdrawing settlement — and they must not sit adjacent to
`Cancel`.

Focus trapped, `Esc` closes, focus returns to the trigger on close.

For anything multi-step, use the **two-pane form**: step nav left, content right.

### StatusBadge

**No container.** A 6px dot plus text, both in the state colour. No background tint, no border,
no padding box. Mono caps `text-micro`.

This drops the tinted-chip form the first draft specified. The chip added a box around something
that is already unambiguous, and at table density a border on every row becomes visual noise —
`taste.md` §6.2 shows `table / Claritas` doing exactly this with bare coloured text. The dot
restores the non-colour signal that removing the container would otherwise lose, so the rule in
§2.5 still holds: colour is never the only cue.

One consequence worth stating: without a tinted background, the state colour is now text on
`panel` or `bg` directly, so its **AA body ratio is what carries it** — 4.63:1 at worst (light
`success`). The tinted version could have hidden a weak colour behind a container. This one
cannot, which is a reason to trust it more.

| Status                               | Token     |
| ------------------------------------ | --------- |
| Settled, verified, published, active | `success` |
| Pending, provisioning, low balance   | `warning` |
| Failed, expired, insufficient credit | `error`   |
| Draft, informational                 | `info`    |
| Inactive, archived                   | `muted`   |

### Table

New in batch 2 (`taste.md` §6.1), and the densest surface in the app.

- **Hairline row separators. No zebra striping** — not one of the eight references stripes
- Row hover raises to `panel-hover`. That is the whole hover treatment
- Column heads in `text-label` mono caps `muted`. Sort glyph on sortable columns only
- **Machine values in mono, `tabular-nums`**: amounts, tx IDs, hashes, timestamps. Human names
  and descriptions stay in the sans face
- Copy-to-clipboard icon button beside IDs, revealed on row hover
- Leading checkbox column only when bulk actions exist; trailing action column right-aligned
- Footer: `Showing 1–10 of 50`, `Per page`, `Prev / Next` — all three, in `text-small`
- Status column uses the bare coloured-text form rather than a chip, so a badge does not repeat
  on every row. `StatusBadge` is for detail views and cards

**Mobile:** the table scrolls horizontally with the status column pinned; spec rows stack
label-above-value and long values wrap rather than truncate.

### Wizard rail

Onboarding is 10 steps. A horizontal stepper does not fit a viewport at that count, and every
batch 2 reference uses a **vertical step list in a left rail** instead.

Current step on `panel-hover` with `text-main`; completed and upcoming steps `muted`. Icon per
step. At the rail's foot, `Step 3 of 10` **and** a thin progress bar — both, not either.

### EmptyState

`taste.md` §6.7: illustration, heading, one line of explanation, **exactly one** CTA. Centred.

**Copy is per-context, never generic.** The references show six distinct empty screens; none
says "No data". "No APIs published yet" and "No calls in this period" are different situations
and get different copy and different actions.

Illustration is SVG line-art (§6.2). 404 uses the numeral itself at `text-display` scale as the
artwork.

### CodeBlock

The most load-bearing component in an API product — request and response bodies, curl snippets,
the x402 payment header. Header row carries the language label and copy button; body is mono,
horizontally scrolling, **never wrapped**. A wrapped JSON body is unreadable.

**Syntax colour uses the categorical ramp, not the semantic one.** A token type is a category,
not a health state; colouring a string with `success` would imply the string is somehow healthy.
`key` → `cat-1`, `string` → `cat-3`, `number` → `cat-4`, literal → `cat-5`, punctuation →
`muted`.

**Never truncate a hash here.** Transaction IDs and payment hashes render in full, on one line,
selectable. Truncation belongs in tables where the value is a reference, never where it is the
payload.

### Skeleton

Loading placeholders shaped like the content they replace. Every view in this app fetches on
mount, so this is not optional — a blank panel and a spinner both discard the layout the user is
about to read. `bg-panel-hover`, `radius-sm`, opacity pulsing 1 → 0.45 over 1.4s.

Match the real dimensions. A skeleton of the wrong shape causes a layout jump the moment data
arrives, which is worse than showing nothing. In tables, preserve the columns and render the
header immediately — it is known before the request resolves.

**This is the one sanctioned looping animation.** §4.4 bans loops everywhere else; a loading
indicator that stops moving reads as frozen. Under `prefers-reduced-motion` the pulse is removed
and a flat 0.7 opacity used instead — still visibly a placeholder, no movement.

### Toast & Banner

Two ways to report an outcome, and the distinction matters.

- **Toast** — transient, bottom-right, `--z-toast`, auto-dismiss 4.5s. Reports something that
  _just happened_: payment settled, publish failed
- **Banner** — persistent, inline, above the content it concerns. Reports a condition that is
  _still true_: low balance, unverified domain. Border tinted from the state token, dot carries
  the hue, **no background fill** — a filled banner competes with the panel beneath it

**Choosing:** if the user can do nothing about it and it is over, toast. If it describes a state
they must resolve, banner. A toast for a persistent condition disappears before it can be acted
on.

### Select

A native `<select>` with the platform chevron suppressed and ours drawn in
(`appearance: none`, chevron absolutely positioned, `pointer-events: none`). Focus matches
`Input` — `border-accent` plus a 1px ring.

**Native is deliberate.** A custom listbox needs roving tabindex, type-ahead, ARIA wiring and
its own mobile behaviour — all of which the native element already has, and none of which shows
up in a screenshot. Build a custom one only when an option needs genuinely rich content; a
colour dot and a label are not rich content.

### Tabs

- **Segmented** — switching a view inside a panel. Active is `bg-bg` plus border inside a
  `bg-panel` track
- **Underline** — page-level navigation across dashboard sections. Active is `text-main` with a
  1px bottom border offset `-1px` so it sits _on_ the container rule

Both neutral, never accent — selection is neutral throughout (§2.4a). **One form per screen:**
both together produces two competing levels of "current".

### Tooltip

Short clarification above the trigger, 8px offset, fading and rising 4px over `--dur-2`. Opens
on `:hover` **and** `:focus-within` so keyboard users reach it. `--z-dropdown`.

**Never put meaning only in a tooltip.** Touch devices have no hover. If a value cannot be
understood without it, use help text or a spec row instead.

### Avatar

A **generated identicon**, not initials: a 5×5 dot grid mirrored down the centre, with the
pattern derived from an FNV-1a hash of the name. The same person always renders the same avatar.
28px default, 40px large; stacks overlap `-8px` with the overflow count as the final chip — a
number is not an identity, so it stays as text.

**Identity comes from the pattern, not the hue.** Monochrome throughout. Tinting avatars by
name-hash would read as a status, and hue is reserved for state and category — a dot pattern
carries the same distinguishing power without borrowing meaning it should not have.

Deterministic by construction: no `Math.random()`, so the server and client agree and an avatar
never changes between renders.

### Pagination

Numbered pages with a truncating middle, current page neutral (`bg-panel` + border), disabled
controls genuinely `disabled` rather than merely styled to look it.

**Always paired with a count.** "Showing 1–10 of 87" is the information; the numbers are only
the control. "Page 3" means nothing without knowing there are nine.

---

## 8. Enforcement

Tokens are used through generated utilities — `bg-panel`, `text-muted`, `border-border`,
`text-error`. Never re-declared at a call site.

All four checks must return nothing:

```bash
# 1. Raw palette values — fixed hex, do not respond to the theme switch
grep -rnE "(bg|text|border|ring|from|to|via|fill|stroke|divide|placeholder)-(red|green|yellow|blue|orange|amber|emerald|lime|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-[0-9]{2,3}" frontend/src --include='*.tsx'

# 2. var() escape hatches — the utility already exists
grep -rn "\[var(--color-" frontend/src --include='*.tsx' --include='*.ts'

# 3. Arbitrary values containing spaces — generate NO CSS, fail invisibly
grep -rnE "(bg|text|border|shadow)-\[[^]]* [^]]*\]" frontend/src --include='*.tsx'

# 4. Shadows — not part of this system
grep -rnE "shadow-(sm|md|lg|xl|2xl)" frontend/src --include='*.tsx'
```

Check 1 is new and should become `S9.4` in `scripts/security-review.sh` once the 35 existing
usages are gone. Adding it before then would fail the build. Checks 2 and 3 are already `S9.2`
and `S9.1`.

---

## 9. The CSS

Replaces the `@theme` and `[data-theme]` blocks in `frontend/src/styles/index.css`.

```css
@theme {
  --font-sans: var(--font-space-grotesk), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;

  /* Dark is the default. Both themes are restated in [data-theme] below. */
  --color-bg: #000000;
  --color-panel: #0e0e0e;
  --color-panel-hover: #1a1a1a;
  --color-border: #2e2e2e;
  --color-glass: rgba(0, 0, 0, 0.88);
  --color-main: #ededed;
  --color-muted: #a1a1a1;
  --color-accent: #33a1ff;
  --color-accent-dim: #2790e8;
  --color-success: #3dd68c;
  --color-warning: #f5a524;
  --color-error: #ff5c5c;
  --color-info: #33a1ff;

  --text-display: 4rem;
  --text-display--line-height: 1.02;
  --text-display--letter-spacing: -0.03em;
  --text-h1: 2.75rem;
  --text-h1--line-height: 1.1;
  --text-h1--letter-spacing: -0.02em;
  --text-h2: 1.625rem;
  --text-h2--line-height: 1.25;
  --text-h2--letter-spacing: -0.01em;
  --text-h3: 1.1875rem;
  --text-h3--line-height: 1.35;
  --text-body: 1rem;
  --text-body--line-height: 1.6;
  --text-small: 0.9375rem;
  --text-small--line-height: 1.5;
  --text-label: 0.75rem;
  --text-label--line-height: 1.4;
  --text-label--letter-spacing: 0.09em;
  --text-micro: 0.6875rem;
  --text-micro--line-height: 1.4;
  --text-micro--letter-spacing: 0.06em;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --shadow-overlay: 0 16px 48px -12px rgb(0 0 0 / 0.45);
  --glass-blur: 10px;
}
```

Categorical dot hues, added to the same `@theme` block and restated per theme:

```css
--color-cat-1: #a78bfa;
--color-cat-2: #f472b6;
--color-cat-3: #2dd4bf;
--color-cat-4: #a3e635;
--color-cat-5: #fb923c;
```

Both `[data-theme='dark']` and `[data-theme='light']` blocks restate all 18 colour tokens.
Light values are in the §2.1 table.

**The `rgba()` in `--color-glass` has no spaces after its commas by accident — it must not.**
A space inside an arbitrary value is the silent-failure class in `x402-design` §1. Inside a
`@theme` declaration this is safe, but the habit matters.

---

## 10. What this changes

| Area                  | Effect                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tokens                | 9 → 18 colours, plus 7 layer and 4 breakpoint tokens. Adds `success`, `warning`, `error`, `info` — the gap that caused every improvisation — plus `cat-1`…`cat-5` for skills. Also `--shadow-overlay` and `--glass-blur` |
| `text-warning`        | Becomes real. Currently dead at `components/steps/ApiInfo.tsx:197`                                                                                                                                                       |
| 35 raw palette usages | All map to semantic tokens. `text-red-500` → `text-error`, `bg-red-500/10` → `bg-error/10`, and so on. Opaque hex means the `/10` and `/40` modifiers keep working                                                       |
| Fonts                 | Inter → Space Grotesk in `app/layout.tsx`. JetBrains Mono unchanged                                                                                                                                                      |
| Light theme           | Every value deliberately chosen and contrast-checked, rather than inherited                                                                                                                                              |
| `--color-glass`       | Unchanged, still `rgba()`. Documented as the one token that cannot take an alpha modifier                                                                                                                                |

Nothing here is applied yet. Phase 3 specifies pages and states; Phase 4 demos them; Phase 5
rolls out one surface at a time with `npm run verify` between each.
