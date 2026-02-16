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
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const booking_service_1 = require("../booking/booking.service");
const user_model_1 = require("../user/user.model");
const verifyOtp = (token, otp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'you are not authorized!');
    }
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'session has expired.please try to submit otp withing 5 minute');
    }
    const user = yield user_model_1.User.findById(decode === null || decode === void 0 ? void 0 : decode.id).select('verification status phoneNumber');
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    // if (new Date() > user?.verification?.expiresAt) {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     "otp has expired. Please resend it"
    //   );
    // }
    // if (Number(otp) !== Number(user?.verification?.otp)) {
    //   throw new AppError(httpStatus.BAD_REQUEST, "otp did not match");
    // }
    const options = {
        method: 'GET',
        url: config_1.default.verify_otp_url,
        params: { otp: otp, mobile: user === null || user === void 0 ? void 0 : user.phoneNumber },
        headers: { authkey: config_1.default.whatsapp_auth_key },
    };
    // console.log(options);
    const { data } = yield axios_1.default.request(options);
    if ((data === null || data === void 0 ? void 0 : data.message) === 'OTP expired') {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, data === null || data === void 0 ? void 0 : data.message);
    }
    else if ((data === null || data === void 0 ? void 0 : data.message) === 'OTP not match') {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, data === null || data === void 0 ? void 0 : data.message);
    }
    else if ((data === null || data === void 0 ? void 0 : data.message) === 'Mobile no. already verified') {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, data === null || data === void 0 ? void 0 : data.message);
    }
    else {
        const updateUser = yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
            $set: {
                status: (user === null || user === void 0 ? void 0 : user.status) === 'active' ? user === null || user === void 0 ? void 0 : user.status : 'active',
                verification: {
                    otp: 0,
                    expiresAt: (0, moment_1.default)().add(5, 'minute'),
                    status: true,
                },
            },
        }, { new: true });
        const jwtPayload = {
            email: user === null || user === void 0 ? void 0 : user.email,
            id: user === null || user === void 0 ? void 0 : user._id,
        };
        const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
            expiresIn: '5m',
        });
        return { user: updateUser, token: jwtToken };
    }
});
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'user not found');
    }
    // const otp = generateOtp();
    // const expiresAt = moment().add(2, "minute");
    // const updateOtp = await User.findByIdAndUpdate(user?._id, {
    //   $set: {
    //     verification: {
    //       otp,
    //       expiresAt,
    //       status: false,
    //     },
    //   },
    // });
    // if (!updateOtp) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     "failed to resend otp. please try again later"
    //   );
    // }
    const smsData = {
        mobile: user === null || user === void 0 ? void 0 : user.phoneNumber,
        template_id: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.template_id,
        authkey: config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.whatsapp_auth_key,
        realTimeResponse: 1,
    };
    yield exports.otpServices.sendOtpForWidget(smsData);
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        id: user === null || user === void 0 ? void 0 : user._id,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '5m',
    });
    // await sendEmail(
    //   user?.email,
    //   "Your One Time Otp",
    //   `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //   <h2 style="color: #4CAF50;">Your One Time OTP</h2>
    //   <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
    //     <p style="font-size: 16px;">Your OTP Is: <strong>${otp}</strong></p>
    //     <p style="font-size: 14px; color: #666;">This OTP is valid until: ${expiresAt.toLocaleString()}</p>
    //   </div>
    // </div>`
    // );
    return { token };
});
const sendotpforverification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const options = {
        method: 'POST',
        url: config_1.default.otp_url,
        headers: { 'Content-Type': 'application/json' },
        params: {
            mobile: payload === null || payload === void 0 ? void 0 : payload.mobile,
            otp_expiry: 5,
            template_id: payload === null || payload === void 0 ? void 0 : payload.templateId,
            authkey: payload === null || payload === void 0 ? void 0 : payload.authkey,
            realTimeResponse: payload === null || payload === void 0 ? void 0 : payload.realTimeResponse,
        },
    };
    try {
        const { data } = yield axios_1.default.request(options);
        return data;
    }
    catch (error) {
        console.log('Error Sending OTP:', 
        // @ts-ignore
        error.response ? error.response.data : error.message);
    }
});
const sendOtpForWidget = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: 'POST',
        url: config_1.default.otp_url,
        headers: { 'Content-Type': 'application/json' },
        params: {
            mobile: payload === null || payload === void 0 ? void 0 : payload.mobile,
            otp_expiry: 5,
            template_id: payload === null || payload === void 0 ? void 0 : payload.templateId,
            authkey: payload === null || payload === void 0 ? void 0 : payload.authkey,
            realTimeResponse: payload === null || payload === void 0 ? void 0 : payload.realTimeResponse,
        },
    };
    try {
        const { data } = yield axios_1.default.request(options);
        return data;
    }
    catch (error) {
        console.error('Error Sending OTP:', 
        // @ts-ignore
        error.response ? error.response.data : error.message);
    }
});
const verifyOtpForWidget = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: 'GET',
        url: config_1.default.verify_otp_url,
        params: { otp: payload === null || payload === void 0 ? void 0 : payload.otp, mobile: payload === null || payload === void 0 ? void 0 : payload.mobile },
        headers: { authkey: config_1.default.whatsapp_auth_key },
    };
    const { data } = yield axios_1.default.request(options);
    if ((data === null || data === void 0 ? void 0 : data.message) === 'OTP expired') {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, data === null || data === void 0 ? void 0 : data.message);
    }
    else if ((data === null || data === void 0 ? void 0 : data.message) === 'OTP not match') {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, data === null || data === void 0 ? void 0 : data.message);
    }
    else {
        yield booking_service_1.bookingServies.bookAtable(payload);
    }
    return data;
});
// Example usage:
exports.otpServices = {
    verifyOtp,
    sendotpforverification,
    resendOtp,
    sendOtpForWidget,
    verifyOtpForWidget,
};
