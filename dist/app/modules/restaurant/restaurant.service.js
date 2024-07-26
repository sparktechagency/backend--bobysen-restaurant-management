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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const restaurant_constant_1 = require("./restaurant.constant");
const restaurant_model_1 = require("./restaurant.model");
const insertRestaurantIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.Restaurant.create(payload);
    return result;
});
const getAllRestaurant = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.Restaurant.aggregate([
        {
            $match: {
                owner: new mongoose_1.default.Types.ObjectId(query.owner),
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
        {
            $lookup: {
                from: "menus",
                localField: "_id",
                foreignField: "restaurant",
                as: "menus",
            },
        },
        {
            $project: {
                name: 1,
                location: 1,
                tables: { $size: "$tables" }, // Count total tables
                menus: { $size: "$menus" },
                address: 1, // Count total menus
            },
        },
    ]);
    return result;
});
// get all restaurants for phone
// const getAllRestaurantsForUser = async (query: Record<string, any>) => {
//   const RestaurantModel = new QueryBuilder(Restaurant.find(), query)
//     .search(["name"])
//     .filter()
//     .fields()
//     .sort()
//     .paginate();
//   const data = await RestaurantModel.modelQuery;
//   const meta = await RestaurantModel.countTotal();
//   return { data, meta };
// };
const getAllRestaurantsForUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    // Add geospatial stage if latitude and longitude are provided
    if ((query === null || query === void 0 ? void 0 : query.latitude) && (query === null || query === void 0 ? void 0 : query.longitude)) {
        console.log("hitted");
        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [
                        parseFloat(query === null || query === void 0 ? void 0 : query.longitude),
                        parseFloat(query === null || query === void 0 ? void 0 : query.latitude),
                    ],
                    // coordinates: [90.42308159679541, 23.77634120911962],
                },
                key: "location",
                // query: {},
                maxDistance: parseFloat(10000) * 1609,
                distanceField: "dist.calculated",
                spherical: true,
            },
        });
    }
    // search term
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        pipeline.push({
            $match: {
                $or: restaurant_constant_1.RessearchAbleFields.map((field) => ({
                    [field]: { $regex: query.searchTerm, $options: "i" },
                })),
            },
        });
    }
    // // get all current restaurant as well
    pipeline.push({
        $match: {
            isDeleted: false,
        },
    });
    // console.log(pipeline);
    // // Dynamic filter stage
    const filterConditions = Object.fromEntries(Object.entries(query).filter(([key]) => !restaurant_constant_1.restaurantExcludeFields.includes(key)));
    if (Object.keys(filterConditions).length > 0) {
        pipeline.push({
            $match: filterConditions,
        });
    }
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    // Fetch the data
    const data = yield restaurant_model_1.Restaurant.aggregate(pipeline);
    // Fetch the total count for pagination meta
    const total = yield restaurant_model_1.Restaurant.countDocuments(data);
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
const getSingleRestaurant = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.Restaurant.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "users", // Assuming the owner collection name is "owners"
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] },
            },
        },
        {
            $project: {
                close: 1,
                avgReviews: 1,
                _id: 1,
                name: 1,
                location: 1,
                description: 1,
                status: 1,
                helpLineNumber1: 1,
                helpLineNumber2: 1,
                images: 1,
                reviewStatus: 1,
                map: 1,
                days: {
                    $map: {
                        input: [
                            { day: "sunday", times: "$sunday" },
                            { day: "monday", times: "$monday" },
                            { day: "tuesday", times: "$tuesday" },
                            { day: "wednesday", times: "$wednesday" },
                            { day: "thursday", times: "$thursday" },
                            { day: "friday", times: "$friday" },
                            { day: "saturday", times: "$saturday" },
                        ],
                        as: "day",
                        in: {
                            day: "$$day.day",
                            openingTime: { $ifNull: ["$$day.times.openingTime", "N/A"] },
                            closingTime: { $ifNull: ["$$day.times.closingTime", "N/A"] },
                        },
                    },
                },
            },
        },
    ]);
    return result[0]; // Return the first document from the aggregation result
});
// update restaurant here
const getSingleRestaurantForOwner = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.Restaurant.findById(id).populate("owner");
    return result;
});
const deleteRestaurant = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_model_1.Restaurant.findByIdAndUpdate(id, {
        isDeleted: true,
    }, { new: true });
    return result;
});
const updateRestaurant = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { images } = payload, update = __rest(payload, ["images"]);
    const result = yield restaurant_model_1.Restaurant.findByIdAndUpdate(id, Object.assign({ $push: {
            images: {
                $each: images,
            },
        } }, update), { new: true });
    return result;
});
// common function for delete files from restaurants
const deleteFiles = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId, imageId } = payload;
    const result = yield restaurant_model_1.Restaurant.findByIdAndUpdate(restaurantId, {
        $pull: {
            images: {
                _id: imageId,
            },
        },
    }, { new: true });
    return result;
});
const getAllRestaurantForAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $addFields: {
                formattedDate: {
                    $dateToString: {
                        format: "%Y-%m-%d", // specify the desired format
                        date: "$createdAt", // the date field you want to format
                    },
                },
            },
        },
        {
            $project: {
                name: 1,
                owner: "$owner.fullName",
                email: "$owner.email",
                location: 1,
                createdAt: "$formattedDate",
                status: 1,
            },
        },
    ];
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i");
        const searchMatchStage = {
            $or: restaurant_constant_1.RessearchAbleFields.map((field) => ({
                [field]: { $regex: searchRegex },
            })),
        };
        pipeline.push({ $match: searchMatchStage });
    }
    const result = yield restaurant_model_1.Restaurant.aggregate(pipeline);
    return result;
});
const nearByRestaurant = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const pipeline: PipelineStage[] = [];
    const { maxDistance = 10000, longitude, latitude } = query;
    // If geospatial data is provided, add $geoNear stage
    const pipeline = [
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    // coordinates: [90.42308159679541, 23.77634120911962],
                },
                key: "location",
                maxDistance: parseFloat(maxDistance) * 1609,
                distanceField: "dist.calculated",
                spherical: true,
            },
        },
    ];
    // If searchTerm is provided, add $match stage for name search
    // if (query?.searchTerm) {
    //   pipeline.push({
    //     $match: {
    //       name: new RegExp(query?.searchTerm, "i"), // Case-insensitive regex search
    //     },
    //   });
    // }
    const result = yield restaurant_model_1.Restaurant.aggregate(pipeline);
    console.log(result);
    return result;
});
exports.restaurantServices = {
    insertRestaurantIntoDb,
    updateRestaurant,
    getSingleRestaurantForOwner,
    getAllRestaurant,
    getAllRestaurantsForUser,
    getSingleRestaurant,
    deleteRestaurant,
    getAllRestaurantForAdmin,
    deleteFiles,
    nearByRestaurant,
};
