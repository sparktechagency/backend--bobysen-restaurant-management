import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { favoriteListControllers } from "./favoriteList.controller";

const router = Router();
router.post(
  "/menu",
  auth(USER_ROLE.user),
  favoriteListControllers.insertMenuintoFavriteList
);
router.post(
  "/restaurants",
  auth(USER_ROLE.user),
  favoriteListControllers.insertRestaurantIntoFavoriteList
);
router.get(
  "/",
  auth(USER_ROLE.user),
  favoriteListControllers.getAllDataFromFavoriteList
);
router.get(
  "/:id",
  auth(USER_ROLE.user),
  favoriteListControllers.removedataFromFavoriteList
);
export const favoriteLisRoutes = router;
