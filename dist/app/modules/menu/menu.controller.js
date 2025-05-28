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
exports.reviewControllers = exports.menuControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const spaces_1 = require("../../utils/spaces");
const menu_service_1 = require("./menu.service");
const insertMenuIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "menu");
    }
    req.body.owner = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield menu_service_1.menuServices.insertMenuIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu added successfully",
        data: result,
    });
}));
const getAllMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const query = Object.assign({}, req.query);
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === "vendor") {
        req.query.owner = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId;
    }
    else if (((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.role) === "user") {
        query["available"] = true;
    }
    const result = yield menu_service_1.menuServices.getAllMenu(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu retrieved successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const getAllMenuForOwner = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield menu_service_1.menuServices.getAllTablesForOwner((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu retrieved successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const getsingleMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield menu_service_1.menuServices.getSingleMenu(req.params.id, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu retrieved successfully",
        data: result,
    });
}));
const updateMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "menu");
    }
    const result = yield menu_service_1.menuServices.updateMenu(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu updated successfully",
        data: result,
    });
}));
const deleteMenu = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "menu");
    }
    const result = yield menu_service_1.menuServices.deleteMenu(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Menu deleted successfully",
        data: result,
    });
}));
// ------------------------- review part-------------------------------
const insertReviewIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield menu_service_1.reviewServices.insertReviewIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Thank you for your valuable feedback",
        data: result,
    });
}));
const getAllReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menu_service_1.reviewServices.getAllReviews(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reviews retrieved successfully",
        data: result,
    });
}));
const UpdateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield menu_service_1.reviewServices.updateReviews(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reviews updated successfully",
        data: result,
    });
}));
exports.menuControllers = {
    insertMenuIntoDb,
    getAllMenu,
    getsingleMenu,
    getAllMenuForOwner,
    updateMenu,
    deleteMenu,
};
exports.reviewControllers = {
    insertReviewIntoDb,
    getAllReviews,
    UpdateReview,
};
