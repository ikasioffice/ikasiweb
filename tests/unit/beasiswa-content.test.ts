import { describe, expect, it } from "vitest";
import {
  DEFAULTS,
  baris,
  kolom,
  nominalDenganKode,
  persenProgres,
  teks,
  timeline,
  type Konten,
} from "@/app/(public)/beasiswa/_content";
import { ALL_CONTENT_KEYS, CONTENT_GROUPS } from "@/app/(admin)/admin/beasiswa/_fields";

// 53 key dari CONTENT_SCHEMA admin.html microsite lama. Daftar ini mengunci
// agar tidak ada yang hilang saat skema diubah; penambahan key baru boleh.
const KEY_WARISAN = [
  "hero_eyebrow", "hero_title_line1", "hero_title_line2", "hero_tagline",
  "tentang_eyebrow", "tentang_judul", "tentang_latar_judul", "tentang_latar_isi",
  "tentang_copy_1", "tentang_copy_2", "tentang_visi", "tentang_misi",
  "tujuan_eyebrow", "tujuan_judul", "tujuan_lede", "tujuan_goals",
  "fakta_eyebrow", "fakta_judul", "fakta_lede", "insight1_judul", "insight1_sub",
  "insight1_list", "insight2_judul", "insight2_sub", "insight2_list", "fakta_callout",
  "sistematika_eyebrow", "sistematika_judul", "sistematika_lede",
  "timeline_eyebrow", "timeline_judul", "progress_label", "progress_percent",
  "done_list", "timeline_items",
  "anggaran_eyebrow", "anggaran_judul", "anggaran_lede", "rekening_judul",
  "rekening_desc", "anggaran_note",
  "tambahan_eyebrow", "tambahan_judul", "custom_sections",
  "kontak_eyebrow", "kontak_judul", "kontak_lede", "pic_nama", "pic_title",
  "kontak_wa", "kontak_email", "kontak_ig", "footer_tagline",
];

describe("skema konten beasiswa", () => {
  it("mempertahankan seluruh 53 field admin.html microsite lama", () => {
    expect(KEY_WARISAN).toHaveLength(53);
    const hilang = KEY_WARISAN.filter((k) => !ALL_CONTENT_KEYS.includes(k));
    expect(hilang).toEqual([]);
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

describe("nominalDenganKode()", () => {
  it("menambahkan kode 11 pada nominal bulat", () => {
    expect(nominalDenganKode(500000, "11")).toBe(500011);
    expect(nominalDenganKode(50000, "11")).toBe(50011);
    expect(nominalDenganKode(100000, "11")).toBe(100011);
  });

  it("membiarkan nominal yang sudah berakhiran kode", () => {
    expect(nominalDenganKode(500011, "11")).toBe(500011);
  });

  it("selalu membulatkan KE ATAS, tidak pernah meminta kurang dari niat donatur", () => {
    // 500.050 -> 500.011 lebih kecil, jadi naik satu kelipatan
    expect(nominalDenganKode(500050, "11")).toBe(500111);
    expect(nominalDenganKode(12, "11")).toBe(111);
    for (const n of [1, 99, 1000, 250_000, 999_999, 1_234_567]) {
      expect(nominalDenganKode(n, "11")).toBeGreaterThanOrEqual(n);
    }
  });

  it("selisihnya tidak pernah melebihi satu kelipatan kode", () => {
    for (const n of [1000, 250_000, 500_000, 999_999, 1_234_567]) {
      expect(nominalDenganKode(n, "11") - n).toBeLessThan(100);
    }
  });

  it("hasilnya selalu berakhiran kode yang diminta", () => {
    for (const n of [1000, 250_000, 500_050, 999_999]) {
      expect(nominalDenganKode(n, "11") % 100).toBe(11);
      expect(nominalDenganKode(n, "7") % 10).toBe(7);
    }
  });

  it("mendukung kode dengan jumlah digit berbeda", () => {
    expect(nominalDenganKode(500000, "7")).toBe(500007);
    expect(nominalDenganKode(500000, "123")).toBe(500123);
  });

  it("mati bila kode dikosongkan atau bukan angka", () => {
    expect(nominalDenganKode(500000, "")).toBe(500000);
    expect(nominalDenganKode(500000, "abc")).toBe(500000);
  });

  it("tidak mengubah nominal nol atau negatif", () => {
    expect(nominalDenganKode(0, "11")).toBe(0);
    expect(nominalDenganKode(-5, "11")).toBe(-5);
  });

  it("memakai kode bawaan 11 dari skema konten", () => {
    expect(teks({}, "kode_unik")).toBe("11");
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
