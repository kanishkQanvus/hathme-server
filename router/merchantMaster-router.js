const express = require("express");
const merchantController = require("../controller/merchantMaster-controller");
const { auth, setHeader } = require("../middleware/auth");
const {
  allCategory,
  searchCategory,
} = require("../controller/category-controller");
const router = express.Router();

router.route("/Register").post(setHeader, merchantController.newMerchant);
router.route("/Login").post(setHeader, merchantController.loginMerchant);
router.route("/OtpVerification").post(auth, merchantController.otpVerification);

router.use(auth);

router.route("/MerchantProfile").get(merchantController.merchantProfile);
router.route("/VerifyPin").post(merchantController.pinVerify);
router.route("/Logout").post(merchantController.logoutMerchant);
router.route("/ResendOtp").get(merchantController.resendOtp);
router.route("/MerchantDetail").post(merchantController.merchnatDetail);
router
  .route("/updateCategory")
  .post(merchantController.updateProductCategory);

router.route("/GeneratePin").post(merchantController.generatePin);
router.route("/ChangePassword").post(merchantController.changePassword);
router.route("/ChangePin").post(merchantController.changePin);
router.route("/ForgotPin").post(merchantController.forgotPin);
router.route("/ForgotPassword").post(merchantController.forgotPassword);

router.route("/Status").post(merchantController.isOnOff);
router.route("/UpdateProfile").post(merchantController.updateProfile);
router.route("/UserVerify").post(merchantController.userVerification);
router.route("/BankDetails").post(merchantController.bankDetails);
router.route("/GetBankDetails").get(merchantController.getBankDetails);
///////
router.route("/OrderList").get(merchantController.orderList);
router.route("/OrderDetail").post(merchantController.orderDetail);
/////orderStatus
// router.route("/OrderStatus").post(merchantController.orderStatus)

router.route("/readyOrder").post(merchantController.readyOrder);
router.route("/getPreparingOrders").get(merchantController.getPreparingOrders);
router.route("/getReadyOrders").get(merchantController.getReadyOrders);
router.route("/getPickedupOrders").get(merchantController.getPickedupOrders);
router.route("/getDeliveredOrders").get(merchantController.getDeliveredOrders);





router.route("/OrderRating").post(merchantController.orderRating)
router.route("/OrderHistory").post(merchantController.orderHistory);




// router
//   .route("/ProductCategoryMaster")
//   .post(auth, merchantController.productCategoryMaster);

router.route("/getAllSubCategories").post(merchantController.getAllSubCategories);

router
  .route("/listSubCategories")
  .get(merchantController.subProductCategoryList);
router.route("/addSubCategory").post(merchantController.addSubCategory);
router.route("/editSubCategory").patch(merchantController.editSubCategory);
router.route("/deleteSubCategory").delete(merchantController.deleteSubCategory);
router.route("/AddProduct").post(merchantController.addProduct);
router.route("/MyProducts").get(merchantController.myProductList);
router.route("/DeleteProduct").post(merchantController.deletProducts);
router.route("/UpdateProduct").put(merchantController.editProduct);
router
  .route("/ProductCategoryList")
  .get(merchantController.subProductCategoryList);
router.route("/AddProductImages").post(merchantController.addProductImage);
router.route("/DeleteProductImage").post(merchantController.deleteProductImage);
// router
//   .route("/MerchantListByCategory")
//   .post(merchantController.merchantListByCategory);
router
  .route("/MerchantDetailedById")
  .get(merchantController.merchantDetailById);
router
  .route("/ProductListByMerchant")
  .get(merchantController.proudctListByMerchant);
router
  .route("/ProductDetailedById")
  .post(merchantController.productDetailById);
router.route("/ChangeStock").post(merchantController.stock);
router.route("/Category").get(allCategory);
router.route("/MarkRecommend").post(merchantController.recommended);
router.route("/ProductList").post(merchantController.productList);
// router.route("/ProductList").post(merchantController.productList);

// Accept order 


router.route("/AcceptOrder").post(merchantController.acceptOrder);


router.route("/CancelOrder").post(merchantController.cancelOrder);



// router.route("/ProductListByCategory").post(merchantController.productListByCategory);
// pending list
// Set Store Available/Not available, Set Product Available/Not Available,add bank details,Receive Order, Accept / Reject order, order details, order history, transaction history

module.exports = router;
