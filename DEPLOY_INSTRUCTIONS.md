# Deploy Backend to Render and Frontend to Vercel

This document contains safe, copy-pasteable steps and CI templates to deploy the backend to Render and the frontend (static `public/` folder) to Vercel, and to verify they are connected.

Important: You will need credentials and service/project IDs. Do NOT commit secrets. Use Render and Vercel UI to add secrets to GitHub Actions or use your local CLI with tokens.

---

## Quick manual flow (recommended for first-time)

1. Push code to your repository's `main` branch.

2. Deploy backend to Render (recommended via Render dashboard):
   - Go to https://render.com -> New -> Web Service -> Connect your repo.
   - Branch: `main`
   - Start Command: `npm start`
   - Build Command: leave blank (Render will run `npm install`).
   - Set environment variables in Render service settings:
     - `FRONTEND_URL` = `https://<your-vercel-site>.vercel.app` (set after you deploy frontend)
     - (Optional) `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` if you enable Cloudinary features.
   - Deploy and copy the service URL (e.g. `https://vacant-houses-backend.onrender.com`).

3. Point frontend to backend by editing `public/admin_dashboard.html` meta tag:
   ```html
   <meta name="api-base-url" content="https://vacant-houses-backend.onrender.com">
   ```
   Commit & push this change.

4. Deploy frontend to Vercel (recommended via Vercel dashboard):
   - Import the repo on https://vercel.com/new.
   - Set the Project Root/Output Directory to `public` so Vercel serves `public/index.html`.
   - Deploy.

5. Update Render CORS: On the Render backend service, set `FRONTEND_URL` to the Vercel url.

6. Verify: Open `https://<your-vercel-site>/admin_dashboard.html`, open DevTools → Network.
   - Confirm requests to `https://<your-render-service>/api/dashboard-background` return 200 and valid JSON.

---

## CLI commands (manual deploy)

Render (requires RENDER_API_KEY):

PowerShell example (set env var first):

```pwsh
$env:RENDER_API_KEY = '<YOUR_RENDER_API_KEY>'
$serviceId = '<YOUR_RENDER_SERVICE_ID>'
Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Method Post -Headers @{ Authorization = "Bearer $env:RENDER_API_KEY" } -Body (@{ clearCache = $true } | ConvertTo-Json ) -ContentType 'application/json'
```

Vercel (requires VERCEL_TOKEN):

PowerShell example (deploy `public` folder):

```pwsh
npm i -g vercel
$env:VERCEL_TOKEN = '<YOUR_VERCEL_TOKEN>'
cd 'public'
vercel --prod --token $env:VERCEL_TOKEN --confirm
```

---

## GitHub Actions (automated on push)

I included a template workflow `.github/workflows/deploy.yml`. Before enabling it, add the following GitHub repository secrets:

- `RENDER_API_KEY` — your Render account API key
- `RENDER_SERVICE_ID` — the backend service id from Render
- `VERCEL_TOKEN` — your Vercel token
- `VERCEL_PROJECT_ID` — your Vercel project id
- `VERCEL_ORG_ID` — your Vercel organization id
- `RENDER_URL` — the public URL of your Render service (e.g. https://vacant-houses-backend.onrender.com). This is used by the workflow to verify the backend after deploy.

The workflow will:
- Trigger backend deploy via Render API
- Deploy frontend to Vercel using `amondnet/vercel-action`

See `.github/workflows/deploy.yml` for the full template.

---

If you want, I can also:
- Create a Render `render.yaml` or configure more advanced build steps.
- Help you set the exact secret names and where to find Render service id and Vercel project/org ids.
