# Deploying to Railway (CLI workflow)

You'll create one Railway project with three services:

1. **Postgres** (Railway plugin)
2. **MinIO** (empty service running the `minio/minio` image)
3. **app** (this repo — builds the SPA into the Go binary)

The frontend is a Vite build (CSR) that gets embedded into the Go server via
`//go:embed`, so you deploy **one** container. `build.sh` (or the multi-stage
Dockerfile — Railway uses the Dockerfile automatically) handles the dist.

---

## 0. Install the Railway CLI

```bash
# macOS
brew install railway

# Linux (or the universal installer)
curl -fsSL https://railway.app/install.sh | sh

# then log in
railway login
```

---

## 1. Create the project

From the repo root (`/home/aadesh-kumar/Documents/work/client_project/dance_website`):

```bash
railway init
```

Give it a name (e.g. `lldance`). This creates an empty project and links
the current directory to it.

---

## 2. Add Postgres

```bash
railway add --database postgres
```

Wait for it to provision (a few seconds). Confirm:

```bash
railway service   # list services — you should see Postgres
```

---

## 3. Add MinIO

There's no MinIO template in the CLI, so create it in the dashboard:

```bash
railway open   # opens the project in the browser
```

In the dashboard for your project:

1. **+ New** → **Empty Service** → name it `minio`.
2. Open the `minio` service → **Settings**:
   - **Source** → **Image**: `minio/minio:latest`
   - **Start Command**: `server /data --console-address ":9001"`
   - **Volumes** → add one, mount path `/data`
3. **Variables** tab, add:
   ```
   MINIO_ROOT_USER=minioadmin
   MINIO_ROOT_PASSWORD=<pick a strong password>
   ```
4. **Settings → Networking** → **Generate Domain** with target port **9000**.
   Copy that URL — you need it in the next step.
5. Deploy. Wait until it's green.

---

## 4. Create the `app` service and set its variables

Back in the terminal, at repo root:

```bash
# Create a new empty service in the same project
railway add --service app

# Attach the shell to that service so subsequent commands target it
railway service app
```

Now set all the environment variables. `${{Postgres.PGHOST}}` and friends are
Railway variable references — they resolve automatically at deploy time.

```bash
railway variables \
  --set "PORT=8080" \
  --set "ENV=production" \
  --set 'DB_HOST=${{Postgres.PGHOST}}' \
  --set 'DB_PORT=${{Postgres.PGPORT}}' \
  --set 'DB_USER=${{Postgres.PGUSER}}' \
  --set 'DB_PASSWORD=${{Postgres.PGPASSWORD}}' \
  --set 'DB_NAME=${{Postgres.PGDATABASE}}' \
  --set "DB_SCHEMA=public" \
  --set "JWT_SECRET=$(openssl rand -hex 32)" \
  --set "ADMIN_USERNAME=admin" \
  --set "ADMIN_PASSWORD=<pick a strong admin password>" \
  --set "MINIO_ENDPOINT=minio.railway.internal:9000" \
  --set 'MINIO_ACCESS_KEY=${{minio.MINIO_ROOT_USER}}' \
  --set 'MINIO_SECRET_KEY=${{minio.MINIO_ROOT_PASSWORD}}' \
  --set "MINIO_BUCKET=lldance" \
  --set "MINIO_PUBLIC_URL=<the public MinIO URL from step 3.4>" \
  --set "MINIO_USE_SSL=false" \
  --set "ASSETS_DIR=/app/assets"
```

Notes:
- `minio.railway.internal:9000` is the **private** hostname — used for
  server-side uploads from the app.
- `MINIO_PUBLIC_URL` is what browsers use to download images/videos. It
  must be the public domain you generated in step 3.4 (looks like
  `https://minio-production-xxxx.up.railway.app`). Include `https://`.
- If your MinIO domain uses HTTPS *and* the endpoint reference should also
  use HTTPS internally, set `MINIO_USE_SSL=true`. Railway's internal
  network is unencrypted, so `false` is correct for the internal endpoint.

---

## 5. Give the app a public domain

```bash
railway domain
```

That prints the URL your users will hit. Note it.

---

## 6. Deploy

```bash
railway up
```

This uploads the current directory, kicks off the Docker build on Railway,
and streams logs. First deploy is ~3–5 minutes (Node install + Vite build +
Go build + assets copy).

Watch for:

```
Running migrations...
Connected to database: postgres
All models migrated successfully
Seeded site settings
Seeded courses
Seeded pricing
Asset seed: 30 images, 6 videos uploaded
Starting server...
Server running on :8080
```

When it says "Deployment successful", the site is live.

---

## 7. Smoke-test

```bash
APP=$(railway domain | tail -1)      # or paste your app URL manually
curl "$APP/api/health"
curl "$APP/api/public/site" | head -c 400
```

Then in a browser:

- `https://<app>/` — public site with the seeded photos and reels
- `https://<app>/admin` — log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- Upload a new photo from admin → check it appears on the site

---

## Subsequent deploys

After any code change:

```bash
railway up
```

That's it. The migration is idempotent — it won't re-seed or duplicate rows.

If you're happier working from git:

```bash
git push          # push to GitHub
# Railway can also auto-deploy on push if you connect the repo in the dashboard
```

---

## Common issues

| Problem | Fix |
|---|---|
| `railway up` says "no service linked" | Run `railway service app` to attach the current dir to the `app` service. |
| Build fails on `npm ci` | Make sure `dance-studio/package-lock.json` is committed. Regenerate locally with `cd dance-studio && npm install` and commit. |
| App boots but images 404 in the browser | `MINIO_PUBLIC_URL` is wrong or MinIO's 9000 port isn't publicly exposed. Re-check step 3.4 and the `MINIO_PUBLIC_URL` value. |
| App boots but `/api/public/site` shows empty gallery/reels | Asset seed was skipped (MinIO wasn't reachable). Fix `MINIO_ENDPOINT` (internal host + port 9000) and redeploy — but note the seed only runs when both tables are empty, so you may need to `TRUNCATE gallery_items, reels;` via the Postgres console first. |
| `/admin/login` returns 401 | The `ADMIN_USERNAME` / `ADMIN_PASSWORD` values you entered don't match what you typed in the browser. |
| CORS errors | Shouldn't happen — same-origin. If you're calling the API from a different domain, adjust `internal/middleware/cors.go`. |

---

## Local dev vs Railway — quick reference

| | Local (docker compose) | Railway |
|---|---|---|
| Postgres | `postgres` container | Railway Postgres plugin |
| MinIO | `minio` container | `minio` service |
| Backend + SPA | `backend` container (from Dockerfile) | `app` service (from Dockerfile) |
| Frontend dev server | `npm run dev` in `dance-studio/` — hits backend at :8080 | not used; frontend is served by Go |
| `.env` file | present at repo root, read by godotenv | NOT uploaded; env vars set on the service |

The very same Dockerfile is used in both places, so if it works locally it works on Railway.
