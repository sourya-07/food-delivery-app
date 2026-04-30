const prisma = require('../lib/prisma');

exports.getRestaurants = async (_req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({ orderBy: { id: 'asc' } });
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
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
    const restaurantId = Number(req.params.id);
    const items = await prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { id: 'asc' },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
