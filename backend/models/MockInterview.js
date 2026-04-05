const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    mockType: {
        type: String,
        enum: ['Technical', 'Final'],
        required: true,
    },
    score: {
        type: Number,
    },
    feedback: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pass', 'Fail'],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
