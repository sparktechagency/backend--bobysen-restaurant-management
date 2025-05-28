"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const cart_interface_1 = require("./cart.interface");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user information is required"],
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "owner information is required"],
    },
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: [true, "user information is required"],
    },
    items: [
        {
            menu: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Menu",
                required: [true, "menu information is required"],
            },
            quantity: Number,
            amount: Number,
            isPaid: {
                type: Boolean,
                default: false,
            },
        },
    ],
    transactions: [
        {
            transaction_id: {
                type: String,
            },
            orderId: {
                type: String,
            },
            checksum: {
                type: String,
            },
            amount: {
                type: Number,
            },
            status: {
                type: Boolean,
            },
            date: {
                type: Date,
            },
        },
    ],
    subTotal: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: [true, "amount information is required"],
        default: 0,
    },
    totalPaid: {
        type: Number,
        default: 0,
    },
    totalDue: {
        type: Number,
        default: 0,
    },
    date: {
        type: String,
        required: [true, "date information is required"],
    },
    discount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: Object.values(cart_interface_1.statusValue),
        default: cart_interface_1.statusValue.unpaid,
    },
}, { timestamps: true });
// filter out deleted documents
cartSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
cartSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
cartSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Cart = (0, mongoose_1.model)("Cart", cartSchema);
