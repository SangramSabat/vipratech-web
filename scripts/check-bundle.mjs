/**
 * Enforces the bundle budgets in docs/05-ui-ux-spec.md S9.1.
 *
 * Budgets are split so the number that matters is visible: React is a fixed
 * floor we cannot move without changing framework, while app code is the part
 * that grows as the site does.
 */
import {readdir, readFile} from 'node:fs/promises';
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
