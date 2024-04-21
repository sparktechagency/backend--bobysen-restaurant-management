import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { bookingControllers } from "./booking.controller";
const router = Router();
router.post(
  "/search-table",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.searchTableForBook
);
router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.getAllBooking
);
router.get(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.getSingleBooking
);
export const bookingRoutes = router;
