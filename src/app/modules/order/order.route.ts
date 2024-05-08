import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { orderControllers } from "./order.controller";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.vendor),
  orderControllers.insertOrderIntoDB
);

export const orderRoutes = router;
