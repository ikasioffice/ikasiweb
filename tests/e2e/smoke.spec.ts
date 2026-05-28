import { expect, test } from "@playwright/test";

test("homepage loads dan menampilkan brand", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("IKASI");
});
