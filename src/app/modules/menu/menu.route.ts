import { Router } from "express";
import auth from "../../middleware/auth";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
import { USER_ROLE } from "../user/user.constant";
import { menuControllers, reviewControllers } from "./menu.controller";
const upload = fileUpload("./public/uploads/menu");
const router = Router();
router.post(
  "/",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.vendor),
  menuControllers.insertMenuIntoDb
);
router.get(
  "/owner",
  auth(USER_ROLE.vendor),
  menuControllers.getAllMenuForOwner
);
router.get(
  "/",
  auth(USER_ROLE.vendor, USER_ROLE.user, USER_ROLE.admin),
  menuControllers.getAllMenu
);
router.get(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.user, USER_ROLE.admin),
  menuControllers.getsingleMenu
);

router.patch(
  "/:id",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.vendor),
  menuControllers.updateMenu
);
router.delete("/:id", auth(USER_ROLE.vendor), menuControllers.deleteMenu);
router.post(
  "/review",
  auth(USER_ROLE.user),
  reviewControllers.insertReviewIntoDb
);
router.get(
  "/review/:id",
  // auth(USER_ROLE.user, USER_ROLE.vendor, USER_ROLE.admin),
  reviewControllers.getAllReviews
);

export const menuRoutes = router;
