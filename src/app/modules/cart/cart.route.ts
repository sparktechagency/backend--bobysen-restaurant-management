import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { cartControllers } from "./cart.controller";

const router = Router();
router.post(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  cartControllers.insertItemIntoCart
);
router.get(
  "/my-orders",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  cartControllers.getMYOrders
);
router.get(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  cartControllers.getCartItems
);
router.get(
  "/my-orders",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  cartControllers.getMYOrders
);
router.patch(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  cartControllers.removeItemFromCart
);
export const cartRoutes = router;
