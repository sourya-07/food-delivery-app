const prisma = require('../lib/prisma');

exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items } = req.body; // items: [{ menuItemId, quantity }]
    if (!restaurantId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const ids = items.map((i) => Number(i.menuItemId));
    const menuItems = await prisma.menuItem.findMany({ where: { id: { in: ids } } });
    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: 'Some menu items not found' });
    }

    const totalPrice = items.reduce((sum, i) => {
      const mi = menuItems.find((m) => m.id === Number(i.menuItemId));
      return sum + Number(mi.price) * i.quantity;
    }, 0);

    const userId = req.user?.id || null;
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId: Number(restaurantId),
        status: 'pending',
        totalPrice,
        items: {
          create: items.map((i) => {
            const mi = menuItems.find((m) => m.id === Number(i.menuItemId));
            return { menuItemId: mi.id, quantity: i.quantity, price: mi.price };
          }),
        },
      },
    });

    res.status(201).json({ orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const where = req.user?.id ? { userId: req.user.id } : {};
    const orders = await prisma.order.findMany({
      where,
      include: {
        restaurant: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const where = req.user?.id ? { id, userId: req.user.id } : { id };
    const order = await prisma.order.findFirst({ where });
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json({ status: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
