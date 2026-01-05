module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    restaurantId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'), defaultValue: 'pending' },
    totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  }, {
    tableName: 'orders',
    timestamps: true,
  });

  return Order;
};


