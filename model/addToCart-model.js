const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const addToCartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
    merchantId: {
    type: mongoose.Schema.Types.ObjectId,
   
  },
  products: [
    {productId :{ type: mongoose.Schema.Types.ObjectId },
    quantity :{ type: String },
    categoryId :{ type: mongoose.Schema.Types.ObjectId },}
  ],
  couponCode: { type: String, default: "" },  
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  orderPlaced:{
    type:String, 
    default:2  // 1=order place 2 = order not placed
  }
});

module.exports = mongoose.model("addToCart", addToCartSchema);
