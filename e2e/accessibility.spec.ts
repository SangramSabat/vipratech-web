import {expect, test} from '@playwright/test';
import {contrastFailures, interactiveAxNodes, openDiagnostic, undersizedTapTargets} from './helpers';

test.describe('accessible names (spec S7.9, WCAG 4.1.2)', () => {
  /**
   * Regression test for a real defect: `aria-label` was set on the Radix Slider
   * Root, but `role="slider"` is on the Thumb, so all five sliders reached the
   * accessibility tree unnamed. A DOM-based check missed it by walking up to an
   * ancestor label. Assert against the AX tree so it cannot come back.
   */
  test('every interactive control on the landing page is named', async ({page}) => {
    await page.goto('/');
    const nodes = await interactiveAxNodes(page);

    expect(nodes.length).toBeGreaterThan(30);
    expect(nodes.filter((n) => !n.name)).toEqual([]);
  });

  test('all five sliders are named, not just present', async ({page}) => {
    await page.goto('/');
    const sliders = (await interactiveAxNodes(page)).filter((n) => n.role === 'slider');

    expect(sliders).toHaveLength(5);
    expect(sliders.map((s) => s.name)).toEqual([
      'How much is genuinely rule-based',
      'How much of the rest the model may settle',
      'Items handled per month',
      'Minutes of manual handling per item',
      'Share you believe could be automated',
    ]);
  });

  test('controls inside the diagnostic are named in both states', async ({page}) => {
    await page.goto('/');
    const dialog = await openDiagnostic(page);

    expect((await interactiveAxNodes(page)).filter((n) => !n.name)).toEqual([]);

    await dialog.getByRole('button', {name: /audit trail/i}).click();
    await dialog.getByRole('button', {name: /see my result/i}).click();
    await expect(dialog.getByText(/structured self-assessment based on what you entered/i)).toBeVisible();

    expect((await interactiveAxNodes(page)).filter((n) => !n.name)).toEqual([]);
  });
});

test.describe('keyboard operation (spec S7.1, S7.2, S7.6)', () => {
  test('the skip link is the first thing reachable by keyboard', async ({page}) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Skip to content');
  });

  test('the dialog traps focus, closes on Escape and restores focus', async ({page}) => {
    await page.goto('/');
    const trigger = page.getByRole('button', {name: /^run the fit diagnostic$/i}).first();
    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Focus must not escape the dialog, however long the user tabs.
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
      expect(inside, `focus left the dialog on tab ${i + 1}`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('the service tabs are real tabs with arrow-key navigation', async ({page}) => {
    await page.goto('/');
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(5);

    await tabs.first().focus();
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('End');
    await expect(tabs.nth(4)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('AI Product Discovery Sprint');
  });

  test('sliders are operable from the keyboard', async ({page}) => {
    await page.goto('/');
    const slider = page.getByRole('slider').first();
    await slider.focus();
    const before = await slider.getAttribute('aria-valuenow');

    await page.keyboard.press('ArrowRight');
    await expect(slider).not.toHaveAttribute('aria-valuenow', before!);
  });
});

test.describe('document structure (spec S2.2, S2.3)', () => {
  test('has one h1, one main, and no skipped heading levels', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);

    // More than one <nav> is allowed, provided each is distinctly labelled.
    const navLabels = await page.locator('nav').evaluateAll((els) =>
      els.map((e) => e.getAttribute('aria-label')),
    );
    expect(navLabels.every(Boolean)).toBe(true);
    expect(new Set(navLabels).size).toBe(navLabels.length);

    const levels = await page.locator('h1,h2,h3,h4').evaluateAll((els) =>
      els.map((e) => Number(e.tagName[1])),
    );
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `heading jumped at index ${i}`).toBeLessThanOrEqual(1);
    }
  });

  test('each section is a labelled region', async ({page}) => {
    await page.goto('/');
    const unlabelled = await page.locator('main section').evaluateAll((els) =>
      els.filter((e) => !e.getAttribute('aria-labelledby')).map((e) => e.id || '(no id)'),
    );
    expect(unlabelled).toEqual([]);
  });
});

test.describe('contrast and target size (spec S5.5, S7.4, S4.2)', () => {
  test('every rendered text node meets WCAG AA', async ({page}) => {
    await page.goto('/');
    expect(await contrastFailures(page)).toEqual([]);
  });

  test('no interactive target is under 44px tall', async ({page}) => {
    await page.goto('/');
    expect(await undersizedTapTargets(page)).toEqual([]);
  });

  test('no text renders below 12px, and prose no smaller than 14px', async ({page}) => {
    await page.goto('/');
    const smallest = await page.evaluate(() => {
      const sizes = new Set<number>();
      for (const el of document.querySelectorAll('*')) {
        if (!el.textContent?.trim() || el.children.length) continue;
        if (!el.getBoundingClientRect().height) continue;
        sizes.add(parseFloat(getComputedStyle(el).fontSize));
      }
      return Math.min(...sizes);
    });
    expect(smallest).toBeGreaterThanOrEqual(12);
  });
});
