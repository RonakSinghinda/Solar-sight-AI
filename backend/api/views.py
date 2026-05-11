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

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class InspectionViewSet(viewsets.ModelViewSet):
    queryset = Inspection.objects.all().order_by('-date')
    serializer_class = InspectionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist('images')
        if not files:
            return Response({"error": "No images were received by the server."}, status=status.HTTP_400_BAD_REQUEST)

        inspection = Inspection.objects.create(inspector=request.user)
        
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

class FaultViewSet(viewsets.ModelViewSet):
    queryset = Fault.objects.all().order_by('-detected_at')
    serializer_class = FaultSerializer
    permission_classes = [IsAuthenticated]

class PanelViewSet(viewsets.ReadOnlyModelViewSet):
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
