const loginMaster = require("../model/loginMaster-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userMasterModel = require("../model/userMaster-model");
const driverDetails = require("../model/driverDetails");
const merchantModel = require("../model/merchantDetails");
const bankDetails = require("../model/bankDetail-model");
const userAddressModel = require("../model/userAddress-model");
const constants = require("../constants");
const helper = require("../helper/apiHelper");
const { default: mongoose } = require("mongoose");
const { find } = require("../model/loginMaster-model");
// const addTocartModel = require("../")
const token = ['dyn2Scv0StaVkFymSHIton:APA91bFax0vhqk__eP1gd1tdBxjm_H3EVoJPP8uKqDLMccgJpPjcvkuYjgu3YkJaZ4vB2YMaCv_Pzk3LBX8I9GGQh43Eb0aD6ff8Y5smR25U8BGBGYJDiZqp82IZKa0skMaql5bX2Qg_'];
const { read } = require("fs");
const orderModel = require("../model/order-model");
const genrateOtp = async (userId) => {
  let randomOtp = Math.floor(100000 + Math.random() * 900000);
  const user = await userMasterModel.findOneAndUpdate(
    { _id: userId },
    { otp: randomOtp },
    { new: true }
  );
  if (user) {
    let data = {
      userId: user._id,
      name: user.name,
      otp: randomOtp,
      email: user.email,
    };
    return data;
  }
  return null;
};

async function referalCodeStr() {
  let len = 6;
  let arr = "0987654321ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var ans = "";
  for (var i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  let referralCodeAlredyExist = await userMasterModel.findOne({
    referralCode: ans,
  });
  if (referralCodeAlredyExist) {
    referalCodeStr();
  }
  return ans;
}
///// commented for checking
const userDetail = async (data) => {
  let result = {
    userId: data._id ? data._id : "",
    name: data.name ? data.name : "",
    mobile: data.mobile ? data.mobile : "",
    userName: data.userName ? data.userName : "",
    userType: data.userType ? data.userType : "",
    email: data.email ? data.email : "",
    referralCode: data.referralCode ? data.referralCode : "",
    dateOfBirth: data.dateOfBirth ? data.dateOfBirth : "",
    isActive: data.isActive ? data.isActive : "",
    isMobileVerified: data.isMobileVerified ? data.isMobileVerified : 0,
    isProfileCompleted: data.isProfileCompleted ? data.isProfileCompleted : 0,
    countryCode: data.countryCode ? data.countryCode : "",
    aadharCardNumber: data.aadharCardNumber ? data.aadharCardNumber : "",
    panCardNumber: data.panCardNumber ? data.panCardNumber : "",
    profileImage: data.profileImage
      ? process.env.PROFILEIMAGE + `${data.profileImage}`
      : "",
    aadharCardBackPicture: data.aadharCardBackPicture
      ? process.env.AADHARDCARDPICTURE + `${data.aadharCardBackPicture}`
      : "",
    aadharCardFrontPicture: data.aadharCardFrontPicture
      ? process.env.AADHARDCARDPICTURE + `${data.aadharCardFrontPicture}`
      : "",
    panCardPicture: data.panCardPicture
      ? process.env.PANCARDPICTURE + `${data.panCardPicture}`
      : "", 
      drivingLicenseFront: data.drivingLicenseFront
      ? process.env.DRIVINGLICENSE + `${data.drivingLicenseFront}`
      : "",    
      drivingLicenseBack: data.drivingLicenseBack
      ? process.env.DRIVINGLICENSE + `${data.drivingLicenseBack}`
      : "",    
    // randNum: data.randNum ? data.randNum : "",
  };
  return result;
};

const shortUserDetail = async (data) => {
  if (data.length == 0) {
    return [];
  }
  let result = {
    userId: data._id ? data._id : "",
    name: data.name ? data.name : "",
    mobile: data.mobile ? data.mobile : "",
    userName: data.userName ? data.userName : "",
    email: data.email ? data.email : "",
    dateOfBirth: data.dateOfBirth ? data.dateOfBirth : "",
    isActive: data.isActive ? data.isActive : "",
    profileImage: data.profileImage
      ? process.env.PROFILEIMAGE + `${data.profileImage}`
      : "",
  };
  return result;
};

const orderDetails = async (data) => {
  if(data.length == 0){
    return [];
  }

  let result = {
    orderId: data._id ? data._id : "",
    orderNo: data.orderId ? data.orderId : "",
    products: data.products ? data.products : [],
    driverId: data.driverId ? data.driverId : "",    
  }
  
  return result;
}

exports.newDriver = async (req, res) => {
  const APPNAME = constants.APPNAME;

  try {
    let checkReqKey = [
      "name",
      "mobile",
      "email",
      "password",
      "referralCode",
      "countryCode",      
      "fcmId",
      "deviceName",
      "deviceVersion",
      "manufacturer",            
    ];

    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    let {
      password,
      referralCode,
      name,
      email,
      mobile,
      fcmId,
      deviceName,
      deviceVersion,
      manufacturer,      
      countryCode,           
    } = req.body[constants.APPNAME];

    const header = req.user;    

    let referredFrom = null;
    const userAlreadyExistEmail = await userMasterModel.find({ email });
    const userAlreadyExistMobile = await userMasterModel.find({ mobile });
    const loginTime = new Date(Date.now()).toISOString();
    if (userAlreadyExistMobile.length > 0) {
      return res.json(helper.generateServerResponse(0, 104));
    }
    if (userAlreadyExistEmail.length > 0) {
      return res.json(helper.generateServerResponse(0, 102));
    }
    if (referralCode && referralCode.length > 0) {
      let referalUser = await userMasterModel.findOne({
        referralCode: referralCode,
      });
      if (!referalUser) {
        return res.json(helper.generateServerResponse(0, "158"));
      }
      referredFrom = referalUser ? referalUser._id : "";
    }
    referralCode = await referalCodeStr();
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    let payload = {
      password,
      name,
      email,
      mobile,
      deviceType: header.deviceType,
      deviceId: header.deviceId,
      fcmId,
      manufacturer,
      appVersion: header.appVersion,
      apiVersion: header.apiVersion,
      deviceName,
      deviceVersion,
      otp: "123456",
      pin: null,
      referredFrom,
      referralCode,
      isMobileVerified: 0,
      isProfileCompleted: 0,
      isActive: 1,
      userType: 3, //1 - User, 2 - Merchant, 3 - driver, 4 - staff
      countryCode,
      loginRegion: header.loginRegion,
      languageCode: header.languageCode,
    };
    const result = await userMasterModel(payload);
    await result.save();

    let driverDetail = await driverDetails.create({
      userId: result._id,
    });

    // let genOtp = await genrateOtp(result._id);
    const token = await jwt.sign(
      { userId: result._id },
      process.env.JWT_SECRET_KEY
    );
    let data = await userDetail(result);
    data = {
      ...data,
      token,
    };
    res.json(helper.generateServerResponse(1, 103, data));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

/////

exports.myProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    let result = await userMasterModel.findById({ _id: userId });
    let data = await userDetail(result);
    res.json(helper.generateServerResponse(1, "S", data));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.loginDriver = async (req, res) => {
  try {
    let checkReqKey = [
      "email",
      "password",
      "fcmId",
      "deviceName",
      "deviceVersion",
      "manufacturer",      
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    console.log(req.body[constants.APPNAME]);
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const {
      email,
      password,
      fcmId,
      deviceName,
      deviceVersion,
      manufacturer,      
    } = req.body[constants.APPNAME];

    const header = req.user;        

    const result = await userMasterModel.findOne({ email: email});

    if (!result) {
      return res.json(helper.generateServerResponse(0, 125));
    }
    if (result.userType != "3") {
      return res.json(helper.generateServerResponse(0, "F"));
    }
    const verify = await bcrypt.compare(password, result.password);
    if (!verify) {
      return res.json(helper.generateServerResponse(0, 109));
    }
    if (result.isActive == 2) {
      return res.json(helper.generateServerResponse(0, 126));
    }

    const token = await jwt.sign(
      { userId: result._id },
      process.env.JWT_SECRET_KEY
    );

    //Logout via DeviceId
    const deviceData = await loginMaster.find({ deviceId: header.deviceId });
    deviceData.forEach(async (index) => {
      if (index.isLogin == 1) {
        index.logoutTime = new Date(Date.now()).toISOString();
        index.isLogin = 2;
      }
      await index.save();
    });

    //Logout via UserId
    const loginM = await loginMaster.find({ userId: result._id });
    loginM.forEach(async (index) => {
      if (index.isLogin == 1) {
        index.logoutTime = new Date(Date.now()).toISOString();
        index.isLogin = 2;
      }
      await index.save();
    });        

    const newDeviceLogin = await loginMaster.create({
      userId: result._id,      
      deviceType: header.deviceType,
      deviceId: header.deviceId,
      fcmId,
      manufacturer,
      appVersion: header.appVersion,
      apiVersion: header.apiVersion,
      deviceName,
      deviceVersion,
      loginTime: new Date(Date.now()).toISOString(),
      isLogin: 1,      
      languageCode: header.languageCode,
      loginRegion: header.loginRegion
    });
    let data = await userDetail(result);
    data = {
      ...data,
      loginId: newDeviceLogin._id,      
      token,
    };

    res.json(helper.generateServerResponse(1, 128, data));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.pinVerify = async (req, res) => {
  try {
    let checkReqKey = ["pin"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const { userId } = req.user;
    const { pin } = req.body[constants.APPNAME];
    const result = await userMasterModel.findOne({ _id: userId });
    if (result) {
      const verify = await bcrypt.compare(pin, result.pin);
      if (!verify) {
        return res.json(helper.generateServerResponse(0, 113));
      }
      return res.json(helper.generateServerResponse(1, 138));
    }
    return res.json(helper.generateServerResponse(0, "F"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.logoutUser = async (req, res) => {
  try {
    let checkReqKey = ["loginId"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }

    const { loginId } = req.body[constants.APPNAME];

    // const userData = await loginMaster.find({
    //   $and: [{ userId: userId }, { deviceId: deviceId }],
    // });
    const userData = await loginMaster.find({
      _id: loginId,
    });

    if (userData.length <= 0) {
      return res.json(helper.generateServerResponse(0, 130));
    }
    userData.forEach(async (index) => {
      if (index.isLogin == 1) {
        index.logoutTime = new Date(Date.now()).toISOString();
        index.isLogin = 2;
      }
      await index.save();
    });
    res.json(helper.generateServerResponse(1, 129));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.otpVerification = async (req, res) => {
  const { userId } = req.user;

  try {
    const {
      otp,
      fcmId,
      deviceName,
      deviceVersion,
      manufacturer,      
    } = req.body[constants.APPNAME];

    const loginTime = new Date(Date.now()).toISOString();
    let checkReqKey = [
      "otp",
      "fcmId",
      "deviceName",
      "deviceVersion",
      "manufacturer",      
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
  
    if (response == 0) {
      console.log("hello error");
      return res.json(helper.generateServerResponse(0, "I"));
    }

    const header = req.user;    

    let data = await userMasterModel.findOne({ _id: userId });
    if (data) {
      if (otp == data.otp) {
        let user = await userMasterModel.findByIdAndUpdate(
          userId,
          { isMobileVerified: 1 },
          { new: true }
        );
        const userLog = await loginMaster.create({
          userId: data._id,
          deviceType: header.deviceType,
          deviceId: header.deviceId,
          isLogin: 1,
          appVersion: header.appVersion,
          apiVersion: header.apiVersion,
          loginTime,
          fcmId,
          manufacturer,
          deviceName,
          deviceVersion,
          loginRegion: header.loginRegion,
          languagecode: data.languageCode
        });

        let result = await userDetail(user);
        result = {
          ...result,
          loginId: userLog._id,
        };
        return res.json(helper.generateServerResponse(1, "S", result));
      }
      res.json(helper.generateServerResponse(0, 107));
    } else {
      res.json(helper.generateServerResponse(0, 107));
    }
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.user;

    const userData = await genrateOtp(userId);
    let data = await userDetail(userData);
    data = {
      ...data,
      otp: userData.otp,
    };
    res.json(helper.generateServerResponse(1, 131, data));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.generatePin = async (req, res) => {
  const { userId } = req.user;
  try {
    let { pin } = req.body[constants.APPNAME];
    let checkReqKey = ["pin"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const salt = await bcrypt.genSalt(10);
    pin = await bcrypt.hash(pin, salt);
    let user = await userMasterModel.findByIdAndUpdate(
      userId,
      { pin: pin },
      { new: true }
    );
    let data = await userDetail(user);
    return res.json(helper.generateServerResponse(1, 108, data));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.changePassword = async (req, res) => {
  try {
    let checkReqKey = ["password", "newPassword"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const { userId } = req.user;

    let result = await userMasterModel.findById(userId);

    let { password, newPassword } = req.body[constants.APPNAME];

    const verify = await bcrypt.compare(password, result.password);

    if (!verify) {
      return res.json(helper.generateServerResponse(0, 109));
    }

    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    let user = await userMasterModel.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );
    let data = await userDetail(user);

    res.json(helper.generateServerResponse(1, 110, data));
  } catch (error) {
    res.json(res.json(helper.generateServerResponse(0, "I")));
  }
};

exports.changePin = async (req, res) => {
  try {
    const { userId } = req.user;
    let checkReqKey = ["pin", "newPin"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    let result = await userMasterModel.findById(userId);

    let { pin, newPin } = req.body[constants.APPNAME];

    const verify = await bcrypt.compare(pin, result.pin);

    if (!verify) {
      return res.json(helper.generateServerResponse(0, 113));
    }

    const salt = await bcrypt.genSalt(10);
    newPin = await bcrypt.hash(newPin, salt);
    let user = await userMasterModel.findByIdAndUpdate(
      userId,
      { pin: newPin },
      { new: true }
    );

    res.json(helper.generateServerResponse(1, "S"));
  } catch (error) {
    res.json(res.json(helper.generateServerResponse(0, "I")));
  }
};

exports.pinVerify = async (req, res) => {
  try {
    let checkReqKey = ["pin"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }

    const { userId } = req.user;
    const { pin } = req.body[constants.APPNAME];
    const result = await userMasterModel.findOne({ _id: userId });
    if (result) {
      const verify = await bcrypt.compare(pin, result.pin);
      if (!verify) {
        return res.json(helper.generateServerResponse(0, 113));
      }
      return res.json(helper.generateServerResponse(1, 138));
    }
    return res.json(helper.generateServerResponse(0, "F"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let checkReqKey = ["email"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const email1 = req.body[constants.APPNAME].email;
    let randomPassword = Math.random().toString(36).slice(-8);

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(randomPassword, salt);
    const user = await userMasterModel.findOneAndUpdate(
      { email: email1 },
      { password: password },
      { new: true }
    );
    if (!user) {
      return res.json(helper.generateServerResponse(0, 101));
    }
    let result = {
      password: randomPassword,
    };
    res.json(helper.generateServerResponse(1, 116, result));
  } catch (error) {
    res.json(res.json(helper.generateServerResponse(0, "I")));
  }
};

exports.forgotPin = async (req, res) => {
  try {
    let checkReqKey = ["email"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const email = req.body[constants.APPNAME].email;
    let randomPin = Math.floor(1000 + Math.random() * 9000);
    let strPin = randomPin.toString();
    const salt = await bcrypt.genSalt(10);
    let pin = await bcrypt.hash(strPin, salt);
    const user = await userMasterModel.findOneAndUpdate(
      { email: email },
      { pin: pin },
      { new: true }
    );
    let result = {
      pin: randomPin,
    };
    if (!user) {
      return res.json(helper.generateServerResponse(0, 101));
    }
    res.json(helper.generateServerResponse(1, 111, result));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.userVerification = async (req, res) => {
  try {
    const { userId } = req.user;
    let checkReqKey = [   
      "name",
      "address",
      "dateOfBirth",
      "profileImage",
      "panCardNumber",
      "panCardPicture",
      "drivingLicenseFront",
      "drivingLicenseBack",
      "aadharCardNumber",
      "aadharCardFrontPicture",
      "aadharCardBackPicture",
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      console.log("error coming from here");
      return res.json(helper.generateServerResponse(0, "I"));
    }    

    const {
      name,      
      address,
      dateOfBirth,
      profileImage,
      panCardNumber,
      panCardPicture,
      drivingLicenseFront,
      drivingLicenseBack,
      aadharCardNumber,
      aadharCardFrontPicture,
      aadharCardBackPicture,
    } = req.body[constants.APPNAME];
    let data = {         
      name,
      dateOfBirth,
      panCardNumber,
      aadharCardNumber,
    };

    

    if(profileImage){      
      let date = new Date().getTime().toString();
      let name = userId + "-profile-" + date;
      let folderPath = "./uploads/profileImages/";
      const imageName = helper.saveImage(profileImage, name, folderPath);
      data = {...data, profileImage: imageName};
    }

    if (panCardPicture) {
      let date = new Date().getTime().toString();
      let name = userId + "-pan-" + date;
      let folderPath = "./uploads/panCardImages/";
      const imageName = helper.saveImage(panCardPicture, name, folderPath);
      data = { ...data, panCardPicture: imageName };
    }
    if (drivingLicenseFront) {
      let date = new Date().getTime().toString();
      let folderPath = "./uploads/drivingLicenseImages/";
      let name = userId + "-LicenseFront-" + date;
      const imageName = helper.saveImage(
        drivingLicenseFront,
        name,
        folderPath
      );
      data = { ...data, drivingLicenseFront: imageName };
    }
    if (drivingLicenseBack) {
      let date = new Date().getTime().toString();
      let folderPath = "./uploads/drivingLicenseImages/";
      let name = userId + "-LicenseBack-" + date;
      const imageName = helper.saveImage(
        drivingLicenseBack,
        name,
        folderPath
      );
      data = { ...data, drivingLicenseBack: imageName };
    }

    if (aadharCardFrontPicture) {
      let date = new Date().getTime().toString();
      let folderPath = "./uploads/aadharCardImages/";
      let name = userId + "-adharFront-" + date;
      const imageName = helper.saveImage(
        aadharCardFrontPicture,
        name,
        folderPath
      );
      data = { ...data, aadharCardFrontPicture: imageName };
    }
    if (aadharCardBackPicture) {
      let date = new Date().getTime().toString();
      let folderPath = "./uploads/aadharCardImages/";
      let name = userId + "-adharBack-" + date;
      const imageName = helper.saveImage(
        aadharCardBackPicture,
        name,
        folderPath
      );
      data = { ...data, aadharCardBackPicture: imageName, folderPath };
    }

    let userAddress = await driverDetails.findOneAndUpdate({userId: userId}, {address: address});
    
    let updateUser = await userMasterModel.findOneAndUpdate(
      { _id: userId },
      data,
      { new: true }
    );

    let result = await userDetail(updateUser);
    result = {...result, address};

    res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.bankDetails = async (req, res) => {  
  let checkReqKey = [
    "name",
    "bankName",
    "accountNumber",
    "ifsc",
    "branch",
    "accountType",
  ];
  let response = helper.validateJSON(req.body[constants.APPNAME], checkReqKey);
  if (response == 0) {
    return res.json(helper.generateServerResponse(0, "I"));
  }
  try {
    const { userId } = req.user;
    const result = req.body[constants.APPNAME];
    const data = await bankDetails.findOne({ userId: userId });
    if (data) {
      const bankDetailUpdate = await bankDetails.findOneAndUpdate(
        { userId: userId },
        result,
        { new: true }
      );
      return res.json(helper.generateServerResponse(1, 144));
    }
    const bank = await bankDetails.create({
      userId: userId,
      name: result.name,
      bankName: result.bankName,
      accountNumber: result.accountNumber,
      ifsc: result.ifsc,
      branch: result.branch,
      accountType: result.accountType,
    });
    res.json(helper.generateServerResponse(1, 142));
  } catch (error) {
    res.json(helper.generateServerResponse(0, 105));
  }
};

exports.isOnOff = async (req, res) => {
  let checkReqKey = ["isOnOff"];
  let response = helper.validateJSON(req.body[constants.APPNAME], checkReqKey);
  if (response == 0) {
    return res.json(helper.generateServerResponse(0, "I"));
  }
  const { userId } = req.user;
  // console.log("User ID " + userId);
  const { isOnOff } = req.body[constants.APPNAME];

  try {
    let user = await driverDetails.findOne({ userId: userId });
    console.log(user.userId);
    if (user == null) {
      return res.json(helper.generateServerResponse(0, 170));
    }

    let user2 = await userMasterModel.findById(userId);

    if(user2.isProfileCompleted === 0){
      return res.json(helper.generateServerResponse(0, "198"));
    }

    const xx = user._id;
    let driverDetail = await driverDetails.findByIdAndUpdate(xx, {
      isOnOff: isOnOff,
    });
    // console.log(userId);
    res.json(helper.generateServerResponse(1, 124));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.acceptOrder = async (req, res) => {
  try{
    const {userId} = req.user;

    const {orderId} = req.body[constants.APPNAME];

    const order = await orderModel.findById(orderId);
    const user = await userMasterModel.findById(userId);

    if(order.driverId){
      return res.json(helper.generateServerResponse(0, "199"));
    }
  
    let order2 = await orderModel.findByIdAndUpdate(orderId, {
      driverId: userId
    }, {new: true});

    const result = await orderDetails(order2);

    helper.sendFcmMessage("Driver assigned" ,`${driver.name} is your delivery partner and on his way to pick up the order!`, token);

    return res.json(helper.generateServerResponse(1, "200", result));
  }  
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
}

exports.getAcceptedOrders = async (req, res) => {
  try{
    const {userId} = req.user;

    const orders = await orderModel.find({$and: [
      {driverId: userId},
      {status: {$ne: "3"}},
      {status: {$ne: "5"}}
    ]});

    if(orders.length == 0){
      return res.json(helper.generateServerResponse(0, "177"));
    }

    const result = await Promise.all(    
      orders.map(async (order) => {        
        return orderDetails(order);
      })
    )

    return res.json(helper.generateServerResponse(1, "S", result));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
}

exports.getPendingDeliveries = async (req, res) => {
  try{
    const {userId} = req.user;

    const user = driverDetails.findById(userId);

    if(user.isOnOff === 2){
      return res.json(helper.generateServerResponse(0, "201"));
    }

    const orders = await orderModel.find({$and: [
      {status : "2"},
      {orderState: "1"},
      {orderState: "2"},
      {driverId: {$type: 'undefined'}}
    ]});

    if(orders.length == 0){
      return res.json(helper.generateServerResponse(0, "177"));
    }

    const result = await Promise.all(
      orders.map(async (order) => {
        const merchantAddress = await merchantModel.findOne({userId: order.merchantId});
        const userAddress = await userAddressModel.findById(order.addressId);
        return {
          orderId: order._id ? order._id : "",
          orderNo: order.orderId ? order.orderId : "",
          pickUp: merchantAddress.address ? merchantAddress.address : "",
          dropOff: userAddress.fullAddress ? userAddress.fullAddress : "",
          estFare: order.deliveryFeePerKm ? order.deliveryFeePerKm : "",
        }
      })
    )

    return res.json(helper.generateServerResponse(1, "S", result));

  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "197"));
  }
}

exports.orderDetails = async (req, res) => {
  try{    
    const {userId} = req.user;

    const orderId = req.params.orderId;    

    const order = await orderModel.findById(orderId);    

    if(!order){
      return res.json(helper.generateServerResponse(0, "168"));
    }
    
    if(order.driverId.toString() != userId){
      return res.json(helper.generateServerResponse(0, "119"));
    }

    const merchantDetails = await merchantModel.findOne({userId: order.merchantId});
    const merchant = await userMasterModel.findById(order.merchantId);
    const customer = await userMasterModel.findById(order.userId);

    const result = {
      orderId: orderId,
      orderNo: order.orderId ? order.orderId : "",
      coverPhoto: merchantDetails.coverPhoto ? merchantDetails.coverPhoto : "",
      merchantName: merchant.name ? merchant.name : "",
      merchantAddress: merchantDetails.address ? merchantDetails.address : "",
      merchantLatitude: "",
      merchantLongitude : "",
      customerName: customer.name ? customer.name : "",
      customerContact: customer.mobile ? customer.mobile : "",
      paymentStatus: order.paymentStatus ? order.paymentStatus : "",      
    }

    return res.json(helper.generateServerResponse(1, "S", result));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "197"));
  }
}

exports.orderPickedUp = async (req, res) => {
  try{
    const {userId} = req.user;

    const driver = await userMasterModel.findById(userId);

    const checkReqKey = [
      "orderId",
      "latitude",
      "longitude"
    ];

    let response = helper.validateJSON(req.body[constants.APPNAME], checkReqKey);

    if(response == 0){
      return res.json(helper.generateServerResponse(0, "I"));
    }

    const {
      orderId,
      latitude,
      longitude,
    } = req.body[constants.APPNAME];
        
    const order = await orderModel.findById(orderId);    
    
    if(!order){
      return res.json(helper.generateServerResponse(0, "168"));
    }

    if(order.driverId.toString() != userId){
      return res.json(helper.generateServerResponse(0, "119"));
    }
    
    const merchant = await merchantModel.findOne({userId: order.merchantId});
    const user = await userMasterModel.findById(order.userId);    

    let mlatitude = merchant.latitude;
    let mlongitude = merchant.longitude;

    if(helper.checkDistance(latitude, longitude, mlatitude, mlongitude) > 0.03){ // If driver is not near the pickup location
      return res.json(helper.generateServerResponse(0, "202"));
    }    

    order.status = "4";
    order.save({validateBeforeSave: false});

    

    helper.sendFcmMessage("Order picked up" ,`${driver.name} has picked up your order and on his way to deliver!`, token);

    return res.json(helper.generateServerResponse(1, "191", order));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "197"));
  }
}

exports.orderDelivered = async (req, res) => {
  try{
    const {userId} = req.user;

    const {orderId} = req.body[constants.APPNAME];

    const order = await orderModel.findById(orderId);    
    
    if(!order){
      return res.json(helper.generateServerResponse(0, "168"));
    }

    if(order.driverId.toString() != userId){
      return res.json(helper.generateServerResponse(0, "119"));
    }

    order.status = "5";
    order.save({validateBeforeSave: false});

    helper.sendFcmMessage("Delivered" ,`Your order has been delivered!`, token);

    return res.json(helper.generateServerResponse(1, "187", order));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "197"));
  }
}
