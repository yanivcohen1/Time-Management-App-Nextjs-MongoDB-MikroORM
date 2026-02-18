import { test, expect } from '@playwright/test';

test.describe('Responsive Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the database
    await page.request.post('/api/auth/seed');
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@todo.dev');
    await page.fill('input[name="password"]', 'ChangeMe123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    await page.goto('/board');
  });

  test('should display columns in a row on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const container = page.locator('[data-testid="kanban-container"]');
    await expect(container).toHaveCSS('flex-direction', 'row');
  });

  test('should display columns in a column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X size
    const container = page.locator('[data-testid="kanban-container"]');
    await expect(container).toHaveCSS('flex-direction', 'column');
  });
});
