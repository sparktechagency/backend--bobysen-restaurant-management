"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuCategory = void 0;
const mongoose_1 = require("mongoose");
const MenuCategorySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: "",
    },
    image: {
        type: String,
        required: [true, "image is required"],
    },
    title: {
        type: String,
        required: [true, "title is required"],
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "restaurant is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// filter out deleted documents
MenuCategorySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
MenuCategorySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
MenuCategorySchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.MenuCategory = (0, mongoose_1.model)("MenuCategory", MenuCategorySchema);
