const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userId: {
        // type: String,
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "userMaster",
        // default: "622f28b8fd8473ea00f48e43"
    },
    loginRegion: {
      type: String,
      // required: true,
    },
    deviceType: {
        type: Number,
        maxLength: [2, "Can't get Greater than 2"], // 1 for Android and 2 for IOS
        required: true
    },
    deviceId: {
        type: String,
        required: true,
    },
    deviceVersion: {
      type: String,      
    },
    fcmId: {
        type: String,
     
    },
    manufacturer: {
        type: String,
       
    },
    appVersion: {
        type: String,
        // required: true,
    },
    apiVersion: {
        type: String,
        // required: true,
    },
    languageCode: {
      type: String,
      // required: true,
      default: 'en'
    },
    deviceName: {
        type: String,
      
    },
    loginTime: {
        type: Date,
        
        default: Date.now()
    },
    logoutTime: {
        type: Date,
       
        default: null
    },
    isLogin: {
        type: Number,
        required: true,
        default: true,
    }
}, { timestamps: false })


module.exports = mongoose.model("loginMaster", userSchema)