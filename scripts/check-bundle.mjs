/**
 * Enforces the bundle budgets in docs/05-ui-ux-spec.md S9.1.
 *
 * Budgets are split so the number that matters is visible: React is a fixed
 * floor we cannot move without changing framework, while app code is the part
 * that grows as the site does.
 */
import {readdir, readFile} from 'node:fs/promises';
import {glob} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import path from 'node:path';

const BUDGETS = {
  appJsGzipKb: 45, // entry chunk, excluding the React vendor chunk
  initialJsGzipKb: 105, // entry + React, i.e. what a first visit downloads
  cssGzipKb: 12,
};

const assetsDir = path.join(process.cwd(), 'dist', 'assets');
const files = await readdir(assetsDir);

const gzipKb = async (file) =>
  gzipSync(await readFile(path.join(assetsDir, file))).length / 1024;

let appJs = 0;
let reactJs = 0;
let css = 0;

for (const file of files) {
  const size = await gzipKb(file);
  if (file.endsWith('.css')) css += size;
  else if (!file.endsWith('.js')) continue;
  else if (file.startsWith('react-')) reactJs += size;
  // Lazy chunks are not part of the initial download.
  else if (file.startsWith('index-')) appJs += size;
}

const initial = appJs + reactJs;
const rows = [
  ['app JS (gzip)', appJs, BUDGETS.appJsGzipKb],
  ['initial JS (gzip)', initial, BUDGETS.initialJsGzipKb],
  ['CSS (gzip)', css, BUDGETS.cssGzipKb],
];

let failed = false;
for (const [label, actual, budget] of rows) {
  const ok = actual <= budget;
  if (!ok) failed = true;
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(20)} ${actual.toFixed(2).padStart(7)} kB  (budget ${budget} kB)`,
  );
}

if (failed) {
  console.error('\nBundle budget exceeded — see docs/05-ui-ux-spec.md S9.1.');
  process.exit(1);
}


/* ---------------------------------------------------------------------------
   Per-route initial JS — docs/07 §8.
   ---------------------------------------------------------------------------
   §8 replaces the single global app-JS budget with per-route budgets, on the
   argument that most routes need no JavaScript at all:

       Class T (Trust)      0 kB   /services/*, /engage, /work/*, diagnostic
       Class N (Narrative)  8 kB   /, /for/*, /sectors/*
       Class S (Showcase)  30 kB   /platform, /products

   Those budgets are NOT enforced below, and it would be dishonest to pretend
   otherwise. Every prerendered document references the same entry chunk, so
   every route currently downloads the same bytes — a visitor to a service page
   downloads the home page's simulator and calculator code. Trust-class routes
   are over a 0 kB budget by the entire entry chunk.

   This is architectural, not an oversight. Reaching §8 needs one of:

     a) per-route entry points (Vite multi-entry), so each document references
        only its own chunk; or
     b) no hydration on static routes, shipping prerendered HTML alone.

   The obvious shortcut — React.lazy on the page components — is already ruled
   out by spec amendment 2026-08-14/3: renderToString emits the Suspense
   fallback rather than the component, which removed real sections from the
   prerendered HTML and traded the site's primary SEO fix for ~8 kB.

   So this reports the truth per route and holds the line at today's measured
   value. It cannot pass §8, and it will fail if the shared chunk grows, which
   is the property actually worth having until the architecture changes.
   --------------------------------------------------------------------------- */

const CEILING_KB = 45; // today's measured shared entry; not §8's target

const docs = [];
for await (const file of glob('dist/**/index.html')) docs.push(file);
docs.push('dist/404.html');

const sizeCache = new Map();
const chunkKb = async (name) => {
  if (!sizeCache.has(name)) {
    sizeCache.set(name, gzipSync(await readFile(path.join('dist', name))).length / 1024);
  }
  return sizeCache.get(name);
};

console.log('\nPer-route initial JS (gzip) — docs/07 §8');
let worst = 0;
for (const doc of docs.sort()) {
  let html;
  try { html = await readFile(doc, 'utf8'); } catch { continue; }
  const chunks = [...new Set([...html.matchAll(/assets\/[A-Za-z0-9._-]+\.js/g)].map((m) => m[0]))];
  // A document may reference no JS at all — /404.html is exactly that, and the
  // first version of this reporter crashed on it by indexing chunks[0]. Zero is
  // the answer worth printing, not a crash.
  let total = 0;
  for (const c of chunks) total += await chunkKb(c);
  const reactChunk = chunks.find((c) => c.includes('react-'));
  // React is a fixed floor, reported separately above; this is app code only.
  const appOnly = total - (reactChunk ? await chunkKb(reactChunk) : 0);
  worst = Math.max(worst, appOnly);
  const route = doc.replace('dist', '').replace('/index.html', '') || '/';
  console.log(`  ${route.padEnd(34)} ${appOnly.toFixed(2).padStart(7)} kB   (${chunks.length} chunks)`);
}
console.log(`  ${'—'.repeat(34)}`);
console.log(`  worst route ${worst.toFixed(2)} kB against a ${CEILING_KB} kB ceiling`);
console.log('  §8 targets (T 0 / N 8 / S 30 kB) are NOT met: every route loads the same shared chunk.');
if (worst > CEILING_KB) {
  console.error(`\nFAIL: worst route ${worst.toFixed(2)} kB exceeds the ${CEILING_KB} kB ceiling`);
  process.exit(1);
}
