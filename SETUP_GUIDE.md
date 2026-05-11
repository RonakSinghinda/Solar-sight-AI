# SolarSight AI - Setup & Launch Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite used by default)
- Redis (for Celery tasks)

## Backend Setup

### 1. Create Python Virtual Environment
```bash
cd c:\Users\user\Solar-sight-AI
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Create .env File
```bash
# c:\Users\user\Solar-sight-AI\.env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### 4. Run Migrations
```bash
python manage.py migrate
```

### 5. Create Superuser
```bash
python manage.py createsuperuser
# Username: admin
# Password: admin123
```

### 6. Start Backend Server
```bash
python manage.py runserver 0.0.0.0:8000
```

Backend will be available at: http://localhost:8000/api

## Frontend Setup

### 1. Install Dependencies
```bash
cd c:\Users\user\Solar-sight-AI\front\ end
npm install
```

### 2. Create .env.local File
```bash
# c:\Users\user\Solar-sight-AI\front\ end\.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

## Testing the Application

### 1. Test Login
- Navigate to http://localhost:3000/login
- Username: `admin`
- Password: `admin123`

### 2. Test Dashboard
- After login, you'll be redirected to `/dashboard`
- Verify metrics load from backend
- Try uploading test images

### 3. Test Other Routes
- `/inspections` - View all inspections
- `/inspections/[id]` - View inspection details
- `/panel-view` - View panel grid
- `/reports` - View generated reports
- `/settings` - User settings

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login (returns access & refresh tokens)
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/refresh/` - Refresh access token

### Inspections
- `GET /api/inspections/` - List all inspections
- `POST /api/inspections/` - Create new inspection (upload images)
- `GET /api/inspections/{id}/` - Get inspection details

### Faults
- `GET /api/faults/` - List all faults
- `GET /api/faults/?inspection={id}` - Get faults for specific inspection

### Panels
- `GET /api/panels/` - List all panels
- `GET /api/panels/?sector={sector_id}` - Get panels by sector

### Reports
- `GET /api/reports/` - List all reports
- `POST /api/reports/generate/` - Generate new report for inspection

### Dashboard
- `GET /api/dashboard/summary/` - Get dashboard metrics

## Troubleshooting

### CORS Issues
If you encounter CORS errors, check that CORS is configured in backend settings:
```python
# backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Token Expiration
Tokens are automatically refreshed by the frontend. If issues persist, clear localStorage and login again.

### Database Errors
If migrations fail:
```bash
python manage.py migrate --fake initial
python manage.py migrate
```

### API Connection Errors
1. Verify backend is running on port 8000
2. Check NEXT_PUBLIC_API_URL in frontend .env.local
3. Check browser console for specific error messages
