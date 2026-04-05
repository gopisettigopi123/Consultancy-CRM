const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAllMarketing, getMarketingByCandidate, createMarketing, updateMarketing } = require('../controllers/marketingController');

router.route('/')
    .get(protect, authorize('Admin', 'Marketing Team'), getAllMarketing)
    .post(protect, authorize('Admin', 'Marketing Team'), createMarketing);

router.get('/candidate/:candidateId', protect, authorize('Admin', 'Marketing Team'), getMarketingByCandidate);
router.put('/:id', protect, authorize('Admin', 'Marketing Team'), updateMarketing);

module.exports = router;
