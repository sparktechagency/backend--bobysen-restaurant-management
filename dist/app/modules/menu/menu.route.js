"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRoutes = exports.reviewrouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUpload_1 = require("../../middleware/fileUpload");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const user_constant_1 = require("../user/user.constant");
const menu_controller_1 = require("./menu.controller");
const router = (0, express_1.Router)();
exports.reviewrouter = (0, express_1.Router)();
exports.reviewrouter.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user), menu_controller_1.reviewControllers.insertReviewIntoDb);
exports.reviewrouter.get("/:id", menu_controller_1.reviewControllers.getAllReviews);
exports.reviewrouter.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), menu_controller_1.reviewControllers.UpdateReview);
router.post("/", fileUpload_1.upload.single("file"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), menu_controller_1.menuControllers.insertMenuIntoDb);
router.get("/owner", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), menu_controller_1.menuControllers.getAllMenuForOwner);
router.get("/owner-v2", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), menu_controller_1.menuControllers.getAllMenu);
router.get("/", 
// auth(USER_ROLE.vendor, USER_ROLE.user, USER_ROLE.admin),
menu_controller_1.menuControllers.getAllMenu);
router.get("/:id", 
// auth(USER_ROLE.vendor, USER_ROLE.user, USER_ROLE.admin),
menu_controller_1.menuControllers.getsingleMenu);
router.patch("/:id", fileUpload_1.upload.single("file"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), menu_controller_1.menuControllers.updateMenu);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), menu_controller_1.menuControllers.deleteMenu);
router.post("/review", (0, auth_1.default)(user_constant_1.USER_ROLE.user), menu_controller_1.reviewControllers.insertReviewIntoDb);
router.get("/review/:id", 
// auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
menu_controller_1.reviewControllers.getAllReviews);
exports.menuRoutes = router;
