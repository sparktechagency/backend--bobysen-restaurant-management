"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const { Schema } = mongoose_1.default;
const walletSchema = new Schema({
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: [true, "vendor information is required"], // Added 'required' keyword
    },
    // amount means total sells by the vendor and we calculate due for avilable balance and withdraw
    amount: {
        type: Number,
        required: [true, "amount is required"],
        default: 0,
    },
    due: {
        type: Number,
        default: 0,
    },
    totalPaid: {
        type: Number,
        default: 0,
    },
    lastPaymentDate: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    paymentHistory: [
        {
            percentage: Number,
            subTotal: Number,
            method: String,
            amount: Number,
            date: String,
        },
    ],
}, {
    timestamps: true,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
