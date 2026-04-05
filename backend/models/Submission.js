const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
    rate: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Submitted', 'Interview Scheduled', 'Rejected', 'Selected'],
        default: 'Submitted',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Submission', submissionSchema);
