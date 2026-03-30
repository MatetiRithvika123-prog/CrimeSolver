const PDFDocument = require('pdfkit');
const fs = require('fs');

class ReportService {
    async generatePDF(caseData) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            // PDF Content
            doc.fontSize(20).text('Crime Analysis Report', { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text('Case Information', { underline: true });
            doc.fontSize(12);
            doc.text(`Case ID: ${caseData.caseId}`);
            doc.text(`Date Analyzed: ${new Date(caseData.createdAt).toLocaleDateString()}`);
            doc.text(`Image Analyzed: ${caseData.images.join(', ')}`);
            doc.moveDown();

            doc.fontSize(14).text('Analysis Results', { underline: true });
            doc.fontSize(12);
            doc.text(`Predicted Crime: ${caseData.prediction.toUpperCase()}`);
            doc.text(`Confidence Score: ${(caseData.confidence * 100).toFixed(1)}%`);
            doc.moveDown();

            doc.fontSize(14).text('Detected Evidence', { underline: true });
            doc.fontSize(12);
            if (caseData.evidenceDetected.length > 0) {
                caseData.evidenceDetected.forEach(evidence => {
                    doc.text(`• ${evidence.toUpperCase()}`);
                });
            } else {
                doc.text('No evidence detected');
            }
            doc.moveDown();

            doc.fontSize(10).text(`Report generated on ${new Date().toLocaleString()}`, { align: 'center' });

            doc.end();
        });
    }
}

module.exports = new ReportService();
