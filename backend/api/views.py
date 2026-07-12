from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .serializers import InspectionSerializer, FaultSerializer, ReportSerializer, PanelSerializer
from backend.models.models import Inspection, Image, Fault, Report, Panel
from backend.tasks import process_uav_image

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({"message": "User registered successfully.", "user_id": user.id}, status=status.HTTP_201_CREATED)

# Programmatically run database migrations to create new tables/columns
try:
    from django.core.management import call_command
    call_command('makemigrations', 'models', interactive=False, verbosity=0)
    call_command('migrate', interactive=False, verbosity=0)
    print("[SolarSight] Database migrations applied successfully.")
except Exception as e:
    print(f"[SolarSight] Migration warning: {e}")


from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from .serializers import NotificationSerializer
from backend.models.models import Notification

class InspectionViewSet(viewsets.ModelViewSet):
    queryset = Inspection.objects.all().order_by('-date')
    serializer_class = InspectionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist('images')
        if not files:
            return Response({"error": "No images were received by the server."}, status=status.HTTP_400_BAD_REQUEST)

        inspection = Inspection.objects.create(
            inspector=request.user,
            site_name=request.data.get('site_name', ''),
            priority=request.data.get('priority', 'Routine'),
            scan_type=request.data.get('scan_type', 'Thermal AI'),
            notes=request.data.get('notes', ''),
        )

        # Trigger started notification
        try:
            site_label = inspection.site_name or 'Unknown Site'
            Notification.objects.create(
                user=request.user,
                title="Inspection Scan Scheduled",
                message=f"Work order created for {site_label}. UAV analysis queued.",
                link=f"/inspections/{inspection.id}"
            )
        except Exception as n_err:
            print(f"Failed to create notification: {n_err}")

        for f in files:
            img_obj = Image.objects.create(inspection=inspection, file=f)
            try:
                process_uav_image.delay(img_obj.id)
            except Exception as e:
                print(f"Failed to queue celery task: {e}")
                inspection.status = 'Failed'
                inspection.save()

        serializer = self.get_serializer(inspection)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='simulate-scan')
    def simulate_scan(self, request):
        import os
        import random
        import uuid
        import shutil
        from django.conf import settings
        
        raw_dir = os.path.join(settings.MEDIA_ROOT, 'inspections', 'raw')
        os.makedirs(raw_dir, exist_ok=True)
        
        available_files = []
        if os.path.exists(raw_dir):
            available_files = [f for f in os.listdir(raw_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            
        if not available_files:
            # Create a simple dummy image if raw dir is empty
            from PIL import Image as PILImage
            dummy_path = os.path.join(raw_dir, 'dummy_simulated.jpg')
            img = PILImage.new('RGB', (800, 600), color='#0A1A2A')
            img.save(dummy_path)
            selected_filename = 'dummy_simulated.jpg'
        else:
            # Avoid using previous simulation files to prevent infinite loops
            available_files = [f for f in available_files if not f.startswith('simulated_')]
            if not available_files:
                available_files = [f for f in os.listdir(raw_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            selected_filename = random.choice(available_files)
            
        src_path = os.path.join(raw_dir, selected_filename)
        dest_filename = f"simulated_{uuid.uuid4().hex}_{selected_filename}"
        dest_path = os.path.join(raw_dir, dest_filename)
        
        try:
            shutil.copy2(src_path, dest_path)
        except Exception as copy_err:
            print(f"Failed to copy simulated file: {copy_err}")
            dest_filename = selected_filename # fallback to reuse existing
        
        inspection = Inspection.objects.create(inspector=request.user)
        img_obj = Image.objects.create(
            inspection=inspection, 
            file=f"inspections/raw/{dest_filename}"
        )
        
        # Trigger started notification
        try:
            Notification.objects.create(
                user=request.user,
                title="Inspection Scan Scheduled",
                message=f"UAV flight analysis {inspection.id.hex[:8]} scheduled. Processing images.",
                link=f"/inspections/{inspection.id}"
            )
        except Exception as n_err:
            print(f"Failed to create notification: {n_err}")
            
        try:
            process_uav_image.delay(img_obj.id)
        except Exception as e:
            print(f"Failed to queue celery task: {e}")
            inspection.status = 'Failed'
            inspection.save()
            
        serializer = self.get_serializer(inspection)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return notifications belonging to the logged-in user
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({"message": "All notifications marked as read."})

class FaultViewSet(viewsets.ModelViewSet):
    queryset = Fault.objects.all().order_by('-detected_at')
    serializer_class = FaultSerializer
    permission_classes = [IsAuthenticated]

class PanelViewSet(viewsets.ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer
    permission_classes = [IsAuthenticated]

class ReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Report.objects.all().order_by('-generated_at')
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    inspections_count = Inspection.objects.count()
    faults_count = Fault.objects.count()
    open_faults = Fault.objects.filter(status='Open').count()
    
    return Response({
        'total_inspections': inspections_count,
        'total_faults': faults_count,
        'open_faults': open_faults,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_report(request):
    inspection_id = request.data.get('inspection_id')
    if not inspection_id:
        return Response({'error': 'inspection_id is required'}, status=400)
    
    from reports.generator import generate_inspection_report
    try:
        report = generate_inspection_report(inspection_id)
        pdf_url = request.build_absolute_uri(report.pdf_file.url)
        return Response({'message': 'Report generated', 'report_id': str(report.id), 'url': pdf_url})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fault_map_data(request):
    """
    Returns all faults that have valid GPS coordinates.
    Optionally filter by fault_type or date range.
    """
    faults = Fault.objects.select_related('image__inspection') \
                          .filter(
                              image__gps_lat__isnull=False,
                              image__gps_lon__isnull=False
                          )

    # Optional filters from query params
    fault_type = request.GET.get('fault_type')
    if fault_type:
        faults = faults.filter(fault_type=fault_type)

    date_from = request.GET.get('date_from')
    if date_from:
        faults = faults.filter(detected_at__date__gte=date_from)

    data = [
        {
            "lat": f.image.gps_lat,
            "lon": f.image.gps_lon,
            "fault_type": f.fault_type,
            "confidence": round(f.confidence, 3),
            "inspection_id": str(f.image.inspection.id),
            "detected_at": f.detected_at.isoformat(),
        }
        for f in faults
    ]
    return Response(data)
