const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  mobile: {
    type: Number,
    required: true,
  },
  userType: {
    type: Number,
    required: true, // 1 - customer, 2 - merchant, 3 - driver, 4 - staff
    default: 1
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please Enter Valid Email Address..."],
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    // 6 Digit and AlfaNumaric Referral Code
    type: String,
  },
  referredFrom: {
    type: mongoose.Schema.Types.ObjectId,
    // type:String
    //   ref: "loginMaster",
  },
  deviceType: {
    type: Number,
    maxLength: [2, "Can't get Greater than 2"],
    required: true,
  },
  deviceVersion: {
    type: String,
    required: true,
  },
  loginRegion: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  fcmId: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  pin: {
    type: String,
  },
  otp: {
    type: String,
  },
  appVersion: {
    type: String,
    required: true,
  },
  apiVersion: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: {
    type: Number,
    required: true,
    default: 1,
  },
  isMobileVerified: {
    type: Number,
    default: 0,
  },
  isProfileCompleted: {
    type: Number,
    default: 0,
  },
  countryCode: {
    type: String,
    required: true,
  },
  languageCode: {
    type: String,
    required: true,
    default: 'en'
  },
  profileImage: {
    type: String,
  },
  dateOfBirth: { // YYYYMMDD
    type: String,
  },
  uniqueID: {
    type: String,
  },

  panCardNumber: { type: String },
  panCardPicture: { type: String },
  aadharCardNumber: { type: String },

  aadharCardFrontPicture: { type: String },
  aadharCardBackPicture: { type: String },

  drivingLicenseFront: {type: String},
  drivingLicenseBack: {type: String}
});

module.exports = mongoose.model("userMaster", userSchema);
