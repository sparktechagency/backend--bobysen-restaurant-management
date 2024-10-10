import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { bannerRoutes } from "../modules/banner/banner.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { cartRoutes } from "../modules/cart/cart.route";
import { coinRoutes, coinWithDrawRoutes } from "../modules/coins/coins.route";
import { contentRoues } from "../modules/content/content.route";
import { eventsRoutes } from "../modules/event/event.route";
import { favoriteLisRoutes } from "../modules/favoriteList/favouriteList.route";
import { menuRoutes, reviewrouter } from "../modules/menu/menu.route";
import { menuCategoryRoutes } from "../modules/menuCategory/menuCategory.route";
import { notificationRoutes } from "../modules/notification/notificaiton.route";
import { orderRoutes } from "../modules/order/order.route";
import { otpRoutes } from "../modules/otp/otp.routes";
import { restaurantRoutes } from "../modules/restaurant/restaurant.route";
import { tableRoutes } from "../modules/table/table.route";
import { topRestaurantRoutes } from "../modules/TopRestaurant/TopRestaurant.route";
import { userRoutes } from "../modules/user/user.route";
import { walletRoutes } from "../modules/wallet/wallet.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/coins",
    route: coinRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/restaurants",
    route: restaurantRoutes,
  },
  {
    path: "/topRestaurants",
    route: topRestaurantRoutes,
  },
  {
    path: "/menu-categories",
    route: menuCategoryRoutes,
  },
  {
    path: "/menu",
    route: menuRoutes,
  },
  {
    path: "/banner",
    route: bannerRoutes,
  },
  {
    path: "/reviews",
    route: reviewrouter,
  },
  {
    path: "/tables",
    route: tableRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
  {
    path: "/favoriteLists",
    route: favoriteLisRoutes,
  },
  {
    path: "/cart",
    route: cartRoutes,
  },
  {
    path: "/notifications",
    route: notificationRoutes,
  },
  {
    path: "/content",
    route: contentRoues,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
  {
    path: "/wallet",
    route: walletRoutes,
  },
  {
    path: "/events",
    route: eventsRoutes,
  },
  {
    path: "/coin",
    route: coinWithDrawRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
