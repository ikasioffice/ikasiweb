-- Pendaftaran SALURUN 2026 (Charity Fun Run IKASI POLBAN, 10 Okt 2026).
--
-- Mengikuti pola 007_beasiswa.sql: satu tabel pendaftaran dengan PII (whatsapp,
-- email, bukti_path), publik hanya lewat view tanpa PII, verifikasi manual oleh
-- admin berdasarkan bukti transfer. Bedanya dengan beasiswa: nominal per
-- kategori TETAP (Mahasiswa/Alumni), bukan nominal bebas donatur.
--
-- Migration ini MURNI ADITIF: tidak ada ALTER/DROP pada objek yang sudah ada,
-- sehingga pembatalannya cukup drop objek salurun_* + hapus bucket.
--
-- Catatan cek admin: dipakai bentuk inline `role = 'admin'` seperti
-- 002/007, BUKAN public.is_admin(), agar RLS sepakat persis dengan AdminGuard.


-- ============================================================
-- 1. PENDAFTARAN
-- ============================================================

create table if not exists public.salurun_pendaftaran (
  id           uuid        primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  nama         text        not null,
  kategori     text        not null check (kategori in ('mahasiswa', 'alumni')),
  whatsapp     text        not null,
  email        text,
  ukuran_jersey text       not null check (ukuran_jersey in ('S', 'M', 'L', 'XL', 'XXL')),
  nominal      bigint      not null default 0 check (nominal >= 0),
  bukti_path   text,
  catatan      text,
  is_verified  boolean     not null default false
);

comment on table public.salurun_pendaftaran is
  'Pendaftar SALURUN 2026. Memuat PII (whatsapp, email, bukti_path) sehingga '
  'TIDAK boleh dibaca anon -- publik hanya lewat view salurun_pendaftaran_public.';

create index if not exists salurun_pendaftaran_verified_idx
  on public.salurun_pendaftaran (is_verified, created_at desc);

drop trigger if exists trg_salurun_pendaftaran_updated_at on public.salurun_pendaftaran;
create trigger trg_salurun_pendaftaran_updated_at
  before update on public.salurun_pendaftaran
  for each row execute function public.set_updated_at();


-- ============================================================
-- 2. VIEW PUBLIK & REKAP
-- ============================================================
-- Sengaja TANPA security_invoker (mengikuti alumni_public / beasiswa_donasi_public):
-- view berjalan sebagai owner sehingga anon bisa membaca hitungan pendaftar
-- terverifikasi tanpa perlu -- dan tanpa pernah diberi -- policy SELECT di
-- tabel aslinya. Kolom PII tidak diikutsertakan.

create or replace view public.salurun_rekap as
  select
    coalesce(count(*) filter (where is_verified), 0)::bigint as jumlah_peserta,
    coalesce(count(*) filter (where is_verified and kategori = 'mahasiswa'), 0)::bigint as jumlah_mahasiswa,
    coalesce(count(*) filter (where is_verified and kategori = 'alumni'), 0)::bigint as jumlah_alumni
  from public.salurun_pendaftaran;

comment on view public.salurun_rekap is
  'Ringkasan jumlah peserta terverifikasi untuk halaman publik /salurun.';

revoke all on public.salurun_rekap from anon, authenticated;
grant select on public.salurun_rekap to anon, authenticated;


-- ============================================================
-- 3. RLS
-- ============================================================
-- Supabase memberi GRANT ALL ke anon/authenticated untuk tabel baru di schema
-- public, jadi RLS-lah satu-satunya gerbang -- persis seperti beasiswa_donasi.

alter table public.salurun_pendaftaran enable row level security;

-- SENGAJA tidak ada policy SELECT untuk anon: baris memuat whatsapp, email,
-- dan path bukti transfer. Publik membaca lewat view salurun_rekap saja
-- (hanya hitungan, tanpa daftar nama).
--
-- Konsekuensinya: INSERT ... RETURNING oleh anon akan DITOLAK. Di klien,
-- .insert() pada salurun_pendaftaran tidak boleh dirangkai dengan .select().

drop policy if exists salurun_pendaftaran_public_insert on public.salurun_pendaftaran;
create policy salurun_pendaftaran_public_insert
  on public.salurun_pendaftaran for insert to anon, authenticated
  with check (
    is_verified = false
    and nama          is not null and length(btrim(nama))     > 0
    and whatsapp       is not null and length(btrim(whatsapp)) > 0
    and kategori in ('mahasiswa', 'alumni')
    and ukuran_jersey in ('S', 'M', 'L', 'XL', 'XXL')
    and nominal > 0
  );

drop policy if exists salurun_pendaftaran_admin_read on public.salurun_pendaftaran;
create policy salurun_pendaftaran_admin_read
  on public.salurun_pendaftaran for select to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

-- Pencatatan manual oleh admin (pendaftaran offline/tunai) tanpa batasan di atas.
drop policy if exists salurun_pendaftaran_admin_insert on public.salurun_pendaftaran;
create policy salurun_pendaftaran_admin_insert
  on public.salurun_pendaftaran for insert to authenticated
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists salurun_pendaftaran_admin_update on public.salurun_pendaftaran;
create policy salurun_pendaftaran_admin_update
  on public.salurun_pendaftaran for update to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  )
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists salurun_pendaftaran_admin_delete on public.salurun_pendaftaran;
create policy salurun_pendaftaran_admin_delete
  on public.salurun_pendaftaran for delete to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );


-- ============================================================
-- 4. STORAGE
-- ============================================================

-- Bukti transfer: PRIVAT, sama seperti beasiswa-bukti. Admin membacanya lewat
-- signed URL.
insert into storage.buckets (id, name, public, file_size_limit)
values ('salurun-bukti', 'salurun-bukti', false, 5242880)
on conflict (id) do nothing;

drop policy if exists salurun_bukti_public_upload on storage.objects;
create policy salurun_bukti_public_upload
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'salurun-bukti');

drop policy if exists salurun_bukti_admin_read on storage.objects;
create policy salurun_bukti_admin_read
  on storage.objects for select to authenticated
  using (
    bucket_id = 'salurun-bukti'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists salurun_bukti_admin_delete on storage.objects;
create policy salurun_bukti_admin_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'salurun-bukti'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );
