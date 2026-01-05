const { sequelize, Order, OrderItem, MenuItem, Restaurant } = require('../models');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { restaurantId, items } = req.body; // items: [{ menuItemId, quantity }]
    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const menuItems = await MenuItem.findAll({
      where: { id: items.map(i => i.menuItemId) },
      transaction: t,
    });
    if (menuItems.length !== items.length) {
      await t.rollback();
      return res.status(400).json({ message: 'Some menu items not found' });
    }

    const totalPrice = items.reduce((sum, i) => {
      const mi = menuItems.find(m => m.id === i.menuItemId);
      return sum + Number(mi.price) * i.quantity;
    }, 0);

    const userId = req.user?.id || null;
    const order = await Order.create({
      userId,
      restaurantId,
      status: 'pending',
      totalPrice,
    }, { transaction: t });

    for (const i of items) {
      const mi = menuItems.find(m => m.id === i.menuItemId);
      await OrderItem.create({
        orderId: order.id,
        menuItemId: mi.id,
        quantity: i.quantity,
        price: mi.price,
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ orderId: order.id });
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const where = req.user?.id ? { userId: req.user.id } : {};
    const orders = await Order.findAll({
      where,
      include: [
        { model: Restaurant, as: 'restaurant' },
        { model: MenuItem, as: 'items' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const where = req.user?.id ? { id, userId: req.user.id } : { id };
    const order = await Order.findOne({ where });
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json({ status: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


