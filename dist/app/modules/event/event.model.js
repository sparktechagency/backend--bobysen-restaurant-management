"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPayment = exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventPaymentSchema = new mongoose_1.Schema({
    event: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
const EventsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    entryFee: {
        type: Number,
        required: true,
    },
    images: [
        {
            url: {
                type: String,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
EventsSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true }, isActive: true });
    next();
});
EventsSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true }, isActive: true });
    next();
});
EventsSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true }, isActive: true }
    });
    next();
});
exports.Event = (0, mongoose_1.model)("Event", EventsSchema);
exports.EventPayment = (0, mongoose_1.model)("EventPayment", EventPaymentSchema);
