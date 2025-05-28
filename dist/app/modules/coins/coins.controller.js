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
exports.coinWithDrawController = exports.coinController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const coins_service_1 = require("./coins.service");
const getAllMyCoin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const result = yield coins_service_1.coinService.getAllMyCoin(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Points retrieved successfully",
        data: result,
    });
}));
//--------------------------------------
const insertCoinWithDrawRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coins_service_1.coinWithDrawServices.insertCoinWithDrawRequest(Object.assign(Object.assign({}, req.body), { customer: req.user.userId }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Redeem request sent successfully",
        data: result,
    });
}));
const getAllCoinsWithdrawRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = Object.assign({}, req.query);
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === "user")
        query["customer"] = req.user.userId;
    const result = yield coins_service_1.coinWithDrawServices.getAllCoinsWithdrawRequests(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Redeem request retrieved successfully",
        data: result,
    });
}));
const getSingleCoinsWithdrawRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coins_service_1.coinWithDrawServices.getSingleCoinsWithdrawRequest(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Redeem request retrieved successfully",
        data: result,
    });
}));
const updateCoinsWithdrawRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coins_service_1.coinWithDrawServices.updateCoinsWithdrawRequest(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Redeem request updated successfully",
        data: result,
    });
}));
exports.coinController = {
    getAllMyCoin,
};
exports.coinWithDrawController = {
    insertCoinWithDrawRequest,
    getAllCoinsWithdrawRequests,
    getSingleCoinsWithdrawRequest,
    updateCoinsWithdrawRequest,
};
