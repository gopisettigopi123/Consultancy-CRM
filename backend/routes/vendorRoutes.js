const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { getAllVendors, getVendor, createVendor, updateVendor, deleteVendor } = require('../controllers/vendorController');

router.route('/')
    .get(protect, authorize('Admin', 'Marketing Team'), getAllVendors)
    .post(protect, authorize('Admin', 'Marketing Team'), createVendor);

router.route('/:id')
    .get(protect, authorize('Admin', 'Marketing Team'), getVendor)
    .put(protect, authorize('Admin', 'Marketing Team'), updateVendor)
    .delete(protect, authorize('Admin'), deleteVendor);

module.exports = router;
