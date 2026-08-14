import {expect, test} from '@playwright/test';
import {BASE_URL} from '../playwright.config';

/**
 * The site's primary SEO fix: `dist/index.html` used to ship an empty root div,
 * so any crawler that does not execute JavaScript saw nothing at all.
 */
test.describe('prerendered HTML (spec S1.1, S9.6)', () => {
  test('ships real content to a client with JavaScript disabled', async ({browser}) => {
    // The strongest possible statement of the requirement: no JS, no hydration.
    const context = await browser.newContext({javaScriptEnabled: false});
    const page = await context.newPage();
    await page.goto(BASE_URL);

    // Hero, present and complete — it used to be typed in on the client and so
    // was absent from the markup entirely.
    await expect(page.locator('h1')).toHaveText('AI for decisions you have to defend.');

    // Every section heading, including the two that vanished when the
    // interactive tools were briefly lazy-loaded (amendment 2026-08-14/3).
    for (const heading of [
      'Start with a conversation, not a contract.',
      'A model is not a system.',
      'Five practices, one method.',
      'What we have already built.',
      'Where each decision actually goes.',
      'How much time is this costing you now?',
      'Designed for the people who have to sign off.',
      'Frequently asked.',
    ]) {
      await expect(page.getByRole('heading', {name: heading})).toBeVisible();
    }

    await context.close();
  });

  test('exposes valid JSON-LD for Organization, Services and the FAQ', async ({page}) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    expect(raw).toBeTruthy();

    const graph = JSON.parse(raw!)['@graph'] as Record<string, unknown>[];
    const types = graph.map((n) => n['@type']);

    expect(types.filter((t) => t === 'Organization')).toHaveLength(1);
    expect(types.filter((t) => t === 'Service')).toHaveLength(5);
    expect(types.filter((t) => t === 'FAQPage')).toHaveLength(1);

    const org = graph.find((n) => n['@type'] === 'Organization')!;
    const services = graph.filter((n) => n['@type'] === 'Service');
    // Every Service must point at the Organization node that actually exists.
    for (const service of services) {
      expect((service.provider as {'@id': string})['@id']).toBe(org['@id']);
      expect(service.description).toBeTruthy();
    }

    const faq = graph.find((n) => n['@type'] === 'FAQPage')!;
    expect((faq.mainEntity as unknown[]).length).toBeGreaterThanOrEqual(6);
  });

  test('declares the social card metadata link previews need', async ({page}) => {
    await page.goto('/');
    const meta = async (selector: string) =>
      page.locator(selector).first().getAttribute('content');

    expect(await meta('meta[property="og:title"]')).toContain('VipraTech');
    expect(await meta('meta[property="og:image"]')).toMatch(/\.png$/);
    // Dimensions let scrapers render the card without fetching the image first.
    expect(await meta('meta[property="og:image:width"]')).toBe('1200');
    expect(await meta('meta[property="og:image:height"]')).toBe('630');
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBeTruthy();
  });

  test('serves the OG image, robots.txt and sitemap.xml', async ({request}) => {
    for (const [path, type] of [
      ['/og.png', 'image/png'],
      ['/robots.txt', 'text/plain'],
      ['/sitemap.xml', 'xml'],
    ]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
      expect(res.headers()['content-type'], path).toContain(type);
    }
  });

  test('hydrates without console errors or mismatch warnings', async ({page}) => {
    const problems: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text()}`);
    });
    page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));

    await page.goto('/', {waitUntil: 'networkidle'});
    // Exercise a hydrated control to prove React took over the prerendered DOM.
    await page.getByRole('tab', {name: /voice ai/i}).click();
    await expect(page.getByRole('tabpanel')).toContainText('Voice AI Feasibility Sprint');

    expect(problems).toEqual([]);
  });
});
