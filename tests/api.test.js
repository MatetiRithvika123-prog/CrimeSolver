const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import the app
const app = require('../server/server');

// Test case data
const testCase = {
    caseId: 'TEST-001',
    images: ['test-image.jpg'],
    prediction: 'homicide',
    confidence: 0.85,
    evidenceDetected: ['knife', 'blood'],
    createdAt: new Date()
};

describe('CrimeSceneSolver API Tests', () => {
    let server;

    beforeAll(async () => {
        // Start server for testing
        server = app.listen(0); // Use random port for testing
        
        // Connect to test database
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crimescenesolver_test';
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        // Clean up database
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        
        // Close server
        server.close();
    });

    describe('POST /api/analyze', () => {
        it('should return 400 when no image is provided', async () => {
            const response = await request(app)
                .post('/api/analyze')
                .send();

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('No image file provided');
        });

        it('should analyze image and return results', async () => {
            // Create a test image file
            const testImagePath = path.join(__dirname, 'test-image.jpg');
            const testImageBuffer = Buffer.from('fake-image-data');
            fs.writeFileSync(testImagePath, testImageBuffer);

            const response = await request(app)
                .post('/api/analyze')
                .attach('image', testImagePath);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('crime_prediction');
            expect(response.body).toHaveProperty('confidence');
            expect(response.body).toHaveProperty('detected_evidence');
            expect(typeof response.body.confidence).toBe('number');
            expect(Array.isArray(response.body.detected_evidence)).toBe(true);

            // Clean up test file
            fs.unlinkSync(testImagePath);
        });
    });

    describe('GET /api/cases', () => {
        it('should return empty array initially', async () => {
            const response = await request(app)
                .get('/api/cases');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /api/cases', () => {
        it('should save a new case', async () => {
            const response = await request(app)
                .post('/api/cases')
                .send(testCase);

            expect(response.status).toBe(201);
            expect(response.body.caseId).toBe(testCase.caseId);
            expect(response.body.prediction).toBe(testCase.prediction);
            expect(response.body.confidence).toBe(testCase.confidence);
            expect(response.body.evidenceDetected).toEqual(testCase.evidenceDetected);
        });

        it('should return validation error for invalid data', async () => {
            const invalidCase = {
                caseId: 'TEST-002',
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/cases')
                .send(invalidCase);

            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/cases/:caseId', () => {
        it('should return specific case', async () => {
            const response = await request(app)
                .get(`/api/cases/${testCase.caseId}`);

            expect(response.status).toBe(200);
            expect(response.body.caseId).toBe(testCase.caseId);
        });

        it('should return 404 for non-existent case', async () => {
            const response = await request(app)
                .get('/api/cases/NON-EXISTENT');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Case not found');
        });
    });

    describe('POST /api/report', () => {
        it('should generate PDF report', async () => {
            const response = await request(app)
                .post('/api/report')
                .send(testCase);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('application/pdf');
            expect(response.headers['content-disposition']).toContain('attachment');
        });
    });

    describe('DELETE /api/cases/:caseId', () => {
        it('should delete existing case', async () => {
            const response = await request(app)
                .delete(`/api/cases/${testCase.caseId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Case deleted successfully');
        });

        it('should return 404 for non-existent case deletion', async () => {
            const response = await request(app)
                .delete('/api/cases/NON-EXISTENT');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Case not found');
        });
    });

    describe('Frontend Routes', () => {
        it('should serve index page', async () => {
            const response = await request(app)
                .get('/');

            expect(response.status).toBe(200);
            expect(response.text).toContain('CrimeSceneSolver');
        });

        it('should serve dashboard page', async () => {
            const response = await request(app)
                .get('/dashboard.html');

            expect(response.status).toBe(200);
        });

        it('should serve upload page', async () => {
            const response = await request(app)
                .get('/upload.html');

            expect(response.status).toBe(200);
        });

        it('should serve results page', async () => {
            const response = await request(app)
                .get('/results.html');

            expect(response.status).toBe(200);
        });

        it('should serve cases page', async () => {
            const response = await request(app)
                .get('/cases.html');

            expect(response.status).toBe(200);
        });
    });
});
