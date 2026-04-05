const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAllTraining, getTrainingByCandidate, createTraining, updateTraining } = require('../controllers/trainingController');

router.route('/')
    .get(protect, authorize('Admin', 'Training Team'), getAllTraining)
    .post(protect, authorize('Admin', 'Training Team'), createTraining);

router.get('/candidate/:candidateId', protect, authorize('Admin', 'Training Team'), getTrainingByCandidate);
router.put('/:id', protect, authorize('Admin', 'Training Team'), updateTraining);

module.exports = router;
