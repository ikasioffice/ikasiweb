/** Normalisasi nama ke Title Case, rapikan spasi. Aman untuk null/undefined. */
export function formatName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase());
}
