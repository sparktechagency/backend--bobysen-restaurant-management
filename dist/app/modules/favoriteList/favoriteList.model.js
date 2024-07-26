"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteList = void 0;
const mongoose_1 = require("mongoose");
const favoriteSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    menu: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Menu",
        },
    ],
    restaurants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Restaurant",
        },
    ],
}, {
    timestamps: true,
});
exports.FavoriteList = (0, mongoose_1.model)("FavouriteList", favoriteSchema);
