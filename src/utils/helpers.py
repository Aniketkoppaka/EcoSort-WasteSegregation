"""
Utility helper functions for the Waste Segregation System
"""

import os
import yaml
import numpy as np
from pathlib import Path


def load_config(config_path: str = None) -> dict:
    """
    Load configuration from YAML file.
    
    Args:
        config_path: Path to config file. If None, uses default config.
        
    Returns:
        Configuration dictionary
    """
    if config_path is None:
        # Get the project root directory
        project_root = Path(__file__).parent.parent.parent
        config_path = project_root / "config" / "config.yaml"
    
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    return config


def create_directory_structure(base_path: str) -> None:
    """
    Create the required directory structure for the project.
    
    Args:
        base_path: Base path for the project
    """
    directories = [
        "datasets/raw/trashnet",
        "datasets/raw/taco",
        "datasets/processed/train/images",
        "datasets/processed/train/labels",
        "datasets/processed/val/images",
        "datasets/processed/val/labels",
        "datasets/processed/test/images",
        "datasets/processed/test/labels",
        "models/yolo",
        "models/mobilenet",
        "models/autoencoder",
        "outputs/detections",
        "outputs/classifications",
        "outputs/metrics",
        "notebooks",
        "src/utils",
        "config"
    ]
    
    for directory in directories:
        dir_path = os.path.join(base_path, directory)
        os.makedirs(dir_path, exist_ok=True)
        print(f"Created: {dir_path}")


def get_project_root() -> Path:
    """
    Get the project root directory.
    
    Returns:
        Path to project root
    """
    return Path(__file__).parent.parent.parent


def normalize_image(image: np.ndarray) -> np.ndarray:
    """
    Normalize image pixels to [0, 1] range.
    
    Args:
        image: Input image array
        
    Returns:
        Normalized image array
    """
    return image.astype(np.float32) / 255.0


def denormalize_image(image: np.ndarray) -> np.ndarray:
    """
    Denormalize image from [0, 1] to [0, 255] range.
    
    Args:
        image: Normalized image array
        
    Returns:
        Denormalized image array (uint8)
    """
    return (image * 255).astype(np.uint8)


def get_category_color(category: str) -> tuple:
    """
    Get color for visualization based on waste category.
    
    Args:
        category: Waste category name
        
    Returns:
        BGR color tuple for OpenCV
    """
    colors = {
        "recyclable": (0, 255, 0),    # Green
        "organic": (0, 165, 255),      # Orange
        "e-waste": (0, 0, 255),        # Red
        "general": (128, 128, 128),    # Gray
        "anomaly": (255, 0, 255)       # Magenta
    }
    return colors.get(category.lower(), (255, 255, 255))


def format_prediction_text(category: str, confidence: float) -> str:
    """
    Format prediction text for display.
    
    Args:
        category: Predicted category
        confidence: Confidence score (0-1)
        
    Returns:
        Formatted string
    """
    return f"{category}: {confidence*100:.1f}%"
