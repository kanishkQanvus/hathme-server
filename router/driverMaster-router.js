const express = require('express');
const router = express.Router();

const { auth, setHeader } = require("../middleware/auth");

const driverController = require("../controller/driverMaster-controller");

router.route("/Register").post(setHeader, driverController.newDriver);
router.route("/MyProfile").get(auth, driverController.myProfile);
router.route("/Login").post(setHeader, driverController.loginDriver);
router.post("/OtpVerification", auth, driverController.otpVerification);
router.route("/GeneratePin").post(auth, driverController.generatePin);
router.route("/ChangePassword").post(auth, driverController.changePassword);
router.route("/ChangePin").post(auth, driverController.changePin);
router.route("/ForgotPassword").post(driverController.forgotPassword);
router.route("/ForgotPin").post(driverController.forgotPin);
router.route("/UserVerify").post(auth, driverController.userVerification);
router.route("/BankDetails").post(auth, driverController.bankDetails);
router.route("/getPendingDeliveries").get(auth, driverController.getPendingDeliveries);
router.route("/Status").post(auth, driverController.isOnOff);
router.route("/acceptOrder").post(auth, driverController.acceptOrder);
router.route('/getAcceptedOrders').get(auth, driverController.getAcceptedOrders);
router.route('/orderDetails/:orderId').get(auth, driverController.orderDetails);
router.route('/orderPickedUp').post(auth, driverController.orderPickedUp);
router.route('/orderDelivered').post(auth, driverController.orderDelivered);

module.exports = router;