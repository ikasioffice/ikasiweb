-- Defense-in-depth: kurangi permukaan RPC yang terekspos (advisor 0028/0029).

-- Fungsi trigger tidak boleh dipanggil via REST/RPC. Trigger tetap berjalan
-- karena eksekusi trigger tidak butuh privilege EXECUTE dari role pemanggil.
revoke all on function public.auto_link_alumni_on_auth() from public, anon, authenticated;
revoke all on function public.alumni_guard_protected_columns() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.update_rsvp_count() from public, anon, authenticated;

-- Fungsi admin_* hanya relevan untuk user login (admin). Cabut dari anon.
-- (Tetap aman walau dipanggil: ada cek is_admin() di dalamnya.)
revoke all on function public.admin_delete_alumni(uuid, text, jsonb) from anon;
revoke all on function public.admin_list_alumni() from anon;
revoke all on function public.admin_reassign_bisnis(uuid, uuid) from anon;
revoke all on function public.admin_restore_alumni(uuid) from anon;
