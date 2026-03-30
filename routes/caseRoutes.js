const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// Get all cases
router.get('/', caseController.getAllCases);

// Get specific case
router.get('/:caseId', caseController.getCase);

// Save new case
router.post('/', caseController.saveCase);

// Generate PDF report
router.post('/report', caseController.generateReport);

// Delete case
router.delete('/:caseId', caseController.deleteCase);

module.exports = router;
