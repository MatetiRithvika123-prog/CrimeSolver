const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const HF_URL = "https://matetirithvika-crime-ai-analyzer.hf.space/";

class CrimeController {
  async analyzeImage(req, res) {
    try {

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const form = new FormData();
      form.append("image", fs.createReadStream(req.file.path));

      const response = await axios.post(HF_URL, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        timeout: 60000
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