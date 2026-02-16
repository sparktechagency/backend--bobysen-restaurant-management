"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailDomain = exports.signupLimiter = exports.validatePhoneNumber = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_status_1 = __importDefault(require("http-status"));
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_constant_1 = require("./user.constant");
const validatePhoneNumber = (phoneNumber, countryCode = 'MU') => {
    const number = (0, libphonenumber_js_1.default)(phoneNumber, countryCode);
    return number && number.isValid() ? true : false;
};
exports.validatePhoneNumber = validatePhoneNumber;
exports.signupLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // max 5 signups per IP per hour
    message: {
        success: false,
        message: 'Too many signup attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const validateEmailDomain = (req, res, next) => {
    const { email } = req.body;
    const domain = email.split('@')[1];
    if (user_constant_1.blockedDomains.includes(domain)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Disposable email addresses are not allowed');
    }
    next();
};
exports.validateEmailDomain = validateEmailDomain;
/**
 * Middleware to verify Google reCAPTCHA v3 token
 * Expects the token to be in req.body.captchaToken
 */
