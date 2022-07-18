const userMasterModel = require("../model/userMaster-model");
const loginMaster = require("../model/loginMaster-model");
const constants = require("../constants");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helper = require("../helper/apiHelper");
const merchantModel = require("../model/merchantDetails");
const categoryModel = require("../model/category-model");
const bankDetails = require("../model/bankDetail-model");
const productImagesModel = require("../model/productImage-model");
const productCategoryMasterModel = require("../model/productCategoryMaster-model");
const productModel = require("../model/products-model");
const { default: mongoose } = require("mongoose");
const addToCartModel = require("../model/addToCart-model");
const coupanModel = require("../model/coupan-model");
const orderModel = require("../model/order-model");
const userAddressModel = require("../model/userAddress-model");

const { findByIdAndUpdate, deleteOne } = require("../model/userMaster-model");
const genrateOtp = async (userId) => {
  let randomOtp = Math.floor(100000 + Math.random() * 900000);
  const user = await userMasterModel.findOneAndUpdate(
    { _id: userId },
    { otp: randomOtp },
    { new: true }
  );
  if (user) {
    console.log(user);
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
const userDetail = async (data) => {
  let result = {
    merchantId: data._id ? data._id : "",
    name: data.name ? data.name : "",
    userName: data.userName ? data.userName : "",
    mobile: data.mobile ? data.mobile : "",
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
  };
  return result;
};
exports.newMerchant = async (req, res) => {
  try {
    let checkReqKey = [
      "password",
      "referralCode",
      "name",
      "email",
      "mobile",
      "fcmId",
      "manufacturer",      
      "countryCode",      
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    console.log(response);
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
      countryCode,      
    } = req.body[constants.APPNAME];


    const header = req.user;

    if(helper.checkHeader(header) === 0){
      return res.json(helper.generateServerResponse(0, "196"));
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    let referredFrom = null;
    if (referralCode) {
      let referalUser = await userMasterModel.findOne({
        referralCode: referralCode,
      });
      referredFrom = referalUser ? referalUser._id : "";
    }
    const userAlreadyExistEmail = await userMasterModel.find({ email });

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
      deviceName: header.deviceName,
      otp: "123456",
      pin: null,
      referredFrom,
      referralCode,
      isMobileVerified: 0,
      isProfileCompleted: 0,
      isMobileVerified: 0,
      isActive: 1,
      userType: 2,
      countryCode,
      languageCode: header.languageCode
    };
    const result = await userMasterModel.create(payload);

    // merchant detail here
    let merchantDetail = await merchantModel.create({
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
    return res.json(helper.generateServerResponse(1, 112, data));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.merchantProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    let result = await userMasterModel.findById({ _id: userId });
    console.log(result);

    let data = await userDetail(result);
    let merchantDetail = await merchantModel.findOne({ userId: result._id });
    data = {
      ...data,
      isOnOff: merchantDetail.isOnOff ? merchantDetail.isOnOff : "",
    };

    res.json(helper.generateServerResponse(1, "S", data));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.loginMerchant = async (req, res) => {
  try {
    let checkReqKey = [
      "email",
      "password",
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
    // const {deviceType,deviceId,version} = req.user;
    const {
      email,
      password,
      fcmId,
      manufacturer,      
    } = req.body[constants.APPNAME];

    const header = req.user;    

    if(helper.checkHeader(header) === 0){
      return res.json(helper.generateServerResponse(0, "196"));
    }

    const result = await userMasterModel.findOne({ email });

    if (!result) {
      return res.json(helper.generateServerResponse(0, 125));
    }
    if (result.userType != "2") {
      return res.json(helper.generateServerResponse(0, "F"));
    }
    // Number is Finded
    const verify = await bcrypt.compare(password, result.password);
    if (!verify) {
      return res.json(helper.generateServerResponse(0, 109));
    }

    const token = await jwt.sign(
      { userId: result._id },
      process.env.JWT_SECRET_KEY
    );
    //logout via deviceId
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
      deviceName: header.deviceName,
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
    console.log(error);
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

exports.logoutMerchant = async (req, res) => {
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

exports.otpVerification = async (req, res) => {
  const { userId } = req.user;

  const {
    otp,
    fcmId,
    manufacturer,    
  } = req.body[constants.APPNAME];
  try {
    let checkReqKey = [
      "otp",
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

    const header = req.user;

    if(helper.checkHeader(header) === 0){
      return res.json(helper.generateServerResponse(0, "196"));
    }

    let data = await userMasterModel.findById(userId);
    console.log(data);
    console.log(otp);
    if (otp == data.otp) {
      let user = await userMasterModel.findByIdAndUpdate(
        userId,
        { isMobileVerified: 1 },
        { new: true }
      );
      const loginTime = new Date(Date.now()).toISOString();
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
        deviceName: header.deviceName,
        loginRegion: header.loginRegion,
        languagecode: data.languageCode
      });
      let result = await userDetail(user);
      result = {
        ...result,
        loginId: userLog._id,
      };

      return res.json(helper.generateServerResponse(1, 106, result));
    } else {
      res.json(helper.generateServerResponse(0, 107));
    }
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.generatePin = async (req, res) => {
  const { userId } = req.user;

  try {
    let checkReqKey = ["pin"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    let { pin } = req.body[constants.APPNAME];
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
    console.log(response);
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const { userId } = req.user;

    let result = await userMasterModel.findById(userId);
    // console.log(result)
    let { password, newPassword } = req.body[constants.APPNAME];

    const verify = await bcrypt.compare(password, result.password);
    console.log(verify);
    if (!verify) {
      return res.json(helper.generateServerResponse(0, 109));
    }
    console.log(result.password);
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
    // result.password = newPassword
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
    console.log(req.user);
    console.log(userId);
    let checkReqKey = ["pin", "newPin"];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );

    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    let result = await userMasterModel.findById(userId);
    // console.log(result)
    let { pin, newPin } = req.body[constants.APPNAME];

    console.log(pin, newPin);
    const verify = await bcrypt.compare(pin, result.pin);
    console.log(verify);
    if (!verify) {
      return res.json(helper.generateServerResponse(0, 113));
    }
    console.log(result.pin);
    const salt = await bcrypt.genSalt(10);
    newPin = await bcrypt.hash(newPin, salt);
    let user = await userMasterModel.findByIdAndUpdate(
      userId,
      { pin: newPin },
      { new: true }
    );

    res.json(helper.generateServerResponse(1, "S"));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
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
    const email1 = req.body[constants.APPNAME].email;
    let randomPin = Math.floor(1000 + Math.random() * 9000);
    let strPin = randomPin.toString();
    console.log(strPin);
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
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};
exports.merchnatDetail = async (req, res) => {
  let checkReqKey = ["id"];
  let response = helper.validateJSON(req.body[constants.APPNAME], checkReqKey);
  if (response == 0) {
    return res.json(helper.generateServerResponse(0, "I"));
  }
  const { userId } = req.user;

  const { id } = req.body[constants.APPNAME];
  const result = await categoryModel.findById(id);
  if (result == null) {
    return res.json(helper.generateServerResponse(0, 121));
  }
  try {
    let user = await merchantModel.findOne({ userId: userId });

    const xx = user._id;
    let merchantDetail = await merchantModel.findByIdAndUpdate(xx, {
      categoryID: id,
      updateCategory: result.name,
    });
    // console.log(userId)

    res.json(helper.generateServerResponse(1, 127, merchantDetail));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.isOnOff = async (req, res) => {
  let checkReqKey = ["isOnOff"];
  let response = helper.validateJSON(req.body[constants.APPNAME], checkReqKey);
  if (response == 0) {
    return res.json(helper.generateServerResponse(0, "I"));
  }
  const { userId } = req.user;
  console.log("User ID " + userId);
  const { isOnOff } = req.body[constants.APPNAME];

  try {
    let user = await merchantModel.findOne({ userId: userId });
    console.log(user.userId);
    if (user == null) {
      return res.json(helper.generateServerResponse(0, 121));
    }
    const xx = user._id;
    let merchantDetail = await merchantModel.findByIdAndUpdate(xx, {
      isOnOff: isOnOff,
    });
    console.log(userId);
    res.json(helper.generateServerResponse(1, 124));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let { userId } = req.user;
    console.log(userId);
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
      let profilePath = "./uploads/profileImages/";
      const imageName = helper.saveImage(profileImage, userId, profilePath);
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
    console.log(response);
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "I"));
    }
    const {
      fullName,
      dateOfBirth,
      panCardNumber,
      panCardPicture,
      aadharCardNumber,
      aadharCardFrontPicture,
      aadharCardBackPicture,
    } = req.body[constants.APPNAME];
    let data = {
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
      data = { ...data, aadharCardBackPicture: imageName };
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

exports.bankDetails = async (req, res) => {
  console.log("Bank Details Called");
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

exports.getBankDetails = async (req, res) => {
  try {
    const { userId } = req.user;
    const data = await bankDetails.findOne({ userId: userId });
    if (data) {
      return res.json(helper.generateServerResponse(1, "S", data));
    }
    return res.json(helper.generateServerResponse(0, "F"));
  } catch (err) {
    console.log(err);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

// finis this api
exports.updateProductCategory = async (req, res) => {
  try {
    const { userId } = req.user;
    const { categoryId } = req.body[constants.APPNAME];
    let user = await merchantModel.findOne({ userId: userId });
    let data = await merchantModel.findByIdAndUpdate(
      { _id: user._id },
      { categoryId: categoryId },
      { new: true }
    );
    res.json(helper.generateServerResponse(1, "156"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

//
// exports.productCategoryMaster = async (req, res) => {
//   try {
//     let checkReqKey = ["name", "categoryId"];
//     let response = helper.validateJSON(
//       req.body[constants.APPNAME],
//       checkReqKey
//     );
//     if (response == 0) {
//       return res.json(helper.generateServerResponse(0, "I"));
//     }
//     // const { userId } = req.user;
//     const { name, categoryId } = req.body[constants.APPNAME];
//     let payload = {
//       name,
//       categoryId,
//     };
//     let productCategory = await productCategoryMasterModel.create(payload);
//     let result = {
//       id: productCategory._id,
//       name: productCategory.name,
//       categoryId: productCategory.categoryId,
//       status: productCategory.status,
//       // userId: productCategory.userId,
//     };
//     res.json(helper.generateServerResponse(1, "", result));
//   } catch (error) {
//     console.log(error);
//     res.json(helper.generateServerResponse(0, "I"));
//   }
// };

exports.getAllSubCategories = async(req, res) => {
  try{
    const {categoryId} = req.body[constants.APPNAME];

    const subCategories = await productCategoryMasterModel.find({ $and: [
      {categoryId},
      {status: "2"}
    ]})

    if(subCategories.length <= 0){
      return res.json(helper.generateServerResponse(0, "168"));
    }

    let result = await Promise.all(
      subCategories.map(async (value) => {
        return {
          subCategoryId: value._id,
          subCategoryName: value.name
        }
      })
    )

    return res.json(helper.generateServerResponse(1, "151", result));
  }
  catch(err){
    return res.json(helper.generateServerResponse(0, "I"));
  }
}

exports.addSubCategory = async (req, res) => {
  try{
    const {userId } = req.user;

    let checkReqKey = ["name", "categoryId"];
    
    let response = helper.validateJSON(req.body[constants.APPNAME], checkReqKey);

    if(response == 0){
      return res.json(helper.generateServerResponse(0, "I"));
    }

    const {name, categoryId} = req.body[constants.APPNAME];

    let subCategory = await productCategoryMasterModel.create({
      userId,      
      name,
      categoryId
    });

    return res.json(helper.generateServerResponse(1, "118", subCategory));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
}

exports.editSubCategory = async (req, res) => {
  try{
    const {userId} = req.user;

    if(!userId){
      return res.json(helper.generateServerResponse(0, "119"));
    }
    const { subCategoryId, name, categoryId } = req.body[constants.APPNAME];        
    const subCategory = await productCategoryMasterModel.findById(subCategoryId);

    if(!subCategory){
      return res.json(helper.generateServerResponse(0, "168"));
    }

    if(subCategory.status === "2"){
      return res.json(helper.generateServerResponse(0, "194"));
    }    

    let result = await productCategoryMasterModel.findByIdAndUpdate(subCategoryId, {
      name,
      categoryId
    }, {new: true});
    

    return res.json(helper.generateServerResponse(1, "195", result));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
}

exports.deleteSubCategory = async (req, res) => {
  try{
    const {userId} = req.user;

    if(!userId){
      return res.json(helper.generateServerResponse(0, "119"));
    }
    const { subCategoryId } = req.body[constants.APPNAME];    
    const subCategory = await productCategoryMasterModel.findById(subCategoryId);

    if(!subCategory){
      return res.json(helper.generateServerResponse(0, "168"));
    }

    if(subCategory.status === "2"){
      return res.json(helper.generateServerResponse(0, "194"));
    }

    await productCategoryMasterModel.deleteOne({ _id: subCategoryId});

    return res.json(helper.generateServerResponse(1, "193"));
  }
  catch(err){
    console.log(err);
    return res.json(helper.generateServerResponse(0, "I"));
  }
}

exports.subProductCategoryList = async (req, res) => {
  try {
    const {userId} = req.user;    
    let subProductList = await productCategoryMasterModel.find({
      userId: userId
    });
    let result = await Promise.all(
    subProductList.map(async (value) => {
      let category = await categoryModel.findById(value.categoryId);

      return {
        subCategoryId: value._id,
        subCategoryName: value.name,
        categoryId: value.categoryId,
        categoryName: category.name,
        status: value.status
      };
    }));
    return res.json(helper.generateServerResponse(1, "151", result));

    // res.json(helper.generateServerResponse(0, "152"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

const getProductDetail = async (product) => {
  // console.log(productImages);
  // let images = await productImages.map((v) => {
  //   return { imageId: v._id, image: process.env.PRODUCTIMAGES + v.name };
  // });
  let result = {
    productId: product._id ? product._id : "",
    name: product.name ? product.name : "",
    description: product.description ? product.description : "",
    isVeg: product.isVeg ? product.isVeg : "",
    categoryId: product.categoryId ? product.categoryId : "",
    type: product.type ? product.type : "",
    status: product.status ? product.status : "",
    rating: product.rating ? product.rating : "",
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

exports.addProduct = async (req, res) => {
  console.log("add product is calling");
  try {
    const { userId } = req.user;
    let checkReqKey = [
      "name",
      "description",
      "price",
      "categoryId",
      "productCategoryMasterId",
      "isVeg",
      "productImageOne",
      "productImageTwo",
      "productImageThree",
    ];
    let response = helper.validateJSON(
      req.body[constants.APPNAME],
      checkReqKey
    );
    //console.log(req.body[constants.APPNAME]);
    // console.log(response, "response");
    if (response == 0) {
      return res.json(helper.generateServerResponse(0, "T"));
    }
    let {
      name,
      description,
      price,
      categoryId,
      productCategoryMasterId,
      isVeg,
      productImageOne,
      productImageTwo,
      productImageThree,
    } = req.body[constants.APPNAME];

    //  console.log(productImageOne, "product image one");
    //console.log(productImageTwo, "product image two");

    let profilePath = "./uploads/productImages/";
    if (productImageOne) {
      console.log("here");
      let imageName = await helper.getRandomFileName();
      console.log("here 1");
      // console.log(imageName)
      //console.log(profilePath)

      let productImageOneName = await helper.saveImage(
        productImageOne,
        imageName,
        profilePath
      );
      productImageOne = productImageOneName;
    }
    console.log("here 2");

    if (productImageTwo) {
      let imageName = await helper.getRandomFileName();
      let productImageTwoName = await helper.saveImage(
        productImageTwo,
        imageName,
        profilePath
      );
      let str = productImageTwoName;
      str.slice(0, -4);
      productImageTwo = productImageTwoName;
    }

    if (productImageThree) {
      console.log("product image three");
      let imageName = await helper.getRandomFileName();
      let productImageThreeName = await helper.saveImage(
        productImageThree,
        imageName,
        profilePath
      );
      productImageThree = productImageThreeName;
    }
    console.log("bingo");

    let payload = {
      userId,
      name,
      description,
      price,
      categoryId,
      isVeg,
      productCategoryMasterId,
      productImageOne,
      productImageTwo,
      productImageThree,
    };
    console.log("1111");
    const product = await productModel.create(payload);
    console.log("11");
    let result = await getProductDetail(product);
    console.log("12");
    //  console.log(productImageOne);

    //let   productImages=[productImageOne,productImageTwo,productImageThree];
    // let imagesName = await Promise.all(
    //   productImages.map(async (value, index) => {
    //     let name = await helper.getRandomFileName();
    //     let imageName = await helper.saveImage(value, name, profilePath);
    //     return await productImagesModel.create({
    //       productId: product._id,
    //       name: imageName,
    //     });
    //   })
    // );
    console.log("1");

    // let result = await getProductDetail(product, imagesName);

    res.json(helper.generateServerResponse(1, "161", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    let profilePath = "./uploads/productImages/";
    let {
      productImageOne,
      productImageTwo,
      productImageThree,
      name,
      description,
      price,
      isVeg,
    } = req.body[constants.APPNAME];
    let payload = { name, description, price, isVeg };

    if (productImageOne.length > 0) {
      let imageName = await helper.getRandomFileName();
      let productImageOneName = await helper.saveImage(
        productImageOne,
        imageName,
        profilePath
      );

      payload = {
        ...payload,
        productImageOne: productImageOneName,
      };
    }

    if (productImageTwo.length > 0) {
      let imageName = await helper.getRandomFileName();
      let productImageTwoName = await helper.saveImage(
        productImageTwo,
        imageName,
        profilePath
      );

      payload = {
        ...payload,
        productImageTwo: productImageTwoName,
      };
    }

    if (productImageThree.length > 0) {
      console.log("product image three");
      let imageName = await helper.getRandomFileName();
      let productImageThreeName = await helper.saveImage(
        productImageThree,
        imageName,
        profilePath
      );

      payload = {
        ...payload,
        productImageThree: productImageThreeName,
      };
    }
    let product = await productModel.findByIdAndUpdate(
      { _id: productId },
      payload,
      { new: true }
    );
    res.json(
      helper.generateServerResponse(1, "162", await getProductDetail(product))
    );
  } catch (error) {
    console.log(error, "error");
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.deletProducts = async (req, res) => {
  try {
    const { productId } = req.body[constants.APPNAME];
    let product = await productModel.findByIdAndUpdate(
      { _id: productId },
      { status: "3" },
      { new: true }
    );
    if (product) {
      return res.json(helper.generateServerResponse(1, "149"));
    }
    return res.josn(helper.generateServerResponse(0, "F"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.myProductList = async (req, res) => {
  try {
    const { userId } = req.user;
    let myProducts = await productModel.find({
      userId: userId,
      status: { $ne: "3" },
    });
    if (myProducts.length > 0) {
      let list = await Promise.all(
        myProducts.map(async (v) => {
          // let productImages = await productImagesModel.find({
          //   productId: v._id,
          // });

          return await getProductDetail(v);
        })
      );
      return res.json(helper.generateServerResponse(1, "S", list));
    }
    res.json(helper.generateServerResponse(0, "150"));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.addProductImage = async (req, res) => {
  const { productId, productImages } = req.body[constants.APPNAME];
  if (productImages.length <= 0) {
    res.json(helper.generateServerResponse(1, "154"));
  }
  let profilePath = "./uploads/productImages/";
  let imagesName = await Promise.all(
    productImages.map(async (value, index) => {
      let name = await helper.getRandomFileName();
      let imageName = await helper.saveImage(value, name, profilePath);
      return await productImagesModel.create({
        productId: product._id,
        name: imageName,
      });
    })
  );

  res.json(helper.generateServerResponse(1, "153"));
};

exports.deleteProductImage = async (req, res) => {
  // let { imageId } = req.body[constants.APPNAME];
  const { productId } = req.query;

  let data = await productImagesModel.findByIdAndUpdate(
    { _id: productId },
    req.body[constants.APPNAME]
  );

  res.json(helper.generateServerResponse(1, "155"));
};

exports.merchantListByCategory = async (req, res) => {
  console.log("merchant list by category");
  try {
    const { categoryId } = req.body[constants.APPNAME];

    let category = await merchantModel.find({ categoryId: categoryId });

    let merchandDetail = await Promise.all(
      category.map(async (value) => {
        let data = await userMasterModel.findById(value.userId);
        console.log(value.userId);

        let result;
        if (data) {
          result = await userDetail(data);
          return (result = {
            ...result,
            categoryId: value.categoryId ? value.categoryId : "",
            coverPhoto: value.coverPhoto
              ? process.env.CATEGORIESIMAGE + value.coverPhoto
              : "",
            isOnOff: value.isOnOff ? value.isOnOff : "",
          });
        }
      })
    );
    merchandDetail = merchandDetail.filter((user) => user);
    res.json(helper.generateServerResponse(1, "S", merchandDetail));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.merchantDetailById = async (req, res) => {
  try {
    const { userId } = req.user;
    let result;
    const userData = await merchantModel.findOne({ userId: userId });
    const categoryData = await categoryModel.findOne({
      _id: userData.categoryId,
    });
    const products = await productModel.find({ userId: userId });
    let productCategoryMaster = await Promise.all(
      products.map(async (product) => {
        // let productImages = await productImagesModel.find(
        //   { productId: product._id },
        //   { name: 1, _id: 1 }
        // );
        // console.log(productImages, "product images here");

        // let images = await productImages.map((pi) => {
        //   return {
        //     imageId: pi._id,
        //     image: process.env.PRODUCTIMAGES + pi.name,
        //   };
        // });

        result = await getProductDetail(product);
        let productMasterCategory = await productCategoryMasterModel.findOne({
          _id: product.productCategoryMasterId,
        });

        return (result = {
          ...result,
          productMasterCategoryId: productMasterCategory._id
            ? productMasterCategory._id
            : "",
          productMasterCategory: productMasterCategory.name
            ? productMasterCategory.name
            : "",
        });
      })
    );
    result = {
      ...result,
      merchantId: userData.userId,
      categoryId: userData.categoryId ? userData.categoryId : "",
      coverPhoto: userData.coverPhoto
        ? process.env.CATEGORIESIMAGE + userData.coverPhoto
        : "",
      isOnOff: userData.isOnOff ? userData.isOnOff : "",
      categoryName: categoryData.name ? categoryData.name : "",
    };
    return res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.proudctListByMerchant = async (req, res) => {
  try {
    // merchand id and get product details
    const { userId } = req.user;
    let data = await productModel.find({ userId: userId });
    let result = await Promise.all(
      data.map(async (product) => {
        // let productImage = await productImagesModel.find({
        //   productId: product._id,
        // });
        // let images = productImage.map((image) => {
        //   return process.env.PRODUCTIMAGES + image.name;
        // });
        // return {
        //   productId: product._id,
        //   merchentId: product.merchantId,
        //   name: product.name,
        //   description: product.description,
        //   price: product.price,
        //   isVeg: product.isVeg,
        //   status: product.status,
        //   productCategoryMasterId: product.productCategoryMasterId
        //     ? product.productCategoryMasterId
        //     : "",
        //   images: images,
        // };
        return await getProductDetail(product);
      })
    );
    // let imagesName = await Promise.all(
    //   productImages.map(async (value, index) => {
    //     let name = await helper.getRandomFileName();
    //     let imageName = await helper.saveImage(value, name, profilePath);
    //     return await productImagesModel.create({
    //       productId: product._id,
    //       name: imageName,
    //     });
    //   })
    // );

    return res.json(helper.generateServerResponse(1, "", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.productDetailById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.body[constants.APPNAME];
    let productData = await productModel.findOne({ _id: productId });
    console.log(productData, "product data");
    if (!productData) {
      return res.json("Product not found");
    }
    let moreProducts = await productModel
      .find({ userId: productData.userId, _id: { $ne: productId } })
      .limit(4);
    let cartProducts = await addToCartModel.findOne({
      $and: [{ userId: userId }, { orderPlaced: "2" }],
    });
    console.log(cartProducts, "cart products");
    console.log(moreProducts, "moreProducts");
    let data = await Promise.all(
      moreProducts.map(async (product) => {
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
    console.log(data, "data");
    let result = await getProductDetail(productData);
    console.log(result, "result");

    if (cartProducts) {
      console.log("this is calling");
      let cartItems = cartProducts.products.filter((v) => {
        if (v.productId.toString() == productData._id.toString()) {
          return v;
        }
      });
      console.log(cartItems, "Cart items");
      if (cartItems.length > 0) {
        console.log("cart item is greater than 0");
        result = {
          ...result,
          quantity: cartItems[0]?.quantity,
          moreProducts: data,
        };
      } else if (cartItems.length < 0) {
        console.log("cart item is less than 0");
        result = {
          ...result,

          moreProducts: data,
        };
        return result;
      }
      // let cartProduct = await addToCartModel.findOne({
      //   $and: [
      //     { productId: mongoose.Types.ObjectId(productData._id) },
      //     { userId: mongoose.Types.ObjectId(userId) },
      //   ],
      // });
    }
    // console.log("return is calling")
    result = {
      ...result,
      moreProducts: data,
    };
    console.log(data, "data");
    console.log(productData, "product data");
    if (productData) {
      console.log("tis ");
      return res.json(helper.generateServerResponse(1, "S", result));
    }
    res.json(helper.generateServerResponse(0, "F", []));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.stock = async (req, res) => {
  try {
    const { productId } = req.query;
    const type = req.body[constants.APPNAME];
    let product = await productModel.findOneAndUpdate(
      { _id: productId },
      type,
      { new: true }
    );
    res.json(
      helper.generateServerResponse(1, "S", await getProductDetail(product))
    );
  } catch (e) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.recommended = async (req, res) => {
  try {
    const { productId } = req.query;
    const recommended = req.body[constants.APPNAME];
    console.log(recommended);
    console.log(productId);
    let product = await productModel.findOneAndUpdate(
      { _id: productId },
      recommended,
      { new: true }
    );

    res.json(
      helper.generateServerResponse(1, "S", await getProductDetail(product))
    );
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.productList = async (req, res) => {
  try {
    const { userId } = req.user;
    // console.log(userId, "hiii");
    // usermaster  exist ]> //

    const { type } = req.body[constants.APPNAME];

    // console.log("error here 2");
    const products = await productModel.find({
      $and: [{ type: type }, { userId: userId }, { status: { $ne: "3" } }],
    });

    // const products = await productModel.find({
    //   $and: [{ type: type }, { merchantId: merchantId }],
    // });
    // console.log(products);

    if (products.length <= 0) {
      return res.json(helper.generateServerResponse(0, "150"));
    }

    let pro = await Promise.all(
      products.map(async (product) => {
        let cartProduct = await addToCartModel.findOne({
          userId,
        });

        return {
          ...(await getProductDetail(product)),
          quantity: cartProduct?.quantity ? cartProduct.quantity : "",
        };
      })
    );
    console.log("error here 5");
    res.json(helper.generateServerResponse(1, "S", pro));
  } catch (error) {
    res.json(helper.generateServerResponse(0, "I"));
  }
};

// exports.productList = async (req, res) => {
//   try {
//     // const { merchantId } = req.body[constants.APPNAME];
//     const type = req.body[constants.APPNAME].type;

//     const products = await productModel.find({
//       $and: [{ type: type }, { status: { $ne: "3" } }],
//     });

//     // const products = await productModel.find({
//     //   merchantId
//     // });

//     // if (products.length <= 0) {
//     //   return res.json(helper.generateServerResponse(0, "150"));
//     // }

//     // let result = await Promise.all(
//     //   orders.map(async (product) => {
//     //     let userDetail = await userMasterModel.findOne({
//     //       userId: product.userId,
//     //     });
//     //     console.log(userDetail, "user detail");
//     //     return {}}));

//     //     return res.json(helper.generateServerResponse(1, "S", result));
//     let pro = await Promise.all(
//       products.map(async (product) => {
//         let cartProduct = await addToCartModel.findOne({
//           merchantId
//         });

//         return {
//           ...(await getProductDetail(product)),
//           quantity: cartProduct?.quantity ? cartProduct.quantity : "",
//         };
//       })
//     );
//     res.json(helper.generateServerResponse(1, "S", pro));
//   } catch (error) {
//     res.json(helper.generateServerResponse(0, "I"));
//   }
// };
///////

exports.productListByCategory = async (req, res) => {
  try {
    const { categoryId, recommended } = req.body[constants.APPNAME];
    if (recommended == "1") {
      let products = await productModel.find({
        $and: [
          { categoryId: mongoose.Types.ObjectId(categoryId) },
          { recommended: "1" },
        ],
      });
      let data = await Promise.all(
        products.map((product) => {
          return getProductDetail(product);
        })
      );
      console.log(products.length, "recommended");
      return res.json(helper.generateServerResponse(1, "S", data));
    }
    let products = await productModel.find({
      categoryId: mongoose.Types.ObjectId(categoryId),
    });
    let data = await Promise.all(
      products.map((product) => {
        return getProductDetail(product);
      })
    );
    console.log(products.length);

    return res.json(helper.generateServerResponse(1, "S", data));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

// exports.orderList = async (req, res) => {
//   try {
//     const { userId, merchantId } =req.body[constants.APPNAME];
//     let orders = await orderModel.find({ userId: userId });
//     console.log(orders, "here")

//     if (!orders) {
//       return res.json(helper.generateServerResponse(0, "177"));
//     }
//     let result = await Promise.all(
//       orders.map(async (order) => {
//         let userDetail = await userMasterModel.findOne({
//           _id: order.userId,
//         });
//         console.log(userDetail, "user detail");
//         return {
//           orderId: order._id ? order._id : "",
//           userId: order.userId ? order.userId : "",
//           userName: userDetail.name ? userDetail.name : "",
//           addToCartId: order.addToCartId ? order.addToCartId : "",
//           couponApplied: order.couponApplied ? order.couponApplied : "",
//           couponCode: order.couponCode ? order.couponCode : "",
//           tip: order.tip ? order.tip : "",
//           totalAmount: order.totalAmount ? order.totalAmount : "",
//           discount: order.discount ? order.discount : "",
//           flat: order.flat ? order.flat : "",
//           delivery: order.delivery ? order.delivery : "",
//           toPay: order.toPay ? order.toPay : "",
//           status: order.status ? order.status : "",
//           products: order.products ? order.products : [],
//           suggestion: order.suggestion ? order.suggestion : "",
//           createdAt: order.createdAt ? order.createdAt : "",
//         };
//       })
//     );
//     return res.json(helper.generateServerResponse(1, "S", result));
//   } catch (error) {
//     console.log(error);
//     return res.json(helper.generateServerResponse(0, "I"));
//   }
// };

exports.orderList = async (req, res) => {
  try {
    const { userId } = req.user;
    // let orders = await orderModel.find({ $and: [{ userId: userId }] });
    // const { userId, merchantId } = req.body[constants.APPNAME];
    let orders = await orderModel.find({
      $and: [{ merchantId: userId }, { status: 1 }],
    });
    console.log(orders);
    if (orders.length <= 0) {
      return res.json(helper.generateServerResponse(0, "177"));
    }
    let result = await Promise.all(
      orders.map(async (order) => {
        let userDetail = await userMasterModel.findOne({
          _id: order.userId,
        });
        console.log(userDetail, "user detail");
        return {
          orderId: order._id ? order._id : "",
          orderNo: order.orderId ? order.orderId : "",
          // userId: order.userId ? order.userId : "",
          userName: userDetail.name ? userDetail.name : "",
          // addToCartId: order.addToCartId ? order.addToCartId : "",
          couponApplied: order.couponApplied ? order.couponApplied : "",
          couponCode: order.couponCode ? order.couponCode : "",
          tip: order.tip ? order.tip : "",
          totalAmount: order.totalAmount ? order.totalAmount : "",
          discount: order.discount ? order.discount : "",
          flat: order.flat ? order.flat : "",
          delivery: order.delivery ? order.delivery : "",
          toPay: order.toPay ? order.toPay : "",
          status: order.status ? order.status : "",
          products: order.products ? order.products : [],
          suggestion: order.suggestion ? order.suggestion : "",
          createdAt: order.createdAt ? order.createdAt : "",
        };
      })
    );
    return res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const { orderId, status } = req.body[constants.APPNAME];    

    // console.log(orderId, status, "accept order");
    let orders = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: status, orderState: "1", acceptedAt: Date.now() },
      { new: true }
    );
    if (!orders) {
      return res.json(helper.generateServerResponse(0, "F"));
    }

    return res.json(helper.generateServerResponse(1, "184", orders));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId, status } = req.body[constants.APPNAME];
    let orders = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { status: status },
      { new: true }
    );

    if (!orders) {
      return res.json(helper.generateServerResponse(0, "F"));
    }
    return res.json(helper.generateServerResponse(1, "185", orders));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.orderDetail = async (req, res) => {
  try {
    let { orderId } = req.body[constants.APPNAME];
    let order = await orderModel.findOne({ _id: orderId });
    console.log(order);
    if (!order) {
      return res.json(helper.generateServerResponse(0, "174"));
    }
    let userAddress = await userAddressModel.findOne({
      addressId: order.addressId,
    });

    let result = {
      orderId: order._id ? order._id : "",
      userId: order.userId ? order.userId : "",
      couponApplied: order.couponApplied ? order.couponApplied : "",
      couponCode: order.couponCode ? order.couponCode : "",
      tip: order.tip ? order.tip : "",
      totalAmount: order.totalAmount ? order.totalAmount : "",
      discount: order.discount ? order.discount : "",
      flat: order.flat ? order.flat : "",
      delivery: order.delivery ? order.delivery : "",
      toPay: order.toPay ? order.toPay : "",
      status: order.status ? order.status : "",
      products: order.products ? order.products : [],
      suggestion: order.suggestion ? order.suggestion : "",
      createdAt: order.createdAt ? order.createdAt : "",
      areaName: userAddress.areaName ? userAddress.areaName : "",
      addressType: userAddress.addressType ? userAddress.addressType : "",
      completeAddress: userAddress.completeAddress
        ? userAddress.completeAddress
        : "",
      latitude: userAddress.latitude ? userAddress.latitude : "",
      longitude: userAddress.longitude ? userAddress.longitude : "",
      Products: order.products ? order.products : [],
    };
    res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    res.json(helper.generateServerResponse(0, "I"));
  }
};

exports.readyOrder = async (req, res) => {
  const {orderId} = req.body[constants.APPNAME];

  let order = await orderModel.findById(orderId);

  if(!order){
    return res.json(helper.generateServerResponse(0, "177"));
  }

  if(order.status === "2"){
    try{
      let order2 = await orderModel.findByIdAndUpdate({ _id: orderId}, {orderState: "2"}, {new: true});

      return res.json(helper.generateServerResponse(1, "190", order2));
    }
    catch(err){
      console.log(err);
      return res.json(helper.generateServerResponse(0, "197"));
    }
  }
  else{
    return res.json(helper.generateServerResponse(0, "186"));
  }
}

// exports.orderStatus = async (req, res) => {
//   const { orderState, orderId } = req.body[constants.APPNAME];

//   let order = await orderModel.findById(orderId);

//   if (order.orderState == "4") {
//     return res.json(helper.generateServerResponse(1, "187"));
//   }

//   if (order.status == "2") {
//     try {
//       let order2 = await orderModel.findByIdAndUpdate(
//         { _id: orderId },
//         { orderState: orderState },
//         { new: true }
//       );
//       if (order2.orderState == "1") {
//         return res.json(helper.generateServerResponse(1, "192", order2));
//       } else if (order2.orderState == "2") {
//         return res.json(helper.generateServerResponse(1, "190", order2));
//       } else if (order2.orderState == "3") {
//         return res.json(helper.generateServerResponse(1, "191", order2));
//       } else if (order2.orderState == "4") {
//         return res.json(helper.generateServerResponse(1, "187", order2));
//       }
//     } catch (err) {
//       console.log(err);
//       return res.json(helper.generateServerResponse(0, "I"));
//     }
//   } else {
//     return res.json(helper.generateServerResponse(0, "186"));
//   }
// };

exports.getPreparingOrders = async (req, res) => {
  const { userId } = req.user;

  const orders = await orderModel.find({
    $and: [{ merchantId: userId }, { orderState: 1 }],
  });

  if (orders.length <= 0) {
    return res.json(helper.generateServerResponse(0, "177"));
  }

  let result = await Promise.all(
    orders.map(async (order) => {
      let userDetail = await userMasterModel.findOne({
        _id: order.userId,
      });

      let userAddress = await userAddressModel.findOne({
        _id: order.addressId,
      });

      return {
        orderId: order._id ? order._id : "",
        orderNo: order.orderId ? order.orderId : "",
        customerName: userDetail.name,
        products: order.products ? order.products : [],
        deliveryAddress: userAddress.fullAddress ? userAddress.fullAddress : "",
        customerMobile: userDetail.mobile ? userDetail.mobile : "",
        placedAt: order.createdAt ? order.createdAt : "",
        acceptedAt: order.acceptedAt ? order.acceptedAt : "",
        status: order.status ? order.status : "",
      };
    })
  );

  return res.json(helper.generateServerResponse(1, "S", result));
};

exports.getReadyOrders = async (req, res) => {
  const { userId } = req.user;

  const orders = await orderModel.find({
    $and: [{ merchantId: userId }, { orderState: 2 }],
  });

  if (orders.length <= 0) {
    return res.json(helper.generateServerResponse(0, "177"));
  }

  let result = await Promise.all(
    orders.map(async (order) => {
      let userDetail = await userMasterModel.findOne({
        _id: order.userId,
      });

      return {
        orderId: order._id ? order._id : "",
        orderNo: order.orderId ? order.orderId : "",
        products: order.products ? order.products : [],
        bill: order.toPay,
        status: order.status ? order.status : "",
      };
    })
  );

  return res.json(helper.generateServerResponse(1, "S", result));
};

exports.getPickedupOrders = async (req, res) => {
  const { userId } = req.user;

  const orders = await orderModel.find({
    $and: [{ merchantId: userId }, { status: 4 }],
  });

  if (orders.length <= 0) {
    return res.json(helper.generateServerResponse(0, "177"));
  }

  let result = await Promise.all(
    orders.map(async (order) => {
      let userAddress = await userAddressModel.findOne({
        _id: order.addressId,
      });

      return {
        orderId: order._id ? order._id : "",
        orderNo: order.orderId ? order.orderId : "",
        deliveryAddress: userAddress.fullAddress ? userAddress.fullAddress : "",
        status: order.status ? order.status : "",
      };
    })
  );

  return res.json(helper.generateServerResponse(1, "S", result));
};

exports.getDeliveredOrders = async (req, res) => {
  const { userId } = req.user;

  const orders = await orderModel.find({
    $and: [{ merchantId: userId }, { status: 5 }],
  });

  if (orders.length <= 0) {
    return res.json(helper.generateServerResponse(0, "177"));
  }

  let result = await Promise.all(
    orders.map(async (order) => {
      let userDetail = await userMasterModel.findOne({
        _id: order.userId,
      });

      let result2 = order.products.map((product) => {
        return {
          orderId: order._id ? order._id : "",
          orderNo: order.orderId ? order.orderId : "",
          itemName: product.name,
          status: order.status ? order.status : "",
        };
      });

      return result2;
    })
  );

  return res.json(helper.generateServerResponse(1, "S", result));
};

// exports.orderStatus = async (req, res) => {

//   const { orderState, status, orderId } = req.body[constants.APPNAME];
//   let orders = await orderModel.findOne({ _id: orderId });

//   console.log(orders, 'this is orders');
//   if (!orders) {
//     return res.json(helper.generateServerResponse(0, "174"));
//   }
//   let order2 = await orderModel.findOneAndUpdate(
//     { _id: orderId },
//     { status: status },
//     { new: true }
//   );
//   if (status == "2") {
//     try {
//       if (orderState == null) {
//         let order2 = await orderModel.findOneAndUpdate(
//           { _id: orderId },
//           { orderState: "1" },
//           { new: true }
//         );

//         return res.json(helper.generateServerResponse(1, "S", order2));

//       }

//       var y = Number(orderState);

//       var x = y + 1;

//       if (x > 2) {
//         return res.json(helper.generateServerResponse(0, "187"));

//       }

//       let order2 = await orderModel.findOneAndUpdate(
//         { _id: orderId },
//         { orderState: x },
//         { new: true }
//       );
//       return res.json(helper.generateServerResponse(1, "S", order2));

//     } catch (err) {
//       console.log(err);
//     }
//   }
//   else {
//     return res.json(helper.generateServerResponse(0, "186"));

//   }
// }
////

//// review
exports.orderRating = async (req, res) => {
  try {
    const { userId } = req.user;      

    const { orderId, orderStar, comment } = req.body[constants.APPNAME];
    let orders = await orderModel.find({ $and: [
      {_id: orderId},
      {merchantId: userId}
    ] });    

    if (!orders) {
      return res.json(helper.generateServerResponse(0, "177"));
    }

    let mercToCustRating = {
      orderStar: Number(orderStar),
      comment: comment,
    }

    // var x = Number(orderStar);
    let order2 = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { mercToCustRating: mercToCustRating },
      { new: true }
    );

    return res.json(helper.generateServerResponse(1, "S", order2));
  } catch (err) {
    console.log(err);
    return res.json(helper.generateServerResponse(0, "F"));
  }
};

exports.orderHistory = async (req, res) => {
  try {
    // const { userId } = req.body[constants.APPNAME];
    const { userId } = req.user;
    let orders = await orderModel.find({
      $and: [
        { merchantId: userId },
        { $or: [{ status: "3" }, { orderState: "4" }] },
      ],
    });
    // console.log(orders)
    if (orders.length <= 0) {
      return res.json(helper.generateServerResponse(0, "177"));
    }
    let result = await Promise.all(
      orders.map(async (order) => {
        // let userDetail = await userMasterModel.findOne({
        //   userId: order.userId,
        // });
        // console.log(userDetail, "user detail");
        return {
          orderId: order._id ? order._id : "",
          orderNo: order.orderId ? order.orderId : "",
          state: order.status == "3" ? "Cancelled" : "Delivered",
          acceptedAt: order.acceptedAt ? order.acceptedAt : "",
          // userId: order.userId ? order.userId : "",
          // userName: userDetail.name ? userDetail.name : "",
          // addToCartId: order.addToCartId ? order.addToCartId : "",
          couponApplied: order.couponApplied ? order.couponApplied : "",
          couponCode: order.couponCode ? order.couponCode : "",
          tip: order.tip ? order.tip : "",
          totalAmount: order.totalAmount ? order.totalAmount : "",
          discount: order.discount ? order.discount : "",
          flat: order.flat ? order.flat : "",
          // delivery: order.delivery ? order.delivery : "",
          toPay: order.toPay ? order.toPay : "",
          status: order.status ? order.status : "",
          products: order.products ? order.products : [],
          // suggestion: order.suggestion ? order.suggestion : "",
          createdAt: order.createdAt ? order.createdAt : "",
        };
      })
    );
    return res.json(helper.generateServerResponse(1, "S", result));
  } catch (error) {
    console.log(error);
    return res.json(helper.generateServerResponse(0, "I"));
  }
};

// delete product images
// return full url             done
// isVeg tag                   done
// sub product of resturant    done

// add merchent category id      (asked from ma'am)
