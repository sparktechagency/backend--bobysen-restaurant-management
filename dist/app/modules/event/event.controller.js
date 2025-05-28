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
exports.eventsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const spaces_1 = require("../../utils/spaces");
const event_service_1 = require("./event.service");
const insertEventsIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = Object.assign({}, req.body);
    const images = [];
    if ((req === null || req === void 0 ? void 0 : req.files) instanceof Array) {
        for (const file of req === null || req === void 0 ? void 0 : req.files) {
            images.push({ url: yield (0, spaces_1.uploadToSpaces)(file, "event") });
        }
    }
    data["images"] = images;
    const result = yield event_service_1.eventsServices.insertEventIntoDb(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Event added successfully",
        data: result,
    });
}));
const getAllEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const result = yield event_service_1.eventsServices.getAllEvents(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "events retrieved successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const getSingleEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_service_1.eventsServices.getSingleEvent(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "event retrieved successfully",
        data: result,
    });
}));
const geteventForVendor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_service_1.eventsServices.geteventForVendor(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "event retrieved successfully",
        data: result,
    });
}));
const updateEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_service_1.eventsServices.updateEvent(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "event updated successfully",
        data: result,
    });
}));
const loadPaymentZoneForEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = Object.assign({}, req.body);
    data["user"] = req.user.userId;
    data["token"] = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const result = yield event_service_1.eventsServices.loadPaymentZoneForEvent(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "load payment zone retrieved successfully",
        data: result,
    });
}));
const makePaymentForEvent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_service_1.eventsServices.makePaymentForEvent(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Table Booked successfully",
        data: result,
    });
}));
const getCustomerEventPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_service_1.eventsServices.getCustomerEventPayments(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Event payment retrieved successfully",
        data: result,
    });
}));
exports.eventsController = {
    insertEventsIntoDb,
    getAllEvents,
    getSingleEvent,
    geteventForVendor,
    updateEvent,
    loadPaymentZoneForEvent,
    makePaymentForEvent,
    getCustomerEventPayments,
};
