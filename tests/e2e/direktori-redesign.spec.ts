import { expect, test } from "@playwright/test";

test("direktori alumni: header & filter tampil", async ({ page }) => {
  await page.goto("/alumni");
  await expect(page.getByRole("heading", { name: /Direktori/ })).toBeVisible();
  await expect(page.getByPlaceholder(/Cari nama/)).toBeVisible();
  await expect(page.getByRole("combobox").first()).toBeVisible();
});

test("direktori alumni: filter mobile tidak terpotong", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/alumni");
  const firstSelect = page.getByRole("combobox").first();
  await expect(firstSelect).toBeVisible();
  const box = await firstSelect.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
});

test("halaman angkatan tampil", async ({ page }) => {
  await page.goto("/angkatan");
  await expect(page.getByRole("heading", { name: /Angkatan/ })).toBeVisible();
});
