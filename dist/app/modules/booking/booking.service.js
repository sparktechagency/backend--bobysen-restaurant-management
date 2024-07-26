"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.bookingServies = void 0;
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importStar(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const notificaiton_service_1 = require("../notification/notificaiton.service");
const notification_constant_1 = require("../notification/notification.constant");
const notification_interface_1 = require("../notification/notification.interface");
const restaurant_model_1 = require("../restaurant/restaurant.model");
const table_model_1 = require("../table/table.model");
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("./booking.model");
const booking_utils_1 = require("./booking.utils");
// search booking
const bookAtable = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const day = (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("dddd");
    if (Number(payload === null || payload === void 0 ? void 0 : payload.seats) > 10) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "If you want to book more than 10 seats, please contact the restaurant owner.");
    }
    const restaurant = yield restaurant_model_1.Restaurant.findById(payload === null || payload === void 0 ? void 0 : payload.restaurant);
    // check if restaurant booked or open
    const bookingTime = (0, moment_1.default)(payload.date);
    const isClosed = bookingTime.isBetween((0, moment_1.default)((_a = restaurant === null || restaurant === void 0 ? void 0 : restaurant.close) === null || _a === void 0 ? void 0 : _a.from), (0, moment_1.default)((_b = restaurant === null || restaurant === void 0 ? void 0 : restaurant.close) === null || _b === void 0 ? void 0 : _b.to), undefined, "[]");
    if (isClosed) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Restaurant is closed during this time. Please select another date.");
    }
    // check the restaurant avilable that day
    const { openingTime, closingTime } = restaurant[day === null || day === void 0 ? void 0 : day.toLocaleLowerCase()];
    if ((0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.time, "HH:mm").isBefore((0, moment_1.default)(openingTime, "HH:mm")) ||
        (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.time, "HH:mm").isAfter((0, moment_1.default)(closingTime, "HH:mm"))) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, `Restaurant is closed at ${payload.time} on ${day}`);
    }
    // retrive total tables under the restaurant
    const totalTables = yield table_model_1.Table.find({
        restaurant: payload.restaurant,
        seats: Number(payload.seats),
    }).countDocuments();
    const expireHours = (0, booking_utils_1.calculateEndTime)(payload === null || payload === void 0 ? void 0 : payload.time);
    // retrive book tables
    const bookedTables = yield booking_model_1.Booking.find({
        date: (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("YYYY-MM-DD"),
        restaurant: payload === null || payload === void 0 ? void 0 : payload.restaurant,
        status: "active",
        arrivalTime: { $lt: expireHours },
        endTime: { $gt: payload === null || payload === void 0 ? void 0 : payload.time },
    }).populate("restaurant");
    console.log(bookedTables, "bookedtables");
    // conditionally check avilable tables
    if ((bookedTables === null || bookedTables === void 0 ? void 0 : bookedTables.length) >= totalTables) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No tables avilable for booking during this date");
    }
    const findTable = yield table_model_1.Table.aggregate([
        {
            $match: {
                restaurant: new mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.restaurant),
                seats: Number(payload === null || payload === void 0 ? void 0 : payload.seats),
            },
        },
        {
            $limit: 1,
        },
    ]);
    if (!findTable[0]) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "We couldn't find any tables with the required number of seats.  Please contact with  the restaurant owner");
    }
    //
    const data = Object.assign(Object.assign({}, payload), { date: (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("YYYY-MM-DD"), table: (_c = findTable[0]) === null || _c === void 0 ? void 0 : _c._id, endTime: (0, booking_utils_1.calculateEndTime)(payload === null || payload === void 0 ? void 0 : payload.time), restaurant: payload === null || payload === void 0 ? void 0 : payload.restaurant, id: (0, booking_utils_1.generateBookingNumber)() });
    // find user
    const user = yield user_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.user).select("fullName phoneNumber");
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield booking_model_1.Booking.create(data);
    const notificationData = [
        {
            receiver: payload === null || payload === void 0 ? void 0 : payload.user,
            message: notification_constant_1.messages.booking,
            refference: result === null || result === void 0 ? void 0 : result._id,
            model_type: notification_interface_1.modeType.Booking,
        },
        // {
        //   receiver: bookedTables[0]?.restaurant?.owner,
        //   message: messages.bookingForOwner,
        //   description: `Date:${moment(payload?.date).format(
        //     "YYYY-MM-DD HH:mm a"
        //   )},TableNo:${findTable[0]?.tableNo},Seats:${findTable[0]?.seats}`,
        //   refference: result?._id,
        //   model_type: modeType.Booking,
        // },
    ];
    // send message to the customer
    yield (0, booking_utils_1.sendMessageToNumber)(user === null || user === void 0 ? void 0 : user.phoneNumber, `Hello ${user.fullName}, your table reservation at ${restaurant === null || restaurant === void 0 ? void 0 : restaurant.name}, has been successfully confirmed for ${result === null || result === void 0 ? void 0 : result.date} at ${result === null || result === void 0 ? void 0 : result.time}. We look forward to hosting you for ${(_d = findTable[0]) === null || _d === void 0 ? void 0 : _d.seats}  guests. Please arrive within your designated time to ensure your reservation remains valid. Thank you!`);
    // send message to the vendor
    yield (0, booking_utils_1.sendMessageToNumber)(user === null || user === void 0 ? void 0 : user.phoneNumber, `Hello, a customer named ${user.fullName} has booked a table at your restaurant, ${restaurant === null || restaurant === void 0 ? void 0 : restaurant.name}, for ${result === null || result === void 0 ? void 0 : result.date} at ${result === null || result === void 0 ? void 0 : result.time}. They plan to bring ${(_e = findTable[0]) === null || _e === void 0 ? void 0 : _e.seats} guests. Please note their contact number: ${user.phoneNumber}. We look forward to welcoming them. Thank you!`);
    yield notificaiton_service_1.notificationServices.insertNotificationIntoDb(notificationData);
    return result;
});
// const bookTable = async (payload: TBook) => {
// };
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingModel = new QueryBuilder_1.default(booking_model_1.Booking.find().populate("user restaurant table"), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield bookingModel.modelQuery;
    const meta = yield bookingModel.countTotal();
    return {
        data,
        meta,
    };
});
const getAllBookingByOwner = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchAbleFields = ["userName", "id", "email"];
    const pipeline = [
        {
            $lookup: {
                from: "restaurants",
                localField: "restaurant",
                foreignField: "_id",
                as: "restaurant",
            },
        },
        {
            $unwind: "$restaurant",
        },
        {
            $lookup: {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "table",
            },
        },
        {
            $unwind: "$table",
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $match: {
                "restaurant.owner": new mongoose_1.default.Types.ObjectId(query === null || query === void 0 ? void 0 : query.owner),
            },
        },
        {
            $project: {
                userName: "$user.fullName",
                email: "$user.email",
                id: "$id",
                status: "$status",
                date: "$date",
                time: "$time",
                tableId: "$table._id",
                tableName: "$table.tableName",
                tableNo: "$table.tableNo",
                seats: "$table.seats",
                restaurantName: "$restaurant.name",
            },
        },
    ];
    Object.keys(query).forEach((key) => {
        if (key !== "searchTerm" && key !== "owner") {
            console.log(key);
            const matchStage = {};
            matchStage[key] = query[key];
            console.log(query);
            pipeline.push({ $match: matchStage });
        }
    });
    // searchterm
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i");
        const searchMatchStage = {
            $or: searchAbleFields.map((field) => ({
                [field]: { $regex: searchRegex },
            })),
        };
        pipeline.push({ $match: searchMatchStage });
    }
    // project
    pipeline.push();
    const result = yield booking_model_1.Booking.aggregate(pipeline);
    return result;
});
const getSingleBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id.toString()) } },
        {
            $lookup: {
                from: "tables",
                localField: "table",
                foreignField: "_id",
                as: "tableDetails",
            },
        },
        {
            $lookup: {
                from: "reviews",
                let: { bookingId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$booking", "$$bookingId"] } } },
                    { $limit: 1 },
                ],
                as: "reviewDetails",
            },
        },
        {
            $addFields: {
                isReview: {
                    $cond: {
                        if: { $gt: [{ $size: "$reviewDetails" }, 0] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                _id: 1,
                date: 1,
                time: 1,
                status: 1,
                table: { $arrayElemAt: ["$tableDetails", 0] },
                isReview: 1,
            },
        },
    ]);
    return result;
});
const getBookingDetailsWithMenuOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.aggregate([
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "tables",
                foreignField: "_id",
                localField: "table",
                as: "table",
            },
        },
        {
            $unwind: "$table",
        },
    ]);
    return result;
});
const updateBooking = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    let message;
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, payload, { new: true });
    if ((payload === null || payload === void 0 ? void 0 : payload.status) === "cancelled") {
        message = notification_constant_1.messages.cancelled;
        const notificationData = [
            {
                receiver: result === null || result === void 0 ? void 0 : result.user,
                message,
                refference: result === null || result === void 0 ? void 0 : result._id,
                model_type: notification_interface_1.modeType.Booking,
            },
        ];
        yield notificaiton_service_1.notificationServices.insertNotificationIntoDb(notificationData);
    }
    return result;
});
const deletebooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Booking.findByIdAndDelete(id);
    return result;
});
const getBookingStatics = (userId, year) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("service", userId, year);
    const monthsOfYear = Array.from({ length: 12 }, (_, i) => i + 1); // Array of month numbers from 1 to 12
    const result = yield booking_model_1.Booking.aggregate([
        {
            $match: {
                date: {
                    $gte: `${year}-01-01`,
                    $lt: `${year + 1}-01-01`,
                },
                restaurant: { $exists: true }, // Filter out bookings without restaurant
            },
        },
        {
            $addFields: {
                dateObj: {
                    $dateFromString: { dateString: "$date", format: "%Y-%m-%d" },
                },
            },
        },
        {
            $lookup: {
                from: "restaurants",
                let: { restaurantId: "$restaurant" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$restaurantId"] },
                                    { $eq: ["$owner", new mongoose_1.default.Types.ObjectId(userId)] },
                                ],
                            },
                        },
                    },
                ],
                as: "restaurantOwner",
            },
        },
        {
            $group: {
                _id: { $month: "$dateObj" },
                totalBooking: { $sum: 1 },
            },
        },
        {
            $project: {
                month: {
                    $dateToString: {
                        format: "%b", // Use %b for abbreviated month name
                        date: {
                            $dateFromParts: { year: Number(year), month: "$_id", day: 1 },
                        },
                    },
                },
                totalBooking: 1,
                _id: 0,
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
    // Merge with monthsOfYear array to include all months in the result
    const finalResult = monthsOfYear.map((month) => {
        const match = result.find((item) => item.month ===
            new Date(`${year}-${month}-01`).toLocaleString("en", { month: "short" }));
        return {
            month: new Date(`${year}-${month}-01`).toLocaleString("en", {
                month: "short",
            }),
            totalBooking: match ? match.totalBooking : 0,
        };
    });
    return finalResult;
});
exports.bookingServies = {
    bookAtable,
    getAllBookings,
    getAllBookingByOwner,
    getSingleBooking,
    updateBooking,
    getBookingDetailsWithMenuOrder,
    deletebooking,
    getBookingStatics,
};
