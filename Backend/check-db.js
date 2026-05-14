const mongoose = require('mongoose');
require('dotenv').config();
const saveModel = require('./src/models/save.model');
const foodModel = require('./src/models/food.model');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const saves = await saveModel.find({}).populate('food');
  console.log('Total saves:', saves.length);
  saves.forEach(s => {
    console.log(`Save: User ${s.user}, Food ${s.food?._id} (${s.food?.description})`);
  });
  
  process.exit(0);
}

check();
