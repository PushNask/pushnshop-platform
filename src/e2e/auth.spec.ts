import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('successful login flow', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Click login button and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
    
    // Verify successful login
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('displays validation errors', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Verify validation messages
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('handles incorrect credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in wrong credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
  });
});