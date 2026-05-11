@echo off
REM SolarSight AI - Quick Start Script

echo.
echo ====================================
echo SolarSight AI - Starting Application
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Create venv if it doesn't exist
if not exist "venv" (
    echo [1/4] Creating Python virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo [1/4] Installing Python dependencies...
    pip install -q django djangorestframework django-cors-headers djangorestframework-simplejwt django-storages celery pillow
) else (
    call venv\Scripts\activate.bat
)

REM Run migrations
echo [2/4] Running database migrations...
python manage.py migrate --no-input >nul 2>&1

REM Check if admin user exists and set password
echo [3/4] Ensuring admin user exists...
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); u, created = User.objects.get_or_create(username='admin', email='admin@solarsight.ai'); u.set_password('admin123'); u.save(); print('✓ Admin user ready (admin / admin123)')" >nul 2>&1

REM Install frontend dependencies
echo [4/4] Installing frontend dependencies...
cd "front end"
call npm install --legacy-peer-deps --silent >nul 2>&1
cd ..

echo.
echo ====================================
echo Starting Backend Server...
echo ====================================
echo Backend: http://localhost:8000/api
echo Admin:   http://localhost:8000/admin
echo.
start cmd /k "cd . && call venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

timeout /t 3

echo.
echo ====================================
echo Starting Frontend Server...
echo ====================================
echo Frontend: http://localhost:3000
echo.
start cmd /k "cd \"front end\" && npm run dev"

timeout /t 2

echo.
echo ====================================
echo SolarSight AI is Starting!
echo ====================================
echo.
echo Backend  will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo.
echo Login with:
echo   Username: admin
echo   Password: admin123
echo.
echo Both servers will open automatically...
echo.
pause
