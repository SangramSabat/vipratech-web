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

test.describe('motion budget (spec S6.1-R, S6.1-R.a, S6.3)', () => {
  /**
   * This asserted `infinite === []` outright until the spec was amended
   * (2026-08-17/2). That check could not tell a particle field from a diagram
   * of a claims pipeline, and banned the second in order to prevent the first.
   *
   * It is not relaxed here. Under `reduce` the answer is still zero, exactly as
   * before. Under `no-preference`, anything that loops must clear every
   * S6.1-R.a condition — period, easing, animated property, and whether it is
   * decoration at all — so a looping animation now has *more* to satisfy than
   * when looping was simply forbidden.
   */
  const loops = (page: import('@playwright/test').Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite';
        })
        .map((el) => {
          const anim = el.getAnimations()[0];
          const timing = anim?.effect?.getTiming?.() ?? {};
          let props: string[] = [];
          try {
            props = [
              ...new Set(
                (anim!.effect as KeyframeEffect)
                  .getKeyframes()
                  .flatMap((k) =>
                    Object.keys(k).filter(
                      (n) => !['offset', 'computedOffset', 'easing', 'composite'].includes(n),
                    ),
                  ),
              ),
            ];
          } catch {
            props = ['?'];
          }
          return {
            name: getComputedStyle(el).animationName,
            durationMs: typeof timing.duration === 'number' ? timing.duration : -1,
            easing: timing.easing ?? '',
            props,
            ariaHidden: el.getAttribute('aria-hidden') === 'true',
            hasText: (el.textContent ?? '').trim().length > 0,
          };
        }),
    );

  test('reduced motion stops every loop outright', async ({browser}) => {
    const context = await browser.newContext({reducedMotion: 'reduce'});
    const page = await context.newPage();
    await page.goto('/');
    expect(await loops(page)).toEqual([]);
    await context.close();
  });

  test('any loop that does run is diegetic, never ambient (S6.1-R.a)', async ({browser}) => {
    const context = await browser.newContext({reducedMotion: 'no-preference'});
    const page = await context.newPage();
    await page.goto('/');

    for (const loop of await loops(page)) {
      const why = `${loop.name} (${loop.durationMs}ms ${loop.easing}, ${loop.props.join('+')})`;
      // Slow enough to read as system activity rather than blinking.
      expect(loop.durationMs, `${why}: period must be >= 5s`).toBeGreaterThanOrEqual(5000);
      // Linear, so no frame is accented and the loop recedes.
      expect(loop.easing, `${why}: must be linear`).toBe('linear');
      // Opacity only — geometry would make it ambient decoration by definition.
      expect(loop.props, `${why}: opacity only`).toEqual(['opacity']);
      // Decoration, not the information carrier.
      expect(loop.ariaHidden, `${why}: must be aria-hidden`).toBe(true);
      expect(loop.hasText, `${why}: must carry no text`).toBe(false);
    }
    await context.close();
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

test.describe('surface elevation (S6.6, family.co)', () => {
  /**
   * family.co elevates with an inset ring in the card's own colour rather than
   * a cast shadow — measured 30 occurrences of `0 0 0 1px inset` against at
   * most 2 of any drop shadow. The two modes stay distinct here: pressed at
   * rest, floating on interaction. This asserts both, because a regression
   * would most likely collapse them into one.
   */
  test('cards carry an inset ring at rest and cast only on hover', async ({page}) => {
    await page.goto('/');
    const card = page.locator('.lift').first();
    await card.waitFor();

    const rest = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(rest).toContain('inset');
    // exactly one shadow at rest: the ring, nothing cast
    expect(rest.split(',')).toHaveLength(1);

    await card.hover();
    await page.waitForTimeout(700);
    const hover = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(hover).toContain('inset');
    expect(hover.split(',').length).toBeGreaterThan(1);
  });
});

test.describe('type scale integrity (spec S4.4)', () => {
  /**
   * Regression test for a defect that shipped invisibly for weeks.
   *
   * `cn()` was `twMerge(clsx(...))`. tailwind-merge treats `text-lead` — our
   * custom font-size token — as conflicting with `text-ink-muted`, a colour,
   * because both begin `text-`. It cannot know otherwise; the token is ours.
   * So it silently deleted `text-lead` from every section subhead, which
   * rendered at 16px against the authored 20px.
   *
   * Asserts the computed size rather than the class list, because the class
   * list was exactly what lied: the source said `text-lead` and the DOM did not.
   */
  test('section subheads render at the lead size, not body size', async ({page}) => {
    await page.goto('/');
    const subheads = page.locator('section p.measure.mt-4');
    const count = await subheads.count();
    expect(count).toBeGreaterThan(3);

    const lead = await page.evaluate(() => {
      const probe = document.createElement('p');
      probe.className = 'text-lead';
      document.body.append(probe);
      const size = getComputedStyle(probe).fontSize;
      probe.remove();
      return size;
    });

    for (let i = 0; i < count; i++) {
      const size = await subheads.nth(i).evaluate((el) => getComputedStyle(el).fontSize);
      expect(size, `subhead ${i} must be the lead size`).toBe(lead);
    }
  });
});
