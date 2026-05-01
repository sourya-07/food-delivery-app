const router = require('express').Router();
const { requireAdmin } = require('../utils/auth');
const admin = require('../controllers/admin.controller');

// Every admin route requires a valid admin token.
router.use(requireAdmin);

// Stats overview
router.get('/stats', admin.getStats);

// Orders
router.get('/orders', admin.listOrders);
router.patch('/orders/:id/status', admin.updateOrderStatus);

// Restaurants
router.post('/restaurants', admin.createRestaurant);
router.put('/restaurants/:id', admin.updateRestaurant);
router.delete('/restaurants/:id', admin.deleteRestaurant);

// Menu items
router.post('/menu-items', admin.createMenuItem);
router.put('/menu-items/:id', admin.updateMenuItem);
router.delete('/menu-items/:id', admin.deleteMenuItem);

// Users
router.get('/users', admin.listUsers);
router.patch('/users/:id/role', admin.updateUserRole);

module.exports = router;
