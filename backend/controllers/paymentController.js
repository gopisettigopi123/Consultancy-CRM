const CandidatePayment = require('../models/CandidatePayment');

// Get all payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await CandidatePayment.find().populate('candidate', 'fullName');
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Create a payment
exports.createPayment = async (req, res) => {
    try {
        const payment = await CandidatePayment.create(req.body);
        const populatedPayment = await CandidatePayment.findById(payment._id).populate('candidate', 'fullName');
        res.status(201).json({ success: true, data: populatedPayment });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Update a payment
exports.updatePayment = async (req, res) => {
    try {
        const payment = await CandidatePayment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('candidate', 'fullName');
        
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
    try {
        const payment = await CandidatePayment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
