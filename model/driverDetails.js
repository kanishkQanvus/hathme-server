const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
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
  address: {
    type: String,
    // required: true,  
  },
  profilePhoto: { 
    type: String,
    // required: true,
    default: "01_profile_photo.jpg",
  },
  rating:{
    type:String,
    default:0
  }
  
});

module.exports = mongoose.model("driverDetails", driverSchema);
