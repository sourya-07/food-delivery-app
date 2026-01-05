module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
  }, {
    tableName: 'restaurants',
    timestamps: true,
  });

  return Restaurant;
};


