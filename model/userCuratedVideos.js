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
  status: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  modifiedAt: {
    type: Date,
    default: Date.now()
  }
  
}, {timestamps: true});

module.exports = mongoose.model("userCuratedVideo", userVideosSchema);
