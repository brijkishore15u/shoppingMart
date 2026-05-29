const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Create uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DMart API is running', time: new Date() });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'DMart API Server', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dmart';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    await seedData();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Tip: Update MONGO_URI in backend/.env file');
  });

async function seedData() {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany([
        { name: 'Fresh Apples', category: 'Fruits & Vegetables', price: 120, stock: 50, description: 'Fresh red apples from Himachal Pradesh', image: '' },
        { name: 'Basmati Rice 5kg', category: 'Staples', price: 450, stock: 30, description: 'Premium long grain basmati rice', image: '' },
        { name: 'Amul Butter 500g', category: 'Dairy', price: 245, stock: 100, description: 'Pure pasteurized butter', image: '' },
        { name: 'Surf Excel 2kg', category: 'Home Care', price: 380, stock: 60, description: 'Advanced washing powder', image: '' },
        { name: 'Maggi Noodles Pack', category: 'Snacks', price: 72, stock: 200, description: '12 pack instant noodles', image: '' },
        { name: 'Tata Salt 1kg', category: 'Staples', price: 22, stock: 500, description: 'Iodized table salt', image: '' },
        { name: 'Colgate Toothpaste', category: 'Personal Care', price: 89, stock: 150, description: 'Strong teeth whitening toothpaste', image: '' },
        { name: 'Tropicana Orange Juice', category: 'Beverages', price: 110, stock: 80, description: '1L fresh orange juice', image: '' },
      ]);
      console.log('🌱 Sample products seeded (8 products)');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@dmart.com',
        password: hashed,
        phone: '9999999999'
      });
      console.log('👤 Demo user: admin@dmart.com / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 DMart Server Started!');
  console.log(`📦 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log('');
});
