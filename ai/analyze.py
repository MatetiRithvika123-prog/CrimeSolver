#!/usr/bin/env python3

import sys
import json
import requests

# HuggingFace Space API URL
HF_API_URL = "https://matetirithvika-crime-ai-analyzer.hf.space/run/predict"


def analyze_image(image_path):
    """
    Send image to HuggingFace AI and return result
    """

    try:
        with open(image_path, "rb") as img:

            response = requests.post(
                HF_API_URL,
                files={"file": img}
            )

        # Parse HuggingFace response
        result = response.json()

        return result

    except Exception as e:

        print(f"Error contacting HuggingFace AI: {str(e)}", file=sys.stderr)

        return {
            "crime_prediction": "unknown",
            "confidence": 0,
            "detected_evidence": []
        }


def main():

    if len(sys.argv) != 2:
        print("Usage: python analyze.py <image_path>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]

    result = analyze_image(image_path)

    print(json.dumps(result))


if __name__ == "__main__":
    main()
