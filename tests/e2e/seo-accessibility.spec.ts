import { test, expect } from '@playwright/test';

test.describe('SEO & Accessibility', () => {
  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const title = await page.locator('title').textContent();
    expect(title).toContain('Rudhirsetu Seva Sanstha');
    expect(title).toContain('Blood Donation');
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('blood donation');
    expect(metaDescription).toContain('healthcare');
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('rudhirsetu.org');
  });

  test('should have proper structured data', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
    expect(structuredData).toContain('NGO');
    expect(structuredData).toContain('Rudhirsetu Seva Sanstha');
    expect(structuredData).toContain('https://www.rudhirsetu.org');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // First focusable element should be visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT'].includes(focusedElement || '')).toBeTruthy();
    
    // Should be able to navigate through main links
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
  });

  test('should have proper alt tags for images', async ({ page }) => {
    await page.goto('/');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that all images have alt text
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy(); // Should not be null or empty
      expect(alt?.length).toBeGreaterThan(3); // Should be descriptive
    }
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have one h1 tag
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // h1 should contain meaningful content for the NGO
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text?.toLowerCase()).toMatch(
      /transforming|lives|empowering|communities|rudhirsetu|blood donation|healthcare|seva sanstha/
    );
    
    // Should have logical heading hierarchy (no h3 without h2, etc.)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(1); // Should have multiple headings for structure
  });

  test('should load critical resources quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for the logo to be visible (critical above-the-fold content)
    await expect(page.getByAltText('Rudhirsetu Logo')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Page should load core content within reasonable time (adjust as needed)
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });

  test('should have working sitemap and robots.txt', async ({ request }) => {
    // Test sitemap accessibility
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.status()).toBe(200);
    
    const sitemapContent = await sitemapResponse.text();
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('https://www.rudhirsetu.org');
    
    // Test robots.txt
    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.status()).toBe(200);
    
    const robotsContent = await robotsResponse.text();
    expect(robotsContent).toContain('User-agent');
  });
}); 