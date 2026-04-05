const Marketing = require('../models/Marketing');

exports.getAllMarketing = async (req, res) => {
    try {
        const data = await Marketing.find().populate('candidate', 'fullName email technology');
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMarketingByCandidate = async (req, res) => {
    try {
        const data = await Marketing.findOne({ candidate: req.params.candidateId });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createMarketing = async (req, res) => {
    try {
        const data = await Marketing.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateMarketing = async (req, res) => {
    try {
        const data = await Marketing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ success: false, error: 'Marketing record not found' });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
