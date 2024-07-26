"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post("/decrypt-data", order_controller_1.orderControllers.getimnCallback);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), order_controller_1.orderControllers.insertOrderIntoDB);
exports.orderRoutes = router;
