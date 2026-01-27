
"""
Autoencoder Anomaly Detection Utilities for Waste Segregation System
"""

import numpy as np
from pathlib import Path
import yaml
import cv2

import tensorflow as tf
from tensorflow import keras


class AnomalyDetector:
    """
    Anomaly detector using autoencoder reconstruction error.
    """

    def __init__(self, model_path, config_path=None):
        """
        Initialize the anomaly detector.

        Args:
            model_path: Path to the trained autoencoder model
            config_path: Path to anomaly config YAML file
        """
        self.model = keras.models.load_model(str(model_path))

        # Load config
        if config_path and Path(config_path).exists():
            with open(config_path, "r") as f:
                config = yaml.safe_load(f)
                self.threshold = config["threshold"]
                self.image_size = tuple(config["image_size"])
        else:
            self.threshold = 0.02
            self.image_size = (128, 128)

    def preprocess_image(self, image):
        """
        Preprocess image for autoencoder.

        Args:
            image: numpy array (BGR or RGB) or path to image

        Returns:
            Preprocessed image array
        """
        if isinstance(image, (str, Path)):
            img = cv2.imread(str(image))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        else:
            img = image.copy()
            if len(img.shape) == 3 and img.shape[-1] == 3:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        img = cv2.resize(img, self.image_size)
        img = img.astype(np.float32) / 255.0

        return img

    def get_reconstruction_error(self, image):
        """
        Calculate reconstruction error for an image.

        Args:
            image: Image path or numpy array

        Returns:
            Reconstruction error (MSE)
        """
        img = self.preprocess_image(image)
        img = np.expand_dims(img, axis=0)

        reconstructed = self.model.predict(img, verbose=0)
        error = np.mean((img - reconstructed) ** 2)

        return float(error)

    def is_anomaly(self, image):
        """
        Check if an image is an anomaly.

        Args:
            image: Image path or numpy array

        Returns:
            Dictionary with is_anomaly flag and reconstruction error
        """
        error = self.get_reconstruction_error(image)
        is_anomaly = error > self.threshold

        return {
            "is_anomaly": bool(is_anomaly),
            "reconstruction_error": error,
            "threshold": self.threshold,
            "anomaly_score": error / self.threshold  # >1 means anomaly
        }

    def detect_batch(self, images):
        """
        Detect anomalies in multiple images.

        Args:
            images: List of image paths or numpy arrays

        Returns:
            List of anomaly detection results
        """
        results = []
        for img in images:
            results.append(self.is_anomaly(img))
        return results
