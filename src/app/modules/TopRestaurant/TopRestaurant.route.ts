import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { TopRestaurantControllers } from "./TopRestaurant.controller";
const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  TopRestaurantControllers.insertTopRestaurantIntoDb
);
router.get("/", TopRestaurantControllers.getAllTopRestaurants);
router.get("/mobile", TopRestaurantControllers.getAllTopRestaurantForTable);
router.get("/:id", TopRestaurantControllers.getSingleTopRestaurant);
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  TopRestaurantControllers.updateTopRestaurant
);
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  TopRestaurantControllers.deleteTopRestaurant
);

export const topRestaurantRoutes = router;
