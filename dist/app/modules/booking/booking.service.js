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
const coins_model_1 = require("../coins/coins.model");
const notificaiton_service_1 = require("../notification/notificaiton.service");
const notification_constant_1 = require("../notification/notification.constant");
const notification_interface_1 = require("../notification/notification.interface");
const restaurant_model_1 = require("../restaurant/restaurant.model");
const table_model_1 = require("../table/table.model");
const user_model_1 = require("../user/user.model");
const booking_model_1 = require("./booking.model");
const booking_utils_1 = require("./booking.utils");
// search booking
const bookAtable = (BookingData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const payload = Object.assign({}, BookingData);
    if ((payload === null || payload === void 0 ? void 0 : payload.event) === "null")
        delete payload.event;
    if (BookingData === null || BookingData === void 0 ? void 0 : BookingData.event)
        payload["ticket"] = (0, booking_utils_1.generateBookingNumber)();
    const day = (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("dddd");
    if (Number(payload === null || payload === void 0 ? void 0 : payload.seats) > 10) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "If you want to book more than 10 seats, please contact the restaurant owner.");
    }
    const restaurant = yield restaurant_model_1.Restaurant.findById(payload === null || payload === void 0 ? void 0 : payload.restaurant);
    // check if restaurant booked or open
    const bookingTime = (0, moment_1.default)(payload.date);
    if ((payload === null || payload === void 0 ? void 0 : payload.time) === "00:00") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "The restaurant is closed at 00:00. Please select a valid time.");
    }
    // check closing and opening time
    (0, booking_utils_1.validateBookingTime)(restaurant, bookingTime);
    // check the restaurant avilable that day
    (0, booking_utils_1.checkRestaurantAvailability)(restaurant, day, payload === null || payload === void 0 ? void 0 : payload.time);
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
        time: { $lt: expireHours },
        endTime: { $gt: payload === null || payload === void 0 ? void 0 : payload.time },
    });
    // conditionally check avilable tables
    if ((bookedTables === null || bookedTables === void 0 ? void 0 : bookedTables.length) >= totalTables) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No tables avilable for booking during this time. please choose different time and seats");
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
    const data = Object.assign(Object.assign({}, payload), { date: (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("YYYY-MM-DD"), table: (_a = findTable[0]) === null || _a === void 0 ? void 0 : _a._id, endTime: (0, booking_utils_1.calculateEndTime)(payload === null || payload === void 0 ? void 0 : payload.time), restaurant: payload === null || payload === void 0 ? void 0 : payload.restaurant, id: (0, booking_utils_1.generateBookingNumber)() });
    // find user
    const user = yield user_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.user).select("fullName phoneNumber email");
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
    ];
    yield coins_model_1.Coin.findOneAndUpdate({ customer: user }, // Search condition
    { $inc: { coins: 10 } }, // Increment the coins by 10 if the document exists
    { new: true, upsert: true } // Insert if no document found, and return the updated document
    );
    // send message to the customer
    const customerSmsData = {
        phoneNumbers: [user === null || user === void 0 ? void 0 : user.phoneNumber],
        mediaUrl: "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
        bodyValues: [
            user.fullName,
            restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
            result === null || result === void 0 ? void 0 : result.date,
            result === null || result === void 0 ? void 0 : result.time,
            (_b = findTable[0]) === null || _b === void 0 ? void 0 : _b.seats,
        ],
        buttonUrl: "https://bookatable.mu",
    };
    const vendorSmsData = {
        phoneNumbers: [restaurant === null || restaurant === void 0 ? void 0 : restaurant.helpLineNumber1],
        mediaUrl: "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
        bodyValues: [
            user.fullName,
            restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
            result === null || result === void 0 ? void 0 : result.date,
            result === null || result === void 0 ? void 0 : result.time,
            (_c = findTable[0]) === null || _c === void 0 ? void 0 : _c.seats,
            user === null || user === void 0 ? void 0 : user.phoneNumber,
        ],
        buttonUrl: "https://bookatable.mu",
    };
    // await sendWhatsAppMessageToCustomers(smsData);
    // send message to the vendor
    // await sendWhatsAppMessageToCustomers(customerSmsData);
    // await sendWhatsAppMessageToVendors(vendorSmsData);
    const emailContext = {
        name: user === null || user === void 0 ? void 0 : user.fullName,
        email: user === null || user === void 0 ? void 0 : user.email,
        date: payload === null || payload === void 0 ? void 0 : payload.date,
        seats: payload === null || payload === void 0 ? void 0 : payload.seats,
        arrivalTime: payload === null || payload === void 0 ? void 0 : payload.time,
        restaurant: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
        address: restaurant === null || restaurant === void 0 ? void 0 : restaurant.address,
    };
    // await sendReservationEmail(
    //   "reservationTemplate", // The name of your template file without the .html extension
    //   user?.email,
    //   "Your Reservation was successful",
    //   emailContext
    // );
    Promise.all([
        // Send WhatsApp and SMS to customer and vendor concurrently
        yield notificaiton_service_1.notificationServices.insertNotificationIntoDb(notificationData),
        (0, booking_utils_1.sendWhatsAppMessageToCustomers)(customerSmsData),
        (0, booking_utils_1.sendWhatsAppMessageToVendors)(vendorSmsData),
        yield (0, booking_utils_1.sendReservationEmail)("reservationTemplate", // The name of your template file without the .html extension
        user === null || user === void 0 ? void 0 : user.email, "Your Reservation was successful", emailContext),
    ]);
    return result;
});
//  book a table from widget
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingModel = new QueryBuilder_1.default(booking_model_1.Booking.find().populate("user restaurant table event"), query)
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
const getAllBookingsForAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingModel = new QueryBuilder_1.default(booking_model_1.Booking.find()
        .populate({
        path: "user",
        select: "fullName", // Select only the fullname field from the user
    })
        .populate({
        path: "restaurant",
        select: "name", // Select only the name field from the restaurant
    })
        .populate({
        path: "table",
        select: "tableNo seats", // Select only the table_name field from the table
    }), query)
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
    const pipeline = [];
    // Match by event if provided in the query
    if (query === null || query === void 0 ? void 0 : query.event) {
        pipeline.push({
            $match: {
                event: new mongoose_1.default.Types.ObjectId(query.event), // Convert event to ObjectId
            },
        });
    }
    // Add lookup and unwind stages
    pipeline.push({
        $lookup: {
            from: "restaurants",
            localField: "restaurant",
            foreignField: "_id",
            as: "restaurant",
        },
    }, {
        $unwind: "$restaurant",
    }, {
        $lookup: {
            from: "tables",
            localField: "table",
            foreignField: "_id",
            as: "table",
        },
    }, {
        $unwind: "$table",
    }, {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
        },
    }, {
        $unwind: "$user",
    }, {
        $match: {
            "restaurant.owner": new mongoose_1.default.Types.ObjectId(query === null || query === void 0 ? void 0 : query.owner),
            "restaurant._id": new mongoose_1.default.Types.ObjectId(query === null || query === void 0 ? void 0 : query.restaurant),
        },
    }, {
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
            event: 1,
        },
    });
    // Add matching for additional fields except searchTerm and owner
    Object.keys(query).forEach((key) => {
        if (key !== "searchTerm" &&
            key !== "owner" &&
            key !== "event" &&
            key !== "restaurant") {
            const matchStage = {};
            matchStage[key] = query[key];
            pipeline.push({ $match: matchStage });
        }
    });
    // Match by searchTerm if provided in the query
    if (query === null || query === void 0 ? void 0 : query.searchTerm) {
        const searchRegex = new RegExp(query.searchTerm, "i");
        const searchMatchStage = {
            $or: searchAbleFields.map((field) => ({
                [field]: { $regex: searchRegex },
            })),
        };
        pipeline.push({ $match: searchMatchStage });
    }
    // Execute the pipeline
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
const getBookingStatics = (userId, year, restaurantId // Optional restaurantId
) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId, year, restaurantId);
    const monthsOfYear = Array.from({ length: 12 }, (_, i) => i + 1); // Array of month numbers from 1 to 12
    const matchStage = {
        date: {
            $gte: `${year}-01-01`,
            $lt: `${parseInt(year) + 1}-01-01`,
        },
        restaurant: { $exists: true }, // Filter out bookings without restaurant
    };
    if (restaurantId) {
        // Add restaurantId filter if provided
        matchStage.restaurant = restaurantId;
    }
    const result = yield booking_model_1.Booking.aggregate([
        {
            $match: matchStage,
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
                let: { restaurantId: { $toObjectId: "$restaurant" } }, // Convert restaurantId to ObjectId
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$restaurantId"] }, // Match restaurant by ObjectId
                                    { $eq: ["$owner", new mongoose_1.default.Types.ObjectId(userId)] }, // Match owner by ObjectId
                                    {
                                        $eq: ["$owner", new mongoose_1.default.Types.ObjectId(restaurantId)],
                                    }, // Match owner by ObjectId
                                ],
                            },
                        },
                    },
                ],
                as: "restaurantOwner",
            },
        },
        {
            $match: {
                restaurantOwner: { $ne: [] }, // Ensure that the restaurant has an owner that matches the userId
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
const bookAtableForEvent = (BookingData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign({}, BookingData);
    if ((payload === null || payload === void 0 ? void 0 : payload.event) === "null")
        delete payload.event;
    if (BookingData === null || BookingData === void 0 ? void 0 : BookingData.event)
        payload["ticket"] = (0, booking_utils_1.generateBookingNumber)();
    const day = (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("dddd");
    if (Number(payload === null || payload === void 0 ? void 0 : payload.seats) > 10) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "If you want to book more than 10 seats, please contact the restaurant owner.");
    }
    const restaurant = yield restaurant_model_1.Restaurant.findById(payload === null || payload === void 0 ? void 0 : payload.restaurant);
    // check if restaurant booked or open
    const bookingTime = (0, moment_1.default)(payload.date);
    // check closing and opening time
    (0, booking_utils_1.validateBookingTime)(restaurant, bookingTime);
    // check the restaurant avilable that day
    (0, booking_utils_1.checkRestaurantAvailability)(restaurant, day, payload === null || payload === void 0 ? void 0 : payload.time);
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
        time: { $lt: expireHours },
        endTime: { $gt: payload === null || payload === void 0 ? void 0 : payload.time },
    });
    // conditionally check avilable tables
    if ((bookedTables === null || bookedTables === void 0 ? void 0 : bookedTables.length) >= totalTables) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No tables avilable for booking during this time. please choose different time and seats");
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
    const data = Object.assign(Object.assign({}, payload), { date: (0, moment_1.default)(payload === null || payload === void 0 ? void 0 : payload.date).format("YYYY-MM-DD"), table: (_a = findTable[0]) === null || _a === void 0 ? void 0 : _a._id, endTime: (0, booking_utils_1.calculateEndTime)(payload === null || payload === void 0 ? void 0 : payload.time), restaurant: payload === null || payload === void 0 ? void 0 : payload.restaurant, id: (0, booking_utils_1.generateBookingNumber)() });
    // find user
    const user = yield user_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.user).select("fullName phoneNumber email");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield booking_model_1.Unpaidbooking.create(data);
    // const notificationData = [
    //   {
    //     receiver: payload?.user,
    //     message: messages.booking,
    //     refference: result?._id,
    //     model_type: modeType.Booking,
    //   },
    // ];
    // await Coin.findOneAndUpdate(
    //   { customer: user }, // Search condition
    //   { $inc: { coins: 10 } }, // Increment the coins by 10 if the document exists
    //   { new: true, upsert: true } // Insert if no document found, and return the updated document
    // );
    // send message to the customer
    // const customerSmsData = {
    //   phoneNumbers: [`+230${user?.phoneNumber}`],
    //   mediaUrl:
    //     "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
    //   bodyValues: [
    //     user.fullName,
    //     restaurant?.name,
    //     result?.date,
    //     result?.time,
    //     findTable[0]?.seats,
    //   ],
    //   buttonUrl: "https://bookatable.mu",
    // };
    // const vendorSmsData = {
    //   phoneNumbers: [`+230${restaurant?.helpLineNumber1}`],
    //   mediaUrl:
    //     "https://bookatable.mu/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.71060dcf.png&w=640&q=75",
    //   bodyValues: [
    //     user.fullName,
    //     restaurant?.name,
    //     result?.date,
    //     result?.time,
    //     findTable[0]?.seats,
    //   ],
    //   buttonUrl: "https://bookatable.mu",
    // };
    // await sendWhatsAppMessageToCustomers(smsData);
    // send message to the vendor
    // await notificationServices.insertNotificationIntoDb(notificationData);
    // await sendWhatsAppMessageToCustomers(customerSmsData);
    // await sendWhatsAppMessageToVendors(vendorSmsData);
    const emailContext = {
        name: user === null || user === void 0 ? void 0 : user.fullName,
        email: user === null || user === void 0 ? void 0 : user.email,
        date: payload === null || payload === void 0 ? void 0 : payload.date,
        seats: payload === null || payload === void 0 ? void 0 : payload.seats,
        arrivalTime: payload === null || payload === void 0 ? void 0 : payload.time,
        restaurant: restaurant === null || restaurant === void 0 ? void 0 : restaurant.name,
        address: restaurant === null || restaurant === void 0 ? void 0 : restaurant.address,
    };
    // await sendReservationEmail(
    //   "reservationTemplate", // The name of your template file without the .html extension
    //   user?.email,
    //   "Your Reservation was successful",
    //   emailContext
    // );
    // return result;
    return result;
});
const getSingleUnpaiEventBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.Unpaidbooking.findById(id)
        .populate({
        path: "table",
        select: "tableNo seats",
    })
        .populate({
        path: "event",
        select: "title entryFee",
    });
    return result;
});
exports.bookingServies = {
    bookAtable,
    getAllBookings,
    getAllBookingByOwner,
    getSingleBooking,
    updateBooking,
    getBookingDetailsWithMenuOrder,
    getAllBookingsForAdmin,
    deletebooking,
    getBookingStatics,
    bookAtableForEvent,
    getSingleUnpaiEventBooking,
};
