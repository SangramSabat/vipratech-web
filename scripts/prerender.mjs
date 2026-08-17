/**
 * Emits one prerendered HTML document per route, plus the sitemap.
 *
 * Implements docs/05-ui-ux-spec.md S1.1 / S1.3: real content HTML in every
 * shipped file, produced by `bun run build` with no extra manual step. The five
 * service offers each get their own document so there is a ranking surface per
 * offer rather than one URL hiding all five behind tabs.
 */
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const templatePath = path.join(distDir, "index.html");
const ssrEntry = path.join(root, ".ssr", "entry-server.js");
const ROOT_DIV = '<div id="root"></div>';
const SITE_URL = "https://vipratech.in";

const { render, routes } = await import(pathToFileURL(ssrEntry).href);
const template = await readFile(templatePath, "utf8");

if (!template.includes(ROOT_DIV)) {
  throw new Error(`prerender: expected ${ROOT_DIV} in dist/index.html`);
}

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

/**
 * Rewrites one `<meta>` tag's `content`, located by its name/property.
 *
 * Matches the whole tag rather than a fixed attribute order, because the shell
 * formats longer tags across several lines.
 */
function setMeta(html, attribute, value) {
  const tag = new RegExp(`<meta\\b[^>]*\\b(?:name|property)="${attribute}"[^>]*>`);
  const match = html.match(tag);
  if (!match) throw new Error(`prerender: no <meta> tag for "${attribute}"`);
  if (!/content="/.test(match[0])) {
    throw new Error(`prerender: <meta> tag for "${attribute}" has no content attribute`);
  }
  const updated = match[0].replace(/content="[^"]*"/, `content="${escapeAttr(value)}"`);
  return html.replace(match[0], updated);
}

function withMetadata(html, route) {
  const url = `${SITE_URL}${route.path}`;

  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);
  out = out.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    (_m, before, after) => `${before}${url}${after}`,
  );
  out = setMeta(out, "description", route.description);
  out = setMeta(out, "og:url", url);
  out = setMeta(out, "og:title", route.title);
  out = setMeta(out, "og:description", route.description);
  out = setMeta(out, "twitter:title", route.title);
  out = setMeta(out, "twitter:description", route.description);
  return out;
}

const emitted = [];

for (const route of routes()) {
  const markup = render(route.path);
  const html = withMetadata(template, route).replace(
    ROOT_DIV,
    `<div id="root">${markup}</div>`,
  );

  // "/" -> dist/index.html; "/services/x/" -> dist/services/x/index.html
  const outPath =
    route.path === "/"
      ? templatePath
      : path.join(distDir, route.path.replace(/^\/|\/$/g, ""), "index.html");

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, html, "utf8");
  emitted.push({ route: route.path, chars: markup.length });
}

// Generated rather than hand-maintained, so it cannot drift from the routes.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes().map((route) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${route.path}</loc>`,
      "    <changefreq>monthly</changefreq>",
      `    <priority>${route.path === "/" ? "1.0" : "0.8"}</priority>`,
      "  </url>",
    ].join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");
await writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

// GitHub Pages serves this for unknown paths.
//
// The app bundle is stripped deliberately. It is a static page with one link,
// so it needs no JavaScript — and leaving the script in meant the bundle booted,
// found no route matching "/404.html", fell back to the home route and rendered
// the home page straight over the 404 (React hydration error #418). The
// stylesheet stays so the page keeps the site's background and type.
//
// The modulepreload hints go too. With the script stripped, the page still
// carried <link rel="modulepreload"> for the React chunk — 61 kB gzip fetched
// on a page that executes nothing. Caught by the per-route JS report in
// check-bundle.mjs, which is what that report is for.
//
// The brand colour is read from the stylesheet's own token rather than typed
// in. It had been hardcoded as #9ae600 (lime-400) and was silently left behind
// when the accent moved to #d6fb41, so the 404 was the one page still wearing
// the old brand.
// Single source of truth for the 404's accent: whatever --color-brand compiles
// to in the shipped stylesheet.
const BRAND = (() => {
  const css = readFileSync(path.join(distDir, "assets", readdirSync(path.join(distDir, "assets")).find((f) => f.endsWith(".css"))), "utf8");
  const m = /--color-brand:\s*([^;]+);/.exec(css);
  return m ? m[1].trim() : "#d6fb41";
})();

const notFound = withMetadata(template, {
  path: "/404.html",
  title: "Page not found — VipraTech Labs",
  description: "That page does not exist. Return to the VipraTech Labs home page.",
})
  .replace(/\s*<script type="module"[^>]*><\/script>/g, "")
  .replace(/\s*<link rel="modulepreload"[^>]*>/g, "")
  .replace(
    ROOT_DIV,
  `<div id="root"><main style="min-height:100vh;display:grid;place-items:center;padding:2rem;text-align:center;font-family:ui-sans-serif,system-ui,sans-serif"><div><p style="font-family:ui-monospace,monospace;font-size:.75rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${BRAND}">404</p><h1 style="margin:.75rem 0 0;font-size:2rem;font-weight:800;color:#f4f4f5">That page does not exist.</h1><p style="margin:1rem 0 2rem;color:#d4d4d8">The link may be out of date.</p><a href="/" style="display:inline-block;background:${BRAND};color:#000;font-weight:700;padding:.85rem 1.75rem;border-radius:.75rem;text-decoration:none">Back to the home page</a></div></main></div>`,
  );
await writeFile(path.join(distDir, "404.html"), notFound, "utf8");

// The SSR bundle is a build artifact, not something to publish.
await rm(path.join(root, ".ssr"), { recursive: true, force: true });

for (const { route, chars } of emitted) {
  console.log(`prerender: ${route.padEnd(34)} ${chars.toLocaleString().padStart(8)} chars`);
}
console.log(`prerender: ${emitted.length} documents, sitemap and 404 written`);
