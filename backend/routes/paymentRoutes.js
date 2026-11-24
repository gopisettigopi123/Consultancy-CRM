const express = require('express');
const {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Account'));

router
    .route('/')
    .get(getPayments)
    .post(createPayment);

router
    .route('/:id')
    .put(updatePayment)
    .delete(deletePayment);

module.exports = router;
