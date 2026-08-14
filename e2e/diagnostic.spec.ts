import {expect, test} from '@playwright/test';
import {openDiagnostic} from './helpers';

/**
 * The diagnostic is the site's conversion terminus and its biggest integrity
 * risk. It previously returned a hardcoded 92 / "Strong Fit" with identical
 * risks and reasoning to every visitor, on a site whose stated policy is
 * evidence before claims. These tests exercise the shipped UI, not just the
 * scoring function (which fitDiagnostic.test.ts covers).
 */
test.describe('diagnostic integrity (spec S10.1–S10.4)', () => {
  test('cannot be submitted until the visitor actually chooses something', async ({page}) => {
    await page.goto('/');
    const dialog = await openDiagnostic(page);

    // Nothing is pre-filled: pre-selected answers produced lead data the
    // visitor never chose.
    await expect(dialog.getByRole('button', {name: /see my result/i})).toBeDisabled();
    await expect(dialog.getByRole('textbox')).toHaveValue('');
    await expect(dialog.getByRole('button', {pressed: true})).toHaveCount(0);

    await dialog.getByRole('button', {name: /audit trail/i}).click();
    await expect(dialog.getByRole('button', {name: /see my result/i})).toBeEnabled();
  });

  test('presents the result as a self-assessment, not a finding', async ({page}) => {
    await page.goto('/');
    const dialog = await openDiagnostic(page);
    await dialog.getByRole('button', {name: /audit trail/i}).click();
    await dialog.getByRole('button', {name: /see my result/i}).click();

    await expect(
      dialog.getByText(/structured self-assessment based on what you entered — not a verified finding/i),
    ).toBeVisible();
  });

  test('different answers produce a different score and different risks', async ({page}) => {
    const run = async (challenges: RegExp[], timeline?: string) => {
      await page.goto('/');
      const dialog = await openDiagnostic(page);
      for (const c of challenges) await dialog.getByRole('button', {name: c}).click();
      if (timeline) {
        await dialog.getByRole('combobox').nth(1).click();
        await page.getByRole('option', {name: timeline}).click();
      }
      await dialog.getByRole('button', {name: /see my result/i}).click();
      const score = await dialog.locator('.tabular-nums').first().textContent();
      const risks = await dialog.getByRole('listitem').allTextContents();
      return {score: Number(score?.trim()), risks: risks.join(' ')};
    };

    const strong = await run([/audit trail/i, /manual review overhead/i, /unstructured pdfs/i]);
    const weak = await run([/difficulty scaling/i], 'Urgent (1-2 Weeks)');

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.risks).not.toBe(weak.risks);
  });

  test('is willing to say the fit is weak and name the cheaper answer', async ({page}) => {
    await page.goto('/');
    const dialog = await openDiagnostic(page);
    await dialog.getByRole('button', {name: /difficulty scaling/i}).click();

    await dialog.getByRole('combobox').nth(1).click();
    await page.getByRole('option', {name: 'Urgent (1-2 Weeks)'}).click();
    await dialog.getByRole('combobox').nth(2).click();
    await page.getByRole('option', {name: '1-10 People'}).click();

    await dialog.getByRole('button', {name: /see my result/i}).click();

    await expect(dialog.getByText('Probably not yet')).toBeVisible();
    await expect(dialog.getByText(/rule engine will be cheaper/i)).toBeVisible();
  });

  test('the workflow selector drives the recommended sprint', async ({page}) => {
    for (const [option, sprint] of [
      [/voice ai/i, 'Voice AI Feasibility Sprint'],
      [/agent red-teaming/i, 'AI Agent Security Assessment'],
    ] as const) {
      await page.goto('/');
      const dialog = await openDiagnostic(page);
      await dialog.getByRole('combobox').first().click();
      await page.getByRole('option', {name: option}).click();
      await dialog.getByRole('button', {name: /audit trail/i}).click();
      await dialog.getByRole('button', {name: /see my result/i}).click();

      await expect(dialog.getByRole('heading', {name: sprint})).toBeVisible();
    }
  });

  test('offers a fallback for when the mail client does not open', async ({page}) => {
    await page.goto('/');
    const dialog = await openDiagnostic(page);
    await dialog.getByRole('button', {name: /audit trail/i}).click();
    await dialog.getByRole('button', {name: /see my result/i}).click();

    // mailto: fails silently on many mobile and webmail setups.
    await expect(dialog.getByRole('button', {name: /copy summary/i})).toBeVisible();
    await expect(dialog.getByRole('link', {name: 'akhilesh@vipratech.in'})).toBeVisible();

    const mailto = await dialog.getByRole('link', {name: /send this to vipratech/i}).getAttribute('href');
    expect(mailto).toContain('mailto:akhilesh@vipratech.in');
    expect(decodeURIComponent(mailto!)).toContain('Self-assessment result');
  });
});

test.describe('CTA hierarchy (spec S3.2, S3.3)', () => {
  test('every CTA label names the action it performs', async ({page}) => {
    await page.goto('/');

    // The footer button used to promise scheduling and open the modal instead.
    const fitCallLinks = page.getByRole('link', {name: /book a 30-min fit call/i});
    expect(await fitCallLinks.count()).toBeGreaterThan(0);
    for (const link of await fitCallLinks.all()) {
      expect(await link.getAttribute('href')).toContain('mailto:');
    }

    // The primary CTA opens the diagnostic, as its label says.
    await page.getByRole('button', {name: /^run the fit diagnostic$/i}).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('shows at most one primary CTA per section', async ({page}) => {
    await page.goto('/');
    const perSection = await page.evaluate(() => {
      // The primary variant paints an opaque lime fill. Exclude the sr-only
      // skip link and the active tab, which share the fill but are not CTAs.
      const isPrimaryCta = (el: Element) => {
        if (el.closest('.sr-only') || el.getAttribute('role') === 'tab') return false;
        const bg = getComputedStyle(el).backgroundColor;
        return bg === 'oklch(0.841 0.238 128.85)' || bg === 'rgb(154, 230, 0)';
      };
      return [...document.querySelectorAll('main section')].map((section) => ({
        id: section.id,
        count: [...section.querySelectorAll('button,a')].filter(isPrimaryCta).length,
      }));
    });

    const offenders = perSection.filter((s) => s.count > 1);
    expect(offenders, 'sections with competing primary CTAs').toEqual([]);
  });
});
