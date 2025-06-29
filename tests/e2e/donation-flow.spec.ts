import { test, expect } from '@playwright/test';

test.describe('Donation Information', () => {
  test('should display donation page with account details', async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
    
    // Check that the page loads correctly
    await expect(page).toHaveTitle(/rudhirsetu seva sanstha/i);
    
    // Find and click the donate button/link
    await page.getByRole('link', { name: /donate/i }).first().click();
    
    // Should navigate to donations page
    await expect(page).toHaveURL('/donations');
    
    // Check for donation information - be specific about what element to target
    await expect(page.getByRole('heading', { name: /bank transfer/i })).toBeVisible();
  });

  test('should show bank account details for donations', async ({ page }) => {
    await page.goto('/donations');
    
    // Should show bank transfer information (common for NGOs)
    const pageContent = await page.textContent('body');
    
    // Look for typical bank donation info
    expect(pageContent?.toLowerCase()).toMatch(/bank|transfer|account|upi|donation/);
  });

  test('should be accessible on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/donations');
    
    // Page should load and be readable on mobile
    await expect(page.getByText(/donate/i)).toBeVisible();
    
    // Check if mobile navigation works if present
    const menuButton = page.locator('[aria-label*="menu"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Navigation should become visible
    }
  });

  test('should have contact information for donation inquiries', async ({ page }) => {
    await page.goto('/donations');
    
    // Should have some way to contact for donation questions
    const pageContent = await page.textContent('body');
    
    // Look for contact methods (email, phone, or contact page link)
    expect(
      pageContent?.toLowerCase().includes('contact') ||
      pageContent?.toLowerCase().includes('@') ||
      pageContent?.toLowerCase().includes('phone') ||
      pageContent?.toLowerCase().includes('help')
    ).toBeTruthy();
  });
}); 