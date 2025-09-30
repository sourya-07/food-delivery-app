const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
const { testConnection } = require('./config/db');
const restaurantRoutes = require('./routes/restaurant.routes');
const orderRoutes = require('./routes/order.routes');
// Auth disabled for guest flow
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 4000;
const { sequelize } = require('./models');

app.listen(PORT, async () => {
  await testConnection();
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});


