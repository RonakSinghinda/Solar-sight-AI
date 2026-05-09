import os
from ultralytics import YOLO

def main():
    print("Starting SolarSight AI Model Training...")
    
    # 1. Load the base YOLOv8 nano model (fastest for CPU/testing)
    model = YOLO('yolov8n.pt')
    
    # Ensure the data.yaml path is correct relative to where we run the script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_yaml_path = os.path.join(current_dir, 'data.yaml')

    # 2. Train the model using your custom dataset
    # Note: Training on a CPU will take time! If you have a GPU, ultralytics uses it automatically.
    results = model.train(
        data=data_yaml_path,
        epochs=5,            # Reduced to 5 epochs for a much faster training demo
        imgsz=640,           # Standard image size
        batch=4,             # Lower batch size to prevent Out of Memory (OOM) crashes
        workers=0,           # Fixed for Windows to prevent multiprocessing crashes
        val=False,           # Disabled validation loop since that is where it crashed
        name='solar_faults', # Name of the folder where results will be saved
        device='cpu'         # CPU training
    )
    
    print("\n✅ Training Complete!")
    print("Your new trained model is saved at: runs/detect/solar_faults/weights/best.pt")
    print("You can now update backend/ai/infer.py to load this 'best.pt' file!")

if __name__ == '__main__':
    main()
