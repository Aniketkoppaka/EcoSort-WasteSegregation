
"""
Waste Segregation Pipeline
Unified interface for waste detection, classification, and anomaly detection.
"""

import numpy as np
from pathlib import Path
import yaml
import cv2
from datetime import datetime

import tensorflow as tf
from tensorflow import keras
from ultralytics import YOLO


class WasteSegregationPipeline:
    """
    Complete pipeline for waste segregation using:
    - YOLO for object detection
    - MobileNet for classification
    - Autoencoder for anomaly detection
    """

    def __init__(self, models_dir=None):
        """
        Initialize pipeline with models from specified directory.

        Args:
            models_dir: Path to models directory. If None, uses default.
        """
        if models_dir is None:
            models_dir = Path(__file__).parent.parent / "models"
        else:
            models_dir = Path(models_dir)

        # Load models
        self.detector = YOLO(str(models_dir / "yolo" / "waste_detector_best.pt"))
        self.classifier = keras.models.load_model(
            str(models_dir / "mobilenet" / "waste_classifier_final.keras")
        )
        self.autoencoder = keras.models.load_model(
            str(models_dir / "autoencoder" / "autoencoder_final.keras")
        )

        # Load configs
        with open(models_dir / "mobilenet" / "class_mapping.yaml", "r") as f:
            self.class_names = yaml.safe_load(f)["classes"]

        with open(models_dir / "autoencoder" / "anomaly_config.yaml", "r") as f:
            config = yaml.safe_load(f)
            self.anomaly_threshold = config["threshold"]

        # Image sizes
        self.classifier_size = (224, 224)
        self.autoencoder_size = (128, 128)

        # Disposal info
        self.disposal_info = {
            "recyclable": {
                "bin": "Blue Bin (Recyclables)",
                "instructions": "Clean and dry before disposing."
            },
            "organic": {
                "bin": "Green Bin (Organic)",
                "instructions": "Compostable waste only."
            },
            "e-waste": {
                "bin": "E-Waste Collection Point",
                "instructions": "Take to designated collection center."
            },
            "general": {
                "bin": "Black Bin (General Waste)",
                "instructions": "Non-recyclable waste."
            }
        }

    def analyze(self, image_path):
        """
        Analyze a waste image.

        Args:
            image_path: Path to image or numpy array (RGB)

        Returns:
            Dictionary with classification, anomaly detection, and disposal info
        """
        # Load image
        if isinstance(image_path, (str, Path)):
            image = cv2.imread(str(image_path))
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        else:
            image = image_path

        # Classification
        img_class = cv2.resize(image, self.classifier_size)
        img_class = img_class.astype(np.float32) / 255.0
        img_class = np.expand_dims(img_class, axis=0)

        preds = self.classifier.predict(img_class, verbose=0)[0]
        class_idx = int(np.argmax(preds))
        class_name = self.class_names[class_idx]
        confidence = float(preds[class_idx])

        # Anomaly detection
        img_ae = cv2.resize(image, self.autoencoder_size)
        img_ae = img_ae.astype(np.float32) / 255.0
        img_ae = np.expand_dims(img_ae, axis=0)

        recon = self.autoencoder.predict(img_ae, verbose=0)
        error = float(np.mean((img_ae - recon) ** 2))
        is_anomaly = error > self.anomaly_threshold

        # Get disposal recommendation
        if is_anomaly:
            disposal = {
                "bin": "Unknown - Consult local guidelines",
                "instructions": "This item appears unusual."
            }
        else:
            disposal = self.disposal_info.get(class_name, self.disposal_info["general"])

        return {
            "waste_type": class_name,
            "confidence": confidence,
            "is_anomaly": is_anomaly,
            "anomaly_score": error / self.anomaly_threshold,
            "disposal": disposal,
            "timestamp": datetime.now().isoformat()
        }

    def detect(self, image_path, conf=0.5):
        """
        Detect waste objects in image using YOLO.

        Returns:
            YOLO results object
        """
        return self.detector.predict(image_path, conf=conf, verbose=False)


def main():
    """Demo usage."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <image_path>")
        return

    image_path = sys.argv[1]

    # Initialize pipeline
    pipeline = WasteSegregationPipeline()

    # Analyze image
    result = pipeline.analyze(image_path)

    print("
Waste Analysis Result:")
    print(f"  Type: {result['waste_type'].upper()}")
    print(f"  Confidence: {result['confidence']:.1%}")
    print(f"  Anomaly: {'Yes' if result['is_anomaly'] else 'No'}")
    print(f"  Disposal: {result['disposal']['bin']}")


if __name__ == "__main__":
    main()
