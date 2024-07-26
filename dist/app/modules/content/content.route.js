"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentRoues = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const content_controller_1 = require("./content.controller");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), content_controller_1.contentControllers.insertContentIntoDb);
router.get("/", content_controller_1.contentControllers.getContent);
exports.contentRoues = router;
