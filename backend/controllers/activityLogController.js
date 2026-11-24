const ActivityLog = require('../models/ActivityLog');

// @desc    Get recent activity logs
// @route   GET /api/activity-logs
// @access  Private (Admin, Admin Team)
exports.getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate('user', 'name email')
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Helper to record an audit event without failing the primary request.
 */
exports.recordActivity = async (userId, action, details) => {
    try {
        if (!userId) return;
        await ActivityLog.create({ user: userId, action, details });
    } catch (error) {
        console.error('Failed to record activity log:', error.message);
    }
};
