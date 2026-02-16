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
exports.authServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const mailSender_1 = require("../../utils/mailSender");
const otpGenerator_1 = require("../../utils/otpGenerator");
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) === 'pending') {
        if ((user === null || user === void 0 ? void 0 : user.type) == 'mobile_website') {
            yield user_model_1.User.findByIdAndDelete(user === null || user === void 0 ? void 0 : user._id);
        }
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found!!');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    if ((user === null || user === void 0 ? void 0 : user.type) == 'widget') {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found!!');
    }
    // throw new AppError(httpStatus.BAD_REQUEST, "user is not verified");
    if (!(yield user_model_1.User.isPasswordMatched(payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'password do not match');
    }
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user._id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        user,
        accessToken,
        refreshToken,
    };
});
// change password
const changePassword = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.IsUserExistbyId(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'old password do not match!');
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.newPassword) !== (payload === null || payload === void 0 ? void 0 : payload.confirmPassword)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'old password and new password do not match');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            password: hashedPassword,
            passwordChangedAt: new Date(),
        },
    }, { new: true });
    return result;
});
// forgot password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found ');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'your account is inactive');
    }
    const jwtPayload = {
        email: email,
        id: user === null || user === void 0 ? void 0 : user._id,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '2m',
    });
    const currentTime = new Date();
    const otp = (0, otpGenerator_1.generateOtp)();
    const expiresAt = (0, moment_1.default)(currentTime).add(2, 'minute');
    yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        verification: {
            otp,
            expiresAt,
        },
    });
    yield (0, mailSender_1.sendEmail)(email, 'Welcome to Bookatable – Your Smart Dining Experience Awaits!', `<div style="font-family: Arial, sans-serif; text-align: center;">
      <a href="YOUR_LOGO_LINK_HERE">
        <img src="https://i.ibb.co.com/HfDrLRrK/1024x1024bb.png" alt="Bookatable Logo" style="width: 150px; height: auto;">
      </a>
      <h2>Welcome to Bookatable!</h2>
      <p>Thank you for registering with Bookatable! You’ve just unlocked a simple yet intelligent way to book your favorite restaurants effortlessly.</p>
      
      <h3>Your OTP is <strong>${otp}</strong></h3>
      <p>(Valid until ${expiresAt.toLocaleString()})</p>
  
      <p>With Bookatable, you can do more than just reserve a table – you can pre-order your meal, prepay, and enjoy a seamless dining experience without any hassle when you arrive.</p>
  
      <p>We look forward to serving you a delightful experience.</p>
      
      <p><strong>Bon appétit!</strong></p>
      <p>The Bookatable Team</p>
    </div>`);
    // send the mail here
    return { email, token };
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(token, payload);
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Session has exipired. please try again');
    }
    const user = yield user_model_1.User.findById(decode === null || decode === void 0 ? void 0 : decode.id).select('isDeleted verification');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    if (new Date() > ((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.expiresAt)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'sessions expired');
    }
    if (!((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.status)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Otp is not verified yet!');
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.newPassword) !== (payload === null || payload === void 0 ? void 0 : payload.confirmPassword)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'New password and Confirm password do not match!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield user_model_1.User.findByIdAndUpdate(decode === null || decode === void 0 ? void 0 : decode.id, {
        password: hashedPassword,
        passwordChangedAt: new Date(),
        verification: {
            otp: 0,
            status: false,
        },
    });
    return result;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { userId } = decoded;
    const user = yield user_model_1.User.IsUserExistbyId(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.authServices = {
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
};
