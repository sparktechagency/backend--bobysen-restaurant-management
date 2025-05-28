"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = void 0;
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const validatePhoneNumber = (phoneNumber, countryCode = "MU") => {
    const number = (0, libphonenumber_js_1.default)(phoneNumber, countryCode);
    return number && number.isValid() ? true : false;
};
exports.validatePhoneNumber = validatePhoneNumber;
