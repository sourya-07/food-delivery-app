module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define('MenuItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    restaurantId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'menu_items',
    timestamps: true,
  });

  return MenuItem;
};


