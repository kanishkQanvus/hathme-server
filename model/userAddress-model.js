const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const userAddressSchema = mongoose.Schema({
  userId: {                     // this userid use for user
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
  areaName:{
  type: String,
  required:true
},
fullAddress:{
     type:String,
     required:true
 },
 addressType:{
    type:String,
    required:true
 },
 completeAddress:{ 
      type:String,
    required:true},


    floor:{
        type:String
    },
    landmark:{
        type:String
    },
    latitude:{
        type:String,
        required:true
    },
    longitude:{
        type:String,
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

module.exports = mongoose.model("userAddress", userAddressSchema);
