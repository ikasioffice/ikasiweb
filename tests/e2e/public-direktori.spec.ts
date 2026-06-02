import { expect, test } from "@playwright/test";

test("direktori alumni — list + search + filter", async ({ page }) => {
  await page.goto("/alumni");

  await expect(page.getByRole("heading", { name: /Direktori/ })).toBeVisible();

  // Cards muncul setelah load dari Supabase
  await page.waitForSelector("[href^='/alumni/']", { timeout: 15_000 });
  const cardsBefore = await page.locator("[href^='/alumni/']").count();
  expect(cardsBefore).toBeGreaterThan(0);

  // Search filter
  await page.getByPlaceholder(/Cari nama/).fill("a");
  await page.waitForTimeout(300);
  const cardsAfter = await page.locator("[href^='/alumni/']").count();
  expect(cardsAfter).toBeGreaterThan(0);

  // Kontak masked
  await expect(page.locator("text=Login untuk kontak").first()).toBeVisible();
});

test("alumni detail kontak masked saat anonymous", async ({ page }) => {
  await page.goto("/alumni");
  await page.waitForSelector("[href^='/alumni/']", { timeout: 15_000 });
  // Alumni IDs are UUIDs (contain '-'), nav link is '/alumni/' with no UUID
  await page.locator("a[href^='/alumni/'][href*='-']").first().click();
  await page.waitForURL(/\/alumni\/.+/);
  // Kontak ter-gate: LoginPrompt menampilkan CTA login untuk anonymous.
  await expect(page.getByRole("link", { name: /Masuk dengan Google/i })).toBeVisible({ timeout: 15_000 });
});
