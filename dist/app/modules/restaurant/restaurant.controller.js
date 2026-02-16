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
exports.restauranntControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const spaces_1 = require("../../utils/spaces");
const restaurant_service_1 = require("./restaurant.service");
const insertRestaurantIntDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const images = [];
    if ((req === null || req === void 0 ? void 0 : req.files) instanceof Array) {
        for (const file of req === null || req === void 0 ? void 0 : req.files) {
            images.push({ url: yield (0, spaces_1.uploadToSpaces)(file, 'restaurant') });
        }
    }
    req.body.owner = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    req.body.images = images;
    const result = yield restaurant_service_1.restaurantServices.insertRestaurantIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant added successfully',
        data: result,
    });
    return result;
}));
const getAllRestaurants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = Object.assign({}, req.query);
    query['owner'] = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield restaurant_service_1.restaurantServices.getAllRestaurant(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurants retrieved successfully',
        data: result,
    });
    return result;
}));
const getAllRestaurantsForUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = Object.assign({}, req.query);
    if (!((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.limit)) {
        query['limit'] = 99;
    }
    const result = yield restaurant_service_1.restaurantServices.getAllRestaurantsForUser(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurants retrieved successfully',
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
    return result;
}));
const getSingleRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantServices.getSingleRestaurant(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant retrieved successfully',
        data: result,
    });
    return result;
}));
const updateRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const images = [];
    if ((req === null || req === void 0 ? void 0 : req.files) instanceof Array) {
        for (const file of req === null || req === void 0 ? void 0 : req.files) {
            images.push({ url: yield (0, spaces_1.uploadToSpaces)(file, 'restaurant') });
        }
    }
    req.body.images = images;
    const result = yield restaurant_service_1.restaurantServices.updateRestaurant(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant updated successfully',
        data: result,
    });
    return result;
}));
const deleteRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantServices.deleteRestaurant(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant deleted successfully',
        data: result,
    });
    return result;
}));
const deleteFiles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantServices.deleteFiles(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Image deleted successfully',
        data: result,
    });
    return result;
}));
const getSingleRestaurantForOwner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantServices.getSingleRestaurantForOwner(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant retrieved successfully',
        data: result,
    });
    return result;
}));
const getAllRestaurantForAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantServices.getAllRestaurantForAdmin(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant retrieved successfully',
        data: result,
    });
    return result;
}));
const nearByRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantServices.nearByRestaurant(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant retrieved successfully',
        data: result,
    });
    return result;
}));
const getAllRestaurantId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Object.assign({}, req.query);
    query['owner'] = req.user.userId;
    const result = yield restaurant_service_1.restaurantServices.getAllRestaurantId(Object.assign(Object.assign({}, query), { status: 'active' }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant retrieved successfully',
        data: result,
    });
    return result;
}));
const changeRestaurantStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield restaurant_service_1.restaurantServices.changeRestaurantStatus(req.params.id, (_a = req.body) === null || _a === void 0 ? void 0 : _a.status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restaurant status changed successfully',
        data: result,
    });
    return result;
}));
exports.restauranntControllers = {
    insertRestaurantIntDb,
    getAllRestaurants,
    getSingleRestaurantForOwner,
    getAllRestaurantsForUser,
    updateRestaurant,
    getSingleRestaurant,
    deleteRestaurant,
    deleteFiles,
    getAllRestaurantForAdmin,
    nearByRestaurant,
    getAllRestaurantId,
    changeRestaurantStatus,
};
