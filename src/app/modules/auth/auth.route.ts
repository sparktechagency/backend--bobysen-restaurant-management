import { Router } from "express";
import { authControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post("/login", authControllers.login);
router.post(
  "/change-password",
  auth(USER_ROLE.all),
  authControllers.changePassword
);
router.post("/forgot-password", authControllers.forgotPassword);
router.post("/verify-otp", authControllers.verifyOtp);
router.post("/reset-password", authControllers.resetPassword);
export const authRoutes = router;
