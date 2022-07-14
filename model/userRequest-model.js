const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const requestSchema = mongoose.Schema({
  sendByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
  sendToUserId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status:{
    type:String,  // 1. pending  2. Accepted 3.Reject   // friend
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

module.exports = mongoose.model("userRequest", requestSchema);





