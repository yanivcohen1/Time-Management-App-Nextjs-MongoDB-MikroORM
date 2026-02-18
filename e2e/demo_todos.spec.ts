import { test, expect } from '@playwright/test';

test.describe('Demo Todos', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the database
    await page.request.post('/api/auth/seed');
    await page.goto('/login');
    
    // Login
    await page.fill('input[name="email"]', 'user@todo.dev');
    await page.fill('input[name="password"]', 'ChangeMe123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    await page.goto('/todos');
  });

  test('should display demo todos with correct statuses', async ({ page }) => {
    // Check for Demo Todos
    await expect(page.locator('text=Demo Backlog')).toBeVisible();
    await expect(page.locator('text=Demo Pending')).toBeVisible();
    await expect(page.locator('text=Demo In Progress')).toBeVisible();
    await expect(page.locator('text=Demo Completed')).toBeVisible();
  });
});
