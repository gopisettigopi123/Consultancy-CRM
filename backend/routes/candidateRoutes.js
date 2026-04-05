const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getCandidates, getCandidate, createCandidate,
    updateCandidate, deleteCandidate, exportCandidates
} = require('../controllers/candidateController');

// Multer config for resume uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/export', protect, exportCandidates);
router.route('/')
    .get(protect, getCandidates)
    .post(protect, upload.single('resume'), createCandidate);

router.route('/:id')
    .get(protect, getCandidate)
    .put(protect, updateCandidate)
    .delete(protect, authorize('Admin'), deleteCandidate);

module.exports = router;
