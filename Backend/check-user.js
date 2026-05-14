const mongoose = require("mongoose");
require("dotenv").config();
const userModel = require("./src/models/user.model");

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        
        const users = await userModel.find({ email: /sam/i });
        
        if (users.length > 0) {
            console.log("Found users matching 'sam':");
            users.forEach(u => {
                console.log(`- Email: ${u.email}, FullName: ${u.fullName}`);
            });
        } else {
            console.log("No users found matching 'sam'");
            const recent = await userModel.find().sort({ createdAt: -1 }).limit(5);
            console.log("Most recent users:", recent.map(u => u.email));
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUser();
