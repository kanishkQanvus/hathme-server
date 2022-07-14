const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const friendSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
  friendId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status:{
    type:String,  //mutual friend
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

module.exports = mongoose.model("mutualFriend", friendSchema);





