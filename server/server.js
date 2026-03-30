const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const crimeRoutes = require('../routes/crimeRoutes');
const caseRoutes = require('../routes/caseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client directory
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/login.html"));
});
app.use(express.static("client"));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crimescenesolver', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/analyze', crimeRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/report', caseRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/upload.html'));
});

app.get('/results.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/results.html'));
});

app.get('/cases.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/cases.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`CrimeSceneSolver server running on port ${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
});
