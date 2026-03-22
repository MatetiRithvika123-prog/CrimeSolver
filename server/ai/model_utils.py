# ai/model_utils.py
from PIL import Image
import torch
import clip

device = "cuda" if torch.cuda.is_available() else "cpu"

def load_clip():
    model, preprocess = clip.load("ViT-B/32", device=device)
    return model, preprocess
