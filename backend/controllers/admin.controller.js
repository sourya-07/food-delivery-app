const prisma = require('../lib/prisma');

const ORDER_STATUSES = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];

// ----- Stats overview -----
exports.getStats = async (_req, res) => {
  try {
    const [restaurants, menuItems, orders, users, revenueAgg, byStatus] = await Promise.all([
      prisma.restaurant.count(),
      prisma.menuItem.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { totalPrice: true } }),
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
    ]);

    const ordersByStatus = ORDER_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    byStatus.forEach((row) => { ordersByStatus[row.status] = row._count._all; });

    res.json({
      restaurants,
      menuItems,
      orders,
      users,
      revenue: revenueAgg._sum.totalPrice ? Number(revenueAgg._sum.totalPrice) : 0,
      ordersByStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----- Orders -----
exports.listOrders = async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        restaurant: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await prisma.order.update({ where: { id }, data: { status } });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Order not found' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----- Restaurants CRUD -----
exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, imageUrl, rating } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description: description || null,
        imageUrl: imageUrl || null,
        rating: rating != null ? Number(rating) : 0,
      },
    });
    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, imageUrl, rating } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (rating !== undefined) data.rating = Number(rating);
    const restaurant = await prisma.restaurant.update({ where: { id }, data });
    res.json(restaurant);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Restaurant not found' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.restaurant.delete({ where: { id } });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Restaurant not found' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----- Menu items CRUD -----
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl, restaurantId } = req.body;
    if (!name || price == null || !restaurantId) {
      return res.status(400).json({ message: 'name, price and restaurantId are required' });
    }
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        imageUrl: imageUrl || null,
        restaurantId: Number(restaurantId),
      },
    });
    res.status(201).json(menuItem);
  } catch (err) {
    if (err.code === 'P2003') return res.status(400).json({ message: 'Restaurant does not exist' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, imageUrl } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    const menuItem = await prisma.menuItem.update({ where: { id }, data });
    res.json(menuItem);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Menu item not found' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.menuItem.delete({ where: { id } });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Menu item not found' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ----- Users -----
exports.listUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { id: 'asc' },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be "user" or "admin"' });
    }
    if (req.user.id === id && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot demote yourself' });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'User not found' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
