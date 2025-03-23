import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { otpControllers } from "./otp.controller";
const router = Router();

router.post("/verify-otp", otpControllers.verifyOtp);
router.post("/resend-otp", otpControllers.resendOtp);
router.post(
  "/verify/reservation",
  auth(USER_ROLE.user),
  otpControllers.verifyOtpForWidget
);

export const otpRoutes = router;
