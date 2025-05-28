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
exports.favoriteListControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const favouriteList_service_1 = require("./favouriteList.service");
const insertMenuintoFavriteList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.user);
    req.body.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield favouriteList_service_1.favoriteListServices.insertMenuIntoFavouriteList(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "menu added into favourite list",
        data: result,
    });
}));
const insertRestaurantIntoFavoriteList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield favouriteList_service_1.favoriteListServices.insertRestaurantIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "restaurant added into favourite list",
        data: result,
    });
}));
const getAllDataFromFavoriteList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.query.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield favouriteList_service_1.favoriteListServices.getAllDataFromFavoriteList(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "restaurant added into favourite list",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const removeMenuFromFavoriteList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favouriteList_service_1.favoriteListServices.removeMenuFromFavoriteList(req.params.id, req.body.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "item removed from favorite list",
        data: result,
    });
}));
const removeRestaurantFromList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favouriteList_service_1.favoriteListServices.removeRestaurantFromList(req.params.id, req.body.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "restaurant removed from favorite list",
        data: result,
    });
}));
const getsingleMenuFromFavouriteList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favouriteList_service_1.favoriteListServices.getSingleFavoriteDetailsByMenuId(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu retrieved successfully",
        data: result,
    });
}));
exports.favoriteListControllers = {
    insertMenuintoFavriteList,
    insertRestaurantIntoFavoriteList,
    getAllDataFromFavoriteList,
    removeMenuFromFavoriteList,
    removeRestaurantFromList,
    getsingleMenuFromFavouriteList,
};
