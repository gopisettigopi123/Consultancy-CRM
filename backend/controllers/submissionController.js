const Submission = require('../models/Submission');

exports.getAllSubmissions = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = status ? { status } : {};
        const total = await Submission.countDocuments(query);
        const data = await Submission.find(query)
            .populate('candidate', 'fullName email technology')
            .populate('vendor', 'vendorName companyName')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ submissionDate: -1 });
        res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createSubmission = async (req, res) => {
    try {
        const data = await Submission.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateSubmission = async (req, res) => {
    try {
        const data = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!data) return res.status(404).json({ success: false, error: 'Submission not found' });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSubmissionsByCandidate = async (req, res) => {
    try {
        const data = await Submission.find({ candidate: req.params.candidateId })
            .populate('vendor', 'vendorName vendorCompany')
            .sort({ submissionDate: -1 });
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

