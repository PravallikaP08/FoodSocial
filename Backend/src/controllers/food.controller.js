const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const likeModel=require("../models/likes.model");
const saveModel=require("../models/save.model")
const commentModel=require("../models/comment.model")
const { v4: uuid } = require("uuid");
const multer = require("multer");

// Multer storage configuration (memory storage for ImageKit)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  }
});

const uploadVideo = upload.single("video");


async function createFood(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "Video file is required" });

    // Upload file to ImageKit
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    // Save food item in DB with the full URL from ImageKit
    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult.url, // <-- ImageKit URL
      foodPartner: req.foodPartner._id,
      tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : JSON.parse(req.body.tags)) : [],
      isOrderable: req.body.isOrderable === 'true' || req.body.isOrderable === true,
      price: Number(req.body.price) || 0,
      foodName: req.body.foodName || req.body.name
    });

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      food: foodItem
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getAllFoods(req, res) {
  try {
    const { mood } = req.query;
    let query = {};

    if (mood) {
      const moodMap = {
        Happy: ['sweet', 'dessert', 'chocolate', 'comfort'],
        Lazy: ['fast food', 'pizza', 'burger', 'delivery'],
        Healthy: ['salad', 'vegan', 'green', 'fruit'],
        Budget: ['cheap', 'street food', 'combo'],
        Party: ['drinks', 'snacks', 'shareable', 'large']
      };

      const tags = moodMap[mood];
      if (tags) {
        query.tags = { $in: tags };
      }
    }

    const foodItems = await foodModel.find(query).populate("foodPartner", "restaurantName fullName");
    res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      foodItems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getFoodById(req, res) {
  try {
    const foodItem = await foodModel.findById(req.params.id).populate("foodPartner", "restaurantName fullName");
    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }
    res.status(200).json({
      success: true,
      message: "Food item fetched successfully",
      food: foodItem
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getFoodsByPartner(req, res) {
  try {
    const foodItems = await foodModel.find({ foodPartner: req.params.partnerId });
    res.status(200).json({
      success: true,
      message: "Partner food items fetched successfully",
      foodItems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateFood(req, res) {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
    };

    if (req.file) {
      const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
      updateData.video = fileUploadResult.url;
    }

    const foodItem = await foodModel.findOneAndUpdate(
      { _id: req.params.id, foodPartner: req.foodPartner._id },
      updateData,
      { new: true }
    );

    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      food: foodItem
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteFood(req, res) {
  try {
    const foodItem = await foodModel.findOneAndDelete({
      _id: req.params.id,
      foodPartner: req.foodPartner._id
    });

    if (!foodItem) {
      return res.status(404).json({ success: false, message: "Food item not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getFoodItems(req, res) {
  const foodItems = await foodModel.find({});
  res.status(200).json({
    message: "Food items fetched successfully",
    foodItems
  });
}
async function likeFood(req,res){
 const {foodId} = req.body;
 const user=req.user;
 const isAlreadyLiked=await likeModel.findOne({
  food:foodId,
  user:user._id
 })

  if(isAlreadyLiked){
  await likeModel.deleteOne({
    food:foodId,
    user:user._id
  })
  let updatedFood = await foodModel.findByIdAndUpdate(foodId,
    {$inc:{likeCount:-1}}, {new: true})
  if (updatedFood.likeCount < 0) {
    updatedFood = await foodModel.findByIdAndUpdate(foodId, {$set: {likeCount: 0}}, {new: true});
  }
  return res.status(200).json({
    success:true,
    message:"Food unliked successfully",
    likeCount: updatedFood.likeCount
  })
 }
 const like=await likeModel.create({
  food:foodId,
  user:user._id
 })

 const updatedFood = await foodModel.findByIdAndUpdate(foodId,
  {$inc:{likeCount:1}}, {new: true})
 res.status(200).json({
  success:true,
  message:"Food liked successfully",
  like,
  likeCount: updatedFood.likeCount
 })
}
async function saveFood(req,res){
  const {foodId} = req.body;
  const user=req.user;
  const isAlreadySaved=await saveModel.findOne({
    food:foodId,
    user:user._id
  })
  if(isAlreadySaved){
    await saveModel.deleteOne({
      food:foodId,
      user:user._id
    })
    let updatedFood = await foodModel.findByIdAndUpdate(foodId, {$inc: {saveCount: -1}}, {new: true});
    if (updatedFood.saveCount < 0) {
      updatedFood = await foodModel.findByIdAndUpdate(foodId, {$set: {saveCount: 0}}, {new: true});
    }
    return res.status(200).json({
      success:true,
      message:"Food unsaved successfully",
      saveCount: updatedFood.saveCount
    })
  }
  const save=await saveModel.create({
    food:foodId,
    user:user._id
  })
  const updatedFood = await foodModel.findByIdAndUpdate(foodId, {$inc: {saveCount: 1}}, {new: true});
  res.status(200).json({
    success:true,
    message:"Food saved successfully",
    save,
    saveCount: updatedFood.saveCount
  })
}
async function getSavedFoods(req, res) {
  try {
    const user = req.user;
    const savedItems = await saveModel.find({ user: user._id }).populate({
      path: "food",
      populate: {
        path: "foodPartner",
        select: "restaurantName fullName"
      }
    });

    // Extract only the food items from the saved records
    const foodItems = savedItems.map(item => item.food).filter(food => food != null);

    res.status(200).json({
      success: true,
      message: "Saved food items fetched successfully",
      foodItems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
async function addComment(req, res) {
  try {
    const { foodId, text } = req.body;
    const user = req.user;
    
    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const comment = await commentModel.create({
      food: foodId,
      user: user._id,
      text: text
    });

    const updatedFood = await foodModel.findByIdAndUpdate(foodId, {$inc: {commentCount: 1}}, {new: true});

    const populatedComment = await commentModel.findById(comment._id).populate("user", "fullName");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
      commentCount: updatedFood.commentCount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getComments(req, res) {
  try {
    const { id } = req.params;
    const comments = await commentModel.find({ food: id }).populate("user", "fullName").sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createFood,
  getAllFoods,
  getFoodById,
  getFoodsByPartner,
  updateFood,
  deleteFood,
  uploadVideo,
  likeFood,
  saveFood,
  getSavedFoods,
  addComment,
  getComments
};
