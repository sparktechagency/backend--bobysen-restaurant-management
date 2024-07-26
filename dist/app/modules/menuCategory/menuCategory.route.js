"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuCategoryRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const user_constant_1 = require("../user/user.constant");
const menuCategory_controller_1 = require("./menuCategory.controller");
const router = (0, express_1.Router)();
const upload = (0, fileUpload_1.default)("./public/uploads/category");
router.post("/", upload.single("file"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), menuCategory_controller_1.categoryControllers.insertMenuCategoryIntoDb);
router.get("/", 
// auth(USER_ROLE.admin, USER_ROLE.vendor, USER_ROLE.user),
menuCategory_controller_1.categoryControllers.findAllCategory);
router.get("/:id", 
// auth(USER_ROLE.admin, USER_ROLE.vendor, USER_ROLE.user),
menuCategory_controller_1.categoryControllers.getSingleCategory);
router.patch("/:id", upload.single("file"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), menuCategory_controller_1.categoryControllers.updateMenuCategory);
exports.menuCategoryRoutes = router;
