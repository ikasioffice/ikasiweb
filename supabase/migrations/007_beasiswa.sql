-- Program Beasiswa Alumni IKASI 2026.
--
-- Menggantikan backend Google Apps Script + Google Sheets/Drive dari repo
-- ikasioffice/Beasiswa-Alumni-IKASI-2026. Pemetaan action lama -> objek baru:
--
--   getSiteData/setSiteData        -> beasiswa_settings (singleton id = 1)
--   getContent/setContent          -> beasiswa_content  (key/value)
--   addSubmission                  -> INSERT beasiswa_donasi (anon)
--   getVerifiedSubmissions         -> SELECT beasiswa_donasi_public (view)
--   listSubmissions                -> SELECT beasiswa_donasi (admin)
--   verify/update/deleteSubmission -> UPDATE/DELETE beasiswa_donasi (admin)
--   uploadProposal                 -> bucket storage beasiswa-publik
--   login                          -> dihapus, diganti Supabase Auth + user_roles
--
-- Migration ini MURNI ADITIF: tidak ada ALTER/DROP pada objek yang sudah ada,
-- sehingga pembatalannya cukup drop objek beasiswa_* + hapus kedua bucket.
--
-- Catatan soal cek admin: dipakai bentuk inline `role = 'admin'` seperti
-- 002_wa_groups_admin_write.sql, BUKAN public.is_admin(). is_admin() bernilai
-- true juga untuk role 'editor', sedangkan AdminGuard di aplikasi hanya
-- meloloskan 'admin' -- bentuk inline membuat RLS dan UI sepakat persis.


-- ============================================================
-- 1. SETTINGS (baris tunggal)
-- ============================================================

create table if not exists public.beasiswa_settings (
  id            smallint primary key default 1 check (id = 1),
  target_dana   bigint      not null default 0 check (target_dana >= 0),
  proposal_url  text,
  proposal_name text,
  updated_at    timestamptz not null default now()
);

comment on table public.beasiswa_settings is
  'Pengaturan program beasiswa; selalu tepat satu baris (id = 1).';

insert into public.beasiswa_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists trg_beasiswa_settings_updated_at on public.beasiswa_settings;
create trigger trg_beasiswa_settings_updated_at
  before update on public.beasiswa_settings
  for each row execute function public.set_updated_at();


-- ============================================================
-- 2. CONTENT (key/value)
-- ============================================================
-- Halaman /beasiswa memuat teks default dari TSX, lalu menimpanya dengan baris
-- di sini bila admin pernah mengeditnya. Baris yang tidak ada = pakai default.

create table if not exists public.beasiswa_content (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

comment on table public.beasiswa_content is
  'Teks halaman beasiswa yang bisa ditimpa admin. Key kosong = pakai default di TSX.';

drop trigger if exists trg_beasiswa_content_updated_at on public.beasiswa_content;
create trigger trg_beasiswa_content_updated_at
  before update on public.beasiswa_content
  for each row execute function public.set_updated_at();


-- ============================================================
-- 3. DONASI (bukti dukungan)
-- ============================================================

create table if not exists public.beasiswa_donasi (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  nama             text        not null,
  angkatan         text        not null,
  whatsapp         text,
  nominal          bigint      not null default 0 check (nominal >= 0),
  tanggal_transfer date,
  metode           text,
  catatan          text,
  bukti_path       text,
  is_verified      boolean     not null default false
);

comment on table public.beasiswa_donasi is
  'Bukti dukungan donatur. Memuat PII (whatsapp, catatan, bukti_path) sehingga '
  'TIDAK boleh dibaca anon -- publik hanya lewat view beasiswa_donasi_public.';

create index if not exists beasiswa_donasi_verified_idx
  on public.beasiswa_donasi (is_verified, created_at desc);

drop trigger if exists trg_beasiswa_donasi_updated_at on public.beasiswa_donasi;
create trigger trg_beasiswa_donasi_updated_at
  before update on public.beasiswa_donasi
  for each row execute function public.set_updated_at();


-- ============================================================
-- 4. VIEW PUBLIK
-- ============================================================
-- Sengaja TANPA security_invoker (mengikuti alumni_public, bukan bisnis_public):
-- view berjalan sebagai owner sehingga anon bisa membaca baris terverifikasi
-- tanpa perlu -- dan tanpa pernah diberi -- policy SELECT di tabel aslinya.
-- Kolom PII tidak diikutsertakan.

create or replace view public.beasiswa_donasi_public as
  select id, nama, angkatan, nominal, created_at
  from public.beasiswa_donasi
  where is_verified = true;

comment on view public.beasiswa_donasi_public is
  'Daftar donatur untuk halaman publik: hanya baris terverifikasi, tanpa kolom PII.';

-- Rekap angka hero dalam satu request. dana_terkumpul DIHITUNG dari donasi
-- terverifikasi (bukan kolom manual), meniru perilaku admin GAS yang lama --
-- sehingga angkanya tidak mungkin tidak sinkron dengan daftar donatur.
create or replace view public.beasiswa_rekap as
  select
    s.target_dana,
    coalesce(d.total, 0)::bigint  as dana_terkumpul,
    coalesce(d.jumlah, 0)::bigint as jumlah_donatur,
    s.proposal_url,
    s.proposal_name
  from public.beasiswa_settings s
  left join lateral (
    select sum(nominal) as total, count(*) as jumlah
    from public.beasiswa_donasi
    where is_verified = true
  ) d on true
  where s.id = 1;

comment on view public.beasiswa_rekap is
  'Ringkasan target/terkumpul/jumlah donatur + proposal untuk hero halaman publik.';

revoke all on public.beasiswa_donasi_public from anon, authenticated;
revoke all on public.beasiswa_rekap        from anon, authenticated;
grant select on public.beasiswa_donasi_public to anon, authenticated;
grant select on public.beasiswa_rekap        to anon, authenticated;


-- ============================================================
-- 5. RLS
-- ============================================================
-- Supabase memberi GRANT ALL ke anon/authenticated untuk tabel baru di schema
-- public, jadi RLS-lah satu-satunya gerbang -- persis seperti wa_groups.

alter table public.beasiswa_settings enable row level security;
alter table public.beasiswa_content  enable row level security;
alter table public.beasiswa_donasi   enable row level security;

-- ---------- settings: baca publik, tulis admin ----------

drop policy if exists beasiswa_settings_public_read on public.beasiswa_settings;
create policy beasiswa_settings_public_read
  on public.beasiswa_settings for select to anon, authenticated using (true);

drop policy if exists beasiswa_settings_admin_update on public.beasiswa_settings;
create policy beasiswa_settings_admin_update
  on public.beasiswa_settings for update to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  )
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

-- ---------- content: baca publik, tulis admin ----------

drop policy if exists beasiswa_content_public_read on public.beasiswa_content;
create policy beasiswa_content_public_read
  on public.beasiswa_content for select to anon, authenticated using (true);

drop policy if exists beasiswa_content_admin_insert on public.beasiswa_content;
create policy beasiswa_content_admin_insert
  on public.beasiswa_content for insert to authenticated
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_content_admin_update on public.beasiswa_content;
create policy beasiswa_content_admin_update
  on public.beasiswa_content for update to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  )
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_content_admin_delete on public.beasiswa_content;
create policy beasiswa_content_admin_delete
  on public.beasiswa_content for delete to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

-- ---------- donasi ----------
-- SENGAJA tidak ada policy SELECT untuk anon: baris memuat nomor WhatsApp,
-- catatan, dan path bukti transfer. Publik membaca lewat view saja.
--
-- Konsekuensinya: INSERT ... RETURNING oleh anon akan DITOLAK, karena RETURNING
-- butuh policy SELECT. Di klien, artinya .insert() pada beasiswa_donasi tidak
-- boleh dirangkai dengan .select(). Pesan errornya menyesatkan ("new row
-- violates row-level security policy") padahal WITH CHECK-nya sendiri lolos.

-- Kiriman form publik, dibatasi ketat seperti 003_alumni_self_register.sql:
-- tidak bisa membuat baris yang sudah terverifikasi, dan wajib beridentitas.
drop policy if exists beasiswa_donasi_public_insert on public.beasiswa_donasi;
create policy beasiswa_donasi_public_insert
  on public.beasiswa_donasi for insert to anon, authenticated
  with check (
    is_verified = false
    and nama     is not null and length(btrim(nama))     > 0
    and angkatan is not null and length(btrim(angkatan)) > 0
    and nominal  > 0
  );

drop policy if exists beasiswa_donasi_admin_read on public.beasiswa_donasi;
create policy beasiswa_donasi_admin_read
  on public.beasiswa_donasi for select to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

-- Pencatatan manual oleh admin (transfer langsung/tunai) tanpa batasan di atas.
drop policy if exists beasiswa_donasi_admin_insert on public.beasiswa_donasi;
create policy beasiswa_donasi_admin_insert
  on public.beasiswa_donasi for insert to authenticated
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_donasi_admin_update on public.beasiswa_donasi;
create policy beasiswa_donasi_admin_update
  on public.beasiswa_donasi for update to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  )
  with check (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_donasi_admin_delete on public.beasiswa_donasi;
create policy beasiswa_donasi_admin_delete
  on public.beasiswa_donasi for delete to authenticated
  using (
    exists (select 1 from public.user_roles
            where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );


-- ============================================================
-- 6. STORAGE
-- ============================================================

-- Bukti transfer: PRIVAT. Isinya tangkapan layar mutasi rekening, jadi tidak
-- boleh publik seperti alumni-photos. Admin membacanya lewat signed URL.
insert into storage.buckets (id, name, public, file_size_limit)
values ('beasiswa-bukti', 'beasiswa-bukti', false, 5242880)
on conflict (id) do nothing;

-- Proposal PDF: publik (memang dibagikan ke calon donatur).
insert into storage.buckets (id, name, public, file_size_limit)
values ('beasiswa-publik', 'beasiswa-publik', true, 15728640)
on conflict (id) do nothing;

-- Donatur boleh mengunggah bukti, tapi tidak boleh membacanya kembali.
drop policy if exists beasiswa_bukti_public_upload on storage.objects;
create policy beasiswa_bukti_public_upload
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'beasiswa-bukti');

drop policy if exists beasiswa_bukti_admin_read on storage.objects;
create policy beasiswa_bukti_admin_read
  on storage.objects for select to authenticated
  using (
    bucket_id = 'beasiswa-bukti'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_bukti_admin_delete on storage.objects;
create policy beasiswa_bukti_admin_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'beasiswa-bukti'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

-- Bucket publik: objek tetap terlayani lewat URL publik tanpa policy SELECT,
-- jadi sengaja tidak dibuat (mengikuti 005_security_hardening.sql yang justru
-- MENGHAPUS policy SELECT alumni-photos untuk mencegah enumerasi isi bucket).
drop policy if exists beasiswa_publik_admin_insert on storage.objects;
create policy beasiswa_publik_admin_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'beasiswa-publik'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_publik_admin_update on storage.objects;
create policy beasiswa_publik_admin_update
  on storage.objects for update to authenticated
  using (
    bucket_id = 'beasiswa-publik'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );

drop policy if exists beasiswa_publik_admin_delete on storage.objects;
create policy beasiswa_publik_admin_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'beasiswa-publik'
    and exists (select 1 from public.user_roles
                where user_roles.user_id = auth.uid() and user_roles.role = 'admin')
  );
