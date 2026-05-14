const mongoose = require('mongoose');
require('dotenv').config();
const foodModel = require('./src/models/food.model');
const foodPartnerModel = require('./src/models/foodpartner.model');

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Create a demo food partner if it doesn't exist
    let partner = await foodPartnerModel.findOne({ email: 'demo-partner@example.com' });
    if (!partner) {
      partner = await foodPartnerModel.create({
        fullName: 'Chef Demo',
        email: 'demo-partner@example.com',
        password: 'password123', // In a real app, this should be hashed
        restaurantName: 'Demo Delights',
        phone: '1234567890',
        address: '123 Demo Street'
      });
      console.log('Demo partner created');
    }

    // 2. Sample food items with various tags for mood filtering
    const sampleFoods = [
      {
        name: 'Classic Margherita Pizza',
        description: 'Authentic wood-fired pizza with fresh basil and mozzarella.',
        video: 'http://localhost:3000/videos/12920456-hd_1080_1920_25fps.mp4',
        foodPartner: partner._id,
        tags: ['pizza', 'fast food', 'comfort'],
        isOrderable: true,
        price: 499
      },
      {
        name: 'Fresh Garden Salad',
        description: 'Healthy and refreshing salad with organic greens and vinaigrette.',
        video: 'http://localhost:3000/videos/12036000-hd_1080_1920_24fps.mp4',
        foodPartner: partner._id,
        tags: ['salad', 'healthy', 'green', 'vegan'],
        isOrderable: true,
        price: 299
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten center.',
        video: 'http://localhost:3000/videos/12920458-hd_1080_1920_25fps.mp4',
        foodPartner: partner._id,
        tags: ['dessert', 'sweet', 'chocolate', 'happy'],
        isOrderable: true,
        price: 199
      },
      {
        name: 'Street Style Tacos',
        description: 'Delicious tacos with spicy salsa and fresh cilantro.',
        video: 'http://localhost:3000/videos/14477472_1080_1920_60fps.mp4',
        foodPartner: partner._id,
        tags: ['street food', 'budget', 'combo'],
        isOrderable: true,
        price: 150
      }
    ];

    // Clear existing foods to replace with local ones
    await foodModel.deleteMany({});
    
    for (const food of sampleFoods) {
      await foodModel.create(food);
      console.log(`Created food: ${food.name}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedFoods();
