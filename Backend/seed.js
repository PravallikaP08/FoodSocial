const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const userModel = require("./src/models/user.model");
const foodPartnerModel = require("./src/models/foodpartner.model");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding");

    const demoEmail = "demo@example.com";
    const demoPassword = "password123";

    const existingUser = await userModel.findOne({ email: demoEmail });

    if (existingUser) {
      console.log(`User ${demoEmail} already exists.`);
    } else {
      const hashedPassword = await bcrypt.hash(demoPassword, 10);
      await userModel.create({
        fullName: "Demo User",
        email: demoEmail,
        password: hashedPassword
      });
      console.log(`User ${demoEmail} created successfully.`);
    }

    const demoPartnerEmail = "partner@example.com";
    const existingPartner = await foodPartnerModel.findOne({ email: demoPartnerEmail });

    if (!existingPartner) {
      const hashedPartnerPassword = await bcrypt.hash("password123", 10);
      await foodPartnerModel.create({
        name: "Test Partner",
        contactName: "John Doe",
        phone: "1234567890",
        address: "123 Street, Food City",
        email: demoPartnerEmail,
        password: hashedPartnerPassword,
        totalMeals: 154,
        customersServed: 85
      });
      console.log(`Partner ${demoPartnerEmail} created.`);
    } else {
      // Update existing partners with some stats if they are missing
      await foodPartnerModel.updateMany(
        { totalMeals: { $exists: false } },
        { $set: { totalMeals: 100, customersServed: 50 } }
      );
      console.log("Updated existing partners with default stats.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
