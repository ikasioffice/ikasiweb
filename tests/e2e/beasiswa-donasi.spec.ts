import { expect, test } from "@playwright/test";

// Alur donasi 3 langkah di /beasiswa/dukung. Ketiganya satu rute (state di
// browser) karena situs ini static export -- tidak ada sesi server yang bisa
// membawa data antar halaman.
//
// Baris donasi baru disimpan di langkah 3. Tes ini berhenti sebelum submit
// supaya tidak menulis data ke database.

test("donasi: langkah 1 menolak form kosong", async ({ page }) => {
  await page.goto("/beasiswa/dukung");
  await page.getByRole("button", { name: "Proses Donasi" }).click();
  await expect(page.getByText(/wajib diisi/)).toBeVisible();
  // Tetap di langkah 1
  await expect(page.getByText("Nominal yang perlu ditransfer")).toBeHidden();
});

test("donasi: langkah 1 menolak nominal nol", async ({ page }) => {
  await page.goto("/beasiswa/dukung");
  await page.fill("#nama", "Uji Nominal");
  await page.fill("#angkatan", "2015");
  await page.fill("#wa", "08123456789");
  await page.fill("#nominal", "0");
  await page.getByRole("button", { name: "Proses Donasi" }).click();
  await expect(page.getByText(/lebih dari nol/)).toBeVisible();
});

test("donasi: alur 3 langkah membawa data dan bisa mundur", async ({ page }) => {
  await page.goto("/beasiswa/dukung");

  // --- Langkah 1 ---
  await page.fill("#nama", "Budi Santoso");
  await page.fill("#angkatan", "2015");
  await page.fill("#wa", "081234567890");
  await page.fill("#nominal", "500000");
  await page.getByRole("button", { name: "Proses Donasi" }).click();

  // --- Langkah 2: panduan transfer ---
  await expect(page.getByText("Nominal yang perlu ditransfer")).toBeVisible();
  // Kode unik 11 ditambahkan otomatis: 500.000 -> 500.011
  await expect(page.getByText("Rp 500.011").first()).toBeVisible();
  await expect(page.getByText(/Donasi Rp 500\.000 \+ kode unik 11/)).toBeVisible();
  // Bank adalah metode bawaan
  await expect(page.getByText("1982320247")).toBeVisible();

  // Ganti ke QRIS
  await page.getByRole("button", { name: /Scan QRIS/ }).click();
  await expect(page.locator('img[alt*="QRIS"]')).toBeVisible();

  // --- Langkah 3: bukti ---
  await page.getByRole("button", { name: "Saya Sudah Transfer" }).click();
  await expect(page.getByText("Cara kirim bukti transfer")).toBeVisible();
  // Ringkasan membawa data dari langkah sebelumnya, termasuk nominal berkode
  await expect(page.getByText("Budi Santoso")).toBeVisible();
  await expect(page.getByText("QRIS").first()).toBeVisible();
  await expect(page.getByText("Rp 500.011")).toBeVisible();

  // --- Mundur ke langkah 1: data harus utuh ---
  await page.getByRole("button", { name: "Kembali" }).click();
  await expect(page.getByText("Nominal yang perlu ditransfer")).toBeVisible();
  await page.getByRole("button", { name: "Kembali" }).click();
  await expect(page.locator("#nama")).toHaveValue("Budi Santoso");
  await expect(page.locator("#nominal")).toHaveValue("500.000");
});

test("donasi: langkah 3 mewajibkan file bila memilih upload", async ({ page }) => {
  await page.goto("/beasiswa/dukung");
  await page.fill("#nama", "Uji Bukti");
  await page.fill("#angkatan", "2016");
  await page.fill("#wa", "08123456789");
  await page.fill("#nominal", "100000");
  await page.getByRole("button", { name: "Proses Donasi" }).click();
  await page.getByRole("button", { name: "Saya Sudah Transfer" }).click();

  // "Upload di sini" aktif secara bawaan, tapi belum ada file
  await page.getByRole("button", { name: "Kirim Bukti Dukungan" }).click();
  await expect(page.getByText(/Pilih file bukti transfer/)).toBeVisible();
});
