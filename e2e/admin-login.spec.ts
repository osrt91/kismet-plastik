import { test, expect } from "@playwright/test";

const BASE = "/test";

test.describe("Admin Login", () => {
  test("unauthenticated admin access redirects", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    // Should redirect away from /admin (to /admin/login or /giris)
    await page.waitForLoadState("domcontentloaded");
    const url = page.url();
    expect(url).not.toMatch(/\/admin$/);
  });

  test("admin login page renders with input", async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await page.waitForLoadState("domcontentloaded");
    const input = page.locator("input[type=password], input[type=text]").first();
    await expect(input).toBeVisible({ timeout: 15000 });
  });
});
