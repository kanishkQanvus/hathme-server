const mongoose = require("mongoose");

const videoShareSchema = new mongoose.Schema({  
  videoId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userCuratedVideos"
  },
  sharedByUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userMaster"
  },
  status: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
}, {timestamps: true});

module.exports = mongoose.model("videoShare", videoShareSchema);
