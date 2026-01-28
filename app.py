"""
Flask Web Application for Waste Segregation System
"""

import os
from pathlib import Path
from flask import Flask, render_template, request, jsonify, url_for
from werkzeug.utils import secure_filename
import numpy as np
import cv2
from PIL import Image
import io
import base64

# TensorFlow/Keras
import tensorflow as tf
from tensorflow import keras

# YOLO
from ultralytics import YOLO

# Configuration
PROJECT_ROOT = Path(__file__).parent
UPLOAD_FOLDER = PROJECT_ROOT / "static" / "uploads"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Model paths
YOLO_MODEL_PATH = PROJECT_ROOT / "models" / "yolo" / "waste_detector_best.pt"
CLASSIFIER_MODEL_PATH = PROJECT_ROOT / "models" / "mobilenet" / "waste_classifier_final.keras"
AUTOENCODER_MODEL_PATH = PROJECT_ROOT / "models" / "autoencoder" / "autoencoder_final.keras"

# Create Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Ensure upload folder exists
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# Class names and disposal info
CLASS_NAMES = ['recyclable', 'organic', 'e-waste', 'general']

DISPOSAL_INFO = {
    'recyclable': {
        'bin': 'Blue Bin (Recyclables)',
        'icon': '♻️',
        'color': '#2196F3',
        'instructions': 'Clean and dry before disposing. Remove caps and labels if possible.',
        'examples': 'Plastic bottles, cardboard, paper, glass, metal cans'
    },
    'organic': {
        'bin': 'Green Bin (Organic)',
        'icon': '🟢',
        'color': '#4CAF50',
        'instructions': 'Compostable waste only. No plastic bags.',
        'examples': 'Food scraps, yard waste, coffee grounds, eggshells'
    },
    'e-waste': {
        'bin': 'E-Waste Collection Point',
        'icon': '🔴',
        'color': '#f44336',
        'instructions': 'Take to designated e-waste collection center. Do not throw in regular trash.',
        'examples': 'Batteries, phones, computers, cables, electronics'
    },
    'general': {
        'bin': 'Black Bin (General Waste)',
        'icon': '⚫',
        'color': '#424242',
        'instructions': 'Non-recyclable, non-hazardous waste.',
        'examples': 'Styrofoam, certain plastics, mixed materials'
    }
}

# Load anomaly threshold
ANOMALY_THRESHOLD = 0.035641  # Default, will be loaded from config

# Global model variables
yolo_model = None
classifier_model = None
autoencoder_model = None


def load_models():
    """Load all models on startup."""
    global yolo_model, classifier_model, autoencoder_model, ANOMALY_THRESHOLD
    
    print("🔄 Loading models...")
    
    # Load YOLO
    if YOLO_MODEL_PATH.exists():
        yolo_model = YOLO(str(YOLO_MODEL_PATH))
        print("   ✅ YOLO loaded")
    else:
        print("   ❌ YOLO model not found")
    
    # Load Classifier
    if CLASSIFIER_MODEL_PATH.exists():
        classifier_model = keras.models.load_model(str(CLASSIFIER_MODEL_PATH))
        print("   ✅ Classifier loaded")
    else:
        print("   ❌ Classifier model not found")
    
    # Load Autoencoder
    if AUTOENCODER_MODEL_PATH.exists():
        autoencoder_model = keras.models.load_model(str(AUTOENCODER_MODEL_PATH))
        print("   ✅ Autoencoder loaded")
    else:
        print("   ❌ Autoencoder model not found")
    
    # Load anomaly config
    anomaly_config_path = PROJECT_ROOT / "models" / "autoencoder" / "anomaly_config.yaml"
    if anomaly_config_path.exists():
        import yaml
        with open(anomaly_config_path, 'r') as f:
            config = yaml.safe_load(f)
            ANOMALY_THRESHOLD = config.get('threshold', 0.035641)
    
    print("✅ All models loaded!")


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Flag to determine which preprocessing to use
# Set to True after training EfficientNet and deploying it
USE_EFFICIENTNET = True  # Change to True after EfficientNet training


def preprocess_for_classifier(image, target_size=(224, 224)):
    """Preprocess image for classifier (MobileNet or EfficientNet)."""
    if isinstance(image, np.ndarray):
        img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    else:
        img = image
    
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    img_array = np.array(img, dtype=np.float32)
    
    if USE_EFFICIENTNET:
        # EfficientNet preprocessing
        from tensorflow.keras.applications.efficientnet import preprocess_input
        img_array = np.expand_dims(img_array, axis=0)
        return preprocess_input(img_array)
    else:
        # MobileNetV2 preprocessing (0-1 normalization)
        img_array = img_array / 255.0
        return np.expand_dims(img_array, axis=0)


def preprocess_for_autoencoder(image, target_size=(128, 128)):
    """Preprocess image for autoencoder."""
    if isinstance(image, np.ndarray):
        img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    else:
        img = image
    
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


def analyze_image(image_path):
    """Run full analysis pipeline on an image."""
    # Read image
    image = cv2.imread(str(image_path))
    if image is None:
        return None
    
    result = {
        'success': True,
        'detection': None,
        'classification': None,
        'anomaly': None,
        'disposal': None
    }
    
    # 1. YOLO Detection
    if yolo_model is not None:
        detections = yolo_model(image, verbose=False)
        if len(detections) > 0 and len(detections[0].boxes) > 0:
            box = detections[0].boxes[0]
            result['detection'] = {
                'detected': True,
                'confidence': float(box.conf[0]),
                'bbox': box.xyxy[0].tolist()
            }
        else:
            result['detection'] = {'detected': False, 'confidence': 0}
    
    # 2. Classification
    if classifier_model is not None:
        img_processed = preprocess_for_classifier(image)
        predictions = classifier_model.predict(img_processed, verbose=0)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        waste_type = CLASS_NAMES[class_idx]
        
        result['classification'] = {
            'waste_type': waste_type,
            'confidence': confidence,
            'all_probabilities': {
                CLASS_NAMES[i]: float(predictions[0][i]) 
                for i in range(len(CLASS_NAMES))
            }
        }
        
        # Get disposal info
        result['disposal'] = DISPOSAL_INFO[waste_type]
    
    # 3. Anomaly Detection
    if autoencoder_model is not None:
        img_processed = preprocess_for_autoencoder(image)
        reconstructed = autoencoder_model.predict(img_processed, verbose=0)
        mse = np.mean((img_processed - reconstructed) ** 2)
        is_anomaly = mse > ANOMALY_THRESHOLD
        
        result['anomaly'] = {
            'is_anomaly': bool(is_anomaly),
            'reconstruction_error': float(mse),
            'threshold': ANOMALY_THRESHOLD,
            'score': float(mse / ANOMALY_THRESHOLD)
        }
    
    return result


@app.route('/')
def index():
    """Home page."""
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze uploaded image."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    # Save file
    filename = secure_filename(file.filename)
    filepath = Path(app.config['UPLOAD_FOLDER']) / filename
    file.save(str(filepath))
    
    # Analyze
    result = analyze_image(filepath)
    
    if result is None:
        return jsonify({'error': 'Failed to process image'}), 500
    
    # Add image URL to result
    result['image_url'] = url_for('static', filename=f'uploads/{filename}')
    
    return jsonify(result)


@app.route('/result')
def result():
    """Result page (for non-AJAX fallback)."""
    return render_template('result.html')


@app.route('/about')
def about():
    """About page."""
    return render_template('about.html')


# Load models on startup
with app.app_context():
    load_models()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
