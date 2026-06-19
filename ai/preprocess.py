from PIL import Image, ExifTags
import hashlib
import io

def get_exif_data(image):
    exif_data = {}
    if hasattr(image, '_getexif') and image._getexif() is not None:
        for tag, value in image._getexif().items():
            decoded = ExifTags.TAGS.get(tag, tag)
            exif_data[decoded] = value
    return exif_data

def get_gps_info(exif_data):
    gps_info = exif_data.get('GPSInfo')
    if not gps_info:
        return None, None
    
    # Helper to convert GPS coordinates to decimal degrees
    def convert_to_degrees(value):
        try:
            d = float(value[0])
            m = float(value[1])
            s = float(value[2])
            return d + (m / 60.0) + (s / 3600.0)
        except (TypeError, ValueError, ZeroDivisionError):
            return None

    try:
        lat = convert_to_degrees(gps_info[2])
        if gps_info[1] == 'S' and lat is not None:
            lat = -lat
        
        lon = convert_to_degrees(gps_info[4])
        if gps_info[3] == 'W' and lon is not None:
            lon = -lon
            
        return lat, lon
    except Exception:
        return None, None

def get_fake_gps(image_path_or_name: str):
    """Deterministic fake GPS for images without EXIF — for demo/dev only.
    Scatters points around a sample solar farm in Rajasthan, India.
    """
    name = str(image_path_or_name)
    h = int(hashlib.md5(name.encode()).hexdigest(), 16)
    base_lat, base_lon = 26.9124, 75.7873  # ~Jaipur solar belt
    lat = base_lat + (h % 1000) / 10000   # ±0.1 degree spread
    lon = base_lon + (h % 700)  / 10000
    return round(lat, 6), round(lon, 6)

def preprocess_image(image_path_or_file):
    """
    Extracts GPS coordinates and resizes the image to 640x640.
    Falls back to deterministic fake GPS when EXIF data is absent
    (useful for demo/dev with manually-uploaded images).
    Returns:
        tuple: (resized_pil_image, latitude, longitude)
    """
    image = Image.open(image_path_or_file)
    
    # Extract EXIF
    exif = get_exif_data(image)
    lat, lon = get_gps_info(exif)

    # Fallback: inject fake GPS so the heatmap always has data in dev
    if lat is None or lon is None:
        source_name = getattr(image_path_or_file, 'name', str(image_path_or_file))
        lat, lon = get_fake_gps(source_name)

    # Ensure RGB mode
    if image.mode != 'RGB':
        image = image.convert('RGB')
        
    # Resize for YOLOv8 (640x640)
    resized_image = image.resize((640, 640), Image.Resampling.LANCZOS)
    
    return resized_image, lat, lon
