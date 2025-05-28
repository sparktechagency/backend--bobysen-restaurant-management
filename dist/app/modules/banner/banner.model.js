"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema based on the Ibanner interface
const bannerSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        // autopopulate: true, // Automatically populate restaurant when creating a new banner
    },
}, { timestamps: true });
// Create the Mongoose model from the schema
const Banner = (0, mongoose_1.model)("Banner", bannerSchema);
exports.default = Banner;
