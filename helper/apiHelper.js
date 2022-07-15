const path = require('path');
// const fileUpload = require("express-fileupload")
//
const mime = require("mime");

const fs = require("fs");
const constants = require("../constants");
const messages = function (resMsg) {
  let codes = new Array();
  codes["I"] = "Input JSON is invalid";
  codes["F"] = "Data not found";
  codes["S"] = "Success";
  /// for testing
  codes["T"] = "image part invalid response is zero"

  codes[100] = "Email Id can not be empty";
  codes[101] = "Your Email is invalid";
  codes[102] = "Email Id already registered";
  codes[103] = "User registered successfully";
  codes[104] = "Mobile number already registered";
  // codes[105] = "User send illegal request";
  codes[106] = "OTP verified successfully";
  codes[107] = "Invalid otp number";
  codes[108] = "Pin successfully generated";
  codes[109] = "Incorrect password";
  codes[110] = "Password has been changed successfully";
  codes[111] = "Pin generated successfully";
  codes[112] = "Merchant registered successfully";
  codes[113] = "Incorrect pin";
  codes[114] = "Pin has been changed successfully";
  codes[116] = "Your password send to the email";
  codes[117] = "Category alrady exist";
  codes[118] = "Category has been added successfully";
  codes[119] = "Permission not granted";
  codes[120] = "All categories";
  codes[121] = "No categories";
  codes[122] = "Search categories";
  codes[123] = "Profile update successfully";
  codes[124] = "Offline / Online status has been updated successfully";
  codes[125] = "Email Id not found";
  codes[126] = "Your account is blocked.Kindly contact admin";
  codes[127] = "Category has been updated successfully";
  codes[128] = "You have successfully logged in";
  codes[129] = "You have successfully logged out";
  codes[130] = "Your deviceId is wrong";
  codes[131] = "OTP has been send to your email.Kindly check your mail";
  codes[132] = "User Details";
  codes[133] = "Search data by aadhaar card number";
  codes[134] = "Search data of user";
  codes[135] = "No serch Data";
  codes[137] = "User Data";
  codes[138] = "Your pin has been verified successfully";
  codes[139] = "Incorrect pin";
  codes[140] = "User name already exist";
  codes[142] = "Your bank details has been saved successfully ";
  codes[143] = "Friend request accepted";
  codes[144] = "Your account details has been updated successfully";
  codes[145] = "You are reject friend request";
  codes[146] = "Friend list";
  codes[147] = "You have been already sending friend request";
  codes[148] = "your product has been updated successfully";
  codes[149] = "your product has been deleted successfully";
  codes[150] = "No Products";
  codes[151] = "Sub Categories list";
  codes[152] = "Please select your product";
  codes[153] = "your product successylly added";
  codes[154] = "No product images";
  codes[155] = "Product image has been deleted successfully";
  codes[156] = "Your category has been updated successfully";
  codes[157] = "Product not found";
  codes[158] = "Refferal Code is invalid";
  codes[159] = "No friend";
  codes[160] = "Product List"
  codes[161] = "Successfully add product"
  codes[162] = "Your product has been updated successfully"
  codes[163] = "Your product add to cart has been successfully"
  codes[164] = "Your product has been successfully updated in cart"
  codes[165] = "your product has been removed in cart"
  codes[166] = "you are not marchant"
  codes[167] = "you are not user"
  codes[168] = "No Record Found"
  codes[169] = "you have been already fill address"
  codes[170] = "No user Found"
  codes[171] = "Your address has beed deleted successfully"
  codes[172] = "No product in cart"
  codes[173] = "code coupon has been removed"
  codes[174] = "No Product in cart"
  codes[175] = "Coupon code is invalid"
  codes[176] = "Coupon Expire"
  codes[177] = "No order "
  codes[178] = "you are not eligible for coupon"
  codes[179] = "order cancel"
  codes[180] = "you have already added product from different merchant"
  codes[181] = "This product does not exist in cart"
  codes[182] = "Product remove has been successfully from cart"
  codes[183] = "Merchant Detail not found";
  codes[184] = "Order has been accepted";
  codes[185] = "Order has been cancel";
  codes[186] = "Order is not accepted";  
  codes[187] = "Order is delivered";
  codes[188] = "Rating has not done";
  codes[189] = "No Order in cart";
  codes[190] = "Order is in ready state";
  codes[191] = "Order has been picked up";
  codes[192] = "Order is in preparing stage";
  codes[193] = "Sub Category has been deleted successfully";
  codes[194] = "Approved sub-categories cannot be deleted or edited";
  codes[195] = "Sub Category edited successfully";
  codes[196] = "Headers are not set"
  codes[197] = "Something went wrong!"

  return codes[resMsg];
};

exports.checkHeader = function(header){
  for(let value in header){    
    if(header[value] === undefined){      
      return 0;
    }
  }  

  return 1;
}
exports.generateServerResponse = function (msgCode, resMsg, data = null) {
  let response;
  if (data != null) {
    response = {
      resCode: msgCode,
      resMsg: messages(resMsg),
      data,
    };
  } else {
    response = {
      resCode: msgCode,
      resMsg: messages(resMsg),
    };
  }
  return {
    [constants.APPNAME]: response,
  };
};
Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};
exports.validateJSON = (reqJSON, reqKey) => {
  const validateKey = Object.keys(reqJSON);
  const diff1 = validateKey.diff(reqKey);
  const diff2 = reqKey.diff(validateKey);
  if (diff1.length > 0 || diff2.length > 0) {
    return 0;
  } else {
    return 1;
  }
};
//var data = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAA..kJggg==';
exports.saveImage = (encodedUri, name, folderPath) => {

  encodedUri="data:image/jpeg;base64,"+encodedUri;
   const matches = encodedUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  // matches = encodedUri;

  // console.log(encodedUri, "before");
  // encodedUri = String(encodedUri)
  //console.log(encodedUri);


  //  var matches = encodedUri.match(/^data:([A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
  // var matches = encodedUri.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
  // var response = {};


  //   if (matches.length !== 3) {
  //     return new Error('Invalid input string');
  // }

 // var matches = encodedUri.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
  //var response = {};

  console.log("api 1")
  //console.log(matches)
    let extension = mime.getExtension(matches[1]);


  // let extension = encodedUri.charAt(0);
  // if (extension == '/') {
  //   extension = "jpg";
  // }
  // else if (extension == 'i') {
  //   extension = "png";
  // }
  // else if (extension == 'R') {
  //   extension = "gif";
  // }
  // else if (extension == 'U') {
  //   extension = "webp";
  // }
  // else {
  //   extension = "jpeg";
  // }


  //  let ext = mime.getExtension(contentType);
  // ext = (ext && ext.charAt(0) !== '.') ? `.${ext}` : ext;

  //  let extension= encodedUri.split(';')[0].split('/');
  //   mime.getExtension(matches[1],'text/plain');
  console.log("api 2")
  // console.log(extension)
  let fileName = name + "." + extension;
  console.log("api 3")
  // console.log(fileName)

  //  console.log(`${folderPath}` + fileName, " File Name");
  try {
    console.log("buf1")
    let data = String(matches[2])

    let buff = new Buffer.from(data, 'base64');
    // let buff = new Buffer.from(data);

    // let ans=buff.toString('base64');
    // console.log(buff, "buf2")
    fs.writeFileSync(`${folderPath}` + fileName, buff);
    console.log("buf3")


    // fs.writeFileSync(
    //   `${folderPath}` + fileName,
    //   new Buffer(matches[2], "base64"),
    //   "utf8"
    // );

    return fileName;
  } catch (e) {
    console.log(e);
  }
};




exports.getRandomFileName = () => {
  var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  var random = ("" + Math.random()).substring(2, 8);
  console.log(random);
  var random_number = timestamp + random;
  return random_number;
}

// save img
exports.saveImage2 = (encodedUri, name, folderPath) => {




  var matches = encodedUri.match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
  var response = {};

  console.log("api 1")
  //console.log(matches)
  //  let extension = mime.getExtension(matches[1]);

  let extension = encodedUri.charAt(0);
  if (extension == '/') {
    extension = "jpg";
  }
  else if (extension == 'i') {
    extension = "png";
  }
  else if (extension == 'R') {
    extension = "gif";
  }
  else if (extension == 'U') {
    extension = "webp";
  }
  else {
    extension = "jpeg";
  }


  //  let ext = mime.getExtension(contentType);
  // ext = (ext && ext.charAt(0) !== '.') ? `.${ext}` : ext;

  //  let extension= encodedUri.split(';')[0].split('/');
  //   mime.getExtension(matches[1],'text/plain');
  console.log("api 2")
  // console.log(extension)
  let fileName = name + "." + extension;
  console.log("api 3")
  // console.log(fileName)

  //  console.log(`${folderPath}` + fileName, " File Name");
  try {
    console.log("buf1")
    let data = String(matches[2])

    let buff = new Buffer.from(data, 'base64');
    // let buff = new Buffer.from(data);

    // let ans=buff.toString('base64');
    // console.log(buff, "buf2")
    fs.writeFileSync(`${folderPath}` + fileName, buff);
    console.log("buf3")


    // fs.writeFileSync(
    //   `${folderPath}` + fileName,
    //   new Buffer(matches[2], "base64"),
    //   "utf8"
    // );

    return fileName;
  } catch (e) {
    console.log(e);
  }
};
