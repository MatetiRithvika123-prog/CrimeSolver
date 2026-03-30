const Case = require('../models/Case');
const reportService = require('../services/reportService');

class CaseController {
    async getAllCases(req, res) {
        try {
            const cases = await Case.find().sort({ createdAt: -1 });
            res.json(cases);
        } catch (error) {
            console.error('Get cases error:', error);
            res.status(500).json({ error: 'Failed to retrieve cases' });
        }
    }

    async getCase(req, res) {
        try {
            const case_ = await Case.findOne({ caseId: req.params.caseId });
            if (!case_) {
                return res.status(404).json({ error: 'Case not found' });
            }
            res.json(case_);
        } catch (error) {
            console.error('Get case error:', error);
            res.status(500).json({ error: 'Failed to retrieve case' });
        }
    }

    async saveCase(req, res) {
        try {
            const data = req.body;
            // Convert evidence objects to strings if needed
            if (Array.isArray(data.evidenceDetected)) {
                data.evidenceDetected = data.evidenceDetected.map(e =>
                    typeof e === "string" ? e : e.label
                );
            }

            const caseData = new Case(data);
            const savedCase = await caseData.save();
            res.status(201).json(savedCase);
        } catch (error) {
            console.error('Save case error:', error);
            res.status(500).json({ error: 'Failed to save case' });
        }
    }

    async generateReport(req, res) {
        try {
            const pdfBuffer = await reportService.generatePDF(req.body);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="forensic-report-${Date.now()}.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Report generation error:', error);
            res.status(500).json({ error: 'Failed to generate report' });
        }
    }

    async deleteCase(req, res) {
        try {
            const deletedCase = await Case.findOneAndDelete({ caseId: req.params.caseId });
            if (!deletedCase) {
                return res.status(404).json({ error: 'Case not found' });
            }
            res.json({ message: 'Case deleted successfully' });
        } catch (error) {
            console.error('Delete case error:', error);
            res.status(500).json({ error: 'Failed to delete case' });
        }
    }
}

module.exports = new CaseController();
