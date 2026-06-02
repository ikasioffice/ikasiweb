import { expect, test } from "@playwright/test";

test("bisnis: header & search tampil", async ({ page }) => {
  await page.goto("/bisnis");
  await expect(page.getByRole("heading", { name: /Direktori/ })).toBeVisible();
  await expect(page.getByPlaceholder(/Cari nama bisnis/)).toBeVisible();
});

test("event: header tampil", async ({ page }) => {
  await page.goto("/event");
  await expect(page.getByRole("heading", { name: /Acara/ })).toBeVisible();
});

test("berita: header tampil", async ({ page }) => {
  await page.goto("/news");
  await expect(page.getByRole("heading", { name: /Berita/ })).toBeVisible();
});

test("berita detail: artikel bisa dibuka & markdown ter-render (bila ada artikel)", async ({ page }) => {
  await page.goto("/news");
  await page.waitForLoadState("networkidle");
  // Link artikel = /news/<slug> (bukan /news/ atau /news milik nav). Lewati bila list kosong.
  const articleLinks = page.locator('a[href^="/news/"]:not([href="/news/"])');
  const count = await articleLinks.count();
  test.skip(count === 0, "Tidak ada artikel di environment ini");
  await articleLinks.first().click();
  await page.waitForURL(/\/news\/.+/);
  await expect(page.locator("article")).toBeVisible();
});
