import { test, expect } from "@playwright/test";

const BASE = "/test";

test.describe("SEO & Meta", () => {
  test("sitemap.xml endpoint responds", async ({ request }) => {
    const response = await request.get(`${BASE}/sitemap.xml`);
    // Endpoint exists (not 404)
    expect(response.status()).not.toBe(404);
  });

  test("robots.txt endpoint responds", async ({ request }) => {
    const response = await request.get(`${BASE}/robots.txt`);
    expect(response.status()).not.toBe(404);
  });
});
