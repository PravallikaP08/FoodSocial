const mongoose = require("mongoose");
require("dotenv").config();
const userModel = require("./src/models/user.model");
const foodPartnerModel = require("./src/models/foodpartner.model");

async function fixDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        
        // Fix Users
        const users = await userModel.find({});
        for (const user of users) {
            const normalizedEmail = user.email.toLowerCase().trim();
            if (user.email !== normalizedEmail) {
                user.email = normalizedEmail;
                await user.save();
                console.log(`Normalized user email: ${normalizedEmail}`);
            }
        }
        
        // Fix Partners
        const partners = await foodPartnerModel.find({});
        for (const partner of partners) {
            const normalizedEmail = partner.email.toLowerCase().trim();
            if (partner.email !== normalizedEmail) {
                partner.email = normalizedEmail;
                await partner.save();
                console.log(`Normalized partner email: ${normalizedEmail}`);
            }
        }
        
        console.log("Database normalization complete");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDatabase();
