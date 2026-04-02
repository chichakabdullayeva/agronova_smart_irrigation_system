const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route - Recent orders for shop page
router.get('/', orderController.getOrders);

// Protected routes - require authentication
router.get('/:id', protect, orderController.getOrder);
router.post('/', protect, orderController.createOrder);
router.delete('/:id', protect, orderController.cancelOrder);

// Admin only routes
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus);
router.get('/statistics/all', protect, adminOnly, orderController.getOrderStatistics);

module.exports = router;
