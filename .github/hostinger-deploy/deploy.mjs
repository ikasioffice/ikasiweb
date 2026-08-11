// Deploys a static site archive to Hostinger, replicating the flow used by
// Hostinger's own "hosting_deployStaticWebsite" API tool:
//   1. GET  /api/hosting/v1/websites?domain=...        -> resolve username
//   2. POST /api/hosting/v1/files/upload-urls          -> get upload credentials
//   3. TUS resumable upload of the archive to that URL
//   4. POST /api/hosting/v1/accounts/{user}/websites/{domain}/deploy
//
// Required env vars: HOSTINGER_API_TOKEN, DOMAIN, ARCHIVE_PATH

import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import * as tus from "tus-js-client";

const BASE_URL = "https://developers.hostinger.com";
const { HOSTINGER_API_TOKEN, DOMAIN, ARCHIVE_PATH } = process.env;

function requireEnv(name, value) {
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

requireEnv("HOSTINGER_API_TOKEN", HOSTINGER_API_TOKEN);
requireEnv("DOMAIN", DOMAIN);
requireEnv("ARCHIVE_PATH", ARCHIVE_PATH);

if (!fs.existsSync(ARCHIVE_PATH)) {
  console.error(`Archive not found: ${ARCHIVE_PATH}`);
  process.exit(1);
}

const authHeaders = { Authorization: `Bearer ${HOSTINGER_API_TOKEN}` };

async function resolveUsername(domain) {
  const url = `${BASE_URL}/api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`;
  const res = await axios.get(url, { headers: authHeaders, timeout: 60000 });
  const entry = res.data?.data?.[0];
  if (!entry?.username) {
    throw new Error(`Could not resolve username for domain ${domain}: ${JSON.stringify(res.data)}`);
  }
  return entry.username;
}

async function fetchUploadCredentials(username, domain) {
  const url = `${BASE_URL}/api/hosting/v1/files/upload-urls`;
  const res = await axios.post(
    url,
    { username, domain },
    { headers: { ...authHeaders, "Content-Type": "application/json" }, timeout: 60000 },
  );
  const { url: uploadUrl, auth_key: authKey, rest_auth_key: restAuthKey } = res.data ?? {};
  if (!uploadUrl || !authKey || !restAuthKey) {
    throw new Error(`Invalid upload credentials response: ${JSON.stringify(res.data)}`);
  }
  return { uploadUrl, authKey, restAuthKey };
}

async function uploadArchive(archivePath, uploadUrl, authKey, restAuthKey) {
  const stats = fs.statSync(archivePath);
  const basename = path.basename(archivePath);
  const cleanUploadUrl = uploadUrl.replace(/\/$/, "");
  const uploadUrlWithFile = `${cleanUploadUrl}/${basename}?override=true`;

  const headers = {
    "X-Auth": authKey,
    "X-Auth-Rest": restAuthKey,
    "upload-length": String(stats.size),
    "upload-offset": "0",
  };

  await axios.post(uploadUrlWithFile, "", {
    headers,
    timeout: 60000,
    validateStatus: (status) => status === 201,
  });

  await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(archivePath);
    const upload = new tus.Upload(fileStream, {
      uploadUrl: uploadUrlWithFile,
      retryDelays: [1000, 2000, 4000, 8000, 16000, 20000],
      uploadDataDuringCreation: false,
      parallelUploads: 1,
      chunkSize: 10 * 1024 * 1024,
      headers,
      removeFingerprintOnSuccess: true,
      uploadSize: stats.size,
      metadata: { filename: basename },
      onError: reject,
      onSuccess: () => resolve(),
    });
    upload.start();
  });

  return basename;
}

async function triggerDeploy(username, domain, archiveBasename) {
  const url = `${BASE_URL}/api/hosting/v1/accounts/${username}/websites/${domain}/deploy`;
  const res = await axios.post(
    url,
    { archive_path: archiveBasename },
    { headers: { ...authHeaders, "Content-Type": "application/json" }, timeout: 60000 },
  );
  return res.data;
}

async function main() {
  console.log(`Resolving username for ${DOMAIN}...`);
  const username = await resolveUsername(DOMAIN);
  console.log(`Username: ${username}`);

  console.log("Fetching upload credentials...");
  const { uploadUrl, authKey, restAuthKey } = await fetchUploadCredentials(username, DOMAIN);

  console.log(`Uploading ${ARCHIVE_PATH}...`);
  const archiveBasename = await uploadArchive(ARCHIVE_PATH, uploadUrl, authKey, restAuthKey);
  console.log("Upload complete.");

  console.log("Triggering deployment...");
  const result = await triggerDeploy(username, DOMAIN, archiveBasename);
  console.log("Deploy triggered:", JSON.stringify(result));
}

main().catch((err) => {
  console.error("Deploy failed:", err.response?.data ?? err.message ?? err);
  process.exit(1);
});
