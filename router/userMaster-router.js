const express = require("express");
const router = express.Router();
const { auth, setHeader } = require("../middleware/auth");
const {
  allCategory,
  searchCategory,
} = require("../controller/category-controller");
const userController = require("../controller/userMaster-controller");
const merchantController = require("../controller/merchantMaster-controller");

router.route("/Register").post(setHeader, userController.newUser);
router.route("/Login").post(setHeader, userController.loginUser);
router.post("/OtpVerification", auth, userController.otpVerification);

router.use(auth);

router.route("/MyProfile").get(userController.myProfile);
router.route("/GeneratePin").post(userController.generatePin);
router.route("/ChangePassword").post(userController.changePassword);
router.route("/ChangePin").post(userController.changePin);
router.route("/ForgotPassword").post(userController.forgotPassword);
router.route("/ForgotPin").post(userController.forgotPin);
router.route("/UpdateProfile").post(userController.updateProfile);
router.route("/UserVerify").post(userController.userVerification);
router.route("/Logout").post(userController.logoutUser);
router.route("/ResendOtp").get(userController.resendOtp);
router.route("/UserSearch").post(userController.searchByUser);
router.route("/UserDetail").get(userController.getUserDetail);
router.route("/VerifyPin").post(userController.pinVerify);
router.route("/Search").post(userController.searchUser);
router.route("/FindUser").post(userController.findUser);
// for Request api

router.route("/SendFriendRequest").post(userController.sendFriendRequest);
router
  .route("/PendingRequestList")
  .get(userController.pendingRequestList);
router.route("/RejectRequest").delete(userController.rejectRequestList);
router.route("/AcceptFriendRequest").put(userController.acceptRequest);
router.route("/MyFriends").get(userController.friendRequestList);
router.route("/AddToCart").post(userController.addToCart);
router
  .route("/GetProductFromCart")
  .get(userController.getProductFromCart);
router.route("/Address").post(userController.address);
router.route("/UpdateAddress").put(userController.updateAdress);

router.route("/GetAddress").get(userController.getAddress);

router.route("/DeleteAddress").delete(userController.deleteAdress);
//
router.route("/GetCoupon").get(userController.getCoupon);
//
router.route("/ApplyCoupon").post(userController.getCoupenApplied);
router.route("/RemoveProductsFromCart").get(userController.removeItemFromAddToCart);
router.route("/RemoveCoupon").get(userController.removeCoupen);
router.route("/PlaceOrder").post(userController.placeOrder);
router.route("/OrderList").get(userController.orderList);
router.route("/OrderDetail").post(userController.orderDetail);
router.route("/CancelOrder").post(userController.cancelOrder);
router.route("/repeatOrder").post(userController.repeatOrder);
router.route("/clearCart").get(userController.clearCart);

//merchant api
router.route("/ProductList").post(merchantController.productList);

router
  .route("/ProductListByMerchantId")
  .post(userController.productListByMerchantId);
router
  .route("/MerchantListByCategoryId")
  .post(userController.categoryBasedOnMerchent);
router
  .route("/ProductDetailedById")
  .post(merchantController.productDetailById);

// category api
router.route("/Category").get(allCategory);
router.route("/SearchCategory").get(searchCategory);

router
  .route("/UploadVideo")
  .post(userController.uploadVideos, userController.videoUpload);

module.exports = router;








// Order list, Order detail, cancel order, Order history - for user app @Muhammad 


// Order List, Order Detail, Accept/Reject Order, Order History - for merchant app