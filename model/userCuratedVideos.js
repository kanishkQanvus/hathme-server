const mongoose = require("mongoose");

const userVideosSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userMaster",
  },
  type: {
    type: Number, // 1 -> Video // 2 -> Reel
    required: true, 
  },
  videoUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
  
});

module.exports = mongoose.model("userCuratedVideo", userVideosSchema);
