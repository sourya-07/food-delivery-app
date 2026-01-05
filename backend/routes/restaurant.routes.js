const router = require('express').Router();
const { getRestaurants, getRestaurantById, getMenuByRestaurant } = require('../controllers/restaurant.controller');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getMenuByRestaurant);

module.exports = router;


