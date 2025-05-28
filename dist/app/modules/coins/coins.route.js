"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinWithDrawRoutes = exports.coinRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const coins_controller_1 = require("./coins.controller");
const router = express_1.default.Router();
exports.coinRoutes = express_1.default.Router();
exports.coinRoutes.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user), coins_controller_1.coinController.getAllMyCoin);
router.post("/withdraw", (0, auth_1.default)(user_constant_1.USER_ROLE.user), coins_controller_1.coinWithDrawController.insertCoinWithDrawRequest);
router.get("/withdraw", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), coins_controller_1.coinWithDrawController.getAllCoinsWithdrawRequests);
router.get("/withdraw/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), coins_controller_1.coinWithDrawController.getSingleCoinsWithdrawRequest);
router.patch("/withdraw/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin), coins_controller_1.coinWithDrawController.updateCoinsWithdrawRequest);
exports.coinWithDrawRoutes = router;
