require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

const ADMIN = { name: 'Admin', email: 'admin@food.app', password: 'admin123' };
const SAMPLE_USER = { name: 'Demo User', email: 'user@food.app', password: 'user123' };

async function seed() {
  // Clear existing data (order matters for FKs, though cascades also handle it).
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // Restaurants + their menus.
  const restaurantData = [
    {
      name: 'Pasta Palace', description: 'Italian favorites', rating: 4.5,
      menuItems: [
        { name: 'Spaghetti Bolognese', description: 'Rich meat sauce', price: 12.99 },
        { name: 'Fettuccine Alfredo', description: 'Creamy alfredo sauce', price: 11.49 },
        { name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 10.49 },
      ],
    },
    {
      name: 'Sushi Central', description: 'Fresh sushi & rolls', rating: 4.0,
      menuItems: [
        { name: 'California Roll', description: 'Crab, avocado, cucumber', price: 8.99 },
        { name: 'Salmon Nigiri', description: 'Fresh salmon over rice', price: 10.99 },
        { name: 'Tuna Sashimi', description: 'Sliced raw tuna', price: 12.49 },
      ],
    },
    {
      name: 'Burger Barn', description: 'Juicy burgers and fries', rating: 2.0,
      menuItems: [
        { name: 'Classic Cheeseburger', description: 'Cheddar, lettuce, tomato', price: 9.99 },
        { name: 'BBQ Bacon Burger', description: 'Smoky BBQ, bacon', price: 11.99 },
        { name: 'Loaded Fries', description: 'Cheese and bacon', price: 6.49 },
      ],
    },
    {
      name: 'Curry Corner', description: 'Spicy Indian curries', rating: 3.0,
      menuItems: [
        { name: 'Butter Chicken', description: 'Creamy tomato sauce', price: 13.49 },
        { name: 'Chana Masala', description: 'Spiced chickpeas', price: 9.99 },
        { name: 'Garlic Naan', description: 'Freshly baked bread', price: 3.49 },
      ],
    },
    {
      name: 'Taco Town', description: 'Mexican street food', rating: 2.0,
      menuItems: [
        { name: 'Carne Asada Tacos', description: 'Grilled steak', price: 8.49 },
        { name: 'Chicken Quesadilla', description: 'Melted cheese', price: 7.99 },
        { name: 'Churros', description: 'Cinnamon sugar', price: 4.49 },
      ],
    },
  ];

  for (const r of restaurantData) {
    await prisma.restaurant.create({
      data: {
        name: r.name,
        description: r.description,
        imageUrl: '',
        rating: r.rating,
        menuItems: { create: r.menuItems.map((m) => ({ ...m, imageUrl: '' })) },
      },
    });
  }

  // Accounts: one admin, one regular demo user.
  await prisma.user.create({
    data: {
      name: ADMIN.name,
      email: ADMIN.email,
      passwordHash: await bcrypt.hash(ADMIN.password, 10),
      role: 'admin',
    },
  });
  await prisma.user.create({
    data: {
      name: SAMPLE_USER.name,
      email: SAMPLE_USER.email,
      passwordHash: await bcrypt.hash(SAMPLE_USER.password, 10),
      role: 'user',
    },
  });

  console.log('Seed complete');
  console.log(`  Admin login: ${ADMIN.email} / ${ADMIN.password}`);
  console.log(`  User login:  ${SAMPLE_USER.email} / ${SAMPLE_USER.password}`);
}

if (require.main === module) {
  seed()
    .then(() => prisma.$disconnect())
    .then(() => process.exit(0))
    .catch(async (err) => {
      console.error(err);
      await prisma.$disconnect();
      process.exit(1);
    });
}

module.exports = { seed };
