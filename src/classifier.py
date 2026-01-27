
"""
MobileNet Classification Utilities for Waste Segregation System
"""

import numpy as np
from pathlib import Path
import yaml

import tensorflow as tf
from tensorflow import keras


class WasteClassifier:
    """
    Waste category classifier using MobileNetV2.
    """

    def __init__(self, model_path, class_mapping_path=None, image_size=(224, 224)):
        """
        Initialize the waste classifier.

        Args:
            model_path: Path to the trained Keras model
            class_mapping_path: Path to class mapping YAML file
            image_size: Input image size (height, width)
        """
        self.model = keras.models.load_model(str(model_path))
        self.image_size = image_size

        # Load class mapping
        if class_mapping_path and Path(class_mapping_path).exists():
            with open(class_mapping_path, "r") as f:
                self.class_names = yaml.safe_load(f)
        else:
            self.class_names = {0: "recyclable", 1: "organic", 2: "e-waste", 3: "general"}

    def preprocess_image(self, image):
        """
        Preprocess image for classification.

        Args:
            image: numpy array (BGR or RGB) or path to image

        Returns:
            Preprocessed image array
        """
        import cv2

        if isinstance(image, (str, Path)):
            img = cv2.imread(str(image))
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        else:
            img = image.copy()
            if img.shape[-1] == 3 and len(img.shape) == 3:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        img = cv2.resize(img, self.image_size)
        img = img.astype(np.float32) / 255.0

        return img

    def classify(self, image):
        """
        Classify a waste image.

        Args:
            image: Image path or numpy array

        Returns:
            Dictionary with class name, confidence, and all probabilities
        """
        img = self.preprocess_image(image)
        img = np.expand_dims(img, axis=0)

        predictions = self.model.predict(img, verbose=0)
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])

        return {
            "class_id": int(predicted_class),
            "class_name": self.class_names[predicted_class],
            "confidence": confidence,
            "probabilities": {self.class_names[i]: float(p) for i, p in enumerate(predictions[0])}
        }

    def classify_batch(self, images):
        """
        Classify multiple images.

        Args:
            images: List of image paths or numpy arrays

        Returns:
            List of classification results
        """
        results = []
        for img in images:
            results.append(self.classify(img))
        return results
