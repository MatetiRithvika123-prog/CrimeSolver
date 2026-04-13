const axios = require("axios");
const fs = require("fs");

const HF_URL = "https://matetirithvika-crime-ai-analyzer.hf.space/call/predict";

class CrimeController {

  async analyzeImage(req, res) {

    try {

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const imageBuffer = fs.readFileSync(req.file.path);
      const base64 = imageBuffer.toString("base64");

      const response = await axios.post(HF_URL, {
        data: [`data:image/png;base64,${base64}`]
      });

      res.json(response.data);

    } catch (error) {

      console.error("Analysis error:", error.response?.data || error.message);

      res.status(500).json({
        error: "Failed to analyze image"
      });

    }

  }

}

module.exports = new CrimeController();