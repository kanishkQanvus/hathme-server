const mongoose = require("mongoose");

const videoCommentsSchema = new mongoose.Schema({  
  videoId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userCuratedVideos"
  },
  commentByUserId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "userMaster"
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("videoComment", videoCommentsSchema);
