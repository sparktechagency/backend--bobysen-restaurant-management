"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), ".env")) });
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    ip: process.env.IP,
    database_url: process.env.database_url,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    nodemailer_host_email: process.env.NODEMAILER_HOST_EMAIL,
    nodemailer_host_pass: process.env.NODEMAILER_HOST_PASS,
    socket_port: process.env.SOCKET_PORT,
    stripe_secret: process.env.STRIPE_SECRET,
    whatsapp_auth_key: process.env.WHATSAPP_AUTH_KEY,
    whatsapp_sms_number: process.env.WHATSAPP_SMS_NUMBER,
    template_id: process.env.TEMPLATE_ID,
    otp_url: process.env.OTP_URL,
    verify_otp_url: process.env.VERIFY_OTP_URL,
    otp_tempalte_id: process.env.OTP_TEMPLATE_ID,
    spaces: {
        url: process.env.SPACES_API,
        image_url: process.env.SPACES_IMAGE_API,
        accessKey: process.env.SPACES_ACCESS_KEY,
        secretKey: process.env.SPACES_SECRET_KEY,
        region: process.env.SPACES_REGION,
        bucket: process.env.SPACES_BUCKET,
    },
    payment: {
        load_payment_zone: process.env.LOAD_PAYMENT_ZONE,
        decrypt_payment_api: process.env.DECRYPT_PAYMENT_API,
        authorization: process.env.PAYMENT_AUTHORIZATION,
        id_merchant: process.env.ID_MERCHANT,
        id_entity: process.env.ID_ENTITY,
        id_operator: process.env.ID_OPERATOR,
        operator_password: process.env.OPERATOR_PASSWORD,
        salt: process.env.PAYMENT_SALT,
        chiper_key: process.env.CHIPER_KEY,
    },
};
