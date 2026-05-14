const mongoose = require('mongoose');
require('dotenv').config();
const foodModel = require('./src/models/food.model');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const foods = await foodModel.find({});
  console.log('Total foods:', foods.length);
  foods.forEach(f => {
    console.log(`Food: ID ${f._id}, Name: ${f.name}`);
  });
  
  process.exit(0);
}

check();
