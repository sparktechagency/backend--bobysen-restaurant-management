import { Router } from "express";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();
router.post("/", auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.vendor));

export const orderRoutes = router;
