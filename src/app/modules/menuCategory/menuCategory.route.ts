import { Router } from "express";
import auth from "../../middleware/auth";
import { upload } from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
import { USER_ROLE } from "../user/user.constant";
import { categoryControllers } from "./menuCategory.controller";
const router = Router();

router.post(
  "/",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  categoryControllers.insertMenuCategoryIntoDb
);

router.get(
  "/owner-v2",
  auth(USER_ROLE.admin, USER_ROLE.vendor, USER_ROLE.user),
  categoryControllers.findAllCategory
);
router.get(
  "/",
  // auth(USER_ROLE.admin, USER_ROLE.vendor, USER_ROLE.user),
  categoryControllers.findAllCategory
);
router.get(
  "/:id",
  // auth(USER_ROLE.admin, USER_ROLE.vendor, USER_ROLE.user),
  categoryControllers.getSingleCategory
);
router.patch(
  "/:id",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  categoryControllers.updateMenuCategory
);

export const menuCategoryRoutes = router;
