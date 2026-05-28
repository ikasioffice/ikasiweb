import { test, expect } from "@playwright/test";

const HAS_SR = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

test.describe("Duplicate Manager", () => {
  test.skip(!HAS_SR, "butuh SUPABASE_SERVICE_ROLE_KEY untuk mint sesi admin");

  test("render grup duplikat & hapus satu baris", async ({ page }) => {
    // TODO: inject sesi admin ikasioffice@gmail.com via service-role (generateLink/setSession)
    // lalu set cookie supabase sebelum navigate.
    await page.goto("/admin/alumni/duplicates/");
    await expect(page.getByRole("heading", { name: "Duplikat Alumni" })).toBeVisible();
    const firstGroup = page.locator(".glass-card").first();
    await expect(firstGroup).toBeVisible();
    const before = await page.locator("text=grup").innerText();

    await firstGroup.getByRole("button", { name: "Hapus baris ini" }).first().click();
    await page.getByRole("button", { name: /Hapus/ }).last().click();

    await expect(page.locator("text=Bisa di-restore")).toBeVisible({ timeout: 5000 });
    expect(await page.locator("text=grup").innerText()).not.toBe(before);
  });
});
