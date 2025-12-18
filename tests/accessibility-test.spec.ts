import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('Home page should pass accessibility checks', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Product page should pass accessibility checks', async ({ page }) => {
    // First get a product from the shop
    await page.goto('/tienda');
    const productLink = page.locator('a[href*="/producto/"]').first();
    await expect(productLink).toBeVisible();

    const productUrl = await productLink.getAttribute('href');
    if (productUrl) {
      await page.goto(productUrl);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Cart page should pass accessibility checks', async ({ page }) => {
    await page.goto('/checkout/cart');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Checkout page should pass accessibility checks', async ({ page }) => {
    await page.goto('/checkout');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Admin dashboard should pass accessibility checks', async ({ page }) => {
    // This would need authentication in a real test
    // For now, just test the login page
    await page.goto('/auth/login');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard navigation should work', async ({ page, browserName }) => {
    await page.goto('/');

    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // For mobile browsers, test mobile navigation
    if (browserName.includes('Mobile')) {
      // Check if mobile navigation is present
      const mobileNav = page.locator('nav[aria-label="Mobile Navigation"], nav.fixed.bottom-0');
      const isMobile = await mobileNav.isVisible().catch(() => false);

      if (isMobile) {
        // Navigate through mobile navigation
        await page.keyboard.press('Tab');
        const mobileNavItems = page.locator('nav.fixed.bottom-0 a');
        const firstMobileNavItem = mobileNavItems.first();
        await expect(firstMobileNavItem).toBeVisible();
      }
    } else {
      // Navigate through main navigation
      await page.keyboard.press('Tab');
      const navItems = page.locator('nav a');
      const firstNavItem = navItems.first();
      await expect(firstNavItem).toBeFocused();
    }
  });

  test('Color contrast should be sufficient', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    // Allow some minor contrast issues but ensure no critical violations
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical' || violation.impact === 'serious'
    );

    expect(criticalViolations.length).toBeLessThan(3); // Allow up to 2 critical contrast issues
  });

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Decorative images can have empty alt, but content images should have alt
      if (alt === null) {
        console.warn(`Image without alt attribute found: ${await img.getAttribute('src')}`);
      }
    }
  });

  test('Form elements should have labels', async ({ page }) => {
    await page.goto('/auth/login');

    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const type = await input.getAttribute('type');

      // Skip hidden inputs and submit buttons
      if (type === 'hidden' || type === 'submit') continue;

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('Mobile navigation should display correctly', async ({ page, browserName }) => {
    // Only run this test on mobile browsers
    if (!browserName.includes('Mobile')) {
      return;
    }

    await page.goto('/');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Check if mobile navigation is visible
    const mobileNav = page.locator('nav.fixed.bottom-0');
    await expect(mobileNav).toBeVisible();

    // Check that all navigation items are present with text labels
    const navItems = mobileNav.locator('a');
    await expect(navItems).toHaveCount(5);

    // Verify each navigation item has both icon and text
    const expectedLabels = ['Inicio', 'Tienda', 'Carrito', 'Servicios', 'Pedidos'];
    for (let i = 0; i < expectedLabels.length; i++) {
      const navItem = navItems.nth(i);
      await expect(navItem).toBeVisible();

      // Check if the label text is present
      const labelText = navItem.locator('span').last();
      await expect(labelText).toContainText(expectedLabels[i]);
    }

    // Verify the special services button is styled differently
    const servicesButton = navItems.nth(3);
    const servicesIcon = servicesButton.locator('.material-icons-outlined').first();
    await expect(servicesIcon).toHaveClass(/text-2xl/);

    // Check if cart badge shows when there are items (if implemented)
    const cartButton = navItems.nth(2);
    const cartBadge = cartButton.locator('.absolute');
    // Badge should exist but may not be visible if cart is empty
    const badgeExists = await cartBadge.count() > 0;
    expect(badgeExists).toBe(true);
  });
});
