-- Lindungi PII alumni (temuan security review).
-- Sebelumnya: policy alumni_authenticated_read USING (true) → SEMUA user login
-- (siapa pun yg punya akun Google/magic-link) bisa membaca email, no_hp, dan
-- tanggal_lahir SELURUH alumni. Ini kebocoran data massal.
--
-- Sekarang:
--   - Baca langsung tabel alumni hanya untuk baris milik sendiri atau admin
--     (melindungi no_hp/tanggal_lahir/email dari pembacaan massal).
--   - Alumni terverifikasi & admin tetap bisa mengambil EMAIL alumni lain
--     (untuk fitur kontak di direktori) via fungsi get_alumni_email — TIDAK no_hp.
--   - Publik/anon membaca direktori lewat view alumni_public (kolom kurasi, tanpa kontak).

drop policy if exists alumni_authenticated_read on public.alumni;
create policy alumni_authenticated_read on public.alumni
  for select to authenticated
  using (auth_user_id = auth.uid() or public.is_admin());

create or replace function public.get_alumni_email(p_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
           when public.is_verified_alumni() or public.is_admin()
           then (select a.email from public.alumni a where a.id = p_id)
           else null
         end;
$$;

revoke all on function public.get_alumni_email(uuid) from public, anon;
grant execute on function public.get_alumni_email(uuid) to authenticated;
