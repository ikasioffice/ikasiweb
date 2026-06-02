import { expect, test } from "@playwright/test";

test("beranda: hero, CTA, dan link fitur tetap ada", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Ribuan Alumni/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Jelajahi Direktori/ })).toHaveAttribute("href", /\/alumni/);
  await expect(page.getByRole("link", { name: /Bergabung Gratis/ })).toHaveAttribute("href", /\/daftar/);
  await expect(page.getByRole("link", { name: /Direktori Alumni/ })).toHaveAttribute("href", /\/alumni/);
  await expect(page.getByRole("link", { name: /Bisnis Alumni/ })).toHaveAttribute("href", /\/bisnis/);
});

test("beranda: statistik tampil (angka atau placeholder)", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Alumni Terdaftar/)).toBeVisible();
  await expect(page.getByText(/Angkatan/).first()).toBeVisible();
  await expect(page.getByText(/Bisnis Alumni/).first()).toBeVisible();
});
