const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

//user auth APIs
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser); // Make sure this exists in controller

//foodPartner auth APIs
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner); // Make sure this exists

module.exports = router;