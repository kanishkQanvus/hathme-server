const express = require("express");
const { addCategory } = require("../controller/category-controller");
const { loginUser, getAllUsers, getAllMerchant, ddd, GetAllCategory } = require("../controller/admin-controller")

const { auth } = require("../middleware/auth")
const router = express.Router()
router.route("/Category").post(auth,addCategory);
router.route("/login").post(loginUser)
router.route("/GetAllMerchant").get(getAllMerchant)
// router.route("/GetAllUser").get(getAllUsers)
router.route("/ddd").get(ddd)
router.route("/GetAllCategory").get(GetAllCategory)

// router.route("/AllCategory").post(auth,allCategory);


module.exports = router