import type { Database } from "@/lib/supabase/database.types";

export type DedupKey = "nama" | "email" | "no_hp";
export type AlumniRow = Database["public"]["Tables"]["alumni"]["Row"];
export type Classification = "clear-cut" | "ambiguous" | "no-form-filled";
export type RowRecommendation = { recommend: "keep" | "delete" | "review"; reason: string };
export type DuplicateGroup = {
  key: DedupKey;
  normalizedValue: string;
  rows: AlumniRow[];
  classification: Classification;
  recommendations: Record<string, RowRecommendation>; // by alumni id
};

export function normalizeName(s: string): string {
  return (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}
export function normalizeEmail(s: string | null): string | null {
  if (!s) return null;
  const t = s.trim().toLowerCase();
  return t === "" || t === "-" ? null : t;
}
export function normalizePhone(s: string | null): string | null {
  if (!s) return null;
  let d = s.replace(/\D/g, "");
  if (d.startsWith("62")) d = "0" + d.slice(2);
  return d.length < 8 ? null : d;
}

function keyValue(row: AlumniRow, key: DedupKey): string | null {
  if (key === "nama") return normalizeName(row.nama) || null;
  if (key === "email") return normalizeEmail(row.email);
  return normalizePhone(row.no_hp);
}
function normProdi(p: string | null): string {
  return (p ?? "").trim().toLowerCase();
}

function classify(rows: AlumniRow[]): Classification {
  const angkatan = new Set(rows.map((r) => r.angkatan));
  const prodi = new Set(rows.map((r) => normProdi(r.prodi)));
  if (angkatan.size > 1 || prodi.size > 1) return "ambiguous";
  if (!rows.some((r) => r.is_form_filled === true)) return "no-form-filled";
  return "clear-cut";
}

function recommend(rows: AlumniRow[], cls: Classification): Record<string, RowRecommendation> {
  const rec: Record<string, RowRecommendation> = {};
  if (cls !== "clear-cut") {
    const reason = cls === "ambiguous"
      ? "angkatan/prodi berbeda — kemungkinan orang berbeda"
      : "tidak ada baris yang mengisi form — perlu review manual";
    for (const r of rows) rec[r.id] = { recommend: "review", reason };
    return rec;
  }
  // clear-cut: pilih 1 baris keep (form-filled; utamakan yang punya auth_user_id)
  const formFilled = rows.filter((r) => r.is_form_filled === true);
  const keep = formFilled.find((r) => r.auth_user_id != null) ?? formFilled[0];
  for (const r of rows) {
    if (r.id === keep.id) {
      rec[r.id] = { recommend: "keep", reason: "mengisi form (data terlengkap)" };
    } else if (r.auth_user_id != null) {
      rec[r.id] = { recommend: "review", reason: "punya akun login — jangan hapus sembarangan" };
    } else if (r.is_form_filled === true) {
      rec[r.id] = { recommend: "review", reason: "ada >1 baris form-filled — review manual" };
    } else {
      rec[r.id] = { recommend: "delete", reason: "duplikat non-form-filled" };
    }
  }
  return rec;
}

export function findDuplicateGroups(rows: AlumniRow[], key: DedupKey): DuplicateGroup[] {
  const map = new Map<string, AlumniRow[]>();
  for (const r of rows) {
    const v = keyValue(r, key);
    if (v == null) continue;
    (map.get(v) ?? map.set(v, []).get(v)!).push(r);
  }
  const groups: DuplicateGroup[] = [];
  for (const [normalizedValue, groupRows] of map) {
    if (groupRows.length < 2) continue;
    const classification = classify(groupRows);
    groups.push({
      key, normalizedValue, rows: groupRows,
      classification, recommendations: recommend(groupRows, classification),
    });
  }
  return groups.sort((a, b) => a.normalizedValue.localeCompare(b.normalizedValue));
}
