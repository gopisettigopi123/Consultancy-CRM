const Training = require('../models/Training');

exports.getAllTraining = async (req, res) => {
    try {
        const data = await Training.find().populate('candidate', 'fullName email phoneNumber');
        res.json({ success: true, count: data.length, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTrainingByCandidate = async (req, res) => {
    try {
        const data = await Training.findOne({ candidate: req.params.candidateId }).populate('candidate', 'fullName email phoneNumber');
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createTraining = async (req, res) => {
    try {
        const data = await Training.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateTraining = async (req, res) => {
    try {
        const data = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ success: false, error: 'Training record not found' });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
