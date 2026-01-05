const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = require('./user')(sequelize, DataTypes);
const Restaurant = require('./restaurant')(sequelize, DataTypes);
const MenuItem = require('./menuItem')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// Associations
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', as: 'menuItems' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Order.belongsToMany(MenuItem, {
  through: OrderItem,
  foreignKey: 'orderId',
  otherKey: 'menuItemId',
  as: 'items',
});
MenuItem.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: 'menuItemId',
  otherKey: 'orderId',
  as: 'orders',
});

module.exports = { sequelize, User, Restaurant, MenuItem, Order, OrderItem };


