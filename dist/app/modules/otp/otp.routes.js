"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const router = (0, express_1.Router)();
router.post("/verify-otp", otp_controller_1.otpControllers.verifyOtp);
router.post("/resend-otp", otp_controller_1.otpControllers.resendOtp);
exports.otpRoutes = router;
