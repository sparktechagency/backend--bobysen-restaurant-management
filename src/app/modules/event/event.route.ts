import { Router } from "express";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
import { USER_ROLE } from "../user/user.constant";
import { eventsController } from "./event.controller";

const router = Router();
export const paymentRoutes = Router();
router.post(
  "/",
  upload.array("files"),
  parseData(),
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  eventsController.insertEventsIntoDb
);
router.get(
  "/vendor",
  auth(USER_ROLE.vendor),
  eventsController.geteventForVendor
);
router.get("/", eventsController.getAllEvents);
router.get("/:id", eventsController.getSingleEvent);

router.patch(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin),
  eventsController.updateEvent
);
router.post(
  "/load-payment-zone",
  auth(USER_ROLE.user),
  eventsController.loadPaymentZoneForEvent
);
router.post(
  "/payment",
  auth(USER_ROLE.user),
  eventsController.loadPaymentZoneForEvent
);

paymentRoutes.get(
  "/",
  auth(USER_ROLE.admin),
  eventsController.getCustomerEventPayments
);

export const eventsRoutes = router;
