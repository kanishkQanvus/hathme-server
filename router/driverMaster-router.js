const express = require('express');
const router = express.Router();

const { auth, setHeader } = require("../middleware/auth");

const driverController = require("../controller/driverMaster-controller");

router.route("/Register").post(setHeader, driverController.newDriver);
router.route("/Login").post(setHeader, driverController.loginDriver);
router.post("/OtpVerification", auth, driverController.otpVerification);

router.use(auth);

router.route("/GeneratePin").post(driverController.generatePin);
router.route("/ChangePin").post(driverController.changePin);
router.route("/ChangePassword").post(driverController.changePassword);
router.route("/ForgotPin").post(driverController.forgotPin);
router.route("/ForgotPassword").post(driverController.forgotPassword);
router.route("/MyProfile").get(driverController.myProfile);
router.route("/VerifyPin").post(driverController.pinVerify);
router.route("/UserVerify").post(driverController.userVerification);
router.route("/BankDetails").post(driverController.bankDetails);
router.route("/Status").post(driverController.isOnOff);

router.use(driverController.checkOnOffStatus);  // Check if driver is online or not

router.route("/getPendingDeliveries").get(driverController.getPendingDeliveries);
router.route("/acceptOrder").post(driverController.acceptOrder);
router.route('/getAcceptedOrders').get(driverController.getAcceptedOrders);
router.route('/orderDetails/:orderId').get(driverController.orderDetails);
router.route('/orderPickedUp').post(driverController.orderPickedUp);
router.route('/orderDelivered').post(driverController.orderDelivered);

module.exports = router;