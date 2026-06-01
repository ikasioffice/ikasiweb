/** Normalisasi nama ke Title Case, rapikan spasi. Aman untuk null/undefined. */
export function formatName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase());
}

/**
 * Mengembalikan teks bersih atau `null` bila kosong/placeholder (`-`, `—`).
 * Pemanggil menyembunyikan baris saat hasilnya null (hindari "-" telanjang).
 */
export function displayOrDash(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = value.trim();
  if (t === "" || t === "-" || t === "—") return null;
  return t;
}
