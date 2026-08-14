import type {Page} from '@playwright/test';

/** Roles that a user can operate, and which therefore need an accessible name. */
const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'slider',
  'tab',
  'combobox',
  'checkbox',
  'textbox',
  'switch',
  'radio',
  'menuitem',
]);

interface AxNode {
  role: string;
  name: string;
}

/**
 * Reads interactive nodes from the real accessibility tree via CDP.
 *
 * Deliberately not a DOM walk. An earlier DOM-based check reported every
 * control as named because it searched ancestors for `aria-label` — assistive
 * technology does not do that, and it hid five sliders whose accessible name
 * was empty. The AX tree is what a screen reader actually consumes, so it is
 * what we assert against (spec S7.9, WCAG 4.1.2).
 */
export async function interactiveAxNodes(page: Page): Promise<AxNode[]> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Accessibility.enable');
  const {nodes} = (await cdp.send('Accessibility.getFullAXTree')) as {
    nodes: {role?: {value?: string}; name?: {value?: string}; ignored?: boolean}[];
  };
  await cdp.detach();

  return nodes
    .filter((n) => !n.ignored && INTERACTIVE_ROLES.has(n.role?.value ?? ''))
    .map((n) => ({role: n.role?.value ?? '', name: (n.name?.value ?? '').trim()}));
}

interface ContrastFailure {
  text: string;
  ratio: number;
  required: number;
  fontSize: number;
}

/**
 * WCAG contrast over every rendered text node.
 *
 * Colours are normalised through a canvas because `getComputedStyle` returns
 * `oklch(...)` for this palette; parsing those three numbers as RGB produces
 * nonsense (it briefly made a white heading look like a 1:1 failure).
 */
export async function contrastFailures(page: Page): Promise<ContrastFailure[]> {
  return page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', {willReadFrequently: true})!;
    const cache = new Map<string, [number, number, number, number]>();

    const toRgba = (css: string): [number, number, number, number] => {
      const hit = cache.get(css);
      if (hit) return hit;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      const out: [number, number, number, number] = [d[0], d[1], d[2], d[3] / 255];
      cache.set(css, out);
      return out;
    };

    const luminance = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    // Walk ancestors for the first opaque background actually painted behind.
    const backgroundOf = (el: Element): number[] => {
      let node: Element | null = el;
      let firstSeen: number[] | null = null;
      while (node) {
        const [r, g, b, a] = toRgba(getComputedStyle(node).backgroundColor);
        if (a > 0) {
          firstSeen ??= [r, g, b];
          if (a >= 0.999) return [r, g, b];
        }
        node = node.parentElement;
      }
      return firstSeen ?? [9, 9, 11];
    };

    const failures: {text: string; ratio: number; required: number; fontSize: number}[] = [];
    const selector = 'p,span,a,h1,h2,h3,h4,li,dt,dd,button,label,legend,figcaption,strong';

    for (const el of document.querySelectorAll(selector)) {
      if (!el.textContent?.trim() || el.children.length > 0) continue;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
      if (el.closest('.sr-only')) continue;

      const fg = luminance(toRgba(cs.color));
      const bg = luminance(backgroundOf(el));
      const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
      const ratio = (hi + 0.05) / (lo + 0.05);

      const fontSize = parseFloat(cs.fontSize);
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
      const required = isLarge ? 3 : 4.5;

      if (ratio < required) {
        failures.push({
          text: el.textContent.trim().slice(0, 60),
          ratio: Number(ratio.toFixed(2)),
          required,
          fontSize,
        });
      }
    }
    return failures;
  });
}

/** Interactive targets smaller than the 44px floor (spec S7.4). */
export async function undersizedTapTargets(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const bad: string[] = [];
    for (const el of document.querySelectorAll('a,button,[role="tab"],input,textarea,[role="slider"]')) {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      if (el.closest('.sr-only')) continue;
      if (r.height < 44) {
        bad.push(`${el.tagName} "${(el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return bad;
  });
}

/** Opens the diagnostic modal and selects enough to enable submission. */
export async function openDiagnostic(page: Page) {
  await page.getByRole('button', {name: /^run the fit diagnostic$/i}).first().click();
  return page.getByRole('dialog');
}
