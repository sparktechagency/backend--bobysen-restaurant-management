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
exports.notificationRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
// router.post("/",)
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), notification_controller_1.notificationControllers.getAllNotification);
router.patch("/", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), notification_controller_1.notificationControllers.markAsDone);
router.get("/get-payment-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
    }
    catch (error) { }
}));
exports.notificationRoutes = router;
