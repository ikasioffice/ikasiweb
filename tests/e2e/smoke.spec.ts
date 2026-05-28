import { expect, test } from "@playwright/test";

test("homepage memiliki nav dan footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /IKASI/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Direktori/ }).first()).toBeVisible();
  await expect(page.getByText(/SK Kemenkumham 2024/)).toBeVisible();
});
