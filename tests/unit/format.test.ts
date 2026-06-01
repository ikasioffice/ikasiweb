import { describe, expect, it } from "vitest";
import { formatName } from "@/lib/format";

describe("formatName", () => {
  it("mengubah ALL CAPS jadi Title Case", () => {
    expect(formatName("AJENG MELIANA RIZKY")).toBe("Ajeng Meliana Rizky");
  });
  it("mempertahankan Title Case yang sudah benar", () => {
    expect(formatName("Heni Nuraeni")).toBe("Heni Nuraeni");
  });
  it("merapikan spasi berlebih", () => {
    expect(formatName("  budi   santoso ")).toBe("Budi Santoso");
  });
  it("aman untuk string kosong/null", () => {
    expect(formatName("")).toBe("");
    expect(formatName(null)).toBe("");
    expect(formatName(undefined)).toBe("");
  });
});
