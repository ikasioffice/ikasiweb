import { describe, expect, it } from "vitest";
import { samarkanNama } from "@/app/(public)/beasiswa/_sections";

describe("samarkanNama", () => {
  it("menyamarkan tiap kata: 2 huruf awal + x sisanya", () => {
    expect(samarkanNama("Feby Taufik N")).toBe("Fexx Taxxxx N");
    expect(samarkanNama("Alicia")).toBe("Alxxxx");
    expect(samarkanNama("Budi")).toBe("Buxx");
    expect(samarkanNama("Rahmat Hidayat")).toBe("Raxxxx Hixxxxx");
  });

  it("kata 1-2 huruf tidak disamarkan (inisial tetap)", () => {
    expect(samarkanNama("N")).toBe("N");
    expect(samarkanNama("AB")).toBe("AB");
  });

  it("menangani spasi ganda / trim", () => {
    expect(samarkanNama("  Feby   Taufik  ")).toBe("Fexx Taxxxx");
    expect(samarkanNama("\tAlicia\n")).toBe("Alxxxx");
  });

  it("fallback ke 'Alumni' bila nama kosong/null", () => {
    expect(samarkanNama(null)).toBe("Alumni");
    expect(samarkanNama(undefined)).toBe("Alumni");
    expect(samarkanNama("  ")).toBe("Alumni");
    expect(samarkanNama("")).toBe("Alumni");
  });
});
