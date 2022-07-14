const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const productImageSchema = mongoose.Schema({

  name:{
      type:String,
      required:true
  },
  productId:{
    type: mongoose.Schema.Types.ObjectId,
    required:true
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

module.exports = mongoose.model("productImages", productImageSchema);





