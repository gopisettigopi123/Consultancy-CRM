const Candidate = require('../models/Candidate');
const Vendor = require('../models/Vendor');
const Submission = require('../models/Submission');
const Training = require('../models/Training');
const Marketing = require('../models/Marketing');
const Mock = require('../models/MockInterview');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // ── Core Recruitment Pipeline ──
        const totalCandidates = await Candidate.countDocuments();
        const candidatesInTraining = await Training.countDocuments();
        const candidatesInMarketing = await Marketing.countDocuments();

        // Today's window
        const start = new Date();
        start.setHours(0,0,0,0);
        const end = new Date();
        end.setHours(23,59,59,999);

        const totalSubmissionsToday = await Submission.countDocuments({
            submissionDate: { $gte: start, $lt: end }
        });

        const interviewScheduled = await Submission.countDocuments({ status: 'Interview Scheduled' });
        const selectedCount = await Submission.countDocuments({ status: 'Selected' });
        const rejectedCount = await Submission.countDocuments({ status: 'Rejected' });
        const totalSubmissions = await Submission.countDocuments();
        const submittedCount = await Submission.countDocuments({ status: 'Submitted' });


        // ── Vendor Overview ──
        const totalVendors = await Vendor.countDocuments();

        // ── Mock Interview Stats ──
        const totalMocks = await Mock.countDocuments();
        const mocksPassed = await Mock.countDocuments({ status: 'Pass' });
        const mocksFailed = await Mock.countDocuments({ status: 'Fail' });
        const avgMockScore = await Mock.aggregate([
            { $group: { _id: null, average: { $avg: '$score' } } }
        ]);

        // ── Marketing Deep Stats ──
        const totalMarketingSubmissions = await Marketing.aggregate([
            { $group: { _id: null, total: { $sum: '$vendorSubmissionCount' } } }
        ]);

        // ── Admin / User Management Stats ──
        const totalUsers = await User.countDocuments();
        const totalRoles = await Role.countDocuments();

        // ── Technology Breakdown (for bar chart) ──
        const techBreakdown = await Candidate.aggregate([
            { $group: { _id: '$technology', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        // ── Pipeline Distribution (for pie chart) ──
        const distribution = [
            { name: 'Training', value: candidatesInTraining },
            { name: 'Marketing', value: candidatesInMarketing },
            { name: 'Interviews', value: interviewScheduled },
            { name: 'Selected', value: selectedCount },
            { name: 'Rejected', value: rejectedCount },
        ].filter(d => d.value > 0);

        // ── Submission Status Breakdown (for donut chart) ──
        const submissionBreakdown = [
            { name: 'Submitted', value: submittedCount },
            { name: 'Interviewing', value: interviewScheduled },
            { name: 'Selected', value: selectedCount },
            { name: 'Rejected', value: rejectedCount },
        ].filter(d => d.value > 0);

        // ── Monthly trend data ──
        const monthlyStats = [
            { month: 'Oct', submissions: 15, placements: 2 },
            { month: 'Nov', submissions: 22, placements: 4 },
            { month: 'Dec', submissions: 18, placements: 3 },
            { month: 'Jan', submissions: 28, placements: 5 },
            { month: 'Feb', submissions: 35, placements: 6 },
            { month: 'Mar', submissions: totalSubmissions, placements: selectedCount }
        ];

        // ── Mock Performance Trends ──
        const mockPerformance = [
            { name: 'Passed', value: mocksPassed },
            { name: 'Failed', value: mocksFailed },
        ].filter(d => d.value > 0);

        res.json({
            success: true,
            data: {
                // Core stat cards
                totalCandidates,
                candidatesInTraining,
                candidatesInMarketing,
                totalSubmissionsToday,
                interviewScheduled,
                totalVendors,
                totalMocks,
                totalUsers,
                totalRoles,

                // Deep stats for sections
                mocksPassed,
                mocksFailed,
                avgMockScore: avgMockScore[0]?.average?.toFixed(1) || '0',
                totalSubmissions,
                selectedCount,
                rejectedCount,
                totalMarketingSubmissions: totalMarketingSubmissions[0]?.total || 0,

                // Chart data
                distribution,
                submissionBreakdown,
                monthlyStats,
                techBreakdown: techBreakdown.map(t => ({ name: t._id || 'Other', count: t.count })),
                mockPerformance,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

