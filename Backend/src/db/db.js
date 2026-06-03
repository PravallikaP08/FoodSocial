const mongoose = require("mongoose");

function connectDB() {
  console.log("ENV KEYS:", Object.keys(process.env));
  console.log("MONGODB_URI =", process.env.MONGODB_URI);

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));
}

module.exports = connectDB;