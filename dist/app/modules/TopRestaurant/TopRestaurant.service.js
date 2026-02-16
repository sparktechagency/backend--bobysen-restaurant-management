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
exports.topRestaurantServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const restaurant_model_1 = require("../restaurant/restaurant.model");
const TopRestaurant_model_1 = require("./TopRestaurant.model");
const topRestaurant_constant_1 = require("./topRestaurant.constant");
const insertTopRestaurantIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurant, startDate, endDate } = payload;
    if ((0, moment_1.default)(endDate).isSameOrBefore(startDate)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "The end date must be later than the start date. Please select a valid end date.");
    }
    const findTopRestaurant = yield TopRestaurant_model_1.TopRestaurant.findOne({ restaurant });
    if (findTopRestaurant) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "This Restaurant already in the list");
    }
    // get location field
    const getLocation = yield restaurant_model_1.Restaurant.findById(restaurant).select("location");
    const result = yield TopRestaurant_model_1.TopRestaurant.create(Object.assign(Object.assign({}, payload), { location: getLocation === null || getLocation === void 0 ? void 0 : getLocation.location }));
    return result;
});
const getSingleTopRestaurant = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_model_1.TopRestaurant.findById(id).populate("restaurant");
    return result;
});
const updateTopRestaurant = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_model_1.TopRestaurant.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteTopRestaurantFromList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_model_1.TopRestaurant.findByIdAndDelete(id);
    return result;
});
const getAllTopRestaurants = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pipeline = [];
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    if ((query === null || query === void 0 ? void 0 : query.latitude) && (query === null || query === void 0 ? void 0 : query.longitude)) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [
                        parseFloat(query === null || query === void 0 ? void 0 : query.longitude),
                        parseFloat(query === null || query === void 0 ? void 0 : query.latitude),
                    ],
                },
                key: "location",
                query: {},
                maxDistance: parseFloat((_a = query === null || query === void 0 ? void 0 : query.maxDistance) !== null && _a !== void 0 ? _a : 10000) * 1609,
                distanceField: "dist.calculated",
                spherical: true,
            },
        });
    }
    pipeline.push({
        $match: {
            isExpired: false,
            isDeleted: false,
        },
    }, {
        $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
        },
    }, { $unwind: "$restaurant" });
    // Dynamic search
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        pipeline.push({
            $match: {
                $or: topRestaurant_constant_1.topRestaurantSearchableFileds.map((field) => ({
                    [field]: { $regex: query.searchTerm, $options: "i" },
                })),
            },
        });
    }
    // Category filter (with ObjectId validation)
    if ((query === null || query === void 0 ? void 0 : query.category) && query.category !== "null" && query.category !== "") {
        try {
            const catId = new mongoose_1.default.Types.ObjectId(query.category);
            pipeline.push({
                $match: { "restaurant.category": catId },
            });
        }
        catch (e) {
            pipeline.push({ $match: { _id: null } });
        }
    }
    // Dynamic filter stage, but exclude 'category' to avoid double filtering
    const filterConditions = Object.fromEntries(Object.entries(query).filter(([key]) => !topRestaurant_constant_1.topRestaurantExcludeFileds.includes(key) && key !== "category"));
    if (Object.keys(filterConditions).length > 0) {
        pipeline.push({
            $match: filterConditions,
        });
    }
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    // Fetch the data
    const data = yield TopRestaurant_model_1.TopRestaurant.aggregate(pipeline);
    // Fetch the total count for pagination meta
    const total = yield TopRestaurant_model_1.TopRestaurant.countDocuments({
        isExpired: false,
        isDeleted: false,
    });
    const totalPage = Math.ceil(total / limit);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
    };
});
const getAllTopRestaurantForTable = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pipeline = [];
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    // GeoNear stage (optional, if needed)
    if ((query === null || query === void 0 ? void 0 : query.latitude) && (query === null || query === void 0 ? void 0 : query.longitude)) {
        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [
                        parseFloat(query === null || query === void 0 ? void 0 : query.longitude),
                        parseFloat(query === null || query === void 0 ? void 0 : query.latitude),
                    ],
                },
                key: "location",
                maxDistance: parseFloat((_a = query === null || query === void 0 ? void 0 : query.maxDistance) !== null && _a !== void 0 ? _a : 10000) * 1609,
                distanceField: "dist.calculated",
                spherical: true,
            },
        });
    }
    // Match valid top restaurants
    pipeline.push({
        $match: {
            isExpired: false,
            isDeleted: false,
        },
    });
    // Lookup to fetch restaurant data
    pipeline.push({
        $lookup: {
            from: "restaurants", // Name of the restaurant collection
            localField: "restaurant", // Field in TopRestaurant referencing Restaurant
            foreignField: "_id", // Field in Restaurant that matches the reference
            as: "restaurantData",
        },
    });
    // Unwind the restaurant data to flatten it
    pipeline.push({
        $unwind: "$restaurantData",
    });
    // Replace root to return only restaurant data
    pipeline.push({
        $replaceRoot: {
            newRoot: "$restaurantData",
        },
    });
    // Dynamic search on restaurant fields
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        pipeline.push({
            $match: {
                $or: topRestaurant_constant_1.topRestaurantSearchableFileds.map((field) => ({
                    [field]: { $regex: query.searchTerm, $options: "i" },
                })),
            },
        });
    }
    // Dynamic filters for restaurant fields
    const filterConditions = Object.fromEntries(Object.entries(query).filter(([key]) => !topRestaurant_constant_1.topRestaurantSearchableFileds.includes(key)));
    if (Object.keys(filterConditions).length > 0) {
        pipeline.push({
            $match: filterConditions,
        });
    }
    // Add pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    // Fetch the data
    const data = yield TopRestaurant_model_1.TopRestaurant.aggregate(pipeline);
    // Fetch the total count for pagination meta
    const total = yield TopRestaurant_model_1.TopRestaurant.countDocuments({
        isExpired: false,
        isDeleted: false,
    });
    const totalPage = Math.ceil(total / limit);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
    };
});
exports.topRestaurantServices = {
    insertTopRestaurantIntoDb,
    getAllTopRestaurants,
    getSingleTopRestaurant,
    updateTopRestaurant,
    deleteTopRestaurantFromList,
    getAllTopRestaurantForTable,
};
