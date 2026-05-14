const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,  
        required: true,
    },
    video: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        required: true, 
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true
    },
    likeCount:{
        type:Number,
        default:0
    },
    saveCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    isOrderable: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    foodName: {
        type: String
    }


}, {
    timestamps: true  
});

const foodModel = mongoose.model("food", foodSchema);
module.exports = foodModel;