"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const wallet_controller_1 = require("./wallet.controller");
const router = (0, express_1.Router)();
router.post("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), wallet_controller_1.walletControllers.sentAmountToTheVendor);
router.get("/admin", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), wallet_controller_1.walletControllers.getwalletDetailsByOwner);
router.get("/admin/statics", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), wallet_controller_1.walletControllers.getWalletStatics);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), wallet_controller_1.walletControllers.getWalletDetails);
router.get("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.vendor), wallet_controller_1.walletControllers.getSingleWallet);
exports.walletRoutes = router;
