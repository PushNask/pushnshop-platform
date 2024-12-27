import { test, expect } from '@playwright/test'

test.describe('Authentication flows', () => {
  test('successful login flow', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in login form
    await page.fill('input[type="email"]', 'seller1@test.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Assert successful login
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('login validation errors', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Assert validation messages
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })
})