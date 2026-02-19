const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.patch('/:id', protect, admin, updateOrderStatus);

module.exports = router;
