"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteLisRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const favoriteList_controller_1 = require("./favoriteList.controller");
const router = (0, express_1.Router)();
router.post("/menu", (0, auth_1.default)(user_constant_1.USER_ROLE.user), favoriteList_controller_1.favoriteListControllers.insertMenuintoFavriteList);
router.post("/restaurants", (0, auth_1.default)(user_constant_1.USER_ROLE.user), favoriteList_controller_1.favoriteListControllers.insertRestaurantIntoFavoriteList);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user), favoriteList_controller_1.favoriteListControllers.getAllDataFromFavoriteList);
router.get("/menu/:id", favoriteList_controller_1.favoriteListControllers.getsingleMenuFromFavouriteList);
router.patch("/menu/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user), favoriteList_controller_1.favoriteListControllers.removeMenuFromFavoriteList);
router.patch("/restaurant/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.user), favoriteList_controller_1.favoriteListControllers.removeRestaurantFromList);
exports.favoriteLisRoutes = router;
