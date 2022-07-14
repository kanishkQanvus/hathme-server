const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,   //if it is true then product validation failed for add product
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productCategoryMasterId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isVeg: {
    type: String, // 1. veg  2. nonVeg
  },
  status: {
    type: String,
    default: 1, // 1 - active , 2 - not active, 3 - deleted
  },
  type: {
    type: String, // 1=stock   2= out of stock  3 = best seller
    default: 1,
  },
  rating: {
    type: String,
  },

  recommended: {
    type: String, // 1=recommended    2=non recommended
    default: 1,
  },
  productImageOne: {
    type: String,
  },
  productImageTwo: {
    type: String,
  },
  productImageThree: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("product", productSchema);
