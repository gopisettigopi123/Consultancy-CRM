const mongoose = require('mongoose');

const candidatePaymentSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Paid', 'Overdue'],
        default: 'Upcoming',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CandidatePayment', candidatePaymentSchema);
