import { test, expect } from "@playwright/test";

const BASE = "/test";

test.describe("Homepage", () => {
  test("renders hero section with h1", async ({ page }) => {
    await page.goto(`${BASE}/tr`);
    await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1")).not.toBeEmpty();
  });

  test("renders header", async ({ page }) => {
    await page.goto(`${BASE}/tr`);
    await expect(page.locator("header")).toBeVisible({ timeout: 15000 });
  });

  test("renders footer", async ({ page }) => {
    await page.goto(`${BASE}/tr`);
    await expect(page.locator("footer")).toBeVisible({ timeout: 15000 });
  });

  test("renders trust bar stats", async ({ page }) => {
    await page.goto(`${BASE}/tr`);
    const trustBar = page.locator("section").filter({ hasText: /Yıllık Deneyim|Ürün Çeşidi/i }).first();
    await expect(trustBar).toBeVisible({ timeout: 15000 });
  });
});
