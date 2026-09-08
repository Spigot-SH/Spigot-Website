# Design system plan

The queue. What each page is backed by today, what is wanted next, and what has to happen
before it can be written.

The **rule** for adding a page is not here. It lives in the system itself, at
`/designsystem#/contributing`, so it ships inside `llm.txt` and any agent reading the system
gets it without reading this file. This document is the changing part: inventory and queue.

Read with `designsystem-gap.md`, which argues _why_ the queue is this short.

Last measured 2026-08-18.

---

## 1. Where it stands

|                                     | Count |
| ----------------------------------- | ----- |
| Pages                               | 34    |
| Backed by a primitive (Shipped)     | 18    |
| Ahead of the code (Spec)            | 0     |
| Tokens, rules or voice (Foundation) | 16    |

Every page that describes a component now describes one that exists. The remaining sixteen are
tokens, rules or voice, which have no primitive to have.

The status chip is what keeps this honest. If a page is ever written ahead of its code again,
it carries `Spec` until the code lands.

---

## 2. Inventory

### Shipped

The page describes a primitive that exists. Changing the page means changing the file.

| Page        | Backed by                             |
| ----------- | ------------------------------------- |
| Button      | `components/common/Button.tsx`        |
| Input       | `components/common/Input.tsx`         |
| Card        | `components/common/Card.tsx`          |
| Modal       | `components/common/Modal.tsx`         |
| StatusBadge | `components/common/StatusBadge.tsx`   |
| Select      | `components/common/Select.tsx`        |
| Table       | `components/common/Table.tsx`         |
| Skeleton    | `components/common/Skeleton.tsx`      |
| Toast       | `components/common/Toast.tsx`         |
| EmptyState  | `components/common/EmptyState.tsx`    |
| Tabs        | `components/common/Tabs.tsx`          |
| Tooltip     | `components/common/Tooltip.tsx`       |
| Avatar      | `components/common/Avatar.tsx`        |
| Pagination  | `components/common/Pagination.tsx`    |
| CodeBlock   | `components/common/CodeBlock.tsx`     |
| SkillTag    | `components/common/SkillTag.tsx`      |
| Spec row    | `components/common/SpecRow.tsx`       |
| WizardRail  | `components/layout/StepIndicator.tsx` |

`Toast.tsx` also exports `Banner`, and `SkillTag.tsx` also exports `SkillOption`, because in
both cases the design system documents the pair on one page.

**Built, but not yet used by any view.** Twelve of these were written against the design system
rather than against a call site, so they are verified to render but not proven in place. The
frontend rebuild is where they get wired up.

**The product is Spigot.** Settled 2026-08-19. The header, and the copy in `ApiInfo`,
`ApiTesting`, `Publish` and `ConsumerTest`, now say Spigot. `x402` remains only where it names
the protocol rather than the product: the `/x402/` gateway URL column, the "x402 facilitator"
spec term, and the "x402 Integration" onboarding step. That follows the Brand page, which
allows x402 in technical contexts and forbids it as the product's name.

**WizardRail is a name mismatch.** The page is called WizardRail, the file is called
`StepIndicator`. The contributing page says the title must be the name the code uses. One of
the two has to move. Renaming the file is the smaller change and the better name, but it
touches `views/Onboarding.tsx`, so it is a decision, not a cleanup.

### Spec

None. Every component page describes code that exists.

This is the state the status chip exists to protect: the moment a page is written ahead of its
code again, it must carry `Spec` and name the file that is missing, the way the Select page did
before it shipped.

### Foundation

Tokens, rules or voice. There is no primitive to have, so these cannot be ahead of anything.

Introduction · Adding a page · Colors · Typography · Space & radius · Depth · Motion ·
Layers & breakpoints · Grid · Icons · Accessibility · Content · Brand · Mono label ·
Imagery · Placeholders

---

## 3. The token drift

**Recorded, not resolved.** Seven of the eighteen colour tokens shared between the design
system and `frontend/src/styles/index.css` disagree. Every accent and semantic colour matches;
the entire neutral ramp does not.

| Token         | App `@theme`         | Design system     |
| ------------- | -------------------- | ----------------- |
| `bg`          | `#0a0a0a`            | `#000000`         |
| `panel`       | `#141414`            | `#0e0e0e`         |
| `panel-hover` | `#1e1e1e`            | `#1a1a1a`         |
| `border`      | `#282828`            | `#242424`         |
| `main`        | `#f0f0f0`            | `#ededed`         |
| `muted`       | `#888888`            | `#a1a1a1`         |
| `glass`       | `rgba(20,20,20,.85)` | `rgba(0,0,0,.88)` |

`--on-accent` exists in the design system and not in the app.

Measured consequence, muted body text on background:

|               | Contrast | AA 4.5 | AAA 7.0 |
| ------------- | -------- | ------ | ------- |
| App `@theme`  | 5.58:1   | pass   | fail    |
| Design system | 8.13:1   | pass   | pass    |

Both are legible. They are not the same system.

This matters more than any missing component page. The Colors page states that every ratio
"was computed rather than estimated", and it is computing against values the app does not
ship. Until this is settled, every Foundation page is asserting something the product does not
do, which is the same failure the Spec status exists to prevent.

Three ways out, none of them free:

1. **App wins.** Rewrite the Colors page to `#0a0a0a`/`#141414`/`#888888` and recompute every
   ratio. Cheapest. Documents muted text at AA but not AAA, and gives up the contrast the
   system was designed around.
2. **System wins.** Change `index.css` to the documented ramp. Restyles every existing view,
   so it needs a visual pass over all six views and both themes.
3. **Split deliberately.** Declare the app's ramp correct for product surfaces and the
   system's for the documentation site, and say so on the Colors page. Honest, but it means
   the design system does not look like the product, which defeats a large part of the point.

**Recommendation: 2, once there is a reason to touch the views anyway.** The ramp was derived
against contrast targets rather than picked, per `ui.md`, so the app is the copy that drifted.
Doing it opportunistically avoids a restyle whose only purpose is consistency.

---

## 4. Queue

Ordered. Each item names the trigger that makes it real work rather than speculation.

### 4.1 Mark the unlabelled Spec pages — **moot**

There are no Spec pages left. The rule stands for the next page written ahead of its code.

### 4.2 Extract Select — **done**

### 4.3 Extract Table — **done**

Four raw tables replaced, not two: `Dashboard` (2), `ImportEndpoints` and `X402Preview`.

### 4.4 Spinner, and Button's loading state — **done**

`Button` had `<Loader2 className="" size={16} />`: an empty className, so the loading icon
never span. All nine hand-rolled `animate-spin` sites now use `Spinner`.

### 4.4a The remaining ten components — **done**

Toast and Banner, EmptyState, Skeleton, Tabs, Tooltip, Avatar, Pagination, CodeBlock, SkillTag
and Spec row. `ToastProvider` is wired into `app/providers.tsx`; the other nine are pure
presentation and are used by nothing yet.

Two supporting pieces landed with them: `lib/hash.ts` (FNV-1a, so an avatar pattern and a skill
hue are stable across the server and client passes) and the layer scale in `@theme`, which
replaces ad-hoc `z-[100]` with named tokens.

### 4.5 Resolve the token drift

**Trigger: the next visual pass over the views.** See §3.

### 4.6 Resolve the WizardRail name

**Trigger: the next change to onboarding.** See §2.

---

## 5. Wanted, not yet earned

Surfaces plausibly exist, nothing is hand-rolled yet, so writing these now would be
speculation. Listed so they are not rediscovered from scratch.

| Page     | Waits for                                                                                  |
| -------- | ------------------------------------------------------------------------------------------ |
| Checkbox | The first `type="checkbox"` in the codebase. Six step forms and still none                 |
| Radio    | Same                                                                                       |
| Textarea | Multiline already lives inside `common/Input.tsx`; needs its own page only if it separates |
| Snippet  | A surface that shows a runnable CLI command. `cli/` exists, nothing renders it             |
| Progress | A determinate operation worth a bar. Import and publish are the candidates                 |
| Note     | An inline contextual message. Banner covers the full-width case today                      |

---

## 6. Not building

Thirty-five components with no surface in this product. The full list and the reasoning are in
`designsystem-gap.md` §4. Recorded so the decision is not relitigated every time someone reads
another design system.

The short version: a page for a component this product will never render is debt with a table
of contents.
