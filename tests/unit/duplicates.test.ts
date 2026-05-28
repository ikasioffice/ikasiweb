import { describe, it, expect } from "vitest";
import {
  normalizeName, normalizeEmail, normalizePhone, findDuplicateGroups,
} from "@/lib/data/duplicates";
import type { Database } from "@/lib/supabase/database.types";

type Alumni = Database["public"]["Tables"]["alumni"]["Row"];

// factory: baris alumni minimal; override sesuai kebutuhan test
function row(over: Partial<Alumni>): Alumni {
  return {
    id: over.id ?? crypto.randomUUID(),
    nama: over.nama ?? "Test Orang",
    angkatan: over.angkatan ?? 2018,
    prodi: over.prodi ?? "TEKNIK KONSTRUKSI GEDUNG",
    email: over.email ?? null,
    no_hp: over.no_hp ?? null,
    is_form_filled: over.is_form_filled ?? null,
    auth_user_id: over.auth_user_id ?? null,
    source_layer: over.source_layer ?? null,
    // sisanya tidak dipakai detektor — cast aman untuk fixture
  } as Alumni;
}

describe("normalisasi", () => {
  it("normalizeName: trim+lowercase+collapse whitespace", () => {
    expect(normalizeName("  Akmala   Rafi  Prasetia ")).toBe("akmala rafi prasetia");
  });
  it("normalizeEmail: '-' dan kosong jadi null", () => {
    expect(normalizeEmail(" A@B.com ")).toBe("a@b.com");
    expect(normalizeEmail("-")).toBeNull();
    expect(normalizeEmail("")).toBeNull();
  });
  it("normalizePhone: buang non-digit, 62→0, <8 digit null", () => {
    expect(normalizePhone("0822-2151-8734")).toBe("082221518734");
    expect(normalizePhone("+62 822 2151 8734")).toBe("082221518734");
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("-")).toBeNull();
  });
});

describe("findDuplicateGroups (mode nama)", () => {
  it("(a) clear-cut: keep form-filled, delete non-form (kasus Abun)", () => {
    const a = row({ id: "keep", nama: "Abun Bunjamin", angkatan: 2013, is_form_filled: true });
    const b = row({ id: "del", nama: "Abun Bunjamin", angkatan: 2013, is_form_filled: false });
    const [g] = findDuplicateGroups([a, b], "nama");
    expect(g.classification).toBe("clear-cut");
    expect(g.recommendations["keep"].recommend).toBe("keep");
    expect(g.recommendations["del"].recommend).toBe("delete");
  });

  it("(b) ambigu beda-angkatan: semua review, tidak ada delete (kasus Akmala)", () => {
    const a = row({ id: "x", nama: "Akmala Rafi Prasetia", angkatan: 2018, is_form_filled: true });
    const b = row({ id: "y", nama: "Akmala Rafi Prasetia", angkatan: 2017, is_form_filled: false });
    const [g] = findDuplicateGroups([a, b], "nama");
    expect(g.classification).toBe("ambiguous");
    expect(Object.values(g.recommendations).every((r) => r.recommend === "review")).toBe(true);
  });

  it("(c) no-form-filled: semua review", () => {
    const a = row({ id: "x", nama: "Budi", angkatan: 2015, is_form_filled: false });
    const b = row({ id: "y", nama: "Budi", angkatan: 2015, is_form_filled: false });
    const [g] = findDuplicateGroups([a, b], "nama");
    expect(g.classification).toBe("no-form-filled");
    expect(Object.values(g.recommendations).every((r) => r.recommend === "review")).toBe(true);
  });

  it("(d) baris dengan auth_user_id tidak pernah delete", () => {
    const a = row({ id: "keep", nama: "Cici", angkatan: 2016, is_form_filled: true });
    const b = row({ id: "linked", nama: "Cici", angkatan: 2016, is_form_filled: false, auth_user_id: "u1" });
    const [g] = findDuplicateGroups([a, b], "nama");
    expect(g.recommendations["linked"].recommend).not.toBe("delete");
  });

  it("non-duplikat (1 baris) tidak jadi grup", () => {
    expect(findDuplicateGroups([row({ nama: "Solo" })], "nama")).toHaveLength(0);
  });
});

describe("findDuplicateGroups (mode email/no_hp)", () => {
  it("(e) grup by email; email kosong/'-' diabaikan", () => {
    const a = row({ id: "x", email: "sama@x.com", angkatan: 2018, is_form_filled: true });
    const b = row({ id: "y", email: "SAMA@x.com", angkatan: 2018, is_form_filled: false });
    const c = row({ id: "z", email: "-" });
    const d = row({ id: "w", email: null });
    const groups = findDuplicateGroups([a, b, c, d], "email");
    expect(groups).toHaveLength(1);
    expect(groups[0].rows.map((r) => r.id).sort()).toEqual(["x", "y"]);
  });

  it("grup by no_hp dengan normalisasi 62→0", () => {
    const a = row({ id: "x", no_hp: "082221518734", angkatan: 2018, is_form_filled: true });
    const b = row({ id: "y", no_hp: "+6282221518734", angkatan: 2018, is_form_filled: false });
    const groups = findDuplicateGroups([a, b], "no_hp");
    expect(groups).toHaveLength(1);
  });
});
