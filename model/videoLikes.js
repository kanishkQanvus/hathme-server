const mongoose = require("mongoose");

const videoLikesSchema = new mongoose.Schema({  
  videoId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userCuratedVideos"
  },
  likedByUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userMaster"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
  
});

module.exports = mongoose.model("videoLike", videoLikesSchema);
