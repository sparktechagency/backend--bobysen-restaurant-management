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
exports.userServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const fileHelper_1 = require("../../utils/fileHelper");
const mailSender_1 = require("../../utils/mailSender");
const otpGenerator_1 = require("../../utils/otpGenerator");
const auth_utils_1 = require("../auth/auth.utils");
const otp_service_1 = require("../otp/otp.service");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const insertUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    // if (user?.isDeleted) {
    //   throw new AppError(httpStatus.FORBIDDEN, "This account is Deleted.");
    // }
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "user already exist with this email");
    }
    if (!(0, user_utils_1.validatePhoneNumber)(payload === null || payload === void 0 ? void 0 : payload.phoneNumber)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Phone number is invalid");
    }
    const otp = (0, otpGenerator_1.generateOtp)();
    const expiresAt = (0, moment_1.default)().add(3, "minute");
    const formatedData = Object.assign(Object.assign({}, payload), { role: "user", status: "pending", verification: {
            otp,
            expiresAt,
        } });
    const result = yield user_model_1.User.create(formatedData);
    const jwtPayload = {
        email: payload === null || payload === void 0 ? void 0 : payload.email,
        id: result === null || result === void 0 ? void 0 : result._id,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "3m",
    });
    const smsData = {
        mobile: payload === null || payload === void 0 ? void 0 : payload.phoneNumber,
        template_id: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.otp_tempalte_id,
        authkey: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.whatsapp_auth_key,
        realTimeResponse: 1,
    };
    console.log("dhaka");
    // await sendEmail(
    //   payload?.email!,
    //   "Welcome to Bookatable – Your Smart Dining Experience Awaits!",
    //   `<div style="font-family: Arial, sans-serif; text-align: center;">
    //     <a href="YOUR_LOGO_LINK_HERE">
    //       <img src="https://i.ibb.co.com/HfDrLRrK/1024x1024bb.png" alt="Bookatable Logo" style="width: 150px; height: auto;">
    //     </a>
    //     <h2>Welcome to Bookatable!</h2>
    //     <p>Thank you for registering with Bookatable! You’ve just unlocked a simple yet intelligent way to book your favorite restaurants effortlessly.</p>
    //     <h3>Your OTP is <strong>${otp}</strong></h3>
    //     <p>(Valid until ${expiresAt.toLocaleString()})</p>
    //     <p>With Bookatable, you can do more than just reserve a table – you can pre-order your meal, prepay, and enjoy a seamless dining experience without any hassle when you arrive.</p>
    //     <p>We look forward to serving you a delightful experience.</p>
    //     <p><strong>Bon appétit!</strong></p>
    //     <p>The Bookatable Team</p>
    //   </div>`
    // );
    yield otp_service_1.otpServices.sendotpforverification(smsData);
    return {
        user: result,
        token: token,
    };
});
//  insert user from the widget
const insertUserIntoDbFromWidget = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email, type: "widget" });
    if (user) {
        yield user_model_1.User.findByIdAndDelete(user === null || user === void 0 ? void 0 : user._id);
    }
    const data = Object.assign(Object.assign({}, payload), { role: "user", type: "widget", password: "!password" });
    const result = yield user_model_1.User.create(data);
    const smsData = {
        mobile: payload === null || payload === void 0 ? void 0 : payload.phoneNumber,
        template_id: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.template_id,
        authkey: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.whatsapp_auth_key,
        realTimeResponse: 1,
    };
    const otp = yield otp_service_1.otpServices.sendOtpForWidget(smsData);
    const jwtPayload = {
        userId: result._id,
        role: result.role,
    };
    const token = (0, auth_utils_1.createToken)(
    // @ts-ignore
    jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return token;
});
const insertVendorIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "user already exist with this email");
    }
    const formatedData = Object.assign(Object.assign({}, payload), { needsPasswordChange: true });
    const result = yield user_model_1.User.create(formatedData);
    yield (0, mailSender_1.sendEmail)(result === null || result === void 0 ? void 0 : result.email, "Your Gmail And Password Is:", `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4CAF50;">Your One Time OTP</h2>
    <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
      <p style="font-size: 16px;">Your Gmail Is: <strong>${result === null || result === void 0 ? void 0 : result.email}</strong></p>
      <p style="font-size: 14px; color: #666;">Your Login Password Is: ${payload === null || payload === void 0 ? void 0 : payload.password}</p>
    </div>
  </div>`);
    return result;
});
const getme = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    //  email update lagbe na
    if (payload === null || payload === void 0 ? void 0 : payload.email) {
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, "email is not for update");
    }
    if (payload === null || payload === void 0 ? void 0 : payload.role) {
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, "role is not for update");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    if (result && (payload === null || payload === void 0 ? void 0 : payload.image)) {
        yield (0, fileHelper_1.deleteFile)(user === null || user === void 0 ? void 0 : user.image);
    }
    return result;
});
const getAllusers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModel = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(["email", "fullName"])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield userModel.modelQuery;
    const meta = yield userModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    //  email update lagbe na
    if ((payload === null || payload === void 0 ? void 0 : payload.email) !== (payload === null || payload === void 0 ? void 0 : payload.currentEmail)) {
        const findEmail = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select("email");
        if (findEmail) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Duplicate email!");
        }
    }
    if (payload === null || payload === void 0 ? void 0 : payload.role) {
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, "role is not for update");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    if (result && (payload === null || payload === void 0 ? void 0 : payload.image)) {
        yield (0, fileHelper_1.deleteFile)(user === null || user === void 0 ? void 0 : user.image);
    }
    return result;
});
const deleteAccount = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.IsUserExistbyId(id);
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Password does not match!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    return result;
});
exports.userServices = {
    insertUserIntoDb,
    insertVendorIntoDb,
    getme,
    updateProfile,
    getAllusers,
    updateUser,
    getSingleUser,
    deleteAccount,
    insertUserIntoDbFromWidget,
};
