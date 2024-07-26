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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const table_model_1 = require("./table.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const restaurant_model_1 = require("../restaurant/restaurant.model");
const mongoose_1 = __importDefault(require("mongoose"));
const insertTableIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUniqueTableNo = yield table_model_1.Table.isUniqueTable(payload === null || payload === void 0 ? void 0 : payload.restaurant, payload === null || payload === void 0 ? void 0 : payload.tableNo);
    if (isUniqueTableNo) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Table no should be unique.");
    }
    const result = yield table_model_1.Table.create(payload);
    return result;
});
const getAllTables = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tableModel = new QueryBuilder_1.default(table_model_1.Table.find().populate("restaurant"), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield tableModel.modelQuery;
    const meta = yield tableModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSingleTable = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield table_model_1.Table.findById(id).populate("restaurant");
    return result;
});
const getAllTablesForVendor = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.Restaurant.aggregate([
        {
            $match: {
                owner: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        {
            $project: {
                _id: 1,
            },
        },
        {
            $lookup: {
                from: "tables",
                localField: "_id",
                foreignField: "restaurant",
                as: "tables",
            },
        },
    ]);
    return result[0];
});
const updateTable = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield table_model_1.Table.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.tableServices = {
    insertTableIntoDB,
    getAllTables,
    getSingleTable,
    getAllTablesForVendor,
    updateTable,
};
