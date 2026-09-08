# Gap check: our design system vs Geist

Compared: the 33 routes in `ds/app.js` against the 74 Geist pages recorded in `geist-notes.md`.
Read 2026-08-18.

Framed per `AGENTS.md` §4a: a gap is only a gap if there is a surface that needs it. "Geist has
a page for it" is not a reason. Each row below says whether the gap is **real** (a surface
exists or is imminent), **not needed** (no surface, don't build), or **already covered**.

---

## 0. The headline

Our DS documents **33 pages**. The codebase has **5 primitives** (`Button`, `Card`, `Input`,
`Modal`, `StatusBadge` in `frontend/src/components/common/`).

So the design system is already ahead of the code by ~28 pages. Adding the ~40 Geist components
we don't have would take that to ~68 pages against 5 primitives. That is the exact debt §4a
describes. **The recommendation below adds 4 pages, not 40**, and every one is backed by code
that already exists and is currently hand-rolled.

---

## 1. What we have that Geist does not

Not gaps. These are ours, and several are genuinely better suited to this product.

| Ours                               | Note                                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Space & radius**                 | Geist folds radius into Materials and never documents a spacing scale                                                                           |
| **Depth**                          | Geist's Materials is the analog, but ours documents frosted glass separately                                                                    |
| **Motion**                         | Geist has no motion page at all. Durations + curves + a live tryout                                                                             |
| **Layers & breakpoints**           | Geist documents neither z-index scale nor breakpoints                                                                                           |
| **Content**                        | Voice, and the rule that the site does not name the payment rail. Geist scatters its content rules across 60 pages instead of centralising them |
| **Brand**                          | Ours is the x402 mark, clearspace, lockup, misuse. Geist's equivalent is `/geist/brands`                                                        |
| **Spec row**                       | Our analog of Geist's `Description`, tuned to a settlement receipt                                                                              |
| **Mono label & numbering**         | No Geist equivalent. Ours is a distinct type role                                                                                               |
| **Imagery** (dot-matrix, line-art) | No Geist equivalent                                                                                                                             |
| **Placeholders**                   | No Geist equivalent, and load-bearing while the product fills in                                                                                |
| **SkillTag**                       | Domain-specific, no Geist analog                                                                                                                |
| **WizardRail**                     | Geist has no multi-step primitive                                                                                                               |
| **Card**                           | Geist deliberately has no Card; it uses Fieldset / Entity / Grid cells                                                                          |

Keep all of these.

---

## 2. Real gaps, backed by code that exists today

Four, in priority order. Each cites the files that already hand-roll it.

### 2.1 Spinner / loading: **real, highest value**

`animate-spin` is hand-rolled in **six** files: `auth/AccountChip.tsx`, `auth/SignInModal.tsx`,
`components/dashboard/SettlePanel.tsx`, `views/Profile.tsx`, `views/ConsumerTest.tsx`,
`credits/TopUpPanel.tsx`. Six independent implementations of the same thing, no page documenting
any of them.

We have a **Skeleton** page but no spinner, and Geist's split is the useful part: Spinner (1–3s
single action) · Loading Dots (inline in copy) · Skeleton (async data into a known layout) ·
Progress (total known). Our Skeleton page can carry that routing table.

Geist rules worth adopting verbatim: _mount the spinner only after the action starts_, because
pre-rendering and toggling visibility leaves a partial rotation visible at idle and reads as
jank; and _for submit buttons use the Button `loading` prop, never a hand-rolled spinner inside a
button_. Our Button page documents no loading state at all, which is why six files invented one.

### 2.2 Select: **real, and already a doc/code mismatch**

Raw `<select>` appears in `steps/Pricing.tsx`, `steps/BasicInfo.tsx`, `steps/ApiInfo.tsx`,
`steps/ImportEndpoints.tsx`. Our DS _has_ a Select page, but there is no `common/Select.tsx`, so
the page documents something that doesn't exist. Either extract the primitive or mark the page
as a spec. This is the only place where our DS is actively untruthful.

### 2.3 Middle-truncate: **real**

The product shows Arc transaction hashes and wallet addresses. `ds/app.js` itself renders
`tx QK7X2M…9FA3D1` in its own toast demo, so the pattern is already in use and already
hand-rolled. Geist's rules are exactly right for this: both head and tail carry information;
render one `…` glyph, not three periods; **copying yields the full original string**; expose the
full value to assistive tech. Nothing in our DS covers it.

Small enough that it belongs as a section on the existing **Mono label** page, not a new route.

### 2.4 Copy affordance: **real**

`steps/DomainVerify.tsx` uses the clipboard; `ds/app.js` has `copyCode`/`copyDemo` helpers. The
about-to-be-built "copy page as markdown" buttons make this a third instance. Three copies of one
interaction and no documented pattern for the feedback state.

Belongs as a section on **CodeBlock**, alongside the copy behaviour already demoed there.

---

## 3. Gaps that are real but not yet: name and stop

Surfaces exist, but nothing is hand-rolled yet, so building now would be speculative. Listing so
they aren't rediscovered:

- **Checkbox / Radio**: no `type="checkbox"` or radio anywhere in the codebase yet, despite six
  step forms. When the first one lands, Geist's rules are worth taking: indeterminate is visual
  only and never a third value; group in `<fieldset>`/`<legend>`; row-select needs
  `aria-label="Select {row name}"`.
- **Snippet**: the CLI (`cli/`) exists but no page shows a runnable command. Geist's rule
  matters: authors never type a leading `$`, the component renders the prompt.
- **Textarea**: multiline lives inside `common/Input.tsx` but our Input page documents only
  single-line states.
- **Progress**: no surface today. Would apply to publish/import steps.
- **Note**: our Banner (on the Toast page) partly covers it; Geist separates inline-contextual
  (Note) from full-width (Banner). Worth splitting only when an inline case appears.

---

## 4. Not needed: do not build

Geist components with no x402 surface. Recording the decision so it isn't relitigated:

Browser · Phone · Video · Calendar · File Tree · Gauge · Slider · Feedback · Theme Switcher (the
DS page has one, the product does not need a documented control) · Project Banner · Command Menu
(the DS site uses ⌘K; the product has no global palette) · Context Menu · Context Card · Drawer ·
Sheet · Split Button · Multi Select · Combobox · Choicebox · Scroller · Collapse · Breadcrumbs ·
Load More Button · Show More · Dots Menu · Error Card · Fieldset · Separator · Relative Time Card
· JSON View · Clearable Input · Search Input · Switch · Toggle · Entity.

That is 35 of Geist's 67. They exist because Vercel's product needs them.

---

## 5. Structural gaps: how our pages are written, not what they cover

This is where the real distance is, and it costs nothing in new surface area.

### 5.1 We have no consistent guidance section

Geist ends every page that has a judgement call with **Best Practices** in four fixed buckets:
_When to use · Behavior · Content · Accessibility_. 47 of its 67 component pages have one; the
other 20 deliberately have none.

Ours has guidance, but scattered and inconsistently shaped: the Toast page has a
`CHOOSING BETWEEN THEM` block (that's "When to use"), Button has a loose note about focus rings
(that's "Accessibility"), Input has a colour-blindness line (also "Accessibility"). Same content,
no shared shape, so it can't be scanned or generated.

**Recommendation:** adopt the four buckets on the pages that already have prose. Don't invent
guidance for pages that have none.

### 5.2 "When to use" never names the alternative

Geist's first bullet almost always redirects: _"Use X for … . For Y, use `OtherComponent`."_ Our
Toast page does this well and nothing else does. It is the single highest-value convention here,
because it turns a component list into a decision tree.

### 5.3 Our content rules exist but aren't applied per-component

`content` documents voice globally. Geist puts the _specific_ content rule on the _specific_
component. Button labels are `Verb + Noun`, toast completion is `{Noun} {past-participle}`,
button verb pairs 1:1 with its toast verb, `—` for unknown values, never `successfully`, never
`please`. Ours has none of that at the component level, and the button-verb↔toast-verb pairing
is a rule this product will visibly break the moment settlement copy is written.

### 5.4 No machine-readable mirror

Geist serves every page at `<url>.md`. This is precisely the `*-llm.txt` work being asked for
next, so we'd be matching a real convention, not inventing one.

---

## 6. One defect found in our page while checking

**The Select page documents a primitive that does not exist in code** (§2.2). Fixed by marking
the page as a spec rather than a description.

(An earlier draft of this document also reported that `#/icons` and `#/a11y` shared a heading
block. That was wrong, an artifact of the regex used to survey the page. Both routes carry
exactly one `<h1>`.)

---

## 7. Recommendation

**Add:** Spinner/loading (as a section on Skeleton, plus a `loading` state on Button) ·
middle-truncate (section on Mono label) · copy affordance (section on CodeBlock) · extract or
correct Select.

**Adopt:** the four-bucket guidance shape on pages that already carry prose; "When to use" that
names the alternative; per-component content rules; the `.md` mirror.

**Don't add:** the 35 components in §4, and the 5 in §3 until a surface exists.

Net: **0 new routes**, 3 new sections, 1 correction, and a consistent guidance shape across the
pages we already have.
