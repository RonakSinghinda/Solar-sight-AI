# SolarSight AI - Quick Start Script (PowerShell)

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SolarSight AI - Starting Application" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
$pythonExists = $null -ne (Get-Command python -ErrorAction SilentlyContinue)
if (-not $pythonExists) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
if (-not $nodeExists) {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create venv if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "[1/4] Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    . .\venv\Scripts\Activate.ps1
    Write-Host "[1/4] Installing Python dependencies..." -ForegroundColor Yellow
    pip install -q django djangorestframework django-cors-headers djangorestframework-simplejwt django-storages celery pillow
} else {
    . .\venv\Scripts\Activate.ps1
}

# Run migrations
Write-Host "[2/4] Running database migrations..." -ForegroundColor Yellow
python manage.py migrate --no-input | Out-Null

# Check if admin user exists and set password
Write-Host "[3/4] Ensuring admin user exists..." -ForegroundColor Yellow
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u, created = User.objects.get_or_create(username='admin', email='admin@solarsight.ai'); u.set_password('admin123'); u.save(); print('✓ Admin user ready (admin / admin123)')" | Out-Null

# Install frontend dependencies
Write-Host "[4/4] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "front end"
npm install --legacy-peer-deps --silent | Out-Null
Set-Location ..

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000/api" -ForegroundColor Green
Write-Host "Admin:   http://localhost:8000/admin" -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", ". .\venv\Scripts\Activate.ps1; python manage.py runserver 0.0.0.0:8000"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'front end'; npm run dev"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SolarSight AI is Starting!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend  will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login with:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor Green
Write-Host "  Password: admin123" -ForegroundColor Green
Write-Host ""
Write-Host "Both servers will open automatically..." -ForegroundColor Yellow
Write-Host ""
