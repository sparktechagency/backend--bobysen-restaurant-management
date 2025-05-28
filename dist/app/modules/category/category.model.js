"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
categorySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
categorySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
categorySchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
