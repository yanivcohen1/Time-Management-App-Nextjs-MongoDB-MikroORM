import { test, expect } from '@playwright/test';

test.describe('Agile Tasks', () => {
  test.beforeEach(async ({ page }) => {
    // Seed the database
    await page.request.post('/api/auth/seed');
    await page.goto('/login');
  });

  test('should login and manage todos', async ({ page }) => {
    // Login
    await page.fill('input[name="email"]', 'user@todo.dev');
    await page.fill('input[name="password"]', 'ChangeMe123!');
    await page.click('button[type="submit"]');

    // Verify Dashboard
    await expect(page).toHaveURL('/');

    await page.goto('/todos');
    await page.reload(); // Ensure fresh state
    await page.keyboard.press('Escape'); // Close any open modals

    // Create Todo
    await page.click('[data-testid="sidebar-create"]');
    await page.fill('input[name="title"]', 'New Playwright Todo');
    await page.fill('textarea[name="description"]', 'Description for Playwright');
    await page.click('button:has-text("Create")');
    await page.reload(); // Reload to get fresh data

    // Sort by newest first
    await page.click('text=Created At');

    // Verify Todo Created
    const todoRow = page.locator('text=New Playwright Todo');
    await expect(todoRow).toBeVisible();

    // Edit Todo (Click on the edit button in the row)
    // In Cypress: cy.contains('New Cypress Todo').parent().next().find('button').first().click();
    // We can use a more robust locator if possible, or follow the same logic.
    const editButton = page.locator('tr:has-text("New Playwright Todo") >> button').first();
    await editButton.click();
    
    // Verify Description in Modal
    await expect(page.locator('textarea[name="description"]')).toHaveValue('Description for Playwright');

    await page.fill('input[name="title"]', 'Updated Playwright Todo');
    await page.click('button:has-text("Update")');

    // Verify Update
    await expect(page.locator('text=Updated Playwright Todo')).toBeVisible();
  });

  test('should handle GET /api/todos?limit=1000 without error', async ({ page, request }) => {
    // Login first to get authenticated
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@todo.dev');
    await page.fill('input[name="password"]', 'ChangeMe123!');
    await page.click('button[type="submit"]');

    // Verify login success before calling API
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Agile menu')).toBeVisible();

    // Test the API endpoint with token from localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).not.toBeNull();

    const response = await request.get('/api/todos?limit=1000', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.items)).toBeTruthy();
  });
});
