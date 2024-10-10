import express from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { coinController, coinWithDrawController } from "./coins.controller";

const router = express.Router();
export const coinRoutes = express.Router();
coinRoutes.get("/", auth(USER_ROLE.user), coinController.getAllMyCoin);
router.post(
  "/withdraw",
  auth(USER_ROLE.user),
  coinWithDrawController.insertCoinWithDrawRequest
);
router.get(
  "/withdraw",
  auth(USER_ROLE.user, USER_ROLE.admin),
  coinWithDrawController.getAllCoinsWithdrawRequests
);
router.get(
  "/withdraw/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  coinWithDrawController.getSingleCoinsWithdrawRequest
);
router.patch(
  "/withdraw/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  coinWithDrawController.updateCoinsWithdrawRequest
);

export const coinWithDrawRoutes = router;
