const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getUserProfile);


module.exports = router;
