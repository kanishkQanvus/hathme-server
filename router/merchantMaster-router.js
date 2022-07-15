const express = require("express");
const merchantController = require("../controller/merchantMaster-controller");
const { auth, setHeader } = require("../middleware/auth");
const {
  allCategory,
  searchCategory,
} = require("../controller/category-controller");
const router = express.Router();

router.route("/Register").post(setHeader, merchantController.newMerchant);
router.route("/MerchantProfile").get(auth, merchantController.merchantProfile);
router.route("/Login").post(setHeader, merchantController.loginMerchant);
router.route("/VerifyPin").post(auth, merchantController.pinVerify);
router.route("/Logout").post(merchantController.logoutMerchant);
router.route("/ResendOtp").get(auth, merchantController.resendOtp);
router.route("/OtpVerification").post(auth, merchantController.otpVerification);
router.route("/MerchantDetail").post(auth, merchantController.merchnatDetail);
router
  .route("/updateCategory")
  .post(auth, merchantController.updateProductCategory);

router.route("/GeneratePin").post(auth, merchantController.generatePin);
router.route("/ChangePassword").post(auth, merchantController.changePassword);
router.route("/ChangePin").post(auth, merchantController.changePin);
router.route("/ForgotPin").post(merchantController.forgotPin);
router.route("/ForgotPassword").post(merchantController.forgotPassword);

router.route("/Status").post(auth, merchantController.isOnOff);
router.route("/UpdateProfile").post(auth, merchantController.updateProfile);
router.route("/UserVerify").post(auth, merchantController.userVerification);
router.route("/BankDetails").post(auth, merchantController.bankDetails);
router.route("/GetBankDetails").get(auth, merchantController.getBankDetails);
///////
router.route("/OrderList").get(auth, merchantController.orderList);
router.route("/OrderDetail").post(merchantController.orderDetail);
/////orderStatus
// router.route("/OrderStatus").post(merchantController.orderStatus)

router.route("/readyOrder").post(merchantController.readyOrder);
router.route("/getPreparingOrders").get(auth, merchantController.getPreparingOrders);
router.route("/getReadyOrders").get(auth, merchantController.getReadyOrders);
router.route("/getPickedupOrders").get(auth, merchantController.getPickedupOrders);
router.route("/getDeliveredOrders").get(auth, merchantController.getDeliveredOrders);





router.route("/OrderRating").post(auth, merchantController.orderRating)
router.route("/OrderHistory").post(auth, merchantController.orderHistory);




// router
//   .route("/ProductCategoryMaster")
//   .post(auth, merchantController.productCategoryMaster);
router
  .route("/listSubCategories")
  .get(auth, merchantController.subProductCategoryList);
router.route("/addSubCategory").post(auth, merchantController.addSubCategory);
router.route("/editSubCategory").patch(auth, merchantController.editSubCategory);
router.route("/deleteSubCategory").delete(auth, merchantController.deleteSubCategory);
router.route("/AddProduct").post(auth, merchantController.addProduct);
router.route("/MyProducts").get(auth, merchantController.myProductList);
router.route("/DeleteProduct").post(auth, merchantController.deletProducts);
router.route("/UpdateProduct").put(merchantController.editProduct);
router
  .route("/ProductCategoryList")
  .get(auth, merchantController.subProductCategoryList);
router.route("/AddProductImages").post(merchantController.addProductImage);
router.route("/DeleteProductImage").post(merchantController.deleteProductImage);
// router
//   .route("/MerchantListByCategory")
//   .post(merchantController.merchantListByCategory);
router
  .route("/MerchantDetailedById")
  .get(auth, merchantController.merchantDetailById);
router
  .route("/ProductListByMerchant")
  .get(auth, merchantController.proudctListByMerchant);
router
  .route("/ProductDetailedById")
  .post(auth, merchantController.productDetailById);
router.route("/ChangeStock").post(merchantController.stock);
router.route("/Category").get(allCategory);
router.route("/MarkRecommend").post(merchantController.recommended);
router.route("/ProductList").post(auth, merchantController.productList);
// router.route("/ProductList").post(merchantController.productList);

// Accept order 


router.route("/AcceptOrder").post(merchantController.acceptOrder);


router.route("/CancelOrder").post(merchantController.cancelOrder);



// router.route("/ProductListByCategory").post(merchantController.productListByCategory);
// pending list
// Set Store Available/Not available, Set Product Available/Not Available,add bank details,Receive Order, Accept / Reject order, order details, order history, transaction history

module.exports = router;
