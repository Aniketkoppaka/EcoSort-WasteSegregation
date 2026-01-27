
"""
YOLO Detection Utilities for Waste Segregation System
"""

import cv2
import numpy as np
from pathlib import Path
from ultralytics import YOLO


class WasteDetector:
    """
    Waste object detector using trained YOLOv8 model.
    """

    def __init__(self, model_path, confidence_threshold=0.5, iou_threshold=0.45):
        """
        Initialize the waste detector.

        Args:
            model_path: Path to the trained YOLO model weights
            confidence_threshold: Minimum confidence for detections
            iou_threshold: IoU threshold for NMS
        """
        self.model = YOLO(str(model_path))
        self.conf_threshold = confidence_threshold
        self.iou_threshold = iou_threshold

    def detect(self, image):
        """
        Detect waste objects in an image.

        Args:
            image: Image path or numpy array (BGR format)

        Returns:
            List of detections with bounding boxes and confidence scores
        """
        results = self.model.predict(
            source=image,
            conf=self.conf_threshold,
            iou=self.iou_threshold,
            verbose=False
        )

        detections = []
        result = results[0]

        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = box.conf[0].item()
            cls = int(box.cls[0].item())

            detections.append({
                'bbox': [int(x1), int(y1), int(x2), int(y2)],
                'confidence': conf,
                'class_id': cls,
                'class_name': result.names[cls]
            })

        return detections

    def detect_and_crop(self, image):
        """
        Detect waste objects and return cropped regions.

        Args:
            image: Image path or numpy array

        Returns:
            List of tuples: (cropped_image, detection_info)
        """
        if isinstance(image, (str, Path)):
            img = cv2.imread(str(image))
        else:
            img = image.copy()

        detections = self.detect(img)
        crops = []

        for det in detections:
            x1, y1, x2, y2 = det['bbox']
            cropped = img[y1:y2, x1:x2]
            crops.append((cropped, det))

        return crops

    def draw_detections(self, image, detections=None):
        """
        Draw bounding boxes on image.

        Args:
            image: Image path or numpy array
            detections: Optional list of detections (will detect if not provided)

        Returns:
            Annotated image
        """
        if isinstance(image, (str, Path)):
            img = cv2.imread(str(image))
        else:
            img = image.copy()

        if detections is None:
            detections = self.detect(img)

        for det in detections:
            x1, y1, x2, y2 = det['bbox']
            conf = det['confidence']

            # Draw box
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # Draw label
            label = f"waste: {conf:.2f}"
            cv2.putText(img, label, (x1, y1-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        return img
