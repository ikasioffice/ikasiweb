-- Hardening lanjutan (temuan security review).

-- #2 Cegah alumni memverifikasi/menaikkan status dirinya sendiri.
-- Policy alumni_self_update mengizinkan pemilik baris mengubah semua kolom;
-- trigger ini mengunci kolom yang HANYA boleh diubah admin untuk user non-admin.
create or replace function public.alumni_guard_protected_columns()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if public.is_admin() or auth.uid() is null then
    return new;
  end if;
  new.is_verified        := old.is_verified;
  new.nomor_anggota      := old.nomor_anggota;
  new.has_nomor_anggota  := old.has_nomor_anggota;
  new.has_kta            := old.has_kta;
  new.kta_kategori       := old.kta_kategori;
  new.kta_status         := old.kta_status;
  new.kta_nominal        := old.kta_nominal;
  new.kta_tanggal        := old.kta_tanggal;
  new.kta_pengambilan    := old.kta_pengambilan;
  new.source_layer       := old.source_layer;
  return new;
end;
$$;

drop trigger if exists trg_alumni_guard_protected on public.alumni;
create trigger trg_alumni_guard_protected
  before update on public.alumni
  for each row execute function public.alumni_guard_protected_columns();

-- Hardening: pin search_path pada fungsi SECURITY DEFINER (advisor 0011).
alter function public.is_admin() set search_path = public, pg_temp;
alter function public.is_verified_alumni() set search_path = public, pg_temp;
alter function public.auto_link_alumni_on_auth() set search_path = public, pg_temp;
alter function public.set_updated_at() set search_path = public, pg_temp;
alter function public.update_rsvp_count() set search_path = public, pg_temp;

-- Stop enumerasi seluruh isi bucket foto (advisor 0025).
-- Bucket publik → URL objek tetap jalan tanpa policy SELECT ini.
drop policy if exists alumni_photos_public_read on storage.objects;
