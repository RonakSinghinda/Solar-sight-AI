from django.db import models
from django.contrib.auth.models import User
import uuid

class Inspection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[('Pending', 'Pending'), ('Completed', 'Completed'), ('Failed', 'Failed')], default='Pending')
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Inspection {self.id} on {self.date}"

class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inspection = models.ForeignKey(Inspection, related_name='images', on_delete=models.CASCADE)
    file = models.ImageField(upload_to='inspections/raw/')
    timestamp = models.DateTimeField(null=True, blank=True)
    gps_lat = models.FloatField(null=True, blank=True)
    gps_lon = models.FloatField(null=True, blank=True)
    is_processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Image {self.id} - Processed: {self.is_processed}"

class Panel(models.Model):
    id = models.CharField(max_length=100, primary_key=True) # E.g., String ID from grid map
    location_lat = models.FloatField(null=True, blank=True)
    location_lon = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Panel {self.id}"

class Fault(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ForeignKey(Image, related_name='faults', on_delete=models.CASCADE)
    panel = models.ForeignKey(Panel, related_name='faults', on_delete=models.CASCADE, null=True, blank=True)
    fault_type = models.CharField(max_length=100) # Hotspot, Micro-crack, Soiling
    confidence = models.FloatField()
    bounding_box = models.JSONField() # [x_min, y_min, x_max, y_max]
    status = models.CharField(max_length=50, choices=[('Open', 'Open'), ('Resolved', 'Resolved')], default='Open')
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fault_type} ({self.confidence:.2f}) on {self.image.id}"

class Report(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inspection = models.OneToOneField(Inspection, on_delete=models.CASCADE)
    pdf_file = models.FileField(upload_to='reports/', null=True, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.inspection.id}"
