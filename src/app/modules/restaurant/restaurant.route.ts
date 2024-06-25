import { Router } from "express";
import auth from "../../middleware/auth";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
import { USER_ROLE } from "../user/user.constant";
import { restauranntControllers } from "./restaurant.controller";
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
  "/dashboard",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  restauranntControllers.getAllRestaurants
);
router.get(
  "/admin",
  auth(USER_ROLE.admin),
  restauranntControllers.getAllRestaurantForAdmin
);
router.get(
  "/",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  restauranntControllers.getAllRestaurantsForUser
);
router.get(
  "/nearbyRestaurant",
  // auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  restauranntControllers.nearByRestaurant
);
router.get(
  "/admin",
  auth(USER_ROLE.vendor),
  restauranntControllers.getSingleRestaurantForOwner
);
router.get(
  "/owner/:id",
  auth(USER_ROLE.vendor),
  restauranntControllers.getSingleRestaurantForOwner
);
router.get(
  "/:id",
  // auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.user),
  restauranntControllers.getSingleRestaurant
);
router.patch(
  "/:id",
  upload.array("files"),
  parseData(),
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  restauranntControllers.updateRestaurant
);
router.delete(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  restauranntControllers.deleteRestaurant
);
router.patch(
  "/files/delete",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  restauranntControllers.deleteFiles
);

export const restaurantRoutes = router;
