import { Router } from "express";
import { authControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post("/login", authControllers.login);
router.patch(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.vendor, USER_ROLE.user),
  authControllers.changePassword
);
router.patch("/forgot-password", authControllers.forgotPassword);
router.patch("/reset-password", authControllers.resetPassword);
export const authRoutes = router;
