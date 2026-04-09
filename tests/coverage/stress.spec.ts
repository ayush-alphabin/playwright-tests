import { test, expect } from '@testdino/playwright';

/**
 * Stress test for coverage compression.
 * Prerequisites: run `bash scripts/generate-modules.sh` and add the stress route to main.ts.
 * This test exercises 600 generated modules, producing a coverage payload >1MB
 * that triggers the gzip compression path in the TestDino reporter.
 */
test.describe('Coverage Compression Stress Test', () => {
  test('should exercise all generated modules and produce large coverage', async ({ page }) => {
    await page.goto('/#/stress');
    await expect(page.getByTestId('stress-heading')).toBeVisible();

    const countText = await page.getByTestId('stress-count').textContent();
    expect(countText).toContain('800 modules exercised');
  });
});
