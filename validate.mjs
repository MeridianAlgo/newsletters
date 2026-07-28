// Run: node validate.mjs
// Catches the two ways this repo breaks the website: a manifest entry whose PDF
// isn't there, and a PDF nobody listed.
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const m = JSON.parse(readFileSync(new URL('./manifest.json', import.meta.url)));
const errors = [];
const seen = new Set();
const listed = new Set();

const seriesIds = new Set(m.series.map((s) => s.id));

for (const n of m.newsletters) {
  for (const key of ['id', 'title', 'description', 'series', 'week', 'category', 'publishedDate', 'file', 'thumbnail']) {
    if (n[key] === undefined || n[key] === '') errors.push(`${n.id ?? '(no id)'}: missing "${key}"`);
  }
  if (seen.has(n.id)) errors.push(`${n.id}: duplicate id`);
  seen.add(n.id);
  if (!seriesIds.has(n.series)) errors.push(`${n.id}: unknown series "${n.series}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(n.publishedDate)) errors.push(`${n.id}: publishedDate must be YYYY-MM-DD`);
  for (const p of [n.file, n.thumbnail]) {
    if (!existsSync(new URL(`./${p}`, import.meta.url))) errors.push(`${n.id}: "${p}" does not exist`);
  }
  listed.add(n.file);
}

for (const f of readdirSync(new URL('./issues', import.meta.url))) {
  if (f.endsWith('.pdf') && !listed.has(`issues/${f}`)) errors.push(`issues/${f}: on disk but not in manifest`);
}

if (errors.length) {
  console.error(`${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`manifest OK — ${m.newsletters.length} issues across ${m.series.length} series`);
