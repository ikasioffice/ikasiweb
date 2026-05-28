import { describe, expect, it } from "vitest";
import { matchesAlumniFilter, type AlumniFilter } from "@/lib/data/alumni";

const sample = {
  id: "1", nama: "Budi Santoso", angkatan: 2010,
  prodi: "D3 Konstruksi Gedung", bidang_pekerjaan: "Konstruksi",
  tempat_kerja: "PT Waskita", jabatan: "Site Engineer",
  domisili: "Jakarta", is_verified: true,
  bersedia_dosen_tamu: null, bersedia_kp: null, bersedia_pengurus: null,
  bidang_ska: null, created_at: null, foto_url: null,
  institusi: null, jenis_kelamin: null, minat_hobi: null,
  pendidikan_terakhir: null, punya_ska: null, tahun_lulus: null,
  updated_at: null,
};

describe("matchesAlumniFilter", () => {
  it("matches when query matches nama", () => {
    expect(matchesAlumniFilter(sample, { query: "budi" } as AlumniFilter)).toBe(true);
  });

  it("matches when query matches tempat_kerja", () => {
    expect(matchesAlumniFilter(sample, { query: "waskita" } as AlumniFilter)).toBe(true);
  });

  it("does not match when angkatan filter mismatches", () => {
    expect(matchesAlumniFilter(sample, { angkatan: 2015 } as AlumniFilter)).toBe(false);
  });

  it("matches when domisili filter matches", () => {
    expect(matchesAlumniFilter(sample, { domisili: "Jakarta" } as AlumniFilter)).toBe(true);
  });

  it("combines filters with AND", () => {
    expect(matchesAlumniFilter(sample, { query: "budi", angkatan: 2010 } as AlumniFilter)).toBe(true);
    expect(matchesAlumniFilter(sample, { query: "budi", angkatan: 2015 } as AlumniFilter)).toBe(false);
  });
});
