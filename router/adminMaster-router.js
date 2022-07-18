const express = require("express");
const router = express.Router()
const { addCategory } = require("../controller/category-controller");
const { loginUser, getAllUsers, getAllMerchant, ddd, GetAllCategory, changeSubCategoryStatus } = require("../controller/admin-controller")

const { auth } = require("../middleware/auth")
router.route("/Category").post(auth,addCategory);
router.route("/login").post(loginUser)
router.route("/GetAllMerchant").get(getAllMerchant)
// router.route("/GetAllUser").get(getAllUsers)
router.route("/changeSubCategoryStatus").post(auth, changeSubCategoryStatus);
router.route("/ddd").get(ddd)
router.route("/GetAllCategory").get(GetAllCategory)

// router.route("/AllCategory").post(auth,allCategory);


module.exports = router