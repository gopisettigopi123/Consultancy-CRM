const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    batchName: {
        type: String,
        required: true,
    },
    firstSession: {
        type: Date,
    },
    secondSession: {
        type: Date,
    },
    mockGiven: {
        type: Boolean,
        default: false,
    },
    movedToCallTraining: {
        type: Boolean,
        default: false,
    },
    finalMock: {
        type: Boolean,
        default: false,
    },
    marks: {
        type: String,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Training', trainingSchema);
