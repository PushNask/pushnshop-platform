import { test, expect } from '@playwright/test';
import { supabase } from '@/integrations/supabase/client';

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as a seller
    await page.goto('/login');
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/seller');
  });

  test('should enforce 7 image limit when creating product', async ({ page }) => {
    await page.goto('/seller');
    await page.click('text=Create Product');

    // Try to upload 8 images
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      'test-files/image1.jpg',
      'test-files/image2.jpg',
      'test-files/image3.jpg',
      'test-files/image4.jpg',
      'test-files/image5.jpg',
      'test-files/image6.jpg',
      'test-files/image7.jpg',
      'test-files/image8.jpg',
    ]);

    // Verify error message
    await expect(page.locator('.error-message')).toContainText('Maximum 7 images allowed');
  });

  test('should validate image size and format', async ({ page }) => {
    await page.goto('/seller');
    await page.click('text=Create Product');

    // Try to upload large file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(['test-files/large-image.jpg']);

    // Verify error message
    await expect(page.locator('.error-message')).toContainText('Image size must be less than 5MB');

    // Try invalid format
    await fileInput.setInputFiles(['test-files/invalid.txt']);
    await expect(page.locator('.error-message')).toContainText('Invalid file format');
  });

  test('should handle product status transitions correctly', async ({ page }) => {
    // Create product
    await page.goto('/seller');
    await page.click('text=Create Product');
    await page.fill('input[name="title"]', 'Test Product');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.fill('input[name="price"]', '1000');
    await page.click('button[type="submit"]');

    // Verify initial pending status
    await expect(page.locator('.product-status')).toHaveText('pending');

    // Login as admin to approve
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Approve product
    await page.goto('/admin');
    await page.click('text=Products');
    await page.click('button:has-text("Approve")');

    // Verify active status
    await expect(page.locator('.product-status')).toHaveText('active');
  });

  test('should validate price range and duration', async ({ page }) => {
    await page.goto('/seller');
    await page.click('text=Create Product');

    // Test price validation
    await page.fill('input[name="price"]', '500'); // Below minimum
    await expect(page.locator('.error-message')).toContainText('Minimum price is 1000 XAF');

    await page.fill('input[name="price"]', '2000000'); // Above maximum
    await expect(page.locator('.error-message')).toContainText('Maximum price is 1000000 XAF');

    // Test duration validation
    await page.fill('input[name="duration"]', '12'); // Below minimum
    await expect(page.locator('.error-message')).toContainText('Duration must be between 24 and 720 hours');

    await page.fill('input[name="duration"]', '1000'); // Above maximum
    await expect(page.locator('.error-message')).toContainText('Duration must be between 24 and 720 hours');
  });

  test('should format description correctly', async ({ page }) => {
    await page.goto('/seller');
    await page.click('text=Create Product');

    // Test description formatting
    const longDescription = 'a'.repeat(1001);
    await page.fill('textarea[name="description"]', longDescription);
    await expect(page.locator('.error-message')).toContainText('Description must be less than 1000 characters');

    // Test HTML stripping
    await page.fill('textarea[name="description"]', '<script>alert("test")</script>Test description');
    await page.click('button[type="submit"]');
    const savedDescription = await page.locator('.product-description').textContent();
    expect(savedDescription).toBe('Test description');
  });

  test('should handle edit and delete operations', async ({ page }) => {
    // Create product first
    await page.goto('/seller');
    await page.click('text=Create Product');
    await page.fill('input[name="title"]', 'Edit Test Product');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.fill('input[name="price"]', '1000');
    await page.click('button[type="submit"]');

    // Edit product
    await page.click('button:has-text("Edit")');
    await page.fill('input[name="title"]', 'Updated Title');
    await page.click('button:has-text("Save")');
    await expect(page.locator('.product-title')).toHaveText('Updated Title');

    // Delete product
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('text=Edit Test Product')).not.toBeVisible();
  });
});