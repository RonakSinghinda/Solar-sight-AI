from celery import shared_task
from backend.models.models import Image, Fault, Panel, Inspection
from ai.preprocess import preprocess_image
from ai.infer import get_model, run_inference
import traceback

@shared_task
def process_uav_image(image_id):
    try:
        img_obj = Image.objects.get(id=image_id)
        
        with img_obj.file.open('rb') as f:
            resized_pil, lat, lon = preprocess_image(f)
            
        panel = None
        if lat is not None and lon is not None:
            img_obj.gps_lat = lat
            img_obj.gps_lon = lon
            
            panel_id = f"Panel_{abs(int(lat*1000))}_{abs(int(lon*1000))}"
            panel, _ = Panel.objects.get_or_create(
                id=panel_id,
                defaults={'location_lat': lat, 'location_lon': lon}
            )

        yolo_model = get_model('ai/best.pt')
        faults_data = run_inference(resized_pil, yolo_model)
        
        for fault_info in faults_data:
            Fault.objects.create(
                image=img_obj,
                panel=panel,
                fault_type=fault_info['label'],
                confidence=fault_info['confidence'],
                bounding_box=fault_info['bounding_box']
            )
            
        img_obj.is_processed = True
        img_obj.save()
        
        inspection = img_obj.inspection
        if not inspection.images.filter(is_processed=False).exists():
            inspection.status = 'Completed'
            inspection.save()
            
            # Trigger completed notification
            if inspection.inspector:
                try:
                    from backend.models.models import Notification
                    total_faults = Fault.objects.filter(image__inspection=inspection).count()
                    Notification.objects.create(
                        user=inspection.inspector,
                        title="Inspection Completed",
                        message=f"Inspection analysis finished. Detected {total_faults} anomalies.",
                        link=f"/inspections/{inspection.id}"
                    )
                except Exception as n_err:
                    print(f"Failed to create notification: {n_err}")
            
            # Automatically generate report when inspection completes
            from reports.generator import generate_inspection_report
            generate_inspection_report(inspection.id)
            
        return f"Successfully processed image {image_id}"
        
    except Exception as e:
        try:
            with open("celery_error.log", "a") as f_err:
                import datetime
                f_err.write(f"\n--- ERROR AT {datetime.datetime.now()} ---\n")
                traceback.print_exc(file=f_err)
        except Exception:
            pass
        if 'img_obj' in locals() and img_obj:
            inspection = img_obj.inspection
            inspection.status = 'Failed'
            inspection.save()
            
            # Trigger failed notification
            if inspection.inspector:
                try:
                    from backend.models.models import Notification
                    Notification.objects.create(
                        user=inspection.inspector,
                        title="Inspection Failed",
                        message=f"An error occurred during UAV image analysis.",
                        link=f"/inspections/{inspection.id}"
                    )
                except Exception as n_err:
                    print(f"Failed to create notification: {n_err}")
                    
        traceback.print_exc()
        return f"Failed to process image {image_id}: {str(e)}"

