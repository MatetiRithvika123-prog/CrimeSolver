const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseId: {
        type: String,
        required: true,
        unique: true
    },
    images: [{
        type: String,
        required: true
    }],
    prediction: {
        type: String,
        required: true,
        //enum: ['homicide', 'robbery', 'assault', 'kidnapping', 'drug crime']
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    evidenceDetected: [{
        type: String,
        enum: ['knife', 'gun', 'blood', 'drugs', 'broken glass']
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Case', caseSchema);
