/**
 * Injects the build-time rendered markup into dist/index.html.
 *
 * Implements docs/05-ui-ux-spec.md S1.1 / S1.3: real content HTML in the
 * shipped file, produced by `bun run build` with no extra manual step.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const htmlPath = path.join(root, "dist", "index.html");
const ssrEntry = path.join(root, ".ssr", "entry-server.js");
const ROOT_DIV = '<div id="root"></div>';

const { render } = await import(pathToFileURL(ssrEntry).href);
const markup = render();

const html = await readFile(htmlPath, "utf8");
if (!html.includes(ROOT_DIV)) {
  throw new Error(`prerender: expected ${ROOT_DIV} in dist/index.html`);
}

await writeFile(htmlPath, html.replace(ROOT_DIV, `<div id="root">${markup}</div>`), "utf8");

// The SSR bundle is a build artifact, not something to publish.
await rm(path.join(root, ".ssr"), { recursive: true, force: true });

console.log(`prerender: injected ${markup.length.toLocaleString()} chars into dist/index.html`);
