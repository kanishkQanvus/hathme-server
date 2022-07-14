const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const ProductCategoryMasterSchema = mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId, 
  },
  name: {
    type: String,
    required: true,
  
  },
  categoryId:{
    type: mongoose.Schema.Types.ObjectId,  // resturant
    required: true,
  },
  status:{
    type:String,  // 1. isActive  2. notActive 3.Delete   
    default:1
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

module.exports = mongoose.model("productCategoryMaster", ProductCategoryMasterSchema);





