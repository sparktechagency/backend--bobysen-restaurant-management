import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { categoryControllers } from "./menuCategory.controller";
import fileUpload from "../../middleware/fileUpload";
import parseData from "../../middleware/parseData";
const router = Router();
const upload = fileUpload("./public/uploads/category");
router.post(
  "/",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  categoryControllers.insertMenuCategoryIntoDb
);

router.get("/", categoryControllers.findAllCategory);
router.patch(
  "/:id",
  upload.single("file"),
  parseData(),
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  categoryControllers.updateMenuCategory
);

export const menuCategoryRoutes = router;
