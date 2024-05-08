import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { walletControllers } from "./wallet.controller";

const router = Router();

router.post(
  "/:id",
  auth(USER_ROLE.admin),
  walletControllers.sentAmountToTheVendor
);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.vendor),
  walletControllers.getWalletDetails
);

export const walletRoutes = router;
