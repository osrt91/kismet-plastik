import { test, expect } from "@playwright/test";

const BASE = "/test";

test.describe("Navigation", () => {
  test("products page loads", async ({ page }) => {
    await page.goto(`${BASE}/tr/urunler`);
    await expect(page).toHaveURL(/\/urunler/);
  });

  test("about page loads", async ({ page }) => {
    await page.goto(`${BASE}/tr/hakkimizda`);
    await expect(page).toHaveURL(/\/hakkimizda/);
  });

  test("contact page loads", async ({ page }) => {
    await page.goto(`${BASE}/tr/iletisim`);
    await expect(page).toHaveURL(/\/iletisim/);
  });

  test("quality page loads", async ({ page }) => {
    await page.goto(`${BASE}/tr/kalite`);
    await expect(page).toHaveURL(/\/kalite/);
  });

  test("FAQ page loads", async ({ page }) => {
    await page.goto(`${BASE}/tr/sss`);
    await expect(page).toHaveURL(/\/sss/);
  });

  test("EN locale works", async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page).toHaveURL(/\/en/);
  });
});
