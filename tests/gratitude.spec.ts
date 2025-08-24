import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Clear local storage before each test to ensure a clean state
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
});

test.describe('Gratitude Challenge App', () => {
  test('should display the main page correctly', async ({ page }) => {
    // Check for the header
    await expect(page.getByRole('heading', { name: 'Gratitude Challenge' })).toBeVisible();

    // Check for the initial state of the cards
    await expect(page.getByText('Day 1: Daily Gratitude')).toBeVisible();
    await expect(page.getByText('Current Streak')).toBeVisible();
    await expect(page.getByText('0 Days')).toBeVisible();
    await expect(page.getByText('Total Points')).toBeVisible();
    await expect(page.getByText('0').nth(1)).toBeVisible(); // The second '0' for points
  });

  test('should allow submitting a gratitude entry', async ({ page }) => {
    const entryText = 'I am grateful for a beautiful sunny day.';
    await page.getByPlaceholder('What are you grateful for today?').fill(entryText);
    await page.getByRole('button', { name: 'Save My Gratitude' }).click();

    // Check for the success message
    await expect(page.getByText('Thank you for your entry!')).toBeVisible();
    await expect(page.getByText("You've completed your gratitude for today.")).toBeVisible();

    // Check that stats are updated
    await expect(page.getByText('1 Days')).toBeVisible();
    await expect(page.getByText('10')).toBeVisible(); // 10 points for first entry

    // The page should now show Day 2 prompt area is locked
    await expect(page.getByText('Day 2: Daily Gratitude')).toBeVisible();

     // Reload the page and check for persistence
     await page.reload();
     await expect(page.getByText('Thank you for your entry!')).toBeVisible();
     await expect(page.getByText('1 Days')).toBeVisible();
     await expect(page.getByText('10')).toBeVisible();
  });

  test('should not allow submitting another entry on the same day', async ({ page }) => {
    const entryText = 'I am grateful for my morning coffee.';
    await page.getByPlaceholder('What are you grateful for today?').fill(entryText);
    await page.getByRole('button', { name: 'Save My Gratitude' }).click();

    // First entry is submitted
    await expect(page.getByText('Thank you for your entry!')).toBeVisible();

    // Try to submit another one - this test assumes that after submission,
    // we cannot programmatically submit again. If the button were enabled,
    // we would check for a toast.
    await expect(page.getByRole('button', { name: 'Save My Gratitude' })).not.toBeVisible();
  });

  test('should show an error for entries that are too short', async ({ page }) => {
    await page.getByPlaceholder('What are you grateful for today?').fill('Too short');
    await page.getByRole('button', { name: 'Save My Gratitude' }).click();

    // Check for the validation message
    await expect(page.getByText('Your entry must be at least 10 characters.')).toBeVisible();

    // Check that stats are NOT updated
    await expect(page.getByText('0 Days')).toBeVisible();
    await expect(page.getByText('0').nth(1)).toBeVisible();
  });
});
