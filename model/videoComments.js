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

module.exports = mongoose.model("videoComment", videoCommentsSchema);
