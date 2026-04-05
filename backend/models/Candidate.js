const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    technology: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    resumeUrl: {
        type: String,
        default: null,
    },
    linkedinProfile: {
        type: String,
    },
    location: {
        type: String,
        default: '',
    },
    drivingLicense: {
        type: [String],
        default: [],
    },
    whatsappNumber: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Candidate', candidateSchema);
