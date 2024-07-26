"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = exports.Menu = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"],
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "restaurant id is required"],
    },
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Review",
        required: [true, "reservation  id is required"],
    },
    rating: {
        type: Number,
        required: [true, "rating is required"],
    },
    comment: {
        type: String,
        required: [true, "comment is required"],
    },
});
const menuSchema = new mongoose_1.Schema({
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MenuCategory",
        required: [true, "menu category is required"],
    },
    image: {
        type: String,
        required: [true, "menu image is required"],
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "restaurant is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    name: {
        type: String,
        required: [true, "name is required"],
    },
    price: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "owner information  is required"],
    },
    available: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// filter out deleted documents
menuSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
menuSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
menuSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Menu = (0, mongoose_1.model)("Menu", menuSchema);
exports.Review = (0, mongoose_1.model)("Review", reviewSchema);
