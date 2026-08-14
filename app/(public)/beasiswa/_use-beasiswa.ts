"use client";

import { useEffect, useState } from "react";
import {
  getContent,
  getRekap,
  listDonaturPublik,
  type BeasiswaContent,
  type BeasiswaDonaturPublik,
  type BeasiswaRekap,
} from "@/lib/data/beasiswa";

export type BeasiswaData = {
  content: BeasiswaContent;
  rekap: BeasiswaRekap | null;
  donatur: BeasiswaDonaturPublik[];
};

/**
 * Halaman /beasiswa punya beberapa pulau klien yang butuh data yang sama.
 * Promise di-cache di level modul supaya semuanya berbagi satu kali fetch,
 * bukan memanggil Supabase sekali per komponen.
 */
let cache: Promise<BeasiswaData> | null = null;

function ambil(): Promise<BeasiswaData> {
  cache ??= (async () => {
    const [content, rekap, donatur] = await Promise.all([
      getContent(),
      getRekap(),
      listDonaturPublik(),
    ]);
    return { content, rekap, donatur };
  })();
  return cache;
}

export function useBeasiswa(): { data: BeasiswaData | null; loading: boolean } {
  const [data, setData] = useState<BeasiswaData | null>(null);

  useEffect(() => {
    let batal = false;
    void (async () => {
      try {
        const hasil = await ambil();
        if (!batal) setData(hasil);
      } catch {
        // Biarkan teks bawaan yang tampil kalau gagal memuat.
        if (!batal) setData({ content: {}, rekap: null, donatur: [] });
      }
    })();
    return () => {
      batal = true;
    };
  }, []);

  return { data, loading: data === null };
}
