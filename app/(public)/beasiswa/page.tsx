import type { Metadata } from "next";
import Link from "next/link";
import {
  ANGGARAN_LEDE,
  FAKTA_LEDE,
  INSIGHTS,
  KONTAK_LEDE,
  LATAR_BELAKANG,
  MISI,
  SISTEMATIKA_LEDE,
  TENTANG_PARAGRAF,
  TUJUAN,
  TUJUAN_LEDE,
  VISI,
} from "./_content";
import { DanaDukungan, FaktaCallout, HeroAksi, KontakInfo, TimelineProgres } from "./_sections";

export const metadata: Metadata = {
  title: "Beasiswa Alumni IKASI 2026",
  description:
    "Program Beasiswa Alumni IKASI untuk meringankan tunggakan UKT mahasiswa Teknik Sipil Polban. Terbuka bagi alumni, perusahaan, dan donatur.",
};

const eyebrowCls =
  "inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary";
const h2Cls = "font-heading mt-3 text-2xl font-extrabold tracking-tight";
const cardCls = "rounded-xl border border-border bg-card p-5 shadow-sm";

export default function BeasiswaPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* ---------- Hero ---------- */}
      <nav className="mb-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Beranda</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Beasiswa Alumni</span>
      </nav>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <span className={eyebrowCls}>PROPOSAL KEMITRAAN &amp; DONASI · 2026</span>
          <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Beasiswa <span className="text-primary">Alumni IKASI</span>
          </h1>
          <HeroAksi />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/beasiswa-maskot.png"
          alt=""
          aria-hidden
          className="hidden w-32 shrink-0 select-none sm:block lg:w-40"
        />
      </div>

      {/* ---------- Tentang ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>TENTANG PROGRAM</span>
        <h2 className={h2Cls}>Program Beasiswa Alumni Tahun 2026–2027</h2>

        <div className={`${cardCls} mt-6`}>
          <div className="font-heading font-bold text-foreground">Latar Belakang</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{LATAR_BELAKANG}</p>
        </div>

        <div className="mt-4 space-y-3">
          {TENTANG_PARAGRAF.map((p) => (
            <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-muted-foreground">{p}</p>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className={cardCls}>
            <div className="font-heading font-bold text-foreground">Visi</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{VISI}</p>
          </div>
          <div className={cardCls}>
            <div className="font-heading font-bold text-foreground">Misi</div>
            <ul className="mt-2 space-y-2">
              {MISI.map((m) => (
                <li key={m.slice(0, 30)} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Tujuan ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>TUJUAN PROGRAM</span>
        <h2 className={h2Cls}>Tujuan Program</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{TUJUAN_LEDE}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {TUJUAN.map((t) => (
            <div key={t.num} className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="font-heading flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                {t.num}
              </div>
              <div>
                <div className="font-semibold text-foreground">{t.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Data & Fakta ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>TINGKAT KEBUTUHAN BEASISWA</span>
        <h2 className={h2Cls}>Seberapa besar kebutuhannya?</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{FAKTA_LEDE}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {INSIGHTS.map((ins) => (
            <div key={ins.judul} className={cardCls}>
              <div className="font-heading font-bold text-foreground">{ins.judul}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{ins.sub}</div>
              <ul className="mt-4 space-y-3">
                {ins.items.map((it) => (
                  <li key={it.val}>
                    <div className="font-heading text-xl font-extrabold text-primary">{it.val}</div>
                    <div className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{it.desc}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FaktaCallout />
      </section>

      {/* ---------- Sistematika & Timeline ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>SISTEMATIKA BEASISWA</span>
        <h2 className={h2Cls}>Rencana sistem beasiswa</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{SISTEMATIKA_LEDE}</p>

        <h3 className="font-heading mt-10 text-xl font-extrabold tracking-tight">
          Timeline Program
        </h3>
        <TimelineProgres />
      </section>

      {/* ---------- Anggaran & Dukungan ---------- */}
      <section className="mt-16">
        <span className={eyebrowCls}>PEMASUKAN DANA PROGRAM</span>
        <h2 className={h2Cls}>Update dana terkumpul</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{ANGGARAN_LEDE}</p>
        <DanaDukungan />
      </section>

      {/* ---------- Kontak ---------- */}
      <section className="mt-16 pb-16">
        <span className={eyebrowCls}>KONTAK</span>
        <h2 className={h2Cls}>Mari berdiskusi lebih lanjut</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{KONTAK_LEDE}</p>
        <KontakInfo />
      </section>
    </main>
  );
}
