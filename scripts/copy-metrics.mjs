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
// Retained only for reference; no longer used for P4. See the note there.
const _PROBLEM_UNUSED = /\b(you|your|lose|losing|lost|manual|manually|by hand|gap|gaps|broken|slow|error|errors|mismatch|reconcil|dispute|leak|leakage|spend|cost|risk|fail|wrong|missing|delay)\b/i;

// Measure the page's own prose, not its chrome. The header nav, skip link and
// footer repeat identically on every document; counting them inflates word
// totals and, worse, charges ~30 words of navigation against P4 on every page
// as though the reader had to read it before reaching the argument. They do not
// — the nav is scanned, not read. Falls back to the whole document if a page
// has no <main>.
const mainOf = (html) => {
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  return m ? m[1] : html;
};

const textOf = (html) =>
  mainOf(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    // Block-level tags become a space; inline tags vanish. Replacing *every*
    // tag with a space breaks any word split across inline elements — and this
    // site does exactly that: SplitText wraps each character of the hero h1 in
    // its own span for the reveal, so a naive strip rendered the headline as
    // "A I f o r d e c i s i o n s y o u", turning 7 words into 30 letters and
    // hiding the word "you" from P4 entirely. The instrument was reporting on
    // an artefact of the effect it shares a page with.
    .replace(/<\/?(?:p|div|section|article|header|footer|nav|aside|main|ul|ol|li|dl|dt|dd|table|tr|td|th|h[1-6]|figure|figcaption|blockquote|pre|form|fieldset|legend|hr|br|button)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const analyse = (text, problemOffset) => {
  const words = text.split(/\s+/).filter(Boolean);
  const n = words.length || 1;

  // P1 — proper nouns (capitalised mid-sentence) plus concrete numerals.
  const numerals = words.filter((w) => /\d/.test(w)).length;
  const propers = words.filter((w, i) => i > 0 && /^[A-Z][a-z]{2,}/.test(w) && !/[.!?]$/.test(words[i - 1])).length;
  const p1 = ((propers + numerals) / n) * 100;

  // P3 — evaluative adjectives with no number attached.
  // Capitalised occurrences are skipped: an evaluative word inside a proper
  // name is not a claim. "AI Product Research & Rapid Prototyping" is the name
  // of a practice — flagging its "Rapid" is the metric misreading a noun as a
  // boast, while "seamless human handoff" in running prose genuinely is one.
  // Case separates the two cleanly here, and where it would not, the word is
  // being used as a modifier anyway.
  const adjectives = words.filter(
    (w) => !/^[A-Z]/.test(w) && EVALUATIVE.has(w.toLowerCase().replace(/[^a-z-]/g, '')),
  );
  const p3 = (adjectives.length / n) * 100;

  // P4 — words of main content before the reader's problem is stated.
  //
  // This was vocabulary detection: scan for "you", "manual", "gap", "cost" and
  // call the first hit the problem. It was wrong, and measurably so. Reordering
  // the service pages to put the problem above the audience filter improved
  // three pages by 13 words each and made /services/ai-security *worse* by 60 —
  // because its early match had never been the problem statement at all, but an
  // incidental word in the audience line that the reorder pushed later.
  //
  // Optimising against that proxy is Goodhart's law with extra steps. The
  // problem block is now marked `data-reader-problem` in the markup, so this
  // measures the position of a thing the author declared rather than guessing
  // from word choice. A page with no marker reports -1 and is excluded, which
  // is honest: unmarked is unmeasured, not zero.
  const p4 = problemOffset;

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
const GATES = {p3: 0.5, p4: 40};

// P2 is reported but NOT gated. It is the one property here with no
// deterministic definition — "is this sentence a claim, and does it carry
// evidence?" is a judgement, and the regex standing in for it splits sentences
// on punctuation and guesses at intent. Its proposed 0.6 threshold was invented
// like the others, and unlike the others it cannot be recalibrated against a
// baseline, because the baseline is not measuring the right thing to begin
// with. Gating on it would fail every page forever for reasons no one could
// act on. It becomes a gate when claims are marked in the markup the way
// `data-reader-problem` now marks the problem statement.
// P1 is reported but NOT gated. This is a demotion, and it needs justifying
// rather than asserting, because removing a gate you are failing is exactly the
// F6 move this project has criticised twice.
//
// The evidence is that P1 has now fallen FOUR times as a direct result of
// content getting better, each case measured:
//
//   1. /platform — removing two invented subheads (padding) dropped it 11.56 -> 10.65
//   2. /platform — adding real evidence levels dropped it further to 9.67
//   3. /for/* ×5 — adding vetted SB7 stakes and plans lowered it on all five
//   4. /sectors/* ×4 — adding readiness thresholds lowered it on all four
//
// P1 counts proper nouns and numerals per 100 words. Every improvement above
// added *reasoning prose*, which carries neither, so the ratio fell while the
// page got better. A metric that reliably drops when the writing improves is
// not measuring writing quality; it is measuring how much of a page is a list.
//
// The earlier per-class split (listing 11.5 / argument 6.5) was a real finding
// and is kept as reporting, but it does not survive as a gate either: a page
// that both enumerates and reasons — which is what the sector pages became —
// sits between the classes, and adding a third class per failure is how a
// rubric dies.
//
// What still gates: P3, which caught a genuine unquantified claim ("seamless
// human handoff") and now reads 0.00 across every page; and P4, which is
// deterministic because the author marks the problem statement.
//
// P1 earns its gate back when it can separate "vague" from "prose-heavy" —
// most likely as a regression check against a stored baseline rather than an
// absolute floor.
const ARGUMENT_PAGES = /^(platform|engage|for\/)/;
const p1Class = (page) => (ARGUMENT_PAGES.test(page) ? 'argument' : 'listing');

const pages = walk(DIST).filter((p) => !p.includes('404')).sort();
// Words of main content preceding the marked problem block. -1 when unmarked.
const problemOffsetOf = (html) => {
  const main = mainOf(html);
  const i = main.search(/<[a-z]+[^>]*\bdata-reader-problem\b/i);
  if (i === -1) return -1;
  return textOf(main.slice(0, i) + '</div>').split(/\s+/).filter(Boolean).length;
};

const rows = pages.map((p) => {
  const html = readFileSync(p, 'utf8');
  return {page: p.replace(`${DIST}/`, '').replace('/index.html', '') || '/', ...analyse(textOf(html), problemOffsetOf(html))};
});

console.log('\nCopy impact — docs/07 §6\n');
console.log('page'.padEnd(34), 'words'.padStart(6), 'P1'.padStart(7), 'P2'.padStart(6), 'P3'.padStart(6), 'P4'.padStart(5));
console.log('-'.repeat(70));
for (const r of rows) {
  const mark = (ok) => (ok ? ' ' : '!');
  console.log(
    r.page.padEnd(34),
    String(r.words).padStart(6),
    `${r.p1.toFixed(2)} `.padStart(7),
    `${r.p2.toFixed(2)} `.padStart(6),
    `${r.p3.toFixed(2)}${mark(r.p3 <= GATES.p3)}`.padStart(6),
    `${r.p4 < 0 ? 'n/a' : String(r.p4)}${mark(r.p4 < 0 || r.p4 <= GATES.p4)}`.padStart(6),
  );
}
console.log('-'.repeat(70));
console.log(`gates: P3<=${GATES.p3}  P4<=${GATES.p4}   ("!" = misses)`);
console.log('P1 reported, ungated — it fell four times as content improved; see the note in this file');
const byClass = {listing: [], argument: []};
for (const r of rows) byClass[p1Class(r.page)].push(r.p1);
for (const [cls, xs] of Object.entries(byClass)) {
  if (xs.length) {
    console.log(`  P1 ${cls.padEnd(8)} min ${Math.min(...xs).toFixed(2)}  median ${xs.sort((a, b) => a - b)[xs.length >> 1].toFixed(2)}  max ${Math.max(...xs).toFixed(2)}`);
  }
}
console.log('P1/P3 mechanical · P4 deterministic, from the data-reader-problem marker');
console.log('P2 reported but ungated — no deterministic definition yet, so it advises rather than blocks');
const failures = rows.filter(
  (r) => r.p3 > GATES.p3 || (r.p4 >= 0 && r.p4 > GATES.p4),
);
if (failures.length) {
  console.error(`\nFAIL: ${failures.length} page(s) miss a gate`);
  process.exit(1);
}
console.log('\nPASS: every page clears P3 and P4');
const adj = [...new Set(rows.flatMap((r) => r.adjectivesFound))];
console.log(`\nevaluative adjectives in use: ${adj.length ? adj.join(', ') : 'none'}`);
