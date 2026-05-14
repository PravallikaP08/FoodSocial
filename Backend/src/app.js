const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");

const app = express();

// Middleware
console.log("CORS Allowed Origins: 5173, 5174");
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/videos", express.static(path.join(__dirname, "../../Videos")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.message === "Only video files are allowed") {
        return res.status(400).json({ 
            success: false, 
            message: err.message 
        });
    }
    res.status(500).json({ 
        success: false, 
        message: "Something went wrong!" 
    });
});

module.exports = app;