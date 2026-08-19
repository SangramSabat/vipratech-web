import {expect, test} from '@playwright/test';
import {contrastFailures, interactiveAxNodes, undersizedTapTargets} from './helpers';

const SLUGS = [
  'consumer-brands',
  'finance-operations',
  'risk-assurance',
  'customer-operations',
  'engineering',
];

test.describe('persona gating (docs/07 §5)', () => {
  /**
   * The gate is a route, not a curtain. docs/06 §6 proposed inferring a persona
   * and swapping the home hero client-side; docs/07 §5 rejected that because
   * the hero is the LCP element carrying a per-character reveal, and because a
   * variant that exists only after hydration is one no crawler indexes and no
   * shared link lands on.
   *
   * These tests exist to stop that decision quietly reverting.
   */
  test('/ is never gated — the default page is complete without choosing', async ({page}) => {
    await page.goto('/');
    // No interstitial, no modal, no redirect.
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(page.locator('h1')).toBeVisible();
    // And the gate is visible rather than hidden behind an interaction.
    expect(await page.locator('a[href^="/for/"]').count()).toBe(SLUGS.length);
  });

  test('every persona is a real prerendered document, not a client variant', async ({request}) => {
    for (const slug of SLUGS) {
      const response = await request.get(`/for/${slug}/`);
      expect(response.status(), slug).toBe(200);
      const html = await response.text();
      const text = html.replace(/<[^>]+>/g, '');
      // Real copy in the HTML, before any JavaScript runs.
      expect(text.length, `${slug} prerendered length`).toBeGreaterThan(1500);
      expect(html, `${slug} canonical`).toContain(`/for/${slug}/`);
    }
  });

  test('the hero is never mutated after hydration', async ({page}) => {
    // The failure docs/07 §5 was written to prevent: a post-paint rewrite of
    // the LCP element, which would strand or restart the per-character reveal.
    for (const path of ['/', '/for/consumer-brands/']) {
      await page.goto(path, {waitUntil: 'domcontentloaded'});
      const before = await page.locator('h1').textContent();
      await page.waitForTimeout(1600);
      const after = await page.locator('h1').textContent();
      expect(after, `h1 changed after hydration on ${path}`).toBe(before);
    }
  });

  test('each persona route meets the same accessibility bar', async ({page}) => {
    for (const slug of SLUGS) {
      await page.goto(`/for/${slug}/`);
      const nodes = await interactiveAxNodes(page);
      expect(nodes.filter((n) => !n.name), slug).toEqual([]);
      expect(await contrastFailures(page), slug).toEqual([]);
      expect(await undersizedTapTargets(page), slug).toEqual([]);
    }
  });

  test('the gate needs no JavaScript', async ({browser}) => {
    // Five links to five documents. If this ever needs JS, it has become the
    // client-side swap docs/07 §5 rejected.
    const context = await browser.newContext({javaScriptEnabled: false});
    const page = await context.newPage();
    await page.goto('/');
    const links = page.locator('a[href^="/for/"]');
    expect(await links.count()).toBe(SLUGS.length);
    await links.first().click();
    await page.waitForURL('**/for/consumer-brands/');
    await expect(page.locator('h1')).toContainText('distributor claims');
    await context.close();
  });
});
