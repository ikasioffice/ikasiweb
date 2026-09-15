"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineIcon } from "@/components/ui/icons";
import { StatBlock } from "@/components/ui/stat-block";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import {
  BIAYA,
  KATEGORI_LABEL,
  formatRupiah,
  getRekap,
  listPesertaPublik,
  type Kategori,
  type SalurunPesertaPublik,
  type SalurunRekap,
} from "@/lib/data/salurun";

const eyebrowCls =
  "inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary";
const h2Cls = "font-heading mt-3 text-2xl font-extrabold tracking-tight";
const cardCls = "rounded-xl border border-border bg-card p-5 shadow-sm";
const ctaPrimary =
  "inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";
const ctaSecondary =
  "inline-flex h-11 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent";

const PILAR = [
  { judul: "Sport", desc: "Sehat Bersama" },
  { judul: "Silaturahmi", desc: "Kuatkan Ikatan" },
  { judul: "Aksi Sosial", desc: "Salurkan Kebaikan" },
  { judul: "Dampak Nyata", desc: "Untuk Masa Depan" },
];

const RUNDOWN = [
  { waktu: "06.00 – 07.00", judul: "Pengambilan Race Pack & Administrasi" },
  { waktu: "07.00 – 07.15", judul: "Pemanasan" },
  { waktu: "07.15 – 07.20", judul: "Foto Bersama" },
  { waktu: "07.20 – 08.20", judul: "Fun Run 4,4 K" },
  { waktu: "08.20 – 08.30", judul: "Pelemasan" },
  { waktu: "08.30 – 11.00", judul: "Talk Show, Games, Penyerahan Beasiswa" },
];

const TUJUAN = [
  "Memperingati Hari Ulang Tahun HIMAS POLBAN ke-44 sebagai momentum kebersamaan keluarga besar Teknik Sipil POLBAN.",
  "Mempererat silaturahmi dan kolaborasi antara alumni, mahasiswa, dosen, serta sivitas Teknik Sipil POLBAN.",
  "Menggalang dana beasiswa dari alumni dan peserta untuk mendukung mahasiswa Teknik Sipil POLBAN yang membutuhkan.",
  "Menumbuhkan semangat kepedulian sosial dan budaya giving back kepada almamater.",
  "Mendorong gaya hidup sehat melalui kegiatan lari yang inklusif dan dapat diikuti berbagai kalangan.",
];

export function IsiSalurun() {
  const [rekap, setRekap] = useState<SalurunRekap | null>(null);
  const [peserta, setPeserta] = useState<SalurunPesertaPublik[] | null>(null);
  const [halaman, setHalaman] = useState(1);
  const PER_HALAMAN = 20;

  useEffect(() => {
    getRekap().then(setRekap);
    listPesertaPublik().then(setPeserta);
  }, []);

  const totalHalaman = Math.max(1, Math.ceil((peserta?.length ?? 0) / PER_HALAMAN));
  const pesertaHalaman = (peserta ?? []).slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  return (
    <>
      {/* ---------- Banner Poster ---------- */}
      <div className="relative mb-8 flex justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/salurun-poster-v2.jpg"
          alt="Poster SALURUN 2026 — Charity Fun Run IKASI POLBAN, Minggu 11 Oktober 2026"
          className="max-h-[720px] w-auto max-w-full object-contain"
        />
      </div>

      {/* ---------- Hero ---------- */}
      <span className={eyebrowCls}>Charity Fun Run · 44 Tahun HIMAS POLBAN</span>
      <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        SALURUN <span className="text-primary">2026</span>
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Melangkah bersama, menyalurkan kebaikan. Charity fun run oleh IKASI POLBAN dalam rangka
        memperingati 44 Tahun Himpunan Mahasiswa Sipil (HIMAS POLBAN).
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/salurun/daftar" className={ctaPrimary}>
          Daftar Sekarang
        </Link>
        <a href="https://wa.me/6281234681730" target="_blank" rel="noopener noreferrer" className={ctaSecondary}>
          Tanya Panitia
        </a>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
        <LineIcon name="calendar" size={14} />
        Pendaftaran ditutup 1 Oktober 2026 — jangan sampai terlewat!
      </div>

      {/* ---------- Stat peserta ---------- */}
      <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <StatBlock value={rekap ? rekap.jumlah_peserta ?? 0 : null} label="Total Peserta" />
        <StatBlock value={rekap ? rekap.jumlah_mahasiswa ?? 0 : null} label="Mahasiswa" />
        <StatBlock value={rekap ? rekap.jumlah_alumni ?? 0 : null} label="Alumni" />
      </div>

      {/* ---------- Waktu & Lokasi ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>Waktu &amp; Lokasi</span>
        <h2 className={h2Cls}>Detail Acara</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className={cardCls}>
            <LineIcon name="calendar" size={20} className="text-primary" />
            <div className="mt-2 font-heading font-bold text-foreground">Minggu, 11 Oktober 2026</div>
            <div className="mt-1 text-sm text-muted-foreground">06.00 – Selesai</div>
          </div>
          <div className={cardCls}>
            <LineIcon name="pin" size={20} className="text-primary" />
            <div className="mt-2 font-heading font-bold text-foreground">Kota Bandung</div>
            <div className="mt-1 text-sm text-muted-foreground">Satu kota, sejuta langkah kebaikan</div>
          </div>
          <div className={cardCls}>
            <LineIcon name="users" size={20} className="text-primary" />
            <div className="mt-2 font-heading font-bold text-foreground">Fun Run 4,4 K</div>
            <div className="mt-1 text-sm text-muted-foreground">Terbuka untuk mahasiswa &amp; alumni</div>
          </div>
        </div>
      </section>

      {/* ---------- Rundown ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>Susunan Acara</span>
        <h2 className={h2Cls}>Rundown Kegiatan</h2>
        <div className="mt-6 space-y-3">
          {RUNDOWN.map((r) => (
            <div key={r.waktu} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="w-28 shrink-0 text-sm font-semibold text-primary tabular-nums">{r.waktu}</div>
              <div className="text-sm text-foreground">{r.judul}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Tujuan ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>Maksud &amp; Tujuan</span>
        <h2 className={h2Cls}>Kenapa SALURUN?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Kegiatan SALURUN 2026 diselenggarakan oleh IKASI POLBAN sebagai rangkaian peringatan
          44 Tahun HIMAS POLBAN — media untuk mempererat silaturahmi keluarga besar Teknik Sipil
          POLBAN sekaligus mewujudkan kepedulian alumni melalui penggalangan dana beasiswa bagi
          mahasiswa.
        </p>
        <ol className="mt-5 space-y-3">
          {TUJUAN.map((t, i) => (
            <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Empat Pilar ---------- */}
      <section className="mt-16">
        <div className="grid gap-4 sm:grid-cols-4">
          {PILAR.map((p) => (
            <div key={p.judul} className={`${cardCls} text-center`}>
              <div className="font-heading font-bold text-foreground">{p.judul}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Daftar Peserta ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>Peserta Terdaftar</span>
        <h2 className={h2Cls}>Sudah Bergabung</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Daftar peserta yang pendaftarannya sudah terverifikasi panitia.
        </p>
        <div className="mt-6">
          {peserta === null ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg border border-border bg-muted" />
              ))}
            </div>
          ) : peserta.length === 0 ? (
            <EmptyState
              title="Belum ada peserta terverifikasi"
              description="Jadilah yang pertama mendaftar SALURUN 2026!"
              icon={<LineIcon name="users" size={24} />}
            />
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-accent/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Angkatan</th>
                      <th className="px-4 py-3 font-semibold">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pesertaHalaman.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium text-foreground">{p.nama}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.angkatan}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.kategori ? KATEGORI_LABEL[p.kategori as Kategori] ?? p.kategori : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={halaman} totalPages={totalHalaman} onPage={setHalaman} className="mt-5" />
            </>
          )}
        </div>
      </section>

      {/* ---------- Biaya Pendaftaran ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>Pendaftaran</span>
        <h2 className={h2Cls}>Kategori &amp; Biaya</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Periode pendaftaran: 10 September – 1 Oktober 2026. Biaya sudah termasuk jersey resmi
          SALURUN + refreshment. Pembayaran bisa lewat transfer bank atau QRIS resmi IKASI POLBAN.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(Object.keys(BIAYA) as Array<keyof typeof BIAYA>).map((k) => (
            <div key={k} className={cardCls}>
              <div className="font-heading font-bold text-foreground">{KATEGORI_LABEL[k]}</div>
              <div className="mt-2 font-heading text-2xl font-extrabold tabular-nums text-primary">
                {formatRupiah(BIAYA[k])}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Jersey + Refreshment</div>
            </div>
          ))}
        </div>

        {/* Panduan ukuran jersey */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="font-heading font-bold text-foreground">Panduan Ukuran Jersey</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Unisex cutting, ukuran dalam sentimeter. Bandingkan dengan jersey milik Anda untuk hasil terbaik.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/salurun-size-chart.jpg"
            alt="Panduan ukuran jersey SALURUN 2026 (S, M, L, XL, XXL)"
            className="mx-auto mt-4 w-full max-w-sm rounded-lg"
          />
        </div>

        <div className="mt-6">
          <Link href="/salurun/daftar" className={ctaPrimary}>
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
