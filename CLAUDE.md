# ikasiweb — deploy workflow (read this before touching deploy/Hostinger)

Next.js 16 app (static export, `output: "export"` in `next.config.ts`), Supabase
backend, hosted on Hostinger shared hosting at `ikasipolban.com`
(hPanel username `u659584212`). CI lives in `.github/workflows/`.

## Known issue (as of 2026-08-12)

Hostinger's deploy-trigger endpoint
(`POST /api/hosting/v1/accounts/{user}/websites/{domain}/deploy`, called from
`.github/hostinger-deploy/deploy.mjs`) intermittently/persistently returns
`500 [Hosting:9999] Request failed`, even though auth, username resolution,
and archive upload all succeed. Other Hostinger API endpoints (`is-empty`,
`websites` list) respond normally — this is isolated to the deploy-trigger
call, confirmed not a token/account/quota problem (account active, disk
0.37/50GB, no leftover files). Root cause is on Hostinger's side; contact
their support if it needs escalating. Do not assume it has silently fixed
itself — verify with a real run before telling the user auto-deploy works
again.

## THE DEPLOY FLOW — treat as an absolute rule until the Hostinger issue above is resolved

When the user wants to ship a code change to production, follow exactly this
division of labor. Do not skip straight to "just push and it's live" — it
is currently NOT fully automatic.

| # | Step | Who |
|---|------|-----|
| 1 | Implement the code change | **Claude** (when asked) |
| 2 | Commit + push to `main` | **Claude** |
| 3 | GitHub Actions build (`deploy.yml`, "Build check") runs automatically | Automatic — Claude monitors via `actions_list`/`get_job_logs` |
| 4 | Actions attempts the Hostinger API deploy step — currently fails (500) | Automatic (expected to fail); Claude reports the failure, does not silently retry-loop |
| 5 | Download the `out` artifact from the GitHub Actions run that just built | **User** — Claude cannot download it (sandbox network egress is blocked to GitHub's artifact/blob storage domains) |
| 6 | Log into hPanel → File Manager → extract/upload the artifact into `public_html`, overwriting old files | **User** — Claude has no Hostinger login credentials |
| 7 | Verify the live site picked up the change | **Claude** — trigger the `check-live-site.yml` workflow (`workflow_dispatch` on `main`) and read the `last-modified` header / body snippet from the job log to confirm the deploy landed |

Steps 1–4 and 7 are Claude's job end-to-end. Steps 5–6 are the user's job —
tell them clearly what to do (which Actions run URL, which folder in File
Manager) rather than assuming they know.

**Do not attempt to build the site locally in this sandbox to hand the user
a zip.** `generateStaticParams()` in `app/(public)/alumni/[id]/page.tsx`
fetches from Supabase at build time, and this sandbox's egress proxy blocks
`*.supabase.co` — local builds fail here even though they succeed in GitHub
Actions. Always source the artifact from the Actions run, not a local build.

## Diagnostic workflows available (all `workflow_dispatch`, must be run with `ref: main`)

- `.github/workflows/check-deploy-status.yml` — calls Hostinger's `is-empty`
  endpoint for a domain (sanity-checks the account/API token independent of
  the deploy endpoint).
- `.github/workflows/check-domain.yml` — looks up a domain via Hostinger's
  `websites` endpoint.
- `.github/workflows/check-live-site.yml` — curls a live URL (default
  `https://ikasipolban.com/`) and prints response headers + first 3000
  chars of body. This is the step-7 verification tool — check the
  `last-modified` header against the timestamp of the build you expect to
  be live.

Note: `workflow_dispatch` via the API only works for workflow files present
on the repository's default branch (`main`) — pushing a new/edited workflow
to a feature branch is not enough to dispatch it.

## Once Hostinger fixes the deploy endpoint

Re-test by dispatching `deploy.yml` (or waiting for a natural push to
`main`) and confirming the "Deploy to Hostinger" step succeeds twice in a
row. Once confirmed, steps 5–6 above collapse away — push to `main` becomes
fully automatic (1–4 only) and this file's flow table should be updated to
drop the manual steps.
