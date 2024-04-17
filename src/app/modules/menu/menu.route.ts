import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { menuControllers } from "./menu.controller";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
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
  "/",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.admin),
  menuControllers.getAllMenu
);
router.get(
  "/:id",
  auth(USER_ROLE.vendor, USER_ROLE.admin, USER_ROLE.admin),
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

export const menuRoutes = router;
