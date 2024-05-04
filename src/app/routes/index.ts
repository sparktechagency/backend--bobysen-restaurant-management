import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { menuCategoryRoutes } from "../modules/menuCategory/menuCategory.route";
import { otpRoutes } from "../modules/otp/otp.routes";
import { restaurantRoutes } from "../modules/restaurant/restaurant.route";
import { menuRoutes } from "../modules/menu/menu.route";
import { tableRoutes } from "../modules/table/table.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { favoriteLisRoutes } from "../modules/favoriteList/favouriteList.route";
import { cartRoutes } from "../modules/cart/cart.route";
import { notificationRoutes } from "../modules/notification/notificaiton.route";
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
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/restaurants",
    route: restaurantRoutes,
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
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
