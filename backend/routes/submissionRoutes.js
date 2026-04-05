const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAllSubmissions, createSubmission, updateSubmission } = require('../controllers/submissionController');

router.route('/')
    .get(protect, authorize('Admin', 'Marketing Team'), getAllSubmissions)
    .post(protect, authorize('Admin', 'Marketing Team'), createSubmission);

router.put('/:id', protect, authorize('Admin', 'Marketing Team'), updateSubmission);

module.exports = router;
