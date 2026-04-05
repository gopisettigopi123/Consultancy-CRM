const mongoose = require('mongoose');

const marketingSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    marketingStartDate: {
        type: Date,
    },
    marketingEmailId: {
        type: String,
        required: true,
    },
    vendorSubmissionCount: {
        type: Number,
        default: 0,
    },
    dailySubmissionTracker: [{
        date: {
            type: Date,
            default: Date.now,
        },
        count: {
            type: Number,
            default: 0,
        }
    }],
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Marketing', marketingSchema);
