import { test, expect } from '@playwright/test';

test.describe('experiment day read path', () => {
  test('renders the unavailable state when no experiment day exists', async ({ page }) => {
    await page.goto('/?day=1');

    await expect(
      page.getByRole('heading', { name: 'Experiment day unavailable' }),
    ).toBeVisible();

    await expect(
      page.getByText('No experiment day available'),
    ).toBeVisible();

    await expect(
      page.getByText(
        'No experiment day found for experiment 108-day-experiment on day 1',
      ),
    ).toBeVisible();
  });

  test('renders Day 46 using the 13/13 scoring definition', async ({ page }) => {
    await page.goto('/?day=46');

    await expect(
      page.getByRole('heading', { name: 'Day 46' }),
    ).toBeVisible();

    await expect(page.getByText('13 / 13 completed')).toBeVisible();
    await expect(page.getByText('Successful day')).toBeVisible();
    await expect(page.getByText('Scoring definition: v1')).toBeVisible();

    await expect(
      page.getByRole('heading', { name: '3-6-9 Goal Practice' }),
    ).toBeVisible();

    await expect(
      page.getByText('Protocol condition 13: Completed'),
    ).toBeVisible();
  });

  test('renders Day 47 using the 8/13 scoring definition', async ({ page }) => {
    await page.goto('/?day=47');

    await expect(
      page.getByRole('heading', { name: 'Day 47' }),
    ).toBeVisible();

    await expect(page.getByText('8 / 13 completed')).toBeVisible();
    await expect(page.getByText('Successful day')).toBeVisible();
    await expect(page.getByText('Scoring definition: v3')).toBeVisible();

    await expect(
      page.getByText('Protocol condition 8: Completed'),
    ).toBeVisible();

    await expect(
      page.getByText('Protocol condition 13: Not completed'),
    ).toBeVisible();
  });
});
