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
exports.verifyCaptchaToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../error/AppError"));
const user_constant_1 = require("../modules/user/user.constant");
const verifyCaptchaToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { captchaToken } = req.body;
        // Check if token is provided
        if (!captchaToken) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Captcha token is required');
        }
        // Check if secret key is configured
        const secretKey = config_1.default.google_captcha_secret_key;
        if (!secretKey) {
            console.error('GOOGLE_CAPTCHA_SECRET_KEY is not configured');
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Captcha verification is not configured');
        }
        // Verify the token with Google
        const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const params = new URLSearchParams({
            secret: secretKey,
            response: captchaToken,
            remoteip: req.ip || req.socket.remoteAddress || '',
        });
        const response = yield fetch(verificationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });
        if (!response.ok) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to verify captcha with Google servers');
        }
        const data = (yield response.json());
        // Check for verification success
        if (!data.success) {
            console.warn('Captcha verification failed:', {
                errorCodes: data['error-codes'],
                ip: req.ip,
            });
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Captcha verification failed. Please try again.');
        }
        // For reCAPTCHA v3: verify score and action
        if (data.score !== undefined) {
            if (data.score < user_constant_1.RECAPTCHA_MIN_SCORE) {
                console.warn('Captcha score too low:', {
                    score: data.score,
                    ip: req.ip,
                });
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Captcha verification failed. Suspicious activity detected.');
            }
            if (data.action && data.action !== user_constant_1.RECAPTCHA_EXPECTED_ACTION) {
                console.warn('Captcha action mismatch:', {
                    expected: user_constant_1.RECAPTCHA_EXPECTED_ACTION,
                    received: data.action,
                    ip: req.ip,
                });
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Captcha verification failed. Invalid action.');
            }
        }
        // Verification successful - proceed to next middleware
        next();
    }
    catch (error) {
        // Pass AppError instances to error handler
        if (error instanceof AppError_1.default) {
            next(error);
            return;
        }
        // Log unexpected errors and send generic message
        console.error('Unexpected error during captcha verification:', error);
        next(new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An error occurred during captcha verification'));
    }
});
exports.verifyCaptchaToken = verifyCaptchaToken;
