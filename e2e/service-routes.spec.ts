import {expect, test} from '@playwright/test';
import {contrastFailures, interactiveAxNodes, undersizedTapTargets} from './helpers';

/**
 * Five offers previously shared one URL behind client-side tabs, so nothing
 * could rank per offer. Each now gets its own prerendered document.
 */
const SERVICES = [
  {slug: 'doc-reconciliation', heading: 'Document Intelligence & Reconciliation'},
  {slug: 'ai-security', heading: 'AI Security, Testing & Compliance'},
  {slug: 'voice-ai', heading: 'Voice AI & Conversational Systems'},
  {slug: 'sales-automation', heading: 'AI Sales & Marketing Automation'},
  {slug: 'product-research', heading: 'AI Product Research & Rapid Prototyping'},
] as const;

test.describe('service routes', () => {
  for (const {slug, heading} of SERVICES) {
    test(`/services/${slug}/ is a real document with its own metadata`, async ({browser}) => {
      // Crawler's view: no JavaScript at all.
      const context = await browser.newContext({javaScriptEnabled: false});
      const page = await context.newPage();
      const response = await page.goto(`/services/${slug}/`);
      expect(response?.status()).toBe(200);

      await expect(page.locator('h1')).toHaveText(heading);

      const title = await page.title();
      expect(title).toContain(heading);
      expect(title).toContain('VipraTech Labs');

      // Each page must point at itself, or they compete as duplicates.
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://vipratech.in/services/${slug}/`,
      );
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description).toBeTruthy();
      expect(description).not.toContain('AI for decisions you have to defend');

      await context.close();
    });
  }

  test('each service page carries Service and BreadcrumbList structured data', async ({page}) => {
    await page.goto('/services/ai-security/');
    const graph = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    )['@graph'] as Record<string, unknown>[];

    const breadcrumb = graph.find((n) => n['@type'] === 'BreadcrumbList');
    expect(breadcrumb).toBeTruthy();
    expect((breadcrumb!.itemListElement as unknown[]).length).toBe(2);

    const service = graph.find(
      (n) => n['@type'] === 'Service' && String(n.url).includes('ai-security'),
    );
    expect(service).toBeTruthy();
    expect(service!.url).toBe('https://vipratech.in/services/ai-security/');

    // The FAQ lives on the home page only; claiming it on every page would be
    // duplicate structured data.
    expect(graph.find((n) => n['@type'] === 'FAQPage')).toBeUndefined();
  });

  test('titles and descriptions are unique across every route', async ({page}) => {
    const seen: {title: string; description: string}[] = [];
    for (const path of ['/', ...SERVICES.map((s) => `/services/${s.slug}/`)]) {
      await page.goto(path);
      seen.push({
        title: await page.title(),
        description:
          (await page.locator('meta[name="description"]').getAttribute('content')) ?? '',
      });
    }
    expect(new Set(seen.map((s) => s.title)).size).toBe(seen.length);
    expect(new Set(seen.map((s) => s.description)).size).toBe(seen.length);
  });

  test('the home page links out to every service page', async ({page}) => {
    await page.goto('/');
    for (const {slug} of SERVICES) {
      // Panels are in the DOM for all tabs, so the links are crawlable.
      await expect(page.locator(`a[href="/services/${slug}/"]`)).toHaveCount(1);
    }
  });

  test('a service page navigates back home and on to siblings', async ({page}) => {
    await page.goto('/services/voice-ai/');
    await expect(page.locator('a[href="/services/ai-security/"]')).toHaveCount(1);

    await page.getByRole('link', {name: /all practices/i}).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h1')).toHaveText('AI for decisions you have to defend.');
  });

  test('hydrates and opens the diagnostic prefilled with that service', async ({page}) => {
    const problems: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') problems.push(m.text());
    });
    page.on('pageerror', (e) => problems.push(e.message));

    await page.goto('/services/voice-ai/', {waitUntil: 'networkidle'});
    await page.getByRole('button', {name: /^run the fit diagnostic$/i}).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('combobox').first()).toContainText(/voice ai/i);

    await dialog.getByRole('button', {name: /audit trail/i}).click();
    await dialog.getByRole('button', {name: /see my result/i}).click();
    await expect(dialog.getByRole('heading', {name: 'Voice AI Feasibility Sprint'})).toBeVisible();

    expect(problems).toEqual([]);
  });

  test('meets the same accessibility bar as the home page', async ({page}) => {
    await page.goto('/services/doc-reconciliation/');

    expect((await interactiveAxNodes(page)).filter((n) => !n.name)).toEqual([]);
    expect(await contrastFailures(page)).toEqual([]);
    expect(await undersizedTapTargets(page)).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);

    const levels = await page
      .locator('h1,h2,h3,h4')
      .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('sitemap lists every route and nothing else', async ({request}) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    // Order mirrors ROUTES: home, then the platform arm, then the practices.
    // Order mirrors ROUTES: home, platform, the five persona gates, then the
    // five practices.
    expect(locs).toEqual([
      'https://vipratech.in/',
      'https://vipratech.in/platform/',
      'https://vipratech.in/engage/',
      'https://vipratech.in/products/',
      ...['consumer-brands', 'finance-operations', 'risk-assurance', 'customer-operations', 'engineering']
        .map((slug) => `https://vipratech.in/for/${slug}/`),
      ...['consumer-brands', 'financial-operations', 'customer-contact', 'ai-product-teams', 'ai-risk']
        .map((slug) => `https://vipratech.in/sectors/${slug}/`),
      ...SERVICES.map((s) => `https://vipratech.in/services/${s.slug}/`),
    ]);
  });

  test('unknown paths get a branded 404 that links home', async ({request}) => {
    const res = await request.get('/404.html');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('That page does not exist.');
    expect(body).toContain('href="/"');
  });

  test('the 404 stays a 404 and does not boot the app', async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/404.html', {waitUntil: 'networkidle'});
    await page.waitForTimeout(500);

    // The bundle used to load here, find no route for "/404.html", fall back to
    // the home route and render the home page over the 404.
    await expect(page.locator('h1')).toHaveText('That page does not exist.');
    await expect(page.locator('script[type="module"]')).toHaveCount(0);
    expect(errors).toEqual([]);

    await page.getByRole('link', {name: /back to the home page/i}).click();
    await expect(page.locator('h1')).toHaveText('AI for decisions you have to defend.');
  });
});

test.describe('platform route (Class S — spec S6.1-R)', () => {
  /**
   * The showcase tier's first route. Class S *permits* WebGL, a second
   * continuous layer and a 30 kB route budget; this asserts the page takes
   * almost none of it. The permission was bought by making Trust-class pages
   * stricter, so an unused allowance is the point rather than an oversight —
   * and a later change that quietly cashes it in should fail here.
   */
  test('spends almost none of the Class S allowance', async ({page}) => {
    await page.goto('/platform/');
    await page.waitForSelector('h1');

    // Class S permits canvas/WebGL. This page uses none: glass needs something
    // behind it, and there is no 3D scene here to put behind it.
    expect(await page.locator('canvas').count()).toBe(0);

    const loops = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite';
        })
        .map((el) => {
          const timing = el.getAnimations()[0]?.effect?.getTiming?.() ?? {};
          return {
            dur: timing.duration,
            ease: timing.easing,
            delay: getComputedStyle(el).animationDelay,
          };
        }));

    // One diegetic schematic: four stages, 12s linear, staggered a stage apart.
    expect(loops).toHaveLength(4);
    expect([...new Set(loops.map((l) => l.dur))]).toEqual([12000]);
    expect([...new Set(loops.map((l) => l.ease))]).toEqual(['linear']);
    expect(new Set(loops.map((l) => l.delay)).size).toBe(4);
  });

  test('meets the same accessibility bar as every other route', async ({page}) => {
    await page.goto('/platform/');
    const nodes = await interactiveAxNodes(page);
    expect(nodes.filter((n) => !n.name)).toEqual([]);
    expect(await contrastFailures(page)).toEqual([]);
    expect(await undersizedTapTargets(page)).toEqual([]);
  });

  test('the platform copy is in the prerendered HTML, not injected', async ({request}) => {
    const html = await (await request.get('/platform/')).text();

    // Tags are stripped before matching because SplitText renders the headline
    // one <span> per character, so the h1 is NOT a contiguous substring of the
    // HTML — only of its textContent. A naive `html.includes(headline)` fails
    // here while the page is perfectly well prerendered.
    //
    // Worth knowing: docs/05 S1.1 documents its own check as
    // `grep -c "AI for decisions you have to defend" dist/index.html >= 1`.
    // That still returns 3 — but it is matching <title> and the OG/meta tags,
    // not the h1 it was written to protect. The check passes for a reason that
    // is no longer the reason, which is worth fixing there separately.
    const text = html.replace(/<[^>]+>/g, '');
    expect(text).toContain('The factory we build your software in.');
    // The honesty section is the point of the page; assert it survives.
    expect(text).toContain('does not help');
  });
});

test.describe('404 (spec S9.6)', () => {
  /**
   * The 404 is static HTML with one link. Two regressions were found by the
   * per-route JS report and are pinned here:
   *
   *  - it carried <link rel="modulepreload"> for the React chunk, fetching
   *    ~61 kB gzip on a page that executes nothing
   *  - its accent was hardcoded #9ae600 (lime-400) and was left behind when the
   *    brand moved to #d6fb41, making it the one page still wearing the old
   *    colour. It now reads the token out of the compiled stylesheet.
   */
  test('ships no JavaScript and preloads nothing', async ({request}) => {
    const html = await (await request.get('/404.html')).text();
    expect(html).not.toContain('modulepreload');
    expect(html).not.toMatch(/<script[^>]*type="module"/);
  });

  test('wears the current brand, not the one it was written with', async ({page}) => {
    // Loaded as a file here. The 404 *status* is GitHub Pages behaviour and is
    // covered by 'the 404 stays a 404' above; this test is about its colour.
    await page.goto('/404.html');
    const link = page.getByRole('link', {name: /back to the home page/i});
    const bg = await link.evaluate((el) => getComputedStyle(el).backgroundColor);
    const brand = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim());

    const toRgb = async (value: string) =>
      page.evaluate((v) => {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
      }, value);

    expect(await toRgb(bg)).toEqual(await toRgb(brand));
  });
});

test.describe('cross-document view transitions (spec S6.7)', () => {
  /**
   * S6.7 has been in the stylesheet since Wave 2 with no test behind it, which
   * mattered once the site grew from 6 documents to 7: nothing would have
   * noticed if a new route broke navigation continuity.
   *
   * Both halves are asserted. A cross-document transition needs the OUTGOING
   * document to start one (`pageswap` carries a viewTransition) and the
   * INCOMING document to continue it (`pagereveal` carries one too). Checking
   * only the outgoing half would pass while the user still saw a hard cut.
   *
   * The navigation must be a real click. Driving it with `location.href` from
   * an evaluate() reports `pagereveal` without a transition even when the
   * feature is working correctly — that false negative cost an iteration.
   */
  test('a real navigation runs a transition on both documents', async ({browser}) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      addEventListener('pageswap', (e) =>
        sessionStorage.setItem('vt-swap', String(!!(e as PageSwapEvent).viewTransition)));
      addEventListener('pagereveal', (e) =>
        sessionStorage.setItem('vt-reveal', String(!!(e as PageRevealEvent).viewTransition)));
    });
    const page = await context.newPage();

    await page.goto('/');
    const link = page.locator('a[href^="/services/"]').first();
    const href = await link.getAttribute('href');
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForURL(`**${href}`);

    const state = await page.evaluate(() => ({
      swap: sessionStorage.getItem('vt-swap'),
      reveal: sessionStorage.getItem('vt-reveal'),
    }));
    // The outgoing half holds everywhere, headless included.
    expect(state.swap, 'outgoing document must start a view transition').toBe('true');

    // The incoming half needs a real compositor. Headless Chromium starts the
    // transition on the outgoing document and then declines to continue it on
    // the incoming one, so `pagereveal` arrives without a viewTransition even
    // though the feature is configured correctly and works in a headed browser
    // — verified by running exactly this test with --headed.
    //
    // Asserting it unconditionally would leave a permanently red test that
    // says nothing about the site, which is worse than an honest skip. This is
    // the same class of limit as headless falling back to SwiftShader for
    // WebGL and backdrop-filter (design-recon toolchain-selection).
    // Playwright spoofs a normal user-agent in headless, so the UA string
    // cannot be used to detect it. The resolved project config can: `--headed`
    // sets `headless: false`, and it is otherwise undefined or true.
    const headless = test.info().project.use.headless !== false;
    if (headless) {
      test.info().annotations.push({
        type: 'environment',
        description: 'incoming-document assertion skipped: headless has no compositor for cross-document view transitions. Run with --headed to check it.',
      });
    } else {
      expect(state.reveal, 'incoming document must continue it').toBe('true');
    }
    await context.close();
  });

  test('the header keeps its identity across every route', async ({page}) => {
    // A named element is what lets the header hold still while content changes,
    // rather than cross-fading with the rest of the page. Measured pattern:
    // raycast.com names its layout container the same way
    // (design-recon blueprints/raycast-com).
    for (const path of ['/', '/platform/', '/services/voice-ai/']) {
      await page.goto(path);
      const name = await page
        .locator('header')
        .evaluate((el) => getComputedStyle(el).viewTransitionName);
      expect(name, `header on ${path}`).toBe('site-header');
    }
  });

  test('reduced motion switches the transitions off', async ({page, request}) => {
    // Asserted against the shipped stylesheet rather than the CSSOM. The
    // minifier splits `::view-transition-group(*), ::view-transition-old(*),
    // ::view-transition-new(*)` into three separate rules inside the media
    // query, so no single rule's cssText contains both the query and the
    // selector — a CSSOM assertion fails while the CSS is perfectly correct.
    await page.goto('/');
    const href = await page
      .locator('link[rel="stylesheet"]')
      .first()
      .getAttribute('href');
    const css = await (await request.get(href!)).text();

    const block = /@media[^{]*prefers-reduced-motion[^{]*\{([\s\S]*)/.exec(css);
    expect(block, 'a prefers-reduced-motion block must exist').not.toBeNull();
    for (const pseudo of ['group', 'old', 'new']) {
      expect(
        block![1],
        `::view-transition-${pseudo} must be switched off under reduced motion`,
      ).toContain(`::view-transition-${pseudo}(*){animation:none!important}`);
    }
  });
});
