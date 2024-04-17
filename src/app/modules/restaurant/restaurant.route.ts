import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { restauranntControllers } from "./restaurant.controller";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
const upload = fileUpload("./public/uploads/restaurant/");
const router = Router();
router.post(
  "/",
  upload.array("files"),
  parseData(),
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  restauranntControllers.insertRestaurantIntDb
);
router.get(
  "/",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  restauranntControllers.getAllRestaurants
);
router.get(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  restauranntControllers.getSingleRestaurant
);
router.delete(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  restauranntControllers.deleteRestaurant
);

export const restaurantRoutes = router;
