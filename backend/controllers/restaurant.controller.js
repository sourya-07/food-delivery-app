const { Restaurant, MenuItem } = require('../models');

exports.getRestaurants = async (_req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id, {
      include: { model: MenuItem, as: 'menuItems' },
    });
    if (!restaurant) return res.status(404).json({ message: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMenuByRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await MenuItem.findAll({ where: { restaurantId: id } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


