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
exports.userControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const spaces_1 = require("../../utils/spaces");
const user_service_1 = require("./user.service");
const insertuserIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req?.file) {
    //   req.body.image = storeFile("profile", req?.file?.filename);
    // }
    const result = yield user_service_1.userServices.insertUserIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "user created successfully",
        data: result,
    });
}));
const insertVendorIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.role = "vendor";
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "profile");
    }
    const result = yield user_service_1.userServices.insertVendorIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "vendor created successfully",
        data: result,
    });
}));
const getme = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getme(req.user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "user retrieved successfully",
        data: result,
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "profile");
    }
    const result = yield user_service_1.userServices.updateProfile(req.user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "user profile updated successfully",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getAllusers(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "users retrieved successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const getsingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getSingleUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.image = yield (0, spaces_1.uploadToSpaces)(req === null || req === void 0 ? void 0 : req.file, "profile");
    }
    console.log(req.body);
    const result = yield user_service_1.userServices.updateUser(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: result,
    });
}));
const deleteAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield user_service_1.userServices.deleteAccount((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
}));
const insertUserIntoDbFromWidget = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.insertUserIntoDbFromWidget(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User created successfully",
        data: result,
    });
}));
exports.userControllers = {
    insertuserIntoDb,
    insertVendorIntoDb,
    getme,
    updateProfile,
    getAllUsers,
    getsingleUser,
    updateUser,
    deleteAccount,
    insertUserIntoDbFromWidget,
};
