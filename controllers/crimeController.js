const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const HF_URL = "https://matetirithvika-crime-ai-analyzer.hf.space/api/predict";

class CrimeController {
    async analyzeImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No image file provided" });
            }

            const imagePath = req.file.path;

            // Prepare form data for HuggingFace request
            const form = new FormData();
            form.append("image", fs.createReadStream(imagePath));

            // Send image to HuggingFace Space
            const response = await axios.post(
                HF_URL,
                form,
                { headers: form.getHeaders() }
            );

            // Remove temporary uploaded file
            fs.unlinkSync(imagePath);

            return res.json(response.data);

        } catch (error) {
            console.error("Analysis error:", error.message);
            return res.status(500).json({ error: "Failed to analyze image" });
        }
    }
}

module.exports = new CrimeController();