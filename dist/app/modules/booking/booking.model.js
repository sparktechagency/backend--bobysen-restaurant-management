"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user information is required"],
    },
    id: {
        type: String,
        required: [true, "id is required"],
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "table id is required"],
    },
    isReviewed: {
        type: Boolean,
        default: false,
    },
    table: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Table",
        required: [true, "table id is required"],
    },
    date: {
        type: String,
        required: [true, "date is required"],
    },
    time: {
        type: String,
        required: [true, "time is required"],
    },
    endTime: {
        type: String,
        required: [true, "end time is required"],
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "completed"],
        default: "active",
    },
}, {
    timestamps: true,
});
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
