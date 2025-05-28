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
exports.categoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const spaces_1 = require("../../utils/spaces");
const menuCategory_service_1 = require("./menuCategory.service");
const insertMenuCategoryIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "category");
    }
    req.body.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield menuCategory_service_1.menuCategoryServices.insertMenuCategoryIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "category added successfully",
        data: result,
    });
}));
const findAllCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const query = Object.assign({}, req.query);
    if (((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.role) === "vendor")
        query["user"] = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const result = yield menuCategory_service_1.menuCategoryServices.findAllCategory(query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "categories retrieved successfully",
        data: result,
    });
}));
const updateMenuCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "category");
    }
    const result = yield menuCategory_service_1.menuCategoryServices.updateMenuCategory(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "category updated successfully",
        data: result,
    });
}));
const getSingleCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "category");
    }
    const result = yield menuCategory_service_1.menuCategoryServices.getSingleCategory(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category retrieved successfully",
        data: result,
    });
}));
exports.categoryControllers = {
    insertMenuCategoryIntoDb,
    getSingleCategory,
    findAllCategory,
    updateMenuCategory,
};
