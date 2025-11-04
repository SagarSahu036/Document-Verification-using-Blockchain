const express = require("express");
const router = express.Router();

const { requestOtpLogin, verifyOtpLogin } = require("../controllers/adminController");

router.post("/request-otp-login", requestOtpLogin);
router.post("/verify-otp-login", verifyOtpLogin);

module.exports = router;
