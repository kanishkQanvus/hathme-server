const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
  isOnOff: {
    type: Number,
    required: true,
    default: 2,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
  },
  address: {
    type: String,
    // required: true,
  
  },
  coverPhoto: {
    type: String,
    // required: true,
    default: "01_cover_photo.jpg",
  },
  rating:{
    type:String,
    default:0
  }
  
});

module.exports = mongoose.model("merchantDetails", merchantSchema);
