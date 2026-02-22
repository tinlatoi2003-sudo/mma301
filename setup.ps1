$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root "backend"
$mobilePath = Join-Path $root "mobile-app"
$npmCmd = (Get-Command npm.cmd -ErrorAction SilentlyContinue).Source

if (-not $npmCmd) {
  throw "Khong tim thay npm.cmd. Hay cai lai Node.js hoac them Node vao PATH."
}

Write-Host "==> Cai dependencies cho backend..." -ForegroundColor Cyan
Push-Location $backendPath
& $npmCmd install
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Da tao backend/.env tu file mau. Hay cap nhat MONGO_URI va JWT_SECRET." -ForegroundColor Yellow
}
Pop-Location

Write-Host "==> Cai dependencies cho mobile-app..." -ForegroundColor Cyan
Push-Location $mobilePath
& $npmCmd install
Pop-Location

Write-Host "==> Setup co ban da xong." -ForegroundColor Green
Write-Host "1. Kiem tra backend/.env" -ForegroundColor Green
Write-Host "2. Chay 'npm run seed' trong backend neu can du lieu mau" -ForegroundColor Green
Write-Host "3. Chay 'npm run dev' trong backend" -ForegroundColor Green
Write-Host "4. Chay 'npm run android' trong mobile-app" -ForegroundColor Green
