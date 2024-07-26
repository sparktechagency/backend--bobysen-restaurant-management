"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopRestaurant = void 0;
const mongoose_1 = require("mongoose");
const TopReStaurantSchema = new mongoose_1.Schema({
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "restaurant is required"],
    },
    location: {
        latitude: Number,
        longitude: Number,
        coordinates: [Number],
        type: { type: String, default: "Point" },
    },
    startDate: {
        type: String,
        required: [true, "startDate is required"],
    },
    endDate: {
        type: String,
        required: [true, "endDate is required"],
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// filter out deleted documents
TopReStaurantSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
TopReStaurantSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
// TopReStaurantSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
//   next();
// });
exports.TopRestaurant = (0, mongoose_1.model)("TopRestaurant", TopReStaurantSchema);
