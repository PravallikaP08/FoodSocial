const foodPartnerModel = require("../models/foodpartner.model");
const foodModel= require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const multer = require("multer");

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for profile images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});

const uploadImage = upload.single("profileImage");
async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    const foodItemsByFoodPartner= await foodModel.find({foodPartner:foodPartnerId});




    if (!foodPartner) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Food partner retrieved successfully",
      foodPartner:{
        ...foodPartner.toObject(),
        foodItems:foodItemsByFoodPartner
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function updateFoodPartner(req, res) {
  try {
    const updateData = {};
    if (req.body.restaurantName) updateData.restaurantName = req.body.restaurantName;
    if (req.body.fullName) updateData.fullName = req.body.fullName;
    if (req.body.address) updateData.address = req.body.address;
    if (req.body.phone) updateData.phone = req.body.phone;

    if (req.file) {
      const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
      updateData.profileImage = fileUploadResult.url;
    }

    const foodPartner = await foodPartnerModel.findByIdAndUpdate(
      req.foodPartner._id,
      updateData,
      { new: true }
    );

    if (!foodPartner) {
      return res.status(404).json({ success: false, message: "Partner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      foodPartner
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getFoodPartnerById,
  updateFoodPartner,
  uploadImage
};