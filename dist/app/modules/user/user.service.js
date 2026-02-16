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
    // Step 1: Check if any user exists with this email
    const existingUser = yield user_model_1.User.isUserExist(payload.email);
    let user;
    if (existingUser) {
        if (existingUser.type === 'website_mobile') {
            // Regular user already exists → cannot create
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User already exists with this email');
        }
        else if (existingUser.type === 'widget') {
            // Widget user exists → update info and verify account
            existingUser.fullName = payload.fullName;
            existingUser.phoneNumber = payload.phoneNumber;
            existingUser.password = payload.password;
            existingUser.status = 'pending';
            existingUser.type = 'website_mobile';
            user = yield existingUser.save();
            // Send OTP
            const smsData = {
                mobile: user.phoneNumber,
                template_id: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.otp_tempalte_id,
                authkey: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.whatsapp_auth_key,
                realTimeResponse: 1,
            };
            yield otp_service_1.otpServices.sendotpforverification(smsData);
            // Generate JWT
            const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, config_1.default.jwt_access_secret, { expiresIn: '3m' });
            return { user, token };
        }
    }
    // Step 2: Validate phone number
    if (!(0, user_utils_1.validatePhoneNumber)(payload === null || payload === void 0 ? void 0 : payload.phoneNumber)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Phone number is invalid');
    }
    // Step 3: Generate OTP and set expiry
    const otp = (0, otpGenerator_1.generateOtp)();
    const expiresAt = (0, moment_1.default)().add(3, 'minute');
    // Step 4: Prepare user data for creation (new regular user)
    const formatedData = Object.assign(Object.assign({}, payload), { role: 'user', type: 'website_mobile', status: 'pending', verification: { otp, expiresAt } });
    // Step 5: Create new regular user
    user = yield user_model_1.User.create(formatedData);
    // Step 6: Generate JWT
    const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, config_1.default.jwt_access_secret, { expiresIn: '3m' });
    // Step 7: Send OTP
    const smsData = {
        mobile: payload === null || payload === void 0 ? void 0 : payload.phoneNumber,
        template_id: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.otp_tempalte_id,
        authkey: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.whatsapp_auth_key,
        realTimeResponse: 1,
    };
    yield otp_service_1.otpServices.sendotpforverification(smsData);
    // Step 8: Return user and token
    return { user, token };
});
//  insert user from the widget
const insertUserIntoDbFromWidget = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if any user exists with this email, regardless of type
    let user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (user && (user === null || user === void 0 ? void 0 : user.type) != 'widget') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exist with same email.');
    }
    let result;
    // Only create new user if none exists
    if (!user) {
        const data = Object.assign(Object.assign({}, payload), { role: 'user', type: 'widget', password: config_1.default.widgetPassword });
        result = yield user_model_1.User.create(data);
        user = result; // set for later use
    }
    // Send OTP regardless of whether user is new or existing
    const smsData = {
        mobile: payload === null || payload === void 0 ? void 0 : payload.phoneNumber,
        template_id: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.template_id,
        authkey: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.whatsapp_auth_key,
        realTimeResponse: 1,
    };
    yield otp_service_1.otpServices.sendOtpForWidget(smsData);
    const jwtPayload = {
        userId: user._id,
        role: user.role,
    };
    const token = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return token;
});
const insertVendorIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'user already exist with this email');
    }
    const formatedData = Object.assign(Object.assign({}, payload), { needsPasswordChange: true });
    const result = yield user_model_1.User.create(formatedData);
    yield (0, mailSender_1.sendEmail)(result === null || result === void 0 ? void 0 : result.email, 'Your Gmail And Password Is:', `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
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
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, 'email is not for update');
    }
    if (payload === null || payload === void 0 ? void 0 : payload.role) {
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, 'role is not for update');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    if (result && (payload === null || payload === void 0 ? void 0 : payload.image)) {
        yield (0, fileHelper_1.deleteFile)(user === null || user === void 0 ? void 0 : user.image);
    }
    return result;
});
const getAllusers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModel = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(['email', 'fullName'])
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
        const findEmail = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('email');
        if (findEmail) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Duplicate email!');
        }
    }
    if (payload === null || payload === void 0 ? void 0 : payload.role) {
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, 'role is not for update');
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
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Password does not match!');
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
