import os
from PIL import Image

def create_mock_dataset():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, 'datasets', 'solar_panels')
    
    # Create required YOLOv8 directory structure
    dirs = [
        os.path.join(dataset_dir, 'images', 'train'),
        os.path.join(dataset_dir, 'images', 'val'),
        os.path.join(dataset_dir, 'labels', 'train'),
        os.path.join(dataset_dir, 'labels', 'val'),
    ]
    
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        
    print("Created dataset directories...")

    # Create dummy images and labels
    for split in ['train', 'val']:
        for i in range(2): # 2 images per split
            # Create a simple dark blue image to simulate a solar panel
            img = Image.new('RGB', (640, 640), color = (10, 20, 50))
            img_path = os.path.join(dataset_dir, 'images', split, f'mock_{i}.jpg')
            img.save(img_path)
            
            # Create a mock YOLO label (class_id x_center y_center width height)
            label_path = os.path.join(dataset_dir, 'labels', split, f'mock_{i}.txt')
            with open(label_path, 'w') as f:
                # Class 0 (Hotspot) at center with 10% width/height
                f.write("0 0.5 0.5 0.1 0.1\n")
                
    print(f"Mock dataset successfully created at: {dataset_dir}")

if __name__ == '__main__':
    create_mock_dataset()
