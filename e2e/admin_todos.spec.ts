import { test, expect } from '@playwright/test';

test.describe('Admin Todos', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the database
    await page.request.post('/api/auth/seed');
    await page.goto('/login');
    
    // Login as Admin
    await page.fill('input[name="email"]', 'admin@todo.dev');
    await page.fill('input[name="password"]', 'ChangeMe123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
    await page.goto('/todos');
  });

  test('should display admin todos', async ({ page }) => {
    // Check for Admin Todos
    await expect(page.locator('text=Admin Task 1')).toBeVisible();
    await expect(page.locator('text=Admin Task 2')).toBeVisible();
  });
});
