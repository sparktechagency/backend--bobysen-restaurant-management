"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
    tableNo: {
        type: String,
        required: [true, "table no is requried"],
        // unique: true,
    },
    tableName: {
        type: String,
        default: "",
    },
    seats: {
        type: Number,
        required: [true, "total seat is required"],
    },
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, "restaurant id is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
tableSchema.statics.isUniqueTable = function (id, tableNo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.Table.findOne({ restaurant: id, tableNo: tableNo });
    });
};
// filter out deleted documents
tableSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
tableSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
tableSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Table = (0, mongoose_1.model)("Table", tableSchema);
