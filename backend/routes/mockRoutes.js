const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAllMocks, getMocksByCandidate, createMock, updateMock } = require('../controllers/mockController');

router.route('/')
    .get(protect, authorize('Admin', 'Training Team'), getAllMocks)
    .post(protect, authorize('Admin', 'Training Team'), createMock);

router.get('/candidate/:candidateId', protect, authorize('Admin', 'Training Team'), getMocksByCandidate);
router.put('/:id', protect, authorize('Admin', 'Training Team'), updateMock);

module.exports = router;
