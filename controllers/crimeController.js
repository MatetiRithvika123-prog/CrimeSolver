const axios = require("axios");
const fs = require("fs");

const HF_URL = "https://matetirithvika-crime-ai-analyzer.hf.space/api/predict";

class CrimeController {
  async analyzeImage(req, res) {
    try {

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const imagePath = req.file.path;

      // Convert image to base64 (Gradio expects this)
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString("base64");

      const payload = {
        data: [`data:image/png;base64,${base64Image}`]
      };

      const response = await axios.post(HF_URL, payload, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 60000
      });

      const result = response.data.data[0];

      res.json(result);

    } catch (error) {

      console.error("Analysis error:", error.message);

      res.status(500).json({
        error: "Failed to analyze image"
      });

    }
  }
}

module.exports = new CrimeController();