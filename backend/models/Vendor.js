const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true,
    },
    technology: {
        type: String,
    },
    location: {
        type: String,
    },
    rate: {
        type: String,
    },
    vendorCompany: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    client: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Vendor', vendorSchema);
