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
exports.reviewServices = exports.menuServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const fileHelper_1 = require("../../utils/fileHelper");
const booking_model_1 = require("../booking/booking.model");
const restaurant_model_1 = require("../restaurant/restaurant.model");
const menu_model_1 = require("./menu.model");
const insertMenuIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menu_model_1.Menu.create(payload);
    return result;
});
const getAllMenu = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(query);
    const MenuModel = new QueryBuilder_1.default(menu_model_1.Menu.find(), query)
        .search(["name"])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield MenuModel.modelQuery;
    const meta = yield MenuModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSingleMenu = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menu_model_1.Menu.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "favouritelists",
                let: { menuId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$user", new mongoose_1.default.Types.ObjectId(userId)] },
                                    { $in: ["$$menuId", "$menu"] },
                                ],
                            },
                        },
                    },
                    {
                        $project: { _id: 0 },
                    },
                ],
                as: "isFavourite",
            },
        },
        {
            $addFields: {
                isFavourite: {
                    $cond: {
                        if: { $gt: [{ $size: "$isFavourite" }, 0] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        // Project all fields from the Menu collection
        {
            $project: {
                _id: 1,
                category: 1,
                image: 1,
                restaurant: 1,
                description: 1,
                name: 1,
                price: 1,
                owner: 1,
                available: 1,
                isDeleted: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                isFavourite: 1,
            },
        },
    ]);
    return result[0] ? result[0] : {};
});
// get all menu for vendor
const getAllTablesForOwner = (userId) => __awaiter(void 0, void 0, void 0, function* () {
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
                from: "menus",
                localField: "_id",
                foreignField: "restaurant",
                as: "menus",
            },
        },
    ]);
    return result[0];
});
// update menu here
const updateMenu = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findMenu = yield menu_model_1.Menu.findById(id);
    const result = yield menu_model_1.Menu.findByIdAndUpdate(id, payload, { new: true });
    if ((payload === null || payload === void 0 ? void 0 : payload.image) && result) {
        yield (0, fileHelper_1.deleteFile)(findMenu === null || findMenu === void 0 ? void 0 : findMenu.image);
    }
    return result;
});
const deleteMenu = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menu_model_1.Menu.findByIdAndUpdate(id, {
        isDeleted: true,
    }, { new: true });
    return result;
});
// get Reivew
const insertReviewIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.booking, {
            isReviewed: true,
        }, { session });
        if (!updateBooking) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Something went wrong.");
        }
        const review = yield menu_model_1.Review.create([payload], { session });
        if (!review[0]) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Something went wrong. Please try again");
        }
        const restaurantId = (_a = review[0]) === null || _a === void 0 ? void 0 : _a.restaurant;
        // Perform aggregation and update outside the transaction
        const pipeline = [
            { $match: { restaurant: restaurantId } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                },
            },
        ];
        const result = yield menu_model_1.Review.aggregate(pipeline);
        console.log(result);
        if (result.length > 0) {
            const { avgRating } = result[0];
            const submit = yield restaurant_model_1.Restaurant.updateOne({ _id: restaurantId }, { avgReviews: avgRating });
            console.log(submit);
        }
        yield session.commitTransaction();
        yield session.endSession();
        return review[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getAllReviews = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $match: {
                restaurant: new mongoose_1.default.Types.ObjectId(restaurantId.toString()),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
            },
        },
        {
            $unwind: "$userDetails",
        },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
                reviews: {
                    $push: {
                        rating: "$rating",
                        comment: "$comment",
                        user: {
                            name: "$userDetails.fullName",
                            image: "$userDetails.image",
                        },
                    },
                },
            },
        },
        {
            $sort: { _id: 1 },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$count" },
                ratings: {
                    $push: {
                        rating: "$_id",
                        count: "$count",
                        reviews: "$reviews",
                    },
                },
            },
        },
        {
            $unwind: "$ratings",
        },
        {
            $addFields: {
                "ratings.avg": {
                    $multiply: [
                        {
                            $divide: ["$ratings.count", "$total"],
                        },
                        100,
                    ],
                },
            },
        },
        {
            $group: {
                _id: null,
                total: { $first: "$total" },
                ratingOverview: {
                    $push: {
                        k: { $concat: [{ $toString: "$ratings.rating" }, "star"] },
                        v: {
                            count: "$ratings.count",
                            avg: "$ratings.avg",
                        },
                    },
                },
                reviews: { $push: "$ratings.reviews" },
            },
        },
        {
            $project: {
                _id: 0,
                ratingOverview: { $arrayToObject: "$ratingOverview" },
                reviews: {
                    $reduce: {
                        input: "$reviews",
                        initialValue: [],
                        in: { $concatArrays: ["$$value", "$$this"] },
                    },
                },
            },
        },
    ];
    const result = yield menu_model_1.Review.aggregate(pipeline);
    return result[0];
});
exports.menuServices = {
    insertMenuIntoDb,
    getAllMenu,
    getSingleMenu,
    getAllTablesForOwner,
    updateMenu,
    deleteMenu,
};
exports.reviewServices = {
    insertReviewIntoDb,
    getAllReviews,
};
