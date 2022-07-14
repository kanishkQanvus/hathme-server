const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../model/admin-model");
const constants = require("../constants");
const userMasterModel = require("../model/userMaster-model");
const categories = require("../model/category-model");
exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const result = await admin.findOne({ email });
        console.log(result);
        if (!result) {
            return res.json({
                [constants.APPNAME]: {
                    resCode: 0,
                    resMsg: "Email is Not Found...",
                    data: null,
                }
            });
        }
        // Email is Finded
        const verify = await bcrypt.compare(password, result.password);
        if (!verify) {
            return res.json({
                [constants.APPNAME]: {
                    resCode: 0,
                    resMsg: "Incorrect Password...",
                    data: null,
                }
            });
        }

        const token = await jwt.sign(
            { user: result._id },
            process.env.JWT_SECRET_KEY
        );

        console.log("result ", result._id);
        res.json({
            [constants.APPNAME]: {
                resCode: 1,
                resMsg: "You are Logged In",
                data: {
                    name: result.name,
                    email: result.email,
                    isAdmin: true,
                    token,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            [constants.APPNAME]: {
                success: 0,
                resMsg: "Something Went Wrong..." + error,
                data: null,
            }
        });
    }
};

exports.getAllMerchant = async (req, res) => {
    try {
        const result = await userMasterModel.find({ userType: 2 });
        res.json({
            [constants.APPNAME]: {
                success: 1,
                count: result.length,
                resMsg: "All Merchant",
                data: result,
            }
        });
    } catch (error) {
        console.log(error);
        res.json({
            [constants.APPNAME]: {
                success: 0,
                resMsg: "Something Went Wrong..." + error,
                data: null,
            }
        });
    }
}


// exports.getAllUser = async (req, res) => {
//     try {
//         const result = await userMasterModel.find({ userType: 1 });
//         console.log(result)
//         res.json({
//             [constants.APPNAME]: {
//                 success: 1,
//                 count: result.length,
//                 resMsg: "All Users",
//                 data: result,
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             [constants.APPNAME]: {
//                 success: 0,
//                 resMsg: "Something Went Wrong..." + error,
//                 data: null,
//             }
//         });
//     }
// }

exports.ddd = async (req, res) => {
    try {
        const result = await userMasterModel.find({ userType: 1 });
        console.log(result)
        res.json({
            [constants.APPNAME]: {
                success: 1,
                count: result.length,
                resMsg: "All Users",
                data: result,
            }
        });
    } catch (error) {
        console.log(error);
        res.json({
            [constants.APPNAME]: {
                success: 0,
                resMsg: "Something Went Wrong..." + error,
                data: null,
            }
        });
    }
}

exports.GetAllCategory = async (req, res) => {
    try {
        const result = await categories.find({});
        console.log(result)
        res.json({
            [constants.APPNAME]: {
                success: 1,
                count: result.length,
                resMsg: "All Users",
                data: result,
            }
        });
    } catch (error) {
        console.log(error);
        res.json({
            [constants.APPNAME]: {
                success: 0,
                resMsg: "Something Went Wrong..." + error,
                data: null,
            }
        });
    }
}