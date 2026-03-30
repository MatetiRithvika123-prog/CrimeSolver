const pythonService = require('../services/pythonService');

class CrimeController {
    async analyzeImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image file provided' });
            }

            const imagePath = req.file.path;
            const analysis = await pythonService.analyzeImage(imagePath);

            res.json(analysis);
        } catch (error) {
            console.error('Analysis error:', error);
            res.status(500).json({ error: 'Failed to analyze image' });
        }
    }
}

module.exports = new CrimeController();
