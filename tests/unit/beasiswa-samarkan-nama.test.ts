import { describe, expect, it } from "vitest";
import { samarkanNama } from "@/app/(public)/beasiswa/_sections";

describe("samarkanNama", () => {
  it("menyisakan 2 huruf awal + xxxx untuk nama panjang", () => {
    expect(samarkanNama("Alicia")).toBe("Alxxxx");
    expect(samarkanNama("Budi")).toBe("Buxxxx");
    expect(samarkanNama("Rahmat Hidayat")).toBe("Raxxxx");
  });

  it("menyisakan 1 huruf awal + xxx untuk nama sangat pendek", () => {
    expect(samarkanNama("Al")).toBe("Axxx");
    expect(samarkanNama("B")).toBe("Bxxx");
  });

  it("fallback ke 'Alumni' bila nama kosong/null", () => {
    expect(samarkanNama(null)).toBe("Alumni");
    expect(samarkanNama(undefined)).toBe("Alumni");
    expect(samarkanNama("  ")).toBe("Alumni");
    expect(samarkanNama("")).toBe("Alumni");
  });
});
