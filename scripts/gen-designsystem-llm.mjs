#!/usr/bin/env node
/**
 * Generate the Markdown mirror of the design system.
 *
 *   node scripts/gen-designsystem-llm.mjs
 *
 * Reads `frontend/public/designsystem/index.html` and writes, beside it:
 *
 *   <route>-llm.txt   one page
 *   llm.txt           every page, in sidebar order
 *
 * index.html is the single source of truth. These files are build output — editing one by
 * hand is pointless, the next run overwrites it.
 *
 * The page markup is flat and regular (no nested sections, and only `.demo` and `.cbox` wrap
 * other blocks), so a linear scan is enough and pulling in an HTML parser is not.
 */

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'designsystem');
const html = readFileSync(join(DIR, 'index.html'), 'utf8');
const appjs = readFileSync(join(DIR, 'app.js'), 'utf8');

/* ---------- route order comes from app.js, so the sidebar and llm.txt can never diverge ---- */

const routes = [
  ...appjs.matchAll(
    /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*group:\s*'([^']+)',\s*icon:\s*'[^']+',\s*status:\s*'([^']+)'/g,
  ),
].map(([, id, title, group, status]) => ({ id, title, group, status }));
if (!routes.length) throw new Error('no routes parsed from app.js');

/* ---------- inline ---------- */

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  times: '×',
};

function decode(s) {
  return s.replace(/&(#?\w+);/g, (m, e) => (e in ENTITIES ? ENTITIES[e] : m));
}

/**
 * Inline HTML to inline Markdown.
 *
 * Tags are stripped before entities are decoded, never after: `<code>&lt;page&gt;</code>`
 * decoded early would produce a literal `<page>` that the tag stripper then eats.
 */
function inline(s) {
  return decode(
    s
      .replace(/<code>(.*?)<\/code>/gs, '`$1`')
      .replace(/<strong>(.*?)<\/strong>/gs, '**$1**')
      .replace(/<em>(.*?)<\/em>/gs, '*$1*')
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Walk forward from the `<div` at `i` and return the index just past its matching `</div>`. */
function closeDiv(s, i) {
  const re = /<\/?div\b/g;
  re.lastIndex = i;
  let depth = 0;
  for (let m; (m = re.exec(s));) {
    depth += m[0] === '</div' ? -1 : 1;
    if (depth === 0) return s.indexOf('>', m.index) + 1;
  }
  throw new Error('unbalanced <div> at ' + i);
}

/* ---------- blocks ---------- */

function table(chunk) {
  const head = [
    ...(chunk.match(/<thead>(.*?)<\/thead>/s)?.[1] ?? '').matchAll(/<th[^>]*>(.*?)<\/th>/gs),
  ].map(([, c]) => inline(c));
  const rows = [
    ...(chunk.match(/<tbody>(.*?)<\/tbody>/s)?.[1] ?? '').matchAll(/<tr[^>]*>(.*?)<\/tr>/gs),
  ].map(([, r]) => [...r.matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map(([, c]) => inline(c) || '—'));
  if (!head.length && !rows.length) return '';
  const width = Math.max(head.length, ...rows.map(r => r.length));
  const pad = r => Array.from({ length: width }, (_, i) => r[i] ?? '');
  return [
    `| ${pad(head).join(' | ')} |`,
    `| ${Array(width).fill('---').join(' | ')} |`,
    ...rows.map(r => `| ${pad(r).join(' | ')} |`),
  ].join('\n');
}

/** A demo is a rendered example plus a note. Only the note carries information in text. */
function demo(chunk) {
  const raw = chunk.match(/<div class="demo-code">(.*?)<\/div>\s*<\/div>\s*$/s)?.[1] ?? '';
  const note = decode(raw.replace(/<button[\s\S]*?<\/button>/g, '').replace(/<[^>]+>/g, '')).trim();
  if (!note) return '_Rendered example._';
  return ['_Rendered example._', '', '```', note, '```'].join('\n');
}

function cbox(chunk) {
  const label = inline(chunk.match(/<div class="t-label">(.*?)<\/div>/s)?.[1] ?? '');
  const body = inline(chunk.match(/<p class="t-small muted">(.*?)<\/p>/s)?.[1] ?? '');
  return `> **${label}**\n>\n> ${body}`;
}

/* ---------- one route ---------- */

const BLOCK =
  /<h4 class="sub">|<h3[^>]*>|<p [^>]*class="[^"]*(?:lede|t-small)[^"]*"[^>]*>|<p>|<table>|<ul class="bp">|<div class="cbox">|<div class="demo">/g;

function render(route) {
  const open = html.indexOf(`<section class="route" id="${route.id}"`);
  if (open < 0) throw new Error(`route section missing: ${route.id}`);
  const body = html.slice(open, html.indexOf('</section>', open));

  const out = [`# ${inline(body.match(/<h1 class="t-h1">(.*?)<\/h1>/s)?.[1] ?? route.title)}`, ''];
  const STATUS = { shipped: 'Shipped', spec: 'Spec', foundation: 'Foundation' };
  out.push(
    `> ${route.group} · ${STATUS[route.status] ?? route.status} · Spigot design system`,
    `> \`/designsystem#/${route.id}\``,
    '',
  );

  BLOCK.lastIndex = 0;
  for (let m; (m = BLOCK.exec(body));) {
    const tag = m[0];
    const from = m.index;

    if (tag.startsWith('<div')) {
      const end = closeDiv(body, from);
      const chunk = body.slice(from, end);
      out.push(tag.includes('cbox') ? cbox(chunk) : demo(chunk), '');
      BLOCK.lastIndex = end;
      continue;
    }

    const close = tag.startsWith('<table')
      ? '</table>'
      : tag.startsWith('<ul')
        ? '</ul>'
        : tag.startsWith('<h4')
          ? '</h4>'
          : tag.startsWith('<h3')
            ? '</h3>'
            : '</p>';
    const end = body.indexOf(close, from) + close.length;
    const chunk = body.slice(from, end);

    if (tag.startsWith('<h4')) out.push(`## ${inline(chunk)}`, '');
    else if (tag.startsWith('<h3')) out.push(`### ${inline(chunk)}`, '');
    else if (tag.startsWith('<table')) out.push(table(chunk), '');
    else if (tag.startsWith('<ul'))
      out.push(
        [...chunk.matchAll(/<li>(.*?)<\/li>/gs)].map(([, i]) => `- ${inline(i)}`).join('\n'),
        '',
      );
    else out.push(inline(chunk), '');

    BLOCK.lastIndex = end;
  }

  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

/* ---------- write ---------- */

const STATUS_LABEL = { shipped: 'Shipped', spec: 'Spec', foundation: 'Foundation' };

for (const f of readdirSync(DIR))
  if (f.endsWith('-llm.txt') || f === 'llm.txt') unlinkSync(join(DIR, f));

const pages = routes.map(r => ({ ...r, md: render(r) }));
for (const p of pages) writeFileSync(join(DIR, `${p.id}-llm.txt`), p.md);

const combined = [
  '# Spigot design system',
  '',
  `Every page of the design system, in sidebar order. ${pages.length} pages.`,
  'Generated from `/designsystem`. Do not edit.',
  '',
  '## Contents',
  '',
  ...[...new Set(pages.map(p => p.group))].flatMap(g => [
    `### ${g}`,
    '',
    ...pages
      .filter(p => p.group === g)
      .map(p => `- ${p.title} · ${STATUS_LABEL[p.status] ?? p.status} (\`${p.id}-llm.txt\`)`),
    '',
  ]),
  '',
  ...pages.flatMap(p => ['---', '', p.md.trim(), '']),
].join('\n');

writeFileSync(join(DIR, 'llm.txt'), combined + '\n');

console.log(
  `wrote ${pages.length} page files + llm.txt (${(combined.length / 1024).toFixed(1)} KB)`,
);
