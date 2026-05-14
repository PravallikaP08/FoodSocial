const express=require("express")
const foodPartnerController=require("../controllers/food-partner.controller")
const authMiddleware=require("../middlewares/auth.middleware")
const router=express.Router()
router.get("/:id", foodPartnerController.getFoodPartnerById)
router.put("/update", 
    authMiddleware.authFoodPartnerMiddleware, 
    foodPartnerController.uploadImage, 
    foodPartnerController.updateFoodPartner
)


module.exports=router;
