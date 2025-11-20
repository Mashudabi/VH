# Deploy Backend to Railway and Frontend to Vercel

This document contains safe, copy-pasteable steps to deploy the backend to Railway and the frontend (static `public/` folder) to Vercel, and to verify they are connected.

Important: You will need credentials and project/service IDs. Do NOT commit secrets. Use the Railway and Vercel dashboards or CLI to add secrets/environment variables.

---

## Quick manual flow (recommended for first-time)

1. Push code to your repository's `main` branch.

2. Deploy backend to Railway (recommended via Railway dashboard):
   - Go to https://railway.app -> New Project -> Deploy from GitHub -> Connect your repo.
   - Branch: `main`
   - Start Command: `npm start`
   - Railway will install dependencies automatically during build.
   - Set environment variables in the Railway project settings:
     - `FRONTEND_URL` = `https://<your-vercel-site>.vercel.app` (set after you deploy frontend)
     - (Optional) `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` if you enable Cloudinary features.
   - Deploy and copy the service URL (e.g. `https://<your-service>.up.railway.app` or `https://<your-service>.railway.app`).

3. Point frontend to backend by ensuring your frontend pages include the API base meta tag (the app will also resolve `window.__API_BASE__` at runtime):
   ```html
   <meta name="api-base-url" content="https://<your-service>.railway.app">
   ```
   Commit & push this change if you prefer a fixed backend URL; otherwise the frontend runtime resolver can be used.

4. Deploy frontend to Vercel (recommended via Vercel dashboard):
   - Import the repo on https://vercel.com/new.
   - Set the Project Root/Output Directory to `public` so Vercel serves `public/index.html`.
   - Deploy.

5. Confirm CORS: On the Railway dashboard, set the `FRONTEND_URL` environment variable to your Vercel URL. Our server uses `FRONTEND_URL` (if present) to allow only that origin.

6. Verify: Open `https://<your-vercel-site>/admin_dashboard.html`, open DevTools → Network.
   - Confirm requests to `https://<your-railway-service>/api/dashboard-background` return 200 and valid JSON.

---

## CLI commands (manual deploy)

Railway (using Railway CLI):

PowerShell example (install CLI and deploy):

```pwsh
# Install Railway CLI (one-time)
npm i -g @railway/cli

# Login to Railway (interactive)
railway login

# From repository root, create/init or link project
railway init   # follow prompts to link to a Railway project OR
railway up     # deploy current project to Railway
```

Set environment variables via CLI (or use the Railway dashboard):

```pwsh
# Set FRONTEND_URL for the linked project (interactive context required)
railway variables set FRONTEND_URL "https://<your-vercel-site>.vercel.app"
```

If you prefer the web UI, open your Railway project → Variables → Add `FRONTEND_URL`.

Vercel (requires VERCEL_TOKEN):

PowerShell example (deploy `public` folder):

```pwsh
npm i -g vercel
$env:VERCEL_TOKEN = '<YOUR_VERCEL_TOKEN>'
cd 'public'
vercel --prod --token $env:VERCEL_TOKEN --confirm
```

---

## CI / Automated deploys

If you want automated deploys from GitHub Actions, you can either:

- Use Railway's GitHub integration (recommended) so commits to `main` trigger builds in Railway.
- Or use the Railway CLI in GitHub Actions to run `railway up` (requires storing Railway API token/credentials as GitHub secrets).

Secrets/variables you may need to store in GitHub Actions or Railway:
- `RAILWAY_TOKEN` or the token Railway provides for CI (if using CLI in Actions)
- `VERCEL_TOKEN` — your Vercel token (for frontend deploys)
- `FRONTEND_URL` — the public Vercel URL (can be set after frontend deploy)

---

If you want, I can also:
- Add a short `railway` job to `.github/workflows/deploy.yml` using the Railway CLI.
- Provide exact CLI flags for non-interactive CI runs (you'll need to provide the Railway token/secrets).
