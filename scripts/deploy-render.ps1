<#
PowerShell helper to trigger a Render deploy for a service.

Usage (PowerShell):
  $env:RENDER_API_KEY = '<your-render-api-key>'
  $env:RENDER_SERVICE_ID = '<your-service-id>'
  ./scripts/deploy-render.ps1

This script does NOT store secrets. It reads the API key and service id from
environment variables. It triggers a deploy and polls the deploy status until
it becomes active or times out.
#>

param(
  [int]$MaxWaitSeconds = 300,
  [int]$PollInterval = 5
)

if (-not $env:RENDER_API_KEY) {
  Write-Error "RENDER_API_KEY not set. Set it as an environment variable before running."
  exit 1
}
if (-not $env:RENDER_SERVICE_ID) {
  Write-Error "RENDER_SERVICE_ID not set. Set it as an environment variable before running."
  exit 1
}

$apiKey = $env:RENDER_API_KEY
$serviceId = $env:RENDER_SERVICE_ID
$deployUrl = "https://api.render.com/v1/services/$serviceId/deploys"

Write-Host "Triggering deploy for Render service: $serviceId"
$body = @{ clearCache = $true } | ConvertTo-Json
$response = Invoke-RestMethod -Uri $deployUrl -Method Post -Headers @{ Authorization = "Bearer $apiKey" } -Body $body -ContentType 'application/json' -ErrorAction Stop

$deployId = $response.id
if (-not $deployId) {
  Write-Error "Failed to trigger deploy. Response: $(ConvertTo-Json $response)"
  exit 1
}
Write-Host "Deploy triggered: $deployId"

# Poll deploy status
$start = Get-Date
while ((Get-Date) - $start).TotalSeconds -lt $MaxWaitSeconds {
  Start-Sleep -Seconds $PollInterval
  $statusUrl = "https://api.render.com/v1/services/$serviceId/deploys/$deployId"
  try {
    $statusResp = Invoke-RestMethod -Uri $statusUrl -Headers @{ Authorization = "Bearer $apiKey" } -Method Get -ErrorAction Stop
    $state = $statusResp.state
    Write-Host "Deploy state: $state"
    if ($state -eq 'live' -or $state -eq 'succeeded') {
      Write-Host "✅ Deploy is live"
      exit 0
    }
    if ($state -eq 'failed') {
      Write-Error "Deploy failed. See Render dashboard for details."
      exit 2
    }
  } catch {
    Write-Warning "Failed to query deploy status: $_"
  }
}
Write-Error "Timed out waiting for deploy to become live after $MaxWaitSeconds seconds."
exit 3
