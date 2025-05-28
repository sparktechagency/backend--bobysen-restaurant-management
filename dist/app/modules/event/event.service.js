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
exports.eventsServices = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importStar(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const booking_model_1 = require("../booking/booking.model");
const event_model_1 = require("./event.model");
const insertEventIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_model_1.Event.create(payload);
    return result;
});
const getAllEvents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const eventModel = new QueryBuilder_1.default(event_model_1.Event.find().populate({ path: "restaurant", select: "name address" }), query)
        .filter()
        .search([])
        .fields()
        .paginate()
        .sort();
    const data = yield eventModel.modelQuery;
    const meta = yield eventModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSingleEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_model_1.Event.findById(id).populate("restaurant");
    return result;
});
const updateEvent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_model_1.Event.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const geteventForVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield event_model_1.Event.aggregate([
        {
            $lookup: {
                from: "restaurants", // The collection name for restaurants
                localField: "restaurant", // The field in Event that references the restaurant
                foreignField: "_id", // The _id field in the restaurant collection
                as: "restaurantDetails", // The field where the joined data will be stored
            },
        },
        {
            // Unwind the joined data (since it's an array after $lookup)
            $unwind: "$restaurantDetails",
        },
        {
            // Match the events where the vendor inside the restaurant matches the provided vendorId
            $match: {
                "restaurantDetails.vendor": new mongoose_1.Schema.Types.ObjectId(vendorId), // Match vendorId
            },
        },
        {
            // Optionally, project only the fields you want to return
            $project: {
                _id: 1, // Event ID
                title: 1, // Event name
                image: 1, // Event date
                date: 1,
                "restaurantDetails.name": 1, // Restaurant name
                "restaurantDetails.vendor": 1, // Restaurant vendor
            },
        },
    ]);
    return events;
});
const loadPaymentZoneForEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { unpaidBooking, user, token } = payload, others = __rest(payload, ["unpaidBooking", "user", "token"]);
    const data = Object.assign(Object.assign({}, others), { additional_params: [
            {
                param_name: "user",
                param_value: user,
            },
            {
                param_name: "token",
                param_value: token,
            },
            {
                param_name: "unpaidBooking",
                param_value: unpaidBooking,
            },
            {
                param_name: "type",
                param_value: "event",
            },
        ], request_mode: "simple", touchpoint: "native_app" });
    let response;
    const headers = {
        "content-type": "application/json",
        Authorization: "Basic " +
            Buffer.from("datamation_8a9ft5:kqK1hvT5Mhwu7t0KavYaJctDW5M8xruW").toString("base64"),
    };
    const authObj = {
        authentify: {
            id_merchant: config_1.default.payment.id_merchant,
            id_entity: config_1.default.payment.id_entity,
            id_operator: config_1.default.payment.id_operator,
            operator_password: config_1.default.payment.operator_password,
        },
    };
    try {
        response = yield axios_1.default.post(config_1.default.payment.load_payment_zone, Object.assign(Object.assign({}, authObj), data), {
            headers: headers,
        });
        // Handle the response data as needed
    }
    catch (error) {
        throw new Error(error);
        // Handle the error
    }
    return (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.answer;
});
const makePaymentForEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //  first of all post a booking
        const bookAtable = yield booking_model_1.Booking.create([payload], { session });
        if (!bookAtable[0]) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Event not booked");
        }
        // data format for event
        const data = {
            user: payload === null || payload === void 0 ? void 0 : payload.user,
            event: payload === null || payload === void 0 ? void 0 : payload.event,
            booking: (_a = bookAtable[0]) === null || _a === void 0 ? void 0 : _a._id,
            transactionId: payload === null || payload === void 0 ? void 0 : payload.transactionId,
            amount: Number(payload === null || payload === void 0 ? void 0 : payload.amount),
        };
        // insert payment information to the eventpayment model
        const insertEventPayment = yield event_model_1.EventPayment.create([data], { session });
        if (!insertEventPayment[0]) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "payment not added into database");
        }
        yield session.commitTransaction();
        yield session.endSession();
        return bookAtable[0];
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(error);
    }
});
const getCustomerEventPayments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_model_1.EventPayment.find(query)
        .populate({
        path: "booking",
        select: "id date time",
    })
        .populate({
        path: "user",
        select: "phoneNumber fullName email",
    });
    return result;
});
exports.eventsServices = {
    insertEventIntoDb,
    getAllEvents,
    getSingleEvent,
    updateEvent,
    geteventForVendor,
    loadPaymentZoneForEvent,
    makePaymentForEvent,
    getCustomerEventPayments,
};
