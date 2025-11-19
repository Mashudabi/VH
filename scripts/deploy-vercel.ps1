<#
PowerShell helper to deploy the `public` folder to Vercel using the Vercel CLI.

Usage (PowerShell):
  Install Vercel CLI if you haven't: npm i -g vercel
  $env:VERCEL_TOKEN = '<your-vercel-token>'
  ./scripts/deploy-vercel.ps1

This script invokes `vercel --prod` in the `public` folder. VERCEL_TOKEN must
be set as an environment variable.
#>

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Error "Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
}
if (-not $env:VERCEL_TOKEN) {
  Write-Error "VERCEL_TOKEN not set. Set it as an environment variable before running."
  exit 1
}

Push-Location -Path (Join-Path -Path $PSScriptRoot -ChildPath '..\public')
try {
  Write-Host "Deploying ./public to Vercel (prod)..."
  $proc = Start-Process -FilePath vercel -ArgumentList "--prod","--token",$env:VERCEL_TOKEN,"--confirm" -NoNewWindow -Wait -PassThru
  if ($proc.ExitCode -ne 0) {
    Write-Error "Vercel deploy failed with exit code $($proc.ExitCode)"
    exit $proc.ExitCode
  }
  Write-Host "✅ Vercel deploy completed"
} finally {
  Pop-Location
}
