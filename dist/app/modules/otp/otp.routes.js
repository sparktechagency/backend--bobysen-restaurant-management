"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const otp_controller_1 = require("./otp.controller");
const router = (0, express_1.Router)();
router.post("/verify-otp", otp_controller_1.otpControllers.verifyOtp);
router.post("/resend-otp", otp_controller_1.otpControllers.resendOtp);
router.post("/verify/reservation", (0, auth_1.default)(user_constant_1.USER_ROLE.user), otp_controller_1.otpControllers.verifyOtpForWidget);
exports.otpRoutes = router;
