from rest_framework import serializers
from backend.models.models import Inspection, Image, Panel, Fault, Report

class FaultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fault
        fields = '__all__'

class ImageSerializer(serializers.ModelSerializer):
    faults = FaultSerializer(many=True, read_only=True)
    
    class Meta:
        model = Image
        fields = '__all__'

class InspectionSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Inspection
        fields = '__all__'

class PanelSerializer(serializers.ModelSerializer):
    faults = FaultSerializer(many=True, read_only=True)
    
    class Meta:
        model = Panel
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
