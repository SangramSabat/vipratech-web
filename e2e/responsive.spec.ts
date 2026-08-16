import {expect, test} from '@playwright/test';
import {contrastFailures, undersizedTapTargets} from './helpers';

const WIDTHS = [360, 768, 1280, 1920];

test.describe('responsive (spec S8.1–S8.5)', () => {
  for (const width of WIDTHS) {
    test(`no horizontal overflow at ${width}px`, async ({page}) => {
      await page.setViewportSize({width, height: 900});
      await page.goto('/');

      const {scrollWidth, clientWidth} = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `page scrolls sideways at ${width}px`).toBeLessThanOrEqual(clientWidth);
    });

    test(`tap targets and contrast hold at ${width}px`, async ({page}) => {
      await page.setViewportSize({width, height: 900});
      await page.goto('/');
      expect(await undersizedTapTargets(page)).toEqual([]);
      expect(await contrastFailures(page)).toEqual([]);
    });
  }

  test('all five service tabs are reachable without a hidden scroll on desktop', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 900});
    await page.goto('/');

    // The heading counts five; the list used to overflow one row and hide the
    // fifth behind a scroll with no affordance.
    const hidden = await page.evaluate(() => {
      const list = document.querySelector('[role="tablist"]')!;
      const lr = list.getBoundingClientRect();
      return [...list.querySelectorAll('[role="tab"]')]
        .filter((t) => {
          const r = t.getBoundingClientRect();
          return r.left < lr.left - 1 || r.right > lr.right + 1;
        })
        .map((t) => t.textContent?.trim());
    });
    expect(hidden).toEqual([]);
  });
});

test.describe('motion budget (spec S6.1, S6.3)', () => {
  test('nothing animates forever, in either motion preference', async ({browser}) => {
    for (const reducedMotion of ['reduce', 'no-preference'] as const) {
      const context = await browser.newContext({reducedMotion});
      const page = await context.newPage();
      await page.goto('/');

      const infinite = await page.evaluate(() =>
        [...document.querySelectorAll('*')]
          .filter((el) => {
            const cs = getComputedStyle(el);
            return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite';
          })
          .map((el) => getComputedStyle(el).animationName),
      );
      expect(infinite, `infinite animation with reducedMotion=${reducedMotion}`).toEqual([]);
      await context.close();
    }
  });

  test('reduced motion clamps every transition to 150ms', async ({browser}) => {
    const context = await browser.newContext({reducedMotion: 'reduce'});
    const page = await context.newPage();
    await page.goto('/');

    const tooSlow = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .map((el) => parseFloat(getComputedStyle(el).transitionDuration))
        .filter((d) => d > 0.15),
    );
    expect(tooSlow).toEqual([]);
    await context.close();
  });

  /**
   * The failure mode that matters for scroll-driven reveals (S6.6): the start
   * state is opacity 0, so any element whose animation never resolves is
   * content the visitor simply cannot read. That is invisible in a screenshot
   * of the top of the page and catastrophic if it ships, so it is asserted in
   * both motion preferences, scrolling the whole page.
   */
  test('scroll reveals never strand content invisible', async ({browser}) => {
    for (const reducedMotion of ['reduce', 'no-preference'] as const) {
      const context = await browser.newContext({reducedMotion});
      const page = await context.newPage();
      await page.goto('/');

      const steps = await page.evaluate(() =>
        Math.ceil(document.body.scrollHeight / (window.innerHeight / 2)),
      );
      const stranded: string[] = [];

      for (let i = 0; i <= steps; i++) {
        await page.evaluate((n) => window.scrollTo(0, (n * window.innerHeight) / 2), i);
        await page.waitForTimeout(100);
        // Judge only elements settled fully inside the viewport; one that is
        // still entering is legitimately mid-animation.
        stranded.push(
          ...(await page.evaluate(() =>
            [...document.querySelectorAll('.reveal, .reveal-stagger > *')]
              .filter((el) => {
                const r = el.getBoundingClientRect();
                const settled = r.top >= 0 && r.bottom <= window.innerHeight;
                return settled && Number(getComputedStyle(el).opacity) < 0.95;
              })
              .map((el) => el.closest('section')?.id ?? 'unknown'),
          )),
        );
      }

      expect(
        [...new Set(stranded)],
        `unreadable sections with reducedMotion=${reducedMotion}`,
      ).toEqual([]);
      await context.close();
    }
  });
});

test.describe('core web vitals (spec S9.3, S9.4)', () => {
  test('LCP is static prerendered text and the page does not shift', async ({page}) => {
    await page.addInitScript(() => {
      (window as unknown as {__cls: number}).__cls = 0;
      new PerformanceObserver((list) => {
        const w = window as unknown as {__lcp?: {time: number; animated: boolean}};
        const entry = list.getEntries().at(-1) as PerformanceEntry & {element?: Element};
        w.__lcp = {
          time: entry.startTime,
          // A prerendered element is not mid-animation when it paints.
          animated: entry.element
            ? getComputedStyle(entry.element).animationName !== 'none'
            : false,
        };
      }).observe({type: 'largest-contentful-paint', buffered: true});

      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as (PerformanceEntry & {value: number; hadRecentInput: boolean})[]) {
          if (!e.hadRecentInput) (window as unknown as {__cls: number}).__cls += e.value;
        }
      }).observe({type: 'layout-shift', buffered: true});
    });

    await page.goto('/', {waitUntil: 'networkidle'});
    await page.waitForTimeout(1000);

    const lcp = await page.evaluate(() => (window as unknown as {__lcp?: {time: number; animated: boolean}}).__lcp);
    const cls = await page.evaluate(() => (window as unknown as {__cls: number}).__cls);

    expect(lcp).toBeTruthy();
    expect(lcp!.animated, 'LCP element is animation-gated').toBe(false);
    expect(lcp!.time, 'LCP').toBeLessThan(2000);
    expect(cls, 'CLS').toBeLessThanOrEqual(0.05);
  });
});
