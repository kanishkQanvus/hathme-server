const loginMaster = require("../model/loginMaster-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userMasterModel = require("../model/userMaster-model");
const constants = require("../constants");
const helper = require("../helper/apiHelper");
const { default: mongoose } = require("mongoose");
const { find } = require("../model/loginMaster-model");
// const addTocartModel = require("../")
const { read } = require("fs");
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
      "languageCode",
      "fcmId",
      "manufacturer",
      "deviceName",
      "deviceId",
      "appVersion",
      "apiVersion",
      "deviceType",      
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
      manufacturer,
      deviceName,
      countryCode,
      languageCode,
      deviceType,
      deviceId,
      appVersion,
      apiVersion,
    } = req.body[constants.APPNAME];

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
      deviceType,
      deviceId,
      fcmId,
      manufacturer,
      appVersion,
      apiVersion,
      deviceName,
      otp: "123456",
      pin: null,
      referredFrom,
      referralCode,
      isMobileVerified: 0,
      isProfileCompleted: 0,
      isActive: 1,
      userType: 3, //1 - User, 2 - Merchant, 3 - driver, 4 - staff
      countryCode,
      languageCode,
    };
    const result = await userMasterModel(payload);
    await result.save();
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
      "manufacturer",
      "deviceName",
      "deviceId",
      "deviceType",
      "appVersion",
      "apiVersion",
      "languageCode",
      "loginRegion"
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
      manufacturer,
      deviceName,
      deviceId,
      deviceType,
      appVersion,
      apiVersion,
      languageCode,
      loginRegion
    } = req.body[constants.APPNAME];

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
    const deviceData = await loginMaster.find({ deviceId: deviceId });
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
      deviceType,
      deviceId,
      fcmId,
      manufacturer,
      appVersion,
      apiVersion,
      deviceName,
      loginTime: new Date(Date.now()).toISOString(),
      isLogin: 1,      
      languageCode,
      loginRegion
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
      manufacturer,
      deviceName,
      deviceId,
      deviceType,
      appVersion,
      apiVersion,
    } = req.body[constants.APPNAME];

    const loginTime = new Date(Date.now()).toISOString();
    let checkReqKey = [
      "otp",
      "fcmId",
      "manufacturer",
      "deviceName",
      "deviceId",
      "deviceType",
      "appVersion",
      "apiVersion"
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      console.log("hello error");
      return res.json(helper.generateServerResponse(0, "I"));
    }
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
          deviceType,
          deviceId,
          isLogin: 1,
          appVersion,
          apiVersion,
          loginTime,
          fcmId,
          manufacturer,
          deviceName,
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
      { pin: pin, isProfileCompleted: 1 },
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
    const salt = await bcrypt.genSalt(10);
    let pin = await bcrypt.hash(strPin, salt);
    const user = await userMasterModel.findOneAndUpdate(
      { email: email1 },
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
    res.json(res.json(helper.generateServerResponse(0, "I")));
  }
};

exports.userVerification = async (req, res) => {
  try {
    const { userId } = req.user;
    let checkReqKey = [
      "fullName",
      "dateOfBirth",
      "panCardNumber",
      "panCardPicture",
      "aadharCardNumber",
      "aadharCardFrontPicture",
      "aadharCardBackPicture",
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const {
      name,
      dateOfBirth,
      panCardNumber,
      panCardPicture,
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
    if (panCardPicture) {
      let date = new Date();
      let name = userId + "pan" + date;
      let folderPath = "./uploads/panCardImages/";
      const imageName = helper.saveImage(panCardPicture, name, folderPath);
      data = { ...data, panCardPicture: imageName };
    }
    if (aadharCardFrontPicture) {
      let date = new Date();
      let folderPath = "./uploads/aadharCardImages/";
      let name = userId + "adharFront" + date;
      const imageName = helper.saveImage(
        aadharCardFrontPicture,
        name,
        folderPath
      );
      data = { ...data, aadharCardFrontPicture: imageName };
    }
    if (aadharCardBackPicture) {
      let date = new Date();
      let folderPath = "./uploads/aadharCardImages/";
      let name = userId + "adharBack" + date;
      const imageName = helper.saveImage(
        aadharCardBackPicture,
        name,
        folderPath
      );
      data = { ...data, aadharCardBackPicture: imageName, folderPath };
    }
    let updateUser = await userMasterModel.findOneAndUpdate(
      { _id: userId },
      data,
      { new: true }
    );

    let result = await userDetail(updateUser);

    res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};


