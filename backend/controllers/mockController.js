const MockInterview = require('../models/MockInterview');

exports.getAllMocks = async (req, res) => {
    try {
        const data = await MockInterview.find().populate('candidate', 'fullName email technology');
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMocksByCandidate = async (req, res) => {
    try {
        const data = await MockInterview.find({ candidate: req.params.candidateId });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createMock = async (req, res) => {
    try {
        const data = await MockInterview.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateMock = async (req, res) => {
    try {
        const data = await MockInterview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ success: false, error: 'Mock record not found' });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
