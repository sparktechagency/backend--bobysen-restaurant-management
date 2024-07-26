"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = require("mongoose");
const contentSchema = new mongoose_1.Schema({
    aboutUs: {
        type: String,
        default: "",
    },
    privacyPolicy: {
        type: String,
        default: "",
    },
    termsAndConditions: {
        type: String,
        default: "",
    },
    support: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
exports.Content = (0, mongoose_1.model)("Content", contentSchema);
