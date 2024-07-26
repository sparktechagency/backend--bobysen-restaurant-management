"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const fileUpload_1 = __importDefault(require("../../middleware/fileUpload"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const user_constant_1 = require("../user/user.constant");
const restaurant_controller_1 = require("./restaurant.controller");
const upload = (0, fileUpload_1.default)("./public/uploads/restaurant/");
const router = (0, express_1.Router)();
router.post("/", upload.array("files"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), restaurant_controller_1.restauranntControllers.insertRestaurantIntDb);
router.get("/dashboard", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), restaurant_controller_1.restauranntControllers.getAllRestaurants);
router.get("/admin", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), restaurant_controller_1.restauranntControllers.getAllRestaurantForAdmin);
router.get("/", 
// auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
restaurant_controller_1.restauranntControllers.getAllRestaurantsForUser);
router.get("/nearbyRestaurant", 
// auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
restaurant_controller_1.restauranntControllers.nearByRestaurant);
router.get("/admin", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), restaurant_controller_1.restauranntControllers.getSingleRestaurantForOwner);
router.get("/owner/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor), restaurant_controller_1.restauranntControllers.getSingleRestaurantForOwner);
router.get("/:id", 
// auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
restaurant_controller_1.restauranntControllers.getSingleRestaurant);
router.patch("/:id", upload.array("files"), (0, parseData_1.default)(), (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), restaurant_controller_1.restauranntControllers.updateRestaurant);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), restaurant_controller_1.restauranntControllers.deleteRestaurant);
router.patch("/files/delete", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin), restaurant_controller_1.restauranntControllers.deleteFiles);
exports.restaurantRoutes = router;
