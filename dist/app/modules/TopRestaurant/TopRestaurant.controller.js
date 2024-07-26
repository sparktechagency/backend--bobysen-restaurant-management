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
exports.TopRestaurantControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const TopRestaurant_service_1 = require("./TopRestaurant.service");
const insertTopRestaurantIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_service_1.topRestaurantServices.insertTopRestaurantIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Restaurants added successfully",
        data: result,
    });
    return result;
}));
const getAllTopRestaurants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_service_1.topRestaurantServices.getAllTopRestaurants(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Restaurants retrived successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
    return result;
}));
const getSingleTopRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_service_1.topRestaurantServices.getSingleTopRestaurant(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Restaurant retrived successfully",
        data: result,
    });
    return result;
}));
const updateTopRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_service_1.topRestaurantServices.updateTopRestaurant(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Restaurant updated successfully",
        data: result,
    });
    return result;
}));
const deleteTopRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield TopRestaurant_service_1.topRestaurantServices.deleteTopRestaurantFromList(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Restaurant deleted successfully",
        data: result,
    });
    return result;
}));
exports.TopRestaurantControllers = {
    insertTopRestaurantIntoDb,
    getAllTopRestaurants,
    getSingleTopRestaurant,
    updateTopRestaurant,
    deleteTopRestaurant,
};
