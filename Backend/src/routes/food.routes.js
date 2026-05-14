const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const { authFoodPartnerMiddleware, authUserMiddleware } = require("../middlewares/auth.middleware");

// Specific routes must come before parameter routes
router.get("/saved", authUserMiddleware, foodController.getSavedFoods);

// Public routes (no authentication needed)
router.get("/", foodController.getAllFoods);
router.get("/:id", foodController.getFoodById);
router.get("/partner/:partnerId", foodController.getFoodsByPartner);
// Protected routes (only food partners can access)
// Note: Make sure all these functions exist in your foodController
router.post(
    "/", 
    authFoodPartnerMiddleware,
    foodController.uploadVideo,
    foodController.createFood
);

router.put(
    "/:id", 
    authFoodPartnerMiddleware,
    foodController.uploadVideo,
    foodController.updateFood
);

router.delete(
    "/:id", 
    authFoodPartnerMiddleware,
    foodController.deleteFood
);


router.post("/like",
    authUserMiddleware,
    foodController.likeFood);
router.post("/save",
    authUserMiddleware,
    foodController.saveFood);
    
router.post("/comment",
    authUserMiddleware,
    foodController.addComment);

router.get("/:id/comments",
    foodController.getComments);
module.exports = router;