/**
 * Copy impact metrics — docs/07 §6 (P1–P4).
 *
 * Replaces docs/06 §4's "70% new prose" target, which counted words. Word count
 * is the one content metric a padded draft always passes, and it is inversely
 * correlated with the quality of the reference class: 8090, Factory and Heizen
 * are strong because of restraint and proof density, not volume.
 *
 * Two of these are mechanical and two are heuristic; the report says which, so
 * a heuristic number is never mistaken for a measurement.
 *
 *   P1 specificity   [mechanical] proper nouns + concrete numerals / 100 words
 *   P2 proof density [heuristic]  claims carrying a number, artifact or system
 *   P3 adjective load[mechanical] unquantified evaluative adjectives / 100 words
 *   P4 labour        [mechanical] words before the visitor's problem is named
 *
 * Usage: node scripts/copy-metrics.mjs [dist-dir]
 */
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const DIST = process.argv[2] ?? 'dist';

// Evaluative adjectives that assert quality without carrying a number. This is
// the list the reference class avoids; it is deliberately conservative, since a
// false positive here penalises honest copy.
const EVALUATIVE = new Set([
  'powerful', 'seamless', 'robust', 'cutting-edge', 'innovative', 'revolutionary',
  'best-in-class', 'world-class', 'leading', 'premier', 'unparalleled', 'exceptional',
  'amazing', 'incredible', 'stunning', 'beautiful', 'elegant', 'intuitive',
  'effortless', 'simple', 'easy', 'fast', 'quick', 'rapid', 'advanced', 'smart',
  'intelligent', 'comprehensive', 'complete', 'holistic', 'scalable', 'flexible',
  'dynamic', 'modern', 'next-generation', 'state-of-the-art', 'industry-leading',
  'transformative', 'game-changing', 'groundbreaking', 'sophisticated', 'streamlined',
]);

// Words that signal the visitor's own problem is being named (P4).
const PROBLEM = /\b(you|your|lose|losing|lost|manual|manually|by hand|gap|gaps|broken|slow|error|errors|mismatch|reconcil|dispute|leak|leakage|spend|cost|risk|fail|wrong|missing|delay)\b/i;

const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const analyse = (text) => {
  const words = text.split(/\s+/).filter(Boolean);
  const n = words.length || 1;

  // P1 — proper nouns (capitalised mid-sentence) plus concrete numerals.
  const numerals = words.filter((w) => /\d/.test(w)).length;
  const propers = words.filter((w, i) => i > 0 && /^[A-Z][a-z]{2,}/.test(w) && !/[.!?]$/.test(words[i - 1])).length;
  const p1 = ((propers + numerals) / n) * 100;

  // P3 — evaluative adjectives with no number attached.
  const adjectives = words.filter((w) => EVALUATIVE.has(w.toLowerCase().replace(/[^a-z-]/g, '')));
  const p3 = (adjectives.length / n) * 100;

  // P4 — words before the visitor's problem is named.
  let p4 = n;
  for (let i = 0; i < words.length; i++) {
    if (PROBLEM.test(words[i])) { p4 = i; break; }
  }

  // P2 [heuristic] — sentences asserting something, and how many carry evidence.
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length >= 4);
  const claims = sentences.filter((s) => /\b(we|our|the platform|it|this)\b/i.test(s) || /\b(is|are|does|delivers|builds|handles|runs)\b/i.test(s));
  const proven = claims.filter((s) => /\d/.test(s) || /\b(audit|evidence|log|record|gate|approval|register|trail)\b/i.test(s));
  const p2 = claims.length ? proven.length / claims.length : 0;

  return {
    words: n, p1: +p1.toFixed(2), p2: +p2.toFixed(2), p3: +p3.toFixed(2), p4,
    adjectivesFound: [...new Set(adjectives.map((a) => a.toLowerCase()))],
  };
};

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

// Gates, recalibrated against the measured baseline on 2026-08-18.
//
// docs/07 §6 originally proposed P1>=4.0 and P3<=2.0. Both were invented before
// anything was measured, and the baseline came in at P1 16.9-18.3 and P3
// 0.13-0.41 — the existing copy is roughly 4x more specific than the gate meant
// to stretch it, and six times under the adjective ceiling. Gates set that far
// below reality are not targets, they are decoration: every page passes on day
// one and the metric never says anything again.
//
// P1 and P3 are therefore set just inside the measured baseline, as regression
// guards: they now fail if the copy gets vaguer or floffier than it is today.
// P4 is the one gate that is genuinely aspirational, because it is the one the
// baseline actually misses — service pages take 71-157 words to name the
// reader's problem, against 6 on the home page.
const GATES = {p1: 15.0, p2: 0.6, p3: 0.5, p4: 40};
const pages = walk(DIST).filter((p) => !p.includes('404')).sort();
const rows = pages.map((p) => ({page: p.replace(`${DIST}/`, '').replace('/index.html', '') || '/', ...analyse(textOf(readFileSync(p, 'utf8')))}));

console.log('\nCopy impact — docs/07 §6\n');
console.log('page'.padEnd(34), 'words'.padStart(6), 'P1'.padStart(7), 'P2'.padStart(6), 'P3'.padStart(6), 'P4'.padStart(5));
console.log('-'.repeat(70));
for (const r of rows) {
  const mark = (ok) => (ok ? ' ' : '!');
  console.log(
    r.page.padEnd(34),
    String(r.words).padStart(6),
    `${r.p1.toFixed(2)}${mark(r.p1 >= GATES.p1)}`.padStart(7),
    `${r.p2.toFixed(2)}${mark(r.p2 >= GATES.p2)}`.padStart(6),
    `${r.p3.toFixed(2)}${mark(r.p3 <= GATES.p3)}`.padStart(6),
    `${String(r.p4)}${mark(r.p4 <= GATES.p4)}`.padStart(5),
  );
}
console.log('-'.repeat(70));
console.log(`gates: P1>=${GATES.p1}  P2>=${GATES.p2}  P3<=${GATES.p3}  P4<=${GATES.p4}   ("!" = misses)`);
console.log('P1/P3/P4 mechanical · P2 heuristic — treat P2 as a pointer, not a measurement');
const adj = [...new Set(rows.flatMap((r) => r.adjectivesFound))];
console.log(`\nevaluative adjectives in use: ${adj.length ? adj.join(', ') : 'none'}`);
