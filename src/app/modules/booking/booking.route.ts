import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { bookingControllers } from "./booking.controller";
import moment from "moment";
const router = Router();
router.post(
  "/",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.bookAtable
);

router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.getAllBooking
);
router.get(
  "/details/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.getBookingDetailsWithMenu
);
router.get(
  "/owner",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.getAllBookingByOwner
);
router.get(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.getSingleBooking
);
router.patch(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.updatebooking
);
router.delete(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  bookingControllers.updatebooking
);

export const bookingRoutes = router;
