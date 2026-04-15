# PowerShell script to separate frontend and backend files
Write-Host "Starting folder separation..." -ForegroundColor Cyan

# Define directories
$ROOT = Get-Location
$FRONTEND = Join-Path $ROOT "frontend"
$BACKEND = Join-Path $ROOT "backend"

# Create directories if they don't exist
if (!(Test-Path -Path $FRONTEND)) {
    New-Item -ItemType Directory -Path $FRONTEND
    Write-Host "Created frontend directory" -ForegroundColor Green
}
if (!(Test-Path -Path $BACKEND)) {
    New-Item -ItemType Directory -Path $BACKEND
    Write-Host "Created backend directory" -ForegroundColor Green
}

# --- FRONTEND MOVE ---
Write-Host "Moving frontend files..." -ForegroundColor Cyan
$frontendFiles = @("app", "next.config.js", "tailwind.config.js", "postcss.config.js", "tsconfig.json", "next-env.d.ts", ".next", ".netlify", "netlify.toml")
foreach ($file in $frontendFiles) {
    if (Test-Path -Path (Join-Path $ROOT $file)) {
        Move-Item -Path (Join-Path $ROOT $file) -Destination $FRONTEND -Force -ErrorAction SilentlyContinue
        Write-Host "Moved $file to frontend/" -ForegroundColor Gray
    }
}

# --- BACKEND MOVE ---
Write-Host "Moving backend files..." -ForegroundColor Cyan
# Move contents of 'server' folder if it exists
if (Test-Path -Path (Join-Path $ROOT "server")) {
    Get-ChildItem -Path (Join-Path $ROOT "server") | ForEach-Object {
        Move-Item -Path $_.FullName -Destination $BACKEND -Force -ErrorAction SilentlyContinue
        Write-Host "Moved $($_.Name) to backend/" -ForegroundColor Gray
    }
    Remove-Item -Path (Join-Path $ROOT "server") -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Removed old server directory" -ForegroundColor Yellow
}

# Move other backend specific root files
$backendScripts = @("test.js", "test.mjs", "test_batch.js", "test_batch.mjs", "db.js", "data.json")
foreach ($file in $backendScripts) {
    if (Test-Path -Path (Join-Path $ROOT $file)) {
        Move-Item -Path (Join-Path $ROOT $file) -Destination $BACKEND -Force -ErrorAction SilentlyContinue
        Write-Host "Moved $file to backend/" -ForegroundColor Gray
    }
}

Write-Host "Migration complete!" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'npm run install:all' to install dependencies in both folders." -ForegroundColor Yellow
Write-Host "2. Run 'npm run dev' to start both frontend and backend." -ForegroundColor Yellow
