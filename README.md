# SolarSight AI ☀️🚁

[![Django](https://img.shields.io/badge/Backend-Django_4.2-092E20?style=flat-square&logo=django)](https://djangoproject.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![YOLOv8](https://img.shields.io/badge/AI-YOLOv8-FF3838?style=flat-square&logo=ultralytics)](https://github.com/ultralytics/ultralytics)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet_1.9-199900?style=flat-square&logo=leaflet)](https://leafletjs.com)
[![Celery](https://img.shields.io/badge/Tasks-Celery_5-37814A?style=flat-square&logo=celery)](https://docs.celeryq.dev)

SolarSight AI is a premium, full-stack drone telemetry and AI-powered diagnostic system designed to automate solar array inspections. It ingests thermal and RGB drone images, parses metadata, runs deep learning anomaly detection models, maps faults on a satellite GIS view, and auto-generates comprehensive maintenance PDF reports.

---

## 🏗️ System Architecture

The platform is designed with a decoupled frontend-backend architecture integrated with an asynchronous task processing pipeline:

```mermaid
graph TD
    Client[Next.js App Client] -->|Fetch / REST API / JWT| Gateway[Django REST Framework]
    Gateway -->|DB Operations| DB[(SQLite / PostgreSQL)]
    Gateway -->|Celery Task Queue| Broker[Redis / Eager Local]
    Broker -->|Run Worker| Worker[Celery Inference Process]
    Worker -->|Inference Loop| YOLO[YOLOv8 Model / Mock YOLO]
    Worker -->|Extract Metadata & Exif| Preprocess[PIL Preprocessor]
    Worker -->|Generate PDF Report| ReportLab[ReportLab PDF Engine]
    Worker -->|Save Media| Storage[(Local Storage / AWS S3)]
```

---

## ✨ Features

- 🛰️ **EXIF Telemetry Ingestion**: Parses GPS coordinates directly from UAV image EXIF data. Fallback is handled using a deterministic coordinator for sandbox development.
- 🧠 **YOLOv8 Diagnostic Layer**: Detects three classes of critical solar array faults: **Hotspots**, **Micro-cracks**, and **Soiling**. Built with a local `MockYOLO` fallback if PyTorch or weights are not loaded.
- 🗺️ **GIS Density Heatmap**: Integrates satellite tiles from ESRI/ArcGIS overlaid with custom Leaflet.heat layers to pinpoint high-risk array sectors.
- 📄 **Storage-Agnostic PDF Engine**: Auto-compiles multi-page PDF maintenance work orders using ReportLab. Compiles in-memory with Django `ContentFile`, supporting local folders or AWS S3 buckets.
- 🔐 **Premium UI/UX**: Modern dark-mode interface built with Framer Motion, Lenis smooth scrolling, Recharts telemetry, and JWT-based authentication.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Glassmorphism design tokens
- **Animations**: Framer Motion & Lenis Scroll
- **Mapping**: Leaflet.js & Leaflet-heat
- **Charts**: Recharts

### Backend & AI
- **Framework**: Django 4.2 & Django REST Framework
- **Task Queue**: Celery (integrated with eager local queue fallback)
- **Database**: SQLite (default dev) / PostgreSQL (production support)
- **Object Detection**: Ultralytics YOLOv8
- **PDF Generation**: ReportLab
- **Cloud Storage**: AWS S3 integration via `django-storages`

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

---

### Backend Setup

1. **Navigate to backend and prepare environments**:
   ```bash
   # Create a virtual environment if not present
   python -m venv venv
   
   # Activate venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Database migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start the development server**:
   ```bash
   python manage.py runserver
   ```
   *The backend will run on `http://127.0.0.1:8000/`*

---

### Frontend Setup

1. **Navigate to the frontend folder**:
   ```bash
   cd "front end"
   ```

2. **Install Node modules**:
   ```bash
   npm install
   ```

3. **Start the Next.js dev server**:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000/`*

---

## 🔒 Security & Environment Variables

Create a `.env` file in the root folder to override defaults:

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
DATABASE_URL=postgres://user:password@localhost:5432/dbname
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your-s3-bucket
REDIS_URL=redis://localhost:6379/0
```

---

## 🐳 Docker Deployment

The database and cache layers can be spun up using:
```bash
docker-compose up -d
```
This deploys:
- **PostgreSQL 15** on port `5432`
- **Redis 7** on port `6379`