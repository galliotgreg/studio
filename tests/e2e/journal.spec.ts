
import { test, expect } from '@playwright/test';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

const setupInitialState = async (page) => {
  // We need to set a fixed date for the browser to make the tests deterministic.
  const today = new Date('2024-07-22T12:00:00.000Z');
  const yesterday = new Date('2024-07-21T12:00:00.000Z');
  const dayBefore = new Date('2024-07-20T12:00:00.000Z');

  const gratitudeState = {
    entries: [
      { day: 1, date: dayBefore.toISOString(), text: 'Entry for the 20th', prompt: 'Prompt 1' },
      { day: 2, date: yesterday.toISOString(), text: 'Entry for the 21st', prompt: 'Prompt 2' },
    ],
    currentDay: 3,
    streak: 2,
    unlockedBadges: ['entry-1'],
    lastEntryDate: yesterday.toISOString(),
  };

  // Mock Date.now() in the browser
  await page.addInitScript(`
    {
      const d = new Date('${today.toISOString()}');
      Date = class extends Date {
        constructor(val) {
          if (val) {
            super(val);
          } else {
            super(d);
          }
        }
      };
    }
  `);

  await page.evaluate(
    (state) => localStorage.setItem('gratitudeChallengeData', JSON.stringify(state)),
    gratitudeState
  );
  // Reload to apply the init script and local storage
  await page.goto('/');
};

test.describe('Journal Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupInitialState(page);
    await page.getByRole('link', { name: 'Voir le journal' }).click();
    await expect(page).toHaveURL('/journal');
  });

  test('should display entries in a timeline view', async ({ page }) => {
    // Check for the timeline container
    const timeline = page.getByTestId('timeline');
    await expect(timeline).toBeVisible();
    await expect(timeline).toHaveClass(/border-l-2/);

    // Check for timeline items (day markers)
    // We sort entries by day descending in the component, so Day 2 should be first.
    const day2Marker = timeline.getByText('2', { exact: true });
    const day1Marker = timeline.getByText('1', { exact: true });

    await expect(day2Marker).toBeVisible();
    await expect(day1Marker).toBeVisible();

    // Check that the entry content is also present
    await expect(page.getByText('Entry for the 21st')).toBeVisible();
    await expect(page.getByText('Entry for the 20th')).toBeVisible();
  });


  test('should filter by date and reset filter correctly', async ({ page }) => {
    // Check that both entries are initially visible
    await expect(page.getByText('Entry for the 20th')).toBeVisible();
    await expect(page.getByText('Entry for the 21st')).toBeVisible();

    // The calendar should be visible
    await expect(page.getByRole('grid')).toBeVisible(); 

    // Click on a specific date in the calendar to filter
    const dateToClick = new Date('2024-07-20T12:00:00.000Z');
    const day = format(dateToClick, 'd'); // '20'
    
    // The calendar is rendered in French by default
    const formattedDate = format(dateToClick, 'PPP', { locale: fr });
    const expectedTitle = `Jour 1 - ${formattedDate}`;

    await page.getByRole('gridcell', { name: day }).locator('div').first().click();

    // Verify that only the correct entry is visible
    await expect(page.getByText('Entry for the 20th')).toBeVisible();
    await expect(page.getByText(expectedTitle)).toBeVisible();
    await expect(page.getByText('Entry for the 21st')).not.toBeVisible();

    // Check that the "View All" button is now visible and click it
    const viewAllButton = page.getByRole('button', { name: 'Voir toutes les entrées' });
    await expect(viewAllButton).toBeVisible();
    await viewAllButton.click();

    // Verify that both entries are visible again
    await expect(page.getByText('Entry for the 20th')).toBeVisible();
    await expect(page.getByText('Entry for the 21st')).toBeVisible();
    await expect(viewAllButton).not.toBeVisible();
  });
});
