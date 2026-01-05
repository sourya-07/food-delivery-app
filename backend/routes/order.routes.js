const router = require('express').Router();
const { createOrder, getMyOrders, getOrderStatus } = require('../controllers/order.controller');
const { optionalAuth } = require('../utils/auth');

router.use(optionalAuth);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id/status', getOrderStatus);

module.exports = router;


