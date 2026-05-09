import os
import random

try:
    from ultralytics import YOLO
    HAS_ULTRALYTICS = True
except ImportError:
    HAS_ULTRALYTICS = False

class MockYOLO:
    """
    A mock implementation of the YOLOv8 model for testing the backend
    integration when the actual weights or ultralytics package are missing.
    """
    def __init__(self, weights_path):
        self.weights_path = weights_path
        self.names = {0: 'Hotspot', 1: 'Micro-crack', 2: 'Soiling'}

    def __call__(self, image, conf=0.25):
        # Return mock results
        class MockBox:
            def __init__(self):
                # Generate 0 to 3 random faults
                num_faults = random.randint(0, 3)
                self.xyxy = []
                self.conf = []
                self.cls = []
                
                for _ in range(num_faults):
                    x1 = random.randint(0, 320)
                    y1 = random.randint(0, 320)
                    x2 = random.randint(x1 + 10, 640)
                    y2 = random.randint(y1 + 10, 640)
                    
                    self.xyxy.append([x1, y1, x2, y2])
                    self.conf.append(random.uniform(conf, 0.99))
                    self.cls.append(random.choice([0, 1, 2]))

        class MockResult:
            def __init__(self):
                self.boxes = MockBox()
                self.names = {0: 'Hotspot', 1: 'Micro-crack', 2: 'Soiling'}
                
        return [MockResult()]

def get_model(weights_path='yolov8n.pt'):
    """
    Returns the real YOLO model if available, otherwise returns the MockYOLO.
    """
    if HAS_ULTRALYTICS and os.path.exists(weights_path):
        return YOLO(weights_path)
    else:
        print(f"Warning: ultralytics package or {weights_path} not found. Using MockYOLO.")
        return MockYOLO(weights_path)

def run_inference(image, model):
    """
    Runs YOLOv8 inference on a preprocessed PIL image.
    Returns:
        list of dicts containing bounding boxes, confidences, and labels.
    """
    results = model(image, conf=0.25)[0]
    
    faults = []
    boxes = results.boxes
    if hasattr(boxes, 'xyxy') and len(boxes.xyxy) > 0:
        for i in range(len(boxes.xyxy)):
            # Handle both Mock YOLO lists and PyTorch tensors
            box = boxes.xyxy[i]
            if hasattr(box, 'tolist'):
                box = box.tolist()
                
            confidence = boxes.conf[i]
            if hasattr(confidence, 'item'):
                confidence = confidence.item()
            else:
                confidence = float(confidence)
                
            class_id = boxes.cls[i]
            if hasattr(class_id, 'item'):
                class_id = class_id.item()
            else:
                class_id = int(class_id)
                
            label = results.names[class_id]
            
            faults.append({
                'label': label,
                'confidence': confidence,
                'bounding_box': box
            })
            
    return faults
