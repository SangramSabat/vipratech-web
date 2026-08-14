import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * Build-time prerender entry (docs/05-ui-ux-spec.md §1, S1.1).
 *
 * The site is a static SPA, so without this step `dist/index.html` ships an
 * empty root div and non-JS-rendering crawlers — LinkedIn, Slack, Bing, AI
 * crawlers — see nothing at all. Rendering to a string at build time puts the
 * real copy in the HTML while the client still hydrates the same tree, so no
 * interactivity is lost.
 */
export function render(): string {
  return renderToString(<App />);
}
