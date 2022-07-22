const loginMaster = require("../model/loginMaster-model");
const userRequestModel = require("../model/userRequest-model");
const firendListModel = require("../model/friendList-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const userMasterModel = require("../model/userMaster-model");
const constants = require("../constants");
const helper = require("../helper/apiHelper");
const { merchnatDetail } = require("./merchantMaster-controller");
const { default: mongoose } = require("mongoose");
const { find } = require("../model/loginMaster-model");
const productModel = require("../model/products-model");
const merchantModel = require("../model/merchantDetails");
// const addTocartModel = require("../")
const addToCartModel = require("../model/addToCart-model");
const userAddressModel = require("../model/userAddress-model");
const couponModel = require("../model/coupan-model");
const orderModel = require("../model/order-model");
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
    uniqueID: data.uniqueID ? data.uniqueID : "",
    // url: data.url ? process.env.QRURL + `${data.url.substring(1)}` : "",
    qrUrl: data.qrUrl ? data.qrUrl : "",
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

const mutualFriendDetail = async (data) => {
  // if(data.length ==0){return []}
  let value = data.map((a, index) => {
    if (index >= 2) {
      return;
    }
    const d = a.mutualFriend;
    let result = {
      userId: d._id ? d._id : "",
      name: d.name ? d.name : "",
      mobile: d.mobile ? d.mobile : "",
      userName: d.userName ? d.userName : "",

      email: d.email ? d.email : "",

      dateOfBirth: d.dateOfBirth ? d.dateOfBirth : "",
      isActive: d.isActive ? d.isActive : "",

      profileImage: d.profileImage
        ? process.env.PROFILEIMAGE + `${d.profileImage}`
        : "",
    };
    return result;
  });
  let result = value.filter((user) => user);
  return result;
};

///commented for checking (code of jahangir)
// exports.newUser = async (req, res) => {
//   const APPNAME = constants.APPNAME;
//   try {
//     let checkReqKey = [
//       "name",
//       "mobile",
//       "email",
//       "password",
//       "referralCode",
//       "countryCode",
//       "fcmId",
//       "manufacturer",
//       "deviceName",
//       "deviceId",
//       "version",
//       "deviceType",
//     ];
//     let response = helper.validateJSON(
//       req.body[constants.APPNAME],
//       checkReqKey
//     );
//     if (response == 0) {
//       return res.json(helper.generateServerResponse(0, "I"));
//     }
//     let {
//       password,
//       referralCode,
//       name,
//       email,
//       mobile,
//       fcmId,
//       manufacturer,
//       deviceName,
//       countryCode,
//       deviceType,
//       deviceId,
//       version,
//     } = req.body[constants.APPNAME];
//     let referredFrom = null;
//     const userAlreadyExistEmail = await userMasterModel.find({ email });
//     const userAlreadyExistMobile = await userMasterModel.find({ mobile });
//     const loginTime = new Date(Date.now()).toISOString();
//     if (userAlreadyExistMobile.length > 0) {
//       return res.json(helper.generateServerResponse(0, 104));
//     }
//     if (userAlreadyExistEmail.length > 0) {
//       return res.json(helper.generateServerResponse(0, 102));
//     }
//     if (referralCode && referralCode.length > 0) {
//       let referalUser = await userMasterModel.findOne({
//         referralCode: referralCode,
//       });
//       if (!referalUser) {
//         return res.json(helper.generateServerResponse(0, "158"));
//       }
//       referredFrom = referalUser ? referalUser._id : "";
//     }
//     referralCode = await referalCodeStr();
//     const salt = await bcrypt.genSalt(10);
//     password = await bcrypt.hash(password, salt);
//     let randNum = Math.floor(Math.random() * 9000000000) + 1000000000;
//     let payload = {
//       password,
//       name,
//       email,
//       mobile,
//       deviceType,
//       deviceId,
//       fcmId,
//       manufacturer,
//       version,
//       deviceName,
//       otp: "123456",
//       pin: null,
//       referredFrom,
//       referralCode,
//       isMobileVerified: 0,
//       isProfileCompleted: 0,
//       isActive: 1,
//       userType: 1, //1 - User, 2 - Merchant
//       countryCode,
//       randNum,
//     };
//     const result = await userMasterModel(payload);
//     await result.save();
//     //Creating QR //
//     let qrData = {
//       name,
//       email,
//       mobile,
//       referralCode,
//       randNum,
//     };
//     let stringdata = JSON.stringify(qrData);
//     // Saving Image to system
//     const generateQR = async (text) => {
//       try {
//         await QRCode.toFile(`uploads/qrcode/${new Date().getTime()}.png`, text);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     generateQR(stringdata);
//     // let genOtp = await genrateOtp(result._id);
//     const token = await jwt.sign(
//       { userId: result._id },
//       process.env.JWT_SECRET_KEY
//     );
//     let data = await userDetail(result);
//     data = {
//       ...data,
//       token,
//     };
//     res.json(helper.generateServerResponse(1, 103, data));
//   } catch (error) {
//     res.json(helper.generateServerResponse(0, "I"));
//   }
// };

/////

/// old code

exports.newUser = async (req, res) => {
  const APPNAME = constants.APPNAME;

  try {
    let checkReqKey = [
      "name",
      "mobile",
      "email",
      "password",
      "referralCode",
      "countryCode",
      "deviceName",
      "deviceVersion",
      "fcmId",
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

    const uniqueID = Math.floor(Math.random() * 9000000000) + 1000000000;
    const url = `./uploads/qrcode/${new Date().getTime()}.png`;
    const qrUrl = process.env.QRURL + `${url.substring(1)}`;

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
      userType: 1, //1 - User, 2 - Merchant
      countryCode,
      loginRegion: header.loginRegion,
      languageCode: header.languageCode,
      uniqueID,
      qrUrl,
    };
    const result = await userMasterModel(payload);
    await result.save();

    //Creating QR //

    let qrData = {
      name,
      email,
      mobile,
      referralCode,
      uniqueID,
    };
    console.log(qrData);
    let stringdata = JSON.stringify(qrData);

    // Saving Image to system
    const generateQR = async (text) => {
      try {
        await QRCode.toFile(`${url}`, text);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR(stringdata);

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

exports.loginUser = async (req, res) => {
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

    const result = await userMasterModel.findOne({ email: email });

    if (!result) {
      return res.json(helper.generateServerResponse(0, 125));
    }
    if (result.userType != "1") {
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

exports.updateProfile = async (req, res) => {
  try {
    let { userId } = req.user;
    let { name, profileImage, userName } = req.body[constants.APPNAME];
    if (userName) {
      let userNameAlreadyExist = await userMasterModel.findOne({
        userName: userName,
        _id: { $ne: userId },
      });
      if (userNameAlreadyExist) {
        return res.json(helper.generateServerResponse(0, 140));
      }
    }

    let data = {
      name,
      userName,
    };
    if (profileImage) {
      // let date= new Date();
      // let name = userId +"profile"+date;
      let profilePath = "./uploads/profileImages/";
      let name = await helper.getRandomFileName();

      const imageName = helper.saveImage(profileImage, name, profilePath);
      data = { ...data, profileImage: imageName };
    }
    let updateUser = await userMasterModel.findOneAndUpdate(
      { _id: userId },
      data,
      { new: true }
    );

    let result = await userDetail(updateUser);
    res.json(helper.generateServerResponse(1, 123, result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
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

exports.searchUser = async (req, res) => {
  const { keyword } = req.body[constants.APPNAME];
  const { userId } = req.user;
  const query = {
    $or: [
      { email: { $regex: keyword, $options: "i" } },
      { name: { $regex: keyword, $options: "i" } },
      { userName: { $regex: keyword, $options: "i" } },
    ],
  };
  let searchData = await userMasterModel.find(query);

  let data = await Promise.all(
    searchData.map(async (user) => {
      let userFriends = await userRequestModel.find({
        $or: [{ sendByUserId: user._id }, { sendToUserId: user._id }],
      });
      const isFriend = await userRequestModel.find({
        $or: [
          {
            $and: [
              { sendToUserId: mongoose.Types.ObjectId(user._id) },
              { sendByUserId: mongoose.Types.ObjectId(userId) },
            ],
          },
          {
            $and: [
              { sendToUserId: mongoose.Types.ObjectId(userId) },
              { sendByUserId: mongoose.Types.ObjectId(user._id) },
            ],
          },
        ],
      });

      if (isFriend.length == 0) {
        return {
          user: await shortUserDetail(user),
          friendStatus: 0,
          mutualFriend: await mutualFriendDetail([]),
          count: 0,
        };
      }

      const mutual = await Promise.all(
        userFriends.map(async (v) => {
          let mutualFriend;
          const friendId = v.sendByUserId.equals(user._id)
            ? v.sendToUserId
            : v.sendByUserId;
          if (friendId.equals(user._id)) return null;

          mutualFriend = await userRequestModel.find({
            $or: [
              {
                $and: [
                  { sendByUserId: userId }, // meri id
                  { sendToUserId: friendId }, /// dost ki id
                  { status: "2" },
                ],
              },
              {
                $and: [
                  { sendByUserId: friendId },
                  { sendToUserId: userId },
                  { status: "2" },
                ],
              },
            ],
          });

          if (mutualFriend.length == 0) return null;
          return {
            mutualFriend: await userMasterModel.findById(friendId),
            friendStatus: 2,
          };
        })
      );

      const mutualFriend = mutual.filter((user) => user?.mutualFriend);

      return {
        user: await shortUserDetail(user),
        friendStatus: isFriend[0].status,
        mutualFriend: await mutualFriendDetail(mutualFriend),
        count: mutualFriend.length,
      };
    })
  );
  res.send(helper.generateServerResponse(1, "S", data));
};

exports.searchByUser = async (req, res) => {
  try {
    const { keyword, type } = req.body[constants.APPNAME];
    if (type == 2) {
      const query = { aadharCardNumber: { $regex: keyword, $options: "i" } };
      let searchData = await userMasterModel.find(query, {
        email: 1,
        name: 1,
        mobile: 1,
        profileImage: 1,
      });

      if (searchData.length <= 0) {
        return res.json(helper.generateServerResponse(0, 135));
      }
      searchData.forEach((value) => {
        value.profileImage = process.env.PROFILEIMAGE + `${value.profileImage}`;
      });
      return res.json(helper.generateServerResponse(1, "S", searchData));
    } else {
      const query = {
        name: { $regex: keyword, $options: "i" },
        email: { $regex: keyword, $options: "i" },
        userName: { $regex: keyword, $options: "i" },
      };
      let searchData = await userMasterModel.find(
        { $or: [query] },
        { email: 1, name: 1, mobile: 1, profileImage: 1 }
      );
      if (searchData.length <= 0) {
        return res.json(helper.generateServerResponse(0, 135));
      }
      searchData.forEach((value) => {
        value.profileImage = process.env.PROFILEIMAGE + `${value.profileImage}`;
      });

      return res.json(helper.generateServerResponse(1, 134, searchData));
    }
  } catch (error) {
    res.json(helper.generateServerResponse(1, 134, searchData));
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await userMasterModel.findById({ _id: id });
    if (data) {
      let result = await userDetail(data);
      return res.json(helper.generateServerResponse(1, 137, result));
    }
    return res.json(helper.generateServerResponse(0, "F"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

const requestUserDetail = async (userId) => {
  try {
    let data = await userMasterModel.findOne({ _id: userId });

    let result = {
      userId: data._id ? data._id : "",
      name: data.name ? data.name : "",
      mobile: data.mobile ? data.mobile : "",
      userName: data.userName ? data.userName : "",
      email: data.email ? data.email : "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth : "",
      profileImage: data.profileImage
        ? process.env.PROFILEIMAGE + `${data.profileImage}`
        : "",
    };

    return result;
  } catch (error) {
    console.log(error);
    // res.json(helper.generateServerResponse(0, "I"));
  }
};

const requestMerchantrDetail = async (userId) => {
  try {
    let data = await userMasterModel.findOne({ _id: userId });
    // console.log(data, "data");
    if (data) {
      let result = {
        merchantId: data._id ? data._id : "",
        name: data.name ? data.name : "",
        mobile: data.mobile ? data.mobile : "",
        userName: data.userName ? data.userName : "",
        email: data.email ? data.email : "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth : "",
        profileImage: data.profileImage
          ? process.env.PROFILEIMAGE + `${data.profileImage}`
          : "",
      };

      return result;
    }
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.user;

    const sendToUserId = req.query.id;
    let alreadySendFriendReq = await userRequestModel.findOne({
      $and: [
        {
          sendToUserId: sendToUserId,
        },
        { sendByUserId: userId },
      ],
    });
    if (alreadySendFriendReq) {
      return res.json(helper.generateServerResponse(0, ""));
    }
    let payload = {
      sendByUserId: userId,
      sendToUserId,
      status: "1", // 1=pending 2= Accept 3 = Reject
    };
    let data = await userRequestModel.create(payload);
    let result = await requestUserDetail(userId);
    result = {
      ...result,
      requestId: data._id,
      status: data.status,
    };
    return res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.pendingRequestList = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = await userRequestModel.find({
      $and: [
        { sendByUserId: mongoose.Types.ObjectId(userId) },
        { status: "1" },
      ],
    });

    if (data.length <= 0) {
      return res.json(helper.generateServerResponse(0, "159"));
    }

    let pendingList = await Promise.all(
      data.map(async (user) => {
        let temp = await userMasterModel.findOne({ _id: user.sendToUserId });
        return {
          requestId: user._id,
          id: temp._id,
          name: temp.name,
          profileImage: temp.profileImage ? temp.profileImage : "",
        };
      })
    );

    let user = await userMasterModel.findOne({ _id: userId });
    console.log(user, "user is coming");
    let result = {
      userId: user._id,
      name: user.name,
      profileImage: user.profileImage ? user.profileImage : "",
      pendingList,
    };

    console.log(result, "result is coming");
    // let result = await requestUserDetail(sendByUserId);

    // result = {
    //   ...result,
    //   requestId: data[0]._id,
    //   sendByUserId: data[0].sendByUserId,
    //   sendToUserId: data[0].sendToUserId,
    // };
    return res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "F"));
  }
};
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.query;
    const data = await userRequestModel.findByIdAndUpdate(
      { _id: requestId },
      { status: "2" },
      { new: true }
    );
    res.json(helper.generateServerResponse(1, "143"));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.rejectRequestList = async (req, res) => {
  try {
    const { requestId } = req.query;
    const data = await userRequestModel.findByIdAndDelete({ _id: requestId });
    res.json(helper.generateServerResponse(1, "145"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.friendRequestList = async (req, res) => {
  try {
    const { userId } = req.user;
    let userFriends = await userRequestModel.find({
      $and: [
        { status: "2" },
        { $or: [{ sendByUserId: userId }, { sendToUserId: userId }] },
      ],
    });
    console.log(userFriends, "user friends");
    const mutual = await Promise.all(
      userFriends.map(async (v) => {
        let mutualFriend;
        const friendId = v.sendByUserId.equals(userId)
          ? v.sendToUserId
          : v.sendByUserId;
        console.log(friendId, "friend id is coming");

        let friendOfFriend = await userRequestModel.find({
          $and: [
            { status: "2" },
            { $or: [{ sendByUserId: friendId }, { sendToUserId: friendId }] },
          ],
        });

        console.log(friendOfFriend, "friend of friend");

        mutualFriend = friendOfFriend.filter((v) => {
          const friendOfFriendId = v.sendByUserId.equals(friendId)
            ? v.sendToUserIdisMyFriend
            : v.sendByUserId;
          const isMyFriend = userFriends.find((friend) => {
            return (
              friend.sendToUserId.equals(friendOfFriendId) ||
              friend.sendByUserId.equals(friendOfFriendId)
            );
          });
          if (isMyFriend) return true;
          return false;
        });
        mutualFriend = await Promise.all(
          mutualFriend.map(async (v) => {
            const friendOfFriendId = v.sendByUserId.equals(friendId)
              ? v.sendToUserIdisMyFriend
              : v.sendByUserId;
            let result = await userMasterModel.findById(friendOfFriendId);
            return shortUserDetail(result);
          })
        );
        let friend = await userMasterModel.findOne({ _id: friendId });
        // console.log(friend)
        let temp = await shortUserDetail(friend);
        temp = {
          ...temp,
          mutualFriend,
          count: mutualFriend.length,
        };
        return temp;
      })
    );

    return res.json(helper.generateServerResponse(1, "S", mutual));
  } catch (error) {
    console.log(error);
  }
};

exports.mutualFriendRequsestList = async (req, res) => {
  try {
    const { userId } = req.user;

    const data = await userRequestModel.find({
      $and: [
        { status: "2" },
        { $or: [{ sendByUserId: userId }, { sendToUserId: userId }] },
      ],
    });
    console.log(data, "this is my friend");

    // check every myfriend of friend

    //

    let friends = await Promise.all(
      data.map(async (value, index) => {
        let id;
        if (userId == value.sendByUserId) {
          id = value.sendToUserId;
        } else {
          id = value.sendByUserId;
        }
        let temp = await userMasterModel.findOne({ _id: id });

        let payload = {
          userId: temp._id,
          name: temp.name ? temp.name : "",
          userName: temp.userName ? temp.userName : "",
          email: temp.email ? temp.email : "",
          mobile: temp.mobile ? temp.mobile : "",
          profileImage: temp.profileImage ? temp.profileImage : "",
          dateOfBirth: temp.dateOfBirth ? temp.dateOfBirth : "",
        };
        return payload;
      })
    );
    return res.json(helper.generateServerResponse(1, "146", friends));
  } catch (e) {
    console.log(e);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.productList = async (req, res) => {
  try {
    let products = await find();
    if (products.length <= 0) {
    }
    return res.json(helper.generateServerResponse(1, "160"));
  } catch (error) {
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

const getProductDetail = async (product) => {
  let result = {
    productId: product._id ? product._id : "",
    name: product.name ? product.name : "",
    description: product.description ? product.description : "",
    isVeg: product.isVeg ? product.isVeg : "",
    categoryId: product.categoryId ? product.categoryId : "",
    type: product.type ? product.type : "",
    status: product.status ? product.status : "",
    rating: product.rating ? product.rating : "0",
    price: product.price ? product.price : "",
    recommended: product.recommended ? product.recommended : "",
    productCategoryMasterId: product.productCategoryMasterId
      ? product.productCategoryMasterId
      : "",
    productImageOne: product.productImageOne
      ? process.env.PRODUCTIMAGES + product.productImageOne
      : "",
    productImageTwo: product.productImageTwo
      ? process.env.PRODUCTIMAGES + product.productImageTwo
      : "",
    productImageThree: product.productImageThree
      ? process.env.PRODUCTIMAGES + product.productImageThree
      : "",
  };
  return result;
};

exports.categoryBasedOnMerchent = async (req, res) => {
  console.log("merchant list by category  new");
  try {
    const { categoryId } = req.body[constants.APPNAME];
    //const { categoryId } = req.query;
    let merchants = await productModel.find({ categoryId: categoryId });
    // console.log(merchants, "mechants");
    if (merchants.length <= 0) {
      res.json(helper.generateServerResponse(0, "F"));
    }

    let result = [];

    await Promise.all(
      merchants.map(async (merchant) => {
        
        const data = await requestMerchantrDetail(merchant.userId);

        if(data){
          result.push(data);
        }
      })
    );    
    
    result = [...new Set(result.map((a) => JSON.stringify(a)))].map((a) =>
      JSON.parse(a)
    );

    // result = result.filter((user) => user);
    res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

// exports.categoryBasedOnMerchent = async (req, res) => {
//   console.log("merchant list by category");
//   try {
//     const { categoryId } = req.body[constants.APPNAME];

//     let category = await merchantModel.find({ categoryId: categoryId });
//     console.log(category,"category");
//     let merchandDetail = await Promise.all(
//       category.map(async (value) => {
//         let data = await userMasterModel.findById(value.userId);
//         console.log(value.userId);

//         let result;
//         if (data) {
//           result = await userDetail(data);
//           return (result = {
//             ...result,
//             categoryId: value.categoryId ? value.categoryId : "",
//             coverPhoto: value.coverPhoto
//               ? process.env.CATEGORIESIMAGE + value.coverPhoto
//               : "",
//             isOnOff: value.isOnOff ? value.isOnOff : "",
//           });
//         }
//       })
//     );
//     merchandDetail = merchandDetail.filter((user) => user);
//     res.json(helper.generateServerResponse(1, "S", merchandDetail));
//   } catch (error) {
//     console.log(error);
//     res.json(helper.generateServerResponse(0, "I"));
//   }
// };

exports.productListByMerchantId = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId, "user id is coming");
    const { merchantId, recommended } = req.body[constants.APPNAME];
    console.log(merchantId, "merchant id");
    let merchantDetailData = await merchantModel.findOne({
      userId: merchantId,
    });
    console.log(merchantDetailData, "merchant detils");
    if (!merchantDetailData) {
      return res.json(helper.generateServerResponse(0, 183));
    }
    let userData = await userMasterModel.findOne({
      _id: merchantDetailData.userId,
    });
    let data;
    if (userData) {
      data = {
        ...data,
        merchantName: userData.name ? userData.name : "",
      };
    }
    if (merchantDetailData) {
      data = {
        ...data,
        MerchantAddress: merchantDetailData.address
          ? merchantDetailData.address
          : "",
        rating: merchantDetailData?.rating ? merchantDetailData.rating : "0",
        coverPhoto: merchantDetailData?.coverPhoto
          ? process.env.CATEGORIESIMAGE + merchantDetailData.coverPhoto
          : "",
      };
    }

    let products_recommended = await productModel.find({
      $and: [
        { userId: mongoose.Types.ObjectId(merchantId) },
        { recommended: "1" },
        { status: { $ne: "3" } },
      ],
    });
    let cartProducts = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });

    let recommendedProducts = await Promise.all(
      products_recommended.map(async (product) => {
        if (cartProducts) {
          let cartItems = cartProducts?.products.filter((v) => {
            if (v.productId.toString() == product._id.toString()) {
              return v;
            }
          });
          return {
            ...(await getProductDetail(product)),
            quantity: cartItems[0]?.quantity,
          };
        }

        return {
          ...(await getProductDetail(product)),
        };
      })
    );

    let products = await productModel.find({
      $and: [
        { userId: mongoose.Types.ObjectId(merchantId) },
        { status: { $ne: "3" } },
      ],
    });
    let allProducts = await Promise.all(
      products.map(async (product) => {
        if (cartProducts) {
          let cartItems = cartProducts.products.filter((v) => {
            if (v.productId.toString() == product._id.toString()) {
              return v;
            }
          });
          return {
            ...(await getProductDetail(product)),
            quantity: cartItems[0]?.quantity,
          };
        }
        return {
          ...(await getProductDetail(product)),
        };
      })
    );
    recommendedProducts = recommendedProducts.filter((product) => product);
    allProducts = allProducts.filter((product) => product);
    data = {
      ...data,
      recommendedProducts,
      allProducts,
    };

    return res.json(helper.generateServerResponse(1, "S", data));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

const getUserAddress = async (address) => {
  return {
    addressId: address._id ? address._id : "",
    userId: address.userId ? address.userId : "",
    areaName: address.areaName ? address.areaName : "",
    addressType: address.addressType ? address.addressType : "",
    fullAddress: address.fullAddress ? address.fullAddress : "",
    completeAddress: address.completeAddress ? address.completeAddress : "",
    latitude: address.latitude ? address.latitude : "",
    longitude: address.longitude ? address.longitude : "",
    floor: address.floor ? address.floor : "",
    landmark: address.landmark ? address.landmark : "",
  };
};

exports.address = async (req, res) => {
  try {
    const { userId } = req.user;
    // let check =  await userAddressModel.findOne({userId:userId});
    // if(check){return res.json(helper.generateServerResponse(0,"169"))}
    // let checkReqKey = [
    //   "areaName",
    //   "fullAddress",
    //   "addressType",
    //   "completeAddress",
    //   "latitude",
    //   "longitude",
    // ];
    // let response = helper.validateJSON(
    //   req.body[constants.APPNAME],
    //   checkReqKey
    // );
    // console.log(response);
    // if (response == 0) {
    //   return res.json(helper.generateServerResponse(0, "I"));
    // }
    let payload = req.body[constants.APPNAME];
    payload = {
      ...payload,
      userId: userId,
    };

    let data = await userAddressModel.create(payload);
    let result = await getUserAddress(data);
    if (data) {
      return res.json(helper.generateServerResponse(1, "S", result));
    }
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.updateAdress = async (req, res) => {
  try {
    const { addressId } = req.body[constants.APPNAME];

    let payload = req.body[constants.APPNAME];

    let data = await userAddressModel.findOneAndUpdate(
      { _id: addressId },
      payload,
      { new: true }
    );
    let result = await getUserAddress(data);
    if (data) {
      return res.json(helper.generateServerResponse(1, "S", result));
    }
    return res.json(helper.generateServerResponse(0, 170));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.getAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    let addresses = await userAddressModel.find({ userId: userId });

    let result;
    if (addresses.length > 0) {
      result = await Promise.all(
        addresses.map(async (address) => {
          return await getUserAddress(address);
        })
      );
      return res.json(helper.generateServerResponse(1, "S", result));
    }
    return res.json(helper.generateServerResponse(0, "F", []));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.deleteAdress = async (req, res) => {
  try {
    const { addressId } = req.body[constants.APPNAME];
    let address = await userAddressModel.findOneAndRemove({ _id: addressId });
    let result;
    if (address) {
      return res.json(helper.generateServerResponse(1, 171));
    }
    return res.json(helper.generateServerResponse(0, "F"));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.addToCart = async (req, res) => {
  const { userId } = req.user;
  const { quantity, productId } = req.body[constants.APPNAME];
  try {
    let cart = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });
    let productsData = await productModel.findOne({ _id: productId });

    if (quantity == 0) {
      if (!cart) {
        return res.json(helper.generateServerResponse(0, "172", []));
      }
      if (cart.merchantId.toString() != productsData.userId.toString()) {
        return res.json(helper.generateServerResponse(2, "181"));
      }

      let itemIndex = cart?.products.findIndex(
        (p) => p.productId.valueOf() === productId
      );

      console.log(itemIndex, "if quantity 0 then item index");

      if (itemIndex === -1) {
        return res.json(helper.generateServerResponse(2, 181));
      }

      cart.products.splice(itemIndex, 1);
      await cart.save();

      if (cart?.products?.length <= 0) {
        let cart = await addToCartModel.findOneAndRemove({ userId: userId });
        return res.json(helper.generateServerResponse(0, "172", []));
      }
      let cartProducts = await Promise.all(
        cart.products.map(async (product) => {
          let temp = await productModel.findOne({ _id: product.productId });

          return {
            productId: temp._id,
            categoryId: temp.categoryId ? temp.categoryId : "",
            imageOne: temp.productImageOne
              ? process.env.PRODUCTIMAGES + temp.productImageOne
              : "",
            imageTwo: temp.productImageTwo
              ? process.env.PRODUCTIMAGES + temp.productImageTwo
              : "",
            imageThree: temp.productImageThree
              ? process.env.PRODUCTIMAGES + temp.productImageThree
              : "",
            quantity: product.quantity,
            price: product.quantity * temp.price,
          };
        })
      );
      let totalamount = 0;
      cartProducts.map((p) => {
        totalamount += p.price;
      });
      let toPay = totalamount + 15;
      let billDetails = {
        totalAmount: totalamount,
        delivery: 0,
        taxesAndCharges: 15,
        toPay,
      };
      if (cart?.couponCode?.length > 0) {
        const billDetails = await discountFunction(userId, cart.couponCode);
        if (billDetails) {
          return res.json(
            helper.generateServerResponse(1, "S", { cartProducts, billDetails })
          );
        }
      }
      return res.json(
        helper.generateServerResponse(1, "165", { cartProducts, billDetails })
      );
    }
    let billDetails;
    let cartProducts;
    if (cart) {
      console.log(cart.merchantId, productsData.userId, "check");
      console.log(cart, "cart");
      if (cart.merchantId.toString() != productsData.userId.toString()) {
        return res.json(helper.generateServerResponse(2, "180"));
      }
      let itemIndex = cart.products.findIndex(
        (p) => p.productId.valueOf() === productId
      );

      console.log(itemIndex, "if cart then item index");

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item

        cart.products.push({
          productId,
          quantity,
          categoryId: productsData.categoryId,
        });
      }
      cart = await cart.save();
      let cartProducts = await Promise.all(
        cart.products.map(async (product) => {
          let temp = await productModel.findOne({ _id: product.productId });

          return {
            productId: temp._id,
            categoryId: temp.categoryId ? temp.categoryId : "",

            imageOne: temp.productImageOne
              ? process.env.PRODUCTIMAGES + temp.productImageOne
              : "",
            imageTwo: temp.productImageTwo
              ? process.env.PRODUCTIMAGES + temp.productImageTwo
              : "",
            imageThree: temp.productImageThree
              ? process.env.PRODUCTIMAGES + temp.productImageThree
              : "",
            quantity: product.quantity,
            price: product.quantity * temp.price,
          };
        })
      );

      let amount = 0;
      cartProducts.map((p) => {
        amount += p.price;
      });
      let toPay = amount + 15;
      billDetails = {
        totalAmount: amount,
        taxesAndCharges: 15,
        delivery: 0,
        toPay,
      };
      if (cart?.couponCode?.length > 0) {
        const billDetails = await discountFunction(userId, cart.couponCode);
        if (billDetails) {
          return res.json(
            helper.generateServerResponse(1, "S", { cartProducts, billDetails })
          );
        }
      }
      return res.json(
        helper.generateServerResponse(1, "164", { cartProducts, billDetails })
      );
    }

    if (!cart) {
      let cart = await addToCartModel.create({
        userId: mongoose.Types.ObjectId(userId),
        merchantId: productsData.userId,
        products: [
          {
            productId: productId,
            quantity: quantity,
            categoryId: productsData.categoryId,
          },
        ],
      });
      let cartProducts = await Promise.all(
        cart.products.map(async (product) => {
          let temp = await productModel.findOne({ _id: product.productId });

          return {
            prouctId: temp._id,
            categoryId: temp.categoryId ? temp.categoryId : "",

            imageOne: temp.productImageOne
              ? process.env.PRODUCTIMAGES + temp.productImageOne
              : "",
            imageTwo: temp.productImageTwo
              ? process.env.PRODUCTIMAGES + temp.productImageTwo
              : "",
            imageThree: temp.productImageThree
              ? process.env.PRODUCTIMAGES + temp.productImageThree
              : "",
            quantity: product.quantity,
            price: product.quantity * temp.price,
          };
        })
      );

      let amount = 0;
      cartProducts.map((p) => {
        amount += p.price;
      });
      let toPay = amount + 15;
      billDetails = {
        totalAmount: amount,
        taxesAndCharges: 15,
        delivery: 0,
        toPay,
      };

      return res.json(
        helper.generateServerResponse(1, "163", { cartProducts, billDetails })
      );
    }
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.getCoupon = async (req, res) => {
  try {
    let availableCoupan = await couponModel.find({ isActive: "1" });
    return res.json(helper.generateServerResponse(1, "S", availableCoupan));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

// exports.getProductFromCart = async (req, res) => {
//   const { userId } = req.user;
//   try {
//     let merchantDetail;
//     let cartProducts = await addToCartModel.findOne({
//       $and: [{ userId: userId }, { orderPlaced: "2" }],
//     });

//     if (!cartProducts) {
//       return res.json(helper.generateServerResponse(0, "174"));
//     }
//     if (cartProducts.products.length <= 0) {
//       return res.json(helper.generateServerResponse(0, "174"));
//     }
//     let cartProductDetails = await Promise.all(
//       cartProducts.products.map(async (cartProduct, index) => {
//         let temp = await productModel.findOne({ _id: cartProduct.productId });
//         console.log(temp);
//         if (index < 1) {
//           merchantDetail = await userMasterModel.findOne({
//             _id: cartProduct.userId,
//           });
//         }

//         return {
//           productId: temp._id ? temp._id : "",
//           categoryId: temp.categoryId ? temp.categoryId : "",
//           name: temp.name ? temp.name : "",
//           imageOne: temp.productImageOne
//             ? process.env.PRODUCTIMAGES + temp.productImageOne
//             : "",
//           imageTwo: temp.productImageTwo
//             ? process.env.PRODUCTIMAGES + temp.productImageTwo
//             : "",
//           imageThree: temp.productImageThree
//             ? process.env.PRODUCTIMAGES + temp.productImageThree
//             : "",
//           priceOfEachItem: temp.price,
//           quantity: cartProduct.quantity,
//           priceWithQuantity: temp.price * cartProduct.quantity,
//         };
//       })
//     );
//     let totalItemsPrice = 0;
//     cartProductDetails.map(async (item) => {
//       totalItemsPrice += item.priceWithQuantity;
//     });
//     let result;
//     let couponDetails;
//     if (cartProducts.couponCode.length > 0) {
//       couponDetails = await couponModel.findOne({
//         couponCode: cartProducts.couponCode,
//       });
//       let billDetails = await discountFunction(userId, cartProducts.couponCode);
//       console.log(billDetails,"billDetails")
//     if(billDetails){
//       return res.json(
//         helper.generateServerResponse(1, "S", {
//           items: cartProductDetails,
//           merchantName: merchantDetail?.name ? merchantDetail?.name : "",
//           couponDetails,
//           billDetails,
//         })
//       );
//     }
//     }
//     let delivery = 0,
//       taxesAndCharges = 0;
//     let billDetails = {
//       totalAmount: totalItemsPrice,
//       delivery: delivery ? delivery : 0,
//       taxesAndCharges: taxesAndCharges ? taxesAndCharges : 0,
//       toPay: totalItemsPrice + delivery + taxesAndCharges,
//       couponApplied: "2",
//     };
//     result = {
//       merchantName: merchantDetail?.name ? merchantDetail?.name : "",
//       items: cartProductDetails,
//       couponDetails: "",
//       billDetails,
//     };
//     return res.json(helper.generateServerResponse(1, "S", result));
//   } catch (error) {
//     console.log(error);
//     return res.json(helper.generateServerResponse(0, "I", result));
//   }
// };

exports.getProductFromCart = async (req, res) => {
  const { userId } = req.user;
  let data = await IsProductInCart(userId);
  if (data.length <= 0) {
    return res.json(helper.generateServerResponse(0, "172", data));
  }

  let result = await Promise.all(
    data.items.map(async (item) => {
      let product = await productModel.findById(item.productId.toString());

      if (product.status === "1" && product.type != "2") {
        return {
          ...item,
          itemStatus: "1", // in stock and active
        };
      } else {
        return {
          ...item,
          itemStatus: "2", // not in stock or inactive or deleted
        };
      }
    })
  );

  let result2 = {
    ...data,
    items: result,
  };

  return res.json(helper.generateServerResponse(1, "S", result2));
};

const discountFunction = async (userId, couponCode) => {
  let amountCouponCategoryProducts = 0;
  let withoutCouponCategoryProducts = 0;
  let discount = 0;
  let flat = 0;
  let couponApplied = "1";
  let billDetails;
  let date = new Date();
  let couponDetails = await couponModel.findOne({ couponCode: couponCode });

  let isCheck = await couponModel.findOne({ expireDate: { $gte: date } });
  if (!isCheck) {
    couponApplied = "2";
    return false;
  }
  if (!couponDetails) {
    couponApplied = "2";
    return false;
  }

  let couponCategoryProducts = await addToCartModel.findOne({
    $and: [{ userId: userId }, { orderPlaced: "2" }],
  });
  couponCategoryProducts.couponCode = couponCode;
  await couponCategoryProducts.save();
  await console.log(couponCategoryProducts);

  let eligibleProductsForCoupan = couponCategoryProducts.products.filter(
    (product) => {
      return (
        couponDetails.categoryId.toString() == product.categoryId.toString()
      );
    }
  );
  let notEligibleProductsForCoupan = couponCategoryProducts.products.filter(
    (product) => {
      return (
        couponDetails.categoryId.toString() != product.categoryId.toString()
      );
    }
  );

  if (eligibleProductsForCoupan.length > 0) {
    let data = await Promise.all(
      eligibleProductsForCoupan.map(async (cartItem) => {
        let productDetail = await productModel.findOne({
          _id: cartItem.productId,
        });

        let priceOfProduct = productDetail?.price * cartItem.quantity;

        amountCouponCategoryProducts += priceOfProduct;
      })
    );
  }
  let temp = await Promise.all(
    notEligibleProductsForCoupan.map(async (cartItem) => {
      let productDetail = await productModel.findOne({
        _id: cartItem.productId,
      });
      let priceOfProduct = productDetail.price * cartItem.quantity;
      withoutCouponCategoryProducts += priceOfProduct;
    })
  );

  let totalAmount =
    amountCouponCategoryProducts + withoutCouponCategoryProducts;
  let toPay = totalAmount + 15;
  billDetails = {
    ...billDetails,
    amountCouponCategoryProducts,
    withoutCouponCategoryProducts,
    totalAmount,
    flat,
    discount,
  };

  if (couponDetails.minPriceForApplyCoupon <= amountCouponCategoryProducts) {
    if (couponDetails.type == "1") {
      let discountValid = 0;
      discount = amountCouponCategoryProducts * (couponDetails.amount / 100);
      let tempDis = 0;

      if (discount <= parseInt(couponDetails.maxDiscount)) {
        discountValid = discount;
        tempDis = amountCouponCategoryProducts - discount;
      } else {
        discountValid = parseInt(couponDetails.maxDiscount);
        tempDis =
          amountCouponCategoryProducts - parseInt(couponDetails.maxDiscount);
      }

      toPay = toPay - discountValid;
      billDetails = {
        ...billDetails,
        discount: discountValid,
        afterDiscount: tempDis,
      };
    } else if (couponDetails.type == "2") {
      let tempDis = amountCouponCategoryProducts - couponDetails.amount;
      flat = couponDetails.amount;

      toPay = toPay - flat;
      billDetails = {
        ...billDetails,
        flat: flat,
        afterFlat: tempDis,
      };
    }
  }

  if (couponDetails.minPriceForApplyCoupon > amountCouponCategoryProducts) {
    couponApplied = "2";
    return (billDetails = {
      couponApplied: couponApplied,
      totalAmount,
      taxesAndCharges: 15,
      delivery: 0,
      toPay,
    });
  }

  return (billDetails = {
    ...billDetails,
    couponApplied: couponApplied,
    taxesAndCharges: 15,
    delivery: 0,
    toPay,
  });
};

const IsProductInCart = async (userId) => {
  let cartProducts = await addToCartModel.findOne({
    $and: [{ userId: userId }, { orderPlaced: "2" }],
  });

  if (!cartProducts) {
    return [];
  }
  if (cartProducts.products.length <= 0) {
    return [];
  }
  let c = await couponModel.findOne({ couponCode: cartProducts.couponCode });
  if (!c) {
    c = "";
  }
  let cartProductDetails = await Promise.all(
    cartProducts.products.map(async (cartProduct, index) => {
      let temp = await productModel.findOne({ _id: cartProduct.productId });

      if (index < 1) {
        merchantDetail = await userMasterModel.findOne({
          _id: mongoose.Types.ObjectId(temp.userId),
        });
      }

      return {
        productId: temp._id ? temp._id : "",
        categoryId: temp.categoryId ? temp.categoryId : "",
        name: temp.name ? temp.name : "",
        imageOne: temp.productImageOne
          ? process.env.PRODUCTIMAGES + temp.productImageOne
          : "",
        imageTwo: temp.productImageTwo
          ? process.env.PRODUCTIMAGES + temp.productImageTwo
          : "",
        imageThree: temp.productImageThree
          ? process.env.PRODUCTIMAGES + temp.productImageThree
          : "",
        priceOfEachItem: temp.price,
        quantity: cartProduct.quantity,
        priceWithQuantity: temp.price * cartProduct.quantity,
      };
    })
  );

  let totalItemsPrice = 0;
  cartProductDetails.map(async (item) => {
    totalItemsPrice += item.priceWithQuantity;
  });
  let result;
  let couponDetails;
  if (cartProducts.couponCode.length > 0) {
    let billDetails = await discountFunction(userId, cartProducts.couponCode);

    if (billDetails) {
      return {
        items: cartProductDetails,
        merchantName: merchantDetail?.name ? merchantDetail?.name : "",
        couponDetails: c ? c : "",
        billDetails,
      };
    }
  }
  let delivery = 0,
    taxesAndCharges = 15;
  let billDetails = {
    totalAmount: totalItemsPrice,
    delivery: delivery ? delivery : 0,
    taxesAndCharges: taxesAndCharges ? taxesAndCharges : 0,
    toPay: totalItemsPrice + delivery + taxesAndCharges,
    couponApplied: "2",
  };
  return (result = {
    merchantName: merchantDetail?.name ? merchantDetail?.name : "",
    items: cartProductDetails,
    couponDetails: c ? c : "",
    billDetails,
  });
};
exports.getCoupenApplied = async (req, res) => {
  try {
    const { userId } = req.user;
    let amountCouponCategoryProducts = 0;
    let withoutCouponCategoryProducts = 0;
    let discount = 0;
    let flat = 0;
    let billDetails;
    let couponApplied = "1";
    const { couponCode } = req.body[constants.APPNAME];
    let date = new Date();

    let couponDetails = await couponModel.findOne({ couponCode: couponCode });
    let isCheck = await couponModel.findOne({ expireDate: { $gte: date } });
    if (!isCheck) {
      return res.json(helper.generateServerResponse(0, "176"));
    }
    if (!couponDetails) {
      return res.json(helper.generateServerResponse(0, "175"));
    }

    let couponCategoryProducts = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });
    if (!couponCategoryProducts) {
      return res.json(helper.generateServerResponse(0, "F", []));
    }

    couponCategoryProducts.couponCode = couponCode;
    await couponCategoryProducts.save();

    let eligibleProductsForCoupon = couponCategoryProducts.products.filter(
      (product) => {
        if (
          couponDetails.categoryId.toString() == product.categoryId.toString()
        ) {
          return product;
        }
      }
    );

    let notEligibleProductsForCoupon = couponCategoryProducts.products.filter(
      (product) => {
        return (
          couponDetails.categoryId.toString() != product.categoryId.toString()
        );
      }
    );
    if (eligibleProductsForCoupon.length <= 0) {
    }

    if (eligibleProductsForCoupon.length > 0) {
      let data = await Promise.all(
        eligibleProductsForCoupon.map(async (cartItem) => {
          let productDetail = await productModel.findOne({
            _id: cartItem.productId,
          });

          let priceOfProduct = productDetail?.price * cartItem.quantity;

          amountCouponCategoryProducts += priceOfProduct;
        })
      );
    }

    let temp = await Promise.all(
      notEligibleProductsForCoupon.map(async (cartItem) => {
        let productDetail = await productModel.findOne({
          _id: cartItem.productId,
        });
        let priceOfProduct = productDetail.price * cartItem.quantity;
        withoutCouponCategoryProducts += priceOfProduct;
      })
    );
    let totalAmount =
      amountCouponCategoryProducts + withoutCouponCategoryProducts;
    let toPay = totalAmount + 15;
    billDetails = {
      ...billDetails,
      amountCouponCategoryProducts,
      withoutCouponCategoryProducts,
      totalAmount,
      flat,
      discount,
    };

    if (couponDetails.minPriceForApplyCoupon <= amountCouponCategoryProducts) {
      if (couponDetails.type == "1") {
        let discountValid = 0;
        discount = amountCouponCategoryProducts * (couponDetails.amount / 100);
        let tempDis = 0;

        if (discount <= parseInt(couponDetails.maxDiscount)) {
          discountValid = discount;
          tempDis = amountCouponCategoryProducts - discount;
        } else {
          discountValid = parseInt(couponDetails.maxDiscount);
          tempDis =
            amountCouponCategoryProducts - parseInt(couponDetails.maxDiscount);
        }
        toPay = toPay - discountValid;
        billDetails = {
          ...billDetails,
          discount: discountValid,
          afterDiscount: tempDis,
        };
      } else if (couponDetails.type == "2") {
        let tempDis = amountCouponCategoryProducts - couponDetails.amount;

        flat = couponDetails.amount;
        toPay = toPay - flat;

        billDetails = {
          ...billDetails,
          flat: flat,
          afterFlat: tempDis,
        };
      }
    }
    if (couponDetails.minPriceForApplyCoupon > amountCouponCategoryProducts) {
      couponApplied = "2";
      billDetails = {
        status: "you are not eligible for coupon",
        couponApplied: couponApplied,
        totalAmount,
        taxesAndCharges: 15,
        delivery: 0,
        toPay,
      };
      return res.json(
        helper.generateServerResponse(0, "178", { couponDetails, billDetails })
      );
    }

    billDetails = {
      ...billDetails,
      couponApplied: couponApplied,
      taxesAndCharges: 15,
      delivery: 0,
      toPay,
    };

    return res.json(
      helper.generateServerResponse(1, "S", { couponDetails, billDetails })
    );
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(1, "I"));
  }
};

exports.removeCoupen = async (req, res) => {
  try {
    const { userId } = req.user;
    const cartProducts = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });
    if (!cartProducts) {
      return res.json(helper.generateServerResponse(0, "172"));
    }
    cartProducts.couponCode = "";
    await cartProducts.save();
    let cartProductDetails = await Promise.all(
      cartProducts.products.map(async (cartProduct, index) => {
        let temp = await productModel.findOne({ _id: cartProduct.productId });

        if (index < 1) {
          merchantDetail = await userMasterModel.findOne({
            _id: temp.userId,
          });
        }

        return {
          productId: temp._id ? temp._id : "",
          categoryId: temp.categoryId ? temp.categoryId : "",
          name: temp.name ? temp.name : "",
          imageOne: temp.productImageOne
            ? process.env.PRODUCTIMAGES + temp.productImageOne
            : "",
          imageTwo: temp.productImageTwo
            ? process.env.PRODUCTIMAGES + temp.productImageTwo
            : "",
          imageThree: temp.productImageThree
            ? process.env.PRODUCTIMAGES + temp.productImageThree
            : "",
          priceOfEachItem: temp.price,
          quantity: cartProduct.quantity,
          priceWithQuantity: temp.price * cartProduct.quantity,
        };
      })
    );
    let totalItemsPrice = 0;
    cartProductDetails.map(async (item) => {
      totalItemsPrice += item.priceWithQuantity;
    });
    let delivery = 0,
      taxesAndCharges = 0;
    let billDetails = {
      totalAmount: totalItemsPrice,
      delivery: delivery ? delivery : 0,
      taxesAndCharges: taxesAndCharges ? taxesAndCharges : 0,
      toPay: totalItemsPrice + delivery + taxesAndCharges,
      couponApplied: "2",
    };
    result = {
      merchantName: merchantDetail?.name ? merchantDetail?.name : "",
      items: cartProductDetails,
      billDetails,
    };
    return res.json(helper.generateServerResponse(1, "173", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    // const {distance}=req.body[constants.APPNAME];
    let { addressId, tip, suggestion, distance } = req.body[constants.APPNAME];
    let order = await IsProductInCart(userId);
    console.log(order, "order");
    let data = order.billDetails;

    console.log(data, "data");
    let addToCart = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });
    if (!addToCart) {
      return res.json(helper.generateServerResponse(0, "F", []));
    }

    let orderId;

    await orderModel
      .find()
      .sort({ orderId: -1 })
      .limit(1)
      .then((data) => {
        if (data.length > 0) {
          console.log(data);
          orderId = (Number(data[0].orderId) + 1).toString();
        } else {
          orderId = "10000";
        }
      });

    let inStockItems = [];

    await Promise.all(
      order.items.map(async (item) => {
        let product = await productModel.findById(item.productId.toString());

        if (product.status === "1" && product.type != "2") {
          inStockItems.push(item);
        }
      })
    );

    order = {
      ...order,
      items: inStockItems,
    };

    if (order.items.length <= 0) {
      return res.json(helper.generateServerResponse(2, "179"));
    }

    let addToCartId = addToCart._id;
    let couponCode = addToCart.couponCode ? addToCart.couponCode : "";
    let payload = {
      orderId,
      userId,
      addressId,
      addToCartId,
      couponApplied: data.couponApplied ? data.couponApplied : "2",
      couponCode: addToCart.couponCode ? addToCart.couponCode : "",
      merchantId: addToCart.merchantId ? addToCart.merchantId : "",
      tip,
      taxesAndCharges: data?.taxesAndCharges ? data.taxesAndCharges : "",
      totalAmount: data?.totalAmount ? data.totalAmount : "",
      discount: data?.discount ? data.discount : "",
      flat: data?.flat ? data.flat : "",
      delivery: data?.delivery ? data.delivery : "",
      toPay: data?.toPay ? data.toPay : "",
      suggestion,
      products: order.items,
      deliveryFeePerKm: "5",
      totalDeliveryCharges: parseInt(distance) * 5,
      finalAmount: data.toPay + parseInt(tip) + parseInt(distance) * 5,
      distance,
    };

    let orderes = await orderModel.create(payload);
    addToCart.orderPlaced = "1";
    await addToCart.save();
    return res.json(helper.generateServerResponse(1, "S", orderes));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.orderList = async (req, res) => {
  try {
    const { userId } = req.user;
    let orderList = await orderModel.find({ userId: userId });

    if (orderList.length <= 0) {
      return res.json(helper.generateServerResponse(0, "177"));
    }
    let result = await Promise.all(
      orderList.map(async (order) => {
        let merchant = await userMasterModel.findOne({
          userId: order.merchantId,
        });
        let merchantAddress = await merchantModel.findOne({
          userId: mongoose.Types.ObjectId(order.merchantId),
        });
        console.log(merchantAddress, "merchantAddress");

        console.log(order);

        return {
          orderId: order._id ? order._id : "",
          storeName: merchant.name,
          merchantAddress: merchantAddress?.address
            ? merchantAddress.address
            : "",
          rating: merchantAddress?.rating ? merchantAddress.rating : "",
          userId: order.userId ? order.userId : "",
          addToCartId: order.addToCartId ? order.addToCartId : "",
          couponApplied: order.couponApplied ? order.couponApplied : "",
          couponCode: order.couponCode ? order.couponCode : "",
          tip: order.tip ? order.tip : "",
          totalAmount: order.totalAmount ? order.totalAmount : "",
          discount: order.discount ? order.discount : "",
          flat: order.flat ? order.flat : "",
          delivery: order.delivery ? order.delivery : "",
          toPay: order.toPay ? order.toPay : "",
          finalAmount: order.finalAmount ? order.finalAmount : "",
          status: order.status ? order.status : "",
          products: order.products ? order.products : [],
          suggestion: order.suggestion ? order.suggestion : "",
          createdAt: order.createdAt ? order.createdAt : "",
        };
      })
    );
    console.log(result, "result");
    return res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error, "error");
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.orderDetail = async (req, res) => {
  try {
    let { orderId } = req.body[constants.APPNAME];
    let order = await orderModel.findOne({ _id: orderId });
    // console.log(order.userId.toString(), "order user id");

    if (!order) {
      return res.json(helper.generateServerResponse(0, "174"));
    }

    let merchantDetail = await userMasterModel.findOne({
      _id: order.merchantId.toString(),
    });
    let mercantDetailAddress = await merchantModel.findOne({
      userId: order.merchantId.toString(),
    });
    let userAddress = await userAddressModel.findOne({
      addressId: order.addressId.toString(),
    });

    let result = {
      orderId: order._id ? order._id : "",
      userId: order.userId ? order.userId : "",
      merchantName: merchantDetail.name ? merchantDetail.name : "",
      merchantAddress: mercantDetailAddress.address
        ? mercantDetailAddress.address
        : "",
      // addToCartId: order.addToCartId ? order.addToCartId : "",
      couponApplied: order.couponApplied ? order.couponApplied : "",
      couponCode: order.couponCode ? order.couponCode : "",
      tip: order.tip ? order.tip : "",
      totalAmount: order.totalAmount ? order.totalAmount : "",
      discount: order.discount ? order.discount : "",
      flat: order.flat ? order.flat : "",

      toPay: order.toPay ? order.toPay : "",
      paymentStatus: order.paymentStatus ? order.paymentStatus : 1,
      paymentMethod: order.paymentMethod ? order.paymentMethod : 1,
      status: order.status ? order.status : "",
      products: order.products ? order.products : [],
      taxesAndCharges: order.taxesAndCharges ? order.taxesAndCharges : "",
      phoneNumber: merchantDetail.mobile ? merchantDetail.mobile : "",

      // suggestion: order.suggestion ? order.suggestion : "",
      createdAt: order.createdAt ? order.createdAt : "",
      areaName: userAddress.areaName ? userAddress.areaName : "",
      addressType: userAddress.addressType ? userAddress.addressType : "",
      completeAddress: userAddress.completeAddress
        ? userAddress.completeAddress
        : "",
      latitude: userAddress.latitude ? userAddress.latitude : "",
      longitude: userAddress.longitude ? userAddress.longitude : "",

      delivery: order.delivery ? order.delivery : "",
      deliveryFeePerKm: order.deliveryFeePerKm ? order.deliveryFeePerKm : "",
      delivery: order.totalDeliveryCharges ? order.totalDeliveryCharges : "",
      // distance: order.distance ? order.distance : "",
    };

    res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body[constants.APPNAME];
    let order = await orderModel.findOneAndRemove({ _id: orderId });
    if (!order) {
      return res.json(helper.generateServerResponse(0, "F"));
    }
    return res.json(helper.generateServerResponse(1, "179"));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.removeItemFromAddToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    let cart = await addToCartModel.findOneAndRemove({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });
    if (!cart) {
      return res.json(helper.generateServerResponse(0, "174"));
    }
    return res.json(helper.generateServerResponse(1, "182"));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.repeatOrder = async (req, res) => {
  try {
    const { userId } = req.user;

    let { orderId } = req.body[constants.APPNAME];

    let order = await orderModel.findById(orderId);
    let cart = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });

    if (cart) {
      if (cart.products.length > 0) {
        return res.json(helper.generateServerResponse(2, "180"));
      }
    }

    if (!cart) {
      let newCart = await addToCartModel.create({
        userId: mongoose.Types.ObjectId(userId),
        merchantId: order.merchantId,
        products: order.products,
      });

      return res.json(helper.generateServerResponse(1, "163", newCart));
    }
  } catch (err) {
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.clearCart = async (req, res) => {
  try {
    let { userId } = req.user;

    let cart = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });

    if (cart) {
      await addToCartModel.deleteOne({ _id: cart._id });
    }

    return res.json(helper.generateServerResponse(1, "165"));
  } catch (err) {
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.findUser = async (req, res) => {
  try {
    const { keyword, type } = req.body[constants.APPNAME];
    if (type == 2) {
      const query = { aadharCardNumber: { $regex: keyword, $options: "i" } };
      let searchData = await userMasterModel.find(query, {
        email: 1,
        name: 1,
        mobile: 1,
        profileImage: 1,
      });
      if (searchData.length <= 0) {
        return res.json(helper.generateServerResponse(0, 135));
      }
      searchData.forEach((value) => {
        value.profileImage = process.env.PROFILEIMAGE + `${value.profileImage}`;
      });
      return res.json(helper.generateServerResponse(1, "S", searchData));
    } else if (type == 1) {
      let searchData = await userMasterModel.find(
        {
          $or: [
            { name: { $regex: keyword } },
            { email: { $regex: keyword } },
            { userName: { $regex: keyword } },
          ],
        },
        {
          email: 1,
          name: 1,
          mobile: 1,
          profileImage: 1,
        }
      );
      if (searchData.length <= 0) {
        return res.json(helper.generateServerResponse(0, 135));
      }
      searchData.forEach((value) => {
        value.profileImage = process.env.PROFILEIMAGE + `${value.profileImage}`;
      });

      return res.json(helper.generateServerResponse(1, 134, searchData));
    } else if (type == 3) {
      let searchData = await userMasterModel.find(
        {
          $or: [{ uniqueID: { $regex: keyword } }],
        },
        {
          email: 1,
          name: 1,
          mobile: 1,
          profileImage: 1,
        }
      );
      if (searchData.length <= 0) {
        return res.json(helper.generateServerResponse(0, 135));
      }
      searchData.forEach((value) => {
        value.profileImage = process.env.PROFILEIMAGE + `${value.profileImage}`;
      });

      return res.json(helper.generateServerResponse(1, 134, searchData));
    }
  } catch (error) {
    res.json(helper.generateServerResponse(1, 134, searchData));
  }
};