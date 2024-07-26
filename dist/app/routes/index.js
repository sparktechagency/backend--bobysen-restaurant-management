"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const booking_route_1 = require("../modules/booking/booking.route");
const cart_route_1 = require("../modules/cart/cart.route");
const content_route_1 = require("../modules/content/content.route");
const favouriteList_route_1 = require("../modules/favoriteList/favouriteList.route");
const menu_route_1 = require("../modules/menu/menu.route");
const menuCategory_route_1 = require("../modules/menuCategory/menuCategory.route");
const notificaiton_route_1 = require("../modules/notification/notificaiton.route");
const order_route_1 = require("../modules/order/order.route");
const otp_routes_1 = require("../modules/otp/otp.routes");
const restaurant_route_1 = require("../modules/restaurant/restaurant.route");
const table_route_1 = require("../modules/table/table.route");
const TopRestaurant_route_1 = require("../modules/TopRestaurant/TopRestaurant.route");
const user_route_1 = require("../modules/user/user.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/otp",
        route: otp_routes_1.otpRoutes,
    },
    {
        path: "/restaurants",
        route: restaurant_route_1.restaurantRoutes,
    },
    {
        path: "/topRestaurants",
        route: TopRestaurant_route_1.topRestaurantRoutes,
    },
    {
        path: "/menu-categories",
        route: menuCategory_route_1.menuCategoryRoutes,
    },
    {
        path: "/menu",
        route: menu_route_1.menuRoutes,
    },
    {
        path: "/reviews",
        route: menu_route_1.reviewrouter,
    },
    {
        path: "/tables",
        route: table_route_1.tableRoutes,
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRoutes,
    },
    {
        path: "/favoriteLists",
        route: favouriteList_route_1.favoriteLisRoutes,
    },
    {
        path: "/cart",
        route: cart_route_1.cartRoutes,
    },
    {
        path: "/notifications",
        route: notificaiton_route_1.notificationRoutes,
    },
    {
        path: "/content",
        route: content_route_1.contentRoues,
    },
    {
        path: "/orders",
        route: order_route_1.orderRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.walletRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
