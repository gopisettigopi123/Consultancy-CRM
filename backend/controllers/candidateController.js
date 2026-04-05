const Candidate = require('../models/Candidate');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all candidates (with filters and pagination)
// @route   GET /api/candidates
// @access  Private
exports.getCandidates = async (req, res) => {
    try {
        const { technology, location, status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (technology) query.technology = { $regex: technology, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const total = await Candidate.countDocuments(query);
        const candidates = await Candidate.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / limit), data: candidates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, error: 'Candidate not found' });
        res.json({ success: true, data: candidate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create candidate
// @route   POST /api/candidates
// @access  Private
exports.createCandidate = async (req, res) => {
    try {
        const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;
        let dl = req.body.drivingLicense;
        if (typeof dl === 'string') dl = dl.split(',').filter(Boolean);
        const candidate = await Candidate.create({ ...req.body, drivingLicense: dl, resumeUrl });

        await ActivityLog.create({
            user: req.user._id,
            action: 'CREATED_CANDIDATE',
            details: `Created candidate: ${candidate.fullName}`,
        });

        res.status(201).json({ success: true, data: candidate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
exports.updateCandidate = async (req, res) => {
    try {
        let dl = req.body.drivingLicense;
        if (typeof dl === 'string') req.body.drivingLicense = dl.split(',').filter(Boolean);

        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!candidate) return res.status(404).json({ success: false, error: 'Candidate not found' });

        await ActivityLog.create({
            user: req.user._id,
            action: 'UPDATED_CANDIDATE',
            details: `Updated candidate: ${candidate.fullName}`,
        });

        res.json({ success: true, data: candidate });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private (Admin only)
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, error: 'Candidate not found' });

        await ActivityLog.create({
            user: req.user._id,
            action: 'DELETED_CANDIDATE',
            details: `Deleted candidate: ${candidate.fullName}`,
        });

        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Export candidates to Excel
// @route   GET /api/candidates/export
// @access  Private
exports.exportCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        // Simple CSV export
        const headers = ['Full Name', 'Email', 'Phone', 'WhatsApp Number', 'Technology', 'Experience', 'Location', 'Driving License', 'LinkedIn'];
        const rows = candidates.map(c => [
            c.fullName, c.email, c.phoneNumber, c.whatsappNumber || '', c.technology,
            c.experience, c.location || '', c.drivingLicense?.join('; ') || '',
            c.linkedinProfile || ''
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(v => `"${v}"`).join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=candidates.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
