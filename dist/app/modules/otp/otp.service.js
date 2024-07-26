"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const mailSender_1 = require("../../utils/mailSender");
const otpGenerator_1 = require("../../utils/otpGenerator");
const user_model_1 = require("../user/user.model");
const verifyOtp = (token, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(token, "otp");
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "you are not authorized!");
    }
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "session has expired.please try to submit otp withing 1 minute");
    }
    const user = yield user_model_1.User.findById(decode === null || decode === void 0 ? void 0 : decode.id).select("verification status");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "user not found");
    }
    if (new Date() > ((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.expiresAt)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "otp has expired. Please resend it");
    }
    if (Number(otp) !== Number((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.otp)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "otp did not match");
    }
    const updateUser = yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        $set: {
            status: (user === null || user === void 0 ? void 0 : user.status) === "active" ? user === null || user === void 0 ? void 0 : user.status : "active",
            verification: {
                otp: 0,
                expiresAt: (0, moment_1.default)().add(2, "minute"),
                status: true,
            },
        },
    }, { new: true });
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        id: user === null || user === void 0 ? void 0 : user._id,
    };
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "2m",
    });
    return { user: updateUser, token: jwtToken };
});
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email);
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "user not found");
    }
    const otp = (0, otpGenerator_1.generateOtp)();
    const expiresAt = (0, moment_1.default)().add(2, "minute");
    const updateOtp = yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        $set: {
            verification: {
                otp,
                expiresAt,
                status: false,
            },
        },
    });
    if (!updateOtp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "failed to resend otp. please try again later");
    }
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        id: user === null || user === void 0 ? void 0 : user._id,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "2m",
    });
    yield (0, mailSender_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email, "Your One Time Otp", `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4CAF50;">Your One Time OTP</h2>
    <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
      <p style="font-size: 16px;">Your OTP Is: <strong>${otp}</strong></p>
      <p style="font-size: 14px; color: #666;">This OTP is valid until: ${expiresAt.toLocaleString()}</p>
    </div>
  </div>`);
    return { token };
});
exports.otpServices = {
    verifyOtp,
    resendOtp,
};
