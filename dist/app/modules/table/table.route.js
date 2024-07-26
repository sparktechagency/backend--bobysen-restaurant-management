"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const table_controller_1 = require("./table.controller");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), table_controller_1.tableControllers.insertTableIntoDb);
router.get("/owner", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), table_controller_1.tableControllers.getVendorAllTables);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), table_controller_1.tableControllers.getAllTables);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), table_controller_1.tableControllers.getSingleTable);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), table_controller_1.tableControllers.updateTable);
exports.tableRoutes = router;
