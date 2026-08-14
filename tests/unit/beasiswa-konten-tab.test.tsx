import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { DEFAULTS } from "@/app/(public)/beasiswa/_content";

// Data layer di-mock supaya tab bisa diuji tanpa Supabase.
const getContent = vi.fn();
const getSettings = vi.fn();
const simpanContent = vi.fn();
const hapusContent = vi.fn();

vi.mock("@/lib/data/beasiswa", () => ({
  getContent: () => getContent(),
  getSettings: () => getSettings(),
  simpanContent: (v: Record<string, string>) => simpanContent(v),
  hapusContent: (k: string[]) => hapusContent(k),
  unggahProposal: vi.fn(),
}));

const { KontenTab } = await import("@/app/(admin)/admin/beasiswa/_konten-tab");

function inputUntuk(key: string): HTMLInputElement | HTMLTextAreaElement {
  return document.getElementById(key) as HTMLInputElement | HTMLTextAreaElement;
}

async function renderTab() {
  render(<KontenTab />);
  await waitFor(() => expect(inputUntuk("hero_eyebrow")).toBeTruthy());
}

beforeEach(() => {
  vi.clearAllMocks();
  getSettings.mockResolvedValue(null);
  simpanContent.mockResolvedValue({ error: null });
  hapusContent.mockResolvedValue({ error: null });
});

describe("KontenTab — pengisian awal", () => {
  it("mengisi field dengan teks bawaan saat belum ada override", async () => {
    getContent.mockResolvedValue({});
    await renderTab();

    // Ini inti perbaikannya: dulu kotaknya kosong sehingga admin harus
    // mengetik ulang dari nol dan tidak bisa melihat teks yang sedang tampil.
    expect(inputUntuk("hero_eyebrow").value).toBe(DEFAULTS.hero_eyebrow);
    expect(inputUntuk("tentang_latar_isi").value).toBe(DEFAULTS.tentang_latar_isi);
    expect(inputUntuk("timeline_items").value).toBe(DEFAULTS.timeline_items);
  });

  it("tidak menyisakan field kosong selain yang bawaannya memang kosong", async () => {
    getContent.mockResolvedValue({});
    await renderTab();

    const kosong = Object.keys(DEFAULTS).filter((k) => {
      const el = inputUntuk(k);
      return el && el.value.trim() === "" && (DEFAULTS[k] ?? "").trim() !== "";
    });
    expect(kosong).toEqual([]);
  });

  it("menampilkan override admin, bukan bawaannya", async () => {
    getContent.mockResolvedValue({ hero_eyebrow: "Kampanye Khusus" });
    await renderTab();
    expect(inputUntuk("hero_eyebrow").value).toBe("Kampanye Khusus");
  });
});

describe("KontenTab — tanda diubah", () => {
  it("tidak menandai apa pun saat semua masih bawaan", async () => {
    getContent.mockResolvedValue({});
    await renderTab();
    expect(screen.queryAllByTitle("Berbeda dari teks bawaan")).toHaveLength(0);
  });

  it("menandai field yang berbeda dari bawaan", async () => {
    getContent.mockResolvedValue({ hero_eyebrow: "Kampanye Khusus" });
    await renderTab();
    expect(screen.getAllByTitle("Berbeda dari teks bawaan")).toHaveLength(1);
  });

  it("tombol kembalikan mengisi ulang field dengan bawaannya", async () => {
    getContent.mockResolvedValue({ hero_eyebrow: "Kampanye Khusus" });
    await renderTab();

    fireEvent.click(screen.getByText("kembalikan ke bawaan"));
    await waitFor(() => expect(inputUntuk("hero_eyebrow").value).toBe(DEFAULTS.hero_eyebrow));
    expect(screen.queryAllByTitle("Berbeda dari teks bawaan")).toHaveLength(0);
  });
});

describe("KontenTab — penyimpanan", () => {
  it("hanya menyimpan field yang berbeda dari bawaan", async () => {
    getContent.mockResolvedValue({});
    await renderTab();

    fireEvent.change(inputUntuk("hero_eyebrow"), { target: { value: "Donasi Akbar 2027" } });
    fireEvent.click(screen.getByRole("button", { name: /Simpan Perubahan/ }));

    await waitFor(() => expect(simpanContent).toHaveBeenCalled());
    // Bukan 53 field sekaligus -- hanya yang benar-benar diubah.
    expect(simpanContent.mock.calls[0][0]).toEqual({ hero_eyebrow: "Donasi Akbar 2027" });
  });

  it("tidak menyimpan apa pun bila tidak ada yang diubah", async () => {
    getContent.mockResolvedValue({});
    await renderTab();

    fireEvent.click(screen.getByRole("button", { name: /Simpan Perubahan/ }));
    await waitFor(() => expect(simpanContent).toHaveBeenCalled());
    expect(simpanContent.mock.calls[0][0]).toEqual({});
  });

  it("menghapus baris override saat field dikembalikan ke bawaan", async () => {
    getContent.mockResolvedValue({ hero_eyebrow: "Kampanye Khusus" });
    await renderTab();

    fireEvent.change(inputUntuk("hero_eyebrow"), {
      target: { value: DEFAULTS.hero_eyebrow },
    });
    fireEvent.click(screen.getByRole("button", { name: /Simpan Perubahan/ }));

    await waitFor(() => expect(hapusContent).toHaveBeenCalled());
    expect(hapusContent.mock.calls[0][0]).toContain("hero_eyebrow");
    expect(simpanContent.mock.calls[0][0]).toEqual({});
  });

  it("tidak menghapus key yang memang belum pernah tersimpan", async () => {
    getContent.mockResolvedValue({});
    await renderTab();

    fireEvent.click(screen.getByRole("button", { name: /Simpan Perubahan/ }));
    await waitFor(() => expect(hapusContent).toHaveBeenCalled());
    expect(hapusContent.mock.calls[0][0]).toEqual([]);
  });
});
