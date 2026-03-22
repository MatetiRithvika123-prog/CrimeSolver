#!/usr/bin/env python
# ai/analyze.py
# Robust wrapper: loads CLIP if available, otherwise returns a dummy result.
# Always prints exactly one JSON object to stdout.

import sys
import json
import traceback
import warnings
warnings.filterwarnings("ignore", message="pkg_resources is deprecated.*")
from classification.clip_model import classify_scene


def safe_print_json(obj):
    # Ensure serializable (convert non-serializable parts)
    try:
        print(json.dumps(obj))
    except TypeError:
        # fallback: stringify non-serializable values
        def convert(o):
            try:
                json.dumps(o)
                return o
            except Exception:
                return str(o)
        def deep_convert(x):
            if isinstance(x, dict):
                return {k: deep_convert(v) for k, v in x.items()}
            if isinstance(x, list):
                return [deep_convert(v) for v in x]
            return convert(x)
        print(json.dumps(deep_convert(obj)))

def main():
    try:
        # Accept image path as first arg (Node wrapper passes it)
        image_path = None
        if len(sys.argv) >= 2:
            image_path = sys.argv[1]
        else:
            # No path provided -> return helpful message, not crash
            safe_print_json({"error": "No image path provided. Usage: python analyze.py <image_path>"})
            return 0

        result = classify_scene(image_path)

        # If result indicates an error, it's still a valid JSON response
        safe_print_json(result)
        return 0

    except Exception as e:
        tb = traceback.format_exc()
        safe_print_json({"error": "Unhandled exception in analyzer", "detail": str(e), "traceback": tb})
        return 0

if __name__ == "__main__":
    code = main()
    # Always exit 0 so Node wrapper can parse JSON result.
    # You can change return code behavior later if you want Node to treat failures as non-zero.
    sys.exit(0)
