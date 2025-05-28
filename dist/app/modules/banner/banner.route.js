"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUpload_1 = require("../../middleware/fileUpload");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const user_constant_1 = require("../user/user.constant");
const banner_controller_1 = require("./banner.controller");
const router = (0, express_1.Router)();
router.post("/", fileUpload_1.upload.single("file"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.admin), banner_controller_1.bannerControllers.insertBannerIntoDb);
router.get("/", banner_controller_1.bannerControllers.getAllBanner);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), banner_controller_1.bannerControllers.deleteBanner);
exports.bannerRoutes = router;
