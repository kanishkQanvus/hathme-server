const jwt = require("jsonwebtoken");
const helper = require("../helper/apiHelper");

exports.auth = async (req, res, next) => {
  console.log("middleware call");
  const token = req.header("token");
  const deviceType = req.header("deviceType"); //1 - Android, 2 - iOS, 3 - Web
  const appVersion = req.header("appVersion"); //Current App Version
  const apiVersion = req.header("apiVersion"); //Current Api Version
  const deviceId = req.header("deviceId"); //App Device Id  
  const languageCode = req.header("languageCode"); //Language Code
  const loginRegion = req.header("loginRegion"); // User Login region
  const userToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
  try {
    if (!token) {
      res.json("Access Denied");
    }
    console.log("auth is calling");
    let userToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(userToken);
    //  userToken ={
    //     ...userToken,
    //     deviceType,deviceId,version,apiVersion,language
    // }
    let userId = userToken.userId;
    req.user = {userId,appVersion,deviceType,apiVersion,deviceId,languageCode, loginRegion};

    const header = req.user;

    if(helper.checkHeader(header) === 0){
      return res.json(helper.generateServerResponse(0, "196"));
    }
  
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
exports.setHeader = async(req,res,next)=>{
    const deviceType = req.header("deviceType"); //1 - Android, 2 - iOS, 3 - Web
    const appVersion = req.header("appVersion"); //Current App Version
    const apiVersion = req.header("apiVersion"); //Current Api Version
    const deviceId = req.header("deviceId"); //App Device Id    
    const languageCode = req.header("languageCode"); //Language Code
    const loginRegion = req.header("loginRegion"); // User Login region
    req.user = {deviceType,deviceId,appVersion,apiVersion,languageCode, loginRegion};

    const header = req.user;

    if(helper.checkHeader(header) === 0){
      return res.json(helper.generateServerResponse(0, "196"));
    }

    console.log(req.user);

    next();
}
