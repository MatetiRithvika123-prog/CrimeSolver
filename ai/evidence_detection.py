import torch
import clip
from PIL import Image

class EvidenceDetector:

    def __init__(self, model, preprocess, device):
        self.model = model
        self.preprocess = preprocess
        self.device = device

        self.evidence_labels = [
            "a knife weapon",
            "a handgun",
            "blood stains",
            "illegal drugs",
            "broken glass pieces",
            "bullet",
            "tools"
        ]

    def detect_evidence(self, image_path):

        image = self.preprocess(Image.open(image_path)).unsqueeze(0).to(self.device)

        text = clip.tokenize(self.evidence_labels).to(self.device)

        with torch.no_grad():
            image_features = self.model.encode_image(image)
            text_features = self.model.encode_text(text)

        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)

        similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)

        probs = similarity.cpu().numpy()[0]

        detected = []

        threshold = 0.15

        for label, score in zip(self.evidence_labels, probs):
            if score > threshold:
                detected.append({
                    "label": label,
                    "confidence": round(float(score * 100), 2)
                })

        return detected