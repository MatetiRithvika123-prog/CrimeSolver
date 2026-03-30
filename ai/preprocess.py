#!/usr/bin/env python3

import cv2
import numpy as np
from PIL import Image
import os

class ImagePreprocessor:
    def __init__(self):
        self.target_size = (224, 224)  # Standard size for CLIP model
    
    def preprocess(self, image_path: str) -> np.ndarray:
        """
        Preprocess image for AI analysis
        """
        try:
            # Check if file exists
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")
            
            # Load image using PIL
            image = Image.open(image_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to target size
            image = image.resize(self.target_size, Image.Resampling.LANCZOS)
            
            # Convert to numpy array
            image_array = np.array(image)
            
            # Normalize pixel values to [0, 1]
            image_array = image_array.astype(np.float32) / 255.0
            
            # Apply basic enhancement
            image_array = self.enhance_image(image_array)
            
            return image_array
            
        except Exception as e:
            print(f"Error preprocessing image: {str(e)}")
            raise
    
    def enhance_image(self, image: np.ndarray) -> np.ndarray:
        """
        Apply basic image enhancement
        """
        try:
            # Convert back to uint8 for OpenCV operations
            image_uint8 = (image * 255).astype(np.uint8)
            
            # Apply histogram equalization for better contrast
            if len(image_uint8.shape) == 3:
                # Convert to YUV color space
                yuv = cv2.cvtColor(image_uint8, cv2.COLOR_RGB2YUV)
                
                # Apply histogram equalization to Y channel
                yuv[:,:,0] = cv2.equalizeHist(yuv[:,:,0])
                
                # Convert back to RGB
                enhanced = cv2.cvtColor(yuv, cv2.COLOR_YUV2RGB)
            else:
                # Grayscale image
                enhanced = cv2.equalizeHist(image_uint8)
            
            # Convert back to float [0, 1]
            enhanced_float = enhanced.astype(np.float32) / 255.0
            
            return enhanced_float
            
        except Exception as e:
            print(f"Error enhancing image: {str(e)}")
            return image  # Return original if enhancement fails
    
    def validate_image(self, image_path: str) -> bool:
        """
        Validate if the file is a valid image
        """
        try:
            with Image.open(image_path) as img:
                img.verify()
            return True
        except Exception:
            return False
    
    def get_image_info(self, image_path: str) -> dict:
        """
        Get basic information about the image
        """
        try:
            with Image.open(image_path) as img:
                return {
                    "format": img.format,
                    "mode": img.mode,
                    "size": img.size,
                    "file_size": os.path.getsize(image_path)
                }
        except Exception as e:
            print(f"Error getting image info: {str(e)}")
            return {}
