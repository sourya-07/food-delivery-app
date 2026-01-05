require('dotenv').config();
const { sequelize, Restaurant, MenuItem } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });

  const restaurants = await Restaurant.bulkCreate([
    { name: 'Pasta Palace', description: 'Italian favorites', imageUrl: '', rating: 4.5 },
    { name: 'Sushi Central', description: 'Fresh sushi & rolls', imageUrl: '', rating: 4.0 },
    { name: 'Burger Barn', description: 'Juicy burgers and fries', imageUrl: '', rating: 2.0 },
    { name: 'Curry Corner', description: 'Spicy Indian curries', imageUrl: '', rating: 3.0 },
    { name: 'Taco Town', description: 'Mexican street food', imageUrl: '', rating: 2.0 },
  ]);

  await MenuItem.bulkCreate([
    // Pasta Palace
    { name: 'Spaghetti Bolognese', description: 'Rich meat sauce', price: 12.99, restaurantId: restaurants[0].id },
    { name: 'Fettuccine Alfredo', description: 'Creamy alfredo sauce', price: 11.49, restaurantId: restaurants[0].id },
    { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 10.49, restaurantId: restaurants[0].id },
    // Sushi Central
    { name: 'California Roll', description: 'Crab, avocado, cucumber', price: 8.99, restaurantId: restaurants[1].id },
    { name: 'Salmon Nigiri', description: 'Fresh salmon over rice', price: 10.99, restaurantId: restaurants[1].id },
    { name: 'Tuna Sashimi', description: 'Sliced raw tuna', price: 12.49, restaurantId: restaurants[1].id },
    // Burger Barn
    { name: 'Classic Cheeseburger', description: 'Cheddar, lettuce, tomato', price: 9.99, restaurantId: restaurants[2].id },
    { name: 'BBQ Bacon Burger', description: 'Smoky BBQ, bacon', price: 11.99, restaurantId: restaurants[2].id },
    { name: 'Loaded Fries', description: 'Cheese and bacon', price: 6.49, restaurantId: restaurants[2].id },
    // Curry Corner
    { name: 'Butter Chicken', description: 'Creamy tomato sauce', price: 13.49, restaurantId: restaurants[3].id },
    { name: 'Chana Masala', description: 'Spiced chickpeas', price: 9.99, restaurantId: restaurants[3].id },
    { name: 'Garlic Naan', description: 'Freshly baked bread', price: 3.49, restaurantId: restaurants[3].id },
    // Taco Town
    { name: 'Carne Asada Tacos', description: 'Grilled steak', price: 8.49, restaurantId: restaurants[4].id },
    { name: 'Chicken Quesadilla', description: 'Melted cheese', price: 7.99, restaurantId: restaurants[4].id },
    { name: 'Churros', description: 'Cinnamon sugar', price: 4.49, restaurantId: restaurants[4].id },
  ]);

  console.log('Seed complete');
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}

module.exports = { seed };


