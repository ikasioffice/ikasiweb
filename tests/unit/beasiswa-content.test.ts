import { describe, expect, it } from "vitest";
import {
  DEFAULTS,
  baris,
  kolom,
  persenProgres,
  teks,
  timeline,
  type Konten,
} from "@/app/(public)/beasiswa/_content";
import { ALL_CONTENT_KEYS, CONTENT_GROUPS } from "@/app/(admin)/admin/beasiswa/_fields";

describe("skema konten beasiswa", () => {
  it("mencakup 53 field seperti admin.html microsite lama", () => {
    expect(ALL_CONTENT_KEYS).toHaveLength(53);
    expect(CONTENT_GROUPS).toHaveLength(9);
  });

  it("setiap field yang bisa diedit punya teks bawaan", () => {
    // custom_sections sengaja kosong: bagian tambahan disembunyikan bila tak diisi.
    const tanpaDefault = ALL_CONTENT_KEYS.filter(
      (k) => k !== "custom_sections" && !DEFAULTS[k]?.trim(),
    );
    expect(tanpaDefault).toEqual([]);
  });

  it("tidak ada default yang mengandung mojibake dari konversi encoding", () => {
    const rusak = Object.entries(DEFAULTS).filter(([, v]) => /Â|â€|Ã/.test(v));
    expect(rusak).toEqual([]);
  });

  it("tidak ada key ganda antar grup", () => {
    expect(new Set(ALL_CONTENT_KEYS).size).toBe(ALL_CONTENT_KEYS.length);
  });
});

describe("teks()", () => {
  it("memakai bawaan bila admin belum mengedit", () => {
    expect(teks({}, "hero_title_line1")).toBe("Beasiswa");
  });

  it("memakai override admin bila ada isinya", () => {
    expect(teks({ hero_title_line1: "Bantuan" }, "hero_title_line1")).toBe("Bantuan");
  });

  it("jatuh ke bawaan bila override hanya spasi", () => {
    expect(teks({ hero_title_line1: "   " }, "hero_title_line1")).toBe("Beasiswa");
  });

  it("mengembalikan string kosong untuk key tak dikenal", () => {
    expect(teks({}, "key_ngawur")).toBe("");
  });
});

describe("baris()", () => {
  it("memecah multi-baris dan membuang baris kosong", () => {
    const c: Konten = { done_list: "satu\n\n  dua  \n\n" };
    expect(baris(c, "done_list")).toEqual(["satu", "dua"]);
  });

  it("memakai bawaan bila kosong", () => {
    expect(baris({}, "tentang_misi")).toHaveLength(3);
  });
});

describe("kolom()", () => {
  it("memecah tiap baris pada tanda | dan merapikan spasi", () => {
    const c: Konten = { tujuan_goals: "Judul A | Isi A\nJudul B|Isi B" };
    expect(kolom(c, "tujuan_goals")).toEqual([
      ["Judul A", "Isi A"],
      ["Judul B", "Isi B"],
    ]);
  });

  it("membaca daftar tujuan bawaan sebagai 4 kartu berisi judul dan deskripsi", () => {
    const goals = kolom({}, "tujuan_goals");
    expect(goals).toHaveLength(4);
    expect(goals.every((g) => g[0] && g[1])).toBe(true);
  });
});

describe("timeline()", () => {
  it("membaca 7 tahapan bawaan dengan tahap pertama aktif", () => {
    const t = timeline({});
    expect(t).toHaveLength(7);
    expect(t[0].judul).toBe("Pengumpulan Sumber Dana");
    expect(t[0].aktif).toBe(true);
    expect(t[1].aktif).toBe(false);
  });

  it("memakai override admin dan menerima 'ya' apa pun kapitalisasinya", () => {
    const c: Konten = { timeline_items: "Jan 2027 | Selesai | Judul | Isi | YA" };
    expect(timeline(c)).toEqual([
      { tanggal: "Jan 2027", status: "Selesai", judul: "Judul", desc: "Isi", aktif: true },
    ]);
  });

  it("mengisi kolom yang tidak ditulis dengan string kosong", () => {
    expect(timeline({ timeline_items: "Feb 2027" })[0]).toEqual({
      tanggal: "Feb 2027",
      status: "",
      judul: "",
      desc: "",
      aktif: false,
    });
  });
});

describe("persenProgres()", () => {
  it("memakai bawaan 42", () => {
    expect(persenProgres({})).toBe(42);
  });

  it("menjepit ke rentang 0-100", () => {
    expect(persenProgres({ progress_percent: "150" })).toBe(100);
    expect(persenProgres({ progress_percent: "-5" })).toBe(0);
  });

  it("mengembalikan 0 untuk nilai bukan angka", () => {
    expect(persenProgres({ progress_percent: "abc" })).toBe(0);
  });
});
