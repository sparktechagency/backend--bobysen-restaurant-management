import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "../user/user.constant";
import { categoryController } from "./category.controller";
import getCategoryValidation from "./category.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(getCategoryValidation.createCategoryValidation),
  auth(USER_ROLE.admin),
  categoryController.createCategory
);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getSingleCategory);
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(getCategoryValidation.createCategoryValidation),
  categoryController.updateCategory
);

export default router;
