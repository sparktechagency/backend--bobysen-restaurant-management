import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { categoryControllers } from "./menuCategory.controller";
const router = Router();

router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  categoryControllers.insertMenuCategoryIntoDb
);

router.get("/", categoryControllers.findAllCategory);
router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  categoryControllers.updateMenuCategory
);

export const menuCategoryRoutes = router;
