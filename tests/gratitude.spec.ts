
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Clear local storage before each test to ensure a clean state
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');
});

test.describe('Gratitude Challenge App', () => {
  test('should display the main page correctly', async ({ page }) => {
    // Check for the header
    await expect(page.getByRole('heading', { name: 'Défi de la Gratitude' })).toBeVisible();

    // Check for the initial state of the cards
    await expect(page.getByText('Jour 1 : Gratitude Quotidienne')).toBeVisible();
    await expect(page.getByText('Série actuelle')).toBeVisible();
    await expect(page.getByText('0 Jours')).toBeVisible();
    await expect(page.getByText('Total des points')).toBeVisible();
    await expect(page.getByText('0').nth(1)).toBeVisible(); // The second '0' for points
  });

  test('should allow submitting a gratitude entry', async ({ page }) => {
    const entryText = 'Je suis reconnaissant pour une belle journée ensoleillée.';
    await page.getByPlaceholder('Pour quoi êtes-vous reconnaissant(e) aujourd\'hui ?').fill(entryText);
    await page.getByRole('button', { name: 'Enregistrer ma gratitude' }).click();

    // Check for the success message
    await expect(page.getByText('Merci pour votre contribution !')).toBeVisible();
    await expect(page.getByText("Vous avez terminé votre gratitude pour aujourd'hui. À demain !")).toBeVisible();

    // Check that stats are updated
    await expect(page.getByText('1 Jours')).toBeVisible();
    await expect(page.getByText('10')).toBeVisible(); // 10 points for first entry

    // The page should now show Day 2 prompt area is locked
    await expect(page.getByText('Jour 2 : Gratitude Quotidienne')).toBeVisible();

     // Reload the page and check for persistence
     await page.reload();
     await expect(page.getByText('Merci pour votre contribution !')).toBeVisible();
     await expect(page.getByText('1 Jours')).toBeVisible();
     await expect(page.getByText('10')).toBeVisible();
  });

  test('should not allow submitting another entry on the same day', async ({ page }) => {
    const entryText = 'Je suis reconnaissant pour mon café du matin.';
    await page.getByPlaceholder('Pour quoi êtes-vous reconnaissant(e) aujourd\'hui ?').fill(entryText);
    await page.getByRole('button', { name: 'Enregistrer ma gratitude' }).click();

    // First entry is submitted
    await expect(page.getByText('Merci pour votre contribution !')).toBeVisible();

    // Try to submit another one - this test assumes that after submission,
    // we cannot programmatically submit again. If the button were enabled,
    // we would check for a toast.
    await expect(page.getByRole('button', { name: 'Enregistrer ma gratitude' })).not.toBeVisible();
  });

  test('should show an error for entries that are too short', async ({ page }) => {
    await page.getByPlaceholder('Pour quoi êtes-vous reconnaissant(e) aujourd\'hui ?').fill('Trop court');
    await page.getByRole('button', { name: 'Enregistrer ma gratitude' }).click();

    // Check for the validation message
    await expect(page.getByText('Votre entrée doit contenir au moins 10 caractères.')).toBeVisible();

    // Check that stats are NOT updated
    await expect(page.getByText('0 Jours')).toBeVisible();
    await expect(page.getByText('0').nth(1)).toBeVisible();
  });
});
