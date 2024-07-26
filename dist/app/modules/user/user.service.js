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
const user_model_1 = require("./user.model");
const insertUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "user already exist with this email");
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
        expiresIn: "1m",
    });
    yield (0, mailSender_1.sendEmail)(payload === null || payload === void 0 ? void 0 : payload.email, "Your Otp Is", `<div><h5>your otp is: ${otp}</h5>
    <p>valid for:${expiresAt.toLocaleString()}</p>
    </div>`);
    return {
        user: result,
        token: token,
    };
});
const insertVendorIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "user already exist with this email");
    }
    const formatedData = Object.assign(Object.assign({}, payload), { needsPasswordChange: true });
    console.log(formatedData);
    const result = yield user_model_1.User.create(formatedData);
    console.log(result);
    yield (0, mailSender_1.sendEmail)(result === null || result === void 0 ? void 0 : result.email, "Your Gmail And Password Is:", `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4CAF50;">Your One Time OTP</h2>
    <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
      <p style="font-size: 16px;">Your Gmail Is: <strong>${result.email}</strong></p>
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
const deleteAccount = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const user = yield user_model_1.User.IsUserExistbyId(id);
    console.log(user);
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
};
