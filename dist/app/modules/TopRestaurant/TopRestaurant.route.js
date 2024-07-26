"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topRestaurantRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const TopRestaurant_controller_1 = require("./TopRestaurant.controller");
const router = (0, express_1.Router)();
router.post("/", 
// auth(USER_ROLE.admin),
TopRestaurant_controller_1.TopRestaurantControllers.insertTopRestaurantIntoDb);
router.get("/", TopRestaurant_controller_1.TopRestaurantControllers.getAllTopRestaurants);
router.get("/:id", TopRestaurant_controller_1.TopRestaurantControllers.getSingleTopRestaurant);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), TopRestaurant_controller_1.TopRestaurantControllers.updateTopRestaurant);
router.patch("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), TopRestaurant_controller_1.TopRestaurantControllers.deleteTopRestaurant);
exports.topRestaurantRoutes = router;
