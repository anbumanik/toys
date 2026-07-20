const express = require('express');
const { 
  createOrder, 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, adminOnly, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/deliver').put(protect, adminOnly, updateOrderToDelivered);
router.route('/:id/status').put(protect, adminOnly, updateOrderStatus);
router.route('/:id/razorpay').post(protect, createRazorpayOrder);
router.route('/:id/verify').post(protect, verifyRazorpayPayment);

module.exports = router;
