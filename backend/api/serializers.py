from rest_framework import serializers
from backend.models.models import Inspection, Image, Panel, Fault, Report

class FaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fault
        fields = '__all__'

class PanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    faults = FaultSerializer(many=True, read_only=True)
    
    class Meta:
        model = Image
        fields = '__all__'

class InspectionSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    report_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Inspection
        fields = '__all__'

    def get_report_url(self, obj):
        if hasattr(obj, 'report') and obj.report and obj.report.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.report.pdf_file.url)
            return obj.report.pdf_file.url
        return None

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class FaultMapSerializer(serializers.Serializer):
    lat = serializers.FloatField(source='image.gps_lat')
    lon = serializers.FloatField(source='image.gps_lon')
    fault_type = serializers.CharField()
    confidence = serializers.FloatField()
    inspection_id = serializers.UUIDField(source='image.inspection.id')
    detected_at = serializers.DateTimeField()
