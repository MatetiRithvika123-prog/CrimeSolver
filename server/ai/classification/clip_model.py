def classify_scene(image_path):
    # Try to import and run CLIP-based inference if available
    try:
        from PIL import Image
        import torch
        try:
            import clip
            model_name = "clip"
            # load CLIP model (this will use cached weights if present)
            device = "cuda" if torch.cuda.is_available() else "cpu"
            model, preprocess = clip.load("ViT-B/32", device=device, jit=False)
            # prepare labels (example forensic classes)
            labels = ["armed robbery", "burglary", "homicide", "fire", "accident", "vandalism", "weapon", "suspicious person", "vehicle"]
            # load and preprocess image
            image = preprocess(Image.open(image_path).convert("RGB")).unsqueeze(0).to(device)
            with torch.no_grad():
                image_features = model.encode_image(image)
                image_features /= image_features.norm(dim=-1, keepdim=True)
            # text features
            text_inputs = clip.tokenize(labels).to(device)
            with torch.no_grad():
                text_features = model.encode_text(text_inputs)
                text_features /= text_features.norm(dim=-1, keepdim=True)
            # similarity
            sims = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            topv, topi = sims[0].topk(3)
            predictions = []
            for score, idx in zip(topv.tolist(), topi.tolist()):
                predictions.append({"label": labels[idx], "score": float(round(score, 4))})
            result = {
                "image": image_path,
                "engine": "CLIP ViT-B/32",
                "predictions": predictions,
                "raw_scores": [float(round(float(x),6)) for x in sims[0].tolist()]
            }
            return result
        except Exception as e_inner:
            # clip import or inference failed — return error detail so we can debug
            tb = traceback.format_exc()
            return {
                "image": image_path,
                "engine": "clip-not-available",
                "error": str(e_inner),
                "traceback": tb
            }
    except Exception as e:
        tb = traceback.format_exc()
        return {
            "image": image_path if image_path else None,
            "engine": "python-deps-missing",
            "error": str(e),
            "traceback": tb
        }