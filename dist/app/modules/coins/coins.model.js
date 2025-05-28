"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
const mongoose_1 = require("mongoose");
const coinSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Assuming there is a Customer model to reference
        required: true,
    },
    coins: {
        type: Number,
        required: true,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const CoinWithDrawSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Assuming there is a Customer model to reference
        required: true,
    },
    coins: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
coinSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
coinSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
coinSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
CoinWithDrawSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
CoinWithDrawSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
CoinWithDrawSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const WithDrawCoin = (0, mongoose_1.model)("WithdrawCoin", CoinWithDrawSchema);
exports.Coin = (0, mongoose_1.model)("Coin", coinSchema);
exports.default = WithDrawCoin;
