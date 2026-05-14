const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Helper function to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// User Registration
async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword
        });
        
        // Generate token
        const token = generateToken(user._id);
        
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message });
    }
}

// User Login
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate token
        const token = generateToken(user._id);
        
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
}

// User Logout
async function logoutUser(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Food Partner Registration
async function registerFoodPartner(req, res) {
    try {
        const { fullName, email, password, restaurantName, phone, address } = req.body;
        
        // Check if partner already exists
        const existingPartner = await foodPartnerModel.findOne({ email });
        if (existingPartner) {
            return res.status(400).json({ message: "Partner already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create food partner
        const foodPartner = await foodPartnerModel.create({
            fullName,
            email,
            password: hashedPassword,
            restaurantName,
            phone,
            address
        });
        
        // Generate token
        const token = generateToken(foodPartner._id);
        
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(201).json({
            success: true,
            message: "Food partner registered successfully",
            token,
            foodPartner: {
                id: foodPartner._id,
                fullName: foodPartner.fullName,
                email: foodPartner.email,
                restaurantName: foodPartner.restaurantName
            }
        });
        
    } catch (error) {
        console.error("Food partner registration error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Food Partner Login
async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;
        
        // Find food partner
        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, foodPartner.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate token
        const token = generateToken(foodPartner._id);
        
        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            success: true,
            message: "Food partner login successful",
            token,
            foodPartner: {
                id: foodPartner._id,
                fullName: foodPartner.fullName,
                email: foodPartner.email,
                restaurantName: foodPartner.restaurantName
            }
        });
        
    } catch (error) {
        console.error("Food partner login error:", error);
        res.status(500).json({ message: error.message });
    }
}

// Food Partner Logout
async function logoutFoodPartner(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Food partner logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};