const Candidate = require('../models/Candidate');
const Vendor = require('../models/Vendor');
const Submission = require('../models/Submission');
const Training = require('../models/Training');
const Marketing = require('../models/Marketing');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const totalCandidates = await Candidate.countDocuments();
        const candidatesInTraining = await Training.countDocuments();
        const candidatesInMarketing = await Marketing.countDocuments();
        
        // Let's get today's start and end date
        const start = new Date();
        start.setHours(0,0,0,0);
        const end = new Date();
        end.setHours(23,59,59,999);

        const totalSubmissionsToday = await Submission.countDocuments({
            submissionDate: { $gte: start, $lt: end }
        });

        const interviewScheduled = await Submission.countDocuments({ status: 'Interview Scheduled' });
        const selectedCount = await Submission.countDocuments({ status: 'Selected' });
        const totalSubmissions = await Submission.countDocuments();

        // Selection rate is Selected / Total Submissions * 100
        const selectionRate = totalSubmissions > 0 ? ((selectedCount / totalSubmissions) * 100).toFixed(1) : 0;

        // Pipeline Status Distribution for Charts
        const pipelineStatus = [
            'Training', 'Mock Pending', 'Mock Completed', 'Final Mock Cleared',
            'Moved to Marketing', 'Submitted to Vendor', 'Interview Scheduled',
            'Selected', 'Rejected'
        ];

        // Since we removed currentStatus from Candidate, we can't just group. 
        // We need to count from specific collections.
        // Let's build a distribution object.
        const distribution = [
            { name: 'Training', value: candidatesInTraining },
            { name: 'Marketing', value: candidatesInMarketing },
            { name: 'Interviews', value: interviewScheduled },
            { name: 'Selected', value: selectedCount }
        ];

        // Mock historical data for trend chart (simulating last 6 months)
        const monthlyStats = [
            { month: 'Oct', submissions: 15, placements: 2 },
            { month: 'Nov', submissions: 22, placements: 4 },
            { month: 'Dec', submissions: 18, placements: 3 },
            { month: 'Jan', submissions: 28, placements: 5 },
            { month: 'Feb', submissions: 35, placements: 6 },
            { month: 'Mar', submissions: totalSubmissions, placements: selectedCount }
        ];

        res.json({
            success: true,
            data: {
                totalCandidates,
                candidatesInTraining,
                candidatesInMarketing,
                totalSubmissionsToday,
                interviewScheduled,
                selectionRate: `${selectionRate}%`,
                distribution,
                monthlyStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
