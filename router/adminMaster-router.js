const express = require("express");
const router = express.Router()
const { addCategory } = require("../controller/category-controller");
const { loginUser, getAllUsers, getAllMerchant, ddd, GetAllCategory, approveSubCategory } = require("../controller/admin-controller")

const { auth } = require("../middleware/auth")
router.route("/Category").post(auth,addCategory);
router.route("/login").post(loginUser)
router.route("/GetAllMerchant").get(getAllMerchant)
// router.route("/GetAllUser").get(getAllUsers)
router.route("/approveSubCategory").post(auth, approveSubCategory);
router.route("/ddd").get(ddd)
router.route("/GetAllCategory").get(GetAllCategory)

// router.route("/AllCategory").post(auth,allCategory);


module.exports = router