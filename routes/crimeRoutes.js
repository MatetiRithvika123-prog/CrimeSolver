const express = require('express');
const router = express.Router();
const crimeController = require('../controllers/crimeController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Analyze crime scene image
router.post('/', uploadMiddleware.single('image'), crimeController.analyzeImage);

module.exports = router;
