"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const cart_controller_1 = require("./cart.controller");
const router = (0, express_1.Router)();
router.post("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), cart_controller_1.cartControllers.insertItemIntoCart);
router.get("/my-orders", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), cart_controller_1.cartControllers.getMYOrders);
router.get("/details/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), cart_controller_1.cartControllers.getSingleCartItemsUsingId);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), cart_controller_1.cartControllers.getCartItems);
router.get("/my-orders", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), cart_controller_1.cartControllers.getMYOrders);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), cart_controller_1.cartControllers.removeItemFromCart);
exports.cartRoutes = router;
