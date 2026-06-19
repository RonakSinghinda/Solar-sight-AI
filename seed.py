import os
import django
import random
import io
from datetime import datetime, timedelta
from django.utils import timezone

# Initialize Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from backend.models.models import Inspection, Image, Panel, Fault, Report
from django.core.files.base import ContentFile
from PIL import Image as PILImage
from reports.generator import generate_inspection_report

def create_dummy_image_file(color_name):
    # Generates a small dummy solid color image to simulate UAV capture
    colors = {
        'blue': (30, 144, 255),
        'orange': (255, 140, 0),
        'green': (50, 205, 50),
        'red': (220, 20, 60),
    }
    color = colors.get(color_name, (128, 128, 128))
    img = PILImage.new('RGB', (640, 480), color=color)
    img_io = io.BytesIO()
    img.save(img_io, format='JPEG', quality=85)
    return ContentFile(img_io.getvalue(), name=f"mock_uav_{color_name}.jpg")

def seed_database():
    print("[START] Starting SolarSight AI database seeding...")
    
    # 1. Clean old data
    print("[CLEAN] Cleaning existing data...")
    Fault.objects.all().delete()
    Panel.objects.all().delete()
    Report.objects.all().delete()
    Image.objects.all().delete()
    Inspection.objects.all().delete()

    # 2. Get or create operator/user
    user, created = User.objects.get_or_create(username='admin', defaults={'email': 'admin@example.com'})
    if created or not user.has_usable_password():
        user.set_password('admin123')
        user.save()
    print(f"[USER] Operator user: '{user.username}' (password: 'admin123')")

    # Jaipur / Rajasthan Solar Belt coordinates
    BASE_LAT = 26.9124
    BASE_LON = 75.7873

    # Inspection Site names
    sites = [
        "Sector 4 Array - Jaipur North",
        "Sector 2 Array - Jaipur North",
        "Sector 1 Array - Jaipur East",
        "Sector 5 Array - Sambhar Lake Solar",
        "Sector 3 Array - Jaipur South"
    ]

    statuses = ['Completed', 'Completed', 'Completed', 'Failed']
    fault_types = ['Hotspot', 'Micro-crack', 'Soiling']
    colors = ['blue', 'orange', 'green', 'red']

    # Generate inspections over the last 15 days
    now = timezone.now()
    
    for i, site in enumerate(sites):
        inspect_date = now - timedelta(days=i * 3, hours=random.randint(1, 6))
        inspection = Inspection.objects.create(
            date=inspect_date,
            status='Pending',
            inspector=user
        )
        print(f"[INFO] Creating Inspection: {inspection.id} at {site} ({inspect_date.strftime('%Y-%m-%d')})")

        # Create 1 to 3 images per inspection
        num_images = random.randint(1, 3)
        has_failed = False

        for j in range(num_images):
            # Slightly scatter coordinates around the Rajasthan solar farm
            lat = BASE_LAT + random.uniform(-0.02, 0.02)
            lon = BASE_LON + random.uniform(-0.02, 0.02)
            
            # Select color and build dummy JPEG file
            color_choice = random.choice(colors)
            img_file = create_dummy_image_file(color_choice)

            img_obj = Image.objects.create(
                inspection=inspection,
                file=img_file,
                timestamp=inspect_date - timedelta(minutes=j*10),
                gps_lat=round(lat, 6),
                gps_lon=round(lon, 6),
                is_processed=True
            )

            # Register panel
            panel_id = f"Panel_{abs(int(lat*1000))}_{abs(int(lon*1000))}"
            panel, _ = Panel.objects.get_or_create(
                id=panel_id,
                defaults={'location_lat': lat, 'location_lon': lon}
            )

            # Create faults randomly (80% chance of anomalies)
            if random.random() < 0.8:
                num_faults = random.randint(1, 2)
                for _ in range(num_faults):
                    fault_type = random.choice(fault_types)
                    confidence = random.uniform(0.65, 0.98)
                    
                    # Mock bounding box inside 640x480 resolution
                    bx = random.randint(20, 200)
                    by = random.randint(20, 200)
                    bounding_box = [bx, by, bx + random.randint(40, 150), by + random.randint(40, 150)]

                    Fault.objects.create(
                        image=img_obj,
                        panel=panel,
                        fault_type=fault_type,
                        confidence=round(confidence, 3),
                        bounding_box=bounding_box,
                        status=random.choice(['Open', 'Open', 'Resolved']),
                        detected_at=inspect_date
                    )
        
        # Complete the inspection and auto-generate the PDF report
        inspection.status = 'Completed'
        inspection.save()
        
        try:
            generate_inspection_report(inspection.id)
            print(f"   -> Auto-generated PDF report for {inspection.id}")
        except Exception as e:
            print(f"   -> Failed to generate PDF report: {e}")

    print("\n[SUCCESS] Seeding complete! Your database is now populated with inspections, mapped GPS coordinates, panel telemetry, and pre-generated PDF reports.")

if __name__ == '__main__':
    seed_database()
