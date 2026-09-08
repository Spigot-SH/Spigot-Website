# Geist: full notes

Source: `vercel.com/geist/*`, read 2026-08-18. Every page is mirrored as clean markdown at
`<url>.md` (or `Accept: text/markdown`). That is how these notes were taken, so they are the
real page contents, not a reading of the rendered HTML.

74 pages read: 5 foundations, 67 components, 2 asset pages.

This is a **content** record: what Geist documents and how it structures a page. It is not a
style reference. Nothing here should be copied visually.

---

## Part 1: The structural findings (the part that actually transfers)

### 1.1 Every component page has the same anatomy

```
# ComponentName
One sentence: what it is, in the form "Do X." or "Display X."
---
## <Example section>      ← repeated N times, N = 1..11, driven by need
## Best Practices         ← only on pages that earned one
```

No props table is rendered as a table. Props are shown by **being used in the example**, and
constrained in prose inside Best Practices. There is no separate API reference page.

### 1.2 Best Practices always uses the same four buckets, in the same order

| Bucket            | Answers                  | Typical content                                                                    |
| ----------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| **When to use**   | which component, not how | "Use X for … . For Y, use `OtherComponent`." Always names the sibling to switch to |
| **Behavior**      | runtime and state rules  | defaults, when to disable, what not to auto-do, timing                             |
| **Content**       | the words in the UI      | casing, sentence shape, forbidden strings                                          |
| **Accessibility** | roles, keys, focus       | required aria, keyboard map, focus return                                          |

Not every page has all four. Pages with no judgement calls (Banner, Code, CopyButton, Video,
Separator, Label, File Tree, Fieldset, Dots Menu, Load More Button, Search Input, Text With Copy
Button, Error Card, Clearable Input, Breadcrumbs) have **no Best Practices at all**: they are
examples only. That is a deliberate signal, not an omission: 20 of 67 component pages have no
guidance section.

### 1.3 The house rules that repeat across every page

These recur so often they are effectively system-wide laws:

- **Title Case for anything actionable or naming an entity.** Buttons, menu items, tab titles,
  column headers, labels, badge text, modal titles, CTA labels.
- **Sentence case for prose.** Descriptions, helper text, validation, tooltips, note bodies,
  toast copy.
- **`Verb + Noun` for every action label.** `Deploy Project`, `Rotate Key`, `Remove Member`.
  Bare verbs (`Submit`), and generic confirms (`OK`, `Confirm`, `Get Started`, `Continue`) are
  named as forbidden by Button, Empty State, Menu, Context Menu, Modal, Split Button.
- **Pair the button verb 1:1 with its toast.** `Delete Project` → `Project deleted`. Stated
  independently on Button, Modal, Destructive Action Modal, Toast, Toggle.
- **Never `successfully`.** (Toast, Progress.)
- **Never `please`.** (Input, Textarea, Select, Feedback.)
- **`—` for unknown values**, never `N/A`, `null`, or blank. (Table, Context Card.)
- **Colour is never the only signal.** Stated on Badge, Choicebox, Gauge, Status Dot, Grid.
- **Disabled always needs a Tooltip naming why.** Button, Checkbox, Radio, Choicebox, Tabs,
  Toggle.
- **Validate on blur, not per keystroke.** Input, Textarea, Select.
- **Return focus to the trigger on close.** Modal, Sheet, Drawer, Menu, Context Menu, Command
  Menu, Tooltip, Context Card, Multi Select.
- **Empty results copy is templated**: `No {items} match "{query}"`, never bare `No results`.
  Combobox, Multi Select, Empty State.

### 1.4 "When to use" is a routing table, not advice

Nearly every component page's first bullet redirects you elsewhere. Reconstructed, the full
disambiguation graph Geist encodes:

- **Loading**: Spinner (1–3s single action) · Loading Dots (inline in copy) · Skeleton (async
  data into a known layout) · Progress (total known) · Gauge (ratio against a fixed max)
- **Overlay**: Modal (blocking decision) · Sheet (side panel, page stays useful) · Drawer
  (mobile bottom sheet only) · Context Card (hover metadata) · Tooltip (one line of why)
- **Messaging**: Note (inline, next to the thing) · Banner (full-width announcement) · Project
  Banner (project-wide, non-dismissible) · Toast (transient acknowledgment) · Error (a block
  that failed to load) · Empty State (nothing there yet)
- **Choice**: Toggle (one boolean, applies immediately) · Checkbox (multi-select) · Radio (2–6
  exclusive) · Switch (2–3 exclusive, segmented) · Select (<10 fixed) · Combobox (type to
  filter) · Multi Select (many from a known list) · Choicebox (4–6 tiles with descriptions)
- **Actions**: Button (mutates state) · ButtonLink (changes URL) · Split Button (one default +
  1–4 variants) · Menu (list of actions on one resource) · Dots Menu (overflow) · Context Menu
  (right-click, never the only entry point) · Command Menu (global, ⌘K)
- **Code**: Inline Code (one token) · Snippet (one runnable shell command) · Code Block
  (multi-line source) · JSON View (inspectable structure)
- **Rows**: Table (same shape, sortable/comparable) · Entity (descriptive row + 1–2 controls) ·
  Description (static key/value metadata)
- **More rows**: Show More (same dataset) · Pagination (sibling pages) · Load More Button
  (append page) · Collapse (optional sections)

### 1.5 Machine-readability is a first-class feature

- Every page: `<url>.md` returns clean markdown, or `Accept: text/markdown`.
- Intro page advertises this explicitly and points to `/design.md` as a provider-neutral skill
  document.
- This is the exact pattern being asked for on our side (`*-llm.txt` + a combined `llm.txt`).

---

## Part 2: Foundations

### Colors

Ten scales: `backgrounds`, `gray`, `gray-alpha`, `blue`, `red`, `amber`, `green`, `teal`,
`purple`, `pink`. Every scale has the **same 10 steps with fixed semantic jobs**:

| Step | Job                            |
| ---- | ------------------------------ |
| 100  | Default background             |
| 200  | Hover background               |
| 300  | Active background              |
| 400  | Default border                 |
| 500  | Hover border                   |
| 600  | Active border                  |
| 700  | High-contrast background       |
| 800  | Hover high-contrast background |
| 900  | Secondary text and icons       |
| 1000 | Primary text and icons         |

Page sections group the steps: Backgrounds · 1–3 Component Backgrounds · 4–6 Borders · 7–8 High
Contrast Backgrounds · 9–10 Text and Icons.

Rules: use Background 1 especially when colour sits on top; Background 2 sparingly for subtle
differentiation; on small elements like badges use Color 2 or 3 as the background. P3 colours on
supporting displays.

**The transferable idea**: one step ladder, every hue obeys it, so `blue-400` and `red-400` are
both "default border" and swapping semantic colour never changes which step you reach for.

### Typography

Four **roles**, not one scale. Each class presets size, line-height, letter-spacing and weight.

- `heading-{72,64,56,48,40,32,24,20,16,14}`
- `button-{16,14,12}`: 14 is default, 12 is input fields only
- `label-{20,18,16,14,13,12}` + mono variants at 14, 13, 12
- `copy-{24,20,18,16,14,13}` + mono at 13

Label is single-line; Copy is multi-line (taller line-height). Subtle/Strong modifiers are
applied by nesting `<strong>`, not by another class. Heading 32→20 support Subtle; Label 16/14
and Copy 24→16 support Strong.

**The transferable idea**: the role is in the token name, so a 14px label and 14px copy are
different tokens with different line-heights. You cannot accidentally use body leading on a label.

### Materials

Presets bundling radius + fill + stroke + shadow. Two families:

- **Surface** (on the page): `base` (6px) · `small` (6px) · `medium` (12px) · `large` (12px)
- **Floating** (above the page): `tooltip` (6px, lightest shadow, the only one with a triangular
  stem) · `menu` (12px) · `modal` (12px) · `fullscreen` (16px)

**The transferable idea**: elevation is a named material, not a shadow value you pick. Radius is
carried by the material, so radius and shadow can never drift apart.

### Grid

A visible-guide layout system for marketing/docs pages, not a general layout tool.
`Grid` (`columns`, `rows`, each a number or `{sm,md,lg}`; `height="preserve-aspect-ratio"`;
`hideGuides="row"|"column"`), `GridCell` (`column`/`row` span notation, `solid`),
`GridSystem` (`guideWidth`, `debug`, `dashedGuides`), `GridPage`, `GridCross`.

Rules: for plain n-column layouts use Tailwind utilities; Grid is overkill when guides aren't
visible. Never nest more than one level. Set columns/rows at all three breakpoints. Guides are
decorative → `aria-hidden="true"`. Guide contrast ≥ 3:1 in both themes.

### Icons

Set tailored for developer tools, imported individually:
`import { IconPencilEdit } from '@vercel/geistcn-assets/icons'`. Naming is `Icon` + PascalCase
action/object. The page itself is a searchable gallery; no written sizing or a11y rules.

### Brand assets

Six brands (Vercel, Next.js, Turbo, v0, eve, AI SDK). Each: logotype + compact symbol, light and
dark, React import from `@vercel/geistcn-assets/logos`, downloadable ZIP.
Clear space = the height of the symbol. Misuse list: no use in business/product names, no
confusingly similar designs, no modification, never more prominent than your own branding, no
merchandise. Spelling is governed (`Next.js`, `eve` always lowercase).

---

## Part 3: Components (67)

Format below: **Name**: purpose · sections · key props · guidance worth stealing.

### Actions

**Button**: trigger an action or event.
Sections: Sizes · All Types and Sizes · Shapes · Prefix and suffix · Rounded · Loading ·
Disabled · Disabled variants · Link · Custom · Best Practices (11 sections).
Props: `size` (tiny/small/medium/large, default medium), `variant` (default/error/warning/
secondary/tertiary), `shape` (square/circle/rounded), `svgOnly`, `prefix`, `suffix`, `loading`,
`disabled`, `shadow`, `typeName` (the HTML type, _not_ `type`, which is the visual variant).
Also `ButtonLink` and `CustomButton` (per-state foreground/background/border).
Guidance: `primary`, `success`, `ghost`, `violet` are explicitly **not** valid. Pass `loading`
rather than swapping in a spinner so the button stays focusable and announces busy. Icon-only
needs both `svgOnly` and `aria-label`; the validator throws without them, and the label names
the action _and_ target (`Copy deployment URL`), not the icon. Never put `aria-label` on a
button that already has visible text. Mode-switch buttons append `Instead`
(`Use a Recovery Code Instead`).

**Split Button**: primary action + dropdown of close variants.
Sections: Default · Menu Alignment · Icon · Title with Icon · Best Practices.
Props: `buttonProps{onClick,size,variant}`, `menuButtonLabel`, `menuItems`, `menuProps{width}`,
`menuAlignment` (`bottom-start` default | `bottom-end`); items take `title`, `description`,
`icon`.
Guidance: use when one action is the clear default and 1–4 variants belong beside it. **Mirror
the primary action as the first dropdown item**, matching the visible label exactly. Destructive
variants are blocked by design.

**Menu**: dropdown of actions on one resource.
Sections: Default · With chevron · Disabled items · Locked items · Link items · Custom trigger ·
Prefix and suffix · Menu position · With section · Best Practices.
Props: MenuButton `showChevron`/`variant`/`type="unstyled"`/`shape`/`size`/`svgOnly`; Menu
`width`, `position`; MenuItem `onClick`/`href`/`type="error"`/`disabled`/`prefix`/`suffix`;
`MenuItemLocked`, `MenuLink`, `MenuSection{title}`, `MenuDivider`.
Guidance: **open on click, not hover.** Cap ~10 items then group with MenuSection. Destructive
items at the bottom behind a divider. `…` suffix only when it opens a follow-up dialog.
Typeahead jumps to the first item starting with the typed character.

**Context Menu**: right-click / long-press actions.
Sections: Default · Disabled items · Link items · Prefix and suffix · Best Practices.
Guidance: **must never be the only entry point**: mirror every item in a visible Menu or row
button. Suppress the native menu only over the trigger area. Position at the pointer, flip
horizontally then vertically on overflow. One level deep; no destructive items in submenus.
Keyboard: `Shift+F10` / menu key.

**Command Menu**: global ⌘K palette.
Sections: Default · With divider · With suffix · Best Practices.
Props: `open`, `setOpen`, `placeholder`, `callback`, `suffix`, `heading`; `CommandMenuDivider`.
Guidance: bind ⌘K on macOS, Ctrl+K elsewhere. Group into pages past ~30 items or when it spans
resource types. Open into the root page; **preserve the query when navigating back**. Show
recents when the input is empty. Placeholder is sentence case ending `…`. `aria-live="polite"`
for result counts.

**Dots Menu**: overflow menu behind a three-dot trigger.
Sections: Default · Sizes · Disabled · Disabled Menu Item. `iconSize` (10/12/18), `disabled`.
No Best Practices.

**Copy Button**: copies a string, gives feedback. `textToCopy`, `label`. Default only.
No Best Practices.

**Text With Copy Button**: text plus copy affordance. `textToCopy`, `textLabel`,
`successMessage`, `ellipsis`. Sections: Default · With Small and Tertiary. No Best Practices.

**Load More Button**: full-width append-next-page button.
Sections: Default · Loading · No Gap · No Border Radius · Custom Text.
Props: `loading`, `noGap`, `noBorderRadius`. No Best Practices.

**Show More**: progressive disclosure of one long list.
Sections: Default · Expanded · No border · Best Practices.
Props: `expanded`, `onClick`, `noBorder`.
Guidance: show 5–10 rows first so the shape of the list is legible. **Put the hidden count in
the trigger** (`Show 12 More` → `Show Less`). Don't cycle mid-flow on the same data. Keep hidden
rows in the DOM when the count is small so find-in-page works. Trigger is a `<button>` with
`aria-expanded` + `aria-controls`; move focus to the first revealed row.

**Pagination**: previous/next sibling pages.
Props: `previous{title,href}`, `next{title,href}`.
Guidance: titles are **destination page names**, not "Previous"/"Next". Geist renders the
label, chevron and `Go to {direction} page: {title}` aria-label itself. **Hide the slot at the
start/end rather than disabling it.** Never `Page 3 of 10` inside a title.

### Inputs

**Input**: one line of free-form text.
Sections: Default · Prefix and suffix · Disabled · Search · ⌘K · Error · Label · Rounded prefix
and suffix · Rounded without styling · Best Practices.
Props: `size` (small/medium/large), `prefix`, `suffix`, `prefixStyling`, `suffixStyling`,
`suffixContainer`, `error` (string), `label`, `rounded`, `cmdk`.
Guidance: switch to Textarea the moment content can wrap. Validate on blur; trim whitespace
before submit. **Keep the field focusable while saving**: pair `disabled` with a spinner only
when input is genuinely impossible. Placeholders show an example value, never instructions.
Helper text is a sibling wired through `aria-describedby`. Don't wrap a labelled Input in a
Tooltip; put the explainer on a sibling icon button.

**Textarea**: multi-line input.
Sections: Default · Disabled · Error · Sizes · Read Only · Rows · Best Practices.
Props: `size`, `error`, `rows`, `readOnly`, `disabled`, `aria-label` (required).
Guidance: generous default `rows`; grow only where there's vertical room. **Don't push primary
actions below the fold**. Error replaces helper text on failure.

**Clearable Input**: input with a clear button; Escape resets.
Sections: Default · With Label · With Cmdk · Disabled · With Clear Callback.
Props: `label`, `onClear`, `cmdk`, `disabled`. Needs `aria-label` when `label` is absent.
No Best Practices.

**Search Input**: pre-configured search field with magnifier and clear.
Sections: Default · With Cmdk · Disabled · Loading · Custom Prefix.
Props: `cmdk`, `loading`, `prefix` (default magnifier), `aria-label` required.
No Best Practices.

**Select**: dropdown of a short fixed list.
Sections: Sizes · Prefix and suffix · Disabled · Error · Label · With options · Required ·
Best Practices.
Props: `size`, `prefix`, `suffix`, `error`, `label`, `defaultValue`, `required`, `aria-label`
(required on every instance).
Guidance: under ~10 items; past that switch to Combobox, or group with native `<optgroup>`.
Placeholder is action-oriented (`Select a framework`), never `Choose one…`, `Pick`, or the
label restated.

**Combobox**: type to filter a known list.
Sections: Uncontrolled · Controlled · Disabled · Errored · Custom width input · Custom width
list · Custom empty message · Clearable · With prefix icons · With suffix icons · With label ·
Sizes · Used inside a Modal · Inside a Sheet with multi-line options · Best Practices.
Props: `value`, `onChange`, `disabled`, `errored`, `width`, `clearable`, `size`, `id`;
`ComboboxList{maxWidth,emptyMessage}`; `ComboboxOption{value,prefix,suffix,ignoreDefaultHeight}`.
Guidance: show a loading state for async results, **don't collapse the list**. Empty state is
`No {items} match "{query}"`. Auto-switches to a Dialog on mobile inside a Modal. Don't hijack
Enter. No `label` prop; pair a sibling `<Label htmlFor>` with the root `id`, or `aria-label`
(`aria-labelledby` is not accepted).

**Multi Select**: pick many from a known list.
Sections: Select Actions · Keyboard Navigation · Controlled State · Best Practices.
Parts: Root / Trigger / Content(`align`) / Row(`name`,`checked`,`onChange`,`onSelectOnly`,
`onSelectAll`,`selectedCount`,`totalCount`).
Guidance: trigger shows the count (`3 regions selected`), or the single name when one is picked.
Controlled when state lives in the URL or syncs to a server. **Up/Down moves rows, Left/Right
switches between the row's checkbox and its button**: two focus targets per row. Each checkbox
needs `aria-label` naming the item. Trigger keeps a stable accessible name at zero selected.

**Checkbox**: multi-select and acknowledgments.
Sections: Default · Disabled · Indeterminate · Best Practices.
Props: `checked`, `disabled`, `indeterminate`.
Guidance: for one boolean setting use Toggle instead. **Indeterminate is visual only, not a third
value**; the parent owns partial selection. Validate acknowledgments on submit, not blur. Group
label is a Title Case noun with no trailing colon; acknowledgment is a full sentence with a
period; indeterminate names the count (`3 of 5 selected`). Wrap groups in `<fieldset>` +
`<legend>`; row-select checkboxes need `aria-label="Select {row name}"`.

**Radio**: one of 2–6 visible options.
Sections: Default · Radio disabled · Radio required · Radio headless · Radio standalone ·
Best Practices.
Parts: `RadioGroup{label,value,onChange,disabled,required}`, `RadioGroupItem{value}`, standalone
`Radio` (needs `aria-label`), `useRadio` hook for headless layouts.
Guidance: past 6 options move to Select/Combobox. **Pre-select a safe default**; skip only when
the choice has real consequences. `required` belongs on the group, not an option. Arrow keys move
selection and skip disabled options.

**Choicebox**: 4–6 tiles with title + description.
Sections: Single-select · Multi-select · Disabled · Custom content · Best Practices.
Props: group `label`, `type` (radio|checkbox), `value`, `listClassName`, `disabled`, `showLabel`;
item `title`, `description`, `value`, `disabled`, `children`.
Guidance: don't mix single and multi in one group. Cap at 4–6, then Select/Combobox. For plain
text labels with no description use Radio. **The whole tile is the click target**: no nested
buttons or links. Selected state shows a check or filled dot in the corner; the border highlight
alone isn't enough on low-contrast screens. Description adds the differentiator
(`$20/mo · 100 GB bandwidth`), not a synonym of the title.

**Toggle**: one boolean that applies immediately.
Sections: Default · Disabled · Sizes · Custom Color · With Label · Best Practices.
Props: `checked` (required), `onChange`, `disabled`, `size`, `color`, `icon{checked,unchecked}`,
`direction` (default | `switch-first`), `labelCasing` (`title` default | `normal`), `children`
is the label.
Guidance: label names the **ON** state as a 1–4 word title-case noun phrase. Persist on change
and confirm with a success toast. Geist warns in dev if `children`, `aria-label` and
`aria-labelledby` are all missing.

**Switch**: segmented selector, 2–3 exclusive options.
Sections: Default · Disabled · Sizes · Full width · Tooltip · Icon · Best Practices.
Props: `name` (required, groups the underlying radios), `size`; controls take `label` (required
even when icon-only, rendered `geist-sr-only`), `value`, `defaultChecked`, `disabled`, `icon`.
Guidance: **pad controls so the active pill doesn't resize on selection.** Exactly one
`defaultChecked`. Past 3 options or multi-word labels → Tabs or Select. Icon-only always pairs
with a Tooltip.

**Slider**: ranged numeric input.
Sections: Default · With label · Range with inputs · Disabled range with inputs · Commit on
release · Best Practices.
Props: `value` (array), `onValueChange`, `onValueCommitted`, `label`, `showStartInput`,
`showEndInput`, `disabled`.
Guidance: use where shape and proximity matter more than precision; pair with a numeric Input for
exact values. **Snap to a sensible step so dragging never produces `47.83291`.** Live value in
tabular nums. Threshold tints must match the same numeric breakpoints used elsewhere. Don't
intercept arrows / PageUp / PageDown / Home / End.

**Label**: accessible text label. `id`, `value`, `withInput`, `bypassCasing` (disables the
automatic capitalisation). No Best Practices.

**Fieldset**: related controls in a bordered card with a footer.
Sections: Default · Disabled · With Long Content · Multiple Fieldsets · Without Footer · Without
Title · With Error Text · With Warning Text · With Disabled Wall · Error Type · Warning Type.
Parts: Fieldset(`type: error|warning`), Content(`disabled`), Footer(`highlight`),
FooterActions/FooterAction(`variant`), FooterStatus, Title, Subtitle. No Best Practices.

**Calendar**: pick a date or range.
Sections: Default · Horizontal Layout · Sizes · Presets · Compact · Stacked · Presets with
default value · Min and max dates · Pinned timezone · Best Practices.
Props: `size` (small|medium), `horizontalLayout`, `showTimeInput`, `popoverAlignment`,
`allowClear`, `compact`, `stacked`, `presets[{text,start,end}]`, `presetIndex`, `min`/`max`,
`pinnedTimezone`.
Guidance: provide presets for common windows (`Last 7 Days`, `Month to Date`). Set min/max to the
retention window. **Default to the user's locale and timezone; never silently render UTC.**
Trigger label stays the chosen range (`Apr 1 – Apr 28, 2026`), never reverting to `Pick a date`.
Persist the selection across close/reopen. Arrow keys move days, Shift+arrow jumps weeks,
PageUp/PageDown jumps months; announce with `aria-live="polite"`.

**Feedback**: text feedback plus an emotion.
Sections: Default · Inline · With Select · With metadata · With prefix · With suffix ·
Best Practices.
Props: `label`, `type` (default|inline), `showTopics`, `metadata`, `prefix`, `suffix`, `copy`,
`dryRun`.
Guidance: place at the end of a page or flow, where an opinion has formed. Metadata must be
non-PII (route, build ID, plan, viewport). **Submit closes the panel and returns focus, with no
acknowledgment toast.** No "please", no apologies.

### Display

**Badge**: short scannable metadata beside the thing it describes.
Sections: Variants · Sizes · With icons · Pill · Best Practices.
Props: `variant` (gray/blue/purple/amber/red/pink/green/teal/inverted/trial/turbo/pill),
`contrast` (`low` | default), `size` (sm/md/lg, default md), `icon`.
Guidance: **badges are static labels; never wire `onClick`.** Promote to a Button or link if the
user can act. Never stack two icons or nest badges. Pair lifecycle badges (Alpha, Beta, Early
Access) with a Tooltip naming the limits. **Avoid ✓ for success and ✗ for errors; let colour
signal it**, but text must still read independently. Icon-only or ambiguous badges need `title`.

**Status Dot**: deployment lifecycle indicator, and only that.
Sections: Default · Label · Best Practices.
Props: `state` (QUEUED|BUILDING|READY|ERROR|CANCELED|DELETED), `label` (bool), `titlePrefix`
(default `"This deployment"`), `aria-hidden`.
Guidance: **deployment lifecycle only**: anything else is a Badge. Animates while BUILDING or
QUEUED, static at terminal states; never add a separate spinner. Update on readyState change, not
on every poll tick. Never `Status: Ready`. The dot plus the state word is the whole thing. When
inline with text that already names the state, mark it `aria-hidden`.

**Avatar**: a person, team or org.
Sections: Group · Stacking order · Overlap · Fixed overlap · Size · Git · With custom icon ·
Letter · Placeholder · Best Practices.
Props: `size` (16/24/32/48/90), `src`, `letter` (1–2 uppercase), `placeholder`, `title`, `icon`,
`iconBackground`; `AvatarGroup{members,limit,reverse,overlap}`; `GitHubAvatar`, `GitLabAvatar`,
`BitbucketAvatar`, `AvatarWithIcon`.
Guidance: `src` first, `letter` as fallback, `placeholder` only as a loading shell. Letters are
uppercase, derived from the name: no emoji, punctuation or `?`. **Size matches adjacent type:**
20–24 next to label-14, 32 next to label-16, 48–64 in headers. Screen readers already hear
`Avatar with initials:`.

**Description**: key/value metadata pairs.
Sections: Default · Text right · Ellipsis · Best Practices.
Props: `title`, `content`, `tooltip`, `right`, `ellipsis`.
Guidance: renders semantic `<dl>`/`<dt>`/`<dd>`, so **don't wrap in paragraphs that break the list
semantics.** Title is a Title Case noun; content is sentence case unless it's a literal ID or
timestamp. Never put interactive controls in the title slot.

**Entity**: a descriptive row with 1–2 controls.
Sections: Default · with Skeleton · with List · with List and Checkbox · with Fill · with Column
ClassNames · Best Practices.
Props: `left`, `right`, `as`, `leftClassName`, `rightClassName`, `fill`; `EntityList`.
Guidance: at most two controls on the right. Beyond that, move secondary actions into a Dots
Menu. **Render the Skeleton variant during load instead of an empty row.** Right-column buttons
are `Verb + Noun`. Leading checkbox needs `aria-label="Select {entity name}"`.

**Table**: rows of the same shape.
Sections: Basic · Striped · Bordered · Interactive · Full featured · Virtualized ·
Best Practices.
Props: TableBody `striped`, `bordered`, `interactive`, `virtualize`; TableColgroup/TableCol for
widths; TableCell `colSpan`.
Guidance: **render Empty State outside the table**, not as a row. `—` for unknown values. Sortable
headers are buttons that announce the next sort state; arrows are decorative. `tabular-nums` on
numeric columns. Relative time up to 7 days (`2m ago`, `5h ago`) then switch to a date. Page copy
is `Page 2 of 7` or `21–40 of 142` with an en-dash.

**Gauge**: a 0–100 ratio against a fixed maximum.
Sections: Default · Label · Default color scale · Custom color range · Custom secondary color ·
Arc priority · Indeterminate · Best Practices.
Props: `size` (tiny/small/medium/large), `value`, `showValue`, `colors` (keyed 0…100, or
`{primary,secondary}`), `arcPriority` (`equal`), `indeterminate`.
Guidance: quota / cache hit rate / uptime / billing. **`showValue` takes a number only, never
including `%` or units**; units live in the label. Threshold colours must match the numeric
breakpoints used elsewhere in the product. Pair `indeterminate` with copy (`Calculating usage…`).
`role="progressbar"` is set for you; don't override.

**Progress**: determinate work with a knowable total.
Sections: Default · Custom max · Dynamic colors · Themed · With Stops · Widths · Heights ·
Best Practices.
Props: `value`, `max` (default 100), `colors`, `type` (success/error/warning/secondary),
`stops[{value,tooltip,ariaLabel}]`, `width`, `height`.
Guidance: **use the real ceiling in `max`, not a hardcoded 100.** Stops only for genuine
multi-stage work. Don't append "complete" when full; swap to a completion state. Throttle
announcements to ~1/second.

**Spinner**: indeterminate 1–3s single-action wait.
Sections: Default size · Sizes · Colors · Best Practices.
Props: `size` (sm/md/lg/xl/2xl/3xl/4xl), `className` for colour.
Guidance: for submit buttons use Button's `loading`; never hand-roll a Spinner inside a button.
**Mount the Spinner only after the action starts**: pre-rendering and toggling visibility leaves
a partial rotation visible at idle and reads as jank. Match size to adjacent type, not the parent
container. `aria-busy="true"` on the wrapper.

**Loading Dots**: inline indeterminate wait inside copy.
Sections: Default · With text · Best Practices.
Props: `size` (sm/md/lg, or a number = dot diameter in px).
Guidance: `Saving<LoadingDots />`. **Never after a completed verb** (`Saved<LoadingDots />`), because the
dots imply ongoing work. Decorative: don't add `aria-label` to the component itself. Honour
`prefers-reduced-motion`; don't pair with a second animated indicator on the same line.

**Skeleton**: async data filling a known layout.
Sections: Default with set width · Default with box height · Wrapping children · Wrapping
children with fixed size · Pill · Rounded · Squared · No animation · Button · Best Practices.
Props: `width`, `height`, `boxHeight`, `show`, `pill`, `rounded`, `squared`, `animated`,
`button` (extends the animation 1px for buttons).
Guidance: **never as permanent decoration or as an empty-state placeholder.** Match final content
dimensions so nothing shifts. Mirror the eventual shape with pill/rounded/squared.
`aria-busy="true"` on the region, `aria-live="polite"` on completion. No focusable controls
inside a skeleton.

**Separator**: divider. `orientation` horizontal (default) | vertical. No Best Practices.

**Middle Truncate**: truncate the middle, keep head and tail.
Sections: Examples · Best Practices.
Guidance: for strings where both ends carry meaning: file paths, URLs, deployment IDs, commit
hashes, branch names. **Never for prose**: cutting the middle of a sentence destroys meaning.
Renders one ellipsis glyph `…`, not three periods. **Copying yields the full original string.**
Don't nest inside another `text-overflow: ellipsis` container. Expose the full string to AT.

**Relative Time Card**: popover showing a date in local time.
Props: `date` (epoch ms, required; pass a number, don't pre-format), `side`, `children`.
Guidance: the short formatter is canonical (`2m`, `5h`, `Yesterday`) and **already outputs
"ago"**, so don't append it. Use `children` only for non-time states (`Just now`, `Pending`,
`Queued`). For static dates past 7 days in prose, write `Mar 14, 2026` directly. The hover card
shows both absolute UTC and local.

**Breadcrumbs**: location in the hierarchy. `type` text|menu; items take `active`, `disabled`.
No Best Practices.

**Keyboard Input (Kbd)**: a shortcut hint.
Sections: Modifiers · Combination · Small · Best Practices.
Props: `meta` (renders ⌘ on Mac, Ctrl elsewhere), `shift`, `alt`, `ctrl`, `small`.
Guidance: `children` is one key, digit or named key (`K`, `7`, `Enter`, `Esc`); don't lowercase
it and don't pack a sentence in. **Punctuation lives outside the element** so screen readers
don't announce it as keys.

**File Tree**: directory structure. `Tree` / `Folder{name,defaultOpen}` /
`File{name,href,type}` where type ∈ edge-function, lambda, middleware. No Best Practices.

**JSON View**: inspectable JSON.
Sections: Default · Single line · Embedded · Wrapped · Collapsed · Highlighted · Best Practices.
Props: `data` (object or array; **never pre-stringify**), `defaultExpandDepth`,
`highlightPattern` (from `makeJsonViewHighlightPattern()`, `null` when nothing is being searched).
Guidance: `defaultExpandDepth={1}` for log and detail surfaces, `{0}` for dense tables and
previews. Arrows move between visible nodes, Enter/Space toggles, Home/End jump. **Preserve
selectable text** so it can be copied into external tools.

**Code**: inline snippet with highlighting. `syntax`, children. No Best Practices.

**Code Block**: multi-line source.
Sections: Default · No filename · Highlighted lines · Added & removed lines · Referenced lines ·
Language switcher · Language switcher with tabs · Hidden line numbers · Open in v0 ·
Best Practices.
Props: `language` (required), `aria-label` (required), `filename`, `highlightedLinesNumbers`,
`addedLinesNumbers`, `removedLinesNumbers`, `hideLineNumbers`, `switcher{options,value,onChange}`,
`tabs`, `v0` (`ask`|`build`).
Guidance: always pass a language. **Highlight only the lines under discussion.** Show the
filename header when the snippet has a paste destination. Snippets stay runnable; don't
paraphrase real code into pseudo-syntax. **Don't prepend `$` to shell commands.**

**Snippet**: one runnable shell command, copyable.
Sections: Default · Inverted · Multi line · No prompt · Callback · Variants · Controlled Copied
State · Best Practices.
Props: `text` (string | string[]), `width`, `dark`, `prompt` (default true), `onCopy`, `type`
(success/error/warning), `copied`, `copyText`, `placeholder`.
Guidance: **never type a leading `$`**: the component renders the prompt, so `text="$ vercel
deploy"` displays `$ $ vercel deploy`. `prompt={false}` for non-shell content so the rendered
string matches what gets copied. `copyText` only when `text` holds rich nodes. One command per
Snippet; arrays for a short multi-line block, `CodeBlock` for longer scripts. `placeholder`
pairs with `text=""`, is informational, and is not copied.

**Browser**: marketing chrome around a screenshot.
Sections: Composition · Best Practices. Props: `address`, `variant` (light|dark).
Guidance: **don't render real product UI inside it**: the chrome implies a screenshot, not a
live surface. Compose from the building blocks (`Dots`, `Controls`, address bar) rather than
forking the chrome. Middle Truncate long URLs in the address bar. Lock the inner aspect ratio.
Chrome is `aria-hidden="true"`; alt text describes the screen content. No focusable dot controls.

**Phone**: the same, for mobile screenshots. `address`.
Guidance: lock the inner ratio to a real device ratio (19.5:9). **Don't stack shadows on the
parent**; the chrome already has elevation. Alt text describes the screen
(`Vercel dashboard on iPhone`), not the device. Autoplay video honours
`prefers-reduced-motion` with a paused poster fallback.

**Video**: `src`, `width`, `height`, `lazy` (true), `loop` (true), `controls` (true).
Sections: Default · No Loop · No Controls. No Best Practices.

**Scroller**: an overflowing list on one axis.
Sections: Vertical · Horizontal · Free · Vertical with buttons · Horizontal with buttons ·
Best Practices.
Props: `height`, `width`, `overflow` (`y`|`x`|`both`), `withButtons`, `childrenContainerClassName`.
Guidance: `free` only when content genuinely scrolls both ways. Past several hundred items,
virtualize inside the Scroller. **Auto-scroll buttons target direct children only.** Show edge
fade or shadow on the clipped axis. Buttons need `aria-label`s naming direction _and_ content,
not bare Previous/Next. Focusing an off-screen item must scroll it into view.

**Grid**: see Foundations.

### Overlays and messaging

**Modal**: a decision that blocks the page.
Sections: Default · Sticky · Single button · Disabled actions · Inset · Control initial focus ·
Focus an input on open · Mobile sheet with inputs · Combobox focus · Toasts and focus trap ·
Best Practices.
Props: `active`, `onClickOutside`, `sticky`, `initialFocusRef`; ModalAction `variant`,
`disabled`, `fullWidth`, `prefix`; ModalBody/Header/Title/Subtitle/Actions/Inset(`last`).
Guidance: **default focus to Cancel on any destructive Modal.** Escape and outside-click dismiss
non-destructive Modals only. Title is Title Case and **never a question**. Body 1–3 sentences,
sentence case. Primary button verb matches the title verb. Cancel stays literal; acknowledgment
modals use `Done`. Irreversible closes with "This cannot be undone." After an error keep focus
inside; after success return it to the trigger.

**Destructive Action Modal**: type-to-confirm gate.
Sections: Default · Reversible · Loading · With error · Best Practices.
Props: `title`, `description`, `confirmLabel`, `verificationPhrase`, `verificationLabel`,
`irreversibleDescription` (omit entirely for reversible actions), `loading`, `error`, `open`,
`onConfirm`, `onCancel`.
Guidance: for delete / rotate / revoke / disconnect / downgrade / disable-security, not routine
confirmations. Input auto-focuses; submit disabled until an exact match; Enter submits only once
the gate is open. **The caller owns `open`; don't self-dismiss from `onConfirm`**; close after
the API settles, or stay open on error for retry. `confirmLabel` matches `title` exactly. For
entity deletes the phrase is the resource name with `verificationLabel="project name"`.
`irreversibleDescription` ends "cannot be undone."

**Sheet**: side panel; the page stays useful.
Sections: Default · With Side · Best Practices. Props: `modal` (default **false**), `side`
(top/right/bottom/left), `noOverlay`.
Guidance: for persistent associated context: deployment details, log row inspection, a member
profile. **Defaults to `modal=false` so toasts stay reachable.** Pick `side` from the trigger
location: a row inspector slides from `right`, a global filter from `left`. **Outside-click does
not auto-close**, so always render an explicit close affordance and honour Escape. Never for
destructive confirmation.

**Drawer**: mobile bottom sheet only.
Sections: Default · Custom height · Best Practices. Props: `show`, `onDismiss`, `height`,
`verticalScroll`.
Guidance: **on desktop render Modal or Sheet directly instead.** Tap-outside and swipe-down
dismiss by default; preserve both unless the form has dirty input. Lock body scroll on open and
restore on close to prevent iOS rubber-band leak. Honour the system back gesture. Never for
destructive confirmation.

**Tooltip**: one line of _why_.
Sections: Default · No delay · Box align · Custom content · Custom type · Components · Other ·
Best Practices.
Props: `text` (required), `position` (top default), `delay` (true), `boxAlign`
(left/center/right), `type` (success/error/warning/violet), `tip` (true), `center` (true).
Guidance: **explain why something exists, not what it is.** ~150ms delay to prevent flicker.
Opens on hover _and_ keyboard focus. **Keep primary actions outside a Tooltip**: unreachable on
touch. Sentence case, no period for fragments. Skip tooltips that repeat a visible label.
Lifecycle format: `{Label}: {one-line meaning}. {Specific limit}.`

**Context Card**: hover card of entity metadata.
Sections: Default · Alignment · Render prop · Best Practices.
Props: `content`, `side` (top/bottom/left/right), `align` (start/center/end), `render`.
Guidance: for a user, deployment, project, API key. **Cap interactive content at one primary
action.** Never surface destructive actions. ~150ms entry delay. Don't nest inside a Tooltip or
another Context Card. Lead with the entity name, then 2–4 `Label: value` rows. Em-dash for
unknowns. Escape closes and returns focus.

**Note**: inline contextual feedback next to what it describes.
Sections: Default · Sizes · Action · Success · Error · Warning · Secondary · Violet · Cyan ·
Disabled · Label · Custom icon · Best Practices.
Props: `size` (small|medium), `variant` (success/error/warning/secondary/violet/cyan), `fill`,
`disabled`, `icon`; `NoteLabel`, `NoteAction`.
Guidance: **persistent until the state changes, with no ad hoc dismiss control.** One Note per
concept; multiple Notes signal an architecture problem. One inline CTA at most. **There is no
`variant="info"`**; omit the variant, or use `secondary` for neutral copy. Labels take no
period; full sentences do.

**Banner**: full-width announcement. `button{href,content}`, `className`. Default only.
No Best Practices.

**Project Banner**: project-wide state needing resolution.
Sections: Default · Success · Warning · Error · Best Practices.
Props: `variant` (success/warning/error/gray), `label`, `icon`, `callToAction{label,href|onClick}`.
Guidance: overdue billing, active rollback, attack mitigation, expiring trial blocking deploys.
**Non-dismissible by design. One at a time. Always pass a `callToAction` that resolves the
state.** Label is one sentence naming the impact: no `Heads up`, no apologetic preamble, no
emoji or interjections encoding severity.

**Toast**: transient acknowledgment of a user-initiated action.
Sections: Default · Multi-line · With jsx · With a link · Preserve · Action · Undo · Success ·
Warning · Error · Best Practices.
Props: `text`, `preserve`, `action`, `onUndoAction`; `toasts.success/warning/error()`.
Guidance: **pick the method by the user's experience, not the HTTP status.** Never rely on a
toast alone for billing failures or permission denials; pair with a persistent row. Undo
snackbars live 5–10 seconds and the label is literally `Undo`, used only when rollback is safe.
**Don't stack toasts for one async flow; emit the terminal step only.** One sentence, sentence
case, no period. Completion is `{Noun} {past-participle}` (`Blob deleted`). Never
`successfully`. Error toasts are two sentences ending in the recovery step. **No primary
navigation inside a toast**; it disappears before a keyboard user reaches it.

**Error**: a block or page-level resource failed to load.
Sections: Default · Custom label · No label · Sizes · With an error property · Best Practices.
Props: `label` (string | `false`), `size` (small/medium/large), `error{message,action,link}`.
Guidance: **always pair platform errors with a stable identifier**, rendered monospace on a
sub-line under collapsed details. The recovery action must do something concrete. **Don't
auto-retry in the background; the user came here to decide.** State what happened, then what to
do, in that order. `Couldn't`/`Can't` for user-state errors, `Failed to` for system errors.
Never fall back to `Something Went Wrong`; name the resource that failed. **Never humour an
error.** `aria-live="polite"`, reserving `assertive` for blocking errors.

**Error Card**: `title`, `message`. Default only. No Best Practices.

**Empty State**: nothing here (yet).
Sections: Empty state Design framework · Blank slate · Informational · Best Practices.
Props: `title`, `description`, `icon` (wrapped in EmptyStateIcon), `children`.
Six documented variants: **no-results · blank slate · informational · cleared · permission ·
error.** Permission/tier variants render full-page on restricted routes.
Guidance: **don't put critical persistent warnings here; empty states vanish when the list
populates.** The CTA must be a real Button or Link, not an `onClick` div. One primary CTA, plus
one secondary only when the action could legitimately be one of two paths. Don't auto-launch a
tour; pair `Start Tour` with `Skip`. Title is Title Case, description is sentence case and adds
_new_ information rather than restating the title. Single typed queries are quoted with curly
quotes. Tier-gated bodies follow `{Feature value} with the {Plan} plan.` The error variant
carries a copyable request ID and a `Try Again` button. **CTA labels are never `Get Started`,
`Continue` or `OK`.**

**Collapse**: accordion for optional or advanced content.
Sections: Default · Expanded · Multiple · Small · Best Practices.
Props: `title`, `defaultExpanded`, `size` (small|default); `CollapseGroup{multiple}`.
Guidance: for content most users skip. Never hide top-level structural content. **Default is
closed** unless a first-time visitor must read it. One panel at a time when mutually exclusive.
Never nest more than one level. **Don't put primary destructive actions inside a closed
Collapse.** Render closed content in the DOM so find-in-page works. Trigger is a `<button>` with
`aria-expanded` + `aria-controls`.

**Tabs**: switch between sibling views inside one page.
Sections: Default · Disabled · Disable specific tabs · With icons · Secondary · Best Practices.
Props: `selected`, `setSelected`, `tabs[{title,value,icon,disabled,tooltip}]`, `disabled`,
`variant` (secondary).
Guidance: **cap at 5–7 on desktop, 3–4 on mobile.** Selection is instant; never wait on the
network. **Reflect the active tab in the URL for deep-linking.** Disable only for permission or
empty-state reasons, always with a tooltip. Titles are 1–2 word destination nouns. **Don't
append counts to titles.** Left/Right arrows navigate.

**Theme Switcher**: the canonical Light / System / Dark control.
Sections: Default · Small · Disabled · Best Practices. Props: `small`, `disabled`.
Guidance: **place it once per app**, in the footer or settings, not duplicated across pages.
Reads and writes `next-themes`; wrap the app in `GeistProvider` once and **don't mirror its state
into local React state.** Auto-disables when `forcedTheme` is set; manual `disabled` is for
read-only previews of the control itself. **Don't rebuild a theme picker out of `Switch` or three
icon buttons**; it already handles icons, per-option `aria-label`, and System detection.

---

## Part 4: What is worth taking, and what is not

**Take:**

1. The `.md` mirror per page plus a combined index. This is exactly the `*-llm.txt` ask.
2. The fixed four-bucket Best Practices shape (When to use / Behavior / Content / Accessibility).
3. "When to use" as a routing table that always names the sibling component to switch to.
4. Colour as one 10-step ladder with fixed per-step jobs, applied identically to every hue.
5. Typography roles (heading / button / label / copy) rather than one size scale.
6. Materials: elevation as a named bundle so radius and shadow can't drift apart.
7. The content laws: Title Case for actions, sentence case for prose, `Verb + Noun`, button
   verb 1:1 with toast verb, `—` for unknown, no `successfully`, no `please`.

**Don't take:**

- Section-for-section page structure. Geist's Button page has 11 sections because Vercel needed 11. `AGENTS.md` §4a is explicit about this.
- Any visual styling.
- Components we have no surface for. The gap list separates "missing" from "not needed".
