import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.conf import settings
from backend.models.models import Inspection, Report

def generate_inspection_report(inspection_id):
    inspection = Inspection.objects.get(id=inspection_id)
    
    # Check if MEDIA_ROOT is set, fallback to absolute path if not defined
    media_root = getattr(settings, 'MEDIA_ROOT', os.path.join(settings.BASE_DIR, 'media'))
    reports_dir = os.path.join(media_root, 'reports')
    os.makedirs(reports_dir, exist_ok=True)
    
    filename = f"report_{inspection_id}.pdf"
    filepath = os.path.join(reports_dir, filename)
    
    c = canvas.Canvas(filepath, pagesize=letter)
    
    # Premium Header
    c.setFont("Helvetica-Bold", 24)
    c.setFillColorRGB(0.1, 0.3, 0.6)
    c.drawString(50, 750, "SolarSight AI")
    c.setFillColorRGB(0.2, 0.2, 0.2)
    c.setFont("Helvetica", 14)
    c.drawString(50, 720, "Official Maintenance & Inspection Report")
    
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.line(50, 705, 550, 705)
    
    # Meta Details
    c.setFont("Helvetica", 12)
    c.drawString(50, 680, f"Inspection ID: {str(inspection.id)[:8]}...{str(inspection.id)[-4:]}")
    c.drawString(50, 660, f"Date: {inspection.date.strftime('%B %d, %Y - %H:%M:%S')}")
    c.drawString(50, 640, f"Status: {inspection.status}")
    
    y = 600
    
    for image in inspection.images.all():
        if y < 250:
            c.showPage()
            y = 750
            
        c.setFont("Helvetica-Bold", 14)
        c.setFillColorRGB(0.2, 0.2, 0.2)
        c.drawString(50, y, "Analyzed Solar Panel Image:")
        y -= 20
        
        # Render the uploaded image
        if image.file and os.path.exists(image.file.path):
            try:
                # Fixed width/height for layout consistency
                img_width = 350
                img_height = 220
                c.drawImage(image.file.path, 50, y - img_height, width=img_width, height=img_height, preserveAspectRatio=True)
                y -= (img_height + 30)
            except Exception as e:
                c.setFont("Helvetica", 10)
                c.setFillColorRGB(0.8, 0.1, 0.1)
                c.drawString(50, y, f"(Image rendering failed)")
                y -= 30
                
        # Render faults
        faults = image.faults.all()
        if not faults:
            c.setFont("Helvetica", 12)
            c.setFillColorRGB(0.1, 0.6, 0.1)
            c.drawString(50, y, "✓ No critical faults detected on this image.")
            y -= 40
        else:
            c.setFont("Helvetica-Bold", 12)
            c.setFillColorRGB(0.8, 0.2, 0.2)
            c.drawString(50, y, "⚠️ Detected Anomalies:")
            y -= 20
            
            c.setFont("Helvetica", 11)
            c.setFillColorRGB(0.3, 0.3, 0.3)
            for fault in faults:
                panel_text = f"Panel #{fault.panel.id}" if fault.panel else 'Unknown Panel Location'
                conf_pct = int(fault.confidence * 100)
                c.drawString(70, y, f"• {fault.fault_type} ({conf_pct}% confidence) at {panel_text}")
                y -= 20
            y -= 40
            
    c.save()
    
    report, _ = Report.objects.get_or_create(inspection=inspection)
    report.pdf_file.name = f"reports/{filename}"
    report.save()
    
    return report
