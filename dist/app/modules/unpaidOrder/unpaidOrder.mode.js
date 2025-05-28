"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpaidOrder = void 0;
const mongoose_1 = require("mongoose");
const unpaidOrderSchema = new mongoose_1.Schema({
    cart: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Cart",
        required: [true, "cart is required"],
    },
    token: {
        type: String,
        required: [true, "token is required"],
    },
    customer: {
        type: String,
        ref: "User",
        required: [true, "customer is required"],
    },
    id_order: {
        type: String,
        required: [true, "order id is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// filter out deleted documents
unpaidOrderSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
unpaidOrderSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
unpaidOrderSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.unpaidOrder = (0, mongoose_1.model)("TopRestaurant", unpaidOrderSchema);
