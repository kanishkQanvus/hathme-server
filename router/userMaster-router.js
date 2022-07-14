const express = require("express");
const router = express.Router();
const { auth, setHeader } = require("../middleware/auth");
const {
  allCategory,
  searchCategory,
} = require("../controller/category-controller");
const userController = require("../controller/userMaster-controller");
const merchantController = require("../controller/merchantMaster-controller");

router.route("/Register").post(userController.newUser);
router.route("/MyProfile").get(auth, userController.myProfile);
router.route("/Login").post(userController.loginUser);
router.post("/OtpVerification", auth, userController.otpVerification);
router.route("/GeneratePin").post(auth, userController.generatePin);
router.route("/ChangePassword").post(auth, userController.changePassword);
router.route("/ChangePin").post(auth, userController.changePin);
router.route("/ForgotPassword").post(userController.forgotPassword);
router.route("/ForgotPin").post(userController.forgotPin);
router.route("/UpdateProfile").post(auth, userController.updateProfile);
router.route("/UserVerify").post(auth, userController.userVerification);
router.route("/Logout").post(auth, userController.logoutUser);
router.route("/ResendOtp").get(auth, userController.resendOtp);
router.route("/UserSearch").post(userController.searchByUser);
router.route("/UserDetail").get(userController.getUserDetail);
router.route("/VerifyPin").post(auth, userController.pinVerify);
router.route("/Search").post(auth, userController.searchUser);
// for Request api

router.route("/SendFriendRequest").post(auth, userController.sendFriendRequest);
router
  .route("/PendingRequestList")
  .get(auth, userController.pendingRequestList);
router.route("/RejectRequest").delete(userController.rejectRequestList);
router.route("/AcceptFriendRequest").put(userController.acceptRequest);
router.route("/MyFriends").get(auth, userController.friendRequestList);
router.route("/AddToCart").post(auth, userController.addToCart);
router
  .route("/GetProductFromCart")
  .get(auth, userController.getProductFromCart);
router.route("/Address").post(auth, userController.address);
router.route("/UpdateAddress").put(auth, userController.updateAdress);

router.route("/GetAddress").get(auth, userController.getAddress);

router.route("/DeleteAddress").delete(userController.deleteAdress);
//
router.route("/GetCoupon").get(userController.getCoupon);
//
router.route("/ApplyCoupon").post(auth, userController.getCoupenApplied);
router.route("/RemoveProductsFromCart").get(auth,userController.removeItemFromAddToCart);
router.route("/RemoveCoupon").get(auth, userController.removeCoupen);
router.route("/PlaceOrder").post(auth, userController.placeOrder);
router.route("/OrderList").get(auth, userController.orderList);
router.route("/OrderDetail").post(userController.orderDetail);
router.route("/CancelOrder").post(userController.cancelOrder);
router.route("/repeatOrder").post(auth, userController.repeatOrder);
router.route("/clearCart").get(auth, userController.clearCart);

//merchant api
router.route("/ProductList").post(merchantController.productList);

router
  .route("/ProductListByMerchantId")
  .post(auth, userController.productListByMerchantId);
router
  .route("/MerchantListByCategoryId")
  .post(userController.categoryBasedOnMerchent);
router
  .route("/ProductDetailedById")
  .post(auth, merchantController.productDetailById);

// category api
router.route("/Category").get(allCategory);
router.route("/SearchCategory").get(searchCategory);

module.exports = router;








// Order list, Order detail, cancel order, Order history - for user app @Muhammad 


// Order List, Order Detail, Accept/Reject Order, Order History - for merchant app